import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';

/**
 * Hook để tạo hiệu ứng parallax cho ảnh/phần tử
 * @param {Object} options - Tùy chọn parallax
 * @param {number} options.speed - Tốc độ di chuyển (default: 0.5, càng nhỏ càng chậm)
 * @param {string} options.direction - Hướng di chuyển: 'y' hoặc 'x' (default: 'y')
 */
export function useParallax(options = {}) {
  const { speed = 0.5, direction = 'y' } = options;

  const containerRef = useRef();

  useGSAP(
    () => {
      const element = containerRef.current.querySelector('.js-parallax');
      
      if (!element) return;

      const movement = direction === 'y' ? 'yPercent' : 'xPercent';

      gsap.to(element, {
        [movement]: -20 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}
