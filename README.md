# Lovebite Landing Page

A modern, animated landing page for Lovebite - a content creator management agency. Built with Next.js 15, Tailwind CSS, shadcn/ui components, and Motion (Framer Motion).

## Features

- **Modern Design**: Pink/white color palette with glass-morphism effects
- **Smooth Animations**: Scroll-triggered animations, staggered reveals, floating elements
- **Responsive**: Mobile-first design with adaptive layouts
- **Accessible**: Proper ARIA labels, keyboard navigation, focus states
- **Performance**: Optimized images with Next.js Image component
- **SEO Ready**: Meta tags, Open Graph, semantic HTML

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui (Button, Card, Input, Select, Accordion)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Font**: Outfit (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18.18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd lovebite_landingpage
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── globals.css       # Global styles & Tailwind config
│   ├── layout.tsx        # Root layout with fonts & metadata
│   └── page.tsx          # Main landing page
├── components/
│   ├── motion/           # Animation utilities
│   │   ├── animated-section.tsx
│   │   └── smooth-scroll.tsx
│   ├── sections/         # Page sections
│   │   ├── navigation.tsx
│   │   ├── hero.tsx
│   │   ├── stats.tsx
│   │   ├── process.tsx
│   │   ├── about.tsx
│   │   ├── earnings.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   ├── contact.tsx
│   │   └── footer.tsx
│   └── ui/               # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── accordion.tsx
├── lib/
│   └── utils.ts          # Utility functions (cn)
└── public/               # Static assets
\`\`\`

## Customization

### Brand Colors

Update the brand color palette in \`tailwind.config.ts\`:

\`\`\`typescript
colors: {
  brand: {
    500: '#ec4899', // Change this to your brand color
    // ... other shades
  }
}
\`\`\`

### Images

All hero/about images are sourced from Unsplash. Replace the URLs in:
- \`components/sections/hero.tsx\`
- \`components/sections/about.tsx\`

### Content

Update text content directly in the section components under \`components/sections/\`.

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## License

Private - All rights reserved.


# lovebite




















