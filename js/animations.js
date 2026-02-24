function animateProfileEntrance() {
  gsap.from(".profile-header", {
    y: -60,
    opacity: 0,
    duration: 0.6,
    ease: "power3.out",
  });

  gsap.from(".sidebar", {
    x: -60,
    opacity: 0,
    duration: 0.7,
    delay: 0.2,
    ease: "power3.out",
    clearProps: "transform",
  });

  gsap.from(".nav-item", {
    x: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    delay: 0.4,
    ease: "power2.out",
  });

  gsap.from(".content-area", {
    y: 60,
    opacity: 0,
    duration: 0.7,
    delay: 0.3,
    ease: "power3.out",
  });

  gsap.from(".profile-card", {
    scale: 0.95,
    opacity: 0,
    duration: 0.6,
    delay: 0.6,
    ease: "back.out(1.2)",
  });
}
