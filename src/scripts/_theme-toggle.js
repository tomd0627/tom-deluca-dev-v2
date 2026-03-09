/**
 * Theme toggle: dark <-> light
 * - Reads/writes localStorage key 'theme'
 * - Toggles [data-theme="light"] on <html>
 * - Falls back to OS preference on first visit
 */
export const initializeThemeToggle = () => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) {
    return;
  }

  const html = document.documentElement;

  const getTheme = () => (html.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  const applyTheme = (theme) => {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    const favicon = document.getElementById('site-favicon');
    if (favicon) {
      favicon.href = `/favicon-${theme}.svg`;
    }
  };

  const setTheme = (theme) => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  };

  btn.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  // Keep in sync with OS preference changes, but only when the user
  // hasn't explicitly overridden via the toggle.
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
};
