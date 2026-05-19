// Reusable smooth scroll module
export const initializeSmoothScroll = ({
  selector = 'a[href^="#"]',
  headerSelector = null,
  offset = 0,
  updateHash = true,
} = {}) => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getHeaderOffset = () => {
    if (!headerSelector) {
      return offset;
    }
    const header = document.querySelector(headerSelector);
    if (!header) {
      return offset;
    }
    const styles = getComputedStyle(header);
    if (styles.position === 'fixed' || styles.position === 'sticky') {
      return header.getBoundingClientRect().height + offset;
    }
    return offset;
  };

  const scrollToTarget = (target) => {
    if (!target) {
      return;
    }
    const top = Math.max(
      0,
      target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset()
    );
    if (prefersReduced) {
      window.scrollTo(0, top);
      setFocusToTarget(target);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      window.scrollTo({ top, behavior: 'smooth' });
      // Resolve after approximate duration using event polling
      const checkIfDone = () => {
        const atTarget = Math.abs(window.pageYOffset - top) <= 2;
        if (atTarget) {
          return resolve();
        }
        requestAnimationFrame(checkIfDone);
      };
      requestAnimationFrame(checkIfDone);
    }).then(() => {
      setFocusToTarget(target);
    });
  };

  const setFocusToTarget = (target) => {
    try {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      // Remove tabindex after focus to restore normal tab order
      target.addEventListener(
        'blur',
        () => {
          target.removeAttribute('tabindex');
        },
        { once: true }
      );
    } catch {
      // Silently fail if focus cannot be set
    }
  };

  const clickHandler = (e) => {
    const el = e.target.closest && e.target.closest(selector);
    if (!el) {
      return;
    }
    const href = el.getAttribute('href') || el.dataset.scrollTarget;
    if (!href) {
      return;
    }
    // Only handle same-page hash links
    if (href.startsWith('#')) {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      e.preventDefault();

      scrollToTarget(target).then(() => {
        if (updateHash) {
          history.pushState(null, '', `#${id}`);
        }
      });
    }
  };

  document.addEventListener('click', clickHandler, { passive: false });

  return {
    destroy: () => {
      document.removeEventListener('click', clickHandler);
    },
  };
};
