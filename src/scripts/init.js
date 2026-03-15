import { initializeFooter } from './_footer';
import { initializeHeader } from './_header';
import { initializeSmoothScroll } from './_smoothScroll';
import { initializeThemeToggle } from './_theme-toggle';
import { initializeUtills } from './_utils';

export const initialize = () => {
  initializeThemeToggle();
  initializeUtills();
  // Global smooth-scroll for same-page anchor links
  initializeSmoothScroll({ headerSelector: '.header' });
  initializeHeader();
  initializeFooter();
  // Defer GSAP-dependent modules past initial paint to avoid forced reflow,
  // reduce main-thread work, and keep GSAP out of the critical-path bundle.
  requestAnimationFrame(() => {
    import('./_animations').then(({ initializeAnimations }) => initializeAnimations());
    import('./_cursor').then(({ initializeCursor }) => initializeCursor());
  });
  if (document.querySelector('.form')) {
    import('./_formValidation').then(({ initializeFormValidation }) => {
      initializeFormValidation('.form');
    });
  }
};
