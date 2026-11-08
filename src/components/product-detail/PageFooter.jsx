import { useRef } from "react";
import { IconRefresh, IconShieldCheck, IconTruck } from "@tabler/icons-react";
import { gsap, useGSAP } from "../../lib/gsap";

export default function PageFooter() {
  const footerRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(footerRef.current, {
          autoAlpha: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        });
      });
      return () => media.revert();
    },
    { scope: footerRef }
  );

  return (
    <footer ref={footerRef} className="thread-footer" data-node-id="3:1210">
      <strong>8THREADS / NHỊP GÕ CỦA BẠN.</strong>
      <div>
        <span>
          <IconTruck size={17} />
          Miễn phí vận chuyển
        </span>
        <span>
          <IconShieldCheck size={17} />
          Bảo hành 24 tháng
        </span>
        <span>
          <IconRefresh size={17} />
          Đổi mới trong 7 ngày
        </span>
      </div>
    </footer>
  );
}
