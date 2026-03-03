/**
 * Theme toggle: dark <-> light
 * - Reads/writes localStorage key 'theme'
 * - Toggles [data-theme="light"] on <html>
 * - Falls back to OS preference on first visit
 */
export const initializeThemeToggle = () => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const html = document.documentElement;

  const getTheme = () => html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

  const setTheme = (theme) => {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  };

  btn.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
};
