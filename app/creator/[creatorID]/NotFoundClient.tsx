"use client";

import { motion } from 'framer-motion';
import { EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function NotFoundClient() {
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
          This creator profile doesn&apos;t exist yet. Want to create your own Lovdash bio page?
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
            href="https://www.lovdash.com/#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-[15px] shadow-xl shadow-rose-500/25"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(244, 63, 94, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="h-4 w-4" />
            Create Your Bio
          </motion.a>

          {/* Secondary CTA - Visit Lovdash */}
          <motion.a
            href="https://www.lovdash.com/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-slate-700 text-slate-300 font-medium text-[15px] hover:bg-slate-800/50 hover:border-slate-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Visit Lovdash
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
          Powered by <span className="text-rose-500 font-medium">Lovdash</span>
        </motion.p>
      </motion.div>
    </div>
  );
}


























