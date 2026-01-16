"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Navigation, Footer } from "@/components/sections";
import { PlatformLogosRow } from "@/components/ui/platform-logos";
import { 
  Zap,
  ArrowRight,
  Sparkles,
  Quote,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// LINE ILLUSTRATIONS
// ============================================

function MediaLibraryIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="20" y="20" width="160" height="100" rx="8" className="stroke-slate-300" strokeWidth="1.5" fill="none" />
      <path d="M20 45 L180 45" className="stroke-slate-200" strokeWidth="1" />
      <rect x="30" y="55" width="35" height="10" rx="2" className="fill-blue-100 stroke-blue-300" strokeWidth="1" />
      <rect x="30" y="70" width="35" height="10" rx="2" className="fill-slate-100 stroke-slate-200" strokeWidth="1" />
      <rect x="30" y="85" width="35" height="10" rx="2" className="fill-slate-100 stroke-slate-200" strokeWidth="1" />
      <rect x="75" y="55" width="28" height="28" rx="4" className="fill-blue-50 stroke-blue-200" strokeWidth="1" />
      <rect x="108" y="55" width="28" height="28" rx="4" className="fill-violet-50 stroke-violet-200" strokeWidth="1" />
      <rect x="141" y="55" width="28" height="28" rx="4" className="fill-pink-50 stroke-pink-200" strokeWidth="1" />
      <rect x="75" y="88" width="28" height="20" rx="4" className="fill-emerald-50 stroke-emerald-200" strokeWidth="1" />
      <rect x="108" y="88" width="28" height="20" rx="4" className="fill-amber-50 stroke-amber-200" strokeWidth="1" />
      <circle cx="122" cy="69" r="6" className="fill-violet-200" />
      <path d="M120 66 L126 69 L120 72 Z" className="fill-violet-500" />
      <circle cx="84" cy="65" r="4" className="fill-blue-300" />
      <path d="M78 78 L84 72 L90 78" className="stroke-blue-300" strokeWidth="1.5" fill="none" />
      <circle cx="155" cy="30" r="8" className="fill-blue-500" />
      <path d="M155 26 L155 34 M151 30 L155 26 L159 30" className="stroke-white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function AITaggingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="20" y="20" width="90" height="100" rx="8" className="stroke-slate-300" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="12" className="fill-violet-100 stroke-violet-300" strokeWidth="1" />
      <path d="M30 90 L50 65 L75 90" className="stroke-violet-300" strokeWidth="1.5" fill="none" />
      <path d="M60 90 L80 75 L100 90" className="stroke-violet-200" strokeWidth="1.5" fill="none" />
      <circle cx="145" cy="45" r="20" className="stroke-violet-400" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
      <circle cx="145" cy="45" r="12" className="fill-violet-100 stroke-violet-300" strokeWidth="1" />
      <path d="M140 42 Q145 38 150 42 M140 48 Q145 52 150 48" className="stroke-violet-500" strokeWidth="1.5" fill="none" />
      <path d="M110 50 L120 50" className="stroke-violet-300" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="115" cy="50" r="2" className="fill-violet-400" />
      <rect x="120" y="75" width="55" height="14" rx="7" className="fill-violet-100 stroke-violet-300" strokeWidth="1" />
      <rect x="120" y="93" width="40" height="14" rx="7" className="fill-pink-100 stroke-pink-300" strokeWidth="1" />
      <rect x="120" y="111" width="50" height="14" rx="7" className="fill-blue-100 stroke-blue-300" strokeWidth="1" />
      <path d="M165 25 L167 30 L172 30 L168 34 L170 39 L165 36 L160 39 L162 34 L158 30 L163 30 Z" className="fill-amber-400" />
    </svg>
  );
}

function SchedulingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="25" y="25" width="150" height="95" rx="8" className="stroke-slate-300" strokeWidth="1.5" fill="none" />
      <path d="M25 50 L175 50" className="stroke-slate-200" strokeWidth="1" />
      <rect x="70" y="32" width="60" height="12" rx="2" className="fill-emerald-100" />
      {[0, 1, 2, 3, 4, 5, 6].map((col) => (
        <g key={col}>
          {[0, 1, 2].map((row) => (
            <rect 
              key={`${col}-${row}`}
              x={35 + col * 20} 
              y={58 + row * 18} 
              width="16" 
              height="14" 
              rx="2" 
              className={
                (col === 2 && row === 0) ? "fill-emerald-500" :
                (col === 4 && row === 1) ? "fill-violet-500" :
                (col === 1 && row === 2) ? "fill-pink-500" :
                "fill-slate-50 stroke-slate-200"
              }
              strokeWidth="1" 
            />
          ))}
        </g>
      ))}
      <circle cx="155" cy="65" r="3" className="fill-emerald-400" />
      <circle cx="155" cy="80" r="3" className="fill-violet-400" />
      <circle cx="155" cy="95" r="3" className="fill-pink-400" />
      <path d="M160 65 L170 65" className="stroke-slate-300" strokeWidth="1" />
      <path d="M160 80 L168 80" className="stroke-slate-300" strokeWidth="1" />
      <path d="M160 95 L172 95" className="stroke-slate-300" strokeWidth="1" />
      <circle cx="165" cy="35" r="8" className="stroke-emerald-400" strokeWidth="1.5" fill="white" />
      <path d="M165 31 L165 35 L168 37" className="stroke-emerald-500" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function AnalyticsIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="20" y="20" width="160" height="100" rx="8" className="stroke-slate-300" strokeWidth="1.5" fill="none" />
      <rect x="35" y="85" width="12" height="25" rx="2" className="fill-amber-200 stroke-amber-400" strokeWidth="1" />
      <rect x="52" y="70" width="12" height="40" rx="2" className="fill-amber-300 stroke-amber-400" strokeWidth="1" />
      <rect x="69" y="55" width="12" height="55" rx="2" className="fill-amber-400 stroke-amber-500" strokeWidth="1" />
      <rect x="86" y="65" width="12" height="45" rx="2" className="fill-amber-300 stroke-amber-400" strokeWidth="1" />
      <rect x="103" y="50" width="12" height="60" rx="2" className="fill-amber-500 stroke-amber-600" strokeWidth="1" />
      <path d="M35 75 Q60 60, 85 55 T135 45" className="stroke-emerald-500" strokeWidth="2" fill="none" />
      <circle cx="135" cy="45" r="4" className="fill-emerald-500" />
      <rect x="130" y="25" width="40" height="20" rx="4" className="fill-emerald-100 stroke-emerald-300" strokeWidth="1" />
      <path d="M138 35 L145 30 L152 35" className="stroke-emerald-500" strokeWidth="1.5" fill="none" />
      <path d="M155 30 L163 30" className="stroke-emerald-400" strokeWidth="1" />
      <path d="M155 35 L160 35" className="stroke-emerald-300" strokeWidth="1" />
      <rect x="130" y="55" width="40" height="22" rx="3" className="fill-violet-50 stroke-violet-200" strokeWidth="1" />
      <rect x="130" y="82" width="40" height="22" rx="3" className="fill-pink-50 stroke-pink-200" strokeWidth="1" />
    </svg>
  );
}

function PublishingIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="70" y="45" width="60" height="50" rx="6" className="fill-white stroke-slate-300" strokeWidth="1.5" />
      <rect x="78" y="53" width="44" height="25" rx="3" className="fill-pink-50 stroke-pink-200" strokeWidth="1" />
      <rect x="78" y="82" width="20" height="6" rx="1" className="fill-slate-200" />
      <rect x="102" y="82" width="20" height="6" rx="1" className="fill-slate-100" />
      <circle cx="35" cy="40" r="16" className="fill-pink-100 stroke-pink-300" strokeWidth="1.5" />
      <circle cx="165" cy="40" r="16" className="fill-blue-100 stroke-blue-300" strokeWidth="1.5" />
      <circle cx="35" cy="100" r="16" className="fill-violet-100 stroke-violet-300" strokeWidth="1.5" />
      <circle cx="165" cy="100" r="16" className="fill-emerald-100 stroke-emerald-300" strokeWidth="1.5" />
      <path d="M50 50 L70 60" className="stroke-pink-300" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M150 50 L130 60" className="stroke-blue-300" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M50 90 L70 85" className="stroke-violet-300" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M150 90 L130 85" className="stroke-emerald-300" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M32 40 L35 43 L40 37" className="stroke-pink-500" strokeWidth="2" fill="none" />
      <path d="M162 40 L165 43 L170 37" className="stroke-blue-500" strokeWidth="2" fill="none" />
      <path d="M32 100 L35 103 L40 97" className="stroke-violet-500" strokeWidth="2" fill="none" />
      <path d="M162 100 L165 103 L170 97" className="stroke-emerald-500" strokeWidth="2" fill="none" />
      <circle cx="100" cy="70" r="8" className="fill-brand-500" />
      <path d="M96 70 L104 70 M101 67 L104 70 L101 73" className="stroke-white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function BioLinksIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="60" y="15" width="80" height="115" rx="12" className="stroke-slate-300" strokeWidth="1.5" fill="white" />
      <rect x="85" y="20" width="30" height="4" rx="2" className="fill-slate-200" />
      <circle cx="100" cy="45" r="12" className="fill-brand-100 stroke-brand-300" strokeWidth="1.5" />
      <rect x="80" y="62" width="40" height="6" rx="1" className="fill-slate-300" />
      <rect x="85" y="70" width="30" height="4" rx="1" className="fill-slate-200" />
      <rect x="70" y="80" width="60" height="14" rx="7" className="fill-pink-500" />
      <rect x="70" y="98" width="60" height="14" rx="7" className="fill-violet-500" />
      <rect x="70" y="116" width="60" height="8" rx="4" className="fill-slate-200" />
      <circle cx="40" cy="50" r="6" className="fill-pink-100 stroke-pink-300" strokeWidth="1" />
      <circle cx="160" cy="70" r="6" className="fill-violet-100 stroke-violet-300" strokeWidth="1" />
      <circle cx="45" cy="100" r="4" className="fill-brand-100 stroke-brand-300" strokeWidth="1" />
      <circle cx="155" cy="110" r="5" className="fill-emerald-100 stroke-emerald-300" strokeWidth="1" />
      <path d="M37 47 L43 53 M43 47 L37 53" className="stroke-pink-400" strokeWidth="1.5" />
      <path d="M157 67 L163 73 M163 67 L157 73" className="stroke-violet-400" strokeWidth="1.5" />
    </svg>
  );
}

function TeamAccessIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <path d="M100 25 L130 35 L130 70 Q130 95 100 110 Q70 95 70 70 L70 35 Z" className="fill-slate-50 stroke-slate-400" strokeWidth="1.5" />
      <path d="M90 65 L97 72 L112 57" className="stroke-emerald-500" strokeWidth="2.5" fill="none" />
      <circle cx="40" cy="55" r="14" className="fill-blue-100 stroke-blue-300" strokeWidth="1.5" />
      <circle cx="40" cy="50" r="5" className="fill-blue-300" />
      <path d="M30 68 Q40 62 50 68" className="stroke-blue-300" strokeWidth="1.5" fill="none" />
      <circle cx="160" cy="55" r="14" className="fill-violet-100 stroke-violet-300" strokeWidth="1.5" />
      <circle cx="160" cy="50" r="5" className="fill-violet-300" />
      <path d="M150 68 Q160 62 170 68" className="stroke-violet-300" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="105" r="12" className="fill-pink-100 stroke-pink-300" strokeWidth="1" />
      <circle cx="40" cy="101" r="4" className="fill-pink-300" />
      <path d="M32 115 Q40 110 48 115" className="stroke-pink-300" strokeWidth="1" fill="none" />
      <circle cx="160" cy="105" r="12" className="fill-emerald-100 stroke-emerald-300" strokeWidth="1" />
      <circle cx="160" cy="101" r="4" className="fill-emerald-300" />
      <path d="M152 115 Q160 110 168 115" className="stroke-emerald-300" strokeWidth="1" fill="none" />
      <path d="M54 55 L70 55" className="stroke-slate-300" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M146 55 L130 55" className="stroke-slate-300" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M52 100 L75 85" className="stroke-slate-300" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M148 100 L125 85" className="stroke-slate-300" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function AIAssistantIllustration() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="25" y="25" width="100" height="90" rx="8" className="stroke-slate-300" strokeWidth="1.5" fill="white" />
      <rect x="35" y="35" width="50" height="18" rx="9" className="fill-slate-100" />
      <rect x="55" y="58" width="60" height="18" rx="9" className="fill-violet-500" />
      <rect x="35" y="81" width="45" height="18" rx="9" className="fill-slate-100" />
      <circle cx="155" cy="70" r="28" className="fill-violet-50 stroke-violet-300" strokeWidth="1.5" />
      <circle cx="155" cy="70" r="18" className="fill-violet-100 stroke-violet-400" strokeWidth="1" />
      <circle cx="148" cy="66" r="3" className="fill-violet-500" />
      <circle cx="162" cy="66" r="3" className="fill-violet-500" />
      <path d="M148 76 Q155 82 162 76" className="stroke-violet-500" strokeWidth="1.5" fill="none" />
      <path d="M130 45 L133 52 L128 52 L131 60" className="stroke-amber-500" strokeWidth="1.5" fill="none" />
      <path d="M175 50 L178 55 L174 55 L176 62" className="stroke-amber-500" strokeWidth="1.5" fill="none" />
      <path d="M155 30 L155 38" className="stroke-violet-400" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M155 102 L155 115" className="stroke-violet-400" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M125 70 L127 70" className="stroke-violet-400" strokeWidth="2" />
      <circle cx="127" cy="70" r="2" className="fill-violet-400" />
      <rect x="138" y="105" width="34" height="16" rx="8" className="fill-emerald-500" />
    </svg>
  );
}

// ============================================
// USE CASE CARD COMPONENT
// ============================================

interface UseCase {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  metric?: {
    value: string;
    label: string;
  };
}

function UseCaseCard({ useCase, index }: { useCase: UseCase; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg hover:border-slate-300 transition-all"
    >
      {/* Quote */}
      <div className="flex gap-3 mb-4">
        <Quote className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
        <p className="text-slate-700 text-sm leading-relaxed italic">
          &ldquo;{useCase.quote}&rdquo;
        </p>
      </div>
      
      {/* Author */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
            {useCase.avatar}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{useCase.author}</p>
            <p className="text-slate-500 text-xs">{useCase.role}</p>
          </div>
        </div>
        
        {/* Metric */}
        {useCase.metric && (
          <div className="text-right">
            <p className="text-lg sm:text-xl font-bold text-emerald-600">{useCase.metric.value}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">{useCase.metric.label}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// FEATURE SECTION COMPONENT
// ============================================

interface FeatureSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  illustration: React.ComponentType;
  gradient: string;
  borderColor: string;
  hoverBorder: string;
  iconColor: string;
  useCases: UseCase[];
  reverse?: boolean;
}

function FeatureSectionBlock({ feature, index }: { feature: FeatureSection; index: number }) {
  const Illustration = feature.illustration;
  
  return (
    <section id={feature.id} className={`py-16 sm:py-24 ${index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${feature.reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Feature Card */}
          <motion.div
            initial={{ opacity: 0, x: feature.reverse ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={feature.reverse ? 'lg:order-2' : ''}
          >
            <Link
              href={feature.href}
              className={`group block ${feature.gradient} rounded-2xl sm:rounded-3xl border ${feature.borderColor} hover:${feature.hoverBorder} p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
            >
              {/* Illustration */}
              <div className="relative h-40 sm:h-52 mb-6 overflow-hidden rounded-xl bg-white/60">
                <Illustration />
              </div>
              
              {/* Content */}
              <div className="relative">
                <span className={`inline-block text-xs font-semibold ${feature.iconColor} uppercase tracking-wider mb-2`}>
                  {feature.subtitle}
                </span>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {feature.title}
                  </h2>
                  <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Use Cases */}
          <motion.div
            initial={{ opacity: 0, x: feature.reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`space-y-4 ${feature.reverse ? 'lg:order-1' : ''}`}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                What creators are saying
              </h3>
              <p className="text-sm text-slate-500">Real results from real users</p>
            </div>
            
            {feature.useCases.map((useCase, i) => (
              <UseCaseCard key={i} useCase={useCase} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FEATURES DATA
// ============================================

const featureSections: FeatureSection[] = [
  {
    id: "media-library",
    title: "Media Library",
    subtitle: "Organize Everything",
    description: "Upload, organize, and manage all your content in one place. Unlimited cloud storage with AI-powered auto-organization, duplicate detection, and lightning-fast search.",
    href: "/features/media-library",
    illustration: MediaLibraryIllustration,
    gradient: "bg-gradient-to-br from-blue-50 via-white to-blue-50/30",
    borderColor: "border-blue-200",
    hoverBorder: "border-blue-300",
    iconColor: "text-blue-600",
    useCases: [
      {
        quote: "I used to spend 2 hours a week just organizing files. Now Lovdash does it automatically. My entire library is searchable in seconds.",
        author: "Mia R.",
        role: "Content Creator • 45K followers",
        avatar: "MR",
        metric: { value: "10hrs", label: "saved weekly" }
      },
      {
        quote: "The duplicate detection alone has saved me from so many embarrassing reposts. Game changer for managing 5,000+ files.",
        author: "Luna Sky",
        role: "Independent Creator",
        avatar: "LS",
        metric: { value: "5,200+", label: "files organized" }
      },
    ],
  },
  {
    id: "ai-tagging",
    title: "AI-Powered Tagging",
    subtitle: "Smart Automation",
    description: "Our AI automatically analyzes your content and adds relevant tags, descriptions, and categories. Search semantically—find that beach photo even if you didn't tag it.",
    href: "/features/ai-tagging",
    illustration: AITaggingIllustration,
    gradient: "bg-gradient-to-br from-violet-50 via-white to-purple-50/30",
    borderColor: "border-violet-200",
    hoverBorder: "border-violet-300",
    iconColor: "text-violet-600",
    reverse: true,
    useCases: [
      {
        quote: "The AI understands my content better than I do. I searched 'sunset photos by the pool' and it found exactly what I needed from months ago.",
        author: "Jade M.",
        role: "Agency Talent • 120K subs",
        avatar: "JM",
        metric: { value: "98%", label: "accuracy" }
      },
      {
        quote: "No more manual tagging hundreds of photos. Upload, wait 30 seconds, and everything is categorized perfectly.",
        author: "Alex Chen",
        role: "Studio Manager",
        avatar: "AC",
        metric: { value: "30sec", label: "per batch" }
      },
    ],
  },
  {
    id: "scheduling",
    title: "Content Scheduling",
    subtitle: "Post Smarter",
    description: "Queue posts across all platforms with optimal timing recommendations. Bulk schedule a month of content in minutes, then relax while Lovdash handles the posting.",
    href: "/features/scheduling",
    illustration: SchedulingIllustration,
    gradient: "bg-gradient-to-br from-emerald-50 via-white to-teal-50/30",
    borderColor: "border-emerald-200",
    hoverBorder: "border-emerald-300",
    iconColor: "text-emerald-600",
    useCases: [
      {
        quote: "I schedule my entire month in one Sunday session. Best decision ever—my engagement actually went UP because I'm posting at optimal times.",
        author: "Sarah B.",
        role: "Full-time Creator",
        avatar: "SB",
        metric: { value: "+34%", label: "engagement" }
      },
      {
        quote: "Managing 8 creators was chaos before. Now I schedule everything in advance and our content never misses a beat.",
        author: "Marcus D.",
        role: "Agency Owner • 8 creators",
        avatar: "MD",
        metric: { value: "8", label: "creators managed" }
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics Dashboard",
    subtitle: "Track Everything",
    description: "Track engagement, revenue, and growth across all platforms in one unified, beautiful dashboard. Understand what's working and double down on success.",
    href: "/features/analytics",
    illustration: AnalyticsIllustration,
    gradient: "bg-gradient-to-br from-amber-50 via-white to-orange-50/30",
    borderColor: "border-amber-200",
    hoverBorder: "border-amber-300",
    iconColor: "text-amber-600",
    reverse: true,
    useCases: [
      {
        quote: "Finally seeing all my revenue in one place instead of logging into 4 different platforms. The weekly reports help me understand trends I was missing.",
        author: "Ava James",
        role: "Creator • Multi-platform",
        avatar: "AJ",
        metric: { value: "+47%", label: "revenue growth" }
      },
      {
        quote: "The content performance analytics showed me my best-performing types. I doubled down and my tips increased by 60% in a month.",
        author: "Ruby L.",
        role: "Independent Creator",
        avatar: "RL",
        metric: { value: "+60%", label: "in tips" }
      },
    ],
  },
  {
    id: "publishing",
    title: "Multi-Platform Publishing",
    subtitle: "Post Everywhere",
    description: "Post to OnlyFans, Fansly, Twitter, Instagram and more—all from one place. One click, every platform, with automatic formatting optimization.",
    href: "/features/publishing",
    illustration: PublishingIllustration,
    gradient: "bg-gradient-to-br from-pink-50 via-white to-rose-50/30",
    borderColor: "border-pink-200",
    hoverBorder: "border-pink-300",
    iconColor: "text-pink-600",
    useCases: [
      {
        quote: "I literally press one button and my content goes everywhere. What used to take 45 minutes now takes 45 seconds. I got my life back.",
        author: "Nina Rose",
        role: "Creator • 4 platforms",
        avatar: "NR",
        metric: { value: "45sec", label: "vs 45min" }
      },
      {
        quote: "The platform-specific formatting is chef's kiss. My Twitter posts look different from my OF posts, automatically.",
        author: "Kai W.",
        role: "Content Creator",
        avatar: "KW",
        metric: { value: "4+", label: "platforms" }
      },
    ],
  },
  {
    id: "bio-links",
    title: "Bio Links",
    subtitle: "One Link For All",
    description: "Create a beautiful, customizable link-in-bio page with custom domains, click analytics, and live status integration. Your digital hub.",
    href: "/bio",
    illustration: BioLinksIllustration,
    gradient: "bg-gradient-to-br from-brand-50 via-white to-pink-50/30",
    borderColor: "border-brand-200",
    hoverBorder: "border-brand-300",
    iconColor: "text-brand-600",
    reverse: true,
    useCases: [
      {
        quote: "My custom domain bio link converts 3x better than Linktree did. Plus I can see exactly which links are getting clicks.",
        author: "Sofia V.",
        role: "Creator • 85K followers",
        avatar: "SV",
        metric: { value: "3x", label: "conversions" }
      },
      {
        quote: "The live online status feature? My fans love knowing when I'm actually active. My DM response rate went through the roof.",
        author: "Emma K.",
        role: "Full-time Creator",
        avatar: "EK",
        metric: { value: "+120%", label: "DM opens" }
      },
    ],
  },
  {
    id: "team-access",
    title: "Team Access & Security",
    subtitle: "For Agencies",
    description: "Invite team members with role-based permissions. Perfect for agencies managing multiple creators with activity logs and secure credential sharing.",
    href: "/studio",
    illustration: TeamAccessIllustration,
    gradient: "bg-gradient-to-br from-slate-50 via-white to-slate-50/30",
    borderColor: "border-slate-200",
    hoverBorder: "border-slate-300",
    iconColor: "text-slate-600",
    useCases: [
      {
        quote: "Managing 15 creators with 4 team members was a nightmare. Now everyone has their own access and I can see exactly who did what.",
        author: "David L.",
        role: "Agency Founder • 15 creators",
        avatar: "DL",
        metric: { value: "15", label: "creators" }
      },
      {
        quote: "The audit logs saved us when we had a posting mistake. We could trace exactly what happened and fix our process.",
        author: "Rachel T.",
        role: "Agency Manager",
        avatar: "RT",
        metric: { value: "100%", label: "accountability" }
      },
    ],
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    subtitle: "24/7 Automation",
    description: "Let AI handle fan messages, optimize pricing, and automate your workflow around the clock. Natural conversations that build real connections.",
    href: "/ai",
    illustration: AIAssistantIllustration,
    gradient: "bg-gradient-to-br from-violet-50 via-purple-50/50 to-pink-50/30",
    borderColor: "border-violet-200",
    hoverBorder: "border-violet-300",
    iconColor: "text-violet-600",
    reverse: true,
    useCases: [
      {
        quote: "I was drowning in DMs. Now the AI handles 80% of conversations perfectly—fans can't even tell. My revenue actually increased while I sleep.",
        author: "Chloe M.",
        role: "Top 1% Creator",
        avatar: "CM",
        metric: { value: "+$4.2K", label: "monthly" }
      },
      {
        quote: "The AI remembered a fan's birthday and sent a personalized message. That fan has been my biggest tipper ever since.",
        author: "Zara N.",
        role: "Full-time Creator",
        avatar: "ZN",
        metric: { value: "24/7", label: "active" }
      },
    ],
  },
];

// ============================================
// STATS BAR COMPONENT
// ============================================

function StatsBar() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Creators" },
    { icon: TrendingUp, value: "$2.4M+", label: "Revenue tracked" },
    { icon: Clock, value: "15hrs", label: "Saved weekly" },
    { icon: Star, value: "4.9/5", label: "Rating" },
  ];

  return (
    <div className="bg-slate-900 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function FeaturesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
          <motion.div 
            className="absolute top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-brand-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-violet-100/50 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-brand-700 mb-4 sm:mb-6">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                Features
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6"
            >
              Powerful features,{" "}
              <span className="bg-gradient-to-r from-brand-500 via-violet-500 to-brand-500 bg-clip-text text-transparent">
                proven results
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-2"
            >
              See how creators like you are saving time, growing revenue, and taking control of their business.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-6 sm:px-8 shadow-lg shadow-brand-500/25">
                <Link href="/#cta">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 sm:px-8 border-slate-300">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <StatsBar />

        {/* Feature Sections */}
        {featureSections.map((feature, index) => (
          <FeatureSectionBlock key={feature.id} feature={feature} index={index} />
        ))}

        {/* CTA */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600" />
          <motion.div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white/80 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Ready to transform your workflow?
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
                Join thousands of creators saving 15+ hours every week with Lovdash.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-brand-600 hover:bg-white/90 rounded-full px-6 sm:px-8 shadow-xl">
                  <Link href="/#cta">Join Waitlist</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-full px-6 sm:px-8">
                  <Link href="/studio">For Agencies</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
