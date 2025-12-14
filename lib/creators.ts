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
  iconType: "crown" | "video" | "heart" | "footprints";
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
  customDomains?: string[]; // Custom domains for this creator (e.g., ["mirrabelle13.online"])
}

export const CREATORS_DATABASE: Record<string, CreatorProfile> = {
  // ===== MIRRABELLE13 =====
  mirrabelle13: {
    id: "mirrabelle13",
    name: "Mirrabelle13",
    tagline: "Model • Creator • Dreamer",
    subtitle: "Elegance and exclusive live experiences",
    profileImage:
      "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/profile_mirrabelle13.png?t=1760482587828",
    galleryImage:
      "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/referenced_images/generated-images__link-in-bio__image-block__home__4f658e27-a4b1-442c-bd41-cda4ed6354a3__56c55766-9548-4aba-82cf-921289c27593.jpg?t=1761453961066",
    welcomeTitle: "Welcome to my official site!",
    welcomeText:
      "As a live model and digital creator, I love turning fantasy into experience. My content is all about confidence, charm, and authentic energy that makes every moment special.",
    customDomains: ["mirrabelle13.online"],
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
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "chaturbate",
        label: "Watch me live on Chaturbate!",
        sub: "Live streaming & exclusive content",
        href: "https://chaturbate.com/?campaign=DRf6r&disable_sound=0&join_overlay=1&room=mirrabelle_13GotoRoom&tour=YrCr&track=mirrabelle_13",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "loyalfans",
        label: "Loyalfans",
        sub: "Exclusive content & direct messages",
        href: "https://www.loyalfans.com/mirrabelle",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "fansly",
        label: "Fansly",
        sub: "Subscribe for exclusive posts & content",
        href: "https://fansly.com/mirrabellee/posts",
        iconType: "heart",
        iconColor: "text-blue-500",
      },
      {
        id: "feetfinder",
        label: "FeetFinder",
        sub: "Exclusive feet content",
        href: "https://app.feetfinder.com/userProfile/Mirrabelle13",
        iconType: "footprints",
        iconColor: "text-rose-400",
      },
    ],
    primaryLink: "https://onlyfans.com/mirrabellee",
  },

  natashaivacenko: {
    id: "natashaivacenko",
    name: "Natasha Ivacenko",
    tagline: "Natasha Ivacenko",
    subtitle: "",
    profileImage: "https://i.imgur.com/osAVAeA.png",
    galleryImage: "https://i.imgur.com/xeolOpH.png",
    welcomeTitle: "Welcome to my official site!",
    welcomeText:
      "Blonde, blue eyes, and full of surprises. I've got that classic, timeless look and a wild side that shows when the modd is right.",
    socialLinks: {
      x: "https://x.com/natashaivacenko",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/natashaivacenko",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Live streaming & exclusive content",
        href: "https://chaturbate.com/natashaivacenko",
        iconType: "video",
        iconColor: "text-sky-500",
      },
      {
        id: "fansly",
        label: "Fansly",
        sub: "Exclusive content just for you ✨",
        href: "https://fans.ly/NatashaIvacenko",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "loyalfans",
        label: "Loyalfans",
        sub: "Exclusive content just for you ✨",
        href: "https://www.loyalfans.com/natashaivacenko",
        pill: "FREE",
        iconType: "heart",
        iconColor: "text-rose-500",
      },

      {
        id: "skyprivate",
        label: "Skyprivate",
        sub: "Private video calls & exclusive content",
        href: "https://profiles.skyprivate.com/models/2kvh5-natasha-ivacenko.html",
        iconType: "video",
        iconColor: "text-blue-500",
      },
      {
        id: "stripchat",
        label: "Stripchat",
        sub: "Live streaming & exclusive content",
        href: "https://stripchat.com/natashaivacenko",
        iconType: "video",
        iconColor: "text-sky-500",
      },

      {
        id: "myfreecams",
        label: "MyFreeCams",
        sub: "Live streaming & exclusive content",
        href: "https://profiles.myfreecams.com/NatashaIvy",
        iconType: "video",
        iconColor: "text-blue-500",
      },
    ],
    primaryLink: "https://onlyfans.com/natashaivacenko",
  },
  // ===== ANTONIASNOW =====
  antoniasnow: {
    id: "antoniasnow",
    name: "AntoniaSnow",
    tagline: "Creator • Model • Exclusive",
    subtitle: "Private moments, hidden pleasures",
    profileImage: "https://i.imgur.com/X2AIRD8.png",
    galleryImage: "https://i.imgur.com/0g90fXC.jpeg",
    welcomeTitle: "Welcome to my world",
    welcomeText:
      "I create private moments. The motive is simple, hidden pleasure. Step into my exclusive space and discover what makes every moment unforgettable.",
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
        pill: "FREE",
        pillColor: "bg-green-100 text-green-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/AntoniaSnow",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "bongacams",
        label: "BongaCams",
        sub: "Live streaming & shows",
        href: "https://bongacams.com/SkinnyJennifer",
        iconType: "video",
        iconColor: "text-pink-500",
      },
      {
        id: "loyalfans",
        label: "LoyalFans",
        sub: "Exclusive content & direct messages",
        href: "https://www.loyalfans.com/antoniasnow",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "feetfinder",
        label: "FeetFinder",
        sub: "Exclusive feet content",
        href: "https://app.feetfinder.com/userProfile/antoniasnow",
        iconType: "footprints",
        iconColor: "text-rose-400",
      },
    ],
    primaryLink: "https://onlyfans.com/antoniasnow",
  },

  // ===== TINYBLAIR =====
  tinyblair: {
    id: "tinyblair",
    name: "TinyBlair",
    tagline: "Model • Creator • Live",
    subtitle: "Petite & playful energy",
    profileImage: "https://i.imgur.com/g2mb91G.png",
    galleryImage: "https://i.imgur.com/UdgPFJ0.jpeg",
    welcomeTitle: "Hey there! 💕",
    welcomeText:
      "Welcome to my exclusive space. I'm all about creating memorable moments and connecting with amazing people like you.",
    socialLinks: {
      x: "https://x.com/realtinyblair",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/tinyblair",
        pill: "VIP",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "loyalfans",
        label: "LoyalFans",
        sub: "Exclusive content & direct messages",
        href: "https://www.loyalfans.com/tinyblair",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/tinyblair",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "stripchat",
        label: "Stripchat",
        sub: "Live shows & private sessions",
        href: "https://stripchat.com/tinyblair",
        iconType: "video",
        iconColor: "text-purple-500",
      },
      {
        id: "bongacams",
        label: "BongaCams",
        sub: "Live streaming & shows",
        href: "https://bongacams.com/tineblair",
        iconType: "video",
        iconColor: "text-pink-500",
      },
    ],
    primaryLink: "https://onlyfans.com/tinyblair",
  },

  // ===== ENERGYELIZA =====
  energyeliza: {
    id: "energyeliza",
    name: "EnergyEliza",
    tagline: "Creator • Model • Exclusive",
    subtitle: "Private moments, hidden pleasures",
    profileImage: "https://i.imgur.com/tZnQPjW.png",
    galleryImage: "https://i.imgur.com/r5LNUDE.jpeg",
    welcomeTitle: "Welcome to my world",
    welcomeText:
      "I create private moments. The motive is simple, hidden pleasure. Step into my exclusive space and discover what makes every moment unforgettable.",
    socialLinks: {
      x: "https://x.com/EnergyEliza",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/energyeliza",
        pill: "VIP",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/energyeliza",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "bongacams",
        label: "BongaCams",
        sub: "Live streaming & shows",
        href: "https://bongacams.com/energyeliza",
        iconType: "video",
        iconColor: "text-pink-500",
      },
      {
        id: "stripchat",
        label: "Stripchat",
        sub: "Live shows & private sessions",
        href: "https://stripchat.com/energyeliza",
        iconType: "video",
        iconColor: "text-purple-500",
      },
    ],
    primaryLink: "https://onlyfans.com/energyeliza",
  },

  // ===== BOHOBABELEXY =====
  bohobabelexy: {
    id: "bohobabelexy",
    name: "bohobabelexy",
    tagline: "Creator • Model • Exclusive",
    subtitle: "Private moments, hidden pleasures",
    profileImage: "https://i.imgur.com/JyjGyiE.png",
    galleryImage: "https://i.imgur.com/j3ah9BA.png",
    welcomeTitle: "Welcome to my world",
    welcomeText:
      "I create private moments. The motive is simple, hidden pleasure. Step into my exclusive space and discover what makes every moment unforgettable.",
    customDomains: ["bohobabelexy.online"],
    socialLinks: {
      x: "https://x.com/bohobabelexy",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/bohobabelexy",
        pill: "VIP",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/bohobabelexy",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "bongacams",
        label: "BongaCams",
        sub: "Live streaming & shows",
        href: "https://bongacams.com/bohobabelexy",
        iconType: "video",
        iconColor: "text-pink-500",
      },
      {
        id: "stripchat",
        label: "Stripchat",
        sub: "Live shows & private sessions",
        href: "https://stripchat.com/bohobabelexy",
        iconType: "video",
        iconColor: "text-purple-500",
      },
    ],
    primaryLink: "https://onlyfans.com/bohobabelexy",
  },

  // ===== ALEXXISRAE =====
  alexxisrae: {
    id: "alexxisrae",
    name: "Alexxis Rae",
    tagline: "Alexxis Rae",
    subtitle: "Where your fantasy becomes my reality",
    profileImage: "https://i.imgur.com/7mO0Ct7.jpeg",
    galleryImage: "https://i.imgur.com/7qUoviG.jpeg",
    welcomeTitle: "",
    welcomeText:
      "Where your fantasy becomes my reality.❤️‍🔥 A blend of passion, seduction, and irresistible desire. Step into my world and let's explore what pleasure truly feels like.",
    socialLinks: {
      x: "https://x.com/alexxisrae19",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/realalexxisrae",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
   
      {
        id: "xlovecam",
        label: "XLoveCam",
        sub: "Watch me live & exclusive shows",
        href: "https://www.xlovecam.com/en/model/alexxisrae/",
        iconType: "video",
        iconColor: "text-pink-500",
      },
      {
        id: "fansly",
        label: "Fansly",
        sub: "Exclusive content just for you ✨",
        href: "https://fans.ly/AlexxisRae",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "loyalfans",
        label: "Loyalfans",
        sub: "Exclusive content just for you ✨",
        href: "https://www.loyalfans.com/alexxisrae",
        pill: "FREE",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "stripchat",
        label: "Stripchat",
        sub: "Live shows & private sessions",
        href: "https://stripchat.com/alexxisrae",
        iconType: "video",
        iconColor: "text-purple-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/alexxisrae/",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "myfreecams",
        label: "MyFreeCams",
        sub: "Live streaming & shows",
        href: "https://profiles.myfreecams.com/AlexxisRae",
        iconType: "video",
        iconColor: "text-blue-500",
      },
    ],
    primaryLink: "https://onlyfans.com/realalexxisrae",
  },
  sashalorenz: {
    id: "sashalorenz",
    name: "Sasha Lorenz",
    tagline: "Sasha Lorenz",
    subtitle: "",
    profileImage: "https://i.imgur.com/FDDDVzV.png ",
    galleryImage: "https://i.imgur.com/WYQkzhE.png",
    welcomeTitle: "",
    welcomeText:
      "I’m pretty easy-going and down for whatever mood you’re in, whether that’s a casual conversation or something more playful. I like to keep things relaxed and fun, no pressure at all. Just be yourself, and I’ll do the same! 😊",
    socialLinks: {
      // x: "https://x.com/alexxisrae19",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/sashalorenz",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "xlovecam",
        label: "XLoveCam",
        sub: "Watch me live & exclusive shows",
        href: "https://xlovecam.com/sashalorenz",
        iconType: "video",
        iconColor: "text-pink-500",
      },
      {
        id: "skyprivate",
        label: "Skyprivate",
        sub: "Private video calls & exclusive content",
        href: "https://profiles.skyprivate.com/models/2l0jw-sasha-lorenz.html",
        iconType: "video",
        iconColor: "text-pink-500",
      },
      {
        id: "fansly",
        label: "Fansly",
        sub: "Exclusive content just for you ✨",
        href: "https://fans.ly/SashaLorenz",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "loyalfans",
        label: "Loyalfans",
        sub: "Exclusive content just for you ✨",
        href: "https://www.loyalfans.com/sashalorenz",
        pill: "FREE",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "stripchat",
        label: "Stripchat",
        sub: "Live shows & private sessions",
        href: "https://stripchat.com/sashalorenzz",
        iconType: "video",
        iconColor: "text-purple-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/sashalorenzz/",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "bongacams",
        label: "BongaCams",
        sub: "Live streaming & shows",
        href: "https://bongacams.com/sashalorenz",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "myfreecams",
        label: "MyFreeCams",
        sub: "Live streaming & shows",
        href: "https://profiles.myfreecams.com/kasey_rush",
        iconType: "video",
        iconColor: "text-blue-500",
      },
    ],
    primaryLink: "https://onlyfans.com/sashalorenz",
  },
  lustyfantasy: {
    id: "lustyfantasy",
    name: "Lusty Fantasy",
    tagline: "Lusty Fantasy",
    subtitle: "",
    profileImage: "https://i.imgur.com/zmhbSvS.png",
    galleryImage: "https://i.imgur.com/WeTfbrH.png",
    welcomeTitle: "",
    welcomeText:
      "I’m Victoria, 33 yo, curvy, confident, and full of playful energy. I love creating a cozy, flirty space where we can laugh, connect, and let the good vibes flow.",
    socialLinks: {
      x: "https://x.com/lustyfantasy12",
    },
    links: [
      {
        id: "onlyfans",
        label: "OnlyFans",
        sub: "Exclusive content just for you ✨",
        href: "https://onlyfans.com/lustyfantasy",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "fansly",
        label: "Fansly",
        sub: "Exclusive content just for you ✨",
        href: "https://fans.ly/LustyFantasy",
        pill: "FREE",
        pillColor: "bg-sky-100 text-sky-600",
        iconType: "crown",
        iconColor: "text-sky-500",
      },
      {
        id: "loyalfans",
        label: "Loyalfans",
        sub: "Exclusive content just for you ✨",
        href: "https://www.loyalfans.com/lustyfantasy",
        pill: "FREE",
        iconType: "heart",
        iconColor: "text-rose-500",
      },
      {
        id: "stripchat",
        label: "Stripchat",
        sub: "Live shows & private sessions",
        href: "https://stripchat.com/lustyfantasy",
        iconType: "video",
        iconColor: "text-purple-500",
      },
      {
        id: "chaturbate",
        label: "Chaturbate",
        sub: "Watch me live",
        href: "https://chaturbate.com/lustyfantasy/",
        iconType: "video",
        iconColor: "text-orange-500",
      },
      {
        id: "bongacams",
        label: "BongaCams",
        sub: "Live streaming & shows",
        href: "https://bongacams.com/lustyfantasy",
        iconType: "video",
        iconColor: "text-orange-500",
      },
    ],
    primaryLink: "https://onlyfans.com/lustyfantasy",
  },

  // ===== ADD MORE CREATORS HERE =====
  // Copy the structure above and modify for each new creator
};

// Helper function to get creator by ID
export function getCreator(creatorID: string): CreatorProfile | null {
  return CREATORS_DATABASE[creatorID?.toLowerCase()] || null;
}

// Helper function to get creator by custom domain
export function getCreatorByDomain(hostname: string): CreatorProfile | null {
  // Remove www. prefix if present
  const domain = hostname.replace(/^www\./, "").toLowerCase();

  for (const creator of Object.values(CREATORS_DATABASE)) {
    if (creator.customDomains?.some((d) => d.toLowerCase() === domain)) {
      return creator;
    }
  }
  return null;
}
