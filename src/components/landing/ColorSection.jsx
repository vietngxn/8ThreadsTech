import { useState, useRef } from 'react';
import { IconArrowUpRight } from '@tabler/icons-react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import keyboard from '../../assets/thread-keyboard.png';

const colors = [
  { name: "Bạc ánh trăng", value: "#c8c9ca" },
  { name: "Đen nguyên bản", value: "#393b3d" },
  { name: "Đỏ dung nham", value: "#a82125" },
];

function Label({ children }) {
  return (
    <div className="landing-label">
      <span />
      {children}
    </div>
  );
}

export default function ColorSection({ onColorChange }) {
  const [color, setColor] = useState(0);
  const colorRef = useRef();

  useGSAP(
    () => {
      // Reveal elements khi scroll vào
      const elements = colorRef.current.querySelectorAll('.js-reveal');
      
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
          trigger: colorRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate orbit với parallax
      const orbit = colorRef.current.querySelector('.color-orbit');
      
      if (orbit) {
        gsap.to(orbit, {
          rotation: 180,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: colorRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    },
    { scope: colorRef }
  );

  const handleColorChange = (index) => {
    const colorImage = colorRef.current.querySelector('.color-image img');
    const colorName = colorRef.current.querySelector('.color-grid > div > strong');
    
    // Animate khi đổi màu
    if (colorImage) {
      gsap.to(colorImage, {
        scale: 0.9,
        rotation: -5,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setColor(index);
          if (onColorChange) {
            onColorChange(colors[index].name);
          }
          
          gsap.to(colorImage, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
          });
        },
      });
    } else {
      setColor(index);
      if (onColorChange) {
        onColorChange(colors[index].name);
      }
    }

    // Animate color name
    if (colorName) {
      gsap.fromTo(
        colorName,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  };

  return (
    <section ref={colorRef} className="landing-section color-section" data-node-id="36:5261">
      <Label>
        <span className="js-reveal">04 / CHẤT RIÊNG KHÔNG HÒA LẪN</span>
      </Label>
      <div className="color-grid">
        <div>
          <h2 className="js-reveal">
            GU CỦA BẠN.<br />PHÍM CỦA BẠN.
          </h2>
          <p className="js-reveal">
            Một chút bạc. Một chấm đỏ. Một góc bàn mang đúng dấu ấn của bạn.
          </p>
          <div className="landing-swatches js-reveal" aria-label="Chọn màu sản phẩm">
            {colors.map((item, index) => (
              <button
                key={item.name}
                className={color === index ? "selected" : ""}
                aria-label={item.name}
                aria-pressed={color === index}
                onClick={() => handleColorChange(index)}
              >
                <span style={{ background: item.value }} />
              </button>
            ))}
          </div>
          <strong className="js-reveal">{colors[color].name}</strong>
          <small className="js-reveal">LINEAR RED SWITCH · ÊM &amp; MƯỢT</small>
        </div>
        <div className="color-image js-reveal">
          <div className="color-orbit" />
          <img src={keyboard} alt="THREAD 75" />
          <span>YOUR DESK. YOUR SIGNATURE.</span>
        </div>
      </div>
      <div className="color-bottom js-reveal">
        <span>THREAD 75 / 75% / NHÔM CNC / HOT-SWAP</span>
        <a className="landing-button" href="#order">
          CHỌN THREAD 75
          <IconArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
