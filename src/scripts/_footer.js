export const initializeFooter = () => {
  // Footer utilities
  const footer = document.querySelector('.footer');

  if (footer !== null) {
    // Populate copyright year
    const date = new Date();
    const year = date.getFullYear();
    const copyrightYear = document.querySelector('.footer__copyright-year');

    copyrightYear.textContent = year;
  }
};
