---
task: Audit and align landing page with Lovdash business knowledge
test_command: "npm run build && npm run lint"
knowledge_sources:
  - /Volumes/Development/of/lovdash_app/frontend/docs/DESIGN_SYSTEM.md
  - /Volumes/Development/of/lovdash_app/frontend/business/ABOUT_LOVDASH.md
  - /Volumes/Development/of/lovdash_app/frontend/business/BUSINESS_ANALYSIS.md
  - /Volumes/Development/of/lovdash_app/frontend/business/BUSINESS_CONTEXT.md
  - /Volumes/Development/of/lovdash_app/frontend/business/BUSINESS_STRATEGY.md
  - /Volumes/Development/of/lovdash_app/frontend/business/LANDING_PAGE_BRIEF.md
  - /Volumes/Development/of/lovdash_app/frontend/business/LANDING_PAGE_IMPLEMENTATION.md
  - /Volumes/Development/of/lovdash_app/frontend/business/SALES_DECK.md
---

# Task: Landing Page & Business Knowledge Alignment Audit

Audit the Lovdash landing page (`lovebite_landingpage`) and ensure all content, messaging, and structure aligns with the comprehensive business documentation in the knowledge sources.

## Context Summary

### Company Identity
- **Product:** Lovdash — "The Creator Operating System"
- **Company:** TRUST CHARGE SOLUTIONS LTD (UK Company No. 16584325)
- **Status:** Early access with paying customers (NOT pre-launch waitlist)
- **Taglines:** "Upload once, publish everywhere, track what works."

### Target Markets
1. **Primary:** Creator Management Agencies (5-50+ creators, $50-150/model/month willingness)
2. **Secondary:** Independent Adult Creators ($29-79/month willingness)
3. **Platforms:** OnlyFans, Fansly, LoyalFans, X/Twitter, Instagram

### Core Features (Priority Order)
1. Media Library + AI Organization (unlimited storage, auto-tagging, smart collections)
2. AI Chat Assistant (persona learning, response suggestions, PPV optimization) ⭐ KEY DIFFERENTIATOR
3. Multi-Platform Publishing (post everywhere from one dashboard)
4. Analytics Dashboard (revenue tracking, content attribution)
5. Bio Links (lovdash.com/creator/[username] with analytics)
6. Team & Agency Management (RBAC, audit logs, credential vault)
7. Gamification (challenges, streaks, leaderboards)

### Brand Design System
- **Primary:** Coral Pink `#F03C4E` / `#E85A71`
- **Secondary:** Dark Navy `#1A1A2E`
- **Success/CTA:** Emerald Green `#10B981`
- **Fonts:** SF Pro Display/Inter (body), serif italics for accent

### Key Messaging Priorities
1. Time-saving: "Save hours every week"
2. Revenue focus: "Earn more, work less"
3. AI-powered: "AI that actually works for you"
4. All-in-one: "Everything in one place"
5. Scale: "Grow without chaos" (agency-focused)

---

## Requirements

1. Read and analyze all 8 knowledge source files
2. Audit each landing page section for alignment with business documentation
3. Update copy, CTAs, and structure to match approved messaging
4. Ensure design tokens match the DESIGN_SYSTEM.md specifications
5. Verify pricing page reflects validated price points ($39/$59/Agency)
6. Add or update Schema.org structured data for AEO optimization

---

## Success Criteria

### Phase 1: Homepage Alignment
1. [ ] Hero section uses approved headline: "The Creator Operating System" or "Your media. Every platform. Easy for everyone."
2. [ ] Primary CTA changed from "Join Waitlist" to "Start Free Trial" (we have paying customers)
3. [ ] Social proof bar shows platform logos: OnlyFans, Fansly, LoyalFans, X/Twitter, Instagram
4. [ ] Problem section uses copy from LANDING_PAGE_BRIEF.md (chaos vs control messaging)
5. [ ] AI Chat Assistant feature is prominently featured (key differentiator vs Infloww)
6. [ ] Agency section includes "Book a Demo" CTA and security messaging

### Phase 2: Creator Page Alignment (`/creator`)
7. [ ] Hero uses approved copy: "Upload once. Publish everywhere. Create more."
8. [ ] Value props match BUSINESS_CONTEXT.md: Save Time, Earn More, Post Smarter, Stay Secure
9. [ ] Platform icons displayed for all supported platforms
10. [ ] Pain points section aligns with documented creator problems

### Phase 3: Agency/Studio Page Alignment (`/studio`)
11. [ ] Hero uses "Manage every creator from one dashboard"
12. [ ] Features grid includes: Multi-Creator Dashboard, Team Management, Role-Based Access, Audit Logs, Cross-Creator Analytics, Gamification
13. [ ] Security section emphasizes: bank-level encryption, instant revocation, audit trails
14. [ ] Primary CTA is "Book a Demo" (agencies are sales-led)

### Phase 4: Pricing Page Alignment (`/pricing`)
15. [ ] Shows validated pricing: Starter $39/creator, Pro $59/creator, Agency custom
16. [ ] Trust signals present: "No credit card required", "Cancel anytime", "7-day free trial"
17. [ ] Feature comparison matches BUSINESS_CONTEXT.md tier breakdown

### Phase 5: Feature Pages Alignment (`/features/*`)
18. [ ] Media Library page emphasizes unlimited storage + AI organization
19. [ ] AI Tagging page mentions Venice AI capabilities (without saying "uncensored")
20. [ ] Scheduling page includes multi-platform queue management
21. [ ] Publishing page lists all supported platforms with status
22. [ ] Analytics page emphasizes revenue attribution and cross-creator insights

### Phase 6: AI Page Alignment (`/ai`)
23. [ ] Introduces "Bite" as the AI brand name
24. [ ] Lists all AI capabilities: Smart Tagging, Chat Intelligence, Performance Insights, Auto-Descriptions, PPV Optimization, Continuous Learning
25. [ ] Includes disclaimer: "AI-generated content is assistive and may require review"

### Phase 7: Technical & SEO Alignment
26. [ ] Meta tags follow template from LANDING_PAGE_BRIEF.md
27. [ ] Schema.org Organization markup in layout
28. [ ] FAQPage schema on pages with FAQ sections
29. [ ] Color variables in globals.css match DESIGN_SYSTEM.md tokens
30. [ ] Footer includes company info: TRUST CHARGE SOLUTIONS LTD, Company No. 16584325

---

## Reference: Key Copy Snippets

### Hero Headlines (approved)
- Homepage: "Your media. Every platform. Easy for everyone."
- Creator: "Upload once. Publish everywhere. Create more."
- Agency: "Manage every creator from one dashboard."

### Problem Statement (from LANDING_PAGE_BRIEF.md)
```
❌ Files everywhere — phones, drives, vaults
❌ Hours wasted organizing and tagging
❌ Platform-hopping to post content
❌ Flying blind on what converts
```

### AI Chat Assistant (key differentiator)
```
✓ Context-aware response suggestions
✓ Media recommendations from your library
✓ PPV pricing optimization
✓ Persona consistency across team
✓ Continuous learning from conversations
```

### Trust Badges
```
🔒 Privacy-first | ⚡ AI-powered | ✓ Multi-platform
```

### CTA Hierarchy
- Primary: "Start Free Trial →" (creators) / "Book a Demo →" (agencies)
- Secondary: "See How It Works" / "Explore Features"

---

## File Structure Reference

```
app/(marketing)/
├── page.tsx              # Homepage
├── creator/page.tsx      # Creator landing
├── studio/page.tsx       # Agency landing
├── pricing/page.tsx      # Pricing
├── ai/page.tsx           # AI/Bite feature
├── features/
│   ├── media-library/
│   ├── ai-tagging/
│   ├── scheduling/
│   ├── publishing/
│   └── analytics/

components/sections/
├── hero.tsx
├── features.tsx
├── faq.tsx
├── cta.tsx
├── creator/              # Creator-specific
├── studio/               # Agency-specific
└── ...
```

---

## Ralph Instructions

1. **Read ALL knowledge sources first** before making any changes
2. Work on criteria in phase order (Phase 1 → Phase 2 → etc.)
3. Check off completed criteria (change [ ] to [x]) after verifying each
4. Run `npm run build && npm run lint` after significant changes
5. Commit frequently with descriptive messages referencing the criteria number
6. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
7. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`

### Priority Notes
- **Phase 1-2** are highest priority (most user-facing)
- **AI Chat Assistant prominence** is critical — this is our key differentiator
- **CTA changes** from waitlist to trial reflect our operational status
- Preserve existing animations and UI polish while updating content
