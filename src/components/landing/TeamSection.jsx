import { useRef } from 'react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function TeamSection() {
  const teamRef = useRef();

  useGSAP(
    () => {
      // Reveal elements
      const elements = teamRef.current.querySelectorAll('.js-reveal');
      
      gsap.set(elements, {
        autoAlpha: 0,
        y: 60,
      });

      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: teamRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate infinity SVG với scale + rotation
      const infinity = teamRef.current.querySelector('.team-infinity');
      
      if (infinity) {
        gsap.from(infinity, {
          scale: 0,
          rotation: -180,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: infinity,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // Continuous slow rotate
        gsap.to(infinity, {
          rotation: 360,
          duration: 40,
          repeat: -1,
          ease: 'none',
          scrollTrigger: {
            trigger: infinity,
            start: 'top 85%',
          },
        });
      }
    },
    { scope: teamRef }
  );

  return (
    <section ref={teamRef} className="landing-section team-section" id="team" data-node-id="36:5357">
      <div>
        <Label>
          <span className="js-reveal">07 / VỀ 8THREADS TEAM</span>
        </Label>
        <svg className="team-infinity js-reveal" viewBox="0 0 540 175" fill="none" aria-hidden="true">
          {[0, 10, 20, 30, 40].map((n) => (
            <path 
              key={n} 
              d={`M 15 ${87+n/4} C 60 ${-20+n}, 155 ${-15+n}, 270 87 C 385 ${190-n}, 480 ${195-n}, 525 ${87-n/4} C 480 ${-20+n}, 385 ${-15+n}, 270 87 C 155 ${190-n}, 60 ${195-n}, 15 ${87+n/4}`} 
              stroke="#f02b24" 
              strokeWidth="1" 
              opacity=".8" 
            />
          ))}
        </svg>
        <small className="js-reveal">CHÍN CÁ TÍNH. MỘT NHỊP CHUNG.</small>
      </div>
      <div>
        <h2 className="js-reveal">
          KẾT NỐI TỪ<br />NHỮNG KHÁC BIỆT.
        </h2>
        <p className="js-reveal">
          8Threads Team gồm 9 thành viên đến từ khoa Kĩ thuật phần mềm IUH. Những cá tính khác nhau, cùng gặp nhau trong tinh thần sáng tạo và kết nối.
        </p>
        <a className="red-link js-reveal" href="mailto:hello@8threadtech.vn">
          GẶP GỠ 8THREADS TEAM <IconArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
