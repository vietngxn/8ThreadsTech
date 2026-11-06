# 🎬 GSAP Animation Implementation Summary

## ✅ Hoàn thành

Animation GSAP + ScrollTrigger đã được thêm vào landing page với phong cách **năng động & bắt mắt**.

## 📦 Package đã cài

```bash
pnpm add gsap @gsap/react
```

**Versions**:
- `gsap`: 3.15.1
- `@gsap/react`: 2.1.2

---

## 📁 Files đã tạo mới

### 1. **src/lib/gsap.js**
Đăng ký GSAP plugins tập trung, export để các component import.

```javascript
import { gsap, useGSAP, ScrollTrigger } from '../lib/gsap';
```

### 2. **src/hooks/useReveal.js**
Hook để reveal elements khi scroll vào viewport với fade + slide effect.

**Usage**:
```javascript
const sectionRef = useReveal({ 
  y: 60,           // độ dịch chuyển
  stagger: 0.12,   // delay giữa các element
  duration: 0.8,   // tốc độ
  ease: 'power3.out'
});
```

### 3. **src/hooks/useParallax.js**
Hook tạo parallax effect cho ảnh/background.

**Usage**:
```javascript
const parallaxRef = useParallax({ 
  speed: 0.6,      // 0-1, càng nhỏ càng chậm
  direction: 'y'   // 'y' hoặc 'x'
});
```

### 4. **src/hooks/useHeroAnimation.js**
Animation đặc biệt cho hero section khi page load.

**Features**:
- Timeline stagger cho title, keyboard, orbit, copy
- Parallax cho keyboard và orbit khi scroll
- Duration tổng ~2 giây

### 5. **src/hooks/useNavbar.js**
Navbar ẩn/hiện thông minh khi scroll + đổi background.

**Behavior**:
- Ẩn khi scroll xuống (sau 150px)
- Hiện khi scroll lên
- Background blur khi qua hero section

### 6. **src/hooks/useStatsAnimation.js**
Counter animation cho stats section, đếm từ 0 → target.

**Smart counting**:
- Tự detect số có % / Hz / "chế độ"
- Format phù hợp (75%, 1.000 Hz, 3 chế độ)

### 7. **src/hooks/useCounter.js**
Generic counter hook (không dùng trong project này, nhưng có sẵn để tái sử dụng).

### 8. **src/hooks/useHoverAnimation.js**
Hover effects cho buttons, cards, swatches (đã tạo nhưng chưa apply, có thể thêm sau).

### 9. **GSAP_ANIMATION_GUIDE.md**
Tài liệu hướng dẫn đầy đủ về cách điều chỉnh animation.

---

## 🔧 Files đã chỉnh sửa

### 1. **src/pages/LandingPage.jsx**

**Thêm imports**:
```javascript
import { useNavbar } from "../hooks/useNavbar";
import { useReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
import useHeroAnimation from "../hooks/useHeroAnimation";
import { useStatsAnimation } from "../hooks/useStatsAnimation";
```

**Thêm refs trong component**:
```javascript
const navRef = useNavbar();
const heroRef = useHeroAnimation();
const statsRef = useStatsAnimation();
const designRef = useReveal({ y: 80, stagger: 0.15 });
const feelRef = useReveal({ y: 60, stagger: 0.12 });
const connectionRef = useReveal({ y: 70, stagger: 0.15 });
const colorRef = useReveal({ y: 60 });
const collectionRef = useReveal({ y: 50, stagger: 0.1 });
const spaceRef = useParallax({ speed: 0.6 });
const teamRef = useReveal({ y: 60 });
const serviceRef = useReveal({ y: 50, stagger: 0.12 });
const orderRef = useReveal({ y: 60, stagger: 0.15 });
```

**Thêm classes và refs vào JSX**:
- `.js-reveal` cho elements cần reveal
- `.js-parallax` cho parallax elements
- `.js-hero-*` cho hero section elements
- `ref={*Ref}` gán cho mỗi section

### 2. **src/App.css**

**Thêm vào cuối file** (~170 dòng CSS):

**Key additions**:
- `.landing-header` → `position: fixed` + z-index
- `.landing` → `padding-top: 104px` (compensate fixed header)
- Hover transitions cho buttons, cards, swatches
- Product card hover lift effect
- Performance optimizations với `will-change`
- Keyframes cho orbit rotation và team infinity float
- Mobile responsive (giảm animations trên mobile)
- `@media (prefers-reduced-motion: reduce)` support

---

## 🎨 Animation Details

### Hero Section (Page Load)
```
Timeline (1.8s total):
├─ 0.0s: GEAR UP fade + scale (1.2s)
├─ 0.3s: GAME ON fade + scale (1.2s)
├─ 0.4s: Keyboard fade + scale + rotate (1.4s)
├─ 0.4s: Orbit scale + rotate (1.2s)
├─ 0.6s: Copy stagger (0.8s)
└─ 1.0s: Meta elements stagger (0.6s)

+ Continuous parallax khi scroll
```

### Navbar Behavior
```
Scroll down (>150px) → Hide (slide up)
Scroll up → Show (slide down)
Scroll past hero → Background blur + tint
```

### Stats Counter
```
Trigger: top 80% viewport
Duration: 2s
Effect: Count from 0 → target
Format: Auto-detect (%, Hz, chế độ)
```

### Scroll Reveal (All sections)
```
Trigger: top 80% viewport
Start state: opacity 0, y offset
End state: opacity 1, y 0
Stagger: 0.1-0.15s between elements
Reverse: Yes (fade out khi scroll back)
```

### Parallax (Space section)
```
Speed: 0.6 (60% of scroll speed)
Direction: Y axis
Scrub: true (smooth tied to scroll)
```

---

## 🎯 Các class animation đã thêm

| Class | Mục đích | Nơi sử dụng |
|-------|----------|-------------|
| `.js-reveal` | Reveal khi scroll | Hầu hết các sections |
| `.js-parallax` | Parallax effect | Space section content |
| `.js-hero-title-1` | Hero title line 1 | "GEAR UP" |
| `.js-hero-title-2` | Hero title line 2 | "GAME ON" |
| `.js-hero-keyboard` | Hero keyboard image | Main product image |
| `.js-hero-orbit` | Hero orbit ring | Decorative element |
| `.js-hero-copy` | Hero copy container | Title + description + CTA |
| `.js-hero-meta` | Hero meta elements | Material info, scroll prompt, signature |

---

## 📊 Performance Optimizations

### ✅ Implemented

1. **React Integration**
   - ✅ `useGSAP` hook với `scope` để tự cleanup
   - ✅ Không animation ở top-level hay render
   - ✅ Không conflict GSAP vs React (tách element control)

2. **CSS Performance**
   - ✅ `will-change: transform` cho animated elements
   - ✅ Chỉ animate `transform` và `opacity` (GPU accelerated)
   - ✅ No `left`, `top`, `width`, `height` animations

3. **Mobile Optimization**
   - ✅ Giảm hover effects trên mobile
   - ✅ Tắt continuous animations (orbit, float) trên mobile
   - ✅ Reduced motion support

4. **Accessibility**
   - ✅ `@media (prefers-reduced-motion: reduce)` → tắt hết animations
   - ✅ `autoAlpha` thay vì `opacity` (ẩn khỏi screen readers)

5. **ScrollTrigger Optimization**
   - ✅ Dùng `toggleActions` thay vì `onEnter`/`onLeave` callbacks
   - ✅ `scrub: true` cho parallax (smooth performance)

---

## 🎬 Cách test animations

### 1. Chạy dev server
```bash
pnpm dev
```

### 2. Mở browser
```
http://localhost:5173
```

### 3. Test checklist

- [ ] **Hero load**: Refresh page, xem title → keyboard → copy animation
- [ ] **Navbar**: Scroll xuống/lên, check ẩn/hiện
- [ ] **Stats counter**: Scroll đến stats, xem số đếm
- [ ] **Section reveals**: Scroll qua từng section, check fade in
- [ ] **Parallax**: Scroll space section, xem background di chuyển chậm
- [ ] **Hover effects**: Hover vào buttons, product cards, color swatches
- [ ] **Mobile**: Resize browser < 760px, check animations vẫn smooth
- [ ] **Accessibility**: Bật "reduce motion" trong OS settings, check animations tắt

---

## 🔧 Điều chỉnh nhanh

### Tăng/giảm tốc độ animations

**File**: `src/hooks/useReveal.js`
```javascript
// Tăng duration để chậm hơn
const { duration = 0.8 } = options; // → 1.2
```

**File**: `src/hooks/useHeroAnimation.js`
```javascript
// Giảm duration để nhanh hơn
.from('.js-hero-title-1', {
  duration: 1.2, // → 0.8
})
```

### Thay đổi easing

```javascript
// Smooth & professional
ease: 'power2.out'

// Bouncy & playful  
ease: 'back.out(1.7)'

// Sharp & snappy
ease: 'expo.out'
```

### Thay đổi stagger delay

**File**: `src/pages/LandingPage.jsx`
```javascript
// Giảm delay để nhanh hơn
const designRef = useReveal({ stagger: 0.15 }); // → 0.08

// Tăng delay để dramatic hơn
const teamRef = useReveal({ stagger: 0.6 }); // → 0.25
```

### Bật/tắt parallax

**File**: `src/pages/LandingPage.jsx`
```javascript
// Tăng speed để di chuyển nhanh hơn
const spaceRef = useParallax({ speed: 0.6 }); // → 0.9

// Tắt parallax: không gọi hook hoặc set speed = 0
```

---

## 🐛 Known Issues & Solutions

### Issue: Animation không chạy sau khi deploy
**Solution**: Đảm bảo `pnpm build` không báo lỗi, check browser console.

### Issue: ScrollTrigger markers hiện trên production
**Solution**: Không có markers trong code hiện tại. Nếu thêm debug, nhớ xóa `markers: true`.

### Issue: Animation giật trên mobile
**Solution**: Đã giảm animations trên mobile trong CSS. Nếu vẫn giật, có thể tắt thêm trong hooks bằng `gsap.matchMedia()`.

### Issue: Ảnh load chậm làm layout shift
**Solution**: Thêm vào `src/main.jsx`:
```javascript
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
```

---

## 📚 Tài liệu tham khảo

1. **GSAP_ANIMATION_GUIDE.md** - Hướng dẫn chi tiết
2. [GSAP Docs](https://gsap.com/docs/v3/)
3. [ScrollTrigger Demos](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
4. [@gsap/react Guide](https://gsap.com/docs/v3/React/)

---

## ✨ Summary

**Tổng cộng**:
- ✅ 9 hooks/files mới tạo
- ✅ 2 files chính chỉnh sửa (LandingPage.jsx, App.css)
- ✅ ~300 dòng JavaScript animation logic
- ✅ ~170 dòng CSS cho animations
- ✅ Full documentation (GSAP_ANIMATION_GUIDE.md)

**Animation count**:
- 1 hero timeline (6 steps)
- 1 navbar behavior
- 1 stats counter
- 9 section reveals
- 1 parallax effect
- Continuous orbit rotations
- Hover micro-interactions

**Phong cách**: Năng động & bắt mắt - scale, rotate, parallax mạnh, phù hợp tech product! 🚀
