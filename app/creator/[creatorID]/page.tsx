"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Share2, 
  ArrowRight, 
  Crown, 
  Video, 
  Footprints, 
  Heart, 
  Check,
  MessageCircle,
  X,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// CREATOR PROFILES DATABASE
// ============================================
// Add new creators here - each creator has a unique ID that matches the URL
// Example: /creator/mirrabelle13 loads the "mirrabelle13" profile

interface CreatorLink {
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

interface CreatorProfile {
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

const CREATORS_DATABASE: Record<string, CreatorProfile> = {
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

  // ===== ADD MORE CREATORS HERE =====
  // Copy the structure above and modify for each new creator
  // Example:
  // "username": {
  //   id: "username",
  //   name: "Display Name",
  //   ...
  // },
};

// ============================================
// ICON COMPONENTS
// ============================================

// X (formerly Twitter) icon - updated logo
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom Reddit icon (not available in lucide-react)
const RedditIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

// Helper function to get icon component based on type
const getLinkIcon = (iconType: string, iconColor: string) => {
  const className = `h-5 w-5 ${iconColor}`;
  switch (iconType) {
    case 'crown': return <Crown className={className} />;
    case 'video': return <Video className={className} />;
    case 'heart': return <Heart className={className} />;
    case 'footprints': return <Footprints className={className} />;
    default: return <Heart className={className} />;
  }
};

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const linkHoverVariants = {
  rest: { scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 10px 30px rgba(190, 24, 93, 0.15)",
    transition: { type: "spring" as const, stiffness: 400, damping: 17 }
  },
  tap: { scale: 0.98 },
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function LovebiteBioPage() {
  const params = useParams();
  const creatorID = params.creatorID as string;
  
  // Get creator profile from database
  const creator = CREATORS_DATABASE[creatorID?.toLowerCase()];

  // All hooks must be called before any conditional returns
  const [copied, setCopied] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  // 3D Card Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 40 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 40 });

  // Set page title dynamically
  useEffect(() => {
    if (creator) {
      document.title = `${creator.name} | Your Private Fantasy Live - Lovebite Bio`;
    } else {
      document.title = "Bio Not Found | Lovebite";
    }
  }, [creator]);
  
  // Show "No bio found" screen if creator doesn't exist
  if (!creator) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-sans flex flex-col items-center justify-center px-4 overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          body { font-family: 'Poppins', sans-serif; }
        `}</style>
        
        {/* Animated background gradient */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 via-transparent to-rose-900/20" />
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px]"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Content */}
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Icon */}
          <motion.div 
            className="mb-8 relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-rose-500/30">
              <EyeOff className="h-9 w-9 text-white" strokeWidth={1.5} />
            </div>
            {/* Glow */}
            <div className="absolute -inset-2 bg-rose-500/20 rounded-3xl blur-xl -z-10" />
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            No bio was found
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-slate-400 text-base mb-10 max-w-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            This creator profile doesn&apos;t exist yet. Want to create your own Lovebite bio page?
          </motion.p>

          {/* Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* Primary CTA - Create */}
            <motion.a
              href="https://www.lovebite.fans/#contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-[15px] shadow-xl shadow-rose-500/25"
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(244, 63, 94, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="h-4 w-4" />
              Create Your Bio
            </motion.a>

            {/* Secondary CTA - Visit Lovebite */}
            <motion.a
              href="https://www.lovebite.fans/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-slate-700 text-slate-300 font-medium text-[15px] hover:bg-slate-800/50 hover:border-slate-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Visit Lovebite
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>

          {/* Footer text */}
          <motion.p 
            className="mt-12 text-slate-600 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Powered by <span className="text-rose-500 font-medium">Lovebite</span>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Profile data from creator
  const PROFILE_IMG = creator.profileImage;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Handle age verification - no persistence, shows every time
  const handleAgeConfirm = () => {
    setAgeVerified(true);
  };

  const handleAgeReject = () => {
    window.location.href = 'https://google.com';
  };

  // Handle "Join me" click - redirect to primary link
  const handleJoinMe = () => {
    window.location.href = creator.primaryLink;
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    const title = `${creator.name} - ${creator.tagline}`;
    
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <>
    <div className="min-h-screen font-sans text-slate-900 selection:bg-rose-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background Ambience - Desktop Blurred Image */}
      <motion.div 
        className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[60px] opacity-60 scale-110"
          style={{ backgroundImage: `url(${PROFILE_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 via-white/20 to-rose-100/50" />
      </motion.div>

      <div className="relative z-10 flex min-h-screen flex-col items-center py-8 px-4 sm:py-12">
        {/* Main Card Container */}
        <motion.main 
          className="w-full max-w-[480px] space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Top Profile Section - 3D Card Effect */}
          <motion.div 
            variants={itemVariants}
            className="perspective-1000"
            style={{ perspective: 1000 }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative overflow-hidden rounded-[32px] bg-white shadow-xl shadow-rose-900/5 ring-1 ring-white/50 will-change-transform"
            >
            
            {/* Share Button */}
            <motion.button 
              onClick={handleShare}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-600 shadow-sm hover:bg-white hover:text-rose-500"
              aria-label="Share profile"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="share"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Profile Image & Overlay */}
            <div className="relative aspect-[4/5] w-full bg-slate-200 overflow-hidden">
              <motion.img 
                src={PROFILE_IMG}
                alt={`${creator.name} Profile`}
                className="h-full w-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-100 via-transparent to-transparent opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF0F5] via-transparent to-transparent opacity-80" />

              {/* Text Content */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-6 pb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h1 className="text-[26px] font-bold tracking-tight text-slate-900 drop-shadow-sm">
                  {creator.tagline}
                </h1>
                <p className="mt-1 text-[15px] font-medium text-slate-600">
                  {creator.subtitle}
                </p>
                
                {/* Social Icons */}
                <div className="mt-4 flex items-center gap-5">
                  {creator.socialLinks.x && (
                    <motion.a
                      href={creator.socialLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700"
                      whileHover={{ scale: 1.2, color: "#000000" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="sr-only">X</span>
                      <XIcon className="h-5 w-5" />
                    </motion.a>
                  )}
                  {creator.socialLinks.reddit && (
                    <motion.a
                      href={creator.socialLinks.reddit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700"
                      whileHover={{ scale: 1.2, color: "#FF4500" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="sr-only">Reddit</span>
                      <RedditIcon className="h-6 w-6" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </div>
            </motion.div>
          </motion.div>

          {/* Welcome Card - Dark Theme */}
          <motion.div 
            className="overflow-hidden rounded-2xl bg-[#2E0916] p-6 text-center text-white shadow-xl ring-1 ring-white/10 relative"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none" />
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300/90 relative z-10">
              {creator.welcomeTitle}
            </p>
            <p className="text-[15px] leading-relaxed text-rose-50/90 font-medium relative z-10">
              {creator.welcomeText}
            </p>
          </motion.div>

          {/* Links List */}
          <div className="space-y-3">
            {creator.links.map((link, index) => (
              <motion.button
                key={link.id}
                onClick={() => handleLinkClick(link.href)}
                className="group block w-full text-left cursor-pointer"
                variants={itemVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
              >
                <motion.div 
                  className="relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/60 bg-white/80 backdrop-blur-md p-2"
                  variants={linkHoverVariants}
                >
                  {/* Hover glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-rose-100/0 via-rose-100/50 to-rose-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  {/* Icon / Image Box */}
                  <motion.div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 shadow-inner overflow-hidden relative z-10"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    {link.img ? (
                      <img
                        src={link.img}
                        alt={link.label}
                        className="h-10 w-10 rounded-md object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      getLinkIcon(link.iconType, link.iconColor)
                    )}
                  </motion.div>

                  {/* Text Content */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center py-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                        {link.label}
                      </span>
                      {link.pill && (
                        <motion.span 
                          className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide relative", link.pillColor || "bg-rose-100 text-rose-600")}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {/* Pulse ring for VIP badge */}
                          <span className="absolute inset-0 rounded-full bg-sky-400/30 animate-pulse-ring" />
                          <span className="relative z-10">{link.pill}</span>
                        </motion.span>
                      )}
                    </div>
                    {link.sub && (
                      <span className="truncate text-xs text-slate-500 font-medium group-hover:text-rose-500/80 transition-colors">
                        {link.sub}
                      </span>
                    )}
                  </div>

                  {/* Arrow indicator on hover */}
                  <motion.div
                    className="absolute right-3 opacity-0 group-hover:opacity-100"
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                  >
                    <ArrowRight className="h-4 w-4 text-rose-400" />
                  </motion.div>
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Bottom Gallery Image */}
          {creator.galleryImage && (
            <motion.div 
              className="overflow-hidden rounded-[32px] bg-white shadow-lg ring-1 ring-white/50"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <motion.img 
                  src={creator.galleryImage}
                  alt={`${creator.name} Gallery`}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Lovebite Badge - Create your bio */}
          <motion.a
            href="https://www.lovebite.fans/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-sm shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-[12px] font-medium text-slate-300">
                Create your bio with
              </span>
              <span className="text-[12px] font-bold text-white">
                Lovebite
              </span>
            </div>
          </motion.a>

          {/* Spacer for bottom bar */}
          <div className="h-24" />
        </motion.main>
      </div>

      {/* Floating Chat Toggle Button */}
      <AnimatePresence>
        {!bannerVisible && (
          <motion.button
            onClick={() => setBannerVisible(true)}
            className="fixed bottom-5 right-5 z-50 will-change-transform"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Glow effect - static, no animation */}
            <div className="absolute -inset-1 rounded-full bg-rose-500/20 blur-md" />
            {/* Avatar */}
            <div className="relative h-14 w-14 rounded-full ring-2 ring-rose-500 overflow-hidden">
              <img 
                src={PROFILE_IMG} 
                alt="Chat with me"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticky Bottom CTA Bar - Single Button */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div 
            className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="pointer-events-auto flex items-center gap-2">
              {/* Main CTA Button - redirects to OnlyFans */}
              <motion.button
                onClick={handleJoinMe}
                className="relative flex items-center gap-3 rounded-full bg-[#1a1a1a] py-1.5 pl-1.5 pr-4 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Subtle glow effect */}
                <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-rose-500/20 via-rose-500/10 to-rose-500/20 blur-sm opacity-60" />
                
                {/* Content */}
                <div className="relative flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-rose-500 shrink-0">
                    <img 
                      src={PROFILE_IMG} 
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Text + Arrow */}
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-white">Join me</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.button>

              {/* Close button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setBannerVisible(false);
                }}
                className="flex items-center justify-center h-6 w-6 text-slate-500 hover:text-slate-300 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Age Verification Overlay - Always in DOM, visibility controlled by CSS */}
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center px-4",
        ageVerified 
          ? "opacity-0 pointer-events-none transition-opacity duration-300" 
          : "opacity-100"
      )}
      aria-hidden={ageVerified}
    >
      {/* Glass backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Icon */}
        <div className="mb-6">
          <EyeOff className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
        </div>
        
        {/* Title */}
        <h1 className="text-[22px] font-semibold text-white mb-3">
          Sensitive Content
        </h1>
        
        {/* Description */}
        <p className="text-[15px] text-slate-400 mb-6 leading-relaxed">
          Confirm that you are of legal age to view this content.
        </p>
        
        {/* Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={handleAgeConfirm}
            className="w-full py-3 px-6 rounded-full border border-slate-600 text-white text-[14px] font-semibold hover:bg-white/10 transition-colors"
          >
            I am 18 or older
          </button>
          
          <button
            onClick={handleAgeReject}
            className="w-full py-3 px-6 text-white text-[14px] font-semibold hover:text-slate-300 transition-colors"
          >
            I am under 18
          </button>
        </div>
      </div>
    </div>
    </>
  );
}