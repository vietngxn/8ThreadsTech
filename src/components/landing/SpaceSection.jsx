import { useRef } from 'react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import desk from '../../assets/landing-desk.png';

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function SpaceSection({ onComingSoon }) {
  const spaceRef = useRef();

  useGSAP(
    () => {
      // Parallax cho background image
      gsap.to(spaceRef.current, {
        backgroundPosition: 'center 20%',
        ease: 'none',
        scrollTrigger: {
          trigger: spaceRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Reveal content
      const elements = spaceRef.current.querySelectorAll('.js-reveal');
      
      gsap.set(elements, {
        autoAlpha: 0,
        y: 60,
      });

      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: spaceRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: spaceRef }
  );

  return (
    <section 
      ref={spaceRef}
      className="space-section" 
      id="space" 
      style={{ 
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.08)), url(${desk})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }} 
      data-node-id="36:5344"
    >
      <div>
        <Label>
          <span className="js-reveal">06 / YOUR SPACE. YOUR RULES.</span>
        </Label>
        <h2 className="js-reveal">
          BẬT CHẤT RIÊNG.<br />TỪ GÓC BÀN.
        </h2>
        <p className="js-reveal">
          Bàn phím không chỉ để gõ. Đó là điểm bắt đầu của một không gian khiến bạn muốn ngồi xuống, tập trung và tạo nên điều khác biệt.
        </p>
        <button 
          className="landing-button outline js-reveal" 
          onClick={() => onComingSoon("Keycap và phụ kiện")}
        >
          KHÁM PHÁ KEYCAP &amp; PHỤ KIỆN <IconArrowUpRight size={18} />
        </button>
      </div>
      <span>8THREADS / DESK INSPIRATION</span>
    </section>
  );
}
