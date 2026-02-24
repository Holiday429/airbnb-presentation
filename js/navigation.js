function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const contentSections = document.querySelectorAll(".content-section");
  const menuButton = document.querySelector(".menu-button");

  const activateSection = (sectionId) => {
    document.querySelectorAll(".nav-item").forEach((nav) => {
      nav.classList.remove("active");
    });

    const activeNav = document.querySelector(
      `.nav-item[data-section="${sectionId}"]`
    );
    if (activeNav) {
      activeNav.classList.add("active");
    }

    contentSections.forEach((section) => {
      section.classList.remove("active");
    });

    const targetSection = document.getElementById(`${sectionId}-content`);
    if (targetSection) {
      targetSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const sectionId = item.getAttribute("data-section");
      if (sectionId) {
        activateSection(sectionId);
      }
    });
  });

  if (menuButton) {
    menuButton.addEventListener("click", (e) => {
      e.preventDefault();
      activateSection("about-me");
    });
  }

  // Logo click -> return to landing page
  const logoLink = document.getElementById("logo-home-link");
  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      const landingPage = document.getElementById("landing-page");
      const profilePage = document.getElementById("profile-page");

      if (landingPage && profilePage) {
        profilePage.classList.remove("active");
        landingPage.classList.remove("hidden");
        landingPage.style.opacity = "1";
        landingPage.style.visibility = "visible";

        // Reset landing page elements
        gsap.set(".logo-wrapper", { scale: 1, opacity: 1 });
        gsap.set(".landing-title, .landing-subtitle, .start-button", {
          opacity: 1,
          y: 0,
        });
      }
    });
  }
}
