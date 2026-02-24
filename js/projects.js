/* ========================================
   Project Highlights - Presentation Mode
   ======================================== */

function initProjects() {
  initProjectTabs();
  initProjectDecks();
  initScenarioTabs();
  initContextReveal();
  initContextOrbs();
  initScenarioImageReveal();
  initChatDemo();
  initCrossAppChat();
  initBixbyDialogs();
  initMidDialogVoice();
  initProcessTimeline();
  initChallengeFlipCards();
}

/* ========================================
   Program 1 – Challenge Flip Cards
   ======================================== */
function initChallengeFlipCards() {
  // Front face click → flip to reveal problem
  document.querySelectorAll(".ch-face-front").forEach((front) => {
    front.addEventListener("click", () => {
      const card = front.closest(".ch-flip");
      if (!card || card.classList.contains("is-flipped")) return;
      card.classList.add("is-flipped");
      card.dataset.state = "flipped";
      const deck = card.closest(".project-deck");
      if (deck && deck._actionHistory) {
        deck._actionHistory.push({ type: "ch-flip", card });
        if (deck._updateBackButton) deck._updateBackButton();
      }
    });
  });

  // Arrow button click → reveal one solution item at a time
  document.querySelectorAll(".ch-arrow-btn").forEach((btn) => {
    const card = btn.closest(".ch-flip");
    if (!card) return;
    const items = Array.from(card.querySelectorAll(".ch-solution li"));

    btn.addEventListener("click", () => {
      if (!card.classList.contains("is-flipped")) return;
      const nextItem = items.find((li) => !li.classList.contains("is-revealed"));
      if (!nextItem) return;

      nextItem.classList.add("is-revealed");

      const deck = card.closest(".project-deck");
      if (deck && deck._actionHistory) {
        deck._actionHistory.push({ type: "ch-solve", card, item: nextItem, btn, items });
        if (deck._updateBackButton) deck._updateBackButton();
      }

      // Disable button once all items revealed
      const allDone = items.every((li) => li.classList.contains("is-revealed"));
      if (allDone) card.dataset.allRevealed = "true";
    });
  });
}

/* ========================================
   Scenario Image Reveal (img1 → img2)
   ======================================== */
function initScenarioImageReveal() {
  document.querySelectorAll(".scenario-img-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".scenario-imgs");
      const imgs = wrap.querySelectorAll(".scenario-img");
      const current = wrap.querySelector(".scenario-img.is-active");
      const currentIdx = Array.from(imgs).indexOf(current);
      const nextIdx = currentIdx + 1;

      if (nextIdx < imgs.length) {
        current.classList.remove("is-active");
        imgs[nextIdx].classList.add("is-active");

        // Track in deck history so Back can revert to previous image
        const deck = btn.closest(".project-deck");
        if (deck && deck._actionHistory) {
          deck._actionHistory.push({ type: "reveal-image", wrap, fromIdx: currentIdx });
          if (deck._updateBackButton) deck._updateBackButton();
        }
      }

      // Hide button once last image is shown
      if (nextIdx >= imgs.length - 1) {
        btn.classList.add("is-done");
      }
    });
  });
}

/* ========================================
   Context V3 — Circle → Card Orbs
   ======================================== */
function initContextOrbs() {
  document.querySelectorAll(".ctx-orb").forEach((orb) => {
    orb.addEventListener("click", () => {
      if (orb.classList.contains("is-clicking") || orb.classList.contains("is-active")) return;
      // Step 1: border turns coral immediately
      orb.classList.add("is-clicking");
      // Step 2: after short pause, morph to card
      setTimeout(() => {
        orb.classList.add("is-active");
        // Push to deck's undo history so Back can revert to circle
        const deck = orb.closest(".project-deck");
        if (deck && deck._actionHistory) {
          deck._actionHistory.push({ type: "orb", orb });
          if (deck._updateBackButton) deck._updateBackButton();
        }
      }, 400);
    });
  });
}

/* ========================================
   Context V2 — Carousel navigation (kept for AI deck)
   ======================================== */
function initContextCarousel() {
  document.querySelectorAll(".ctx-carousel").forEach((carousel) => {
    const group = carousel.dataset.group;
    const items = Array.from(carousel.querySelectorAll(".ctx-item"));
    const dots = Array.from(
      document.querySelectorAll(`.ctx-dots[data-group="${group}"] .ctx-dot`)
    );
    const prevBtn = document.querySelector(`.ctx-prev[data-group="${group}"]`);
    const nextBtn = document.querySelector(`.ctx-next[data-group="${group}"]`);

    if (!items.length || !prevBtn || !nextBtn) return;

    let current = 0;

    function goTo(index, direction) {
      items[current].classList.remove("is-active", "slide-back");
      if (dots[current]) dots[current].classList.remove("is-active");

      current = index;

      items[current].classList.remove("slide-back");
      if (direction === "prev") items[current].classList.add("slide-back");
      items[current].classList.add("is-active");
      if (dots[current]) dots[current].classList.add("is-active");

      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === items.length - 1;
    }

    prevBtn.addEventListener("click", () => {
      if (current > 0) goTo(current - 1, "prev");
    });

    nextBtn.addEventListener("click", () => {
      if (current < items.length - 1) goTo(current + 1, "next");
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        if (i !== current) goTo(i, i > current ? "next" : "prev");
      });
    });
  });
}

/* Project Tab Switching */
function initProjectTabs() {
  const tabs = document.querySelectorAll(".project-tab");
  const decks = document.querySelectorAll(".project-deck");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("is-active") || tab.classList.contains("is-clicking")) return;
      const target = tab.dataset.project;

      // Step 1: clear all active states, animate this card with pink
      tabs.forEach((t) => t.classList.remove("is-active", "is-clicking"));
      decks.forEach((d) => d.classList.remove("is-active"));
      tab.classList.add("is-clicking");

      // Step 2: after animation, show deck and scroll into view
      setTimeout(() => {
        tab.classList.remove("is-clicking");
        tab.classList.add("is-active");

        const targetDeck = document.getElementById(`deck-${target}`);
        if (targetDeck) {
          targetDeck.classList.add("is-active");

          // Reset deck to step 0 with initial slide state
          if (targetDeck._resetToInitial) targetDeck._resetToInitial();

          // Scroll so folder tabs align with sidebar "Profile" title (65px header + 48px padding)
          requestAnimationFrame(() => {
            const deckTop = targetDeck.getBoundingClientRect().top + window.scrollY - 113;
            window.scrollTo({ top: Math.max(0, deckTop), behavior: "smooth" });
          });
        }
      }, 560);
    });
  });
}

/* Deck Slide Navigation */
function initProjectDecks() {
  const decks = document.querySelectorAll(".project-deck");
  const getAlignedScrollOffset = () => {
    const header = document.querySelector(".profile-header");
    const contentArea = document.querySelector(".content-area");
    const headerHeight = header
      ? header.getBoundingClientRect().height
      : 65;
    const contentPaddingTop = contentArea
      ? parseFloat(window.getComputedStyle(contentArea).paddingTop) || 0
      : 48;
    return headerHeight + contentPaddingTop;
  };

  const ensureProgramOverviewBottomSpace = (targetTop) => {
    const projectsPage = document.querySelector(
      "#project-highlights-content .projects-page"
    );
    if (!projectsPage) return;

    const basePadding = projectsPage.dataset.basePaddingBottom
      ? parseFloat(projectsPage.dataset.basePaddingBottom)
      : parseFloat(window.getComputedStyle(projectsPage).paddingBottom) || 0;
    projectsPage.dataset.basePaddingBottom = String(basePadding);
    projectsPage.style.paddingBottom = `${basePadding}px`;

    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    if (targetTop > maxScrollTop) {
      const extra = Math.ceil(targetTop - maxScrollTop + 24);
      projectsPage.style.paddingBottom = `${basePadding + extra}px`;
    }
  };

  decks.forEach((deck) => {
    const slides = deck.querySelectorAll(".deck-slide");
    const steps = deck.querySelectorAll(".deck-step");
    const prevBtn = deck.querySelector(".deck-prev");
    const nextBtn = deck.querySelector(".deck-next");
    const progressFill = deck.querySelector(".deck-progress-fill");
    const nextLabel = deck.querySelector(".deck-next-label");

    if (!slides.length) return;

    let currentStep = 0;
    const totalSteps = slides.length;

    // Undo stack: {type:'step', from:N} or {type:'orb', orb:Element}
    const actionHistory = [];

    // ── Reset a slide to its initial state ──────────────────────────────
    const resetSlideState = (slide) => {
      if (!slide) return;
      // Reset p1 outcome cards
      slide.querySelectorAll(".p1-impact-card").forEach((card) => {
        card.dataset.state = "idle";
        const numEl = card.querySelector(".p1-card-number");
        if (numEl) {
          const from    = numEl.dataset.from || "0";
          const suffix  = numEl.dataset.suffix || "";
          const decimal = parseInt(numEl.dataset.decimal || "0", 10);
          numEl.textContent = parseFloat(from).toFixed(decimal) + suffix;
        }
      });
      // Reset ch-flip challenge cards
      slide.querySelectorAll(".ch-flip").forEach((card) => {
        card.classList.remove("is-flipped", "is-solved");
        card.dataset.state = "idle";
      });
      // Revert orbs to circles
      slide.querySelectorAll(".ctx-orb").forEach((orb) => {
        orb.classList.remove("is-active", "is-clicking");
      });
      // Reset context-reveal buttons and their cards
      slide.querySelectorAll(".context-next-btn").forEach((btn) => {
        btn._revealIndex = 0;
        btn.classList.remove("is-done");
        if (btn._revealOriginalHTML !== undefined) btn.innerHTML = btn._revealOriginalHTML;
        const group = btn.dataset.revealTarget;
        if (group) {
          document.querySelectorAll(
            `.icon-card[data-reveal="${group}"], .evo-row[data-reveal="${group}"]`
          ).forEach((el) => el.classList.remove("is-revealed"));
        }
      });
      // Reset scenario image reveals
      slide.querySelectorAll(".scenario-imgs").forEach((wrap) => {
        const imgs = wrap.querySelectorAll(".scenario-img");
        imgs.forEach((img, i) => img.classList.toggle("is-active", i === 0));
        const btn = wrap.querySelector(".scenario-img-btn");
        if (btn) btn.classList.remove("is-done");
      });
      // Reset scenario sub-tabs to first
      const firstTab = slide.querySelector(".scenario-tab");
      if (firstTab) {
        slide.querySelectorAll(".scenario-tab").forEach((t) => t.classList.remove("is-active"));
        firstTab.classList.add("is-active");
        const target = firstTab.dataset.scenario;
        slide.querySelectorAll(".scenario-panel").forEach((p) => p.classList.remove("is-active"));
        const firstPanel = slide.querySelector(`.scenario-panel[data-scenario="${target}"]`);
        if (firstPanel) firstPanel.classList.add("is-active");
      }
      // Reset process timeline — keep node 0 revealed (matches initial HTML state)
      slide.querySelectorAll(".process-node").forEach((node) => {
        node.classList.toggle("is-revealed", node.dataset.node === "0");
      });
      slide.querySelectorAll(".process-advance").forEach((btn, i) => {
        btn.classList.remove("is-done", "is-revealed");
        if (i === 0) btn.classList.add("is-revealed");
      });
      // Reset collab nodes to circles
      slide.querySelectorAll(".collab-node").forEach((n) => {
        n.classList.remove("is-active", "is-clicking");
      });
      // Reset chat demos
      resetChatDemos();
    };

    // ── Update back button appearance from history ───────────────────────
    const updateBackButton = () => {
      if (!prevBtn) return;
      prevBtn.disabled = actionHistory.length === 0;
      const top = actionHistory[actionHistory.length - 1];
      prevBtn.classList.toggle("is-orb-back", !!(top && (top.type === "orb" || top.type === "collab-node")));
    };

    // Expose on element so initContextOrbs can push to history
    deck._actionHistory = actionHistory;
    deck._updateBackButton = updateBackButton;

    // ── Navigate to a step ───────────────────────────────────────────────
    const goToStep = (step, pushHistory = true) => {
      if (step < 0 || step >= totalSteps) return;
      if (pushHistory) {
        actionHistory.push({ type: "step", from: currentStep });
        // Reset destination to initial state when navigating forward
        resetSlideState(slides[step]);
      }

      currentStep = step;

      // Update slides
      slides.forEach((s) => s.classList.remove("is-active"));
      slides[currentStep].classList.add("is-active");

      // Update step indicators
      steps.forEach((s, i) => {
        s.classList.remove("is-active", "is-visited");
        if (i < currentStep) s.classList.add("is-visited");
        if (i === currentStep) s.classList.add("is-active");
      });

      // Update progress bar
      if (progressFill) {
        progressFill.style.width = `${((currentStep + 1) / totalSteps) * 100}%`;
      }
      if (nextLabel) {
        nextLabel.textContent = currentStep === totalSteps - 1 ? "Done" : "Next";
      }

      // Trigger number animation on impact slide
      const impactSlide = slides[currentStep];
      if (impactSlide && impactSlide.querySelector(".impact-number")) {
        animateImpactNumbers(impactSlide);
      }

      // Reset chat demos on slide change
      resetChatDemos();

      // Update back button
      updateBackButton();

      // Scroll so folder tabs align with sidebar "Profile" title
      const deckEl = slides[currentStep].closest(".project-deck");
      if (deckEl) {
        const deckTop = deckEl.getBoundingClientRect().top + window.scrollY - 113;
        window.scrollTo({ top: Math.max(0, deckTop), behavior: "smooth" });
      }
    };

    // ── Full reset to step 0 (called when program card is re-clicked) ────
    deck._resetToInitial = () => {
      actionHistory.length = 0;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === 0);
        resetSlideState(slide);
      });
      currentStep = 0;
      steps.forEach((s, i) => {
        s.classList.toggle("is-active", i === 0);
        s.classList.remove("is-visited");
      });
      if (progressFill) progressFill.style.width = `${(1 / totalSteps) * 100}%`;
      if (nextLabel) nextLabel.textContent = "Next";
      updateBackButton();
    };

    // ── Undo a single action from the history stack ───────────────────────
    const undoAction = (action) => {
      if (action.type === "step") {
        goToStep(action.from, false);
      } else if (action.type === "orb") {
        action.orb.classList.remove("is-active", "is-clicking");
      } else if (action.type === "reveal-image") {
        const imgs = action.wrap.querySelectorAll(".scenario-img");
        imgs.forEach((img, i) => img.classList.toggle("is-active", i === action.fromIdx));
        const imgBtn = action.wrap.querySelector(".scenario-img-btn");
        if (imgBtn) imgBtn.classList.remove("is-done");
      } else if (action.type === "timeline-advance") {
        action.node.classList.remove("is-revealed");
        action.advanceBtn.classList.remove("is-done");
        if (action.nextAdvanceBtn) action.nextAdvanceBtn.classList.remove("is-revealed");
      } else if (action.type === "reveal-item") {
        action.cards[action.cardIndex].classList.remove("is-revealed");
        action.btn._revealIndex = action.cardIndex;
        action.btn.classList.remove("is-done");
        if (action.btn._revealOriginalHTML !== undefined) action.btn.innerHTML = action.btn._revealOriginalHTML;
      } else if (action.type === "collab-node") {
        action.node.classList.remove("is-active", "is-clicking");
      } else if (action.type === "ch-flip") {
        action.card.classList.remove("is-flipped", "is-solved");
        action.card.dataset.state = "idle";
        delete action.card.dataset.allRevealed;
        action.card.querySelectorAll(".ch-solution li").forEach((li) => {
          li.classList.remove("is-revealed");
        });
      } else if (action.type === "ch-solve") {
        action.item.classList.remove("is-revealed");
        delete action.card.dataset.allRevealed;
      } else if (action.type === "p1-outcome") {
        action.card.dataset.state = "idle";
        if (action.numEl) action.numEl.textContent = action.initialText;
      }
    };

    // ── Back button: undo last action ────────────────────────────────────
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (!actionHistory.length) return;
        undoAction(actionHistory.pop());
        updateBackButton();
      });
    }

    // ── Next / Done button ────────────────────────────────────────────────
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentStep < totalSteps - 1) {
          goToStep(currentStep + 1);
        } else {
          // Done: collapse deck, clear active tab, scroll to Program Overview
          const overview = document.getElementById("program-overview-heading");
          deck.classList.remove("is-active");
          document.querySelectorAll(".project-tab").forEach((t) => {
            t.classList.remove("is-active", "is-clicking");
          });
          if (deck._resetToInitial) deck._resetToInitial();
          if (overview) {
            requestAnimationFrame(() => {
              const overviewTarget =
                overview.getBoundingClientRect().top +
                window.scrollY -
                getAlignedScrollOffset();
              ensureProgramOverviewBottomSpace(overviewTarget);
              window.scrollTo({ top: Math.max(0, overviewTarget), behavior: "smooth" });
            });
          }
        }
      });
    }

    // ── Step tab click: reset that slide + navigate fresh (no history) ───
    steps.forEach((step) => {
      step.addEventListener("click", () => {
        const targetStep = parseInt(step.dataset.step);
        if (isNaN(targetStep)) return;
        resetSlideState(slides[targetStep]);
        actionHistory.length = 0;
        goToStep(targetStep, false);
      });
    });

    // ── Keyboard: → advances (with history), ← undoes ───────────────────
    document.addEventListener("keydown", (e) => {
      const section = document.getElementById("project-highlights-content");
      if (!section || !section.classList.contains("active")) return;
      if (!deck.classList.contains("is-active")) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToStep(currentStep + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (actionHistory.length) {
          undoAction(actionHistory.pop());
          updateBackButton();
        }
      }
    });

    // Initialize
    updateBackButton();
  });
}

/* Scenario Tab Switching — scoped within each project deck */
function initScenarioTabs() {
  const decks = document.querySelectorAll(".project-deck");

  decks.forEach((deck) => {
    const scenarioTabs = deck.querySelectorAll(".scenario-tab");
    const scenarioPanels = deck.querySelectorAll(".scenario-panel");

    scenarioTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.scenario;

        scenarioTabs.forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        scenarioPanels.forEach((p) => p.classList.remove("is-active"));
        const targetPanel = deck.querySelector(
          `.scenario-panel[data-scenario="${target}"]`
        );
        if (targetPanel) {
          targetPanel.classList.add("is-active");
        }

        // Reset chat demo for the newly active panel
        resetChatDemos();
      });
    });
  });
}

/* ========================================
   Slide 1: Context Reveal
   ======================================== */
function initContextReveal() {
  const revealBtns = document.querySelectorAll(".context-next-btn");

  revealBtns.forEach((btn) => {
    const group = btn.dataset.revealTarget;
    // Support both icon-card and evo-row (evolution table) reveal patterns
    const cards = Array.from(
      document.querySelectorAll(
        `.icon-card[data-reveal="${group}"], .evo-row[data-reveal="${group}"]`
      )
    );

    // Store on element so resetSlideState can fully reset this button
    btn._revealOriginalHTML = btn.innerHTML;
    btn._revealIndex = 0;

    // Reveal first card immediately when slide becomes active (not tracked in history)
    const observer = new MutationObserver(() => {
      const slide = btn.closest(".deck-slide");
      if (slide && slide.classList.contains("is-active") && btn._revealIndex === 0) {
        revealNext(false);
      }
    });

    const slide = btn.closest(".deck-slide");
    if (slide) {
      observer.observe(slide, { attributes: true, attributeFilter: ["class"] });
    }

    function revealNext(fromUserClick = true) {
      if (btn._revealIndex >= cards.length) return;
      const revealedIdx = btn._revealIndex;
      cards[revealedIdx].classList.add("is-revealed");
      btn._revealIndex++;

      // Track manual clicks so Back can undo them
      if (fromUserClick) {
        const deck = btn.closest(".project-deck");
        if (deck && deck._actionHistory) {
          deck._actionHistory.push({ type: "reveal-item", btn, cards, cardIndex: revealedIdx });
          if (deck._updateBackButton) deck._updateBackButton();
        }
      }

      if (btn._revealIndex >= cards.length) {
        btn.classList.add("is-done");
        btn.innerHTML =
          '<svg viewBox="0 0 16 16" fill="none"><path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Done';
      }
    }

    btn.addEventListener("click", () => revealNext(true));
  });
}

/* ========================================
   Slide 2: Chat Demo (Start + Hi Bixby)
   ======================================== */
function initChatDemo() {
  const startBtns = document.querySelectorAll(".chat-start-btn");

  startBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const scenarioId = btn.dataset.start;
      const screen = document.querySelector(
        `.phone-screen[data-scenario-phone="${scenarioId}"]`
      );
      if (!screen) return;

      // Bixby home-screen + dialog → program1 flow
      // crossapp → click-driven round sequence
      // everything else → auto sequence
      if (screen.classList.contains("bixby-home-screen") && screen.querySelector(".bixby-dialog")) {
        startBixbyDialogDemo(screen);
      } else if (scenarioId === "crossapp" || scenarioId === "iot") {
        startCrossAppSequence(screen);
      } else {
        startChatSequence(screen);
      }
    });
  });
}

/* ── New Bixby dialog demo (home-screen style) ────────────────────────── */
function startBixbyDialogDemo(screen) {
  const scenario  = screen.dataset.scenarioPhone; // 'solar' | 'home' | 'quiz'
  const pill      = screen.querySelector(".bixby-speech-pill");
  const pillText  = (pill && pill.dataset.speech) ? pill.dataset.speech : "";
  const wakeEl    = screen.querySelector(".bixby-wake-text");
  const wakeText  = (wakeEl && wakeEl.dataset.wake) ? wakeEl.dataset.wake : "Hi Bixby";

  // Phase 1 (0 ms): speech bubble appears, typewriter types "Hi Bixby".
  // Overlay fades instantly via CSS (.is-waking .chat-start-overlay).
  if (wakeEl) wakeEl.textContent = "";
  screen.classList.add("is-waking");

  if (wakeEl) {
    let wi = 0;
    const wakeTimer = setInterval(() => {
      wakeEl.textContent += wakeText[wi];
      wi++;
      if (wi >= wakeText.length) clearInterval(wakeTimer);
    }, 80);
  }

  // Phase 2 (2 400 ms): bubble fades → dock slides up + background dims.
  setTimeout(() => {
    screen.classList.remove("is-waking");
    screen.classList.add("is-summoned");
  }, 2400);

  if (scenario === "solar") {
    // Scenario 1: dialog slides up shortly after dock appears
    setTimeout(() => {
      screen.classList.add("is-started");
    }, 4000);

  } else {
    // Scenarios 2 & 3: speech pill typewriter above dock, then dialog
    setTimeout(() => {
      screen.classList.add("is-typing");

      if (pill && pillText) {
        pill.textContent = "";
        let i = 0;
        const timer = setInterval(() => {
          pill.textContent += pillText[i];
          i++;
          if (i >= pillText.length) {
            clearInterval(timer);
            // Pause after typing so viewer can read it, then show dialog
            setTimeout(() => {
              screen.classList.remove("is-typing");
              screen.classList.add("is-started");
            }, 900);
          }
        }, 70); // 70 ms per character — readable, natural pace
      } else {
        setTimeout(() => {
          screen.classList.remove("is-typing");
          screen.classList.add("is-started");
        }, 1800);
      }
    }, 4000);
  }
}

/* Initialize all Bixby option advance buttons once at page load */
function initBixbyDialogs() {
  document.querySelectorAll(".bixby-home-screen").forEach((screen) => {
    const dialog = screen.querySelector(".bixby-dialog");
    if (!dialog) return;

    // Handle both .bixby-opt and .bixby-chip elements with data-advance-step
    dialog.querySelectorAll("[data-advance-step]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const targetStepNum = parseInt(trigger.dataset.advanceStep);
        if (isNaN(targetStepNum)) return;

        // Visual feedback on opts only (not chips)
        if (trigger.classList.contains("bixby-opt")) {
          trigger.classList.add("is-selected");
        }

        const delay = trigger.classList.contains("bixby-opt") ? 260 : 120;

        setTimeout(() => {
          const currentStep = dialog.querySelector(".bixby-dialog-step.is-active");
          if (currentStep) currentStep.classList.remove("is-active");

          const nextStep = dialog.querySelector(
            `.bixby-dialog-step[data-step="${targetStepNum}"]`
          );
          if (nextStep) {
            nextStep.classList.add("is-active");

            // Toggle cross-app context: steps 3-5 in home scenario hide Bixby gear
            const isCrossApp = screen.dataset.scenarioPhone === "home" && targetStepNum >= 3;
            dialog.classList.toggle("is-cross-app", isCrossApp);

            // Trigger typewriter animation for any .bixby-typewriter elements in the new step
            nextStep.querySelectorAll(".bixby-typewriter[data-text]").forEach((el) => {
              const text = el.dataset.text;
              el.textContent = "";
              el.classList.add("is-typing");
              let i = 0;
              const timer = setInterval(() => {
                el.textContent += text[i];
                i++;
                if (i >= text.length) {
                  clearInterval(timer);
                  el.classList.remove("is-typing");
                }
              }, 80);
            });
          }
        }, delay);
      });
    });
  });
}

/* Mid-dialog Bixby dock click → voice box typewriter inside step → advance */
function initMidDialogVoice() {
  document.querySelectorAll('.bixby-home-screen[data-scenario-phone="home"]').forEach((screen) => {
    const dock   = screen.querySelector(".bixby-dock-bixby");
    const dialog = screen.querySelector(".bixby-dialog");
    if (!dock || !dialog) return;

    const speechFor = { "4": "Mashed potato", "5": "Open the first one" };

    dock.addEventListener("click", () => {
      if (!screen.classList.contains("is-started")) return;
      const activeStep = dialog.querySelector(".bixby-dialog-step.is-active");
      if (!activeStep || !activeStep.dataset.dockAdvance) return;

      const targetStep = activeStep.dataset.dockAdvance;
      const text = speechFor[targetStep];
      if (!text) return;

      const voiceInput = activeStep.querySelector(".bixby-voice-input");
      const voiceText  = activeStep.querySelector(".bixby-voice-text");
      if (!voiceInput || !voiceText) return;

      // Show voice box and typewrite the user's speech
      voiceInput.classList.add("is-active");
      voiceText.textContent = "";
      voiceText.classList.add("is-typing");
      let i = 0;
      const timer = setInterval(() => {
        voiceText.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          voiceText.classList.remove("is-typing");
          // Pause so viewer can read, then advance to next step
          setTimeout(() => {
            activeStep.classList.remove("is-active");
            const nextStep = dialog.querySelector(`.bixby-dialog-step[data-step="${targetStep}"]`);
            if (nextStep) {
              nextStep.classList.add("is-active");
              dialog.classList.toggle("is-cross-app", parseInt(targetStep) >= 3);
            }
          }, 800);
        }
      }, 70);
    });
  });
}

/* ========================================
   CrossApp: click-driven round-by-round chat
   ======================================== */
function startCrossAppSequence(screen) {
  const chat   = screen.querySelector(".phone-chat");
  const wakeEl = screen.querySelector(".bixby-wake-text");
  const wakeText = (wakeEl && wakeEl.dataset.wake) ? wakeEl.dataset.wake : "Hi Bixby";

  screen._crossappRound = 1;
  screen._crossappDockReady = false;

  if (wakeEl) wakeEl.textContent = "";
  screen.classList.add("is-waking");
  if (wakeEl) {
    let wi = 0;
    const wt = setInterval(() => {
      wakeEl.textContent += wakeText[wi++];
      if (wi >= wakeText.length) clearInterval(wt);
    }, 80);
  }
  setTimeout(() => {
    screen.classList.remove("is-waking");
    screen.classList.add("is-summoned");
  }, 2200);
  setTimeout(() => {
    screen.classList.add("is-started", "is-responding");
    showCrossAppRound(screen, 1, chat);
  }, 3800);
}

function showCrossAppRound(screen, round, chat) {
  const dock = screen.querySelector(".bixby-dock-bixby");
  const bubbles = screen.querySelectorAll(`.phone-bubble[data-round="${round}"]`);
  const allRoundBubbles = screen.querySelectorAll('.phone-bubble[data-round]');
  const maxRound = allRoundBubbles.length > 0 ? Math.max(...Array.from(allRoundBubbles).map(b => parseInt(b.dataset.round))) : 1;
  bubbles.forEach((bubble, i) => {
    setTimeout(() => {
      bubble.classList.add("is-visible");
      if (chat) requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
      if (i === bubbles.length - 1) {
        setTimeout(() => {
          screen.classList.remove("is-responding");
          if (round < maxRound) {
            screen._crossappDockReady = true;
            if (dock) dock.classList.add("is-awaiting-input");
          }
        }, 500);
      }
    }, i * 1000);
  });
}

function initCrossAppChat() {
  document.querySelectorAll('.bixby-home-screen[data-scenario-phone="crossapp"], .bixby-home-screen[data-scenario-phone="iot"]').forEach((screen) => {
    const dock = screen.querySelector(".bixby-dock-bixby");
    if (!dock) return;
    dock.addEventListener("click", () => {
      if (!screen.classList.contains("is-started")) return;
      if (!screen._crossappDockReady) return;
      screen._crossappDockReady = false;
      dock.classList.remove("is-awaiting-input");
      screen._crossappRound = (screen._crossappRound || 1) + 1;
      const chat = screen.querySelector(".phone-chat");
      screen.classList.add("is-responding");
      showCrossAppRound(screen, screen._crossappRound, chat);
    });
  });
}

function startChatSequence(screen) {
  const bubbles  = screen.querySelectorAll(".phone-bubble");
  const chat     = screen.querySelector(".phone-chat");
  const wakeEl   = screen.querySelector(".bixby-wake-text");
  const wakeText = (wakeEl && wakeEl.dataset.wake) ? wakeEl.dataset.wake : "Hi Bixby";

  // Adaptive timing: shorter interval for demos with many bubbles
  const interval = bubbles.length > 6 ? 700 : 500;

  // Phase 1 (0 ms): "Hi Bixby" bubble appears with typewriter
  if (wakeEl) wakeEl.textContent = "";
  screen.classList.add("is-waking");

  if (wakeEl) {
    let wi = 0;
    const wakeTimer = setInterval(() => {
      wakeEl.textContent += wakeText[wi];
      wi++;
      if (wi >= wakeText.length) clearInterval(wakeTimer);
    }, 80);
  }

  // Phase 2 (2 200 ms): dock slides up + background dims
  setTimeout(() => {
    screen.classList.remove("is-waking");
    screen.classList.add("is-summoned");
  }, 2200);

  // Phase 3 (3 800 ms): start showing chat bubbles
  setTimeout(() => {
    screen.classList.add("is-started", "is-responding");

    // Show bubbles one by one
    bubbles.forEach((bubble, i) => {
      setTimeout(() => {
        bubble.classList.add("is-visible");

        // Auto-scroll chat to keep latest message visible
        if (chat) {
          requestAnimationFrame(() => {
            chat.scrollTop = chat.scrollHeight;
          });
        }

        // On last bubble, stop responding animation
        if (i === bubbles.length - 1) {
          setTimeout(() => {
            screen.classList.remove("is-responding");
          }, 400);
        }
      }, i * interval);
    });
  }, 3800);
}

function resetChatDemos() {
  const screens = document.querySelectorAll(".phone-screen[data-scenario-phone]");
  screens.forEach((screen) => {
    screen.classList.remove(
      "is-waking",
      "is-summoned",
      "is-listening",
      "is-typing",
      "is-started",
      "is-responding"
    );

    // Reset classic chat bubbles
    screen.querySelectorAll(".phone-bubble").forEach((b) => {
      b.classList.remove("is-visible");
    });

    // Reset crossapp round state
    if (screen.dataset.scenarioPhone === "crossapp" || screen.dataset.scenarioPhone === "iot") {
      screen._crossappRound = 1;
      screen._crossappDockReady = false;
      const dock = screen.querySelector(".bixby-dock-bixby");
      if (dock) dock.classList.remove("is-awaiting-input");
    }

    // Reset new bixby dialog screens
    if (screen.classList.contains("bixby-home-screen")) {
      const dialog = screen.querySelector(".bixby-dialog");
      if (dialog) {
        // Reset all steps: deactivate all, then activate step 1
        dialog.querySelectorAll(".bixby-dialog-step").forEach((step) => {
          step.classList.remove("is-active");
        });
        const firstStep = dialog.querySelector('.bixby-dialog-step[data-step="1"]');
        if (firstStep) firstStep.classList.add("is-active");

        // Clear option selection highlights
        dialog.querySelectorAll(".bixby-opt").forEach((opt) => {
          opt.classList.remove("is-selected");
        });

        // Remove cross-app context class so Bixby gear row reappears
        dialog.classList.remove("is-cross-app");

        // Clear typewriter text so it starts fresh next time
        dialog.querySelectorAll(".bixby-typewriter").forEach((el) => {
          el.textContent = "";
          el.classList.remove("is-typing");
        });

        // Clear voice input boxes
        dialog.querySelectorAll(".bixby-voice-input").forEach((el) => {
          el.classList.remove("is-active");
        });
        dialog.querySelectorAll(".bixby-voice-text").forEach((el) => {
          el.textContent = "";
          el.classList.remove("is-typing");
        });
      }

      // Clear typewriter elements so they start fresh next time
      const wakeEl = screen.querySelector(".bixby-wake-text");
      if (wakeEl) wakeEl.textContent = "";
      const pill = screen.querySelector(".bixby-speech-pill");
      if (pill) pill.textContent = "";
    }
  });
}

/* ========================================
   Slide 3: Process Timeline Advance
   ======================================== */
function initProcessTimeline() {
  const timelines = document.querySelectorAll(".process-timeline");

  timelines.forEach((timeline) => {
    const advanceBtns = timeline.querySelectorAll(".process-advance");

    advanceBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetIdx = parseInt(btn.dataset.advance);
        const targetNode = timeline.querySelector(
          `.process-node[data-node="${targetIdx}"]`
        );

        if (targetNode) {
          targetNode.classList.add("is-revealed");
          btn.classList.add("is-done");

          const nextAdvance = timeline.querySelector(
            `.process-advance[data-advance="${targetIdx + 1}"]`
          );
          if (nextAdvance) nextAdvance.classList.add("is-revealed");

          // Track in deck history so Back can undo this step
          const deck = btn.closest(".project-deck");
          if (deck && deck._actionHistory) {
            deck._actionHistory.push({
              type: "timeline-advance",
              node: targetNode,
              advanceBtn: btn,
              nextAdvanceBtn: nextAdvance || null,
            });
            if (deck._updateBackButton) deck._updateBackButton();
          }

          targetNode.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      });
    });
  });
}

/* Animate Impact Numbers */
function animateImpactNumbers(container) {
  const numbers = container.querySelectorAll(".impact-number[data-target]");

  numbers.forEach((el) => {
    if (el.dataset.animated === "true") return;
    el.dataset.animated = "true";

    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const decimals = parseInt(el.dataset.decimals) || 0;
    const duration = 1200;
    const startTime = performance.now();

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      let current;
      if (decimals > 0) {
        current = (easeOut(progress) * target).toFixed(decimals);
      } else {
        current = Math.round(easeOut(progress) * target);
      }
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  });
}
