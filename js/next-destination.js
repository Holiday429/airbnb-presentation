/* ========================================
   Next Destination Page — Interactive Logic
   ======================================== */

function initNextDestination() {
  const page = document.querySelector('.nd-page');
  if (!page) return;

  // Trigger entrance animation when section becomes active
  const section = document.getElementById('next-destination-content');
  if (section) {
    const observer = new MutationObserver(() => {
      if (section.classList.contains('active')) {
        requestAnimationFrame(() => {
          page.classList.add('is-visible');
        });
      }
    });
    observer.observe(section, { attributes: true, attributeFilter: ['class'] });

    // Also check if already active on init
    if (section.classList.contains('active')) {
      page.classList.add('is-visible');
    }
  }

  // Chapter accordion
  const chapters = page.querySelectorAll('.nd-chapter');

  chapters.forEach((chapter) => {
    const trigger = chapter.querySelector('.nd-chapter-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = chapter.classList.contains('is-open');

      // Close all
      chapters.forEach((c) => c.classList.remove('is-open'));

      // Toggle current
      if (!isOpen) {
        chapter.classList.add('is-open');
        // Smooth scroll into view if needed
        setTimeout(() => {
          chapter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
      }
    });
  });
}
