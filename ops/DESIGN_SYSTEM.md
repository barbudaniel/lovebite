# LOVDASH DESIGN SYSTEM

> All design tokens, layout rules, and component standards.
> Reference: Enterprise-grade SaaS (Stripe, Linear, Vercel) with approachable warmth.

---

## STATUS
✅ Complete - Defined by Visual Design Lead (DEC-008)

---

## DESIGN DIRECTION

### Visual Tone
- **Status**: ✅ Defined
- **Primary**: Enterprise-grade, professional, trustworthy
- **Secondary**: Warm and approachable (not cold/corporate)
- **Mood**: Confident, clean, sophisticated with subtle energy
- **Avoid**: Overly playful, hyper-saturated colors, generic stock imagery

### Inspiration References
- **Stripe**: Typography confidence, whitespace, subtle gradients
- **Linear**: Dark mode elegance, crisp UI, motion
- **Vercel**: Minimalism, bold type, black/white foundations
- **Notion**: Friendly professionalism, clean hierarchy

---

## COLOR SYSTEM

### Design Decision (DEC-008)
Shifting from pure pink (#ec4899) to a warmer rose/coral that reads more premium while retaining brand recognition.

### Primary Palette (Rose)
```css
/* Warm rose - premium but approachable */
--brand-50: #fff1f2;
--brand-100: #ffe4e6;
--brand-200: #fecdd3;
--brand-300: #fda4af;
--brand-400: #fb7185;
--brand-500: #f43f5e;  /* Primary action color */
--brand-600: #e11d48;  /* Hover state */
--brand-700: #be123c;  /* Active/pressed */
--brand-800: #9f1239;
--brand-900: #881337;
--brand-950: #4c0519;
```

### Neutral Palette (Slate)
```css
/* Cooler slate for enterprise feel */
--slate-50: #f8fafc;
--slate-100: #f1f5f9;
--slate-200: #e2e8f0;
--slate-300: #cbd5e1;
--slate-400: #94a3b8;
--slate-500: #64748b;
--slate-600: #475569;
--slate-700: #334155;
--slate-800: #1e293b;
--slate-900: #0f172a;
--slate-950: #020617;
```

### Semantic Colors
```css
/* Success */
--success-500: #22c55e;
--success-600: #16a34a;

/* Warning */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error */
--error-500: #ef4444;
--error-600: #dc2626;

/* Info */
--info-500: #3b82f6;
--info-600: #2563eb;
```

### Application Rules
| Use Case | Token |
|----------|-------|
| Primary buttons | brand-500 (hover: brand-600) |
| Text links | brand-600 |
| Headlines | slate-900 |
| Body text | slate-600 |
| Secondary text | slate-500 |
| Borders | slate-200 |
| Background | white or slate-50 |
| Cards | white with slate-200 border |

---

## TYPOGRAPHY

### Font Stack
```css
--font-primary: 'Outfit', system-ui, -apple-system, sans-serif;
```

**Note**: Outfit is already implemented. It's geometric, modern, and highly legible—excellent choice. No change needed.

### Type Scale
| Name | Size | Line Height | Weight | Use |
|------|------|-------------|--------|-----|
| display | 72px (4.5rem) | 1.1 | 900 | Hero headlines only |
| h1 | 48px (3rem) | 1.2 | 800 | Page titles |
| h2 | 36px (2.25rem) | 1.25 | 700 | Section headers |
| h3 | 24px (1.5rem) | 1.3 | 700 | Subsection headers |
| h4 | 20px (1.25rem) | 1.4 | 600 | Card titles |
| body-lg | 18px (1.125rem) | 1.6 | 400 | Hero subtext, lead paragraphs |
| body | 16px (1rem) | 1.6 | 400 | Default body text |
| body-sm | 14px (0.875rem) | 1.5 | 400 | Secondary text, captions |
| caption | 12px (0.75rem) | 1.4 | 500 | Labels, badges, fine print |

### Font Weights
| Weight | Value | Use |
|--------|-------|-----|
| Regular | 400 | Body text |
| Medium | 500 | Buttons, labels |
| Semibold | 600 | Subheadings, emphasis |
| Bold | 700 | Section headers |
| Extrabold | 800 | Page titles |
| Black | 900 | Display headlines |

### Typography Classes (Tailwind)
```
.text-display: text-6xl lg:text-7xl font-black tracking-tight
.text-h1: text-4xl lg:text-5xl font-extrabold tracking-tight
.text-h2: text-3xl lg:text-4xl font-bold
.text-h3: text-xl lg:text-2xl font-bold
.text-h4: text-lg lg:text-xl font-semibold
.text-body-lg: text-lg leading-relaxed
.text-body: text-base leading-relaxed
.text-body-sm: text-sm
.text-caption: text-xs font-medium uppercase tracking-wider
```

---

## SPACING SYSTEM

### Base Unit
**4px (0.25rem)** - All spacing should be multiples of 4px.

### Spacing Scale
| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Tight gaps (icon + text) |
| space-2 | 8px | Related elements |
| space-3 | 12px | Default element gap |
| space-4 | 16px | Component padding |
| space-5 | 20px | Card padding |
| space-6 | 24px | Section inner spacing |
| space-8 | 32px | Between components |
| space-10 | 40px | Major content breaks |
| space-12 | 48px | Section padding (mobile) |
| space-16 | 64px | Section padding (tablet) |
| space-20 | 80px | Section padding (desktop) |
| space-24 | 96px | Large section padding |

### Section Vertical Rhythm
```css
/* Mobile */
section { padding: 48px 0; } /* py-12 */

/* Tablet */
@media (min-width: 640px) {
  section { padding: 64px 0; } /* sm:py-16 */
}

/* Desktop */
@media (min-width: 1024px) {
  section { padding: 96px 0; } /* lg:py-24 */
}
```

---

## LAYOUT SYSTEM

### Container
```css
.container {
  max-width: 1280px; /* max-w-7xl */
  margin: 0 auto;
  padding: 0 16px; /* px-4 */
}

@media (min-width: 640px) {
  .container { padding: 0 24px; } /* sm:px-6 */
}

@media (min-width: 1024px) {
  .container { padding: 0 32px; } /* lg:px-8 */
}
```

### Grid
- **2 columns**: Features, comparison, audience fork
- **3 columns**: Process steps (desktop), pricing cards
- **4 columns**: Feature grid, testimonials
- **Gap**: 24px mobile, 32px tablet, 40px desktop

### Breakpoints (Tailwind defaults)
| Name | Width | Target |
|------|-------|--------|
| sm | 640px | Large phones, small tablets |
| md | 768px | Tablets |
| lg | 1024px | Small desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Wide screens |

---

## COMPONENTS

### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--brand-500);
  color: white;
  font-weight: 500;
  padding: 12px 24px; /* h-12 px-6 */
  border-radius: 12px; /* rounded-xl */
  transition: all 200ms ease;
}
.btn-primary:hover {
  background: var(--brand-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(244, 63, 94, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
}
```

**Secondary Button (Outline)**
```css
.btn-secondary {
  background: transparent;
  color: var(--slate-700);
  border: 2px solid var(--slate-200);
  font-weight: 500;
  padding: 10px 22px;
  border-radius: 12px;
}
.btn-secondary:hover {
  border-color: var(--brand-400);
  background: var(--brand-50);
  color: var(--brand-600);
}
```

**Ghost Button**
```css
.btn-ghost {
  background: transparent;
  color: var(--slate-600);
  font-weight: 500;
  padding: 8px 16px;
}
.btn-ghost:hover {
  background: var(--slate-100);
  color: var(--slate-900);
}
```

**White Button (for brand/dark backgrounds)**
```css
.btn-white {
  background: white;
  color: var(--brand-600);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 200ms ease;
}
.btn-white:hover {
  background: var(--slate-50);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**White Outline Button (for dark backgrounds)**
```css
.btn-outline-white {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  font-weight: 500;
  padding: 10px 22px;
  border-radius: 12px;
  transition: all 200ms ease;
}
.btn-outline-white:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}
```

**Button Sizes**
| Size | Height | Padding | Font |
|------|--------|---------|------|
| sm | 36px (h-9) | 12px 16px | 14px |
| default | 44px (h-11) | 12px 20px | 15px |
| lg | 52px (h-13) | 14px 28px | 16px |

### Cards

**Feature Card**
```css
.card-feature {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 16px;
  padding: 24px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card-feature:hover {
  border-color: var(--brand-200);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.08);
}
```

**Process Card (Step)**
```css
.card-step {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 16px;
  padding: 24px;
  position: relative;
}
/* Step number badge */
.card-step-number {
  position: absolute;
  top: -12px;
  left: 24px;
  width: 32px;
  height: 32px;
  background: var(--brand-500);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}
```

**Pain Point Card (Problem Agitation)**
```css
.card-pain {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card-pain:hover {
  border-color: var(--error-200);
  box-shadow: 0 8px 24px -4px rgba(239, 68, 68, 0.08);
}
.card-pain .icon-container {
  background: var(--error-50);
  margin: 0 auto 16px;
}
.card-pain .icon-container svg {
  color: var(--error-500);
}
.card-pain h3 {
  color: var(--slate-900);
  font-weight: 600;
  margin-bottom: 8px;
}
.card-pain p {
  color: var(--slate-600);
}
```

### Section Headers

**Pattern**
```html
<div class="text-center mb-12 lg:mb-16">
  <span class="text-caption text-brand-600 mb-2 block">
    SECTION LABEL
  </span>
  <h2 class="text-h2 text-slate-900 mb-4">
    Section Headline
  </h2>
  <p class="text-body-lg text-slate-600 max-w-2xl mx-auto">
    Supporting description text.
  </p>
</div>
```

### Icon Containers
```css
.icon-container {
  width: 48px;
  height: 48px;
  background: var(--brand-50);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-container svg {
  width: 24px;
  height: 24px;
  color: var(--brand-600);
}
/* Hover within card */
.card-feature:hover .icon-container {
  background: var(--brand-100);
}
```

### Trust Badges
```css
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--slate-500);
  font-size: 14px;
}
.trust-badge .dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}
```

### Input Fields
```css
.input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: white;
  border: 2px solid var(--slate-200);
  border-radius: 12px;
  font-size: 16px;
  color: var(--slate-900);
  transition: border-color 200ms, box-shadow 200ms;
}
.input:focus {
  outline: none;
  border-color: var(--brand-400);
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1);
}
.input::placeholder {
  color: var(--slate-400);
}
```

---

## MOTION

### Principles
1. **Purposeful**: Motion should guide attention, not distract
2. **Fast**: Most interactions < 300ms
3. **Smooth**: Use ease-out for entries, ease-in for exits
4. **Respectful**: Honor `prefers-reduced-motion`

### Duration Scale
| Token | Duration | Use |
|-------|----------|-----|
| instant | 100ms | Hover states, toggles |
| fast | 200ms | Buttons, small elements |
| normal | 300ms | Cards, modals, panels |
| slow | 500ms | Page transitions, large reveals |
| slower | 800ms | Staggered lists, hero animations |

### Easing Functions
```css
/* Enter (element appearing) */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Exit (element disappearing) */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Bounce (playful interactions) */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Linear (progress bars, continuous) */
--ease-linear: linear;
```

### Standard Animations
```css
/* Fade in up (section reveals) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale in (modals, popovers) */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Stagger delay pattern */
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 50ms; }
.stagger > *:nth-child(3) { animation-delay: 100ms; }
.stagger > *:nth-child(4) { animation-delay: 150ms; }
```

---

## IMAGERY

### Photo Direction
- **Status**: ✅ Defined
- **Primary**: Product UI screenshots (dashboard, features in action)
- **Secondary**: Abstract gradients, geometric patterns
- **Avoid**: Generic stock photos of people, especially for hero
- **If people needed**: Authentic, diverse, natural lighting

### Product Screenshots
- Use actual dashboard screenshots where possible
- Apply subtle shadows: `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15)`
- Round corners: 12-16px
- Can use device frames (browser chrome, phone mockups)

### Decorative Elements
- Subtle gradient blurs (background)
- Geometric patterns (dots, grids) at low opacity
- Avoid: heavy illustrations, 3D renders, generic icons

### Icon Style
- **Library**: Lucide React (already implemented)
- **Size**: 20px for inline, 24px for cards
- **Stroke**: 2px (default)
- **Color**: Inherit from text or use brand-600

---

## SHADOWS

### Elevation Scale
```css
/* Subtle - cards at rest */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Default - cards, dropdowns */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* Elevated - hover states, modals */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* Prominent - floating elements */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 8px 10px -6px rgba(0, 0, 0, 0.1);

/* Brand shadow (for primary buttons) */
--shadow-brand: 0 4px 14px -2px rgba(244, 63, 94, 0.25);
```

---

## BORDER RADIUS

| Token | Value | Use |
|-------|-------|-----|
| rounded-sm | 6px | Small badges, tags |
| rounded-md | 8px | Inputs, small buttons |
| rounded-lg | 12px | Buttons, cards |
| rounded-xl | 16px | Large cards, modals |
| rounded-2xl | 20px | Hero cards, feature panels |
| rounded-full | 9999px | Pills, avatars |

---

## /CREATOR PAGE COMPONENTS

### Page Theme: Light & Energetic
The /creator page uses a **light theme** to differentiate from the dark /studio page. The visual approach is warm, approachable, and mobile-first—reflecting the individual creator audience.

### Color Application (/creator)
```css
/* Creator page-specific color usage */

/* Hero background - warm gradient */
.creator-hero-bg {
  background: linear-gradient(135deg, var(--brand-50) 0%, white 50%, var(--slate-50) 100%);
}

/* Pain point cards - light with subtle brand border */
.creator-pain-card {
  background: white;
  border: 1px solid var(--slate-200);
  border-left: 3px solid var(--brand-400);  /* Softer than studio's red */
}

/* Feature cards - elevated white on light gray */
.creator-feature-card {
  background: white;
  border: 1px solid var(--slate-200);
  box-shadow: var(--shadow-md);
}
.creator-feature-card:hover {
  border-color: var(--brand-300);
  box-shadow: var(--shadow-lg);
}

/* Section backgrounds - alternating */
.section-light { background: white; }
.section-soft { background: var(--slate-50); }
.section-brand-soft { background: var(--brand-50); }

/* Final CTA - brand gradient (warm) */
.creator-cta-bg {
  background: linear-gradient(135deg, var(--brand-500) 0%, var(--brand-600) 100%);
}
```

### Creator Hero Component
```css
.creator-hero {
  /* Light background with subtle warmth */
  background: linear-gradient(135deg, #fff1f2 0%, #ffffff 60%, #f8fafc 100%);
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.creator-hero::before {
  /* Subtle decorative gradient blob */
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(251, 113, 133, 0.15) 0%, transparent 70%);
  top: -200px;
  right: -200px;
  pointer-events: none;
}

.creator-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--brand-100);
  color: var(--brand-700);
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
}

.creator-hero-headline {
  font-size: 56px;  /* Slightly smaller than studio's 64px */
  font-weight: 700;
  color: var(--slate-900);
  line-height: 1.1;
  max-width: 700px;
}

@media (max-width: 768px) {
  .creator-hero-headline {
    font-size: 36px;
  }
}
```

### Pain Point Cards (Creator Edition)
```css
.creator-pain-card {
  background: white;
  border: 1px solid var(--slate-200);
  border-left: 3px solid var(--brand-400);
  border-radius: 12px;
  padding: 24px;
  transition: all 200ms ease-out;
}

.creator-pain-card:hover {
  border-left-color: var(--brand-500);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.creator-pain-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--slate-900);
  margin-bottom: 8px;
}

.creator-pain-desc {
  font-size: 15px;
  color: var(--slate-600);
  line-height: 1.6;
}
```

### Feature Cards (Creator Edition)
```css
/* 4-card grid (2x2 on desktop, 1 column on mobile) */
.creator-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .creator-features-grid {
    grid-template-columns: 1fr;
  }
}

.creator-feature-card {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-sm);
  transition: all 200ms ease-out;
}

.creator-feature-card:hover {
  border-color: var(--brand-300);
  box-shadow: var(--shadow-lg);
}

.creator-feature-icon {
  width: 48px;
  height: 48px;
  background: var(--brand-100);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.creator-feature-icon svg {
  width: 24px;
  height: 24px;
  color: var(--brand-600);
}

.creator-feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--slate-900);
  margin-bottom: 8px;
}

.creator-feature-desc {
  font-size: 15px;
  color: var(--slate-600);
  line-height: 1.6;
}
```

### Process Steps (3-Step Timeline)
```css
.creator-process {
  display: flex;
  justify-content: center;
  gap: 48px;
  position: relative;
}

/* Connecting line between steps */
.creator-process::before {
  content: '';
  position: absolute;
  top: 28px;
  left: 25%;
  right: 25%;
  height: 2px;
  background: var(--slate-200);
  z-index: 0;
}

@media (max-width: 768px) {
  .creator-process {
    flex-direction: column;
    gap: 32px;
  }
  .creator-process::before {
    display: none;
  }
}

.creator-step {
  text-align: center;
  position: relative;
  z-index: 1;
  flex: 1;
  max-width: 280px;
}

.creator-step-number {
  width: 56px;
  height: 56px;
  background: var(--brand-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0 auto 16px;
}

.creator-step-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--slate-900);
  margin-bottom: 8px;
}

.creator-step-desc {
  font-size: 15px;
  color: var(--slate-600);
  line-height: 1.5;
}
```

### Primary Button (Creator Page)
```css
/* Standard brand button - same as homepage */
.btn-brand {
  background: var(--brand-500);
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: var(--shadow-brand);
  transition: all 200ms ease-out;
}

.btn-brand:hover {
  background: var(--brand-600);
  transform: translateY(-1px);
}

/* Ghost button for secondary actions */
.btn-ghost {
  background: transparent;
  color: var(--slate-600);
  padding: 14px 28px;
  border: 1px solid var(--slate-300);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  transition: all 200ms ease-out;
}

.btn-ghost:hover {
  border-color: var(--brand-400);
  color: var(--brand-600);
  background: var(--brand-50);
}
```

### Final CTA Section (Creator)
```css
.creator-final-cta {
  background: linear-gradient(135deg, var(--brand-500) 0%, var(--brand-600) 100%);
  padding: 80px 24px;
  text-align: center;
  border-radius: 24px;  /* Rounded on desktop */
  margin: 0 24px 80px;
}

@media (max-width: 768px) {
  .creator-final-cta {
    border-radius: 0;
    margin: 0 0 0;
  }
}

.creator-final-cta h2 {
  color: white;
  font-size: 40px;
  font-weight: 700;
}

.creator-final-cta p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
}

/* White button variant for brand backgrounds */
.btn-white {
  background: white;
  color: var(--brand-600);
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.btn-white:hover {
  background: var(--slate-50);
  transform: translateY(-1px);
}
```

### AI & Bio Highlight Cards (Condensed)
```css
.creator-highlight-card {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 20px;
  padding: 48px;
  display: flex;
  align-items: center;
  gap: 48px;
}

@media (max-width: 768px) {
  .creator-highlight-card {
    flex-direction: column;
    padding: 32px;
    text-align: center;
  }
}

.creator-highlight-visual {
  flex: 1;
  max-width: 400px;
}

.creator-highlight-content {
  flex: 1;
}

.creator-highlight-kicker {
  display: inline-block;
  padding: 6px 12px;
  background: var(--brand-100);
  color: var(--brand-700);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}
```

### Trust Badges (Light Theme)
```css
.creator-trust-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 32px;
}

.creator-trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 9999px;
  font-size: 14px;
  color: var(--slate-600);
}

.creator-trust-badge svg {
  width: 16px;
  height: 16px;
  color: var(--brand-500);
}
```

---

## PAGE VISUAL COMPARISON

| Element | Homepage | /studio | /creator |
|---------|----------|---------|----------|
| Hero BG | Light gradient | Dark (slate-900) | Light gradient (brand-50) |
| Hero Headline | 56-64px | 64px bold | 56px |
| Pain Cards | N/A | Dark cards, red accent | White cards, brand accent |
| Feature Grid | 4 cols | 3x2 = 6 cards | 2x2 = 4 cards |
| Process Steps | 4 steps | 4 steps | 3 steps |
| CTA Style | Brand button | White on dark | Brand button |
| Final CTA BG | Brand gradient | Brand gradient | Brand gradient (rounded) |
| Overall Tone | Professional | Enterprise/serious | Friendly/approachable |

---

## DARK MODE (Future)

**Not implementing for launch.** When ready:
- Backgrounds: slate-900, slate-800
- Cards: slate-800 with slate-700 borders
- Text: slate-100 (primary), slate-400 (secondary)
- Brand colors: Same palette works well on dark
