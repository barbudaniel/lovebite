# LOVDASH DECISION LOG

> All major decisions affecting copy, design, IA, or positioning must be logged here.

---

## DECISION FORMAT

```
### DEC-XXX: [Title]
- **Date**: YYYY-MM-DD
- **Decision Maker**: [Agent/User]
- **Context**: Why this decision was needed
- **Options Considered**: List of alternatives
- **Decision**: What was decided
- **Rationale**: Why this option was chosen
- **Impact**: What this affects downstream
```

---

## PENDING DECISIONS

### DEC-001: Product Positioning - Agency vs SaaS vs Hybrid
- **Date**: 2026-01-09
- **Decision Maker**: UX Strategist (based on product context documentation)
- **Context**: The current website copy positions Lovdash as an agency ("We manage your profile", "We pay you monthly"). However, the product context document describes Lovdash as a "creator and studio operating system" - a SaaS platform. These are fundamentally different business models with different messaging, UX, and trust requirements.
- **Options Considered**:
  1. **Agency Model**: Lovdash manages creators' accounts end-to-end. Creators provide content, Lovdash handles everything else.
  2. **SaaS Platform Model**: Lovdash is software that creators/studios use to manage their own operations (media organization, scheduling, analytics, etc.)
  3. **Hybrid Model**: Lovdash offers software tools AND optional managed services.
- **Decision**: Option 2 - **SaaS Platform Model**
- **Rationale**: The canonical LOVDASH CONTEXT document explicitly defines Lovdash as "a creator and studio operating system that turns media into consistent, multi-platform social distribution and measurable revenue growth." This is software, not a service. The dashboard infrastructure (media upload, AI tagging, bio links, analytics) confirms this is a self-serve tool. Current agency-style copy is legacy and must be replaced.
- **Impact**: All website copy must shift from "we do it for you" to "the tools to do it yourself." IA must highlight product capabilities, not service deliverables. Trust signals shift from "team expertise" to "platform reliability + integrations."

---

## APPROVED DECISIONS

### DEC-019: SEO Pages Copy Compliance Fixes
- **Date**: 2026-01-09
- **Decision Maker**: Copy Lead
- **Context**: UX Strategist audit flagged 4 copy issues across SEO/feature pages that violate DEC-014 (white-label claims) or make unverifiable claims (user counts).
- **Issues Found**:
  1. `/pricing/page.tsx`: "White-label options" - feature is planned, not available
  2. `/features/page.tsx`: "Join thousands of creators" - unverifiable user count
  3. `/features/media-library/page.tsx`: "Join thousands of creators" - unverifiable user count
  4. `/ai/page.tsx`: "White-label options available" - feature is planned, not available
- **Decision**: Apply immediate fixes
- **Changes Applied**:
  1. "White-label options" → "White-label options (planned)" (pricing + AI pages)
  2. "Join thousands of creators" → "Join creators" (features + media-library pages)
- **Rationale**: 
  - White-label feature doesn't exist per DEC-014; claiming "available" is misleading
  - "Thousands" implies large user base that may not exist; removing quantity is honest
- **Impact**: 4 files updated. All SEO pages now compliant with established copy standards.

---

### DEC-018: Theme Unification & Real Logo
- **Date**: 2026-01-09
- **Decision Maker**: User + Frontend Assembly
- **Context**: Website had inconsistent theming—homepage and creator page used light theme while AI, Bio, and Studio pages used dark theme. Logo was a custom text-based component instead of the real brand logo.
- **Options Considered**:
  1. Keep mixed themes (dark for "product" pages, light for marketing)
  2. Unify all pages to dark theme
  3. Unify all pages to light theme
- **Decision**: Option 3 - **Unified Light Theme** + use real `/public/logo.png`
- **Rationale**: User explicitly requested "keep all pages as one theme not one dark mode and one light mode." Light theme chosen because it's the homepage theme (primary brand impression), more readable, and consistent with modern SaaS landing pages. Real logo maintains brand recognition.
- **Impact**: 
  - All pages now use consistent white/slate-50 backgrounds
  - Logo component uses real logo.png with adaptive CSS filter for dark backgrounds
  - Footer changed from dark to light theme
  - Navigation consistent across all pages
  - Brand cohesion improved

### DEC-017: /creator Page Compliance Review
- **Date**: 2026-01-09
- **Decision Maker**: Compliance & Risk Lead
- **Context**: Full compliance audit of /creator page copy before implementation.
- **Issues Found**: 5 total (1 HIGH, 3 MEDIUM, 1 LOW)
- **Decisions**:
  1. ✅ **APPROVE**: "Free forever" → "Free to use" (2 locations) - HIGH risk, legal commitment
  2. ✅ **APPROVE**: "We handle the rest" → "Lovdash handles the posting" - overpromises automation
  3. ⚠️ **PENDING**: Encryption claim - needs engineering verification
  4. ✅ **APPROVE**: "Join creators who are" → "Be among the first creators to" - implied social proof
  5. ✅ **NO CHANGE**: "Track every click" - acceptable standard language
- **Rationale**: 
  - "Forever" commitments create legal liability when business models change
  - "Handle the rest" overpromises; platform APIs can fail
  - Implied existing user base misleading in early access phase
  - Encryption claims must be verifiable
- **Impact**: 4 copy edits required + 1 pending verification before build

---

### DEC-016: /creator Page SEO + Trust Review
- **Date**: 2026-01-09
- **Decision Maker**: SEO Trust Lead
- **Context**: Review /creator page copy for SEO optimization and trust signal verification before implementation.
- **Findings**:
  1. Meta tags optimized (title 52/60, description 153/160) ✅
  2. Heading hierarchy correct (single H1, logical H2 flow) ✅
  3. FAQPage schema recommended for rich results
  4. Trust signals mostly verified (AI, cancel, no spam) ✅
  5. Two claims flagged for review: "free forever" and encryption
- **Decision**: 
  - APPROVE meta/SEO as-is
  - FLAG "free forever" for Orchestrator decision (recommend → "free to use")
  - FLAG encryption claim pending engineering verification
  - RECOMMEND FAQPage schema implementation
- **Rationale**: SEO fundamentals are solid. Trust claims are mostly defensible. "Forever" commitment is risky; softening protects against future business model changes.
- **Impact**: 
  - Meta tags ready for implementation
  - 2 copy edits pending Orchestrator approval
  - Schema markup adds rich result eligibility

---

### DEC-015: /creator Landing Page Information Architecture
- **Date**: 2026-01-09
- **Decision Maker**: UX Strategist
- **Context**: With /studio page in implementation, defining the /creator landing page to complete the audience-specific page suite. The Audience Fork links to /creator but no specs existed.
- **Options Considered**:
  1. Mirror /studio page structure exactly
  2. Simpler, creator-focused page with fewer sections
  3. Redirect to homepage (no dedicated page)
- **Decision**: Option 2 - Simpler, creator-focused page
- **Rationale**: Individual creators have different needs than studios. They want simplicity ("upload once, publish everywhere") not team management. Page should feel lighter, more personal, with 3 steps vs 4, 4 features vs 6, and "Start Free" vs "Book a Demo" CTAs.
- **Page Narrative**: Hero → Pain Points → Solution → Features (4) → AI → Bio → Process (3 steps) → FAQ → CTA
- **Key Differentiators from /studio**:
  - Light theme hero (vs dark)
  - "Start Free" CTA (vs "Book a Demo")
  - Simpler 3-step process
  - Creator-specific pain points
- **Impact**: Full section specs in IMPLEMENTATION_NOTES.md. Ready for Copy Lead.

### DEC-014: /studio Page Compliance Review
- **Date**: 2026-01-09
- **Decision Maker**: Compliance & Risk Lead
- **Context**: SEO Trust Lead flagged 8 trust/claim issues in /studio page copy requiring compliance review. Issues ranged from HIGH (customer existence claims, social proof stats) to LOW (migration wording).
- **Analysis**:
  - Product is in pre-launch/waitlist phase
  - No confirmed studio customers (test accounts only)
  - No enterprise features (SOC2, SLAs) exist
  - No white-label feature built
  - No automated data export or migration tools
- **Decision**: APPROVE ALL 8 RECOMMENDED EDITS
  1. ✅ "Enterprise-ready" → "Built for teams"
  2. ✅ Remove "no hard limit" opening
  3. ✅ Remove data export claim
  4. ✅ Response time → "typically 1-2 business days"
  5. ✅ White-label "available" → "planned"
  6. ✅ "Already managing" → "Be among the first studios"
  7. ✅ "Can be migrated" → "Migration assistance available"
  8. ✅ **SKIP social proof section entirely** until real customers
- **Rationale**: All claims must be verifiable. Pre-launch products should not imply existing customers or features that don't exist. Honest positioning ("be among the first") is more compelling than false claims that damage trust when discovered.
- **Impact**: Copy approved for implementation once edits applied. Social proof section removed from page until real studio testimonials/stats exist.

### DEC-013: /studio Landing Page Information Architecture
- **Date**: 2026-01-09
- **Decision Maker**: UX Strategist
- **Context**: With the homepage complete, the next priority is the /studio landing page to capture the studio/agency audience segment. This page needs a distinct narrative focused on multi-creator management challenges.
- **Options Considered**:
  1. Minimal page - just redirect to homepage
  2. Full dedicated page with studio-specific sections
  3. Tab/toggle system on homepage to switch audiences
- **Decision**: Option 2 - Full dedicated landing page
- **Rationale**: Studios have fundamentally different pain points (team management, scalability, accountability) than individual creators. A dedicated page allows us to address their specific objections and show relevant features. The homepage audience fork already points here, creating a natural user flow.
- **Page Narrative**: Hero → Pain Points → Solution → Features (6 studio-specific) → Social Proof → Process → FAQ → CTA
- **Primary CTA**: "Book a Demo" (studios typically want to talk before committing)
- **Impact**: Full section specs documented in IMPLEMENTATION_NOTES.md. Ready for Copy Lead to write copy, then Frontend to build.

### DEC-005: Marketing Website Information Architecture
- **Date**: 2026-01-09
- **Decision Maker**: UX Strategist
- **Context**: Need to define clear page hierarchy, section order, and conversion flows for the marketing website that properly positions Lovdash as a SaaS platform.
- **Options Considered**:
  1. Single long-scroll homepage with all content
  2. Multiple dedicated pages per audience segment
  3. Hybrid: Strong homepage + dedicated feature/audience pages
- **Decision**: Option 3 - Hybrid approach
- **Rationale**: Homepage serves as primary conversion path for most visitors. Dedicated pages for AI, Bio, and Studios allow SEO targeting and deeper dives. Reduces cognitive load on homepage while supporting different user journeys.
- **Impact**: Site structure defined. Section specs documented in IMPLEMENTATION_NOTES.md. Copy Lead can now write against defined section purposes.

### DEC-006: Dual-Audience Conversion Strategy
- **Date**: 2026-01-09
- **Decision Maker**: UX Strategist
- **Context**: Lovdash serves two distinct audiences: (1) Studios/agencies managing multiple creators, (2) Individual creators wanting self-serve tools. Different needs, different objections, different CTAs.
- **Options Considered**:
  1. Single generic message for both
  2. Separate homepages (subdomain or toggle)
  3. Unified homepage with audience-specific sections + dedicated landing pages
- **Decision**: Option 3 - Unified homepage with audience paths
- **Rationale**: Most visitors won't self-identify immediately. Homepage should establish core value prop, then offer clear paths for "I'm a studio" vs "I'm a creator." Dedicated `/creator` and `/studio` pages handle objections specific to each segment.
- **Impact**: Homepage needs audience fork section. Two conversion paths with tailored CTAs. Pricing (if applicable) may need segment differentiation.

### DEC-002: MongoDB as Primary Data Store
- **Date**: 2026-01-09
- **Decision Maker**: User + Development Team
- **Context**: Need for better data management, self-hosted database control, and improved query performance for the dashboard
- **Options Considered**:
  1. Keep Supabase PostgreSQL for everything
  2. Migrate all data to MongoDB, keep only auth in Supabase
  3. Use a hybrid approach with Supabase for auth and MongoDB for app data
- **Decision**: Option 3 - Hybrid approach
- **Rationale**: MongoDB provides better flexibility for document-based media metadata, AI analysis data, and tag management. Supabase Auth remains excellent for authentication. The sync functions ensure data consistency.
- **Impact**: Created new MongoDB infrastructure (`lib/mongodb/*`), migration API (`/api/migrate`), data API (`/api/data`)

### DEC-003: Per-Model AI Tagging Configuration
- **Date**: 2026-01-09
- **Decision Maker**: User + Development Team
- **Context**: AI tagging system was only configured for one model (Deni/Mirrabelle). Need to support multiple models with different tagging priorities while sharing the same tag pool.
- **Options Considered**:
  1. Duplicate tag collections per model
  2. Shared tags with per-model configuration via `taggingConfig` on creators
  3. Global tags with no customization
- **Decision**: Option 2 - Shared tags with per-model config
- **Rationale**: Keeps tags organized and consistent across the platform while allowing each creator to customize their AI tagging priorities
- **Impact**: Added `taggingConfig` to MongoCreator schema, updated `analyze-v2.ts`

### DEC-004: Mobile-First Dashboard Design
- **Date**: 2026-01-09
- **Decision Maker**: Development Team
- **Context**: Creators primarily upload media from mobile devices. The upload experience needed to be optimized.
- **Options Considered**:
  1. Desktop-first with responsive adjustments
  2. Mobile-first with TikTok-style full-screen upload
  3. Native app approach
- **Decision**: Option 2 - TikTok-style mobile upload
- **Rationale**: Provides familiar UX for content creators, maximizes screen real estate, enables easy swipe navigation
- **Impact**: Created `MobileUploader` component, optimized `MediaGrid` for responsive display

### DEC-012: Post-Implementation Compliance Fixes
- **Date**: 2026-01-09
- **Decision Maker**: Compliance Risk Lead
- **Context**: Final compliance audit after homepage implementation revealed 3 issues that required immediate remediation.
- **Issues Found**:
  1. **HIGH**: Hero mock UI showed "+47% Engagement" - appears as real statistic but is fake
  2. **MEDIUM**: "AI handles the rest" (Audience Fork) - suggests AI is autonomous, not assistive
  3. **MEDIUM**: "Lovdash handles the rest" (Process) - similar autonomy implication
- **Decision**: Apply immediate fixes to remove or soften problematic language
- **Changes Applied**:
  1. Hero floating card: "+47%" → "Tracked" (generic, no fake metrics)
  2. Audience Fork: "AI handles the rest" → "AI helps organize the rest"
  3. Process Step 3: "Lovdash handles the rest" → "Set your timing, we handle the posting"
- **Rationale**: These phrases could create unrealistic expectations or be interpreted as misleading statistics. Softened language maintains marketing intent while being truthful.
- **Impact**: 3 files updated (hero.tsx, audience-fork.tsx, process.tsx). No breaking changes. Compliance verified complete.

### DEC-011: Compliance Safeguards and Disclaimers
- **Date**: 2026-01-09
- **Decision Maker**: Compliance Risk Lead
- **Context**: Marketing copy needs review for misleading claims, unsafe automation language, and adult ecosystem compliance before implementation.
- **Risk Assessment**:
  - 3 HIGH risk items (autopilot language, platform integration claims, no age gate)
  - 4 MEDIUM risk items (AI accuracy, privacy claim, timing claim, results disclaimer)
  - 3 LOW risk items (acceptable as-is)
- **Decision**: Implement recommended copy edits and add required disclaimers
- **Required Changes**:
  1. Remove "autopilot" language → "Lovdash handles the rest"
  2. Clarify privacy claim → "never sold or shared for marketing"
  3. Add AI accuracy note → "You can always review and adjust"
  4. Remove timing claim → "Find content quickly" (not "in seconds")
  5. Add footer disclaimers (18+, platform terms, results vary)
  6. Add platform integration disclaimer near logos
  7. Add AI feature disclaimer in small text
- **Rationale**: These changes protect against regulatory risk, user expectation mismatch, and potential platform policy conflicts while maintaining marketing effectiveness.
- **Impact**: Copy edits in COPY_DECK.md marked for Orchestrator approval. Disclaimers added to implementation requirements.

### DEC-010: SEO Strategy and Metadata Overhaul
- **Date**: 2026-01-09
- **Decision Maker**: SEO Trust Lead
- **Context**: Current metadata in layout.tsx uses agency-focused language ("Creator Management Agency", "50% of your earnings") that conflicts with SaaS positioning. Keywords target agency searches, not platform searches.
- **Options Considered**:
  1. Keep existing metadata (rejected - conflicts with DEC-001)
  2. Update metadata to match SaaS positioning
  3. Create separate metadata per page
- **Decision**: Option 2 - Update all metadata to SaaS positioning
- **Rationale**: Metadata must align with page content and brand positioning. Agency keywords attract wrong audience. SaaS positioning improves trust and reduces confusion.
- **Impact**: 
  - Update `app/(marketing)/layout.tsx` with new metadata
  - Add FAQPage schema markup
  - Create OG image asset
  - Define heading hierarchy (one h1 per page)

### DEC-009: Component Refactoring Strategy
- **Date**: 2026-01-09
- **Decision Maker**: Frontend Assembly Lead
- **Context**: Need to update existing components with new copy and design while minimizing risk of breaking changes.
- **Options Considered**:
  1. Delete and recreate all section components from scratch
  2. Modify existing components in-place, rename where needed
  3. Create parallel new components, swap at end
- **Decision**: Option 2 - Modify in-place with renames
- **Rationale**: Existing components have good animation patterns and structure. Most changes are content updates, not structural. Renaming (about→features, contact→cta) is cleaner than maintaining two parallel sets. Less code to review.
- **Impact**: 
  - Rename `about.tsx` → `features.tsx`
  - Rename `contact.tsx` → `cta.tsx`
  - Create new `audience-fork.tsx`
  - Delete `earnings.tsx`
  - Update `index.ts` exports accordingly

### DEC-008: Visual Design Direction - Rose over Pink
- **Date**: 2026-01-09
- **Decision Maker**: Visual Design Lead
- **Context**: Current brand color (#ec4899 pink) reads as playful/casual. Need more premium, enterprise-grade feel while maintaining warmth and approachability.
- **Options Considered**:
  1. Keep current pink (#ec4899) - more playful, familiar
  2. Shift to rose (#f43f5e) - warmer, more premium
  3. Shift to violet/purple - more tech, less warm
  4. Neutral only (slate + accents) - very corporate
- **Decision**: Option 2 - Rose palette (#f43f5e as primary)
- **Rationale**: Rose maintains brand warmth while reading more sophisticated. Works well for adult-friendly ecosystem without being either too clinical or too playful. Pairs excellently with slate neutrals for enterprise feel.
- **Impact**: Updated color tokens in DESIGN_SYSTEM.md. Frontend Assembly should update tailwind.config.ts brand colors from pink to rose scale.

### DEC-007: Hero Headline Direction
- **Date**: 2026-01-09
- **Decision Maker**: Copy Lead
- **Context**: Need a hero headline that communicates what Lovdash is and differentiates from current agency-style messaging.
- **Options Considered**:
  1. Outcome-focused: "Stop managing platforms. Start growing."
  2. Process-focused: "Upload once. Publish everywhere."
  3. Comprehensive: "Your media. Every platform. One dashboard."
  4. Category-defining: "The creator operating system."
- **Decision**: Option 3 - "Your media. Every platform. One dashboard."
- **Rationale**: Balances clarity with differentiation. Immediately communicates the multi-platform benefit while implying a centralized tool. Short, scannable, memorable. Options 1 and 2 are strong alternates for A/B testing.
- **Impact**: Hero section copy finalized for implementation. Alt headlines provided for testing.

### DEC-020: Remove 18+ Adult-Only Positioning
- **Date**: 2026-01-09
- **Decision Maker**: User (Product Owner)
- **Context**: The platform was previously positioned as adult-only (18+), but the product serves both SFW and NSFW creators equally.
- **Options Considered**:
  1. Keep 18+ positioning - limits market reach
  2. Remove 18+ from marketing, keep only in legal pages - broader appeal
  3. Add explicit SFW callouts - may overcorrect
- **Decision**: Option 2 - Remove 18+ references from all marketing pages, retain only in Terms and Privacy Policy
- **Rationale**: Platform serves both SFW and NSFW creators. Adult-only messaging unnecessarily limits market appeal. Legal compliance is handled in terms/privacy where appropriate.
- **Impact**: 
  - Removed 18+ badges from footer, hero, CTAs, contact forms
  - Updated FAQ answers to explicitly mention "both SFW and NSFW creators"
  - Expanded platform list to include Twitter/X, Instagram, TikTok alongside OnlyFans, Fansly

### DEC-021: Rebrand "Studio" to "Agency" in Marketing
- **Date**: 2026-01-09
- **Decision Maker**: User (Product Owner)
- **Context**: The term "Studio" was being used to describe multi-creator management entities, but "Agency" is the industry-standard term and clearer for the target audience.
- **Options Considered**:
  1. Keep "Studio" - already implemented
  2. Change to "Agency" - industry standard
  3. Use both interchangeably - confusing
- **Decision**: Option 2 - Use "Agency" consistently across all marketing copy
- **Rationale**: "Agency" is the established industry term for entities managing multiple creators. Clearer positioning for target B2B audience. Internal technical references (database tables, dashboard features) remain "studio" for code stability.
- **Impact**: 
  - All marketing copy updated: "studios" → "agencies"
  - Navigation links text: "Studios" → "Agencies"
  - Meta descriptions, OG images updated
  - URL `/studio` retained for SEO continuity (redirects can be added later)
  - Dashboard code unchanged (technical term remains "studio")

### DEC-022: Navigation Redesign - Snapchat-Style Icon Navigation
- **Date**: 2026-01-10
- **Decision Maker**: User (Product Owner)
- **Context**: The previous navigation used mega-menu dropdowns (Stripe-style) which added complexity. User requested a cleaner navigation inspired by Snapchat's header with icon+label items and direct links instead of dropdowns.
- **Options Considered**:
  1. Keep mega-menu dropdowns - complex but feature-rich
  2. Snapchat-style icon+label nav - clean, direct links, no dropdowns
  3. Hybrid - some dropdowns, some direct links
- **Decision**: Option 2 - Snapchat-style icon+label navigation
- **Rationale**: Simpler UX, faster navigation to key pages, mobile-friendly design pattern, consolidates important sections into visible icons. Removes friction of hover-to-discover dropdowns.
- **Changes Applied**:
  - Removed mega-menu dropdown structure
  - Added icon+label nav items: Features, AI, Bio, Creators, Pricing
  - Moved Agencies link to right side with icon
  - Kept "Get Started" CTA button
  - Mobile menu uses grid layout for icon tiles
- **Impact**: 
  - Navigation component simplified (~240 lines → ~240 lines with cleaner code)
  - All links now direct to pages (no intermediate dropdowns)
  - Mobile experience improved with tile-based navigation

### DEC-023: Mobile Navigation - Snapchat App Bar Style
- **Date**: 2026-01-10
- **Decision Maker**: User (Product Owner)
- **Context**: User requested mobile navigation to behave like Snapchat's mobile app, with a bottom navigation bar, scroll-based hide/show, and heart-only logo on mobile.
- **Options Considered**:
  1. Keep top navigation only with hamburger menu
  2. Bottom app bar (Snapchat-style) with primary action button
  3. Floating action button only
- **Decision**: Option 2 - Full Snapchat-style mobile navigation
- **Changes Applied**:
  - **Mobile Bottom Navigation Bar**: Fixed bottom with Features, AI, Add Media (primary), Bio, Agency icons
  - **Scroll Animation**: Navigation hides on scroll down, shows on scroll up with smooth animation
  - **Mobile Header**: Hamburger menu, centered heart icon (no text), "Join" link
  - **Snapchat-Style Menu**: Left-sliding panel with collapsible sections
  - **Heart Icon Logo**: Mobile shows only heart SVG, desktop shows full logo
- **Impact**: 
  - Complete mobile navigation overhaul
  - Improved thumb-reachability with bottom nav
  - Modern app-like feel on mobile
  - Scroll-responsive navigation for better content focus

### DEC-024: Hero Section - Snapchat-Inspired Layout
- **Date**: 2026-01-10
- **Decision Maker**: User (Product Owner)
- **Context**: User requested hero section to be adapted from Snapchat's hero style - bold centered headline, brand background, with dashboard preview visible on both mobile and desktop.
- **Options Considered**:
  1. Keep two-column hero (text left, visual right)
  2. Centered hero like Snapchat with visual below
  3. Full-bleed visual hero
- **Decision**: Option 2 - Centered Snapchat-style hero
- **Changes Applied**:
  - Centered headline with brand gradient background (brand-50)
  - "Your media. Every platform. Easy for everyone." headline with brand color highlight
  - Single dark CTA button ("Join Waitlist")
  - Trust badges row below CTA
  - Dashboard preview visible on both mobile (3-col grid) and desktop (6-col grid)
  - Floating stats cards on desktop
  - "Discover Lovdash" scroll indicator on desktop
- **Impact**: 
  - Hero now centered and mobile-first
  - Visual preview shows real product UI
  - Cleaner visual hierarchy with single CTA focus

### DEC-025: Media Library Preview - Collection Card Style
- **Date**: 2026-01-10
- **Decision Maker**: User (Product Owner)
- **Context**: User provided design reference showing media collection cards with 2x2 image grids, platform publishing toggles, tags, and engagement stats. Requested hero visual to match this style.
- **Options Considered**:
  1. Keep simple 6-image grid with minimal info
  2. Rich collection cards with full metadata (reference design)
  3. Carousel of media items
- **Decision**: Option 2 - Rich collection cards matching reference design
- **Changes Applied**:
  - Two side-by-side collection cards ("Outdoor Party", "Day trip: Coffee")
  - 2x2 image grid with "+N" overlay for remaining images
  - Title row with link icon and relative date
  - Tags row with "Outdoor", "Lifestyle", etc. and pink "+" button
  - Platform publishing toggles (Instagram, TikTok, X, OnlyFans)
    - Active platforms in brand colors, inactive greyed out
    - Hover tooltips showing engagement stats (likes, comments, views)
  - Stats row: photo count, video count, views with trend indicator
  - Published indicator: "X/4 published"
  - Floating cards: Total Engagement (71.6K) and "Published to" platform list
  - AI Tags row at bottom ("Auto-tagged", "Smart descriptions", "Ready to post")
- **Impact**: 
  - Hero visual now demonstrates full product capability
  - Shows multi-platform publishing feature clearly
  - Engagement metrics visible and interactive
  - Better conversion by showing real value proposition

### DEC-026: Mobile App Preview - iPhone Frame Style
- **Date**: 2026-01-10
- **Decision Maker**: User (Product Owner)
- **Context**: User requested mobile UI to be more "app-like" with enhanced visual presentation.
- **Options Considered**:
  1. Keep simple card layout for mobile
  2. Phone mockup frame with full app UI simulation
  3. Animated device rotation showcase
- **Decision**: Option 2 - Phone mockup frame with complete app UI
- **Changes Applied**:
  - **iPhone Frame**: Rounded corners (40px), slate-900 bezel, Dynamic Island notch
  - **iOS Status Bar**: Time, signal, wifi, battery icons
  - **App Header**: Lovdash branding, notification bell with red badge, user avatar
  - **Search Bar**: Rounded input with search icon
  - **Quick Stats**: 3-column layout (Photos/Views/Likes) with separator dividers
  - **Horizontal Collections**: Swipeable collection cards with compact design
  - **AI Insights Card**: Brand gradient background with sparkles icon and tip text
  - **Bottom Tab Bar**: 5 tabs with elevated center Upload button
  - **Home Indicator**: iOS-style pill at bottom
  - **Live Preview Badge**: Floating badge with green pulse indicator
- **Impact**: 
  - Mobile preview now looks like actual iOS app screenshot
  - Increased visual appeal and perceived product quality
  - Clear demonstration of mobile-first design approach
  - Compact collection cards optimize for horizontal scroll UX

### DEC-027: Mobile Navigation - Simplified 3-Button Layout
- **Date**: 2026-01-10
- **Decision Maker**: User (Product Owner)
- **Context**: User requested simplification of mobile navigation to only 3 essential buttons, removing the segmented control and search.
- **Options Considered**:
  1. Keep Apple-style segmented control with 5 elements
  2. Simple 3-button layout: Menu, Upload CTA, Sign In
  3. Floating action button only
- **Decision**: Option 2 - Simple 3-button bottom bar
- **Changes Applied**:
  - **3-Button Bottom Bar Layout**:
    - Left: Menu button (hamburger) - rounded circle, slate background
    - Center: Upload CTA - rounded pill with Plus icon + "Upload" text, brand color
    - Right: Sign In button - User icon, rounded circle
  - **Top Header**: Centered heart logo only (removed "Join" link)
  - **Full-Screen Sheet Improvements**:
    - Changed animation from spring to ease-out (no bounce effect)
    - Added scroll indicator: gradient fade at bottom with animated down arrow
    - "Scroll for more" text indicator
    - Indicator auto-hides when user scrolls to bottom
  - **Bug Fix**: Removed `sheetOpacity` transform that was causing NaN error
- **Impact**: 
  - Cleaner, less cluttered mobile navigation
  - Primary action (Upload) prominently displayed
  - Easy access to features via sheet menu
  - Improved UX with scroll indicator in sheet

---

## REJECTED DECISIONS

(None yet)
