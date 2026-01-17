# PRD: Landing Page Business Documentation Alignment

## Introduction

Align the Lovdash landing page (`lovebite_landingpage`) with the comprehensive business documentation maintained in `lovdash_app/frontend`. This is a **full content rebuild** to ensure all messaging, CTAs, pricing, features, and structure reflect the current business reality: **Lovdash is operational with paying customers**, not a pre-launch waitlist product.

### Problem Statement
The current landing page positions Lovdash as a concept/waitlist product when it's actually operational with:
- 1 paying agency customer (6 creators managed)
- $210 MRR (validated pricing at $35-60/creator)
- Operational infrastructure (device farm, AI systems, internal tools)

### Key Changes Required
1. **CTA shift**: "Join Waitlist" → "Start Free Trial" / "Book a Demo"
2. **AI Chat Assistant prominence**: Our key differentiator vs competitors (Infloww)
3. **Pricing transparency**: Show validated $39/$59/Agency tiers
4. **Platform positioning**: Multi-platform (OnlyFans, Fansly, LoyalFans, X, Instagram)

---

## Goals

- Align all landing page content with approved business documentation
- Update CTAs to reflect operational status (not waitlist)
- Prominently feature AI Chat Assistant as key differentiator
- Implement validated pricing structure ($39/$59/Agency)
- Add Schema.org structured data for AEO optimization
- Ensure design tokens match DESIGN_SYSTEM.md specifications
- Include company legal info (TRUST CHARGE SOLUTIONS LTD)

---

## Knowledge Sources

All content decisions should reference these authoritative documents:

| Document | Path | Purpose |
|----------|------|---------|
| **ABOUT_LOVDASH.md** | `/Volumes/Development/of/lovdash_app/frontend/ABOUT_LOVDASH.md` | Company overview, product philosophy, feature descriptions |
| **BUSINESS_ANALYSIS.md** | `/Volumes/Development/of/lovdash_app/frontend/BUSINESS_ANALYSIS.md` | Risk analysis, strategic positioning |
| **BUSINESS_CONTEXT.md** | `/Volumes/Development/of/lovdash_app/frontend/business/BUSINESS_CONTEXT.md` | **PRIMARY** - Comprehensive business context, messaging guidelines, pricing |
| **BUSINESS_STRATEGY.md** | `/Volumes/Development/of/lovdash_app/frontend/business/BUSINESS_STRATEGY.md` | Business model, unit economics, growth strategy |
| **DESIGN_SYSTEM.md** | `/Volumes/Development/of/lovdash_app/frontend/docs/DESIGN_SYSTEM.md` | Design tokens, colors, typography, components |
| **LANDING_PAGE_BRIEF.md** | `/Volumes/Development/of/lovdash_app/frontend/business/LANDING_PAGE_BRIEF.md` | **PRIMARY** - Section-by-section copy, illustration specs, SEO/AEO |
| **LANDING_PAGE_IMPLEMENTATION.md** | `/Volumes/Development/of/lovdash_app/frontend/business/LANDING_PAGE_IMPLEMENTATION.md` | Technical implementation plan |
| **SALES_DECK.md** | `/Volumes/Development/of/lovdash_app/frontend/business/SALES_DECK.md` | Pitch messaging, competitive positioning |

---

## User Stories

### Phase 1: Homepage Alignment

#### US-001: Update Hero Section Headlines
**Description:** As a visitor, I want to see compelling headlines that communicate Lovdash's value proposition so that I understand what the product does immediately.

**Acceptance Criteria:**
- [ ] Hero section uses approved headline: "The Creator Operating System" or "Your media. Every platform. Easy for everyone."
- [ ] Subheadline includes: "Upload once, publish everywhere, track what works."
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-002: Change Primary CTA from Waitlist to Trial
**Description:** As a visitor, I want to start using the product immediately so that I can evaluate if it meets my needs.

**Acceptance Criteria:**
- [ ] Primary CTA changed from "Join Waitlist" to "Start Free Trial"
- [ ] Secondary CTA added: "Book a Demo" for agencies
- [ ] CTA buttons use emerald green gradient (`#10B981 → #059669`)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-003: Add Social Proof Platform Bar
**Description:** As a visitor, I want to see which platforms are supported so that I know Lovdash works with my platforms.

**Acceptance Criteria:**
- [ ] Social proof bar shows platform logos: OnlyFans, Fansly, LoyalFans, X/Twitter, Instagram
- [ ] Logos are grayscale with color on hover
- [ ] Section includes stat counters (animated on scroll): "500+ Creators | 50K+ Media Organized | $2M+ Revenue Tracked"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-004: Add Problem Statement Section
**Description:** As a visitor, I want to see that Lovdash understands my problems so that I trust they can solve them.

**Acceptance Criteria:**
- [ ] Problem section uses copy from LANDING_PAGE_BRIEF.md (chaos vs control messaging)
- [ ] Pain points displayed as animated list:
  - ❌ Files everywhere — phones, drives, vaults
  - ❌ Hours wasted organizing and tagging
  - ❌ Platform-hopping to post content
  - ❌ Flying blind on what converts
- [ ] Visual illustration showing chaos → order transformation
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-005: Feature AI Chat Assistant Prominently
**Description:** As a visitor, I want to understand the AI Chat Assistant feature so that I see how it differentiates Lovdash from competitors.

**Acceptance Criteria:**
- [ ] AI Chat Assistant feature is prominently featured (one of top 3 visible features)
- [ ] Feature highlights include:
  - ✓ Context-aware response suggestions
  - ✓ Media recommendations from your library
  - ✓ PPV pricing optimization
  - ✓ Persona consistency across team
  - ✓ Continuous learning from conversations
- [ ] Tagline: "Your AI co-pilot for every conversation" or "Turn any chatter into your best chatter"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-006: Add Agency-Focused Section
**Description:** As an agency visitor, I want a dedicated section that addresses my needs so that I know Lovdash is built for teams.

**Acceptance Criteria:**
- [ ] Agency section includes "Book a Demo" CTA (not "Start Free Trial")
- [ ] Security messaging present: bank-level encryption, role-based access, audit logs
- [ ] Feature grid includes: Multi-Creator Dashboard, Team Management, Role-Based Access, Audit Logs, Cross-Creator Analytics, Gamification
- [ ] Trust signal: "No credit card required. See the platform before you commit."
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 2: Creator Page Alignment (`/creator`)

#### US-007: Update Creator Page Hero
**Description:** As a solo creator, I want to see messaging that speaks to my needs so that I feel this product is for me.

**Acceptance Criteria:**
- [ ] Hero uses approved copy: "Upload once. Publish everywhere. Create more."
- [ ] Subheadline: "Lovdash handles the boring stuff so you can focus on what you love — creating content that connects."
- [ ] Pill badge: "For Creators"
- [ ] Platform icons displayed below CTAs
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-008: Update Creator Value Props
**Description:** As a solo creator, I want to see clear benefits so that I understand the ROI.

**Acceptance Criteria:**
- [ ] Value props match BUSINESS_CONTEXT.md:
  - Save Time: "5+ hours saved every week on content management"
  - Earn More: "Know exactly what content converts"
  - Post Smarter: "Right content, right platform, right time"
  - Stay Secure: "Your content, your control"
- [ ] Each value prop has an icon and supporting copy
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-009: Update Creator Pain Points
**Description:** As a solo creator, I want to see that Lovdash understands my specific challenges.

**Acceptance Criteria:**
- [ ] Pain points section aligns with documented creator problems from BUSINESS_CONTEXT.md
- [ ] Includes: organizing content, consistent posting, analytics, bio link quality
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 3: Agency/Studio Page Alignment (`/studio`)

#### US-010: Update Studio Page Hero
**Description:** As an agency decision-maker, I want to see messaging that addresses multi-creator management.

**Acceptance Criteria:**
- [ ] Hero uses "Manage every creator from one dashboard"
- [ ] Pill badge: "For Agencies"
- [ ] Primary CTA is "Book a Demo" (agencies are sales-led)
- [ ] Stats: "50+ Creators Managed | 10+ Agencies | 99.9% Uptime"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-011: Update Studio Features Grid
**Description:** As an agency, I want to see all the features that help me manage multiple creators.

**Acceptance Criteria:**
- [ ] Features grid includes: Multi-Creator Dashboard, Team Management, Role-Based Access, Audit Logs, Cross-Creator Analytics, Gamification
- [ ] Each feature has icon, title, and description
- [ ] Layout is 2x3 or 3x2 grid
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-012: Add Security Section for Agencies
**Description:** As an agency, I want to see security credentials so that I trust Lovdash with my creator accounts.

**Acceptance Criteria:**
- [ ] Security section emphasizes: bank-level encryption, instant revocation, audit trails
- [ ] Points include:
  - Bank-level encryption for all data
  - Isolated environments per creator
  - Instant access revocation
  - Complete audit trails
  - SOC 2 compliance (roadmap)
- [ ] Optional: "Download Security Whitepaper" CTA
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 4: Pricing Page Alignment (`/pricing`)

#### US-013: Update Pricing Tiers
**Description:** As a visitor, I want to see transparent pricing so that I can evaluate if Lovdash fits my budget.

**Acceptance Criteria:**
- [ ] Shows validated pricing: Starter $39/creator, Pro $59/creator, Agency custom
- [ ] Pro tier has "MOST POPULAR" badge
- [ ] Each tier shows feature comparison
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-014: Add Trust Signals to Pricing
**Description:** As a potential customer, I want reassurance about my purchase decision.

**Acceptance Criteria:**
- [ ] Trust signals present: "No credit card required", "Cancel anytime", "7-day free trial"
- [ ] Trust signals displayed prominently above or below pricing cards
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-015: Update Pricing Feature Lists
**Description:** As a visitor, I want to understand what's included in each tier.

**Acceptance Criteria:**
- [ ] Feature comparison matches BUSINESS_CONTEXT.md tier breakdown:
  - **Starter**: Media library + AI tagging, Bio link with analytics, Basic chat suggestions, 1 platform, Basic analytics, Email support
  - **Pro**: Everything in Starter + Full AI chat assistant, AI training, Unlimited platforms, Gamification, Advanced analytics, Priority support
  - **Agency**: Everything in Pro + Multi-creator dashboard, Team management, Cross-creator analytics, Activity feed, Dedicated account manager
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 5: Feature Pages Alignment (`/features/*`)

#### US-016: Update Media Library Page
**Description:** As a visitor researching features, I want to understand the Media Library capabilities.

**Acceptance Criteria:**
- [ ] Media Library page emphasizes unlimited storage + AI organization
- [ ] Key messaging: "Your content, organized automatically"
- [ ] Feature list: Unlimited storage, AI auto-tagging, Smart collections, SFW/NSFW classification, Instant search
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-017: Update AI Tagging Page
**Description:** As a visitor, I want to understand AI tagging capabilities without explicit terminology.

**Acceptance Criteria:**
- [ ] AI Tagging page mentions AI capabilities without saying "uncensored"
- [ ] Use: "AI built specifically for creators" or "AI that understands your content"
- [ ] Explains platform-aware classification (SFW, soft NSFW, explicit)
- [ ] Includes disclaimer: "AI-generated tags and descriptions are assistive and may require review"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-018: Update Scheduling Page
**Description:** As a visitor, I want to understand the scheduling capabilities.

**Acceptance Criteria:**
- [ ] Scheduling page includes multi-platform queue management
- [ ] Features: Visual calendar, Multi-platform queue, Optimal timing suggestions, Bulk scheduling, Draft approval workflows
- [ ] Key messaging: "Set it and forget it" / "Your content calendar, simplified"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-019: Update Publishing Page
**Description:** As a visitor, I want to see all supported platforms.

**Acceptance Criteria:**
- [ ] Publishing page lists all supported platforms with status:
  - OnlyFans ✅ Full Support
  - Fansly ✅ Full Support
  - LoyalFans ✅ Full Support
  - X/Twitter ✅ Full Support
  - Instagram ✅ Full Support
  - TikTok 🔜 Coming Soon
- [ ] Explains SFW/NSFW content routing
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-020: Update Analytics Page
**Description:** As a visitor, I want to understand the analytics capabilities.

**Acceptance Criteria:**
- [ ] Analytics page emphasizes revenue attribution and cross-creator insights
- [ ] Features: Revenue tracking, Content attribution, Bio link analytics, Cross-creator comparison, Trend identification
- [ ] Key messaging: "Know your numbers, grow your business"
- [ ] Agency-specific: "Compare creator performance at a glance"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 6: AI Page Alignment (`/ai`)

#### US-021: Introduce Bite AI Brand
**Description:** As a visitor, I want to learn about the AI assistant brand.

**Acceptance Criteria:**
- [ ] Introduces "Bite" as the AI brand name
- [ ] Headline options: "The AI that manages your entire creator business" or "Your AI-powered business partner"
- [ ] Pill badge: "Introducing Bite"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-022: List All AI Capabilities
**Description:** As a visitor, I want to understand all AI features.

**Acceptance Criteria:**
- [ ] Lists all AI capabilities:
  - 🏷️ Smart Tagging - Auto-categorize and tag content
  - 💬 Chat Intelligence - Context-aware response suggestions
  - 📊 Performance Insights - Understand what works
  - 📝 Auto-Descriptions - Generate captions per platform
  - 🎯 PPV Optimization - Smart pricing suggestions
  - 🔄 Continuous Learning - Gets smarter over time
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-023: Add AI Disclaimer
**Description:** As a visitor, I want transparency about AI limitations.

**Acceptance Criteria:**
- [ ] Includes disclaimer: "AI-generated content is assistive and may require review"
- [ ] Positioned appropriately (not hidden, but not dominant)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 7: Technical & SEO Alignment

#### US-024: Update Meta Tags
**Description:** As a search engine, I need proper meta tags to index pages correctly.

**Acceptance Criteria:**
- [ ] Meta tags follow template from LANDING_PAGE_BRIEF.md
- [ ] Each page has unique title, description, keywords
- [ ] Open Graph tags present for social sharing
- [ ] Twitter Card tags present
- [ ] Typecheck passes

---

#### US-025: Add Organization Schema
**Description:** As a search engine, I need structured data to understand the organization.

**Acceptance Criteria:**
- [ ] Schema.org Organization markup in root layout
- [ ] Includes: name, url, logo, description, foundingDate, sameAs (socials)
- [ ] Valid JSON-LD format
- [ ] Typecheck passes

---

#### US-026: Add FAQ Schema
**Description:** As a search engine, I need FAQ structured data for rich results.

**Acceptance Criteria:**
- [ ] FAQPage schema on pages with FAQ sections (homepage, pricing)
- [ ] Each question/answer pair properly formatted
- [ ] Valid JSON-LD format
- [ ] Typecheck passes

---

#### US-027: Align Design System Colors
**Description:** As a developer, I need consistent colors matching the brand guidelines.

**Acceptance Criteria:**
- [ ] Color variables in globals.css match DESIGN_SYSTEM.md tokens:
  - Primary: `#F03C4E` (Coral Pink)
  - Primary Light: `#FF6B7A`
  - Success: `#10B981` (Emerald - CTAs)
  - Text Primary: `#04071E`
  - Text Secondary: `#666666`
- [ ] Gradients defined: Hero gradient, CTA gradient
- [ ] Typecheck passes

---

#### US-028: Update Footer Company Info
**Description:** As a visitor, I want to see legitimate company information.

**Acceptance Criteria:**
- [ ] Footer includes company info: TRUST CHARGE SOLUTIONS LTD, Company No. 16584325
- [ ] Links to Terms, Privacy Policy
- [ ] Contact: hello@lovdash.com
- [ ] Social links: X/Twitter, Instagram
- [ ] Copyright: © 2026 TRUST CHARGE SOLUTIONS LTD. All rights reserved.
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-029: Update Navigation Links
**Description:** As a visitor, I want navigation that matches the site structure.

**Acceptance Criteria:**
- [ ] Navigation includes: Features (dropdown), Pricing, For Creators, For Agencies, AI
- [ ] Features dropdown includes: Media Library, AI Tagging, Scheduling, Publishing, Analytics
- [ ] CTAs in nav: "Book a Demo", "Start Free Trial"
- [ ] Mobile menu works correctly
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-030: Add Trust Badges to Hero
**Description:** As a visitor, I want to see trust signals immediately.

**Acceptance Criteria:**
- [ ] Trust badges row in hero: 🔒 Privacy-first | ⚡ AI-powered | ✓ Multi-platform
- [ ] Badges are visually consistent with design system
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

## Functional Requirements

### Content Requirements
- FR-1: All headlines must match approved copy from LANDING_PAGE_BRIEF.md
- FR-2: All CTAs must use action-oriented language ("Start Free Trial" not "Sign Up")
- FR-3: Agency pages must have "Book a Demo" as primary CTA
- FR-4: Solo creator pages must have "Start Free Trial" as primary CTA
- FR-5: All pricing must reflect validated tiers ($39/$59/Agency)
- FR-6: Platform support list must be accurate and up-to-date
- FR-7: AI features must emphasize "assistance" not "automation"

### Design Requirements
- FR-8: Primary button gradient: `#10B981 → #059669` (Emerald)
- FR-9: Brand accent color: `#F03C4E` (Coral Pink)
- FR-10: Button radius: 9999px (fully rounded)
- FR-11: Card radius: 16px
- FR-12: Section spacing: consistent with DESIGN_SYSTEM.md

### Technical Requirements
- FR-13: All pages must pass TypeScript typecheck
- FR-14: All pages must pass ESLint
- FR-15: Schema.org markup must validate in Google Rich Results Test
- FR-16: Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1

---

## Non-Goals (Out of Scope)

- No new page structures beyond what exists (keep current routes)
- No major design system overhaul (colors/fonts stay similar)
- No new feature functionality (backend work)
- No blog/content marketing pages
- No dashboard/app changes
- No A/B testing infrastructure
- No internationalization/translations
- No white-label customization

---

## Design Considerations

### Visual Consistency
- Keep existing animations and UI polish
- Maintain current responsive breakpoints
- Preserve existing component architecture
- Update content/copy without structural changes

### Key Visual Assets Needed
- Platform logos (OnlyFans, Fansly, LoyalFans, X, Instagram)
- Feature icons (consistent set)
- Hero illustration/mockup updates (if needed)
- Trust badges/icons

### Existing Components to Reuse
- `components/sections/hero.tsx`
- `components/sections/features.tsx`
- `components/sections/faq.tsx`
- `components/sections/cta.tsx`
- `components/ui/button.tsx`
- All existing section components

---

## Technical Considerations

### Dependencies
- Requires read access to `lovdash_app/frontend/` documentation
- No new package dependencies needed
- Uses existing Next.js 15.x setup

### File Changes Scope
```
app/(marketing)/
├── page.tsx                 # Homepage
├── creator/page.tsx         # Creator landing
├── studio/page.tsx          # Agency landing
├── pricing/page.tsx         # Pricing
├── ai/page.tsx              # AI/Bite feature
├── features/
│   ├── media-library/page.tsx
│   ├── ai-tagging/page.tsx
│   ├── scheduling/page.tsx
│   ├── publishing/page.tsx
│   └── analytics/page.tsx

components/sections/
├── hero.tsx
├── features.tsx
├── faq.tsx
├── footer.tsx
├── navigation.tsx
└── [others as needed]

app/
├── globals.css              # Design tokens
├── layout.tsx               # Schema.org markup
```

### Test Command
```bash
npm run build && npm run lint
```

---

## Success Metrics

- All 30 acceptance criteria checked off [x]
- `npm run build && npm run lint` passes with no errors
- Visual verification in browser for all UI stories
- Schema.org markup validates in Google Rich Results Test
- Messaging matches approved business documentation
- Ralph outputs `<ralph>COMPLETE</ralph>` when all stories pass

---

## Ralph Execution Requirements

Following the [Ralph autonomous agent pattern](https://github.com/flourishprosper/ralph-main):

### Key Files
| File | Purpose |
|------|---------|
| `prd.json` | User stories with `passes` status (task list) |
| `progress.txt` | Append-only learnings between iterations |
| `AGENTS.md` | Pattern documentation updated after discoveries |
| `tasks/prd-landing-page-business-alignment.md` | This PRD (reference) |

### Each Iteration Must:
1. Pick highest priority story where `passes: false`
2. Read `progress.txt` (especially Codebase Patterns section) for context
3. Implement that single story
4. Run `npm run build && npm run lint`
5. **For UI stories:** Verify in browser using dev-browser skill
6. Update `AGENTS.md` if reusable patterns discovered
7. If checks pass, commit: `feat: [Story ID] - [Story Title]`
8. Update `prd.json` to mark story as `passes: true`
9. Append learnings to `progress.txt`

### Browser Verification (Critical)
Frontend stories MUST include browser verification:
- Navigate to the relevant page
- Interact with UI to verify changes work
- Confirm functionality matches acceptance criteria
- A frontend story is NOT complete until browser verification passes

### Small Task Principle
Each story should be completable in one context window. If stuck:
- Break into smaller sub-tasks
- Focus on the specific acceptance criteria
- Don't over-engineer

### Stop Conditions
- **Success:** All stories have `passes: true` → Output `<ralph>COMPLETE</ralph>`
- **Stuck:** Same issue 3+ times → Output `<ralph>GUTTER</ralph>`

---

## Open Questions

1. Should "Book a Demo" use Cal.com or a custom form?
2. Are there specific testimonials/quotes approved for use?
3. Should stats be real numbers or placeholders until we have more data?
4. Is there a preference for the exact hero headline variant?

---

## Implementation Notes

### Phase Execution Order
1. **Phase 1 (Homepage)** - Highest visibility, establishes patterns
2. **Phase 2 (Creator)** - Secondary landing page
3. **Phase 3 (Studio)** - Agency landing page
4. **Phase 4 (Pricing)** - Revenue-critical page
5. **Phase 5 (Features)** - Supporting pages
6. **Phase 6 (AI)** - Differentiator page
7. **Phase 7 (Technical)** - SEO/Schema/Polish

### Verification Process
After each story:
1. Run `npm run build && npm run lint`
2. Verify in browser (for UI stories)
3. Check off acceptance criteria
4. Commit with descriptive message referencing story ID

---

*PRD Version: 1.0*
*Created: January 17, 2026*
*Last Updated: January 17, 2026*
