document.addEventListener("DOMContentLoaded", () => {
  initPresentation();
  initNavigation();
  initShowMore();
  initSliders();
  initCareerJourney();
  initProfileCardFlip();
  initReadingBooks();
  initReadingShowcaseScale();
  initInterestFlips();
  initPhotoScroller();
  initExhibitionExpand();
  initInterestsSubnav();
  initSideWorks();
  initProjects();
  initNextDestination();
  initSectionScrollLimit();
});

function initPresentation() {
  const startButton = document.getElementById("start-journey");
  const landingPage = document.getElementById("landing-page");
  const profilePage = document.getElementById("profile-page");

  if (!startButton || !landingPage || !profilePage) return;

  startButton.addEventListener("click", () => {
    gsap.to(".logo-wrapper", {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    });

    gsap.to(".landing-title, .landing-subtitle, .start-button", {
      opacity: 0,
      y: 30,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.in",
    });

    setTimeout(() => {
      landingPage.classList.add("hidden");
      profilePage.classList.add("active");
      animateProfileEntrance();

      // Update slider buttons visibility
      const companiesContainer = document.getElementById("companies-container");
      const companiesLeft = document.getElementById("companies-left");
      const companiesRight = document.getElementById("companies-right");
      if (companiesContainer && companiesLeft && companiesRight) {
        updateSliderButtons(companiesContainer, companiesLeft, companiesRight);
      }

      // Initialize reviews scroll buttons
      const reviewTags = document.getElementById("review-tags");
      const reviewsLeft = document.getElementById("reviews-left");
      const reviewsRight = document.getElementById("reviews-right");
      if (reviewTags && reviewsLeft && reviewsRight) {
        updateReviewSliderButtons(reviewTags, reviewsLeft, reviewsRight);
      }
    }, 800);
  });
}

function initShowMore() {
  const showMoreBtn = document.getElementById("show-more-btn");
  const bioSection = document.getElementById("bio-section");

  if (showMoreBtn && bioSection) {
    showMoreBtn.addEventListener("click", () => {
      if (bioSection.classList.contains("visible")) {
        bioSection.classList.remove("visible");
        showMoreBtn.textContent = "Show all";
      } else {
        bioSection.classList.add("visible");
        showMoreBtn.textContent = "Show less";
      }
    });
  }
}

function initSliders() {
  // Companies slider
  const companiesContainer = document.getElementById("companies-container");
  const companiesLeft = document.getElementById("companies-left");
  const companiesRight = document.getElementById("companies-right");

  if (companiesContainer && companiesLeft && companiesRight) {
    setTimeout(() => {
      updateSliderButtons(companiesContainer, companiesLeft, companiesRight);
    }, 100);

    companiesLeft.addEventListener("click", () => {
      companiesContainer.scrollBy({ left: -200, behavior: "smooth" });
    });

    companiesRight.addEventListener("click", () => {
      companiesContainer.scrollBy({ left: 200, behavior: "smooth" });
    });

    companiesContainer.addEventListener("scroll", () => {
      updateSliderButtons(companiesContainer, companiesLeft, companiesRight);
    });
  }

  // Reviews slider - horizontal scroll with 3-row grid
  const reviewTags = document.getElementById("review-tags");
  const reviewsLeft = document.getElementById("reviews-left");
  const reviewsRight = document.getElementById("reviews-right");

  if (reviewTags && reviewsLeft && reviewsRight) {
    setTimeout(() => {
      updateReviewSliderButtons(reviewTags, reviewsLeft, reviewsRight);
    }, 100);

    reviewsLeft.addEventListener("click", () => {
      const scrollAmount = reviewTags.clientWidth;
      reviewTags.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    reviewsRight.addEventListener("click", () => {
      const scrollAmount = reviewTags.clientWidth;
      reviewTags.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    reviewTags.addEventListener("scroll", () => {
      updateReviewSliderButtons(reviewTags, reviewsLeft, reviewsRight);
    });
  }
}

function initProfileCardFlip() {
  const profileCard = document.getElementById("profile-card");
  if (!profileCard) return;

  const toggleFlip = () => {
    const isFlipped = profileCard.classList.toggle("is-flipped");
    profileCard.setAttribute("aria-pressed", isFlipped ? "true" : "false");
  };

  profileCard.addEventListener("click", toggleFlip);
  profileCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  });
}

function initReadingBooks() {
  const bookCards = document.querySelectorAll(".book-spine-btn");
  const detailPanel = document.getElementById("book-detail-panel");
  if (!bookCards.length || !detailPanel) return;

  const detailItems = detailPanel.querySelectorAll(".book-detail-content");
  let activeBook = null;

  bookCards.forEach((card) => {
    card.addEventListener("click", () => {
      const bookId = card.getAttribute("data-book");
      if (!bookId) return;

      if (activeBook === bookId) {
        activeBook = null;
        card.classList.remove("is-active");
        card.classList.remove("is-flying");
        detailPanel.classList.remove("is-active");
        detailItems.forEach((item) => item.classList.remove("is-active"));
        return;
      }

      activeBook = bookId;
      bookCards.forEach((item) => {
        item.classList.remove("is-active");
        item.classList.remove("is-flying");
      });

      // Add flying animation
      card.classList.add("is-flying");
      setTimeout(() => {
        card.classList.add("is-active");
      }, 100);

      detailPanel.classList.add("is-active");
      detailItems.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.book === bookId);
      });
    });
  });
}

function initReadingShowcaseScale() {
  const frame = document.querySelector(".reading-showcase-frame");
  const showcase = frame?.querySelector(".reading-showcase");
  if (!frame || !showcase) return;

  const styles = window.getComputedStyle(frame);
  const baseWidth =
    parseFloat(styles.getPropertyValue("--reading-base-width")) || 872;
  const baseHeight =
    parseFloat(styles.getPropertyValue("--reading-base-height")) || 360;

  let rafId = null;

  const applyScale = () => {
    const availableWidth = frame.clientWidth;
    if (!availableWidth) return;

    if (availableWidth >= baseWidth) {
      frame.style.height = "";
      showcase.style.position = "";
      showcase.style.top = "";
      showcase.style.left = "";
      showcase.style.width = "100%";
      showcase.style.transform = "none";
      return;
    }

    const scale = availableWidth / baseWidth;
    frame.style.height = `${baseHeight * scale}px`;
    showcase.style.position = "absolute";
    showcase.style.top = "0";
    showcase.style.left = "0";
    showcase.style.width = `${baseWidth}px`;
    showcase.style.transform = `scale(${scale})`;
  };

  const scheduleScale = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      applyScale();
    });
  };

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(scheduleScale);
    observer.observe(frame);
  }

  window.addEventListener("resize", scheduleScale);
  scheduleScale();
}

function initInterestFlips() {
  const tiles = document.querySelectorAll(".interest-flip");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const image = tile.querySelector("img");
    if (image) {
      tile.classList.add("has-image");
    }
    tile.addEventListener("click", () => {
      tile.classList.toggle("is-flipped");
    });
  });
}

function initPhotoScroller() {
  const gallery = document.getElementById("photo-gallery");
  const leftBtn = document.getElementById("photos-left");
  const rightBtn = document.getElementById("photos-right");
  if (!gallery || !leftBtn || !rightBtn) return;

  const updateButtons = () => {
    const maxScrollLeft = gallery.scrollWidth - gallery.clientWidth - 1;
    leftBtn.disabled = gallery.scrollLeft <= 0;
    rightBtn.disabled = gallery.scrollLeft >= maxScrollLeft;
  };

  leftBtn.addEventListener("click", () => {
    const scrollAmount = gallery.clientWidth * 0.8;
    gallery.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    const scrollAmount = gallery.clientWidth * 0.8;
    gallery.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  gallery.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  window.addEventListener("load", updateButtons);

  const images = gallery.querySelectorAll("img");
  images.forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", updateButtons);
  });

  updateButtons();
}

function initExhibitionExpand() {
  const grid = document.querySelector(".exhibition-grid");
  const cards = document.querySelectorAll(".exhibition-card");
  if (!grid || !cards.length) return;

  const cardArray = Array.from(cards);

  const resetVideos = () => {
    cards.forEach((c) => {
      const video = c.querySelector(".exhibition-video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const collapseAll = () => {
    resetVideos();
    cards.forEach((c) => {
      c.classList.remove("is-expanded");
      c.style.maxHeight = "";
    });
    grid.classList.remove("has-expanded", "expand-left", "expand-right");
  };

  cards.forEach((card, index) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }
      const selection = window.getSelection();
      if (selection && selection.type === "Range") {
        return;
      }
      const isExpanded = card.classList.contains("is-expanded");
      collapseAll();
      if (!isExpanded) {
        card.classList.add("is-expanded");
        grid.classList.add("has-expanded");
        const cardIndex = cardArray.indexOf(card);
        if (cardIndex === 0) {
          grid.classList.add("expand-left");
        } else {
          grid.classList.add("expand-right");
        }
        // Auto-play video once
        const video = card.querySelector(".exhibition-video");
        if (video) {
          video.preload = "auto";
          video.load();
          video.currentTime = 0;
          video.play();
        }
        // Set shrunk card to half the expanded card's height
        // Wait for grid column transition to finish before measuring
        const onGridTransitionEnd = (e) => {
          if (e.propertyName === "grid-template-columns") {
            grid.removeEventListener("transitionend", onGridTransitionEnd);
            const expandedHeight = card.offsetHeight;
            const halfHeight = Math.round(expandedHeight / 2);
            cards.forEach((c) => {
              if (c !== card) {
                c.style.maxHeight = halfHeight + "px";
              }
            });
          }
        };
        grid.addEventListener("transitionend", onGridTransitionEnd);
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
      if (event.key === "Escape") {
        collapseAll();
      }
    });
  });
}

function updateReviewSliderButtons(container, leftBtn, rightBtn) {
  const isAtStart = container.scrollLeft <= 0;
  const isAtEnd =
    container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

  leftBtn.disabled = isAtStart;
  rightBtn.disabled = isAtEnd;
}

function updateSliderButtons(container, leftBtn, rightBtn) {
  const isAtStart = container.scrollLeft <= 0;
  const isAtEnd =
    container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

  leftBtn.disabled = isAtStart;
  rightBtn.disabled = isAtEnd;
}

function initInterestsSubnav() {
  const subnav = document.getElementById("interests-subnav");
  if (!subnav) return;

  const buttons = subnav.querySelectorAll(".interests-subnav-item");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-target");
      const target = document.getElementById(targetId);
      if (!target) return;

      buttons.forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Update active subnav on scroll
  const sections = [];
  buttons.forEach(function (btn) {
    const id = btn.getAttribute("data-target");
    const el = document.getElementById(id);
    if (el) sections.push({ el: el, btn: btn });
  });

  if (sections.length) {
    const scrollObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            buttons.forEach(function (b) {
              b.classList.remove("is-active");
            });
            const match = sections.find(function (s) {
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

function initSectionScrollLimit() {
  // header (65px) + content padding-top (48px)
  const SCROLL_MARGIN = 113;

  const configs = [
    {
      contentId: "interests-content",
      pageSelector: ".interests-page",
      lastId: "interest-more",
    },
    {
      contentId: "side-works-content",
      pageSelector: ".sideworks-page",
      lastId: "sw-podcast",
    },
  ];

  function applyPadding(pageEl, lastEl) {
    if (!pageEl || !lastEl) return;
    // Clear first so measurements reflect natural layout
    pageEl.style.paddingBottom = "";
    // Two rAFs: first lets the browser clear the padding,
    // second measures after layout has fully settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        // How tall the last section actually is
        const sectionHeight = lastEl.getBoundingClientRect().height;
        // Minimum extra bottom space so the title can scroll up to align
        // with profile (i.e., scroll range reaches lastEl.top - 113).
        // When sectionHeight >= viewportHeight - SCROLL_MARGIN this is 0,
        // meaning the natural scroll already stops at or before all content
        // is visible — no blank space needed.
        const needed = Math.max(0, viewportHeight - SCROLL_MARGIN - sectionHeight);
        pageEl.style.paddingBottom = needed > 0 ? Math.ceil(needed) + "px" : "";
      });
    });
  }

  configs.forEach(({ contentId, pageSelector, lastId }) => {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;

    new MutationObserver(() => {
      if (contentEl.classList.contains("active")) {
        const pageEl = document.querySelector(pageSelector);
        const lastEl = document.getElementById(lastId);
        applyPadding(pageEl, lastEl);
      }
    }).observe(contentEl, { attributes: true, attributeFilter: ["class"] });
  });

  window.addEventListener("resize", () => {
    configs.forEach(({ contentId, pageSelector, lastId }) => {
      const contentEl = document.getElementById(contentId);
      if (contentEl && contentEl.classList.contains("active")) {
        applyPadding(
          document.querySelector(pageSelector),
          document.getElementById(lastId)
        );
      }
    });
  });
}
