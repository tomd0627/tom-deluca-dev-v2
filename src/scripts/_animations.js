import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero text reveal — staggered word-by-word slide-up on page load.
 * Targets .word spans inside .hero__title, plus eyebrow, subtitle, and CTAs.
 */
const heroReveal = () => {
  const tl = gsap.timeline({ delay: 0.2 });

  tl.from('.hero__eyebrow', {
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
  })
    .from(
      '.hero__title .word',
      {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      },
      '-=0.3'
    )
    .from(
      '.hero__subtitle',
      {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      },
      '-=0.4'
    )
    .from(
      '.hero__ctas a',
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      },
      '-=0.4'
    )
    .from(
      '.hero__scroll-indicator',
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.2'
    );
};

/**
 * Stats count-up — GSAP textContent tween that fires once on scroll entry.
 * Each .stat-item__number must have a data-target attribute with the end value.
 */
const countUpStats = () => {
  const counters = gsap.utils.toArray('.stat-item__number');

  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.target, 10);

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          counter,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.8,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
              counter.textContent = Math.round(parseFloat(counter.textContent));
            },
            onComplete: () => {
              counter.textContent = target;
            },
          }
        );
      },
    });
  });
};

/**
 * Slide animation — improved easing for cards and staggered content.
 */
const slideAnimation = (slideElements = gsap.utils.toArray('.animate-slide'), staggerVal = 0.1) => {
  if (!slideElements.length) {
    return;
  }

  gsap.set(slideElements, { opacity: 0, y: 40 });

  ScrollTrigger.batch(slideElements, {
    start: 'top 88%',
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: staggerVal,
        ease: 'power2.out',
      }),
    onEnterBack: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: staggerVal,
        ease: 'power2.out',
      }),
    onLeave: (els) =>
      gsap.to(els, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        stagger: staggerVal,
        ease: 'power1.in',
      }),
    onLeaveBack: (els) =>
      gsap.to(els, {
        opacity: 0,
        y: 40,
        duration: 0.4,
        stagger: staggerVal,
        ease: 'power1.in',
      }),
  });
};

/**
 * Fade animation — CSS class toggle via ScrollTrigger for .animate-fade elements.
 */
const fadeAnimation = (
  fadeElements = gsap.utils.toArray('.animate-fade'),
  fadeStart = 'top 85%',
  fadeEnd = 'bottom 15%'
) => {
  fadeElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        start: fadeStart,
        end: fadeEnd,
        trigger: el,
        toggleClass: 'active',
      },
    });
  });
};

/**
 * Parallax hero background — pseudo-element gradient moves at 30% scroll rate.
 * Note: GSAP cannot directly animate pseudo-elements. This animates a data
 * attribute instead, and the CSS uses it via a custom property workaround.
 * As a practical alternative we animate the hero section's background-position.
 */
const parallaxHero = () => {
  const hero = document.querySelector('.section--hero');
  if (!hero) {
    return;
  }

  gsap.to(hero, {
    backgroundPositionY: '30%',
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
};

export const initializeAnimations = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Make all animated elements immediately visible — no motion
    document.querySelectorAll('.animate-slide').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.animate-fade').forEach((el) => {
      el.classList.add('active');
    });
    return;
  }

  heroReveal();
  countUpStats();

  // Bento cells get their own batch so they stagger only among themselves,
  // row by row, without competing with other sections' animate-slide elements.
  const bentoCells = gsap.utils.toArray('.project-bento .animate-slide');
  const otherSlides = gsap.utils.toArray('.animate-slide').filter((el) => !bentoCells.includes(el));
  slideAnimation(bentoCells);
  slideAnimation(otherSlides);

  fadeAnimation();
  parallaxHero();
};
