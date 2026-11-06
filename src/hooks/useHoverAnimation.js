import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * Hook để tạo hover animation cho buttons và interactive elements
 * Sử dụng contextSafe để đảm bảo cleanup đúng cách
 */
export function useHoverAnimation() {
  const containerRef = useRef();

  useGSAP(
    () => {
      // Buttons hover - scale up with slight rotation
      const buttons = containerRef.current.querySelectorAll('.landing-button:not(.outline)');
      
      buttons.forEach((button) => {
        const onEnter = () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const onLeave = () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        button.addEventListener('mouseenter', onEnter);
        button.addEventListener('mouseleave', onLeave);
      });

      // Product cards hover - lift effect
      const productCards = containerRef.current.querySelectorAll('.landing-product');
      
      productCards.forEach((card) => {
        const img = card.querySelector('.product-image img');
        
        const onEnter = () => {
          gsap.to(card, {
            y: -8,
            duration: 0.4,
            ease: 'power2.out',
          });
          
          if (img) {
            gsap.to(img, {
              scale: 1.08,
              rotation: 2,
              duration: 0.5,
              ease: 'power2.out',
            });
          }
        };

        const onLeave = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          });
          
          if (img) {
            gsap.to(img, {
              scale: 1,
              rotation: 0,
              duration: 0.5,
              ease: 'power2.out',
            });
          }
        };

        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
      });

      // Color swatches - bounce effect
      const swatches = containerRef.current.querySelectorAll('.landing-swatches button');
      
      swatches.forEach((swatch) => {
        const onEnter = () => {
          if (!swatch.classList.contains('selected')) {
            gsap.to(swatch, {
              scale: 1.15,
              rotation: 5,
              duration: 0.3,
              ease: 'back.out(1.7)',
            });
          }
        };

        const onLeave = () => {
          if (!swatch.classList.contains('selected')) {
            gsap.to(swatch, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        };

        swatch.addEventListener('mouseenter', onEnter);
        swatch.addEventListener('mouseleave', onLeave);
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}
