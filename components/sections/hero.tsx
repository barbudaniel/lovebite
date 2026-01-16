"use client";

import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Check, 
  ChevronDown, 
  Image as ImageIcon, 
  Video, 
  Link2, 
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  BarChart3,
  Search,
  Bell,
  Home,
  Grid3X3,
  Upload,
  User,
  MoreHorizontal,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";

// Media collection data
const mediaCollections = [
  {
    id: 1,
    title: "Outdoor Party",
    images: [
      "/homepage/Alison_Homeparty.png",
      "/homepage/Alison_Night.png", 
      "/homepage/Alison_Playground.png",
      "/homepage/Alison_Skatepark.png",
    ],
    moreCount: 13,
    date: "2 days ago",
    tags: ["Outdoor", "Lifestyle", "Mood"],
    photoCount: 14,
    videoCount: 2,
    platforms: {
      instagram: { published: true, likes: 2847, comments: 156, views: 12400 },
      tiktok: { published: true, likes: 8932, comments: 423, views: 45200 },
      twitter: { published: false, likes: 0, comments: 0, views: 0 },
      onlyfans: { published: true, likes: 1203, comments: 89, views: 3200 },
    }
  },
  {
    id: 2,
    title: "Day trip: Coffee",
    images: [
      "/homepage/Alison_Italy.png",
      "/homepage/Alison_Collage.png",
      "/homepage/Alison_Playground.png",
      "/homepage/Alison_Night.png",
    ],
    moreCount: 8,
    date: "5 days ago",
    tags: ["Outdoor", "Nature", "Style"],
    photoCount: 9,
    videoCount: 1,
    platforms: {
      instagram: { published: true, likes: 1923, comments: 98, views: 8700 },
      tiktok: { published: false, likes: 0, comments: 0, views: 0 },
      twitter: { published: true, likes: 342, comments: 28, views: 2100 },
      onlyfans: { published: false, likes: 0, comments: 0, views: 0 },
    }
  }
];

// Platform icons and colors
const platformConfig = {
  instagram: { 
    name: "Instagram", 
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
    icon: (
      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  tiktok: { 
    name: "TikTok", 
    color: "bg-black",
    icon: (
      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    )
  },
  twitter: { 
    name: "X", 
    color: "bg-black",
    icon: (
      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  onlyfans: { 
    name: "Other", 
    color: "bg-[#00AFF0]",
    icon: (
      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" fill="none"/>
        <circle cx="12" cy="12" r="6" strokeWidth="2" stroke="currentColor" fill="none"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    )
  },
};

// Format large numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Mobile App Collection Card - More compact and app-like
function MobileCollectionCard({ collection, index }: { collection: typeof mediaCollections[0], index: number }) {
  const totalEngagement = Object.values(collection.platforms).reduce((acc, p) => ({
    likes: acc.likes + p.likes,
    comments: acc.comments + p.comments,
    views: acc.views + p.views,
  }), { likes: 0, comments: 0, views: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="flex-shrink-0 w-[200px] bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100"
    >
      {/* Image Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-1 mb-2">
        {collection.images.slice(0, 4).map((src, i) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden relative">
            <Image
              src={src}
              alt={`${collection.title} ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {i === 3 && collection.moreCount > 0 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-white text-sm font-bold">+{collection.moreCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Title & Date */}
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="font-semibold text-slate-900 text-xs truncate max-w-[100px]">
          {collection.title}
        </h3>
        <span className="text-[9px] text-slate-400">{collection.date}</span>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1 mb-2 overflow-hidden">
        {collection.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="px-1.5 py-0.5 bg-slate-100 rounded text-[8px] font-medium text-slate-500">
            {tag}
          </span>
        ))}
        {collection.tags.length > 2 && (
          <span className="text-[8px] text-slate-400">+{collection.tags.length - 2}</span>
        )}
      </div>

      {/* Platform Toggles */}
      <div className="flex items-center gap-0.5 mb-2">
        {Object.entries(collection.platforms).map(([platform, data]) => {
          const config = platformConfig[platform as keyof typeof platformConfig];
          return (
            <div
              key={platform}
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                data.published ? config.color : 'bg-slate-200'
              }`}
            >
              <div className={`${data.published ? '' : 'grayscale opacity-50'}`}>
                {config.icon}
              </div>
            </div>
          );
        })}
        <span className="ml-auto text-[8px] text-slate-400">
          {Object.values(collection.platforms).filter(p => p.published).length}/4
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-[9px] text-slate-500">
            <ImageIcon className="w-2.5 h-2.5" />
            {collection.photoCount}
          </span>
          <span className="flex items-center gap-0.5 text-[9px] text-slate-500">
            <Video className="w-2.5 h-2.5" />
            {collection.videoCount}
          </span>
        </div>
        <span className="flex items-center gap-0.5 text-[9px] text-green-600 font-medium">
          <TrendingUp className="w-2.5 h-2.5" />
          {formatNumber(totalEngagement.views)}
        </span>
      </div>
    </motion.div>
  );
}

// Desktop Media Collection Card Component
function MediaCollectionCard({ collection, index }: { collection: typeof mediaCollections[0], index: number }) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const totalEngagement = Object.values(collection.platforms).reduce((acc, p) => ({
    likes: acc.likes + p.likes,
    comments: acc.comments + p.comments,
    views: acc.views + p.views,
  }), { likes: 0, comments: 0, views: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.15 }}
      className="bg-brand-50/50 rounded-2xl p-3 sm:p-4 border border-brand-100/50"
    >
      {/* Image Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3">
        {collection.images.slice(0, 4).map((src, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src={src}
              alt={`${collection.title} ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {i === 3 && collection.moreCount > 0 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  +{collection.moreCount}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Title & Date Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[150px]">
            {collection.title}
          </h3>
          <Link2 className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-brand-500 transition-colors" />
        </div>
        <span className="text-[10px] sm:text-xs text-slate-500">{collection.date}</span>
      </div>

      {/* Tags Row */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {collection.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 bg-white rounded-full text-[10px] sm:text-xs font-medium text-slate-600 border border-slate-200"
          >
            {tag}
          </span>
        ))}
        <button className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors">
          <Plus className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Platform Publishing Toggles */}
      <div className="flex items-center gap-1 mb-3">
        {Object.entries(collection.platforms).map(([platform, data]) => {
          const config = platformConfig[platform as keyof typeof platformConfig];
          return (
            <div
              key={platform}
              className="relative"
              onMouseEnter={() => setActiveTooltip(platform)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                  data.published ? config.color : 'bg-slate-200 grayscale'
                }`}
              >
                {config.icon}
              </motion.button>
              
              {activeTooltip === platform && data.published && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white rounded-lg p-2 text-[10px] whitespace-nowrap z-20 shadow-xl"
                >
                  <p className="font-medium mb-1">{config.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-2.5 h-2.5" /> {formatNumber(data.likes)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-2.5 h-2.5" /> {formatNumber(data.comments)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" /> {formatNumber(data.views)}
                    </span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </motion.div>
              )}
            </div>
          );
        })}
        
        <span className="ml-auto text-[9px] sm:text-[10px] text-slate-500">
          {Object.values(collection.platforms).filter(p => p.published).length}/4 published
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-600 text-xs">
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="font-medium">{collection.photoCount}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-600 text-xs">
            <Video className="w-3.5 h-3.5" />
            <span className="font-medium">{collection.videoCount}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span>{formatNumber(totalEngagement.views)} views</span>
        </div>
      </div>
    </motion.div>
  );
}

// Mobile App Preview Component - Shows inside a phone frame
function MobileAppPreview() {
  const totalStats = mediaCollections.reduce((acc, col) => {
    const colTotal = Object.values(col.platforms).reduce((a, p) => ({
      likes: a.likes + p.likes,
      views: a.views + p.views,
    }), { likes: 0, views: 0 });
    return {
      likes: acc.likes + colTotal.likes,
      views: acc.views + colTotal.views,
      photos: acc.photos + col.photoCount,
    };
  }, { likes: 0, views: 0, photos: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="relative w-full max-w-[280px] mx-auto lg:hidden"
    >
      {/* Phone Frame */}
      <div className="relative bg-slate-900 rounded-[40px] p-2 shadow-2xl shadow-slate-900/30">
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-20" />
        
        {/* Screen */}
        <div className="relative bg-slate-50 rounded-[32px] overflow-hidden">
          {/* Status Bar */}
          <div className="bg-slate-50 px-6 pt-10 pb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-3.5 h-3.5 text-slate-900" />
              <Wifi className="w-3.5 h-3.5 text-slate-900" />
              <Battery className="w-5 h-3.5 text-slate-900" />
            </div>
          </div>
          
          {/* App Header */}
          <div className="px-4 pb-3 bg-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Heart Logo */}
                <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Lovdash</p>
                  <p className="text-[10px] text-slate-500">Your media hub</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full border-2 border-slate-50" />
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">A</span>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Search collections...</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="px-4 py-3 bg-white border-y border-slate-100">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900">{totalStats.photos}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wide">Photos</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-lg font-bold text-brand-500">{formatNumber(totalStats.views)}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wide">Views</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900">{formatNumber(totalStats.likes)}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wide">Likes</p>
              </div>
            </div>
          </div>

          {/* Section Header */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-900">Recent Collections</p>
            <button className="flex items-center gap-0.5 text-[10px] font-medium text-brand-500">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          {/* Collections Scroll - Horizontal */}
          <div className="px-4 pb-4 flex gap-3 overflow-x-auto scrollbar-hide">
            {mediaCollections.map((collection, i) => (
              <MobileCollectionCard key={collection.id} collection={collection} index={i} />
            ))}
            {/* Add New Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex-shrink-0 w-[100px] bg-slate-100 rounded-2xl p-2.5 flex flex-col items-center justify-center border-2 border-dashed border-slate-300"
            >
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-medium text-slate-600 text-center">Add Collection</span>
            </motion.div>
          </div>
          
          {/* AI Summary Card */}
          <div className="mx-4 mb-4 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-3 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">AI Insights</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              Your "Outdoor Party" collection is performing 23% better than usual. Consider posting more lifestyle content!
            </p>
          </div>
          
          {/* Bottom Navigation */}
          <div className="bg-white border-t border-slate-100 px-6 py-2 pb-6 flex items-center justify-around">
            <button className="flex flex-col items-center gap-0.5">
              <Home className="w-5 h-5 text-brand-500" />
              <span className="text-[8px] font-medium text-brand-500">Home</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <Grid3X3 className="w-5 h-5 text-slate-400" />
              <span className="text-[8px] text-slate-400">Library</span>
            </button>
            <button className="relative -mt-4">
              <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Upload className="w-5 h-5 text-white" />
              </div>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              <span className="text-[8px] text-slate-400">Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-0.5">
              <User className="w-5 h-5 text-slate-400" />
              <span className="text-[8px] text-slate-400">Profile</span>
            </button>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-900 rounded-full" />
        </div>
      </div>
      
      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute -top-3 -right-3 bg-white rounded-full px-2.5 py-1 shadow-lg border border-slate-200 flex items-center gap-1.5"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-medium text-slate-700">Live Preview</span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [0, 1], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const totalStats = mediaCollections.reduce((acc, col) => {
    const colTotal = Object.values(col.platforms).reduce((a, p) => ({
      likes: a.likes + p.likes,
      comments: a.comments + p.comments,
      views: a.views + p.views,
    }), { likes: 0, comments: 0, views: 0 });
    return {
      likes: acc.likes + colTotal.likes,
      comments: acc.comments + colTotal.comments,
      views: acc.views + colTotal.views,
      photos: acc.photos + col.photoCount,
      videos: acc.videos + col.videoCount,
    };
  }, { likes: 0, comments: 0, views: 0, photos: 0, videos: 0 });

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] flex flex-col items-center justify-center pt-14 lg:pt-[72px] pb-20 lg:pb-0 overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ x: parallaxX, y: parallaxY }}
          className="absolute -top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-200/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ x: useTransform(parallaxX, v => -v * 0.5), y: useTransform(parallaxY, v => -v * 0.5) }}
          className="absolute -bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-100/40 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 lg:py-12">
          
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6">
              Your media.
              <br />
              <span className="text-brand-500">Every platform.</span>
              <br />
              <span className="text-slate-700">Easy for everyone.</span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed px-4"
          >
            Upload once, publish everywhere, track what works.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 h-14 text-base rounded-full shadow-lg shadow-emerald-500/25 font-semibold"
              >
                <Link href="/join">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-8 h-14 text-base rounded-full font-semibold"
              >
                <Link href="/contact?type=demo">
                  <span>Book a Demo</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 sm:gap-6 justify-center text-sm text-slate-500 mb-6"
          >
            {[
              { icon: Shield, text: "Privacy-first" },
              { icon: Sparkles, text: "AI-powered" },
              { icon: Check, text: "Multi-platform" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2">
                <badge.icon className="w-4 h-4 text-brand-500" />
                <span>{badge.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Social Proof Platform Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full max-w-3xl mx-auto mb-8"
          >
            {/* Platform Logos */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 mb-4">
              {/* OnlyFans */}
              <div className="group cursor-pointer transition-all duration-300">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" className="text-[#00AFF0]" strokeWidth="2" stroke="currentColor" fill="none"/>
                  <circle cx="12" cy="12" r="6" className="text-[#00AFF0]" strokeWidth="2" stroke="currentColor" fill="none"/>
                  <circle cx="12" cy="12" r="2" className="text-[#00AFF0]" fill="currentColor"/>
                </svg>
                <span className="sr-only">OnlyFans</span>
              </div>

              {/* Fansly */}
              <div className="group cursor-pointer transition-all duration-300">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path className="text-[#1FA3F3]" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <span className="sr-only">Fansly</span>
              </div>

              {/* LoyalFans */}
              <div className="group cursor-pointer transition-all duration-300">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path className="text-[#FF5722]" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="sr-only">LoyalFans</span>
              </div>

              {/* X/Twitter */}
              <div className="group cursor-pointer transition-all duration-300">
                <svg
                  className="w-5 h-5 sm:w-7 sm:h-7 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path className="text-black" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="sr-only">X / Twitter</span>
              </div>

              {/* Instagram */}
              <div className="group cursor-pointer transition-all duration-300">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path className="text-[#E4405F]" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="sr-only">Instagram</span>
              </div>
            </div>

            {/* Stat Counters */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
              <span className="font-semibold text-slate-700">500+ Creators</span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-700">50K+ Media Organized</span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-700">$2M+ Revenue Tracked</span>
            </div>
          </motion.div>
        </div>

        {/* Mobile App Preview - Only on mobile/tablet */}
        <MobileAppPreview />

        {/* Desktop Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative w-full max-w-5xl mx-auto hidden lg:block"
          style={{ 
            x: useTransform(parallaxX, v => v * 0.3), 
            y: useTransform(parallaxY, v => v * 0.3) 
          }}
        >
          {/* Dashboard Preview Card */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
            {/* Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-xs text-slate-400">Lovdash — Media Library</span>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-6">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Media Library</p>
                    <p className="text-xs text-slate-500">Organized by AI • Multi-platform ready</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Synced
                  </motion.div>
                </div>
              </div>
              
              {/* Media Collections Grid */}
              <div className="grid grid-cols-2 gap-4">
                {mediaCollections.map((collection, i) => (
                  <MediaCollectionCard key={collection.id} collection={collection} index={i} />
                ))}
              </div>
              
              {/* AI Tags Row */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500 mr-2">AI Tags:</span>
                {["Auto-tagged", "Smart descriptions", "Ready to post"].map((tag, i) => (
                  <span 
                    key={tag}
                    className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                      i === 0 ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Stats Card - Left */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.9 }}
            className="absolute -bottom-6 -left-10 bg-white rounded-xl p-4 border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Engagement</p>
                <p className="text-lg font-bold text-slate-900">{formatNumber(totalStats.views)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="text-center">
                <Heart className="w-3.5 h-3.5 text-red-400 mx-auto mb-0.5" />
                <p className="text-xs font-semibold text-slate-900">{formatNumber(totalStats.likes)}</p>
              </div>
              <div className="text-center">
                <MessageCircle className="w-3.5 h-3.5 text-blue-400 mx-auto mb-0.5" />
                <p className="text-xs font-semibold text-slate-900">{formatNumber(totalStats.comments)}</p>
              </div>
              <div className="text-center">
                <Share2 className="w-3.5 h-3.5 text-purple-400 mx-auto mb-0.5" />
                <p className="text-xs font-semibold text-slate-900">{totalStats.photos + totalStats.videos}</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Platform Stats Card - Right */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute -top-6 -right-8 bg-white rounded-xl p-4 border border-slate-200 shadow-xl"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Published to</p>
            <div className="flex flex-col gap-2">
              {Object.entries(platformConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full ${config.color} flex items-center justify-center`}>
                    {config.icon}
                  </div>
                  <span className="text-xs text-slate-700">{config.name}</span>
                  <Check className="w-3 h-3 text-green-500 ml-auto" />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden lg:flex flex-col items-center justify-center py-6"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </motion.div>
          <span className="text-xs text-slate-400 mt-2">Discover Lovdash</span>
        </motion.div>
      </div>

      {/* Bottom gradient fade for mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent lg:hidden pointer-events-none" />
    </section>
  );
}
