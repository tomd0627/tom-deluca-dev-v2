const EASE_P3_OUT = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
const EASE_P2_OUT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_P1_IN = 'cubic-bezier(0.42, 0, 1, 1)';

const activeAnims = new WeakMap();

function animateEl(el, keyframes, options, kind = 'enter') {
  const prev = activeAnims.get(el);
  if (prev) {
    try {
      prev.anim.commitStyles();
    } catch {
      // commitStyles/cancel may throw if the animation has already been removed
    }
    prev.anim.cancel();
  }
  const anim = el.animate(keyframes, { fill: 'both', ...options });
  activeAnims.set(el, { anim, kind });
  return anim;
}

const heroReveal = () => {
  const eyebrow = document.querySelector('.hero__eyebrow');
  const words = [...document.querySelectorAll('.hero__title .word')];
  const subtitle = document.querySelector('.hero__subtitle');
  const techStack = document.querySelector('.hero__tech-stack');
  const ctas = [...document.querySelectorAll('.hero__ctas a')];
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');

  // Compute absolute delays (ms) from GSAP timeline's relative offsets
  const eyebrowEnd = 500;
  const wordsStart = eyebrowEnd - 300;
  const wordsEnd = words.length ? wordsStart + (words.length - 1) * 80 + 600 : eyebrowEnd;
  const subtitleStart = wordsEnd - 350;
  const subtitleEnd = subtitleStart + 500;
  const techStart = subtitleEnd - 250;
  const techEnd = techStart + 400;
  const ctasStart = techEnd - 350;
  const ctasEnd = ctas.length ? ctasStart + (ctas.length - 1) * 100 + 450 : techEnd;
  const indicatorStart = ctasEnd - 150;

  if (eyebrow) {
    animateEl(
      eyebrow,
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 500, delay: 0, easing: EASE_P3_OUT }
    );
  }
  words.forEach((word, i) => {
    animateEl(
      word,
      [
        { opacity: 0, transform: 'translateY(40px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 600, delay: wordsStart + i * 80, easing: EASE_P3_OUT }
    );
  });
  if (subtitle) {
    animateEl(
      subtitle,
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 500, delay: subtitleStart, easing: EASE_P3_OUT }
    );
  }
  if (techStack) {
    animateEl(
      techStack,
      [
        { opacity: 0, transform: 'translateY(15px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 400, delay: techStart, easing: EASE_P2_OUT }
    );
  }
  ctas.forEach((cta, i) => {
    animateEl(
      cta,
      [
        { opacity: 0, transform: 'translateY(15px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 450, delay: ctasStart + i * 100, easing: EASE_P2_OUT }
    );
  });
  if (scrollIndicator) {
    animateEl(scrollIndicator, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 350,
      delay: indicatorStart,
      easing: EASE_P2_OUT,
    });
  }
};

function easeOutQuad(t) {
  return t * (2 - t);
}

const countUpStats = () => {
  const counters = document.querySelectorAll('.stat-item__number');
  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.unobserve(entry.target);
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const start = window.performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / 1800, 1);
          el.textContent = Math.round(easeOutQuad(t) * target);
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target;
          }
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.15 }
  );

  counters.forEach((el) => {
    observer.observe(el);
  });
};

let scrollDir = 'down';
{
  let lastY = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y !== lastY) {
        scrollDir = y > lastY ? 'down' : 'up';
      }
      lastY = y;
    },
    { passive: true }
  );
}

const slideAnimation = (elements, staggerMs = 100) => {
  if (!elements.length) {
    return;
  }

  let pending = { enter: [], enterBack: [], leave: [], leaveBack: [] };
  let rafId = null;

  const flush = () => {
    rafId = null;
    pending.enter.forEach((el, i) => {
      animateEl(
        el,
        [
          { opacity: 0, transform: 'translateY(40px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 650, delay: i * staggerMs, easing: EASE_P2_OUT },
        'enter'
      );
    });
    pending.enterBack.forEach((el, i) => {
      animateEl(
        el,
        [
          { opacity: 0, transform: 'translateY(40px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 500, delay: i * staggerMs, easing: EASE_P2_OUT },
        'enterBack'
      );
    });
    pending.leave.forEach((el, i) => {
      animateEl(
        el,
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-20px)' },
        ],
        { duration: 400, delay: i * staggerMs, easing: EASE_P1_IN },
        'leave'
      );
    });
    pending.leaveBack.forEach((el, i) => {
      animateEl(
        el,
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(40px)' },
        ],
        { duration: 400, delay: i * staggerMs, easing: EASE_P1_IN },
        'leaveBack'
      );
    });
    pending = { enter: [], enterBack: [], leave: [], leaveBack: [] };
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // IntersectionObserver fires for ALL elements on the initial observe() call,
        // including below-fold ones that aren't intersecting yet. Skip those — their
        // CSS already provides the correct hidden state and they haven't been entered.
        if (!entry.isIntersecting && !activeAnims.has(entry.target)) {
          return;
        }
        // Ignore re-entry events fired while an enter animation is mid-flight.
        // The element's own translateY movement can cross the threshold a second
        // time during the slide, which would otherwise restart the animation.
        // Leave animations running during re-entry are intentionally NOT suppressed —
        // animateEl will cancel the leave and start the enter instead.
        const active = activeAnims.get(entry.target);
        if (
          entry.isIntersecting &&
          (active?.kind === 'enter' || active?.kind === 'enterBack') &&
          active?.anim?.playState === 'running'
        ) {
          return;
        }
        (entry.isIntersecting
          ? scrollDir === 'down'
            ? pending.enter
            : pending.enterBack
          : scrollDir === 'down'
            ? pending.leave
            : pending.leaveBack
        ).push(entry.target);
      });
      if (!rafId) {
        rafId = requestAnimationFrame(flush);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0 }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
};

const fadeAnimation = (elements = [...document.querySelectorAll('.animate-fade')]) => {
  if (!elements.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('active', entry.isIntersecting);
      });
    },
    { rootMargin: '-15% 0px -15% 0px', threshold: 0 }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
};

export const initializeAnimations = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screenshotMode = new URLSearchParams(window.location.search).has('screenshot');

  if (prefersReducedMotion || screenshotMode) {
    document.querySelectorAll('.animate-slide').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.animate-fade').forEach((el) => {
      el.classList.add('active');
    });
    document
      .querySelectorAll(
        '.hero__eyebrow, .hero__title .word, .hero__subtitle, .hero__tech-stack, .hero__ctas a'
      )
      .forEach((el) => {
        el.style.opacity = '1';
      });
    const si = document.querySelector('.hero__scroll-indicator');
    if (si) {
      si.style.opacity = '1';
    }
    return;
  }

  heroReveal();
  countUpStats();

  const bentoCells = [...document.querySelectorAll('.project-bento .animate-slide')];
  const otherSlides = [...document.querySelectorAll('.animate-slide')].filter(
    (el) => !bentoCells.includes(el)
  );
  slideAnimation(bentoCells);
  slideAnimation(otherSlides);
  fadeAnimation();
};
