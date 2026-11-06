import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';

/**
 * Hook animation cho stats section với counter effect
 */
export function useStatsAnimation() {
  const containerRef = useRef();

  useGSAP(
    () => {
      // Animate stats numbers với counter effect
      const stats = containerRef.current.querySelectorAll('.landing-stats strong');
      
      stats.forEach((stat) => {
        const text = stat.textContent;
        const hasPercent = text.includes('%');
        const hasHz = text.includes('Hz');
        const hasMode = text.includes('chế độ');
        
        let targetValue;
        if (hasPercent) {
          targetValue = parseInt(text);
        } else if (hasHz) {
          targetValue = 1000;
        } else if (hasMode) {
          targetValue = 3;
        } else {
          return; // Skip if not a number
        }

        const counter = { value: 0 };
        
        gsap.to(counter, {
          value: targetValue,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            if (hasPercent) {
              stat.textContent = `${Math.round(counter.value)}%`;
            } else if (hasHz) {
              stat.textContent = `${Math.round(counter.value).toLocaleString('de-DE')} Hz`;
            } else if (hasMode) {
              stat.textContent = `${Math.round(counter.value)} chế độ`;
            }
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Animate stat items
      const items = containerRef.current.querySelectorAll('.landing-stats > div');
      gsap.from(items, {
        autoAlpha: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
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
