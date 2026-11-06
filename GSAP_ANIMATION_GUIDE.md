# GSAP Animation Guide - 8ThreadTech Landing Page

## 📦 Đã cài đặt

- `gsap` v3.15.1
- `@gsap/react` v2.1.2

## 🎬 Animation đã thêm

### 1. **Hero Section (Page Load)**
- **File**: `src/hooks/useHeroAnimation.js`
- **Hiệu ứng**: 
  - Title "GEAR UP" fade + scale từ 0.9 → 1
  - Title "GAME ON" stagger với delay
  - Keyboard fade + scale + rotate nhẹ
  - Orbit ring scale + rotate
  - Copy section stagger từ dưới lên
  - Parallax cho keyboard và orbit khi scroll

**Điều chỉnh**:
```javascript
// Trong useHeroAnimation.js
tl.from('.js-hero-title-1', {
  duration: 1.2,  // ← Thay đổi tốc độ (giây)
  y: 80,          // ← Độ dịch chuyển ban đầu
  scale: 0.9,     // ← Scale ban đầu (0-1)
})
```

### 2. **Navbar (Scroll Behavior)**
- **File**: `src/hooks/useNavbar.js`
- **Hiệu ứng**:
  - Ẩn khi scroll xuống
  - Hiện khi scroll lên
  - Đổi background blur khi scroll qua hero

**Điều chỉnh**:
```javascript
// Thay đổi điểm trigger
ScrollTrigger.create({
  start: 'top -80',  // ← Thay đổi điểm bắt đầu
  onUpdate: (self) => {
    // Logic ẩn/hiện
  }
})
```

### 3. **Stats Section (Counter Animation)**
- **File**: `src/hooks/useStatsAnimation.js`
- **Hiệu ứng**: Đếm số từ 0 → target khi vào viewport

**Điều chỉnh**:
```javascript
gsap.to(counter, {
  value: targetValue,
  duration: 2,        // ← Tốc độ đếm
  ease: 'power2.out', // ← Easing function
})
```

### 4. **Scroll Reveal Sections**
- **File**: `src/hooks/useReveal.js`
- **Hiệu ứng**: Fade + slide up khi scroll vào viewport
- **Sections**: Design, Feel, Connection, Color, Collection, Team, Service, Order

**Điều chỉnh**:
```javascript
// Trong LandingPage.jsx
const designRef = useReveal({ 
  y: 80,           // ← Độ dịch chuyển
  stagger: 0.15,   // ← Delay giữa các phần tử (giây)
  duration: 0.8,   // ← Tốc độ animation
  ease: 'power3.out' // ← Easing
});
```

### 5. **Parallax Effect**
- **File**: `src/hooks/useParallax.js`
- **Hiệu ứng**: Background image di chuyển chậm hơn nội dung
- **Section**: Space (desk background)

**Điều chỉnh**:
```javascript
const spaceRef = useParallax({ 
  speed: 0.6,     // ← 0-1, càng nhỏ càng chậm
  direction: 'y'  // ← 'y' hoặc 'x'
});
```

### 6. **Hover Interactions**
- **CSS**: `src/App.css` (cuối file)
- **Hiệu ứng**:
  - Buttons: scale 1.05
  - Product cards: lift + image zoom
  - Color swatches: bounce scale

**Điều chỉnh**:
```css
/* Trong App.css */
.landing-button:hover {
  transform: scale(1.05);  /* ← Thay đổi scale */
}

.landing-product:hover {
  transform: translateY(-8px);  /* ← Độ nâng lên */
}
```

## 🎨 Easing Functions phổ biến

```javascript
// Smooth & professional
'power2.out'
'power3.out'

// Bouncy & playful
'back.out(1.7)'
'elastic.out(1, 0.3)'

// Sharp & snappy
'expo.out'
'circ.out'
```

## 🎯 ScrollTrigger Settings

```javascript
scrollTrigger: {
  trigger: element,
  start: 'top 80%',    // Khi top của element ở 80% viewport
  end: 'bottom top',   // Khi bottom element chạm top viewport
  toggleActions: 'play none none reverse',
  // Format: onEnter onLeave onEnterBack onLeaveBack
  scrub: true,        // Gắn animation với scroll position
}
```

### Toggle Actions:
- `'play none none reverse'` - Phổ biến nhất, reverse khi scroll back
- `'play none none none'` - Chỉ play một lần
- `'play pause resume reset'` - Full control

## 🔧 Tối ưu Performance

### Mobile Performance
Animation tự động giảm trên mobile (trong `useReveal.js`, `useParallax.js`):

```javascript
gsap.matchMedia({
  // Desktop
  '(min-width: 768px)': () => {
    // Full animation
  },
  // Mobile  
  '(max-width: 767px)': () => {
    // Reduced animation
  }
});
```

### Accessibility (Prefers Reduced Motion)
CSS tự động tắt animation cho người dùng bật "reduce motion":

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🛠️ Troubleshooting

### Animation không chạy
1. Kiểm tra console có lỗi không
2. Đảm bảo các class `.js-reveal`, `.js-parallax` đã được thêm vào JSX
3. Check ref đã được gán đúng component

### Animation bị giật
1. Thêm `will-change: transform` vào CSS
2. Giảm `stagger` delay
3. Sử dụng `autoAlpha` thay vì `opacity` + `visibility`

### ScrollTrigger không trigger đúng
```javascript
// Refresh sau khi images load
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
```

## 📝 Các class animation quan trọng

```html
<!-- Reveal khi scroll -->
<div className="js-reveal">Content</div>

<!-- Parallax effect -->
<div className="js-parallax">Image/Element</div>

<!-- Hero animations -->
<span className="js-hero-title-1">GEAR UP</span>
<img className="js-hero-keyboard" />
<div className="js-hero-orbit" />
<div className="js-hero-copy">...</div>
<div className="js-hero-meta">...</div>
```

## 🎬 Thứ tự animation load

1. **Hero** (0-2s): Title → Keyboard → Orbit → Copy → Meta
2. **Stats** (on scroll): Counter animation + fade in
3. **Sections** (on scroll): Sequential reveal as user scrolls
4. **Parallax** (continuous): Tied to scroll position
5. **Hover** (on interaction): Immediate feedback

## 💡 Tips

### Thêm animation cho element mới
```javascript
// 1. Thêm class vào JSX
<div className="js-reveal">New content</div>

// 2. Hook sẽ tự động pick up và animate
```

### Debug animation
```javascript
// Thêm markers để xem trigger points
scrollTrigger: {
  trigger: element,
  markers: true,  // ← Show debug markers
}
```

### Kill animation khi unmount
`useGSAP` tự động cleanup, nhưng nếu cần manual:
```javascript
useGSAP(() => {
  const tl = gsap.timeline();
  // animations...
  
  return () => {
    tl.kill(); // Cleanup
  };
});
```

## 📚 Resources

- [GSAP Docs](https://gsap.com/docs/v3/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Ease Visualizer](https://gsap.com/docs/v3/Eases)
- [@gsap/react](https://gsap.com/docs/v3/React/)
