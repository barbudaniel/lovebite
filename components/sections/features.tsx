"use client";

import { motion, AnimatePresence } from "motion/react";
import { Globe, Link2, Users, ArrowRight, Calendar, BarChart3, MousePointer, TrendingUp, Check } from "lucide-react";
import { AnimatedSection } from "@/components/motion/animated-section";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const features = [
  {
    id: "publish",
    icon: Globe,
    label: "Multi-Platform",
    title: "Publish everywhere at once",
    description: "Connect all your accounts. Create once, schedule once, and Lovdash posts to every platform on your schedule. Optimize captions per platform automatically.",
    gradient: "from-brand-500 to-rose-500",
    pillBg: "bg-brand-50",
    iconColor: "text-brand-600",
    labelColor: "text-brand-700",
    linkColor: "text-brand-600 hover:text-brand-700",
    benefits: ["5+ platforms", "Smart scheduling", "Platform-optimized captions", "Bulk posting"],
  },
  {
    id: "bio",
    icon: Link2,
    label: "Bio Links",
    title: "One link for everything",
    description: "Create a beautiful, customizable link-in-bio page. Track every click. See exactly which posts drive fans to subscribe. Revenue attribution built in.",
    gradient: "from-cyan-500 to-blue-500",
    pillBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    labelColor: "text-cyan-700",
    linkColor: "text-cyan-600 hover:text-cyan-700",
    benefits: ["Custom themes", "Click tracking", "Revenue attribution", "Mobile-optimized"],
  },
  {
    id: "teams",
    icon: Users,
    label: "For Teams",
    title: "Built for agencies & teams",
    description: "Manage multiple creators from one dashboard. Role-based access controls, shared templates, and cross-account analytics. Scale your operations.",
    gradient: "from-amber-500 to-orange-500",
    pillBg: "bg-amber-50",
    iconColor: "text-amber-600",
    labelColor: "text-amber-700",
    linkColor: "text-amber-600 hover:text-amber-700",
    benefits: ["Role-based access", "Activity logs", "Shared templates", "Cross-account reporting"],
  },
];

// Platform icons for the publish visual
const platforms = [
  { name: "Twitter/X", color: "bg-black", published: true },
  { name: "Other", color: "bg-[#00AFF0]", published: true },
  { name: "Instagram", color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400", published: false },
];

// Publishing Visual Card
function PublishVisualCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-rose-500 rounded-xl flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">Media Library</p>
          <p className="text-xs text-slate-500">4 platforms connected</p>
        </div>
      </div>

      {/* Content Preview */}
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden relative flex-shrink-0">
            <Image src="/homepage/Alison_Homeparty.png" alt="Content" fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Weekend vibes ✨</p>
            <p className="text-xs text-slate-500 mt-1">Scheduled for today, 6:00 PM</p>
            <div className="flex items-center gap-1 mt-2">
              <Calendar className="w-3 h-3 text-brand-500" />
              <span className="text-xs text-brand-600 font-medium">Auto-optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="space-y-2">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 ${platform.color} rounded-full flex items-center justify-center`}>
                <Globe className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-slate-700">{platform.name}</span>
            </div>
            {platform.published ? (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Check className="w-3 h-3" /> Ready
              </span>
            ) : (
              <span className="text-xs text-slate-400">Pending</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Bio Links Visual Card
function BioVisualCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Link2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">Bio Analytics</p>
          <p className="text-xs text-slate-500">Last 30 days</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-cyan-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <MousePointer className="w-4 h-4 text-cyan-600" />
            <span className="text-xs text-slate-600">Total clicks</span>
          </div>
          <p className="text-xl font-bold text-slate-900">2,847</p>
          <p className="text-xs text-green-600 font-medium">+12% vs last month</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-slate-600">Conversion</span>
          </div>
          <p className="text-xl font-bold text-slate-900">12.4%</p>
          <p className="text-xs text-green-600 font-medium">+3.2% vs last month</p>
        </div>
      </div>

      {/* Top Links */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Top performing links</p>
        {[
          { name: "Other", clicks: 1234, pct: 43 },
          
          { name: "Twitter", clicks: 721, pct: 26 },
          { name: "Instagram", clicks: 721, pct: 26 },
        ].map((link) => (
          <div key={link.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-700">{link.name}</span>
                <span className="text-xs text-slate-500">{link.clicks} clicks</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${link.pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Teams Visual Card
function TeamsVisualCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">Team Overview</p>
          <p className="text-xs text-slate-500">3 creators managed</p>
        </div>
      </div>

      {/* Team Stats */}
      <div className="bg-amber-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Total Revenue</span>
          <span className="text-lg font-bold text-slate-900">$24,892</span>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-green-600 font-medium">+18% this month</span>
        </div>
      </div>

      {/* Creator List */}
      <div className="space-y-2">
        {[
          { name: "Alison L.", role: "Model", revenue: "$12,450", avatar: "/homepage/Alison_Homeparty.png" },
          { name: "Sofia R.", role: "Model", revenue: "$8,240", avatar: "/homepage/Alison_Italy.png" },
          { name: "Mia K.", role: "Model", revenue: "$4,202", avatar: "/homepage/Alison_Night.png" },
        ].map((creator) => (
          <div key={creator.name} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
            <div className="w-9 h-9 rounded-full overflow-hidden relative flex-shrink-0">
              <Image src={creator.avatar} alt={creator.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{creator.name}</p>
              <p className="text-xs text-slate-500">{creator.role}</p>
            </div>
            <span className="text-sm font-semibold text-slate-700">{creator.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Feature visual components map
const featureVisuals: Record<string, React.ReactNode> = {
  publish: <PublishVisualCard />,
  bio: <BioVisualCard />,
  teams: <TeamsVisualCard />,
};

// Individual feature section with ref registration
function FeatureSection({ 
  feature, 
  isFirst = false,
  registerRef
}: { 
  feature: typeof features[0]; 
  isFirst?: boolean;
  registerRef: (id: string, element: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={(el) => registerRef(feature.id, el)}
      id={feature.id}
      className={`min-h-[50vh] lg:min-h-[50vh] flex flex-col justify-center py-12`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        {/* Label pill */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${feature.pillBg} rounded-full`}>
          <feature.icon className={`w-4 h-4 ${feature.iconColor}`} />
          <span className={`text-sm font-medium ${feature.labelColor}`}>{feature.label}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
          {feature.description}
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap gap-2 pt-1">
          {feature.benefits.map((benefit) => (
            <span 
              key={benefit}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full"
            >
              {benefit}
            </span>
          ))}
        </div>

        {/* CTA Link */}
        <motion.a
          href={`/features/${feature.id}`}
          className={`inline-flex items-center gap-2 ${feature.linkColor} font-medium transition-colors group pt-1`}
          whileHover={{ x: 4 }}
        >
          Learn more
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </motion.div>

      {/* Mobile Visual (only visible on mobile/tablet) */}
      <motion.div 
        className="lg:hidden mt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {featureVisuals[feature.id]}
      </motion.div>
    </div>
  );
}

export function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Register section ref
  const registerSection = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) {
      sectionRefs.current.set(id, element);
    }
  }, []);

  // Track which section is most visible
  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestSection = features[0].id;
      let closestDistance = Infinity;

      sectionRefs.current.forEach((element, id) => {
        const rect = element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = id;
        }
      });

      setActiveFeature(closestSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={containerRef}
      id="features" 
      className="relative bg-slate-50 overflow-visible"
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-brand-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="pt-10 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8">
          <AnimatedSection className="text-center">
            <motion.span 
              className="text-brand-600 font-medium text-xs sm:text-sm uppercase tracking-wider inline-block"
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.span>
            <motion.h2 
              className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Everything you need to run your content business
            </motion.h2>
            <motion.p 
              className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              All the tools to manage, distribute, and grow—in one place.
            </motion.p>
          </AnimatedSection>
        </div>

        {/* Sticky Scroll Section */}
        <div className="lg:flex lg:gap-12 xl:gap-16">
          {/* Left: Text Content (Scrollable) */}
          <div className="lg:w-1/2 lg:flex-shrink-0">
            {features.map((feature, index) => (
              <FeatureSection 
                key={feature.id} 
                feature={feature} 
                isFirst={index === 0}
                registerRef={registerSection}
              />
            ))}
          </div>

          {/* Right: Sticky Visual (Desktop only) */}
          <div className="hidden lg:block lg:w-1/2 lg:flex-shrink-0">
            <div className="sticky top-32 h-fit pt-16">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                    >
                      {featureVisuals[activeFeature]}
                    </motion.div>
                  </AnimatePresence>

         
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-8 sm:h-12 lg:h-16" />
      </div>
    </section>
  );
}