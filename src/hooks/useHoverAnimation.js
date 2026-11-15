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
      // Helper contextSafe để cleanup đúng cách
      const ctx = gsap.context(() => {});

      // Primary buttons hover - scale up
      const buttons = containerRef.current.querySelectorAll('.landing-button:not(.outline)');
      
      buttons.forEach((button) => {
        const onEnter = ctx.add(() => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        const onLeave = ctx.add(() => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        button.addEventListener('mouseenter', onEnter);
        button.addEventListener('mouseleave', onLeave);
      });

      // Outline buttons hover - border glow
      const outlineButtons = containerRef.current.querySelectorAll('.landing-button.outline');
      
      outlineButtons.forEach((button) => {
        const onEnter = ctx.add(() => {
          gsap.to(button, {
            borderColor: '#f02b24',
            color: '#f02b24',
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        const onLeave = ctx.add(() => {
          gsap.to(button, {
            borderColor: '#3a3a3a',
            color: '#f5f5f2',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        button.addEventListener('mouseenter', onEnter);
        button.addEventListener('mouseleave', onLeave);
      });

      // Product cards hover - lift effect
      const productCards = containerRef.current.querySelectorAll('.landing-product');
      
      productCards.forEach((card) => {
        const img = card.querySelector('.product-image img');
        
        const onEnter = ctx.add(() => {
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
        });

        const onLeave = ctx.add(() => {
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
        });

        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
      });

      // Color swatches - bounce effect
      const swatches = containerRef.current.querySelectorAll('.landing-swatches button');
      
      swatches.forEach((swatch) => {
        const onEnter = ctx.add(() => {
          if (!swatch.classList.contains('selected')) {
            gsap.to(swatch, {
              scale: 1.15,
              rotation: 5,
              duration: 0.3,
              ease: 'back.out(1.7)',
            });
          }
        });

        const onLeave = ctx.add(() => {
          if (!swatch.classList.contains('selected')) {
            gsap.to(swatch, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        });

        swatch.addEventListener('mouseenter', onEnter);
        swatch.addEventListener('mouseleave', onLeave);
      });

      // Links hover - arrow shift
      const links = containerRef.current.querySelectorAll('.red-link, .product-name');
      
      links.forEach((link) => {
        const icon = link.querySelector('svg');
        
        const onEnter = ctx.add(() => {
          if (icon) {
            gsap.to(icon, {
              x: 4,
              y: -4,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        });

        const onLeave = ctx.add(() => {
          if (icon) {
            gsap.to(icon, {
              x: 0,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        });

        link.addEventListener('mouseenter', onEnter);
        link.addEventListener('mouseleave', onLeave);
      });

      // FAQ details hover
      const details = containerRef.current.querySelectorAll('details summary');
      
      details.forEach((summary) => {
        const onEnter = ctx.add(() => {
          gsap.to(summary, {
            x: 4,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        const onLeave = ctx.add(() => {
          gsap.to(summary, {
            x: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        summary.addEventListener('mouseenter', onEnter);
        summary.addEventListener('mouseleave', onLeave);
      });

      return () => ctx.revert();
    },
    { scope: containerRef }
  );

  return containerRef;
}
