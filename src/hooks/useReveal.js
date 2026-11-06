import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';

/**
 * Hook để reveal elements khi scroll vào viewport
 * @param {Object} options - Tùy chọn animation
 * @param {number} options.y - Độ dịch chuyển theo trục Y (default: 60)
 * @param {number} options.stagger - Delay giữa các phần tử (default: 0.12)
 * @param {number} options.duration - Thời gian animation (default: 0.8)
 * @param {string} options.ease - Easing function (default: 'power3.out')
 */
export function useReveal(options = {}) {
  const {
    y = 60,
    stagger = 0.12,
    duration = 0.8,
    ease = 'power3.out',
  } = options;

  const containerRef = useRef();

  useGSAP(
    () => {
      const elements = containerRef.current.querySelectorAll('.js-reveal');
      
      if (elements.length === 0) return;

      // Set trạng thái ban đầu
      gsap.set(elements, {
        autoAlpha: 0,
        y: y,
      });

      // Animate khi vào viewport
      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}
