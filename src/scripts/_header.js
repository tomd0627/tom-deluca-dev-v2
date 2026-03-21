export const initializeHeader = () => {
  const body = document.body;

  // Header utilities
  const header = document.querySelector('.header');

  if (header !== null) {
    // Nav toggle on mobile
    const menuToggle = document.querySelector('.header__menu-toggle');
    const menuLinks = document.querySelectorAll('.header__nav__anchor');
    const sections = document.querySelectorAll('section');

    const toggleHeaderNav = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = body.classList.toggle('show-nav');
      menuToggle.setAttribute('aria-expanded', isOpen);
    };

    const closeHeaderNav = () => {
      body.classList.remove('show-nav');
    };

    if (menuToggle !== null) {
      menuToggle.addEventListener('click', toggleHeaderNav);
      menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleHeaderNav(e);
        }
        if (e.key === 'Escape') {
          closeHeaderNav();
          menuToggle.focus();
        }
      });
    } else {
      return;
    }

    if (menuLinks !== null) {
      // Close mobile nav on link click. Smooth scrolling handled globally by _smoothScroll.js
      menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeHeaderNav();
        });
        // Close menu on Escape while focused on a nav link
        link.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            closeHeaderNav();
            menuToggle.focus();
          }
        });
      });

      // Highlight 'active' section on scroll (mobile and desktop)
      const options = {
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const navId = entry.target.id === 'personal-projects' ? 'projects' : entry.target.id;
            const selector = `.header__nav__anchor[href="#${navId}"]`;
            const activeLink = document.querySelector(selector);

            if (activeLink) {
              menuLinks.forEach((link) => {
                link.classList.remove('active');
              });
              activeLink.classList.add('active');
            }
          }
        });
      }, options);

      sections.forEach((section) => {
        observer.observe(section);
      });
    } else {
      return;
    }

    body.addEventListener('click', () => {
      closeHeaderNav();
    });
  } else {
    return;
  }
};
