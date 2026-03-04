import { gsap } from 'gsap';

const STORAGE_KEY = 'cursor-follower';

/**
 * Custom cursor follower — desktop only (disabled on touch devices).
 * Uses GSAP quickTo for smooth lag effect.
 * The cursor element (.cursor-follower) is created here and styled in _base.scss.
 * Toggleable via #cursor-toggle button; preference persisted in localStorage.
 */
export const initializeCursor = () => {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    return;
  }

  const toggleBtn = document.getElementById('cursor-toggle');

  // Default to disabled unless explicitly enabled
  let enabled = localStorage.getItem(STORAGE_KEY) === 'on';

  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  const applyState = () => {
    gsap.to(cursor, {
      opacity: enabled ? 0.6 : 0,
      duration: 0.2,
      onComplete: () => {
        cursor.style.pointerEvents = enabled ? '' : 'none';
      },
    });
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', String(enabled));
    }
  };

  // GSAP quickTo gives the cursor a smooth lag behind the pointer
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    if (!enabled) {
      return;
    }
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // Scale up on interactive elements
  const interactiveSelectors =
    'a, button, .project-bento__cell, .value-card, .skill-card-list__item';

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (!enabled) {
        return;
      }
      gsap.to(cursor, { scale: 3, opacity: 0.3, duration: 0.25, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      if (!enabled) {
        return;
      }
      gsap.to(cursor, { scale: 1, opacity: 0.6, duration: 0.25, ease: 'power2.out' });
    });
  });

  // Hide cursor when it leaves the window
  document.addEventListener('mouseleave', () => {
    if (!enabled) {
      return;
    }
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', () => {
    if (!enabled) {
      return;
    }
    gsap.to(cursor, { opacity: 0.6, duration: 0.2 });
  });

  // Toggle button
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      enabled = !enabled;
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
      applyState();
    });
  }

  applyState();
};
