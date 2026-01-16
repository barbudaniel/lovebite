# LOVDASH IMPLEMENTATION NOTES

> Technical specifications, component architecture, and implementation details.

---

## CURRENT STACK

### Framework
- **Next.js** (App Router)
- **React** with TypeScript
- **Tailwind CSS** for styling

### Key Libraries
- `motion/react` (Framer Motion) for animations
- `lucide-react` for icons
- `@radix-ui` components (via shadcn/ui)

### File Structure
```
app/
├── (marketing)/          # Marketing pages
│   ├── page.tsx          # Homepage
│   ├── layout.tsx        # Marketing layout
│   ├── creator/          # Creator landing
│   ├── join/             # Signup
│   ├── privacy/          # Privacy policy
│   └── terms/            # Terms of service
├── ai/                   # AI feature page
├── bio/                  # Bio link feature
├── api/
│   ├── migrate/          # MongoDB migration
│   ├── data/             # Unified data API
│   ├── analytics/        # Analytics endpoints
│   ├── auth/             # Auth helpers
│   └── media/            # Media operations
└── dashboard/
    ├── layout.tsx        # Dashboard shell + sidebar
    ├── page.tsx          # Overview
    ├── media/            # Media library
    ├── bio-links/        # Bio editor
    ├── statistics/       # Analytics
    ├── accounts/         # Social accounts
    ├── admin/
    │   ├── page.tsx      # Admin dashboard
    │   └── migration/    # Data migration UI
    ├── models/           # Creator management
    ├── studios/          # Studio management
    └── settings/         # User settings

components/
├── media/
│   ├── MediaGrid.tsx     # Grid/list view
│   ├── MediaViewer.tsx   # Full-screen viewer
│   ├── MobileUploader.tsx# TikTok-style upload
│   └── LabelManager.tsx  # Label/tag management
├── sections/             # Marketing page sections
├── ui/                   # shadcn/ui components
└── motion/               # Animation components

lib/
├── mongodb/
│   ├── client.ts         # Connection singleton
│   ├── types.ts          # TypeScript interfaces
│   ├── queries.ts        # Query helpers
│   ├── sync.ts           # Auth sync functions
│   └── setup.ts          # Index/seed scripts
├── supabase.ts           # Supabase client
├── media-api.ts          # Media API helpers
└── utils.ts              # Shared utilities
```

---

## CURRENT HOMEPAGE SECTIONS

| Section | File | Purpose |
|---------|------|---------|
| Navigation | `navigation.tsx` | Site header |
| Hero | `hero.tsx` | Main headline + CTA |
| Marquee | `marquee.tsx` | Social proof scroll |
| Process | `process.tsx` | How it works |
| About | `about.tsx` | Benefits/features |
| Earnings | `earnings.tsx` | Revenue/pricing info |
| LovdashAI | `lovdash-ai.tsx` | AI feature highlight |
| LovdashBio | `lovdash-bio.tsx` | Bio feature highlight |
| Testimonials | `testimonials.tsx` | Social proof |
| FAQ | `faq.tsx` | Common questions |
| Contact | `contact.tsx` | Lead capture |
| Footer | `footer.tsx` | Site footer |

---

## INFORMATION ARCHITECTURE

### Status
✅ Complete - Defined by UX Strategist (DEC-005, DEC-006)

### Site Map
```
lovdash.com/
├── / (Homepage)              ← Primary conversion page
├── /creator                  ← Individual creator landing
├── /studio                   ← Studio/agency landing (NEW)
├── /ai                       ← AI feature deep dive
├── /bio                      ← Bio link feature deep dive
├── /pricing                  ← Pricing page (if applicable)
├── /join                     ← Signup/waitlist
├── /terms                    ← Terms of service
├── /privacy                  ← Privacy policy
└── /dashboard/*              ← App (post-auth)
```

### User Flows

**Flow 1: Individual Creator**
```
Homepage → Hero → How It Works → AI Feature → Bio Feature → Testimonials → /creator → /join
```

**Flow 2: Studio/Agency**
```
Homepage → Hero → Audience Fork → /studio → Features → Pricing → /join
```

**Flow 3: Feature-First (SEO)**
```
/ai or /bio → Feature Detail → Back to Homepage or /join
```

### Primary Conversion Goals
1. **Waitlist signup** (current stage - pre-launch)
2. **Free trial start** (future)
3. **Demo request** (for studios)

---

## MARKETING WEBSITE SECTION SPECS

### Navigation (`navigation.tsx`)
- **Purpose**: Global navigation, brand presence, primary CTA access
- **Key Elements**:
  - Logo (left)
  - Nav links: Features, AI, Bio, Pricing, Studios
  - CTA button: "Get Started" or "Join Waitlist"
- **Behavior**: Sticky on scroll, transparent → solid background

### Hero (`hero.tsx`) — NEEDS REWRITE
- **Purpose**: Instant clarity on what Lovdash is + primary conversion
- **Key Messages**:
  - WHAT: Creator operating system / Media-to-revenue platform
  - WHO: Creators and studios in the adult-friendly ecosystem
  - VALUE: Turn media into consistent distribution + measurable revenue
- **Required Elements**:
  - Headline: Product-focused, not service-focused
  - Subheadline: Clarify the "how" in one sentence
  - Primary CTA: "Start Free" or "Join Waitlist"
  - Secondary CTA: "See How It Works"
  - Social proof: Platform integrations or user count
  - Visual: Product screenshot or abstract (NOT stock photo of person)
- **Remove**: Agency language ("we manage", "we pay you"), stock model photos

### Social Proof Bar (`marquee.tsx`)
- **Purpose**: Build immediate trust
- **Options** (pick 1-2):
  - Platform integration logos (OnlyFans, Fansly, etc.)
  - "X creators" or "X media organized"
  - Trust badges (privacy, security)
- **Avoid**: Fake testimonial quotes, unverifiable claims

### How It Works (`process.tsx`) — NEEDS REWRITE
- **Purpose**: Show the product workflow (not service workflow)
- **Key Messages**: 
  1. Upload media
  2. AI organizes + tags
  3. Schedule across platforms
  4. Track performance
- **Required Elements**:
  - 3-4 steps max
  - Icon + title + brief description each
  - Optional: Animated/interactive demo
- **Remove**: "Application", "Agreement", "We pay you monthly" (service language)

### Core Features (`about.tsx`) — NEEDS REWRITE
- **Purpose**: Highlight platform capabilities
- **Key Messages**:
  - AI-powered media organization
  - Multi-platform scheduling + autopilot
  - Bio link builder with analytics
  - Studio tools for managing multiple creators
- **Required Elements**:
  - 4 feature cards with icons
  - Each: Title + 1-line benefit
- **Remove**: "We bring traffic", "We respond to customers" (agency language)

### AI Feature Highlight (`lovdash-ai.tsx`)
- **Purpose**: Tease the AI capabilities, drive to /ai page
- **Key Messages**:
  - Automatic tagging + descriptions
  - NSFW detection + safety rails
  - Content similarity search
  - Platform-ready captions
- **Required Elements**:
  - Feature preview (screenshot or animation)
  - "Learn more about Lovdash AI" CTA

### Bio Feature Highlight (`lovdash-bio.tsx`)
- **Purpose**: Tease bio link builder, drive to /bio page
- **Key Messages**:
  - Unified link-in-bio for adult creators
  - Analytics on every click
  - Custom themes + branding
  - Revenue attribution
- **Required Elements**:
  - Bio link preview (mock phone frame)
  - "Create your Bio" CTA

### Audience Fork (NEW SECTION)
- **Purpose**: Route visitors to segment-specific pages
- **Key Messages**:
  - "I'm a creator" → self-serve tools, upload once publish everywhere
  - "I'm a studio/agency" → multi-creator management, reporting, accountability
- **Required Elements**:
  - Two cards/paths with distinct CTAs
  - Brief value props for each audience

### Testimonials (`testimonials.tsx`)
- **Purpose**: Social proof from real users
- **Requirements**:
  - Real names/usernames (or anonymized but credible)
  - Specific outcomes (not vague praise)
  - Mix of creators and studios if possible
- **If no testimonials yet**: Use platform stats or skip section

### FAQ (`faq.tsx`)
- **Purpose**: Address objections, reduce friction
- **Key Questions to Answer**:
  - What platforms does it work with?
  - Is my content private/secure?
  - How much does it cost?
  - Can I use it for multiple accounts?
  - What makes it different from [competitor]?
- **Format**: Accordion with expand/collapse

### Final CTA (`contact.tsx`) — NEEDS REWRITE
- **Purpose**: Capture leads who scrolled all the way
- **Key Elements**:
  - Strong headline (reiterate value prop)
  - Email capture form (waitlist) OR "Get Started" button
  - Trust reinforcement (privacy, no spam)
- **Remove**: "Leave your contact" (passive), agency-style form

### Footer (`footer.tsx`)
- **Purpose**: Navigation, legal links, brand closure
- **Required Elements**:
  - Logo
  - Navigation links (grouped)
  - Legal: Terms, Privacy
  - Social links (if applicable)
  - Copyright

---

## /CREATOR LANDING PAGE SPECS

### Status
🟢 UX Strategy Complete - Ready for Copy Lead

### Page Purpose
Convert individual creators who want to simplify their multi-platform workflow. This audience values simplicity, time savings, and creative freedom over team management features.

### Target Audience Profile
- **Who**: Individual content creators, influencers, solo entrepreneurs
- **Pain Points**: 
  - Managing multiple platforms is exhausting
  - Inconsistent posting hurts growth
  - No time for admin work—want to focus on creating
  - Can't track what's actually working
  - Bio link pages are boring and don't convert
- **Goals**:
  - Upload once, publish everywhere
  - Spend less time on admin, more time creating
  - Grow audience without burning out
- **Objections**:
  - "Is this just another tool to learn?"
  - "Will it actually save me time?"
  - "Is my content secure?"
  - "What's the catch?"

### Page Narrative Flow
```
Hero → Pain Points → Solution → Key Features → AI Highlight → Bio Highlight → Process → Testimonials → Pricing → FAQ → CTA
```

### Page Differentiation from /studio
| Aspect | /creator | /studio |
|--------|----------|---------|
| Tone | Friendly, personal | Professional, enterprise |
| Hero visual | Light, vibrant | Dark, serious |
| Pain points | Time exhaustion, platform chaos | Spreadsheets, no visibility |
| Features | Self-serve simplicity | Team management |
| CTA | "Start Free" / "Join Waitlist" | "Book a Demo" |
| Social proof | Individual testimonials | Studio stats/logos |

### Section Specs

#### 1. Creator Hero
- **Purpose**: Instantly connect with individual creators, promise simplicity
- **Headline**: "Upload once. Publish everywhere. Create more."
- **Subheadline**: "Lovdash handles the boring stuff so you can focus on what you love—creating content that connects."
- **Primary CTA**: "Start Free" or "Join Waitlist"
- **Secondary CTA**: "See How It Works"
- **Visual**: Bright, energetic product screenshot (mobile-first upload flow)
- **Trust Badges**: "Works with OnlyFans, Fansly & more" | "AI-powered" | "Privacy-first"

#### 2. Pain Points Section (Creator Edition)
- **Purpose**: Show you understand their daily struggle
- **Format**: 3-column layout
- **Problems**:
  1. "Platform juggling" - Posting to 5 platforms means 5 logins, 5 uploads, 5 captions
  2. "Time drain" - Hours spent on admin instead of creating
  3. "Growth guesswork" - No idea which content actually drives results
- **Transition**: "Sound exhausting? There's a better way."

#### 3. Solution Overview
- **Purpose**: High-level pitch of what Lovdash does for creators
- **Format**: Centered text + product visual
- **Key Message**: "One upload. Every platform. Zero hassle."
- **Body**: "Lovdash is your personal content operating system. Upload your media once, and we'll organize it, schedule it across all your platforms, and show you exactly what's working."

#### 4. Key Features (Creator Edition)
- **Purpose**: Highlight features that matter to individuals
- **Format**: 4 feature cards (not 6 like studio)
- **Features**:
  1. **One-Click Publishing** - Upload once, post to all your connected platforms automatically
  2. **AI That Gets You** - Smart tagging, auto-descriptions, and content suggestions
  3. **Bio Link That Converts** - Custom link-in-bio page with real analytics
  4. **Know What Works** - See which content drives engagement and revenue

#### 5. AI Highlight (Same as homepage, or condensed)
- **Purpose**: Tease AI capabilities
- **Key Message**: "Your content, organized automatically"
- **CTA**: "Explore Lovdash AI"

#### 6. Bio Highlight (Same as homepage, or condensed)
- **Purpose**: Tease bio link builder
- **Key Message**: "One link for all your platforms"
- **CTA**: "Create Your Bio"

#### 7. How It Works (Creator Edition)
- **Purpose**: Show the simple 3-step workflow
- **Steps** (simpler than studio's 4):
  1. **Upload** - Drop your content into Lovdash
  2. **Schedule** - Pick your platforms and posting times
  3. **Grow** - Watch your analytics and optimize
- **Format**: Horizontal timeline, 3 steps

#### 8. Testimonials (if available)
- **Purpose**: Social proof from real creators
- **Format**: 2-3 creator testimonials with specific outcomes
- **If no testimonials**: Skip section (same as studio approach)

#### 9. Pricing Preview (Optional)
- **Purpose**: Set expectations on cost
- **Options**:
  - "Free to start" if freemium exists
  - "Join waitlist for early access pricing"
  - Skip if pricing not finalized
- **Note**: Creators are price-sensitive; emphasize value and free tier if available

#### 10. Creator FAQ
- **Purpose**: Address creator-specific objections
- **Questions** (6):
  1. How much does Lovdash cost?
  2. Which platforms does it work with?
  3. Is my content private and secure?
  4. How does the AI tagging work?
  5. Can I still post manually if I want?
  6. What if I want to cancel?
- **Format**: Accordion (same as homepage/studio)

#### 11. Final CTA
- **Purpose**: Convert interested creators
- **Headline**: "Ready to create more and manage less?"
- **Subheadline**: "Join creators who are simplifying their workflow with Lovdash."
- **Primary CTA**: "Start Free" or "Join Waitlist"
- **Trust Line**: "No credit card required. Cancel anytime."

### Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Navigation - same as homepage]                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CREATOR HERO (light theme)                                 │
│  "Upload once. Publish everywhere. Create more."            │
│  [Start Free] [See How It Works]                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  PAIN POINTS (3 columns)                                    │
│  Platform juggling | Time drain | Growth guesswork          │
├─────────────────────────────────────────────────────────────┤
│  SOLUTION OVERVIEW                                          │
│  "One upload. Every platform. Zero hassle."                 │
├─────────────────────────────────────────────────────────────┤
│  KEY FEATURES (4 cards)                                     │
│  Publishing | AI | Bio | Analytics                          │
├─────────────────────────────────────────────────────────────┤
│  AI HIGHLIGHT (condensed)                                   │
├─────────────────────────────────────────────────────────────┤
│  BIO HIGHLIGHT (condensed)                                  │
├─────────────────────────────────────────────────────────────┤
│  HOW IT WORKS (3 steps)                                     │
│  Upload → Schedule → Grow                                   │
├─────────────────────────────────────────────────────────────┤
│  [TESTIMONIALS - if available]                              │
├─────────────────────────────────────────────────────────────┤
│  [PRICING - if finalized]                                   │
├─────────────────────────────────────────────────────────────┤
│  CREATOR FAQ (6 questions)                                  │
├─────────────────────────────────────────────────────────────┤
│  FINAL CTA                                                  │
│  "Ready to create more and manage less?"                    │
│  [Start Free]                                               │
├─────────────────────────────────────────────────────────────┤
│  [Footer - same as homepage]                                │
└─────────────────────────────────────────────────────────────┘
```

### SEO Considerations
- **Title**: "Lovdash for Creators | Upload Once, Publish Everywhere"
- **Description**: "Simplify your content workflow. Upload once and publish to all your platforms. AI-powered organization, scheduling, and analytics for individual creators."
- **Target Keywords**: "content creator tools", "multi-platform publishing", "creator workflow", "content scheduling", "bio link builder"

### Conversion Goals
1. **Primary**: Join waitlist (pre-launch) or Start free trial (post-launch)
2. **Secondary**: Create bio link (low-friction entry point)
3. **Tertiary**: Explore AI features

### Visual Differentiation
- **Hero**: Light background (brand-50 or white) vs studio's dark
- **Tone**: Energetic, friendly vs studio's professional
- **Imagery**: Mobile-first, creator-focused vs studio's dashboard views

---

## /CREATOR PAGE VISUAL SPECS

### Status
🟢 Visual Design Complete - Ready for Frontend Assembly

### Component Inventory (New Components Needed)

| Component | Path | Description |
|-----------|------|-------------|
| `CreatorHero` | `components/sections/creator/CreatorHero.tsx` | Light gradient hero with kicker badge |
| `CreatorPainPoints` | `components/sections/creator/CreatorPainPoints.tsx` | 3-column pain cards with brand accent |
| `CreatorSolution` | `components/sections/creator/CreatorSolution.tsx` | Centered text + product visual |
| `CreatorFeatures` | `components/sections/creator/CreatorFeatures.tsx` | 2x2 feature grid |
| `CreatorAIHighlight` | `components/sections/creator/CreatorAIHighlight.tsx` | Condensed AI feature card |
| `CreatorBioHighlight` | `components/sections/creator/CreatorBioHighlight.tsx` | Condensed bio feature card |
| `CreatorProcess` | `components/sections/creator/CreatorProcess.tsx` | 3-step horizontal timeline |
| `CreatorFAQ` | `components/sections/creator/CreatorFAQ.tsx` | 6-question accordion |
| `CreatorCTA` | `components/sections/creator/CreatorCTA.tsx` | Rounded brand gradient CTA |

### Page File
- **Path**: `app/(marketing)/creator/page.tsx`
- **Layout**: Uses existing `(marketing)/layout.tsx`

### Section-by-Section Visual Specs

#### 1. Creator Hero
```
┌─────────────────────────────────────────────────────────────┐
│  [Light gradient BG: brand-50 → white → slate-50]          │
│                                                             │
│     ┌─────────────────┐                                     │
│     │ ✨ For Creators │  ← Pill badge (brand-100 bg)       │
│     └─────────────────┘                                     │
│                                                             │
│     Upload once.                                            │
│     Publish everywhere.                                     │
│     Create more.                                            │
│     ↑ 56px, font-weight-700, slate-900                     │
│                                                             │
│     Lovdash handles the boring stuff so you can...          │
│     ↑ 20px, slate-600, max-width: 600px                    │
│                                                             │
│     [Join Waitlist] [See How It Works ↓]                    │
│     ↑ btn-brand       ↑ btn-ghost                          │
│                                                             │
│     ○ Works with...  ○ AI-powered  ○ Privacy-first         │
│     ↑ Trust badges (white bg, slate border)                │
│                                                             │
│  [Decorative gradient blob: top-right, brand-400 @ 15%]    │
└─────────────────────────────────────────────────────────────┘
```

**Responsive (Mobile)**:
- Headline: 36px
- Stack content vertically
- Full-width buttons
- Hide decorative blob

#### 2. Pain Points Section
```
Background: slate-50

┌─────────────────────────────────────────────────────────────┐
│     Sound familiar?                                         │
│     ↑ Kicker: 14px, brand-600, uppercase                   │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │ Platform      │ │ Time          │ │ Growth        │     │
│  │ juggling      │ │ drain         │ │ guesswork     │     │
│  │               │ │               │ │               │     │
│  │ Posting to 5  │ │ You didn't... │ │ You're post...│     │
│  │ platforms...  │ │               │ │               │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
│  ↑ White cards, brand-400 left border, shadow-sm           │
│                                                             │
│     Sound exhausting? There's a better way.                 │
│     ↑ 18px, slate-700, centered                            │
└─────────────────────────────────────────────────────────────┘
```

**Card Specs**:
- Background: white
- Border: 1px slate-200
- Border-left: 3px brand-400
- Border-radius: 12px
- Padding: 24px
- Hover: lift -2px, shadow-md

**Responsive (Mobile)**:
- Single column stack
- Full width cards

#### 3. Solution Overview
```
Background: white

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Your Content Operating System                           │
│     ↑ Kicker: brand-600                                    │
│                                                             │
│     One upload. Every platform. Zero hassle.                │
│     ↑ 40px, font-weight-700, slate-900                     │
│                                                             │
│     Lovdash is your personal content command center...      │
│     ↑ 18px, slate-600, max-width: 700px, centered          │
│                                                             │
│     [Product screenshot or illustration]                    │
│     ↑ 800px max-width, shadow-xl, rounded-2xl              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4. Creator Features (2x2 Grid)
```
Background: slate-50

┌─────────────────────────────────────────────────────────────┐
│     Built for Creators                                      │
│                                                             │
│     Everything you need to grow—without the grind           │
│     ↑ 36px headline                                        │
│                                                             │
│  ┌──────────────────────┐ ┌──────────────────────┐         │
│  │ [Icon]               │ │ [Icon]               │         │
│  │ One-Click Publishing │ │ AI That Gets You     │         │
│  │ Upload once, post... │ │ Smart tagging, auto..│         │
│  └──────────────────────┘ └──────────────────────┘         │
│  ┌──────────────────────┐ ┌──────────────────────┐         │
│  │ [Icon]               │ │ [Icon]               │         │
│  │ Bio Link That Convts │ │ Know What Works      │         │
│  │ Create a beautiful...│ │ Real-time analytics..│         │
│  └──────────────────────┘ └──────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Card Specs**:
- Background: white
- Border: 1px slate-200
- Border-radius: 16px
- Padding: 32px
- Shadow: shadow-sm (rest), shadow-lg (hover)
- Icon container: 48px, brand-100 bg, rounded-12

**Icons (Lucide)**:
1. One-Click Publishing: `Share2` or `Send`
2. AI That Gets You: `Sparkles`
3. Bio Link That Converts: `Link`
4. Know What Works: `BarChart3`

**Responsive (Mobile)**:
- Single column stack

#### 5. AI Highlight (Condensed)
```
Background: white

┌─────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────┐│
│  │                                                        ││
│  │  [Product Visual]    │    Lovdash AI                  ││
│  │  (AI tagging in      │                                ││
│  │   action)            │    Your content, organized     ││
│  │                      │    automatically               ││
│  │                      │                                ││
│  │                      │    Stop wasting time...        ││
│  │                      │                                ││
│  │                      │    [Explore Lovdash AI →]      ││
│  │                      │                                ││
│  └────────────────────────────────────────────────────────┘│
│  ↑ White card, slate-200 border, rounded-20, padding-48   │
│                                                            │
│     AI-generated content is assistive...                   │
│     ↑ Disclaimer: 13px, slate-500                         │
└────────────────────────────────────────────────────────────┘
```

**Responsive (Mobile)**:
- Stack vertically (visual on top)
- Center-align text

#### 6. Bio Highlight (Condensed)
```
Background: slate-50

Same layout as AI Highlight but reversed (content left, visual right)
```

#### 7. Process Steps (3-Step Timeline)
```
Background: white

┌─────────────────────────────────────────────────────────────┐
│     How it works                                            │
│                                                             │
│     Three steps to freedom                                  │
│     ↑ 36px headline                                        │
│                                                             │
│        ①━━━━━━━━━━━━━━②━━━━━━━━━━━━━━③                    │
│                                                             │
│      Upload         Schedule          Grow                  │
│                                                             │
│   Drop your       Pick your       Watch your               │
│   photos and...   platforms...    analytics...             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Step Circle Specs**:
- Size: 56px
- Background: brand-500
- Color: white
- Font: 20px, weight-700
- Connected by 2px slate-200 line

**Responsive (Mobile)**:
- Vertical stack
- Remove connecting line
- Left-align with step indicator

#### 8. Creator FAQ
```
Background: slate-50

Same FAQ component pattern as homepage/studio:
- 6 questions
- Accordion expand/collapse
- Plus/minus icon toggle
```

#### 9. Final CTA
```
┌─────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────┐│
│  │  [Brand gradient: brand-500 → brand-600]              ││
│  │                                                        ││
│  │     Ready to start?                                    ││
│  │     ↑ Kicker: white/90                                ││
│  │                                                        ││
│  │     Create more. Manage less.                          ││
│  │     ↑ 40px, white, weight-700                         ││
│  │                                                        ││
│  │     Join creators who are simplifying...               ││
│  │     ↑ 18px, white/90                                  ││
│  │                                                        ││
│  │     [Join Waitlist]                                    ││
│  │     ↑ btn-white                                       ││
│  │                                                        ││
│  │     No credit card required. Unsubscribe anytime.      ││
│  │     ↑ 14px, white/70                                  ││
│  │                                                        ││
│  │     Your email is safe with us. 18+ only.              ││
│  │     ↑ 13px, white/60                                  ││
│  │                                                        ││
│  └────────────────────────────────────────────────────────┘│
│  ↑ Rounded on desktop (24px), full-bleed on mobile        │
│  ↑ Margin: 0 24px on desktop, 0 on mobile                 │
└─────────────────────────────────────────────────────────────┘
```

### Animation Specs

| Section | Animation | Trigger |
|---------|-----------|---------|
| Hero | Fade in + slide up, staggered | Page load |
| Pain Cards | Fade in up, stagger 50ms | Scroll into view |
| Features | Fade in up, stagger 100ms | Scroll into view |
| Process Steps | Fade in, stagger 150ms | Scroll into view |
| Highlights | Fade in from side | Scroll into view |

**Framer Motion Config**:
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};
```

### Responsive Breakpoints
- **Desktop**: 1024px+ (2-column layouts)
- **Tablet**: 768px-1023px (adjust padding)
- **Mobile**: <768px (single column, stacked)

### Build Order (Recommended)
1. Page shell + metadata (`app/(marketing)/creator/page.tsx`)
2. CreatorHero (most complex animations)
3. CreatorPainPoints
4. CreatorSolution
5. CreatorFeatures
6. CreatorAIHighlight + CreatorBioHighlight
7. CreatorProcess
8. CreatorFAQ (reuse FAQ pattern)
9. CreatorCTA
10. Responsive QA pass

---

## /CREATOR PAGE BUILD PLAN

### Status
🟢 Frontend Assembly Complete - Ready to Build

### File Structure
```
app/(marketing)/creator/
├── page.tsx                    # Main page component + metadata

components/sections/creator/
├── index.ts                    # Barrel export
├── CreatorHero.tsx             # Light gradient hero
├── CreatorPainPoints.tsx       # 3-column pain cards
├── CreatorSolution.tsx         # Centered solution statement
├── CreatorFeatures.tsx         # 2x2 feature grid
├── CreatorAIHighlight.tsx      # Condensed AI feature
├── CreatorBioHighlight.tsx     # Condensed bio feature
├── CreatorProcess.tsx          # 3-step timeline
├── CreatorFAQ.tsx              # 6-question accordion
└── CreatorCTA.tsx              # Final CTA section
```

### Dependencies
- `motion/react` - Framer Motion for animations
- `lucide-react` - Icons (Share2, Sparkles, Link, BarChart3, Shield, Globe, ChevronDown)
- `@/components/ui/button` - Existing button component
- `next/link` - Navigation

---

### COMPONENT CONTRACTS

#### 1. CreatorHero.tsx

```tsx
// File: components/sections/creator/CreatorHero.tsx
"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Globe } from "lucide-react";
import Link from "next/link";

export function CreatorHero() {
  // Copy content
  const content = {
    kicker: "For Creators",
    headline: ["Upload once.", "Publish everywhere.", "Create more."],
    subheadline: "Lovdash handles the boring stuff so you can focus on what you love—creating content that connects.",
    primaryCta: { text: "Join Waitlist", href: "#cta" },
    secondaryCta: { text: "See How It Works", href: "#process" },
    trustBadges: [
      { icon: Globe, text: "Works with OnlyFans, Fansly & more" },
      { icon: Sparkles, text: "AI-powered" },
      { icon: Shield, text: "Privacy-first" },
    ],
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Light gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-slate-50" />
      
      {/* Decorative blob (hidden on mobile) */}
      <div className="hidden lg:block absolute -top-48 -right-48 w-[600px] h-[600px] bg-gradient-radial from-brand-400/15 to-transparent rounded-full" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Content centered on mobile, left on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Kicker badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {content.kicker}
          </motion.span>

          {/* Headline - 56px desktop, 36px mobile */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-slate-900 leading-tight mb-6"
          >
            {content.headline.map((line, i) => (
              <span key={i} className={i === 2 ? "text-brand-600" : ""}>
                {line}
                {i < 2 && <br />}
              </span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto mb-8"
          >
            {content.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* Primary: btn-brand */}
            <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600 text-white h-14 px-8 text-lg rounded-xl shadow-lg shadow-brand-500/25">
              <Link href={content.primaryCta.href}>
                {content.primaryCta.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            {/* Secondary: btn-ghost */}
            <Button asChild variant="outline" size="lg" className="border-slate-300 hover:border-brand-400 hover:bg-brand-50 h-14 px-8 text-lg rounded-xl">
              <Link href={content.secondaryCta.href}>
                {content.secondaryCta.text}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            {content.trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600">
                <badge.icon className="w-4 h-4 text-brand-500" />
                {badge.text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

#### 2. CreatorPainPoints.tsx

```tsx
// File: components/sections/creator/CreatorPainPoints.tsx
"use client";

import { motion } from "motion/react";

const painPoints = [
  {
    title: "Platform juggling",
    description: "Posting to 5 platforms means 5 logins, 5 uploads, 5 captions. By the time you're done, you've lost hours—and your creative energy.",
  },
  {
    title: "Time drain",
    description: "You didn't become a creator to spend your days formatting posts and checking analytics dashboards. Yet here we are.",
  },
  {
    title: "Growth guesswork",
    description: "You're posting consistently, but is it working? Without real data, you're flying blind and hoping for the best.",
  },
];

export function CreatorPainPoints() {
  return (
    <section id="pain" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold text-brand-600 uppercase tracking-wider text-center mb-12"
        >
          Sound familiar?
        </motion.p>

        {/* Pain Point Cards - 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 border-l-[3px] border-l-brand-400 rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{point.title}</h3>
              <p className="text-slate-600 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Transition Line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg text-slate-700 text-center font-medium"
        >
          Sound exhausting? There's a better way.
        </motion.p>
      </div>
    </section>
  );
}
```

#### 3. CreatorSolution.tsx

```tsx
// File: components/sections/creator/CreatorSolution.tsx
"use client";

import { motion } from "motion/react";

export function CreatorSolution() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
        >
          Your Content Operating System
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 mb-6"
        >
          One upload. Every platform. Zero hassle.
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Lovdash is your personal content command center. Upload your media once, and we'll organize it with AI, schedule it across all your platforms, and show you exactly what's working. Less admin. More creating. Better results.
        </motion.p>

        {/* Optional: Product Screenshot Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Product Screenshot</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

#### 4. CreatorFeatures.tsx

```tsx
// File: components/sections/creator/CreatorFeatures.tsx
"use client";

import { motion } from "motion/react";
import { Share2, Sparkles, Link, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Share2,
    title: "One-Click Publishing",
    description: "Upload once, post to all your connected platforms. Same content, multiple destinations, zero extra work.",
  },
  {
    icon: Sparkles,
    title: "AI That Gets You",
    description: "Smart tagging, automatic descriptions, and content suggestions. Let AI handle the tedious stuff while you stay creative.",
  },
  {
    icon: Link,
    title: "Bio Link That Converts",
    description: "Create a beautiful link-in-bio page in minutes. Track every click. See where your fans actually go.",
  },
  {
    icon: BarChart3,
    title: "Know What Works",
    description: "Real-time analytics across all your platforms. See which content drives engagement, traffic, and revenue.",
  },
];

export function CreatorFeatures() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
          >
            Built for Creators
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
          >
            Everything you need to grow—without the grind
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Simple tools that save you time and help you reach more fans.
          </motion.p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-brand-300 hover:shadow-lg transition-all duration-200"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-brand-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### 5. CreatorAIHighlight.tsx

```tsx
// File: components/sections/creator/CreatorAIHighlight.tsx
"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CreatorAIHighlight() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-[20px] p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Visual */}
            <div className="order-2 lg:order-1">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 text-sm">AI Feature Visual</span>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <span className="inline-block px-3 py-1.5 bg-brand-100 text-brand-700 rounded-md text-xs font-semibold uppercase tracking-wider mb-4">
                Lovdash AI
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Your content, organized automatically
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Stop wasting time tagging and describing every piece of content. Lovdash AI analyzes your uploads, generates tags, and writes descriptions—so your library stays organized without the effort.
              </p>
              <Button asChild variant="link" className="text-brand-600 hover:text-brand-700 p-0 h-auto font-semibold">
                <Link href="/ai">
                  Explore Lovdash AI
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-slate-500 mt-4">
          AI-generated content is assistive and may require review.
        </p>
      </div>
    </section>
  );
}
```

#### 6. CreatorBioHighlight.tsx

```tsx
// File: components/sections/creator/CreatorBioHighlight.tsx
"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CreatorBioHighlight() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-[20px] p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content - Left on desktop */}
            <div className="text-center lg:text-left">
              <span className="inline-block px-3 py-1.5 bg-brand-100 text-brand-700 rounded-md text-xs font-semibold uppercase tracking-wider mb-4">
                Lovdash Bio
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                One link for all your platforms
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Give your fans one place to find everything. Customize your bio link page, add all your platforms and content, and track every click with real analytics.
              </p>
              <Button asChild variant="link" className="text-brand-600 hover:text-brand-700 p-0 h-auto font-semibold">
                <Link href="/bio">
                  Create Your Bio
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Visual - Right on desktop */}
            <div>
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <span className="text-slate-400 text-sm">Bio Feature Visual</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

#### 7. CreatorProcess.tsx

```tsx
// File: components/sections/creator/CreatorProcess.tsx
"use client";

import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Drop your photos and videos into Lovdash. AI organizes everything automatically.",
  },
  {
    number: "02",
    title: "Schedule",
    description: "Pick your platforms and set your posting times. We handle the rest.",
  },
  {
    number: "03",
    title: "Grow",
    description: "Watch your analytics. See what's working. Create more of what your audience loves.",
  },
];

export function CreatorProcess() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900"
          >
            Three steps to freedom
          </motion.h2>
        </div>

        {/* Steps - Horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connecting Line (desktop only) */}
          <div className="hidden lg:block absolute top-7 left-1/4 right-1/4 h-0.5 bg-slate-200" />

          <div className="flex flex-col lg:flex-row lg:justify-center gap-8 lg:gap-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex-1 max-w-xs mx-auto lg:mx-0 text-center"
              >
                {/* Step Number Circle */}
                <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 relative z-10">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### 8. CreatorFAQ.tsx

```tsx
// File: components/sections/creator/CreatorFAQ.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How much does Lovdash cost?",
    answer: "We're currently in early access. Lovdash Bio is free forever. Our full platform pricing will be shared with waitlist members first. Join the waitlist to get early access and exclusive pricing.",
  },
  {
    question: "Which platforms does it work with?",
    answer: "Lovdash integrates with major adult-friendly platforms including OnlyFans, Fansly, and more. We're constantly adding new platforms based on creator demand.",
  },
  {
    question: "Is my content private and secure?",
    answer: "Absolutely. Your content is encrypted and stored securely. We never sell or share your media for marketing purposes. You control who sees what.",
  },
  {
    question: "How does the AI tagging work?",
    answer: "When you upload content, our AI analyzes it to generate relevant tags, descriptions, and categories. This makes your library searchable and ready to post. You can always review and edit anything the AI creates.",
  },
  {
    question: "Can I still post manually if I want?",
    answer: "Yes. Lovdash gives you control. Use our scheduling features when you want, or post manually anytime. It's your workflow—we just make it easier.",
  },
  {
    question: "What if I want to cancel?",
    answer: "No problem. There are no long-term contracts. Cancel anytime from your dashboard. Your content remains yours.",
  },
];

export function CreatorFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-brand-600 uppercase tracking-wider mb-4"
          >
            Questions & Answers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900"
          >
            Creator FAQs
          </motion.h2>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-slate-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### 9. CreatorCTA.tsx

```tsx
// File: components/sections/creator/CreatorCTA.tsx
"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CreatorCTA() {
  return (
    <section id="cta" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl px-6 sm:px-8 lg:px-12 py-16 lg:py-20 text-center"
        >
          {/* Kicker */}
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-4">
            Ready to start?
          </p>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white mb-4">
            Create more. Manage less.
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-white/90 max-w-xl mx-auto mb-8">
            Join creators who are simplifying their workflow with Lovdash. Get early access and be the first to try our full platform.
          </p>

          {/* CTA Button - White on brand */}
          <Button asChild size="lg" className="bg-white text-brand-600 hover:bg-slate-50 h-14 px-10 text-lg rounded-xl shadow-lg">
            <Link href="/join">
              Join Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>

          {/* Trust Line */}
          <p className="mt-6 text-white/70 text-sm">
            No credit card required. Unsubscribe anytime.
          </p>

          {/* Privacy Note */}
          <p className="mt-2 text-white/60 text-xs">
            Your email is safe with us. No spam, ever. 18+ only.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

#### 10. Page Component

```tsx
// File: app/(marketing)/creator/page.tsx
import { Metadata } from "next";
import {
  CreatorHero,
  CreatorPainPoints,
  CreatorSolution,
  CreatorFeatures,
  CreatorAIHighlight,
  CreatorBioHighlight,
  CreatorProcess,
  CreatorFAQ,
  CreatorCTA,
} from "@/components/sections/creator";

export const metadata: Metadata = {
  title: "Lovdash for Creators | Upload Once, Publish Everywhere",
  description: "Simplify your content workflow. Upload once and publish to all your platforms. AI-powered organization, scheduling, and analytics for individual creators.",
  keywords: ["content creator tools", "multi-platform publishing", "creator workflow", "content scheduling", "bio link builder"],
  openGraph: {
    title: "Lovdash for Creators | Upload Once, Publish Everywhere",
    description: "Simplify your content workflow. Upload once and publish to all your platforms.",
    type: "website",
    url: "https://lovdash.com/creator",
  },
};

export default function CreatorPage() {
  return (
    <>
      <CreatorHero />
      <CreatorPainPoints />
      <CreatorSolution />
      <CreatorFeatures />
      <CreatorAIHighlight />
      <CreatorBioHighlight />
      <CreatorProcess />
      {/* Testimonials: SKIPPED until real testimonials */}
      {/* Pricing: SKIPPED until finalized */}
      <CreatorFAQ />
      <CreatorCTA />
    </>
  );
}
```

#### 11. Barrel Export

```tsx
// File: components/sections/creator/index.ts
export { CreatorHero } from "./CreatorHero";
export { CreatorPainPoints } from "./CreatorPainPoints";
export { CreatorSolution } from "./CreatorSolution";
export { CreatorFeatures } from "./CreatorFeatures";
export { CreatorAIHighlight } from "./CreatorAIHighlight";
export { CreatorBioHighlight } from "./CreatorBioHighlight";
export { CreatorProcess } from "./CreatorProcess";
export { CreatorFAQ } from "./CreatorFAQ";
export { CreatorCTA } from "./CreatorCTA";
```

---

## /CREATOR PAGE SEO IMPLEMENTATION

### Status
🟢 SEO Trust Review Complete

### Metadata Implementation

```tsx
// In app/(marketing)/creator/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lovdash for Creators | Upload Once, Publish Everywhere",
  description: "Simplify your content workflow. Upload once and publish to all your platforms. AI-powered organization, scheduling, and analytics for individual creators.",
  keywords: ["content creator tools", "multi-platform publishing", "creator workflow", "content scheduling", "bio link builder"],
  openGraph: {
    title: "Lovdash for Creators | Upload Once, Publish Everywhere",
    description: "Simplify your content workflow. Upload once and publish to all your platforms.",
    type: "website",
    url: "https://lovdash.com/creator",
    images: [{ url: "https://lovdash.com/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovdash for Creators | Upload Once, Publish Everywhere",
    description: "Simplify your content workflow. Upload once and publish to all your platforms.",
  },
  alternates: {
    canonical: "https://lovdash.com/creator",
  },
};
```

### Heading Hierarchy

| Level | Content | Location |
|-------|---------|----------|
| H1 | "Upload once. Publish everywhere. Create more." | Hero |
| H2 | "One upload. Every platform. Zero hassle." | Solution |
| H2 | "Everything you need to grow—without the grind" | Features |
| H2 | "Your content, organized automatically" | AI Highlight |
| H2 | "One link for all your platforms" | Bio Highlight |
| H2 | "Three steps to freedom" | Process |
| H2 | "Creator FAQs" | FAQ |
| H2 | "Create more. Manage less." | Final CTA |
| H3 | Feature titles (4x) | Features |
| H3 | Step titles (3x) | Process |

**✅ Hierarchy is correct** - Single H1, logical H2 flow, H3 for sub-items.

### Schema Markup (FAQPage)

Add to page component for rich results:

```tsx
// Add to app/(marketing)/creator/page.tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does Lovdash cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're currently in early access. Lovdash Bio is free forever. Our full platform pricing will be shared with waitlist members first."
      }
    },
    {
      "@type": "Question",
      "name": "Which platforms does Lovdash work with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash integrates with major adult-friendly platforms including OnlyFans, Fansly, and more. We're constantly adding new platforms based on creator demand."
      }
    },
    {
      "@type": "Question",
      "name": "Is my content private and secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Your content is encrypted and stored securely. We never sell or share your media for marketing purposes. You control who sees what."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI tagging work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When you upload content, our AI analyzes it to generate relevant tags, descriptions, and categories. This makes your library searchable and ready to post. You can always review and edit anything the AI creates."
      }
    },
    {
      "@type": "Question",
      "name": "Can I still post manually if I want?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Lovdash gives you control. Use our scheduling features when you want, or post manually anytime. It's your workflow—we just make it easier."
      }
    },
    {
      "@type": "Question",
      "name": "What if I want to cancel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No problem. There are no long-term contracts. Cancel anytime from your dashboard. Your content remains yours."
      }
    }
  ]
};

// In page component, add:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>
```

### Internal Linking Strategy

| From Section | Link To | Anchor Text |
|--------------|---------|-------------|
| Hero | #process | "See How It Works" |
| Hero | #cta | "Join Waitlist" |
| AI Highlight | /ai | "Explore Lovdash AI" |
| Bio Highlight | /bio | "Create Your Bio" |
| Final CTA | /join | "Join Waitlist" |

### Keyword Placement

| Keyword | Placement |
|---------|-----------|
| "content creator" | Meta description, Features section |
| "multi-platform" | Meta description, Hero subheadline |
| "upload once" | Title, Hero headline, Solution |
| "publish everywhere" | Title, Hero headline |
| "scheduling" | Meta description, Features |
| "analytics" | Meta description, Features |
| "bio link" | Keywords, Bio Highlight |

**✅ Natural keyword distribution** - No stuffing, flows naturally.

### Trust Signal Verification

| Claim | Location | Verified? | Notes |
|-------|----------|-----------|-------|
| "Works with OnlyFans, Fansly & more" | Hero badge | ⚠️ VERIFY | Only list platforms with working integrations |
| "AI-powered" | Hero badge | ✅ | Product capability |
| "Privacy-first" | Hero badge | ✅ | Supported by privacy policy |
| "Free forever" (Bio) | Pricing, FAQ | ⚠️ FLAG | See trust issues below |
| "Encrypted and stored securely" | FAQ | ⚠️ VERIFY | Need to confirm encryption implementation |
| "No long-term contracts" | FAQ | ✅ | Policy-based claim |
| "Cancel anytime" | FAQ, CTA | ✅ | Policy-based claim |
| "No credit card required" | Final CTA | ✅ | Waitlist is free |
| "No spam, ever" | Final CTA | ✅ | Policy commitment |

### Trust Issues Flagged

#### Issue 1: "Free forever" claim
- **Location**: Pricing section, FAQ Q1
- **Risk**: MEDIUM
- **Concern**: "Forever" is a strong commitment. Business models change.
- **Recommendation**: Soften to "free plan available" or "free to start"
- **Decision**: Requires Orchestrator approval

#### Issue 2: "Privacy-first" trust badge
- **Location**: Hero
- **Risk**: LOW
- **Concern**: Vague claim without specifics
- **Current state**: Privacy policy exists and is comprehensive
- **Recommendation**: KEEP - supported by policy

#### Issue 3: "Encrypted and stored securely"
- **Location**: FAQ Q3
- **Risk**: MEDIUM
- **Concern**: Need to verify actual encryption implementation
- **Recommendation**: Verify with engineering or soften to "stored securely with industry-standard protection"
- **Decision**: Requires verification

#### Issue 4: Platform integration claims
- **Location**: Hero badge, FAQ Q2
- **Risk**: MEDIUM
- **Concern**: Only claim platforms that actually work
- **Current wording**: "Works with OnlyFans, Fansly & more" (with disclaimer in footer)
- **Recommendation**: KEEP if integrations verified, covered by footer disclaimer

### Recommended Copy Edits (Pending Approval)

#### Edit 1: Soften "free forever"
**Current (FAQ Q1):**
> Lovdash Bio is free forever.

**Recommended:**
> Lovdash Bio is free to use.

**Rationale:** "Forever" creates a permanent obligation. "Free to use" is accurate without overpromising.

#### Edit 2: Soften "free forever" (Pricing)
**Current:**
> Lovdash Bio is free forever.

**Recommended:**
> Lovdash Bio is free to use.

**Rationale:** Same as above.

#### Edit 3: Encryption claim (if not verified)
**Current (FAQ Q3):**
> Your content is encrypted and stored securely.

**Recommended (if encryption not confirmed):**
> Your content is stored securely with industry-standard protection.

**Rationale:** More defensible if specific encryption details unknown.

---

## /CREATOR PAGE TRUST SIGNAL SUMMARY

### ✅ VERIFIED CLAIMS
1. "AI-powered" - Product feature ✅
2. "No long-term contracts" - Policy ✅
3. "Cancel anytime" - Policy ✅
4. "No credit card required" - Waitlist ✅
5. "No spam, ever" - Policy commitment ✅
6. "AI-generated content is assistive and may require review" - Disclaimer ✅

### ⚠️ CLAIMS TO VERIFY
1. "Works with OnlyFans, Fansly & more" - Verify integrations
2. "Encrypted and stored securely" - Verify implementation

### 🔴 CLAIMS TO EDIT (Pending Orchestrator Approval)
1. "Free forever" → "Free to use" (2 locations)
2. Encryption claim (if not verified)

---

## /STUDIO LANDING PAGE SPECS

### Status
🟢 UX Strategy Complete - Approved (DEC-013, DEC-014)

### Page Purpose
Convert studio/agency owners who manage multiple creators. This audience has different needs than individual creators: they need team management, accountability, reporting, and scalability.

### Target Audience Profile
- **Who**: Studio owners, agencies, managers handling 2-200+ creator accounts
- **Pain Points**: 
  - Managing content across many accounts is chaotic
  - No visibility into team activity
  - Inconsistent posting schedules across creators
  - Difficult to track which creator/content drives revenue
  - Onboarding new creators takes too long
- **Objections**:
  - "How do I control who sees what?"
  - "Can I manage permissions for my team?"
  - "How does billing work for multiple accounts?"
  - "Is there an agency discount?"

### Page Narrative Flow
```
Hero → Pain Point → Solution Overview → Studio Features → Social Proof → Process → Pricing → FAQ → CTA
```

### Section Specs

#### 1. Studio Hero
- **Purpose**: Immediately signal this is for studios/agencies, not individuals
- **Headline**: "Manage every creator from one dashboard."
- **Subheadline**: "Lovdash for Studios gives agencies the tools to organize, schedule, and track content across all your creators—without the chaos."
- **Primary CTA**: "Start Managing Your Roster" or "Book a Demo"
- **Secondary CTA**: "See Studio Features"
- **Visual**: Dashboard screenshot showing multi-creator view (team overview, not single creator)
- **Trust Badges**: "Manage 2 to 200+ creators" | "Role-based access" | "Enterprise-ready"

#### 2. Pain Point Section (Problem Agitation)
- **Purpose**: Show you understand their struggle
- **Format**: 3-column layout with relatable problems
- **Problems**:
  1. "Spreadsheets everywhere" - Managing schedules across platforms in docs
  2. "No visibility" - Can't see what your team is doing in real-time
  3. "Missed revenue" - Content not posted = money left on the table
- **Transition**: "There's a better way."

#### 3. Solution Overview
- **Purpose**: High-level pitch of what Lovdash Studios does
- **Format**: Large heading + supporting paragraph + product screenshot
- **Key Message**: "One platform for your entire operation. Upload, organize, schedule, and track—for every creator on your roster."
- **Visual**: Full-width dashboard screenshot or animated walkthrough

#### 4. Studio Features Grid
- **Purpose**: Detail the specific capabilities for studios
- **Format**: 6 feature cards in 2x3 or 3x2 grid
- **Features**:
  1. **Multi-Creator Dashboard** - See all creators at a glance. Filter by status, platform, or performance.
  2. **Role-Based Access** - Admins, managers, uploaders. Control who sees and does what.
  3. **Template Library** - Create posting templates. Apply across creators with one click.
  4. **Cross-Creator Analytics** - Compare performance. Identify top performers. Spot trends.
  5. **Activity Logs** - See who did what, when. Full accountability for your team.
  6. **Bulk Operations** - Upload, tag, schedule for multiple creators at once.

#### 5. Social Proof (Studios)
- **Purpose**: Show other studios trust Lovdash
- **Options** (pick based on availability):
  - Studio testimonials (if available)
  - Stats: "Managing X creators" / "Y media organized"
  - Logo bar of partner studios (with permission)
- **If no testimonials**: Use product capability stats or skip

#### 6. How It Works (Studio Edition)
- **Purpose**: Show the studio workflow
- **Steps**:
  1. **Onboard Creators** - Add creators to your roster. Set permissions.
  2. **Upload Everything** - Bulk upload media for any creator. AI organizes automatically.
  3. **Schedule at Scale** - Create schedules and templates. Apply across your roster.
  4. **Track Performance** - Real-time analytics. Cross-creator reports. Spot winners.
- **Format**: Horizontal timeline or numbered cards

#### 7. Pricing Section (Optional)
- **Purpose**: Show studio-specific pricing if different from individual
- **Options**:
  - "Contact for studio pricing" CTA
  - Tiered pricing (5 creators, 20 creators, unlimited)
  - "Starting at $X/month per creator"
- **Note**: If pricing not finalized, use "Book a Demo" CTA instead

#### 8. Studio FAQ
- **Purpose**: Address studio-specific objections
- **Questions**:
  1. How many creators can I manage?
  2. How do permissions work?
  3. Can I white-label or use my own branding?
  4. Is there a contract or commitment?
  5. How do I onboard my existing creators?
  6. What platforms does it support?
- **Format**: Accordion (same as homepage)

#### 9. Final CTA
- **Purpose**: Convert interested studios
- **Headline**: "Ready to scale your studio?"
- **Subheadline**: "Join studios already managing their roster with Lovdash."
- **Primary CTA**: "Book a Demo" (for enterprise) or "Start Free Trial"
- **Secondary CTA**: "Talk to Sales"
- **Trust Line**: "No credit card required. 14-day free trial."

### Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Navigation - same as homepage]                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STUDIO HERO                                                │
│  "Manage every creator from one dashboard."                 │
│  [Book a Demo] [See Studio Features]                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  PAIN POINTS (3 columns)                                    │
│  Spreadsheets | No visibility | Missed revenue              │
├─────────────────────────────────────────────────────────────┤
│  SOLUTION OVERVIEW + Product Screenshot                     │
├─────────────────────────────────────────────────────────────┤
│  STUDIO FEATURES (6 cards)                                  │
├─────────────────────────────────────────────────────────────┤
│  SOCIAL PROOF / STATS                                       │
├─────────────────────────────────────────────────────────────┤
│  HOW IT WORKS (4 steps)                                     │
├─────────────────────────────────────────────────────────────┤
│  [PRICING - optional]                                       │
├─────────────────────────────────────────────────────────────┤
│  STUDIO FAQ (6 questions)                                   │
├─────────────────────────────────────────────────────────────┤
│  FINAL CTA                                                  │
│  "Ready to scale your studio?"                              │
│  [Book a Demo] [Talk to Sales]                              │
├─────────────────────────────────────────────────────────────┤
│  [Footer - same as homepage]                                │
└─────────────────────────────────────────────────────────────┘
```

### SEO Considerations
- **Title**: "Lovdash for Studios | Multi-Creator Management Platform"
- **Description**: "Manage every creator from one dashboard. Lovdash for Studios gives agencies the tools to organize, schedule, and track content across your entire roster."
- **Target Keywords**: "creator management platform", "agency creator tools", "multi-creator dashboard", "studio management software"

### Conversion Goals
1. **Primary**: Book a demo (high-intent studios)
2. **Secondary**: Start free trial (self-serve)
3. **Tertiary**: Join waitlist (if trial not available)

---

## /STUDIO PAGE VISUAL SPECS

### Status
🟢 Visual Design Complete - Ready for Frontend

### Design Approach
The /studio page uses the same design system as the homepage but with:
- **Darker/more serious tone** in the hero (enterprise feel)
- **Problem → Solution narrative** with visual progression
- **More emphasis on dashboards/UI** than abstract visuals

### Color Strategy
| Section | Background | Accent |
|---------|------------|--------|
| Hero | `slate-900` (dark) | `brand-400` badges |
| Pain Points | `slate-50` | `error-500` icons |
| Solution | `white` | `brand-500` |
| Features | `slate-50` | `brand-600` icons |
| Process | `white` | `brand-500` numbers |
| FAQ | `slate-50` | — |
| Final CTA | `brand-600` | `white` text |

### Section Visual Layouts

#### Studio Hero (Dark Theme)
```
┌─────────────────────────────────────────────────────────────────┐
│  [Nav - transparent with white text]                            │
├─────────────────────────────────────────────────────────────────┤
│  bg-slate-900                                                   │
│                                                                 │
│    KICKER (text-caption, brand-400)                             │
│    For Studios & Agencies                                       │
│                                                                 │
│    HEADLINE (text-display, white)                               │
│    Manage every creator                      ┌──────────────┐   │
│    from one dashboard.                       │  Dashboard   │   │
│                                              │  Screenshot  │   │
│    SUBHEADLINE (text-body-lg, slate-300)     │  (multi-     │   │
│    Lovdash for Studios gives agencies...     │  creator)    │   │
│                                              └──────────────┘   │
│    [Book a Demo] [See Studio Features ↓]                        │
│                                                                 │
│    • 2-200+ creators  • Role-based  • Enterprise-ready          │
│                                                                 │
│    ─ gradient fade to next section ─                            │
└─────────────────────────────────────────────────────────────────┘

Hero Styling:
- Background: slate-900 → slate-800 gradient (top to bottom)
- Headline: white
- Subheadline: slate-300
- Trust badges: bg-slate-800/50, border-slate-700, text-slate-200
- Primary CTA: btn-primary (brand-500)
- Secondary CTA: btn-outline-white (white border, white text)
- Visual: Dashboard screenshot with subtle glow effect (brand-500/20 shadow)

Mobile: Stack content above visual, visual full-width
```

#### Pain Points Section
```
┌─────────────────────────────────────────────────────────────────┐
│  bg-slate-50                                                    │
│                                                                 │
│  KICKER (brand-600): Sound familiar?                            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  📊 (red)   │  │  👁️ (red)   │  │  💸 (red)   │             │
│  │             │  │             │  │             │             │
│  │ Spreadsheets│  │No visibility│  │Missed       │             │
│  │ everywhere  │  │             │  │revenue      │             │
│  │             │  │             │  │             │             │
│  │ Description │  │ Description │  │ Description │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  "There's a better way." (text-h4, brand-600, centered)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Pain Point Card:
- Background: white
- Border: slate-200 → error-200 on hover (subtle danger feel)
- Icon: error-500 color (red tint - problems feel urgent)
- Title: slate-900, font-semibold
- Description: slate-600

Mobile: 1 column, vertical stack
Tablet+: 3 columns
```

#### Solution Overview
```
┌─────────────────────────────────────────────────────────────────┐
│  bg-white                                                       │
│                                                                 │
│  KICKER (brand-600): The Studio Operating System                │
│                                                                 │
│  HEADLINE (text-h1, slate-900, centered)                        │
│  One platform for your entire operation.                        │
│                                                                 │
│  BODY (text-body-lg, slate-600, centered, max-w-3xl)            │
│  Upload, organize, schedule, and track—for every...             │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐           │
│  │                                                  │           │
│  │             Full-width Dashboard                 │           │
│  │             Screenshot/Animation                 │           │
│  │                                                  │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Screenshot Container:
- Rounded: rounded-2xl
- Shadow: shadow-2xl
- Border: border border-slate-200
- Optional: Subtle brand-500/10 glow
- Max-width: max-w-5xl mx-auto
```

#### Studio Features Grid (6 cards)
```
┌─────────────────────────────────────────────────────────────────┐
│  bg-slate-50                                                    │
│                                                                 │
│  KICKER: Built for Scale                                        │
│  HEADLINE: Tools designed for multi-creator operations          │
│  SUBHEADLINE: Everything you need to manage your roster...      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ 🖥️ Icon  │  │ 🔐 Icon  │  │ 📋 Icon  │                      │
│  │ Multi-   │  │ Role-    │  │ Template │                      │
│  │ Creator  │  │ Based    │  │ Library  │                      │
│  │ Dashboard│  │ Access   │  │          │                      │
│  │          │  │          │  │          │                      │
│  │ desc...  │  │ desc...  │  │ desc...  │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ 📈 Icon  │  │ 📝 Icon  │  │ ⚡ Icon  │                      │
│  │ Cross-   │  │ Activity │  │ Bulk     │                      │
│  │ Creator  │  │ Logs     │  │ Operatio │                      │
│  │ Analytics│  │          │  │ ns       │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Feature Cards use .card-feature from design system:
- bg-white, border-slate-200
- hover: translateY(-4px), shadow-lg, border-brand-200
- Icon: 48x48 container, brand-50 bg, brand-600 icon
- Title: text-h4, slate-900
- Description: text-body, slate-600

Icon Mapping:
| Feature | Icon (Lucide) |
|---------|---------------|
| Multi-Creator Dashboard | LayoutDashboard |
| Role-Based Access | Shield / Lock |
| Template Library | FileText / Copy |
| Cross-Creator Analytics | TrendingUp / BarChart3 |
| Activity Logs | ClipboardList / Activity |
| Bulk Operations | Layers / Zap |

Mobile: 1 column
Tablet: 2 columns
Desktop: 3 columns
Gap: gap-6 (24px)
```

#### How It Works (Studios)
```
┌─────────────────────────────────────────────────────────────────┐
│  bg-white                                                       │
│                                                                 │
│  KICKER: How it works                                           │
│  HEADLINE: From chaos to clarity in four steps                  │
│                                                                 │
│  ┌───────┐   ─ ─ ─ ─   ┌───────┐   ─ ─ ─ ─   ┌───────┐        │
│  │  01   │             │  02   │             │  03   │         │
│  │ 👥    │             │ ⬆️    │             │ 📅    │         │
│  │Onboard│             │Upload │             │Schedule│        │
│  │Creators             │Everythin           │at Scale│        │
│  │       │             │       │             │       │         │
│  │ desc  │             │ desc  │             │ desc  │         │
│  └───────┘             └───────┘             └───────┘         │
│                                                                 │
│                        ┌───────┐                                │
│                        │  04   │                                │
│                        │ 📊    │                                │
│                        │ Track │                                │
│                        │Perform│                                │
│                        │       │                                │
│                        │ desc  │                                │
│                        └───────┘                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Uses .card-step from design system.
Desktop: 4 columns in a row
Tablet: 2x2 grid
Mobile: 1 column, connectors hidden

Connector line: dashed, slate-200, hidden on mobile
Step number badge: brand-500 bg, white text, rounded-lg

Icon Mapping:
| Step | Icon (Lucide) |
|------|---------------|
| Onboard Creators | UserPlus |
| Upload Everything | Upload / CloudUpload |
| Schedule at Scale | CalendarClock / Calendar |
| Track Performance | LineChart / TrendingUp |
```

#### Studio FAQ
```
┌─────────────────────────────────────────────────────────────────┐
│  bg-slate-50                                                    │
│                                                                 │
│  KICKER: Questions & Answers                                    │
│  HEADLINE: Studio FAQs                                          │
│                                                                 │
│  ┌──────────────────────────────────────────┐                  │
│  │  ▶ How many creators can I manage?       │                  │
│  ├──────────────────────────────────────────┤                  │
│  │  ▶ How do permissions work?              │                  │
│  ├──────────────────────────────────────────┤                  │
│  │  ▶ Can I white-label or use my own...    │                  │
│  ├──────────────────────────────────────────┤                  │
│  │  ▶ Is there a contract or commitment?    │                  │
│  ├──────────────────────────────────────────┤                  │
│  │  ▶ How do I onboard existing creators?   │                  │
│  ├──────────────────────────────────────────┤                  │
│  │  ▶ What platforms does it support?       │                  │
│  └──────────────────────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Same accordion component as homepage FAQ.
Max-width: max-w-2xl mx-auto
```

#### Final CTA (Dark Brand)
```
┌─────────────────────────────────────────────────────────────────┐
│  bg-brand-600 (or gradient brand-600 → brand-700)               │
│                                                                 │
│  KICKER (brand-200): Get started                                │
│                                                                 │
│  HEADLINE (text-h2, white)                                      │
│  Ready to scale your studio?                                    │
│                                                                 │
│  SUBHEADLINE (brand-100)                                        │
│  Join studios already managing their roster with Lovdash.       │
│                                                                 │
│  [Book a Demo]  [Talk to Sales]                                 │
│                                                                 │
│  Trust line (text-sm, brand-200)                                │
│  No credit card required. See the platform before you commit.   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Primary CTA: .btn-white (white bg, brand-600 text)
Secondary CTA: .btn-outline-white (white border, white text)
```

### New Component: Pain Point Card

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
```

### New Component: White Outline Button (for dark backgrounds)

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

### New Component: White Solid Button (for brand backgrounds)

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

### Responsive Behavior Summary

| Section | Mobile (< 640px) | Tablet (640-1024px) | Desktop (> 1024px) |
|---------|------------------|---------------------|---------------------|
| Hero | Stack, visual below | Stack, visual below | 2-col, visual right |
| Pain Points | 1 column | 3 columns | 3 columns |
| Solution | Full-width | Full-width | Max-w-5xl centered |
| Features | 1 column | 2 columns | 3 columns |
| Process | 1 column | 2x2 grid | 4 columns |
| FAQ | Full-width | Max-w-2xl | Max-w-2xl |
| Final CTA | Stack CTAs | Inline CTAs | Inline CTAs |

### Animation Notes

Apply same motion principles as homepage:
- Section entrance: `fadeUp` (0.5s duration, staggered 0.1s per element)
- Card hover: `translateY(-4px)` with spring easing
- Process cards: Staggered entrance left-to-right
- CTA section: `fadeUp` with slight scale animation

---

## /STUDIO PAGE BUILD PLAN

### Status
🟢 Frontend Spec Complete - Ready for Implementation (pending compliance approval)

### File Structure
```
app/
└── (marketing)/
    └── studio/
        └── page.tsx              # /studio route

components/
└── sections/
    └── studio/
        ├── studio-hero.tsx       # Dark hero for studios
        ├── pain-points.tsx       # 3-column problem cards
        ├── studio-solution.tsx   # Solution overview
        ├── studio-features.tsx   # 6-feature grid
        ├── studio-process.tsx    # 4-step workflow
        ├── studio-faq.tsx        # 6 studio-specific FAQs
        └── studio-cta.tsx        # Final CTA (brand-600 bg)
        └── index.ts              # Barrel export
```

### Page Component (`app/(marketing)/studio/page.tsx`)

```tsx
import { Metadata } from "next";
import {
  StudioHero,
  PainPoints,
  StudioSolution,
  StudioFeatures,
  StudioProcess,
  StudioFAQ,
  StudioCTA,
} from "@/components/sections/studio";
import { Navigation, Footer } from "@/components/sections";
import { ScrollProgress } from "@/components/motion/smooth-scroll";

export const metadata: Metadata = {
  title: "Lovdash for Studios | Multi-Creator Management Platform",
  description:
    "Manage every creator from one dashboard. Lovdash for Studios gives agencies the tools to organize, schedule, and track content across your entire roster.",
  keywords: [
    "creator management platform",
    "agency creator tools",
    "multi-creator dashboard",
    "studio management software",
  ],
  openGraph: {
    title: "Lovdash for Studios | Multi-Creator Management",
    description: "Manage every creator from one dashboard.",
    type: "website",
  },
};

export default function StudioPage() {
  return (
    <>
      <ScrollProgress />
      <Navigation variant="dark" /> {/* Transparent nav for dark hero */}
      <main>
        <StudioHero />
        <PainPoints />
        <StudioSolution />
        <StudioFeatures />
        <StudioProcess />
        <StudioFAQ />
        <StudioCTA />
      </main>
      <Footer />
    </>
  );
}
```

### Component Contracts

#### 1. StudioHero Props
```tsx
// No props - content from COPY_DECK.md
interface StudioHeroContent {
  kicker: "For Studios & Agencies";
  headline: "Manage every creator from one dashboard.";
  subheadline: string; // Full subheadline from copy
  primaryCTA: { label: "Book a Demo"; href: "#studio-cta" };
  secondaryCTA: { label: "See Studio Features"; href: "#studio-features" };
  trustBadges: ["2 to 200+ creators", "Role-based access", "Enterprise-ready"];
  image: "/placeholder-studio-dashboard.png"; // Multi-creator view
}
```

**Implementation Notes:**
- Background: `bg-gradient-to-b from-slate-900 to-slate-800`
- Nav should use `variant="dark"` prop for white text
- Image container: subtle `shadow-[0_0_60px_rgba(244,63,94,0.15)]` glow
- Trust badges: `bg-slate-800/50 border border-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm`

#### 2. PainPoints Props
```tsx
interface PainPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

const painPoints: PainPoint[] = [
  {
    icon: Table2, // or FileSpreadsheet
    title: "Spreadsheets everywhere",
    description: "Schedules in Google Docs. Content in Dropbox. Analytics in... somewhere. You're losing hours to tab-switching.",
  },
  {
    icon: EyeOff,
    title: "No visibility",
    description: "You don't know what your team posted yesterday. Or what's scheduled for tomorrow. Every update requires a Slack message.",
  },
  {
    icon: DollarSign, // or TrendingDown
    title: "Missed revenue",
    description: "Content sitting in folders isn't making money. Inconsistent posting means inconsistent growth.",
  },
];

// Transition text: "There's a better way."
```

**Implementation Notes:**
- Use `.card-pain` component
- Icons in `error-500` color
- Transition line: `text-h4 text-brand-600 text-center mt-12`

#### 3. StudioSolution Props
```tsx
// No props - hardcoded content
const content = {
  kicker: "The Studio Operating System",
  headline: "One platform for your entire operation.",
  body: "Upload, organize, schedule, and track—for every creator on your roster...",
  image: "/placeholder-studio-full-dashboard.png",
};
```

**Implementation Notes:**
- Image: `max-w-5xl mx-auto rounded-2xl shadow-2xl border border-slate-200`
- Optional subtle animation on scroll reveal

#### 4. StudioFeatures Props
```tsx
interface StudioFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const studioFeatures: StudioFeature[] = [
  { icon: LayoutDashboard, title: "Multi-Creator Dashboard", description: "..." },
  { icon: Shield, title: "Role-Based Access", description: "..." },
  { icon: FileText, title: "Template Library", description: "..." },
  { icon: TrendingUp, title: "Cross-Creator Analytics", description: "..." },
  { icon: Activity, title: "Activity Logs", description: "..." },
  { icon: Layers, title: "Bulk Operations", description: "..." },
];
```

**Implementation Notes:**
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Uses existing `.card-feature` + `.icon-container` components
- Section id: `id="studio-features"`

#### 5. StudioProcess Props
```tsx
interface ProcessStep {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const studioSteps: ProcessStep[] = [
  { number: "01", icon: UserPlus, title: "Onboard Creators", description: "..." },
  { number: "02", icon: Upload, title: "Upload Everything", description: "..." },
  { number: "03", icon: Calendar, title: "Schedule at Scale", description: "..." },
  { number: "04", icon: LineChart, title: "Track Performance", description: "..." },
];
```

**Implementation Notes:**
- Reuse `.card-step` from homepage Process component
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
- Desktop: horizontal dashed connector line between cards (CSS pseudo-element)

#### 6. StudioFAQ Props
```tsx
interface FAQItem {
  question: string;
  answer: string;
}

const studioFAQs: FAQItem[] = [
  { question: "How many creators can I manage?", answer: "..." },
  { question: "How do permissions work?", answer: "..." },
  { question: "Can I white-label or use my own branding?", answer: "..." },
  { question: "Is there a contract or commitment?", answer: "..." },
  { question: "How do I onboard my existing creators?", answer: "..." },
  { question: "What platforms does it support?", answer: "..." },
];
```

**Implementation Notes:**
- Reuse `<Accordion>` component from homepage FAQ
- Same styling, just different content

#### 7. StudioCTA Props
```tsx
// No props - hardcoded content
const content = {
  kicker: "Get started",
  headline: "Ready to scale your studio?",
  subheadline: "Join studios already managing their roster with Lovdash. Book a demo and see how it works for your team.",
  primaryCTA: { label: "Book a Demo", href: "/contact?type=studio" }, // or form
  secondaryCTA: { label: "Talk to Sales", href: "/contact?type=sales" },
  trustLine: "No credit card required. See the platform before you commit.",
};
```

**Implementation Notes:**
- Background: `bg-brand-600` or `bg-gradient-to-br from-brand-600 to-brand-700`
- Use `.btn-white` for primary, `.btn-outline-white` for secondary
- Section id: `id="studio-cta"`

### Shared Components to Reuse

| Component | Source | Usage |
|-----------|--------|-------|
| `<Navigation>` | `components/sections/navigation.tsx` | Add `variant="dark"` prop |
| `<Footer>` | `components/sections/footer.tsx` | As-is |
| `<AnimatedSection>` | `components/motion/animated-section.tsx` | Wrap sections |
| `<Accordion>` | `components/ui/accordion.tsx` | For FAQ |
| `<Button>` | `components/ui/button.tsx` | Extend with white variants |
| `<ScrollProgress>` | `components/motion/smooth-scroll.tsx` | As-is |

### New Components to Create

| Component | Path | Complexity |
|-----------|------|------------|
| `<StudioHero>` | `components/sections/studio/studio-hero.tsx` | Medium (dark variant) |
| `<PainPoints>` | `components/sections/studio/pain-points.tsx` | Low (3 cards) |
| `<StudioSolution>` | `components/sections/studio/studio-solution.tsx` | Low (text + image) |
| `<StudioFeatures>` | `components/sections/studio/studio-features.tsx` | Low (6 cards, reuse pattern) |
| `<StudioProcess>` | `components/sections/studio/studio-process.tsx` | Low (4 steps, similar to homepage) |
| `<StudioFAQ>` | `components/sections/studio/studio-faq.tsx` | Low (reuse accordion) |
| `<StudioCTA>` | `components/sections/studio/studio-cta.tsx` | Low (similar to homepage CTA) |

### Button Variant Extension

Add to `components/ui/button.tsx` or create new CSS classes:

```tsx
// Add to buttonVariants
const buttonVariants = cva(
  // ... existing base
  {
    variants: {
      variant: {
        // ... existing
        white: "bg-white text-brand-600 hover:bg-slate-50 shadow-sm",
        "outline-white": "border-2 border-white/50 text-white hover:bg-white/10 hover:border-white",
      },
    },
  }
);
```

### Navigation Dark Variant

Update `<Navigation>` to accept variant prop:

```tsx
interface NavigationProps {
  variant?: "light" | "dark";
}

// Dark variant: white text, transparent bg initially
// Light variant: dark text, white bg (current default)
```

### Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Buttons have clear focus states
- [ ] Color contrast passes WCAG AA (especially on dark hero)
- [ ] FAQ accordion is keyboard navigable
- [ ] Links have underline on hover/focus
- [ ] Skip link to main content
- [ ] Section headings use proper hierarchy (h1 → h2 → h3)

### Performance Considerations

- [ ] Images use Next.js `<Image>` with proper sizing
- [ ] Lazy load below-fold sections
- [ ] Use `motion/react` not full `framer-motion`
- [ ] Minimize bundle size - no new dependencies
- [ ] Test LCP on hero section

### Implementation Order

1. **Create folder structure** - `components/sections/studio/`
2. **Navigation dark variant** - Update existing component
3. **Button white variants** - Add to existing button
4. **StudioHero** - Dark hero with image
5. **PainPoints** - New component
6. **StudioSolution** - Simple text + image
7. **StudioFeatures** - Reuse feature card pattern
8. **StudioProcess** - Reuse step card pattern
9. **StudioFAQ** - Reuse accordion
10. **StudioCTA** - Brand background CTA
11. **Page assembly** - Wire up in `app/(marketing)/studio/page.tsx`
12. **QA testing** - Mobile, tablet, desktop + accessibility

### Estimated Build Time

| Task | Time |
|------|------|
| Setup + navigation | 30 min |
| StudioHero | 45 min |
| PainPoints | 30 min |
| StudioSolution | 20 min |
| StudioFeatures | 30 min |
| StudioProcess | 30 min |
| StudioFAQ | 20 min |
| StudioCTA | 25 min |
| Page assembly + testing | 30 min |
| **Total** | **~4 hours** |

---

## MARKETING WEBSITE VISUAL SPECS

### Hero Section Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Nav - sticky, transparent→solid on scroll]                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    HEADLINE (text-display)                    ┌─────────┐   │
│    Your media. Every platform.                │ Product │   │
│    One dashboard.                             │ Visual  │   │
│                                               │ (right) │   │
│    Subheadline (text-body-lg, slate-600)      │         │   │
│    Supporting text about the platform...      └─────────┘   │
│                                                             │
│    [Primary CTA]  [Secondary CTA]                           │
│                                                             │
│    • Trust badge  • Trust badge  • Trust badge              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile: Stack vertically, visual below text
Desktop: 2-column grid, visual right
Visual: Product screenshot OR abstract gradient (NOT stock photo)
```

### How It Works Section
```
┌─────────────────────────────────────────────────────────────┐
│  SECTION LABEL (text-caption, brand-600)                    │
│  How it works (text-h2, centered)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐             │
│   │  01  │    │  02  │    │  03  │    │  04  │             │
│   │Upload│    │Organ.│    │Publi.│    │Track │             │
│   │      │    │      │    │      │    │      │             │
│   └──────┘    └──────┘    └──────┘    └──────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile: 1 column, full-width cards
Tablet: 2×2 grid
Desktop: 4 columns
Card style: White bg, slate-200 border, rounded-xl, number badge top-left
```

### Core Features Section
```
┌─────────────────────────────────────────────────────────────┐
│  SECTION LABEL                                              │
│  Everything you need... (text-h2)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐    ┌─────────────────┐                │
│   │ [Icon]          │    │ [Icon]          │                │
│   │ AI Organization │    │ Multi-Platform  │                │
│   │ Description...  │    │ Description...  │                │
│   └─────────────────┘    └─────────────────┘                │
│                                                             │
│   ┌─────────────────┐    ┌─────────────────┐                │
│   │ [Icon]          │    │ [Icon]          │                │
│   │ Bio Link Builder│    │ Studio Tools    │                │
│   │ Description...  │    │ Description...  │                │
│   └─────────────────┘    └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile: 1 column
Tablet/Desktop: 2×2 grid
Card style: Interactive hover (card-lift), icon in brand-50 container
```

### AI Feature Highlight Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────┐     LOVDASH AI (text-caption)     │
│   │                     │     Your content, understood      │
│   │  Product Screenshot │     (text-h2)                     │
│   │  or Animation       │                                   │
│   │                     │     Body text about AI...         │
│   │                     │                                   │
│   └─────────────────────┘     [pill] [pill] [pill] [pill]   │
│                                                             │
│                               [Explore Lovdash AI →]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile: Stack, image above text
Desktop: 2-column, image left
Background: slate-50 for section contrast
Pills: brand-100 bg, brand-700 text, rounded-full
```

### Bio Feature Highlight Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     LOVDASH BIO (text-caption)     ┌─────────────────────┐  │
│     One link. Full control.        │                     │  │
│     (text-h2)                      │   Phone Mockup      │  │
│                                    │   with Bio Link     │  │
│     Body text about bio links...   │   Preview           │  │
│                                    │                     │  │
│     [pill] [pill] [pill]           └─────────────────────┘  │
│                                                             │
│     [Create your bio →]                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile: Stack, phone mockup below text
Desktop: 2-column, phone mockup right
Background: white (alternate with AI section)
Phone mockup: Use device frame, show actual bio link UI
```

### Audience Fork Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Built for how you work (text-h2, centered)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌────────────────────────┐  ┌────────────────────────┐    │
│   │                        │  │                        │    │
│   │   I'm a creator        │  │   I run a studio       │    │
│   │                        │  │                        │    │
│   │   Brief value prop     │  │   Brief value prop     │    │
│   │   text here...         │  │   text here...         │    │
│   │                        │  │                        │    │
│   │   [Get started →]      │  │   [Learn more →]       │    │
│   │                        │  │                        │    │
│   └────────────────────────┘  └────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile: Stack vertically
Desktop: 2 columns, equal width
Card style: Large padding, distinct hover states
Consider: Different accent colors per card
```

### FAQ Section Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Frequently asked questions (text-h2, centered)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ What platforms does Lovdash work with?         [+]  │   │
│   └─────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Is my content private and secure?              [+]  │   │
│   └─────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ How much does Lovdash cost?                    [+]  │   │
│   └─────────────────────────────────────────────────────┘   │
│   ...                                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Layout: Single column, max-w-3xl centered
Accordion: shadcn/ui Accordion component
Style: Clean borders, smooth expand animation
```

### Final CTA Section Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Ready to take control? (text-h2)               │
│                                                             │
│       Join creators and studios who are simplifying         │
│       their workflow with Lovdash. (text-body-lg)           │
│                                                             │
│              ┌───────────────────────────────┐              │
│              │   [email input] [Join waitlist]│              │
│              └───────────────────────────────┘              │
│                                                             │
│              No spam. We'll only email you                  │
│              when we launch. (text-body-sm)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Background: slate-50 or subtle gradient
Layout: Centered, max-w-2xl
Form: Inline email + button on desktop, stacked on mobile
```

### Footer Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]          Product    Company    Legal                │
│                  Features   About      Terms                │
│                  AI         Studios    Privacy              │
│                  Bio        Contact                         │
│                  Pricing                                    │
├─────────────────────────────────────────────────────────────┤
│  © 2026 Lovdash. All rights reserved.                       │
└─────────────────────────────────────────────────────────────┘

Background: slate-900 or slate-950 (dark footer)
Text: slate-400 (links), white (logo)
Mobile: Stack columns, 2×2 or single column
Desktop: 4 columns
```

### Responsive Behavior Summary
| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero | Stack, full-width | 2-col | 2-col |
| How It Works | 1-col cards | 2×2 grid | 4-col |
| Features | 1-col cards | 2×2 grid | 2×2 grid |
| AI Highlight | Stack | 2-col | 2-col |
| Bio Highlight | Stack | 2-col | 2-col |
| Audience Fork | Stack | 2-col | 2-col |
| FAQ | Full-width | Centered | Centered max-w-3xl |
| Final CTA | Stack form | Inline form | Inline form |
| Footer | Stack | 2×2 | 4-col |

---

## MONGODB INFRASTRUCTURE

### Connection Setup (`lib/mongodb/client.ts`)
```typescript
// Singleton pattern for serverless environment
// Different pool sizes for dev vs prod
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://...'
const MONGODB_DB = 'lovdash'

// Pool config:
// Development: maxPoolSize: 10, minPoolSize: 2
// Production: maxPoolSize: 50, minPoolSize: 5
```

### Collections Schema (`lib/mongodb/types.ts`)
| Collection | Primary Index | Secondary Indexes |
|------------|---------------|-------------------|
| users | supabaseAuthId (unique) | email, role |
| creators | username (unique) | studioId, enabled |
| studios | name | enabled |
| media | creatorId + createdAt | mediaType, category, tags |
| bioLinks | slug (unique) | creatorId |
| tags | name (unique) | category, usageCount |
| analytics | bioLinkId + type + date | creatorId |
| socialAccounts | creatorId + platform | - |

### Query Helpers (`lib/mongodb/queries.ts`)
- `getCreators()` - List/filter creators with studio lookup
- `getMedia()` - Paginated media with tag/type filtering
- `getMediaCounts()` - Aggregated counts by type
- `getTags()` - Tag search with category filter
- `getAnalyticsSummary()` - Daily aggregated analytics
- `getOrCreateTag()` - Upsert with usage count increment

---

## DASHBOARD COMPONENTS

### MediaGrid (`components/media/MediaGrid.tsx`)
- Grid/List view toggle
- Multi-select with shift+click
- Lazy loading images with placeholders
- AI tag badges with category colors
- Action dropdown (view, copy URL, download, edit tags, delete)
- Compact mode for denser layouts

### MobileUploader (`components/media/MobileUploader.tsx`)
- TikTok-style full-screen swipeable cards
- Real-time AI tag suggestions
- Upload progress with cancel support
- Gesture-based navigation
- Batch upload capability

### Admin Migration UI (`app/dashboard/admin/migration/page.tsx`)
- Collection selection checkboxes
- Dry run mode for preview
- Real-time progress tracking
- Error display and retry

---

## API ROUTES

### Migration API (`/api/migrate`)
```
GET  - Returns current migration status
POST - Executes migration with options:
       - collections: string[] (which collections to migrate)
       - dryRun: boolean (preview without writing)
```

### Data API (`/api/data`)
```
GET ?entity=creators&id=xxx           - Single creator
GET ?entity=media&creatorId=xxx       - Creator's media
GET ?entity=media-counts&creatorId=xx - Media count by type
GET ?entity=tags&category=body        - Tags by category
GET ?entity=dashboard-stats           - Aggregated platform stats

POST ?entity=tag                      - Create/get tag
POST ?entity=media-tags               - Update media tags
POST ?entity=creator-tag-config       - Update tagging config

DELETE ?entity=media&ids=a,b,c        - Delete media items
```

---

## API INTEGRATIONS

- **Supabase Auth**: User authentication, session management
- **MongoDB**: Primary data storage
- **Venice AI**: Image analysis, embeddings generation
- **Pinecone**: Vector storage for similarity search
- **DigitalOcean Spaces**: Media file storage
- **Twilio**: WhatsApp integration
- **Google Analytics**: Traffic tracking

---

## PERFORMANCE REQUIREMENTS

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

---

## ACCESSIBILITY REQUIREMENTS

- WCAG 2.1 AA compliance target
- Keyboard navigation
- Screen reader support
- Color contrast ratios

---

## BROWSER SUPPORT

- Modern browsers (last 2 versions)
- Mobile-first responsive design

---

## MARKETING WEBSITE BUILD PLAN

### Status
✅ Ready for Implementation - Frontend Assembly Lead

### Implementation Order (Priority)
| Priority | Component | File | Est. Time | Dependencies |
|----------|-----------|------|-----------|--------------|
| 1 | Update Tailwind colors | `tailwind.config.ts` | 15m | None |
| 2 | Hero section | `components/sections/hero.tsx` | 2h | Colors |
| 3 | Navigation | `components/sections/navigation.tsx` | 1h | Colors |
| 4 | Process/How It Works | `components/sections/process.tsx` | 1.5h | None |
| 5 | Core Features | `components/sections/features.tsx` | 1.5h | None |
| 6 | AI Highlight | `components/sections/lovdash-ai.tsx` | 1h | None |
| 7 | Bio Highlight | `components/sections/lovdash-bio.tsx` | 1h | None |
| 8 | Audience Fork | `components/sections/audience-fork.tsx` | 1h | NEW |
| 9 | FAQ | `components/sections/faq.tsx` | 45m | None |
| 10 | Final CTA | `components/sections/cta.tsx` | 45m | Rename contact |
| 11 | Footer | `components/sections/footer.tsx` | 45m | None |
| 12 | Social Proof | `components/sections/social-proof.tsx` | 30m | Optional |
| 13 | Meta/SEO | `app/(marketing)/layout.tsx` | 30m | None |

### Files to Modify
```
MODIFY:
├── tailwind.config.ts          # Update brand colors pink→rose
├── app/(marketing)/layout.tsx  # Update meta tags
├── app/(marketing)/page.tsx    # Update section order
└── components/sections/
    ├── navigation.tsx          # Update nav links, CTA text
    ├── hero.tsx                # Complete rewrite
    ├── process.tsx             # Rewrite copy + steps
    ├── about.tsx               # Rename to features.tsx, rewrite
    ├── lovdash-ai.tsx          # Update copy
    ├── lovdash-bio.tsx         # Update copy
    ├── faq.tsx                 # Replace questions
    ├── contact.tsx             # Rename to cta.tsx, rewrite
    └── footer.tsx              # Update links + dark style

CREATE:
├── components/sections/audience-fork.tsx  # New section
└── components/sections/social-proof.tsx   # Optional

DELETE:
├── components/sections/earnings.tsx       # Remove agency section
└── components/sections/marquee.tsx        # Replace with social-proof
```

---

## COMPONENT CONTRACTS

### Hero Props
```typescript
interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  trustBadges: Array<{
    icon?: React.ReactNode;
    text: string;
  }>;
}

// Default values from COPY_DECK.md:
const heroDefaults: HeroProps = {
  headline: "Your media. Every platform. One dashboard.",
  subheadline: "Lovdash is the operating system for creators and studios. Upload your content once. Let AI organize it. Publish everywhere. Track what works.",
  primaryCta: { text: "Join Waitlist", href: "#cta" },
  secondaryCta: { text: "See how it works ↓", href: "#process" },
  trustBadges: [
    { text: "Works with OnlyFans, Fansly, and more" },
    { text: "Privacy-first" },
  ]
};
```

### ProcessStep Props
```typescript
interface ProcessStepProps {
  number: string;        // "01", "02", etc.
  icon: LucideIcon;
  title: string;
  description: string;
}

// From COPY_DECK.md:
const processSteps: ProcessStepProps[] = [
  { number: "01", icon: Upload, title: "Upload", description: "Drop your photos and videos into Lovdash. Batch upload from any device." },
  { number: "02", icon: Sparkles, title: "Organize", description: "AI automatically tags, describes, and categorizes your content. No manual sorting." },
  { number: "03", icon: Share2, title: "Publish", description: "Schedule posts across all your platforms. Set it once, run on autopilot." },
  { number: "04", icon: BarChart3, title: "Track", description: "See what's working. Real-time analytics across every platform and link." },
];
```

### FeatureCard Props
```typescript
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// From COPY_DECK.md:
const features: FeatureCardProps[] = [
  { icon: Brain, title: "AI-powered organization", description: "Every upload gets tagged, described, and searchable. Find any content in seconds." },
  { icon: Globe, title: "Publish everywhere at once", description: "Connect your accounts. Schedule once. Lovdash posts to all platforms on your schedule." },
  { icon: Link2, title: "One link for everything", description: "Create a custom bio link page. Track every click. See where your traffic converts." },
  { icon: Users, title: "Built for teams", description: "Manage multiple creators from one dashboard. Role-based access, templates, and reporting." },
];
```

### FeatureHighlight Props
```typescript
interface FeatureHighlightProps {
  label: string;         // Section label ("Lovdash AI")
  headline: string;
  body: string;
  pills: string[];
  cta: {
    text: string;
    href: string;
  };
  visual: React.ReactNode;  // Screenshot or illustration
  reversed?: boolean;       // Image on left vs right
  background?: "white" | "slate";
}
```

### AudienceFork Props
```typescript
interface AudienceCardProps {
  headline: string;
  body: string;
  cta: {
    text: string;
    href: string;
  };
}

// From COPY_DECK.md:
const audienceCards = {
  creator: {
    headline: "I'm a creator",
    body: "Upload once, publish everywhere. Spend less time managing platforms and more time creating.",
    cta: { text: "Get started →", href: "/creator" }
  },
  studio: {
    headline: "I run a studio",
    body: "Manage multiple creators from one dashboard. Templates, reporting, and accountability built in.",
    cta: { text: "Learn more →", href: "/studio" }
  }
};
```

### FAQ Props
```typescript
interface FAQItem {
  question: string;
  answer: string;
}

// From COPY_DECK.md:
const faqItems: FAQItem[] = [
  { question: "What platforms does Lovdash work with?", answer: "Lovdash connects to OnlyFans, Fansly, Twitter/X, Instagram, and TikTok. More platforms coming soon." },
  { question: "Is my content private and secure?", answer: "Yes. Your media is stored securely and never shared. You control who has access. We don't use your content for training or marketing." },
  { question: "How much does Lovdash cost?", answer: "We're currently in early access. Join the waitlist to get notified when we launch and receive early pricing." },
  { question: "Can I use Lovdash for multiple accounts or creators?", answer: "Yes. Individual creators can connect multiple platform accounts. Studios can manage multiple creators with role-based permissions." },
  { question: "What makes Lovdash different from other tools?", answer: "Lovdash is built specifically for adult-friendly creators. We combine AI-powered media management, multi-platform publishing, bio links, and analytics in one place. Most tools do one thing. Lovdash does it all." },
  { question: "Do I need technical skills to use Lovdash?", answer: "No. If you can upload a photo, you can use Lovdash. The AI handles the complex stuff automatically." },
];
```

### FinalCTA Props
```typescript
interface FinalCTAProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  trustLine: string;
}

// From COPY_DECK.md:
const finalCtaDefaults: FinalCTAProps = {
  headline: "Ready to take control?",
  subheadline: "Join creators and studios who are simplifying their workflow with Lovdash.",
  ctaText: "Join the waitlist",
  trustLine: "No spam. We'll only email you when we launch."
};
```

### Navigation Links
```typescript
// From COPY_DECK.md:
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "/ai", label: "AI" },
  { href: "/bio", label: "Bio" },
  { href: "#audience", label: "Studios" },
  // { href: "/pricing", label: "Pricing" }, // TBD
];

const navCta = { text: "Join Waitlist", href: "#cta" };
```

---

## TAILWIND CONFIG CHANGES

### Brand Color Update (DEC-008)
```typescript
// tailwind.config.ts - Replace pink with rose
brand: {
  '50': '#fff1f2',
  '100': '#ffe4e6',
  '200': '#fecdd3',
  '300': '#fda4af',
  '400': '#fb7185',
  '500': '#f43f5e',  // Primary - was #ec4899
  '600': '#e11d48',  // Hover - was #db2777
  '700': '#be123c',  // Active - was #be185d
  '800': '#9f1239',
  '900': '#881337',
  '950': '#4c0519',
},
```

---

## HOMEPAGE SECTION ORDER

```tsx
// app/(marketing)/page.tsx
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <SocialProof />        {/* NEW - replaces Marquee */}
        <Process />            {/* Rewritten */}
        <Features />           {/* Renamed from About */}
        <LovdashAI />          {/* Updated copy */}
        <LovdashBio />         {/* Updated copy */}
        <AudienceFork />       {/* NEW */}
        {/* <Testimonials /> */}  {/* Skip until real testimonials */}
        <FAQ />                {/* Rewritten */}
        <FinalCTA />           {/* Renamed from Contact */}
      </main>
      <Footer />               {/* Updated */}
    </>
  );
}
```

---

## IMPLEMENTATION NOTES

### Remove Agency Elements
The following must be removed/replaced:
- Stock model photos in Hero (replace with product screenshot or gradient)
- Floating "earnings" cards with money amounts
- All "we manage", "we pay you" language
- "Apply as Model" CTA → "Join Waitlist"
- "Contact us" → "Join Waitlist" or "Get Started"
- Earnings section (entire section)

### Animation Patterns (Keep)
The existing animation patterns are good:
- `motion.div` with `initial`, `animate`, `whileInView`
- `AnimatedSection` wrapper for scroll reveals
- `whileHover` for card lifts
- Staggered delays for lists

### Accessibility Checklist
- [x] All images have descriptive alt text ✅
- [x] Buttons have aria-labels where icon-only ✅
- [x] Color contrast meets 4.5:1 for text ✅ (rose-600 on white passes)
- [x] Focus states visible on all interactive elements ✅
- [ ] Skip link for main content (minor, P3)
- [x] Heading hierarchy correct (h1 → h2 → h3) ✅

### SEO Checklist
- [x] Page title updated in layout.tsx ✅ (Session 10)
- [x] Meta description updated ✅ (Session 10)
- [x] OG tags updated ✅ (Session 10)
- [x] Semantic HTML (section, article, nav, main) ✅
- [x] One h1 per page (in Hero) ✅
- [x] Schema markup added (FAQPage, Organization, SoftwareApplication) ✅ (Session 10)

---

## SEO IMPLEMENTATION GUIDE

### Status
✅ Defined by SEO Trust Lead (DEC-010)

### Metadata Update (CRITICAL)
The current `app/(marketing)/layout.tsx` has **agency-focused metadata** that must be replaced:

```typescript
// REPLACE THIS in app/(marketing)/layout.tsx:
export const metadata: Metadata = {
  title: "Lovdash | The Creator Operating System",
  description: "Upload your content once. Let AI organize it. Publish to every platform. Track what works. Lovdash is the operating system for creators and studios.",
  keywords: [
    "creator platform",
    "content management",
    "multi-platform publishing",
    "bio link builder",
    "AI media organization",
    "creator tools",
  ],
  openGraph: {
    title: "Lovdash | The Creator Operating System",
    description: "Upload once. Publish everywhere. Track everything. The all-in-one platform for creators and studios.",
    type: "website",
    url: "https://lovdash.com",
    siteName: "Lovdash",
    images: [
      {
        url: "https://lovdash.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lovdash - The Creator Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lovdash | The Creator Operating System",
    description: "Upload once. Publish everywhere. Track everything.",
    images: ["https://lovdash.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lovdash.com",
  },
};
```

### Heading Hierarchy (H1 → H2 Map)

| Section | Heading Level | Text |
|---------|---------------|------|
| Hero | h1 | "Your media. Every platform. One dashboard." |
| Process | h2 | "How it works" |
| Features | h2 | "Everything you need to run your content business" |
| AI Highlight | h2 | "Your content, understood" |
| Bio Highlight | h2 | "One link. Full control." |
| Audience Fork | h2 | "Built for how you work" |
| FAQ | h2 | "Frequently asked questions" |
| Final CTA | h2 | "Ready to take control?" |

**Rule**: Only ONE h1 per page (in Hero). All section headers are h2. Card titles are h3.

### Schema Markup

**FAQPage Schema** - Add to homepage for FAQ section:
```typescript
// Add to app/(marketing)/page.tsx or layout.tsx
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What platforms does Lovdash work with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash connects to OnlyFans, Fansly, Twitter/X, Instagram, and TikTok. More platforms coming soon."
      }
    },
    {
      "@type": "Question",
      "name": "Is my content private and secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Your media is stored securely and never shared. You control who has access. We don't use your content for training or marketing."
      }
    },
    {
      "@type": "Question",
      "name": "How much does Lovdash cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're currently in early access. Join the waitlist to get notified when we launch and receive early pricing."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use Lovdash for multiple accounts or creators?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Individual creators can connect multiple platform accounts. Studios can manage multiple creators with role-based permissions."
      }
    },
    {
      "@type": "Question",
      "name": "What makes Lovdash different from other tools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash is built specifically for adult-friendly creators. We combine AI-powered media management, multi-platform publishing, bio links, and analytics in one place."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need technical skills to use Lovdash?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. If you can upload a photo, you can use Lovdash. The AI handles the complex stuff automatically."
      }
    }
  ]
};

// Render in head:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>
```

**SoftwareApplication Schema** (optional):
```typescript
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Lovdash",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "The operating system for creators and studios. Upload once, publish everywhere.",
  "url": "https://lovdash.com",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/ComingSoon"
  }
};
```

### Internal Linking Strategy

| From | To | Anchor Text |
|------|----|-------------|
| Hero | #process | "See how it works" |
| Features | /ai | "AI-powered organization" link |
| Features | /bio | "One link for everything" link |
| AI Highlight | /ai | "Explore Lovdash AI →" |
| Bio Highlight | /bio | "Create your bio →" |
| Audience Fork | /creator | "Get started →" |
| Audience Fork | /studio | "Learn more →" |
| All sections | #cta | CTA buttons |
| Footer | /ai, /bio, /terms, /privacy | Nav links |

### Per-Page SEO (Future)

| Page | Title | H1 | Intent |
|------|-------|-----|--------|
| / | Lovdash \| The Creator Operating System | Your media. Every platform. One dashboard. | Brand awareness, signups |
| /ai | Lovdash AI \| Smart Media Organization | [TBD] | Feature discovery |
| /bio | Lovdash Bio \| Creator Link-in-Bio | [TBD] | Feature discovery |
| /creator | Lovdash for Creators | [TBD] | Segment conversion |
| /studio | Lovdash for Studios | [TBD] | Segment conversion |

### OG Image Requirements
- **Size**: 1200×630px
- **Content**: Lovdash logo + tagline + product screenshot
- **Format**: PNG or JPG
- **File**: `/public/og-image.png`
- **Note**: Create this asset before launch

---

## /STUDIO PAGE SEO GUIDE

### Status
🟢 SEO Review Complete - Copy edits flagged for Compliance/Orchestrator approval

### Metadata (for `app/(marketing)/studio/page.tsx`)

```typescript
export const metadata: Metadata = {
  title: "Lovdash for Studios | Multi-Creator Management Platform",
  description: "Manage every creator from one dashboard. Organize, schedule, and track content across your entire roster with role-based access and cross-creator analytics.",
  keywords: [
    "creator management platform",
    "multi-creator dashboard",
    "agency creator tools",
    "studio management software",
    "creator agency software",
    "OnlyFans agency tools",
    "content creator management",
  ],
  openGraph: {
    title: "Lovdash for Studios | Multi-Creator Management",
    description: "Manage every creator from one dashboard. Role-based access, templates, and cross-creator analytics.",
    type: "website",
    url: "https://lovdash.com/studio",
  },
  alternates: {
    canonical: "https://lovdash.com/studio",
  },
};
```

### Heading Hierarchy (/studio)

| Section | Heading Level | Text |
|---------|---------------|------|
| Hero | h1 | "Manage every creator from one dashboard." |
| Pain Points | h2 | "Sound familiar?" (kicker only, no h2 needed) |
| Solution | h2 | "One platform for your entire operation." |
| Features | h2 | "Tools designed for multi-creator operations" |
| Process | h2 | "From chaos to clarity in four steps" |
| FAQ | h2 | "Studio FAQs" |
| Final CTA | h2 | "Ready to scale your studio?" |

**Rule**: Only ONE h1 per page (in Hero). All section headers are h2. Feature card titles are h3.

### /studio FAQPage Schema

```typescript
const studioFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many creators can I manage with Lovdash?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash supports studios managing anywhere from 2 to 200+ creators. Your subscription plan determines the number of active creator accounts."
      }
    },
    {
      "@type": "Question",
      "name": "How do permissions work in Lovdash for Studios?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You assign roles to team members: Admin (full access), Manager (scheduling and analytics), or Uploader (media upload only). Each role has clear access boundaries."
      }
    },
    {
      "@type": "Question",
      "name": "Can I white-label Lovdash with my own branding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Custom branding options, including custom domains for bio links, are available on enterprise plans. Contact our sales team for details."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a contract or long-term commitment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No long-term contracts required. You can pay monthly or annually and cancel anytime."
      }
    },
    {
      "@type": "Question",
      "name": "How do I onboard existing creators to Lovdash?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can invite creators via email or add them manually. Bulk import options are available for larger studios."
      }
    },
    {
      "@type": "Question",
      "name": "What platforms does Lovdash integrate with?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Lovdash integrates with major adult-friendly platforms including OnlyFans, Fansly, and more. New integrations are added based on demand."
      }
    }
  ]
};
```

### Internal Linking (/studio)

| From | To | Anchor Text |
|------|----|-------------|
| Hero | #studio-features | "See Studio Features" |
| Hero | #studio-cta | "Book a Demo" |
| Features | #studio-cta | Implied via section flow |
| Final CTA | /contact?type=studio | "Book a Demo" |
| Final CTA | /contact?type=sales | "Talk to Sales" |
| Footer | /, /ai, /bio, /terms, /privacy | Standard nav |

### Keyword Targeting

| Primary Keywords | Search Intent |
|-----------------|---------------|
| creator management platform | Commercial - looking for software |
| multi-creator dashboard | Commercial - specific feature |
| agency creator tools | Commercial - B2B audience |
| OnlyFans agency software | Commercial - platform-specific |

| Secondary Keywords | Notes |
|-------------------|-------|
| studio management software | Generic but relevant |
| content creator management | Broader reach |
| bulk content scheduling | Feature-specific |
| role-based creator access | Feature-specific |

### Trust Signal Audit - FLAGGED ITEMS ⚠️

| Item | Risk Level | Issue | Recommendation |
|------|------------|-------|----------------|
| "Enterprise-ready" badge | ⚠️ MEDIUM | Vague claim - what makes it enterprise? | Change to "Built for teams" or add qualifier |
| "No hard limit" on creators | ⚠️ MEDIUM | Misleading - there are always limits | Rephrase: "Scale from 2 to 200+ creators" |
| "Cancel anytime—your data exports with you" | ⚠️ LOW | Verify data export feature exists | Confirm with product, or soften |
| "We'll reach out within 1 business day" | ⚠️ MEDIUM | Timing promise hard to guarantee | Soften to "typically within 1-2 business days" |
| "Custom branding on enterprise plans" | ⚠️ MEDIUM | Is this feature built? | Clarify "available" or "coming soon" |
| "Bulk import is available" | ⚠️ LOW | Verify feature exists | Confirm or remove |
| "Join studios already managing their roster" | ⚠️ HIGH | Implies existing customers | Remove if no studios yet, or use "Join the waitlist" |
| "Existing media can be migrated" | ⚠️ LOW | Verify migration feature | Confirm or soften to "migration assistance available" |
| Social Proof stats (X+, Y+, Z+) | ⚠️ HIGH | Must use real numbers | Use actual stats only, or skip section |

### Recommended Copy Edits for Compliance

See **COPY_DECK.md** for specific recommended edits based on above flags.
