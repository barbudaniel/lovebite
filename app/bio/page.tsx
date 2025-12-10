"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation, Footer } from "@/components/sections";
import {
  Link as LinkIcon,
  Globe,
  Palette,
  Activity,
  Share2,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Search,
  ExternalLink,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Live Activity Sync",
    description:
      "Automatically updates your status when you go live on Chaturbate, Stripchat, or post on OnlyFans.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description:
      "Match your brand with custom themes, fonts, and backgrounds. No design skills needed.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description:
      "Use bites.bio/you or connect your own domain (e.g., yourname.com) for a professional look.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Designed for the scroll. Your bio looks perfect on every device, every time.",
  },
  {
    icon: Share2,
    title: "Smart Sharing",
    description:
      "One link for all your platforms. Track clicks and see where your fans are coming from.",
  },
  {
    icon: Lock,
    title: "Adult Friendly",
    description:
      "Built for adult creators. No random bans or shadowbanning. We support your hustle.",
  },
];

const examples = [
  { 
    name: "Mirrabelle13", 
    url: "https://bites.bio/mirrabelle13", 
    handle: "@mirrabelle13",
    image: "https://cdn.beacons.ai/user_content/T9B1Qi8wa4VpOBt78oxpdzvjqz03/profile_mirrabelle13.png?t=1760482587828" 
  },
  { 
    name: "AntoniaSnow", 
    url: "https://bites.bio/antoniasnow", 
    handle: "@antoniasnow",
    image: "https://i.imgur.com/X2AIRD8.png"
  },
  { 
    name: "BohoBabeLexy", 
    url: "https://bites.bio/bohobabelexy", 
    handle: "@bohobabelexy",
    image: "https://i.imgur.com/JyjGyiE.png"
  },
  { 
    name: "TinyBlair", 
    url: "https://bites.bio/tinyblair", 
    handle: "@tinyblair",
    image: "https://i.imgur.com/g2mb91G.png"
  },
];

const platforms = [
  "OnlyFans", "Chaturbate", "Fansly", "LoyalFans", "ManyVids", "Stripchat", "CamSoda", "Pornhub"
];

export default function LovebiteBioPage() {
  const [domainQuery, setDomainQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<null | string>(null);

  const handleDomainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery) return;
    
    setIsSearching(true);
    setSearchResult(null);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSearchResult(domainQuery);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-500/30">
      <Navigation variant="dark" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-product-600/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-product-500/10 border border-product-500/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-product-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-product-500"></span>
            </span>
            <span className="text-sm text-product-300 font-medium">
              New! Claim your unique bio link
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            <span className="text-white">One Link.</span>
            <br />
            <span className="bg-gradient-to-r from-product-400 via-brand-400 to-pink-400 bg-clip-text text-transparent">
              Infinite Possibilities.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The ultimate bio link for creators. Syncs with your live activity on OnlyFans & Chaturbate, 
            showcases your content, and drives more traffic to where it matters.
          </motion.p>

          {/* Domain Search Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto mb-16"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-product-500/5 to-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2 relative">
                <Search className="w-5 h-5 text-product-400" />
                Find your perfect handle
              </h3>
              <form onSubmit={handleDomainSearch} className="relative z-10" autoComplete="off">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none">
                      bites.bio/
                    </span>
                    <Input
                      type="text"
                      placeholder="username"
                      value={domainQuery}
                      onChange={(e) => setDomainQuery(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="h-12 pl-24 bg-slate-950/50 border-slate-700 text-white placeholder:text-slate-600 focus:bg-slate-950/50 focus:border-product-500 focus:ring-0 rounded-xl w-full font-medium"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSearching || !domainQuery}
                    className={`h-12 bg-gradient-to-r from-product-600 to-brand-600 hover:from-product-500 hover:to-brand-500 text-white px-6 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      domainQuery.length > 2 
                        ? "shadow-[0_0_25px_rgba(236,72,153,0.6)]" 
                        : "shadow-lg shadow-product-500/20"
                    }`}
                  >
                    {isSearching ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Checking...
                      </span>
                    ) : (
                      "Claim Link"
                    )}
                  </Button>
                </div>
              </form>

              {/* Search Result */}
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-slate-800 relative z-10"
                >
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">bites.bio/{searchResult} is available!</p>
                        <p className="text-xs text-slate-400">Also available: {searchResult}.com via our domain service</p>
                      </div>
                    </div>
                    <Button 
                      asChild
                      size="sm"
                      className="bg-green-600 hover:bg-green-500 text-white"
                    >
                      <Link href="/#contact">Register Now</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Platforms Marquee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
          >
             <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider text-center">
               Integrated with your favorite platforms
             </p>
             <div 
               className="relative overflow-hidden"
               style={{
                 maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                 WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
               }}
             >
               <motion.div
                 className="flex gap-10 sm:gap-14 lg:gap-20 whitespace-nowrap"
                 animate={{
                   x: ["0%", "-50%"],
                 }}
                 transition={{
                   x: {
                     repeat: Infinity,
                     repeatType: "loop",
                     duration: 25,
                     ease: "linear",
                   },
                 }}
               >
                 {[...platforms, ...platforms, ...platforms, ...platforms].map((platform, i) => (
                   <span
                     key={i}
                     className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-600 select-none"
                   >
                     {platform}
                   </span>
                 ))}
               </motion.div>
             </div>
          </motion.div>

          {/* Stats/Badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-slate-500 border-t border-slate-800/50 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-product-500" />
              <span>Free for Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-product-500" />
              <span>Unlimited Links</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-product-500" />
              <span>Instant Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Join Top Creators on Lovebite BIO
            </h2>
            <p className="text-slate-400">
              See how others are using their bio links to grow their fanbase.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.map((example, i) => (
              <motion.a
                key={example.name}
                href={example.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative block bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-product-500/50 transition-all hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4 text-slate-600 group-hover:text-product-400 transition-colors z-10">
                  <ExternalLink className="w-4 h-4" />
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-product-500 to-brand-500 mb-4 group-hover:scale-105 transition-transform">
                    <img 
                      src={example.image} 
                      alt={example.name}
                      className="w-full h-full rounded-full object-cover border-2 border-slate-900 bg-slate-800"
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white group-hover:text-product-400 transition-colors">
                    {example.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">{example.handle}</p>
                  <div className="text-xs text-product-500 flex items-center gap-1 font-medium bg-product-500/10 px-3 py-1.5 rounded-full">
                    View Profile <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-product-400 font-semibold text-sm uppercase tracking-wider">
              Features
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Everything You Need to Grow
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6 hover:border-product-500/30 transition-colors group"
              >
                <div className="w-10 h-10 bg-product-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-product-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-product-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain CTA Section */}
      <section className="py-20 bg-gradient-to-br from-product-900/20 to-brand-900/20 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Want your own <span className="text-product-400">.com</span> domain?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Stand out with a professional domain name like <strong>yourname.com</strong> that redirects straight to your Lovebite Bio.
              We handle the setup, SSL, and hosting.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 h-12 rounded-full"
            >
              <Link href="/#contact">Get Your Custom Domain</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  );
}