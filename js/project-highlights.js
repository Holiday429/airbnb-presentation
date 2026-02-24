document.addEventListener('DOMContentLoaded', () => {
  // LINE_SCALE: extend each dashed line 30% beyond circle centre
  const LINE_SCALE = 1.3;

  function layoutCollab(diagram) {
    if (!diagram) return;
    const W = diagram.offsetWidth;
    if (!W) return;

    // 4-corner rectangle layout (Program 2)
    if (diagram.querySelector('.collab-node--tl')) {
      layout4Corner(diagram, W);
      return;
    }

    // ── Responsive sizes ──────────────────────────────────────────────────
    const D         = Math.round(Math.max(80, Math.min(W * 0.32, 200)));
    const expandedD = Math.round(D * (264 / 160));   // preserves 264/160 ratio
    const deltaR    = (expandedD - D) / 2;

    // Safe gaps: top circle won't clip h4; bottom circles stay above divider
    const TOP_OFFSET = Math.max(40, expandedD - D - 14) + 15;
    const BOTTOM_PAD = Math.round(deltaR * 1.5) + 4;

    // Publish CSS custom properties so all children scale automatically
    diagram.style.setProperty('--circle-d',   D + 'px');
    diagram.style.setProperty('--expanded-d', expandedD + 'px');
    diagram.style.setProperty('--font-name',  Math.max(10, Math.round(D * 0.08125)) + 'px');
    diagram.style.setProperty('--font-item',  Math.max(11, Math.round(D * 0.0875))  + 'px');

    // ── Equilateral triangle geometry ─────────────────────────────────────
    const L      = W - D;                           // base between circle centres
    const h      = L * Math.sqrt(3) / 2;            // equilateral height
    const totalH = Math.ceil(D + h + TOP_OFFSET + BOTTOM_PAD);

    diagram.style.height = totalH + 'px';

    const cx     = W / 2;
    const topY   = D / 2 + TOP_OFFSET;              // top vertex shifted down
    const botY   = topY + h;
    const leftX  = D / 2;
    const rightX = W - D / 2;
    const centY  = (topY + botY + botY) / 3;        // centroid y

    // ── Position nodes ────────────────────────────────────────────────────
    const topNode = diagram.querySelector('.collab-node--top');
    const blNode  = diagram.querySelector('.collab-node--bl');
    const brNode  = diagram.querySelector('.collab-node--br');
    const meEl    = diagram.querySelector('.collab-me');

    if (topNode) Object.assign(topNode.style, {
      left: cx + 'px', top: topY + 'px', transform: 'translate(-50%, -50%)', bottom: 'auto', right: 'auto'
    });
    if (blNode) Object.assign(blNode.style, {
      left: leftX + 'px', top: botY + 'px', transform: 'translate(-50%, -50%)', bottom: 'auto', right: 'auto'
    });
    if (brNode) Object.assign(brNode.style, {
      left: rightX + 'px', top: botY + 'px', transform: 'translate(-50%, -50%)', bottom: 'auto', right: 'auto'
    });
    if (meEl) Object.assign(meEl.style, {
      left: cx + 'px', top: centY + 'px', transform: 'translate(-50%, -50%)'
    });

    // ── Outward expand offsets (keeps visible line length constant on expand) ──
    [
      { node: topNode, vx: cx,     vy: topY },
      { node: blNode,  vx: leftX,  vy: botY },
      { node: brNode,  vx: rightX, vy: botY },
    ].forEach(({ node, vx, vy }) => {
      if (!node) return;
      const dx   = vx - cx;
      const dy   = vy - centY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      node.style.setProperty('--expand-x', Math.round((dx / dist) * deltaR) + 'px');
      node.style.setProperty('--expand-y', Math.round((dy / dist) * deltaR) + 'px');
    });

    // ── SVG dashed lines ──────────────────────────────────────────────────
    const svg = diagram.querySelector('.collab-svg-lines');
    if (svg) {
      svg.setAttribute('width', W);
      svg.setAttribute('height', totalH);
      svg.setAttribute('viewBox', `0 0 ${W} ${totalH}`);
      const lines = svg.querySelectorAll('line');
      [{ x: cx, y: topY }, { x: leftX, y: botY }, { x: rightX, y: botY }]
        .forEach((v, i) => {
          if (!lines[i]) return;
          lines[i].setAttribute('x1', cx);    lines[i].setAttribute('y1', centY);
          // Extend 30% beyond circle centre so the visible dashed line is longer
          lines[i].setAttribute('x2', cx    + LINE_SCALE * (v.x - cx));
          lines[i].setAttribute('y2', centY + LINE_SCALE * (v.y - centY));
        });
    }
  }

  function layout4Corner(diagram, W) {
    const D         = Math.round(Math.max(80, Math.min(W * 0.32, 200)));
    const expandedD = Math.round(D * (264 / 160));
    const deltaR    = (expandedD - D) / 2;

    diagram.style.setProperty('--circle-d',   D + 'px');
    diagram.style.setProperty('--expanded-d', expandedD + 'px');
    diagram.style.setProperty('--font-name',  Math.max(10, Math.round(D * 0.08125)) + 'px');
    diagram.style.setProperty('--font-item',  Math.max(11, Math.round(D * 0.0875))  + 'px');

    const TOP_OFFSET = Math.max(50, expandedD - D) + 20;
    const BOTTOM_PAD = Math.round(deltaR * 1.5) + 4;
    const leftX  = D / 2;
    const rightX = W - D / 2;
    const topY   = D / 2 + TOP_OFFSET;
    const rectH  = (rightX - leftX) * 0.65;
    const botY   = topY + rectH;
    const cx     = W / 2;
    const centY  = (topY + botY) / 2;
    const totalH = Math.ceil(botY + D / 2 + BOTTOM_PAD);

    diagram.style.height = totalH + 'px';

    const tlNode = diagram.querySelector('.collab-node--tl');
    const trNode = diagram.querySelector('.collab-node--tr');
    const blNode = diagram.querySelector('.collab-node--bl');
    const brNode = diagram.querySelector('.collab-node--br');
    const meEl   = diagram.querySelector('.collab-me');

    const setPos = (el, x, y) => {
      if (!el) return;
      Object.assign(el.style, { left: x + 'px', top: y + 'px', transform: 'translate(-50%, -50%)', bottom: 'auto', right: 'auto' });
    };
    setPos(tlNode, leftX,  topY);
    setPos(trNode, rightX, topY);
    setPos(blNode, leftX,  botY);
    setPos(brNode, rightX, botY);
    setPos(meEl,   cx,     centY);

    [
      { node: tlNode, vx: leftX,  vy: topY },
      { node: trNode, vx: rightX, vy: topY },
      { node: blNode, vx: leftX,  vy: botY },
      { node: brNode, vx: rightX, vy: botY },
    ].forEach(({ node, vx, vy }) => {
      if (!node) return;
      const dx   = vx - cx;
      const dy   = vy - centY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      node.style.setProperty('--expand-x', Math.round((dx / dist) * deltaR) + 'px');
      node.style.setProperty('--expand-y', Math.round((dy / dist) * deltaR) + 'px');
    });

    const svg = diagram.querySelector('.collab-svg-lines');
    if (svg) {
      svg.setAttribute('width', W);
      svg.setAttribute('height', totalH);
      svg.setAttribute('viewBox', `0 0 ${W} ${totalH}`);
      const lines = svg.querySelectorAll('line');
      [{ x: leftX, y: topY }, { x: rightX, y: topY }, { x: leftX, y: botY }, { x: rightX, y: botY }]
        .forEach((v, i) => {
          if (!lines[i]) return;
          lines[i].setAttribute('x1', cx);
          lines[i].setAttribute('y1', centY);
          lines[i].setAttribute('x2', cx     + LINE_SCALE * (v.x - cx));
          lines[i].setAttribute('y2', centY  + LINE_SCALE * (v.y - centY));
        });
    }
  }

  // Trigger layout whenever My Role slide (data-step="2") becomes visible
  document.querySelectorAll('.deck-slide[data-step="2"]').forEach(slide => {
    const diagram = slide.querySelector('.collab-diagram');
    if (!diagram) return;
    const run = () => { if (slide.classList.contains('is-active')) layoutCollab(diagram); };
    new MutationObserver(run).observe(slide, { attributes: true, attributeFilter: ['class'] });
    if (window.ResizeObserver) new ResizeObserver(run).observe(diagram);
  });

  // ── Collab node click — expand outward; click again to collapse ──
  document.querySelectorAll('.collab-node').forEach(node => {
    node.addEventListener('click', () => {
      const deck = node.closest('.project-deck');

      // Already active → toggle off (collapse back)
      if (node.classList.contains('is-active')) {
        node.classList.remove('is-active');
        if (deck && deck._actionHistory) {
          const hist = deck._actionHistory;
          for (let i = hist.length - 1; i >= 0; i--) {
            if (hist[i].type === 'collab-node' && hist[i].node === node) {
              hist.splice(i, 1);
              break;
            }
          }
          if (deck._updateBackButton) deck._updateBackButton();
        }
        return;
      }

      // Mid-click animation — ignore
      if (node.classList.contains('is-clicking')) return;

      // Step 1: coral border flash
      node.classList.add('is-clicking');

      // Push to deck undo history
      if (deck && deck._actionHistory) {
        deck._actionHistory.push({ type: 'collab-node', node });
        if (deck._updateBackButton) deck._updateBackButton();
      }

      // Step 2: morph to card
      setTimeout(() => {
        node.classList.remove('is-clicking');
        node.classList.add('is-active');
      }, 300);
    });
  });

  // ── Program 1 Impact Cards – click-to-animate ────────────────────────────
  function animateP1Card(card) {
    if (card.dataset.state !== 'idle') return;

    const numEl      = card.querySelector('.p1-card-number');
    const from        = parseFloat(numEl.dataset.from);
    const to          = parseFloat(numEl.dataset.to);
    const decimal     = parseInt(numEl.dataset.decimal || '0', 10);
    const suffix      = numEl.dataset.suffix || '';
    const suffixFinal = numEl.dataset.suffixFinal || null;
    const initialText = numEl.textContent.trim();

    // Push to deck undo history so Back button can revert
    const deck = card.closest('.project-deck');
    if (deck && deck._actionHistory) {
      deck._actionHistory.push({ type: 'p1-outcome', card, numEl, initialText });
      if (deck._updateBackButton) deck._updateBackButton();
    }

    // Trigger card expansion immediately
    card.dataset.state = 'animating';

    // Start number count-up after a short delay (syncs with expansion animation)
    const duration  = 1000;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    setTimeout(() => {
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value    = from + (to - from) * easeOutCubic(progress);
        const display  = value.toFixed(decimal);

        if (progress < 1) {
          numEl.textContent = suffixFinal ? display : display + suffix;
          requestAnimationFrame(tick);
        } else {
          numEl.textContent = to.toFixed(decimal) + (suffixFinal || suffix);
          card.dataset.state = 'done';
        }
      }

      requestAnimationFrame(tick);
    }, 450); // syncs with after-sect fade-in (0.3s css delay + small offset)
  }

  function collapseP1Card(card) {
    const numEl = card.querySelector('.p1-card-number');
    card.dataset.state = 'idle';
    if (numEl) {
      const from    = numEl.dataset.from || '0';
      const suffix  = numEl.dataset.suffix || '';
      const decimal = parseInt(numEl.dataset.decimal || '0', 10);
      numEl.textContent = parseFloat(from).toFixed(decimal) + suffix;
    }
    const deck = card.closest('.project-deck');
    if (deck && deck._actionHistory) {
      for (let i = deck._actionHistory.length - 1; i >= 0; i--) {
        if (deck._actionHistory[i].type === 'p1-outcome' && deck._actionHistory[i].card === card) {
          deck._actionHistory.splice(i, 1);
          break;
        }
      }
      if (deck._updateBackButton) deck._updateBackButton();
    }
  }

  document.querySelectorAll('.p1-impact-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.state === 'idle') {
        animateP1Card(card);
      } else if (card.dataset.state === 'done') {
        collapseP1Card(card);
      }
    });
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  // Observe all cards
  const cards = document.querySelectorAll('.ph-card, .ph-intro-card, .ph-why-section, .ph-story-card, .ph-role-grid');
  cards.forEach((card, index) => {
    // Add staggered delay inline for initial load effect
    card.style.transitionDelay = `${index * 100}ms`;
    observer.observe(card);
  });
});
