import { useRef, useEffect } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * Hook để đếm số từ 0 đến giá trị target khi vào viewport
 * @param {number} target - Số đích cần đếm đến
 * @param {Object} options - Tùy chọn
 * @param {number} options.duration - Thời gian đếm (default: 2)
 * @param {string} options.ease - Easing function (default: 'power2.out')
 * @param {Function} options.formatter - Hàm format số (default: Math.round)
 */
export function useCounter(target, options = {}) {
  const {
    duration = 2,
    ease = 'power2.out',
    formatter = Math.round,
  } = options;

  const elementRef = useRef();
  const counterRef = useRef({ value: 0 });

  useGSAP(
    () => {
      if (!elementRef.current) return;

      gsap.to(counterRef.current, {
        value: target,
        duration,
        ease,
        onUpdate: () => {
          if (elementRef.current) {
            elementRef.current.textContent = formatter(counterRef.current.value);
          }
        },
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: elementRef, dependencies: [target] }
  );

  return elementRef;
}
