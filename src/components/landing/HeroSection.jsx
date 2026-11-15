import { useRef } from 'react';
import { IconArrowDown } from '@tabler/icons-react';
import keyboard from '../../assets/thread-keyboard.png';
import useHeroAnimation from '../../hooks/useHeroAnimation';

export default function HeroSection() {
  const heroRef = useHeroAnimation();

  return (
    <section ref={heroRef} id="top" className="landing-hero" data-node-id="36:5113">
      <h1>
        <span className="js-hero-title-1">GEAR UP</span>
        <br />
        <span className="js-hero-title-2">GAME ON</span>
      </h1>
      <div className="hero-orbit js-hero-orbit" />
      <img 
        className="landing-hero-keyboard js-hero-keyboard" 
        src={keyboard} 
        alt="Bàn phím cơ THREAD 75" 
      />
      <div className="hero-copy js-hero-copy">
        <h2>THREAD 75</h2>
        <p>Từng phím gõ, một nhịp cảm hứng. Chất riêng bắt đầu từ bàn phím của bạn.</p>
        <a className="landing-button" href="#design">
          KHÁM PHÁ THREAD 75
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 7h10v10M7 17L17 7" />
          </svg>
        </a>
      </div>
      <div className="hero-material js-hero-meta">
        01 / BẠC ÁNH TRĂNG<br />NHÔM CNC · 75%
      </div>
      <a className="hero-scroll js-hero-meta" href="#design">
        <IconArrowDown size={16} /> CUỘN ĐỂ TÌM HIỂU THÊM
      </a>
      <span className="hero-signature js-hero-meta">DESIGNED FOR YOUR RHYTHM.</span>
    </section>
  );
}
