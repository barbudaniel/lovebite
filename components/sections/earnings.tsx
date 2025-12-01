"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedSection } from "@/components/motion/animated-section";

const plans = [
  {
    id: "percentage",
    name: "% percentage",
    tagline: "Grow together with us",
    description: "Get paid % cut from all sales. Revenues depend on content quality, marketing, and can vary each month.",
    highlight: "Up to 20% NET",
    features: [
      "Uncapped earning potential",
      "Revenue grows with audience",
      "Performance partnership",
      "Full marketing support",
    ],
    cta: "Contact us",
    popular: false,
    bgColor: "bg-slate-800",
    icon: TrendingUp,
  },
  {
    id: "fixed",
    name: "$ fixed",
    tagline: "Most popular option",
    description: "Earn fixed rate every month. We buy your content for agreed rate and bear all fluctuation and risk.",
    highlight: "$400 - $800+/mo",
    features: [
      "Stable predictable income",
      "No risk on your side",
      "Monthly guaranteed pay",
      "Perfect for consistency",
    ],
    cta: "Contact us",
    popular: true,
    bgColor: "bg-brand-600",
    icon: Shield,
  },
];

export function Earnings() {
  return (
    <section id="models" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
          <span className="text-brand-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Cooperation Models
          </span>
          <h2 className="mt-2 sm:mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            Choose the model that <span className="text-brand-600">suits you</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
            Get paid % cut from all sales or fixed rate every month.
            We have models that smoothly meet your preferences.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative h-full rounded-2xl overflow-hidden ${
                  plan.popular ? "ring-2 ring-brand-400" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-white text-brand-600 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                {/* Card */}
                <div className={`h-full p-5 sm:p-6 lg:p-7 ${plan.bgColor} text-white group`}>
                  {/* Icon */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 sm:mb-5 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                    <plan.icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-6" />
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl sm:text-2xl font-black mb-1">{plan.name}</h3>
                  <p className="text-white/70 text-sm mb-3 sm:mb-4">{plan.tagline}</p>

                  {/* Highlight */}
                  <div className="inline-flex items-center bg-white/10 rounded-lg px-3 py-1.5 mb-4 sm:mb-5">
                    <span className="text-lg sm:text-xl font-bold">{plan.highlight}</span>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 text-sm mb-4 sm:mb-5 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-white/90 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    asChild
                    size="lg"
                    className={`w-full h-11 rounded-lg font-semibold text-sm group ${
                      plan.popular
                        ? "bg-white text-brand-600 hover:bg-white/90"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    <Link href="#contact">
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Alternative Option */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-10 text-center"
        >
          <p className="text-slate-500 text-sm sm:text-base">
            Or if you're interested in other types of cooperation,{" "}
            <Link href="#contact" className="text-brand-600 font-medium hover:underline">
              don't hesitate to contact us
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
