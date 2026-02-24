function initSideWorks() {
  initSideWorksReveal();
  initSwSubnav();
  initAppIconCards();
  initPhoneCarousels();
  initVideoPlayers();
  initConceptTabs();
  initConceptPhotoCarousels();
  initDocumentaryVideo();
}

function initSideWorksReveal() {
  var revealElements = document.querySelectorAll(".sideworks-reveal");
  if (!revealElements.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}

function initSwSubnav() {
  var subnav = document.getElementById("sw-subnav");
  if (!subnav) return;

  var buttons = subnav.querySelectorAll(".sw-subnav-item");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-target");
      var target = document.getElementById(targetId);
      if (!target) return;

      // Update active state
      buttons.forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");

      // Smooth scroll to section
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Update active subnav on scroll
  var sections = [];
  buttons.forEach(function (btn) {
    var id = btn.getAttribute("data-target");
    var el = document.getElementById(id);
    if (el) sections.push({ el: el, btn: btn });
  });

  if (sections.length) {
    var scrollObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            buttons.forEach(function (b) {
              b.classList.remove("is-active");
            });
            var match = sections.find(function (s) {
              return s.el === entry.target;
            });
            if (match) match.btn.classList.add("is-active");
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    );

    sections.forEach(function (s) {
      scrollObserver.observe(s.el);
    });
  }
}

function syncAppDetailHeight() {
  var activeBody = document.querySelector(".app-detail.is-active .app-detail-body");
  if (!activeBody) return;
  var textEl = activeBody.querySelector(".app-detail-text");
  var visualEl = activeBody.querySelector(".app-detail-visual");
  if (!textEl || !visualEl) return;
  // Video panels size themselves via aspect-ratio; only sync image-based panels
  if (visualEl.querySelector(".app-video-wrapper")) return;
  // Reset first so measurement is accurate
  visualEl.style.height = "";
  var h = textEl.offsetHeight;
  if (h > 0) visualEl.style.height = h + "px";
}

function initVideoPlayers() {
  var wrappers = document.querySelectorAll(".app-video-wrapper");
  if (!wrappers.length) return;

  wrappers.forEach(function (wrapper) {
    var video = wrapper.querySelector("video");
    var btn = wrapper.querySelector(".app-video-play-btn");
    if (!video) return;

    wrapper.addEventListener("click", function () {
      if (video.paused) {
        video.play();
        wrapper.classList.add("is-playing");
      } else {
        video.pause();
        wrapper.classList.remove("is-playing");
      }
    });

    // Restore play button when video ends (loop is off-case) or is paused externally
    video.addEventListener("pause", function () {
      wrapper.classList.remove("is-playing");
    });
    video.addEventListener("play", function () {
      wrapper.classList.add("is-playing");
    });
  });
}

function initAppIconCards() {
  var iconCards = document.querySelectorAll(".app-icon-card");
  var detailPanels = document.querySelectorAll(".app-detail");
  if (!iconCards.length || !detailPanels.length) return;

  iconCards.forEach(function (card) {
    card.addEventListener("click", function () {
      var appId = card.getAttribute("data-app");

      // Toggle: if clicking already active, collapse
      var wasActive = card.classList.contains("is-active");

      // Reset all
      iconCards.forEach(function (c) {
        c.classList.remove("is-active");
      });
      detailPanels.forEach(function (p) {
        p.classList.remove("is-active");
      });

      if (wasActive) return;

      // Activate clicked
      card.classList.add("is-active");
      var detail = document.querySelector(
        '.app-detail[data-app="' + appId + '"]'
      );
      if (detail) {
        detail.classList.add("is-active");
        // Sync visual height to text column height after render
        requestAnimationFrame(function () {
          syncAppDetailHeight();
        });
      }
    });
  });

  // Sync on initial active card and on resize
  requestAnimationFrame(function () {
    syncAppDetailHeight();
  });
  window.addEventListener("resize", syncAppDetailHeight);
}

function initPhoneCarousels() {
  var carousels = document.querySelectorAll(".app-screenshot-carousel");
  if (!carousels.length) return;

  carousels.forEach(function (carousel) {
    var slides = carousel.querySelectorAll(".carousel-slide");
    var dotsContainer = carousel
      .closest(".app-detail-visual")
      .querySelector(".carousel-dots");
    var dots = dotsContainer
      ? dotsContainer.querySelectorAll(".carousel-dot")
      : [];
    if (slides.length < 2) return;

    var current = 0;
    var interval = null;

    function goTo(index) {
      slides[current].classList.remove("is-active");
      if (dots[current]) dots[current].classList.remove("is-active");
      current = index % slides.length;
      slides[current].classList.add("is-active");
      if (dots[current]) dots[current].classList.add("is-active");
    }

    function startAutoplay() {
      stopAutoplay();
      interval = setInterval(function () {
        goTo(current + 1);
      }, 2500);
    }

    function stopAutoplay() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    // Click dots to navigate
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
        startAutoplay();
      });
    });

    // Start autoplay when the detail panel becomes visible
    var detail = carousel.closest(".app-detail");
    if (detail) {
      var observer = new MutationObserver(function () {
        if (detail.classList.contains("is-active")) {
          goTo(0);
          startAutoplay();
        } else {
          stopAutoplay();
        }
      });
      observer.observe(detail, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // Start immediately if already active
      if (detail.classList.contains("is-active")) {
        startAutoplay();
      }
    }
  });
}

function initConceptTabs() {
  var tabs = document.querySelectorAll(".concept-tab");
  var panels = document.querySelectorAll(".concept-panel-item");
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var concept = tab.getAttribute("data-concept");

      tabs.forEach(function (t) { t.classList.remove("is-active"); });
      panels.forEach(function (p) { p.classList.remove("is-active"); });

      tab.classList.add("is-active");
      var panel = document.querySelector(
        '.concept-panel-item[data-concept="' + concept + '"]'
      );
      if (panel) panel.classList.add("is-active");
    });
  });
}

function initColivingConcepts() {
  var concepts = document.querySelectorAll(".coliving-concept");
  if (!concepts.length) return;

  var colivingBlock = document.getElementById("sw-coliving");
  if (!colivingBlock) return;

  var revealed = false;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !revealed) {
          revealed = true;
          concepts.forEach(function (concept) {
            concept.classList.add("is-revealed");
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(colivingBlock);
}

function initConceptPhotoCarousels() {
  var panels = document.querySelectorAll(".concept-panel-item");
  if (!panels.length) return;

  panels.forEach(function (panel) {
    var track = panel.querySelector(".cpc-track");
    var origSlides = panel.querySelectorAll(".cpc-slide");
    var dots = panel.querySelectorAll(".cpc-dot");
    if (!track || origSlides.length < 2) return;

    var count = origSlides.length;
    var trackPos = 0;
    var interval = null;
    var isAnimating = false;

    // Append clones so the track is [s0, s1, s0-clone, s1-clone, ...]
    // This lets us always slide forward (right→left) and snap back seamlessly.
    Array.prototype.forEach.call(origSlides, function (slide) {
      var clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    function updateDots(logicalIndex) {
      Array.prototype.forEach.call(dots, function (dot) {
        dot.classList.remove("is-active");
      });
      if (dots[logicalIndex]) dots[logicalIndex].classList.add("is-active");
    }

    function goTo(nextPos) {
      if (isAnimating) return;
      isAnimating = true;
      trackPos = nextPos;
      track.style.transform = "translateX(" + (-trackPos * 100) + "%)";
      updateDots(trackPos % count);

      function onEnd() {
        track.removeEventListener("transitionend", onEnd);
        isAnimating = false;
        // Once we've moved past the originals, snap back silently
        if (trackPos >= count) {
          trackPos = trackPos % count;
          track.style.transition = "none";
          track.style.transform = "translateX(" + (-trackPos * 100) + "%)";
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              track.style.transition = "";
            });
          });
        }
      }
      track.addEventListener("transitionend", onEnd);
    }

    function startAutoplay() {
      stopAutoplay();
      interval = setInterval(function () {
        goTo(trackPos + 1);
      }, 2500);
    }

    function stopAutoplay() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.addEventListener("click", function () {
        var currentLogical = trackPos % count;
        if (i === currentLogical) return;
        // Always advance forward to reach target (right→left)
        var steps = (i - currentLogical + count) % count;
        goTo(trackPos + steps);
        startAutoplay();
      });
    });

    var observer = new MutationObserver(function () {
      if (panel.classList.contains("is-active")) {
        isAnimating = false;
        trackPos = 0;
        track.style.transition = "none";
        track.style.transform = "translateX(0%)";
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            track.style.transition = "";
            updateDots(0);
            startAutoplay();
          });
        });
      } else {
        stopAutoplay();
      }
    });
    observer.observe(panel, { attributes: true, attributeFilter: ["class"] });

    // Init
    track.style.transform = "translateX(0%)";
    updateDots(0);
    if (panel.classList.contains("is-active")) {
      startAutoplay();
    }
  });
}

function initDocumentaryVideo() {
  var wrapper = document.getElementById("doc-video-wrapper");
  var thumbnail = document.getElementById("doc-thumbnail");
  var playBtn = document.getElementById("doc-play-btn");
  if (!wrapper || !thumbnail) return;

  // iframe has its own Google Drive player controls
  if (playBtn) playBtn.style.display = "none";

  thumbnail.addEventListener("click", function () {
    wrapper.classList.add("is-playing");
  });
}

function initColivingCarousel() {
  var slidesContainer = document.getElementById("coliving-slides");
  if (!slidesContainer) return;

  var slides = slidesContainer.querySelectorAll(".coliving-slide");
  var dotsContainer = document.getElementById("coliving-dots");
  var dots = dotsContainer
    ? dotsContainer.querySelectorAll(".carousel-dot")
    : [];
  if (slides.length < 2) return;

  var current = 0;
  var interval = null;

  function goTo(index) {
    slides[current].classList.remove("is-active");
    if (dots[current]) dots[current].classList.remove("is-active");
    current = index % slides.length;
    slides[current].classList.add("is-active");
    if (dots[current]) dots[current].classList.add("is-active");
  }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(function () {
      goTo(current + 1);
    }, 2100);
  }

  function stopAutoplay() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  // Click dots to navigate
  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goTo(i);
      startAutoplay();
    });
  });

  // Start autoplay when the coliving section becomes visible
  var colivingBlock = document.getElementById("sw-coliving");
  if (colivingBlock) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(colivingBlock);
  }
}
