"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sofia M.",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128",
    quote:
      "I've been in the industry for 7 years. Lovebite helped me create a consistent monthly income, much higher than before. I love that I can get everything done in just 10-20 hours per week.",
    earnings: "$3,200/mo",
  },
  {
    name: "Elena K.",
    role: "Model & Influencer",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=128&h=128",
    quote:
      "Communication and building connections with Lovebite has been effortless. They always keep their word, they're always open and willing to answer questions.",
    earnings: "$2,800/mo",
  },
  {
    name: "Maya R.",
    role: "New Creator",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=128&h=128",
    quote:
      "The team is very trustworthy and professional. I just started collaborating with Lovebite, and I'm already convinced that things will work smoothly!",
    earnings: "Just Started",
  },
  {
    name: "Luna V.",
    role: "Full-time Creator",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&h=128",
    quote:
      "I'm very happy with the transparency—I get weekly reports where I can check any updates on my account. Everyone is super friendly and available.",
    earnings: "$4,100/mo",
  },
  {
    name: "Aria D.",
    role: "Part-time Model",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=128&h=128",
    quote:
      "Since I also work another job and my free time is limited, collaboration with Lovebite seemed just right. The financial results have helped me enjoy more free time!",
    earnings: "$1,900/mo",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const goTo = (index: number) => {
    setIsAutoPlaying(false);
    setCurrent(index);
  };

  const handleNav = (direction: "prev" | "next") => {
    setIsAutoPlaying(false);
    direction === "prev" ? prev() : next();
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="text-brand-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            Hear from our <span className="text-brand-600">creators</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-2xl mx-auto">
          {/* Main Testimonial */}
          <div className="relative min-h-[280px] sm:min-h-[300px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full"
              >
                <div className="bg-white rounded-2xl p-5 sm:p-7 lg:p-8 border border-slate-200 relative shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Quote Icon */}
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="absolute -top-4 left-5 sm:left-7 w-9 h-9 sm:w-10 sm:h-10 bg-brand-600 rounded-xl flex items-center justify-center"
                  >
                    <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
                  </motion.div>

                  {/* Content */}
                  <div className="pt-3">
                    <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed mb-5 sm:mb-6">
                      "{testimonials[current].quote}"
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={testimonials[current].avatar}
                            alt={testimonials[current].name}
                            width={48}
                            height={48}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-brand-100"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base">{testimonials[current].name}</p>
                          <p className="text-slate-500 text-xs sm:text-sm">{testimonials[current].role}</p>
                        </div>
                      </div>
                      <div className="bg-brand-50 px-3 py-1.5 rounded-full self-start sm:self-auto">
                        <span className="text-xs text-slate-500">Earning: </span>
                        <span className="font-bold text-brand-600 text-xs sm:text-sm">{testimonials[current].earnings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {/* Prev arrow */}
            <motion.button
              onClick={() => handleNav("prev")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center hover:bg-brand-50 hover:border-brand-200 transition-colors group"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-slate-500 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-brand-500" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => goTo(i)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-brand-600 w-6"
                      : "bg-slate-200 hover:bg-brand-300 w-2"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Next arrow */}
            <motion.button
              onClick={() => handleNav("next")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center hover:bg-brand-50 hover:border-brand-200 transition-colors group"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-500" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
