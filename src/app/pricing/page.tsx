"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";
import OrderForm from "@/components/pricing/OrderForm";

const faqs = [
  {
    q: "What's the difference between Standard, Growth, and Enterprise?",
    a: "Standard ($299/unit/mo) covers a single walk-in with YOLO detection at 15 FPS, daily digest, and anomaly alerts. Growth ($359/unit/mo) adds 30 FPS detection, 4K LiDAR sensing, multi-location dashboard, and LTE failover. Enterprise ($549/unit/mo) adds dual-camera arrays, API access, dedicated account management, and priority hardware support.",
  },
  {
    q: "Is there an upfront cost?",
    a: "Yes — a one-time hardware and installation fee covers the sensor units, ceiling mount, and system integration. Contact us for an installation quote. Your first 30 days of service are free so you can verify the value before your first billing cycle.",
  },
  {
    q: "How many sensor units do I need?",
    a: "Typically one unit per walk-in cooler or storage room. Most single-location restaurants deploy 1–3 units depending on how many separate storage areas they operate.",
  },
  {
    q: "What subscription terms are available?",
    a: "You can subscribe month-to-month at the standard rate, or commit to 6 months (5% off), 12 months (12% off), or 24 months (20% off). Longer terms are billed as a single upfront payment or in quarterly installments — contact us to discuss.",
  },
  {
    q: "Can I switch plans or cancel?",
    a: "You can upgrade or downgrade your plan at the start of any billing period. Month-to-month subscribers can cancel at any time. Annual and multi-year plans can be cancelled at the end of their committed term.",
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`rounded-xl border transition-all duration-200 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-7 py-5 text-left cursor-pointer"
      >
        <span className="text-base font-bold pr-4">{faq.q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`px-7 pb-5 text-base leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
          {faq.a}
        </div>
      )}
    </div>
  );
}

function ImagePlaceholder({ text, className = "" }: { text: string; className?: string }) {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-center justify-center border-2 border-dashed rounded-xl p-6 ${
      isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]"
    } ${className}`}>
      <p className={`text-xs text-center leading-relaxed italic ${isDark ? "text-white/25" : "text-black/25"}`}>
        {text}
      </p>
    </div>
  );
}

export default function PricingPage() {
  const { isDark } = useTheme();

  return (
    <main className={`transition-colors duration-500 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>

      {/* ── Page Header ── */}
      <section className={`pt-28 pb-14 border-b ${isDark ? "border-white/5" : "border-black/5"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Pricing</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6">
              Simple pricing.<br />
              <span className="text-sage">Per unit, per month.</span>
            </h1>
            <p className={`text-lg max-w-2xl leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
              Three plans built around your operation size. Choose your hardware tier, number of sensor units, and subscription term — and see your price update in real time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* <div className="max-w-7xl mx-auto px-6 py-8">
        <ImagePlaceholder
          text="V1 Sensor unit — clean product shot on white surface, NVIDIA Jetson Orin module visible, IP67 housing with LiDAR aperture and RGB camera lens, Veratori logo on front panel"
          className="w-full h-64"
        />
      </div> */}

      {/* ── Pricing & FAQ ── */}
      <section className={`py-28`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            
            {/* Left: Order Form */}
            <div className="w-full h-full">
              <OrderForm />
            </div>

            {/* Right: FAQ */}
            <div className="w-full">
              <div className="mb-10 text-left">
                <span className="text-sage font-semibold tracking-widest uppercase text-sm mb-4 block">FAQ</span>
                <h2 className="text-4xl font-bold tracking-tight">Common Questions</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
