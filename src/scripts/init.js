import { initializeAnimations } from './_animations';
import { initializeFooter } from './_footer';
import { initializeHeader } from './_header';
import { initializeUtills } from './_utils';
import { initializeSmoothScroll } from './_smoothScroll';
import { initializeFormValidation } from './_formValidation';
import { initializeThemeToggle } from './_theme-toggle';
import { initializeCursor } from './_cursor';

export const initialize = () => {
  initializeThemeToggle();
  initializeCursor();
  initializeUtills();
  // Global smooth-scroll for same-page anchor links
  initializeSmoothScroll({ headerSelector: '.header' });
  initializeHeader();
  initializeFooter();
  initializeAnimations();
  initializeFormValidation('.form');
};
