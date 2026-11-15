import { useRef, useEffect } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';

/**
 * Hook để tự động điều chỉnh animation dựa trên:
 * - prefers-reduced-motion
 * - kích thước màn hình (giảm animation trên mobile)
 * 
 * Sử dụng gsap.matchMedia() để responsive
 */
export function useResponsiveAnimation(callback, deps = []) {
  const containerRef = useRef();

  useGSAP(
    () => {
      // Kiểm tra prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // Tắt hầu hết animation, chỉ giữ opacity
        gsap.set(containerRef.current.querySelectorAll('.js-reveal'), {
          autoAlpha: 1,
        });
        return;
      }

      // Responsive animation với matchMedia
      const mm = gsap.matchMedia();

      mm.add(
        {
          // Desktop: full animation
          isDesktop: '(min-width: 1024px)',
          // Tablet: giảm movement
          isTablet: '(min-width: 768px) and (max-width: 1023px)',
          // Mobile: tối giản
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop, isTablet, isMobile } = context.conditions;

          // Gọi callback với context
          if (typeof callback === 'function') {
            callback(context);
          }

          return () => {
            // Cleanup nếu cần
          };
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: deps }
  );

  return containerRef;
}

/**
 * Hook để refresh ScrollTrigger sau khi load ảnh/font
 * Tránh layout bị lệch
 */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    // Refresh sau khi ảnh load
    const images = document.querySelectorAll('img');
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        ScrollTrigger.refresh();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
        img.addEventListener('error', checkAllLoaded);
      }
    });

    // Refresh sau khi font load (nếu có)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Cleanup
    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', checkAllLoaded);
        img.removeEventListener('error', checkAllLoaded);
      });
    };
  }, []);
}
