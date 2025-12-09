// ============================================
// CREATOR PROFILES DATABASE & TYPES
// ============================================
// This file contains all creator data and can be imported by both
// server and client components.

export interface CreatorLink {
  id: string;
  label: string;
  sub?: string;
  href: string;
  img?: string;
  pill?: string;
  pillColor?: string;
  iconType: 'crown' | 'video' | 'heart' | 'footprints';
  iconColor: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  tagline: string;
  subtitle: string;
  profileImage: string;
  galleryImage?: string;
  welcomeTitle: string;
  welcomeText: string;
  socialLinks: {
    x?: string;
    reddit?: string;
    instagram?: string;
    tiktok?: string;
  };
  links: CreatorLink[];
  primaryLink: string; // For "Join me" CTA
}

export const CREATORS_DATABASE: Record<string, CreatorProfile> = {
  // ===== MIRRABELLE13 =====
  "mirrabelle13": {
    id: "mirrabelle13",
    name: "Mirrabelle13",
    tagline: "Model • Creator • Dreamer",
    subtitle: "Elegance and exclusive live experiences",
    profileImage: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/profile_mirrabelle13.png?t=1760482587828",
    galleryImage: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/referenced_images/generated-images__link-in-bio__image-block__home__4f658e27-a4b1-442c-bd41-cda4ed6354a3__56c55766-9548-4aba-82cf-921289c27593.jpg?t=1761453961066",
    welcomeTitle: "Welcome to my official site!",
    welcomeText: "As a live model and digital creator, I love turning fantasy into experience. My content is all about confidence, charm, and authentic energy that makes every moment special.",
    socialLinks: {
      x: "https://x.com/mirrabelle_",
      reddit: "https://www.reddit.com/user/mirabelle13/",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans VIP",
        sub: "Step beyond the ordinary and unlock my VIP world ✨",
        href: "https://onlyfans.com/mirrabellee",
        pill: "VIP Access",
        pillColor: "bg-sky-100 text-sky-600",
        img: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/link_images/23591f18-844a-4e89-b290-f587a9feb3d9.jpg",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "chaturbate",
        label: "Watch me live on Chaturbate!",
        sub: "Live streaming & exclusive content",
        href: "https://chaturbate.com/?campaign=DRf6r&disable_sound=0&join_overlay=1&room=mirrabelle_13GotoRoom&tour=YrCr&track=mirrabelle_13",
        img: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/referenced_images/41b02365-8cb6-4174-9646-6e0e39c2091b__link-in-bio__links-block__home__8c1243ac-d3af-4360-93ed-0e07df112d5f__74edc33d-dee4-4df1-a0e9-c4c03edad873__60e65803-6f5e-42ae-9528-819705b308fd.webp?t=1760484836448",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "loyalfans",
        label: "Loyalfans",
        sub: "Exclusive content & direct messages",
        href: "https://www.loyalfans.com/mirrabelle",
        img: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/link_images/1363d567-3c47-425d-a520-021f7a0674fb.jpg",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "fansly",
        label: "Fansly",
        sub: "Subscribe for exclusive posts & content",
        href: "https://fansly.com/mirrabellee/posts",
        img: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/link_images/528a85ef-2588-4dfc-8171-1bc380eeecee.png",
        iconType: "heart",
        iconColor: "text-blue-500",
      },
      {
        id: "feetfinder",
        label: "FeetFinder",
        sub: "Exclusive feet content",
        href: "https://app.feetfinder.com/userProfile/Mirrabelle13",
        img: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/referenced_images/generated-images__link-in-bio__links-block__home__8c1243ac-d3af-4360-93ed-0e07df112d5f__caeeaf39-f582-4ac9-8dff-51dd5a04abf1__958d6c2c-98dc-4430-b8cd-c687173c0397.webp?t=1763388573281",
        iconType: "footprints",
        iconColor: "text-rose-400",
      },
    ],
    primaryLink: "https://onlyfans.com/mirrabellee",
  },

  // ===== ANTONIASNOW =====
  "antoniasnow": {
    id: "antoniasnow",
    name: "AntoniaSnow",
    tagline: "Creator • Model • Exclusive",
    subtitle: "Private moments, hidden pleasures",
    profileImage: "https://i.imgur.com/X2AIRD8.png",
    galleryImage: "https://i.imgur.com/0g90fXC.jpeg",
    welcomeTitle: "Welcome to my world",
    welcomeText: "I create private moments. The motive is simple, hidden pleasure. Step into my exclusive space and discover what makes every moment unforgettable.",
    socialLinks: {
      x: "https://x.com/RealAntoniaSnow",
      reddit: "https://www.reddit.com/user/AntoniaSnow/",
      instagram: "https://www.instagram.com/antoniaasnow/",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/antoniasnow",
        pill: "VIP",
        pillColor: "bg-sky-100 text-sky-600",
        img: "https://i.imgur.com/X2AIRD8.png",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/AntoniaSnow",
        img: "https://i.imgur.com/X2AIRD8.png",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "bongacams",
        label: "BongaCams",
        sub: "Live streaming & shows",
        href: "https://bongacams.com/SkinnyJennifer",
        img: "https://i.imgur.com/X2AIRD8.png",
        iconType: "video",
        iconColor: "text-pink-500",
      },
      {
        id: "loyalfans",
        label: "LoyalFans",
        sub: "Exclusive content & direct messages",
        href: "https://www.loyalfans.com/antoniasnow",
        img: "https://i.imgur.com/X2AIRD8.png",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "feetfinder",
        label: "FeetFinder",
        sub: "Exclusive feet content",
        href: "https://app.feetfinder.com/userProfile/antoniasnow",
        img: "https://i.imgur.com/X2AIRD8.png",
        iconType: "footprints",
        iconColor: "text-rose-400",
      },
    ],
    primaryLink: "https://onlyfans.com/antoniasnow",
  },

  // ===== ADD MORE CREATORS HERE =====
  // Copy the structure above and modify for each new creator
};

// Helper function to get creator by ID
export function getCreator(creatorID: string): CreatorProfile | null {
  return CREATORS_DATABASE[creatorID?.toLowerCase()] || null;
}

