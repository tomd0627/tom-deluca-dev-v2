const STORAGE_KEY = 'cursor-follower';
const LERP_POS = 0.15;
const LERP_SCALE = 0.2;

/**
 * Custom cursor follower — desktop only (disabled on touch devices).
 * Replaces GSAP quickTo with a rAF lerp loop; opacity fades via CSS transition.
 * The cursor element (.cursor-follower) is created here and styled in styles.css.
 * Toggleable via #cursor-toggle button; preference persisted in localStorage.
 */
export const initializeCursor = () => {
  if (window.matchMedia('(hover: none)').matches) {
    return;
  }

  const toggleBtn = document.getElementById('cursor-toggle');
  let enabled = localStorage.getItem(STORAGE_KEY) === 'on';

  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  // Lerp state — position and scale interpolated every frame
  let tx = 0,
    ty = 0;
  let cx = 0,
    cy = 0;
  let ts = 1,
    cs = 1;
  let initialized = false;

  const tick = () => {
    cx += (tx - cx) * LERP_POS;
    cy += (ty - cy) * LERP_POS;
    cs += (ts - cs) * LERP_SCALE;
    // calc(Xpx - 50%) centers the dot on the cursor position
    cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%)) scale(${cs})`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const applyState = () => {
    cursor.style.opacity = enabled ? '0.6' : '0';
    cursor.style.pointerEvents = enabled ? '' : 'none';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', String(enabled));
    }
  };

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    // Snap to mouse on first move to avoid crawling in from (0, 0)
    if (!initialized) {
      cx = tx;
      cy = ty;
      initialized = true;
    }
  });

  const interactiveSelectors =
    'a, button, .project-bento__cell, .value-card, .skill-card-list__item';

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (!enabled) {
        return;
      }
      ts = 3;
      cursor.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      if (!enabled) {
        return;
      }
      ts = 1;
      cursor.style.opacity = '0.6';
    });
  });

  document.addEventListener('mouseleave', () => {
    if (!enabled) {
      return;
    }
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (!enabled) {
      return;
    }
    cursor.style.opacity = '0.6';
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      enabled = !enabled;
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
      applyState();
    });
  }

  applyState();
};
