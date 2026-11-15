import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function ConnectionSection() {
  const connectionRef = useRef();

  useGSAP(
    () => {
      // Reveal elements
      const elements = connectionRef.current.querySelectorAll('.js-reveal');
      
      gsap.set(elements, {
        autoAlpha: 0,
        y: 70,
      });

      gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: connectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate wave bars với stagger
      const waveBars = connectionRef.current.querySelectorAll('.wave i');
      
      if (waveBars.length > 0) {
        gsap.from(waveBars, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.6,
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.wave',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // Continuous pulse animation cho wave bars
        gsap.to(waveBars, {
          scaleY: 0.7,
          stagger: {
            each: 0.05,
            repeat: -1,
            yoyo: true,
          },
          duration: 0.8,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: '.wave',
            start: 'top 85%',
          },
        });
      }

      // Animate counter Hz
      const hzElement = connectionRef.current.querySelector('.hz');
      
      if (hzElement) {
        const counter = { value: 0 };
        
        gsap.to(counter, {
          value: 1000,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            hzElement.textContent = `${Math.round(counter.value).toLocaleString('de-DE')} Hz`;
          },
          scrollTrigger: {
            trigger: connectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    },
    { scope: connectionRef }
  );

  return (
    <section ref={connectionRef} className="landing-section connection-section" data-node-id="36:5190">
      <Label>
        <span className="js-reveal">03 / GIỮ TRỌN MẠCH CẢM HỨNG</span>
      </Label>
      <div className="connection-grid">
        <div className="js-reveal">
          <strong className="hz">1.000 Hz</strong>
          <div className="wave" aria-hidden="true">
            {Array.from({ length: 53 }, (_, i) => (
              <i 
                key={i} 
                style={{ height: i % 9 === 0 ? 44 : i % 4 === 0 ? 29 : 12 }} 
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="js-reveal">
            BÀN LÀM VIỆC.<br />HAY SÂN CHƠI.
          </h2>
          <p className="js-reveal">
            3 chế độ kết nối, một nhịp gõ quen thuộc. THREAD 75 sẵn sàng đồng hành khi bạn chuyển từ tập trung làm việc sang hết mình với cuộc chơi.
          </p>
          <div className="connection-modes js-reveal">
            <strong>03</strong>
            <span>
              <b>Chế độ kết nối</b>
              <small>LINH HOẠT THEO NHỊP CỦA BẠN.</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
