# 🏗️ Cấu trúc dự án sau tái cấu trúc

## 📁 Cấu trúc thư mục mới

```
src/
├── assets/                      # Hình ảnh, tài nguyên
│   ├── thread-keyboard.png
│   ├── thread-logo.png
│   ├── landing-switch.png
│   ├── landing-65.png
│   ├── landing-98.png
│   ├── landing-60.png
│   └── landing-desk.png
│
├── components/
│   ├── landing/                 # ✨ Components landing page
│   │   ├── Navbar.jsx          # Header với navigation
│   │   ├── HeroSection.jsx     # Hero section với animation
│   │   ├── StatsSection.jsx    # Stats với counter
│   │   ├── DesignSection.jsx   # Design showcase
│   │   ├── FeelSection.jsx     # Feel/switch section
│   │   ├── ConnectionSection.jsx # Connection modes
│   │   ├── ColorSection.jsx    # Color picker
│   │   ├── CollectionSection.jsx # Product collection
│   │   ├── SpaceSection.jsx    # Desk inspiration
│   │   ├── TeamSection.jsx     # Team info
│   │   ├── ServiceSection.jsx  # Services & FAQ
│   │   ├── OrderSection.jsx    # Order/CTA
│   │   └── Footer.jsx          # Footer
│   │
│   ├── product-detail/
│   │   └── NoticeToast.jsx     # Toast notification
│   └── ui/                      # Shared UI components
│
├── hooks/                       # 🎬 GSAP Animation hooks
│   ├── useReveal.js            # Scroll reveal animation
│   ├── useParallax.js          # Parallax effect
│   ├── useHeroAnimation.js     # Hero timeline
│   ├── useNavbar.js            # Navbar scroll behavior
│   ├── useStatsAnimation.js    # Counter animation
│   ├── useCounter.js           # Generic counter
│   └── useHoverAnimation.js    # Hover effects (optional)
│
├── layouts/
│   └── Layout.jsx              # Page layout wrapper
│
├── lib/
│   └── gsap.js                 # GSAP plugin registration
│
├── pages/
│   ├── LandingPage.jsx         # 🎯 Landing page orchestrator
│   └── ProductDetailPage.jsx   # Product detail (existing)
│
├── styles/                      # 🎨 CSS modules
│   ├── index.css               # Main CSS entry (imports all)
│   ├── base.css                # Base/reset styles
│   ├── landing-common.css      # Landing page common
│   ├── navbar.css              # Navbar styles
│   ├── hero.css                # Hero section
│   ├── stats.css               # Stats section
│   ├── design.css              # Design section
│   ├── sections.css            # Feel + Connection sections
│   ├── color.css               # Color section
│   ├── collection.css          # Collection section
│   ├── space-team.css          # Space + Team sections
│   ├── service.css             # Service + FAQ sections
│   ├── order.css               # Order section
│   ├── footer.css              # Footer
│   └── animations.css          # GSAP animation styles
│
├── App.jsx                      # App entry
└── main.jsx                     # React entry point
```

## 🎯 Thay đổi chính

### 1. **Components được tách nhỏ**

**Trước:**
```jsx
// LandingPage.jsx - 76 dòng, tất cả JSX trong 1 file
export default function LandingPage() {
  return (
    <main>
      {/* 500+ dòng JSX */}
    </main>
  );
}
```

**Sau:**
```jsx
// LandingPage.jsx - 35 dòng, chỉ orchestrate
export default function LandingPage() {
  return (
    <main className="landing">
      <Navbar onComingSoon={comingSoon} />
      <HeroSection />
      <StatsSection />
      <DesignSection />
      {/* ... */}
    </main>
  );
}

// Mỗi section là component riêng
// components/landing/HeroSection.jsx
export default function HeroSection() {
  const heroRef = useHeroAnimation();
  return <section ref={heroRef}>...</section>;
}
```

### 2. **CSS được tổ chức theo module**

**Trước:**
```
src/
├── App.css         # 2129 dòng - tất cả CSS
└── index.css       # 111 dòng
```

**Sau:**
```
src/styles/
├── index.css           # Import tất cả
├── base.css            # Base styles
├── landing-common.css  # Common landing
├── navbar.css          # Navbar only
├── hero.css            # Hero only
├── stats.css           # Stats only
├── design.css          # Design only
├── sections.css        # Feel + Connection
├── color.css           # Color only
├── collection.css      # Collection only
├── space-team.css      # Space + Team
├── service.css         # Service + FAQ
├── order.css           # Order only
├── footer.css          # Footer only
└── animations.css      # GSAP animations
```

## 📊 So sánh

| Metric | Trước | Sau | Cải thiện |
|--------|-------|-----|-----------|
| **LandingPage.jsx** | 76 dòng | 35 dòng | -54% |
| **CSS files** | 2 files (2240 dòng) | 14 files (~2240 dòng) | Modular |
| **Components** | 1 file | 12 files | Reusable |
| **Maintainability** | Khó | Dễ | ✅ |

## 🎨 CSS Organization

### Import structure (styles/index.css)
```css
@import '@fontsource-variable/inter';
@import './base.css';
@import './landing-common.css';
@import './navbar.css';
/* ... tất cả các modules */
@import './animations.css';
```

### Mỗi file CSS chứa:
- Styles cho 1 section cụ thể
- Media queries cho section đó
- Không có duplicate code
- Dễ debug và maintain

## 🔧 Component Props

### Navbar
```jsx
<Navbar onComingSoon={comingSoon} />
```

### ColorSection
```jsx
<ColorSection onColorChange={setSelectedColor} />
```

### OrderSection
```jsx
<OrderSection 
  selectedColor={selectedColor} 
  onComingSoon={comingSoon} 
/>
```

### CollectionSection & SpaceSection
```jsx
<CollectionSection onComingSoon={comingSoon} />
<SpaceSection onComingSoon={comingSoon} />
```

## 🎬 Animation Integration

Mỗi section tự quản lý animation của mình:

```jsx
// HeroSection.jsx
export default function HeroSection() {
  const heroRef = useHeroAnimation(); // Hero-specific
  return <section ref={heroRef}>...</section>;
}

// DesignSection.jsx
export default function DesignSection() {
  const designRef = useReveal({ y: 80, stagger: 0.15 }); // Generic
  return <section ref={designRef}>...</section>;
}
```

## 📝 Lợi ích

### 1. **Maintainability**
- Mỗi component/CSS file nhỏ, dễ đọc
- Tìm và sửa bug nhanh hơn
- Không ảnh hưởng lẫn nhau

### 2. **Reusability**
- Components có thể dùng lại cho pages khác
- Hooks animation dùng chung
- CSS modules không conflict

### 3. **Scalability**
- Dễ thêm section mới
- Dễ remove section không cần
- Dễ test từng component riêng

### 4. **Performance**
- Code splitting potential
- Lazy load components khi cần
- CSS modules có thể optimize

### 5. **Developer Experience**
- File nhỏ → load nhanh trong editor
- Easy navigation với file tree
- Clear separation of concerns

## 🚀 Cách thêm section mới

### Bước 1: Tạo component
```jsx
// src/components/landing/NewSection.jsx
import { useReveal } from '../../hooks/useReveal';

export default function NewSection() {
  const ref = useReveal({ y: 60 });
  
  return (
    <section ref={ref} className="new-section">
      <h2 className="js-reveal">New Section</h2>
      <p className="js-reveal">Content here</p>
    </section>
  );
}
```

### Bước 2: Tạo CSS
```css
/* src/styles/new-section.css */
.new-section {
    padding: 96px 4.444%;
}

.new-section h2 {
    font-size: 48px;
}
```

### Bước 3: Import CSS
```css
/* src/styles/index.css */
@import './new-section.css';
```

### Bước 4: Thêm vào page
```jsx
// src/pages/LandingPage.jsx
import NewSection from '../components/landing/NewSection';

export default function LandingPage() {
  return (
    <main className="landing">
      {/* ... */}
      <NewSection />
      {/* ... */}
    </main>
  );
}
```

## 🔍 File nào làm gì?

### Components
- **Navbar**: Header fixed, navigation, tools
- **HeroSection**: Hero banner với animation
- **StatsSection**: 4 stats với counter
- **DesignSection**: Design showcase với image
- **FeelSection**: Switch feel description
- **ConnectionSection**: Connection modes + Hz visual
- **ColorSection**: Color picker với state
- **CollectionSection**: 3 product cards
- **SpaceSection**: Desk inspiration với parallax
- **TeamSection**: Team info với infinity SVG
- **ServiceSection**: Services + FAQ accordion
- **OrderSection**: CTA section với order form
- **Footer**: Footer với links

### CSS Modules
- **base.css**: HTML/body reset, wrapper
- **landing-common.css**: Shared landing styles
- **navbar.css**: Fixed navbar + scroll behavior
- **hero.css**: Hero section + orbit animation
- **stats.css**: Stats grid layout
- **design.css**: Design section grid
- **sections.css**: Feel + Connection (gộp vì liên quan)
- **color.css**: Color picker + orbit
- **collection.css**: Product grid + cards
- **space-team.css**: Space + Team (gộp vì nhỏ)
- **service.css**: Service grid + FAQ
- **order.css**: Order section với CTA
- **footer.css**: Footer grid layout
- **animations.css**: GSAP performance styles

## 📚 Best Practices

### Component
1. Mỗi component tự quản animation (via hooks)
2. Props rõ ràng, type-safe khi dùng TS
3. No side effects ngoài animation
4. Pure presentation logic

### CSS
1. Class naming theo BEM hoặc component-based
2. No global styles (trừ base.css)
3. Responsive trong chính file đó
4. Animations ở animations.css

### State Management
1. Local state trong component
2. Shared state lift lên LandingPage
3. Props drilling tối đa 1-2 level
4. No global state cần thiết

## 🎉 Kết luận

Cấu trúc mới:
- ✅ Modular và maintainable
- ✅ Scalable cho future features
- ✅ Easy to understand
- ✅ Performance-friendly
- ✅ Developer-friendly
- ✅ Giữ nguyên functionality
- ✅ Giữ nguyên animations

Migration hoàn tất! 🚀
