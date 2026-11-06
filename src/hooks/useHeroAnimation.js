import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';
import { IconArrowDown } from '@tabler/icons-react';
import keyboard from '../assets/thread-keyboard.png';

export default function HeroSection() {
  const containerRef = useRef();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Hero load animation
      tl.from('.js-hero-title-1', {
        autoAlpha: 0,
        y: 80,
        scale: 0.9,
        duration: 1.2,
      })
        .from(
          '.js-hero-title-2',
          {
            autoAlpha: 0,
            y: 80,
            scale: 0.9,
            duration: 1.2,
          },
          '-=0.9'
        )
        .from(
          '.js-hero-keyboard',
          {
            autoAlpha: 0,
            scale: 0.85,
            rotation: -5,
            duration: 1.4,
          },
          '-=0.8'
        )
        .from(
          '.js-hero-orbit',
          {
            scale: 0.5,
            rotation: -30,
            autoAlpha: 0,
            duration: 1.2,
          },
          '-=1.2'
        )
        .from(
          '.js-hero-copy > *',
          {
            autoAlpha: 0,
            y: 40,
            stagger: 0.15,
            duration: 0.8,
          },
          '-=0.6'
        )
        .from(
          '.js-hero-meta',
          {
            autoAlpha: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
          },
          '-=0.4'
        );

      // Parallax cho keyboard
      gsap.to('.js-hero-keyboard', {
        y: -40,
        rotation: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax cho orbit
      gsap.to('.js-hero-orbit', {
        rotation: 20,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}
