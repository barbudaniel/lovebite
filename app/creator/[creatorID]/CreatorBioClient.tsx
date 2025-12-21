"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { trackBioLinkClick, trackBioPageView } from '@/components/analytics/google-analytics';
import { 
  Share2, 
  ArrowRight, 
  Crown, 
  Video, 
  Footprints, 
  Heart, 
  Check,
  X,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreatorProfile } from '@/lib/creators';

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

// Instagram icon
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
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
// PROPS INTERFACE
// ============================================

interface CreatorBioClientProps {
  creator: CreatorProfile;
}

// ============================================
// MAIN CLIENT COMPONENT
// ============================================

// Get or create visitor ID for tracking
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let visitorId = localStorage.getItem('lb_visitor_id');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('lb_visitor_id', visitorId);
  }
  return visitorId;
}

// Track analytics to our backend
async function trackAnalytics(data: {
  type: 'page_view' | 'link_click';
  bioLinkId?: string;
  linkItemId?: string;
  linkLabel?: string;
  linkUrl?: string;
  creatorSlug: string;
}) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        visitorId: getVisitorId(),
        referrer: document.referrer || null,
      }),
    });
  } catch (e) {
    // Silent fail for analytics
  }
}

export default function CreatorBioClient({ creator }: CreatorBioClientProps) {
  const [copied, setCopied] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  // Track page view on mount
  useEffect(() => {
    // Track to Google Analytics
    trackBioPageView(creator.id);
    
    // Track to our backend (always track - API will resolve bioLinkId from slug if needed)
    trackAnalytics({
      type: 'page_view',
      bioLinkId: (creator as any).bioLinkId,
      creatorSlug: creator.id,
    });
  }, [creator.id]);

  // 3D Card Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 40 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 40 });

  // Profile data
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

  // Handle "Join me" click - open primary link in new tab
  const handleJoinMe = () => {
    window.open(creator.primaryLink, '_blank', 'noopener,noreferrer');
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

  const handleLinkClick = (link: { id?: string; label: string; href: string }) => {
    // Track to Google Analytics
    trackBioLinkClick(creator.id, link.label, link.href);
    
    // Track to our backend (always track - API will resolve bioLinkId from slug if needed)
    trackAnalytics({
      type: 'link_click',
      bioLinkId: (creator as any).bioLinkId,
      linkItemId: link.id,
      linkLabel: link.label,
      linkUrl: link.href,
      creatorSlug: creator.id,
    });
    
    window.open(link.href, '_blank', 'noopener,noreferrer');
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
                className="h-full w-full object-cover object-top"
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
                  {creator.socialLinks.instagram && (
                    <motion.a
                      href={creator.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700"
                      whileHover={{ scale: 1.2, color: "#E4405F" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="sr-only">Instagram</span>
                      <InstagramIcon className="h-5 w-5" />
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
                onClick={() => handleLinkClick({ id: link.id, label: link.label, href: link.href })}
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
                className="h-full w-full object-cover object-top"
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
    {/* Using inert attribute instead of aria-hidden to properly prevent focus when hidden */}
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center px-4",
        ageVerified 
          ? "opacity-0 pointer-events-none transition-opacity duration-300" 
          : "opacity-100"
      )}
      // @ts-expect-error - inert is valid HTML attribute but not yet in React types
      inert={ageVerified ? true : undefined}
      aria-modal={!ageVerified}
      role="dialog"
      aria-labelledby="age-verify-title"
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
        <h1 id="age-verify-title" className="text-[22px] font-semibold text-white mb-3">
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

