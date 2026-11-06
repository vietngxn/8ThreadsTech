import { useRef, useEffect } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';

/**
 * Hook để tạo hiệu ứng navbar ẩn/hiện khi scroll
 * - Ẩn khi scroll xuống
 * - Hiện khi scroll lên
 * - Đổi background khi qua hero section
 */
export function useNavbar() {
  const navRef = useRef();

  useGSAP(() => {
    let lastScroll = 0;

    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: (self) => {
        const currentScroll = self.scroll();
        
        if (currentScroll > lastScroll && currentScroll > 150) {
          // Scroll xuống - ẩn navbar
          gsap.to(navRef.current, {
            yPercent: -100,
            duration: 0.3,
            ease: 'power2.in',
          });
        } else if (currentScroll < lastScroll) {
          // Scroll lên - hiện navbar
          gsap.to(navRef.current, {
            yPercent: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
        
        lastScroll = currentScroll;
      },
    });

    // Đổi background khi scroll qua hero
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top -100',
      end: 99999,
      onEnter: () => {
        gsap.to(navRef.current, {
          backgroundColor: 'rgba(9, 9, 9, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottomColor: '#2c2c2c',
          duration: 0.3,
        });
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          backgroundColor: 'rgba(9, 9, 9, 0)',
          backdropFilter: 'blur(0px)',
          borderBottomColor: '#2c2c2c',
          duration: 0.3,
        });
      },
    });
  });

  return navRef;
}
