import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";

export default function useTeamPageAnimation() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const hero = containerRef.current.querySelector(".team-hero");
        const infinity = containerRef.current.querySelector(".team-infinity");

        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".team-hero-title h1", {
            autoAlpha: 0,
            y: 48,
            duration: 0.9,
          })
          .from(".team-hero-subtitle", {
            autoAlpha: 0,
            y: 20,
            duration: 0.6,
          }, "-=0.55")
          .from(infinity, {
            autoAlpha: 0,
            scale: 0.86,
            rotation: -12,
            duration: 1,
          }, "-=0.35")
          .from(".team-intro-copy > *", {
            autoAlpha: 0,
            y: 24,
            stagger: 0.12,
            duration: 0.65,
          }, "-=0.55");

        if (hero && infinity) {
          gsap.to(infinity, {
            rotation: 12,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        const reveal = (targets, trigger, options = {}) => {
          gsap.from(targets, {
            autoAlpha: 0,
            y: 38,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
            ...options,
          });
        };

        const memberGrid = containerRef.current.querySelector(".team-member-grid");
        if (memberGrid) {
          reveal(
            containerRef.current.querySelectorAll(".team-section-heading, .team-member"),
            memberGrid,
            { stagger: 0.09 }
          );
        }

        const values = containerRef.current.querySelector(".team-values");
        if (values) {
          reveal(
            values.querySelectorAll(".team-eyebrow, .team-values-intro, .team-values-grid article"),
            values,
            { stagger: 0.12 }
          );
        }

        const contact = containerRef.current.querySelector(".team-contact");
        if (contact) {
          reveal(
            contact.querySelectorAll(".team-eyebrow, .team-contact-top > div, .team-contact-arrow, .team-signature"),
            contact
          );
        }
      });

      return () => media.revert();
    },
    { scope: containerRef }
  );

  return containerRef;
}
