import { gsap } from 'gsap';

/**
 * GSAP Animation Utilities
 * Reusable animation functions for consistent effects across the app
 */

/**
 * Fade in animation for page load
 */
export const fadeIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    }
  );
};

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeIn = (elements, staggerDelay = 0.1) => {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'power2.out',
    }
  );
};

/**
 * Scale animation on hover
 */
export const scaleOnHover = (element) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
};

/**
 * Slide in from left
 */
export const slideInLeft = (element, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    }
  );
};

/**
 * Slide in from right
 */
export const slideInRight = (element, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: 100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
    }
  );
};

/**
 * Rotate and fade in animation
 */
export const rotateIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      rotation: -10,
      scale: 0.8,
    },
    {
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.8,
      delay,
      ease: 'back.out(1.7)',
    }
  );
};

/**
 * Counter animation for numbers
 */
export const animateNumber = (element, endValue, duration = 1) => {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      element.textContent = Math.floor(obj.value);
    },
  });
};

/**
 * Pulse animation for alerts
 */
export const pulse = (element) => {
  gsap.to(element, {
    scale: 1.1,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut',
  });
};

/**
 * Card reveal animation
 */
export const cardReveal = (cards) => {
  gsap.fromTo(
    cards,
    {
      opacity: 0,
      y: 50,
      rotationX: -15,
    },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    }
  );
};
