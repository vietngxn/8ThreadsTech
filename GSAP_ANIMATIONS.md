# 🎬 GSAP Animations - THREAD 75 Landing Page

## 📦 Packages đã cài đặt

```bash
# Đã có sẵn trong package.json
gsap: ^3.15.1
@gsap/react: ^2.1.2
```

## 🎯 Tổng quan Animation

Landing page đã được tích hợp GSAP với các animation chuyên nghiệp:

### ✅ Đã hoàn thành

1. **Hero Section** (`HeroSection.jsx`)
   - Timeline load page: stagger cho title, keyboard, orbit, CTA
   - Parallax scroll: keyboard và orbit di chuyển khi cuộn
   
2. **Navbar** (`Navbar.jsx`)
   - Ẩn/hiện khi scroll xuống/lên
   - Đổi background khi qua hero section

3. **Stats Section** (`StatsSection.jsx`)
   - Counter animation: đếm từ 0 đến giá trị target (75%, 1.000 Hz, 3 chế độ)
   - Stagger fade-in cho các stat items

4. **Design Section** (`DesignSection.jsx`)
   - Reveal từ dưới lên khi scroll vào viewport

5. **Feel Section** (`FeelSection.jsx`)
   - Reveal với stagger cho text và image

6. **Connection Section** (`ConnectionSection.jsx`)
   - Wave bars animation: stagger + continuous pulse
   - Counter Hz animation

7. **Color Section** (`ColorSection.jsx`)
   - Reveal elements
   - Interactive color change: scale + rotation animation
   - Parallax orbit rotation

8. **Collection Section** (`CollectionSection.jsx`)
   - Stagger reveal cho product cards

9. **Space Section** (`SpaceSection.jsx`)
   - Background parallax
   - Content reveal

10. **Team Section** (`TeamSection.jsx`)
    - Infinity SVG: scale + rotation entrance
    - Continuous slow rotation

11. **Service Section** (`ServiceSection.jsx`)
    - Service cards stagger
    - FAQ items reveal

12. **Order Section** (`OrderSection.jsx`)
    - Product info reveal với stagger

13. **Footer** (`Footer.jsx`)
    - Stagger fade-in từ dưới lên

14. **Hover Animations** (toàn bộ page)
    - Button scale up
    - Product card lift + image zoom
    - Color swatch bounce
    - Link arrow shift
    - FAQ hover slide

15. **Performance Optimizations**
    - ScrollTrigger refresh sau khi load ảnh/font
    - Support cho `prefers-reduced-motion`
    - Responsive animation với `matchMedia`

## 📁 Cấu trúc Files

```
src/
├── lib/
│   └── gsap.js                      # GSAP setup & plugin registration
├── hooks/
│   ├── useHeroAnimation.js          # Hero timeline + parallax
│   ├── useNavbar.js                 # Navbar hide/show logic
│   ├── useStatsAnimation.js         # Counter animation
│   ├── useReveal.js                 # Generic reveal hook
│   ├── useHoverAnimation.js         # Hover interactions
│   ├── useParallax.js               # Parallax helper
│   ├── useCounter.js                # Counter helper
│   └── useResponsiveAnimation.js    # Reduced motion + responsive
└── components/landing/
    ├── HeroSection.jsx
    ├── Navbar.jsx
    ├── StatsSection.jsx
    ├── ... (các section khác)
    └── Footer.jsx
```

## ⚙️ Cách điều chỉnh animations

### 1. Thay đổi tốc độ / delay

#### Hero Timeline (useHeroAnimation.js)
```javascript
// Chỉnh duration của title animation
tl.from('.js-hero-title-1', {
  duration: 1.2,  // ← Thay đổi ở đây (giây)
})

// Chỉnh overlap giữa các animation
.from('.js-hero-title-2', {
  // ...
}, '-=0.9')  // ← Overlap 0.9s với animation trước
```

#### Reveal Animations (useReveal.js)
```javascript
export function useReveal(options = {}) {
  const {
    y = 60,          // ← Độ dịch chuyển (px)
    stagger = 0.12,  // ← Delay giữa các phần tử (giây)
    duration = 0.8,  // ← Thời gian animation (giây)
    ease = 'power3.out', // ← Easing function
  } = options;
```

Sử dụng trong component:
```javascript
const sectionRef = useReveal({ 
  y: 80,          // Di chuyển nhiều hơn
  stagger: 0.2,   // Chậm hơn
  duration: 1.2,  // Lâu hơn
});
```

#### Counter Animation (useStatsAnimation.js)
```javascript
gsap.to(counter, {
  value: targetValue,
  duration: 2,           // ← Thời gian đếm
  ease: 'power2.out',    // ← Easing
```

### 2. Thay đổi easing

Common easing functions:
- `power1.out`, `power2.out`, `power3.out` - Mượt, tự nhiên
- `back.out(1.7)` - Bounce nhẹ ở cuối
- `elastic.out(1, 0.5)` - Bounce mạnh (spring)
- `sine.inOut` - Rất mượt, dùng cho loop
- `none` - Linear, dùng cho parallax

### 3. Tắt animation trên mobile

Trong component:
```javascript
useGSAP(() => {
  const mm = gsap.matchMedia();
  
  mm.add({
    isDesktop: '(min-width: 1024px)',
    isMobile: '(max-width: 767px)',
  }, (context) => {
    const { isDesktop } = context.conditions;
    
    if (isDesktop) {
      // Animation đầy đủ cho desktop
      gsap.to(element, { /* ... */ });
    } else {
      // Chỉ fade-in cho mobile
      gsap.to(element, { autoAlpha: 1, duration: 0.5 });
    }
  });
});
```

### 4. Tùy chỉnh ScrollTrigger

```javascript
scrollTrigger: {
  trigger: containerRef.current,
  start: 'top 80%',      // Bắt đầu khi top của element ở 80% viewport
  end: 'bottom 20%',     // Kết thúc khi bottom ở 20% viewport
  toggleActions: 'play none none reverse',
  // play: onEnter
  // none: onLeave  
  // none: onEnterBack
  // reverse: onLeaveBack
  
  scrub: true,           // Gắn với scroll position (cho parallax)
  markers: true,         // Debug: hiển thị markers (XÓA khi production)
}
```

### 5. Thêm animation mới cho section

```javascript
import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';

export default function NewSection() {
  const sectionRef = useRef();

  useGSAP(
    () => {
      // Set trạng thái ban đầu
      gsap.set('.js-element', {
        autoAlpha: 0,
        y: 50,
      });

      // Animate khi scroll vào
      gsap.to('.js-element', {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef } // ← Quan trọng: giới hạn selector trong section
  );

  return (
    <section ref={sectionRef}>
      <h2 className="js-element">Heading</h2>
      <p className="js-element">Content</p>
    </section>
  );
}
```

### 6. Thêm hover animation

Trong `useHoverAnimation.js`:
```javascript
// Thêm vào useGSAP callback
const buttons = containerRef.current.querySelectorAll('.my-button');

buttons.forEach((button) => {
  const onEnter = ctx.add(() => {
    gsap.to(button, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  const onLeave = ctx.add(() => {
    gsap.to(button, {
      scale: 1,
      duration: 0.3,
    });
  });

  button.addEventListener('mouseenter', onEnter);
  button.addEventListener('mouseleave', onLeave);
});
```

## 🎨 Best Practices

### ✅ DO
- Dùng `autoAlpha` thay vì `opacity` (ẩn khỏi screen reader khi opacity = 0)
- Dùng `useGSAP` hook thay vì `useEffect`
- Set `scope: containerRef` để selector chỉ tìm trong component
- Chỉ animate `transform` và `opacity` để performance tốt
- Dùng `contextSafe` cho event handlers

### ❌ DON'T
- Không animate `width`, `height`, `top`, `left` (gây reflow)
- Không dùng `setState` để lưu giá trị thay đổi mỗi frame
- Không tạo animation ở top-level hay trong render
- Không để GSAP và React cùng điều khiển một thuộc tính

## 🐛 Troubleshooting

### Animation không chạy
1. Kiểm tra class `.js-reveal` đã được thêm vào element chưa
2. Check console có lỗi GSAP không
3. Thêm `markers: true` vào ScrollTrigger để debug

### Animation bị giật
1. Giảm `duration` và tăng `ease`
2. Dùng `will-change: transform` trong CSS cho element được animate
3. Kiểm tra không animate thuộc tính gây reflow

### ScrollTrigger bị lệch
```javascript
// Refresh sau khi load ảnh
ScrollTrigger.refresh();
```

### Animation chạy khi unmount
- Đảm bảo dùng `useGSAP` với `scope`, nó sẽ tự cleanup

## 🚀 Performance Tips

1. **Reduce animation trên mobile**
   - Đã implement sẵn trong `useResponsiveAnimation.js`

2. **Respect prefers-reduced-motion**
   - Đã implement: tự tắt hầu hết animation nếu user bật setting này

3. **Lazy load ScrollTrigger**
   - Chỉ load khi cần, đã được setup trong `lib/gsap.js`

4. **Batch updates**
   ```javascript
   gsap.to([element1, element2, element3], {
     // Animate cùng lúc thay vì 3 lần riêng
   });
   ```

## 📚 Resources

- [GSAP Docs](https://gsap.com/docs/v3/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Easing Visualizer](https://gsap.com/docs/v3/Eases)
- [@gsap/react Docs](https://gsap.com/docs/v3/React)

## 🎯 Animation Style Guide

Project này dùng phong cách **năng động & bắt mắt**:
- Duration: 0.6-1.2s cho entrance
- Stagger: 0.1-0.15s
- Easing: `power3.out`, `power2.out`
- Movement: 40-80px cho y-axis
- Hover: 0.3s duration, scale 1.05-1.1

Nếu muốn đổi sang **tối giản & tinh tế**:
- Duration: 0.4-0.6s
- Stagger: 0.05-0.08s  
- Easing: `power1.out`
- Movement: 20-30px
- Hover: 0.2s duration, scale 1.02

Nếu muốn **sang trọng & chậm rãi**:
- Duration: 1.5-2.5s
- Stagger: 0.2-0.3s
- Easing: `sine.inOut`
- Movement: 60-100px
- Hover: 0.5s duration, scale 1.03
