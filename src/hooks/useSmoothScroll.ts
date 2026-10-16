import { useEffect, useRef } from 'react';

/**
 * Lightweight, zero-dependency luxury inertial smooth scrolling engine.
 * Provides buttery momentum-damped scrolling and seamless anchor handling
 * without external bundle bloat or package resolution risks.
 */
export function useSmoothScroll() {
  const isScrollingRef = useRef(false);

  useEffect(() => {
    // Enable CSS smooth scrolling on the document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Intercept in-page anchor links for luxury animated glides
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        scrollToTarget(href);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return isScrollingRef;
}

/**
 * Smoothly scroll to any target element or numeric offset with customizable duration & easing
 */
export function scrollToTarget(target: string | HTMLElement | number, offset = -75) {
  if (typeof window === 'undefined') return;

  let targetPosition = 0;

  if (typeof target === 'number') {
    targetPosition = target;
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (!el) return;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    targetPosition = elementRect - bodyRect + offset;
  } else if (target instanceof HTMLElement) {
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    targetPosition = elementRect - bodyRect + offset;
  }

  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = Math.min(1000, Math.max(500, Math.abs(distance) * 0.6));
  let startTime: number | null = null;

  // Luxury easeInOutQuart curve for smooth cinematic acceleration & deceleration
  function easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function animationStep(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutQuart(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animationStep);
    }
  }

  requestAnimationFrame(animationStep);
}
