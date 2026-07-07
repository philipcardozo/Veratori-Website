"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, Cpu, GraduationCap, Truck, UtensilsCrossed, Mail } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

function ImagePlaceholder({ text, className = "" }: { text: string; className?: string }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed rounded-xl p-6 ${
        isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]"
      } ${className}`}
    >
      <p className={`text-xs text-center leading-relaxed italic ${isDark ? "text-white/25" : "text-black/25"}`}>
        {text}
      </p>
    </div>
  );
}

const currentPartners = [
  {
    name: "Atlanta Tech Village",
    type: "Accelerator",
    description: "Southeast's premier startup accelerator and innovation hub. ATV has been with Veratori since our earliest days.",
    placeholder: "Atlanta Tech Village logo — ATV wordmark with distinctive teal/green brand color on transparent background",
  },
  {
    name: "Goizueta Business School",
    type: "Academic",
    description: "Emory University's Goizueta Business School — research partner supporting Veratori's food systems analysis.",
    placeholder: "Goizueta Business School — Emory University logo with academic wordmark and seal on transparent background",
  },
  {
    name: "Poke Bowl Restaurant",
    type: "Pilot Partner",
    description: "One of our first pilot locations. Reduced inventory-related waste by 38% within the first 90 days of deployment.",
    placeholder: "Poke Bowl restaurant logo — casual fresh-food brand with bowl icon and clean wordmark",
  },
  {
    name: "Crack Rice",
    type: "Pilot Partner",
    description: "Atlanta-based quick-service restaurant using Veratori for real-time cooler monitoring across their flagship location.",
    placeholder: "Crack Rice logo — bold typographic wordmark for Atlanta-based rice bowl QSR concept",
  },
];

const partnershipTypes = [
  {
    icon: Cpu,
    type: "Technology",
    headline: "Tech & Integration Partners",
    desc: "POS systems, ERP platforms, inventory software, and hardware manufacturers. Connect Veratori data to your ecosystem.",
    benefits: [
      "API access for deep integration",
      "Co-marketing opportunities",
      "Joint solution briefs",
      "Priority engineering support",
    ],
  },
  {
    icon: Truck,
    type: "Distribution",
    headline: "Distribution & Reseller Partners",
    desc: "Restaurant supply companies, foodservice distributors, and managed service providers who serve multi-location operators.",
    benefits: [
      "Reseller pricing & margin",
      "Sales enablement toolkit",
      "Co-branded proposals",
      "Dedicated partner success manager",
    ],
  },
  {
    icon: GraduationCap,
    type: "Academic",
    headline: "Research & Academic Partners",
    desc: "Universities, food science labs, and research institutions working on food waste, supply chain optimization, or edge AI.",
    benefits: [
      "Access to anonymized datasets",
      "Joint publication opportunities",
      "Pilot hardware access",
      "Advisory board participation",
    ],
  },
  {
    icon: UtensilsCrossed,
    type: "Restaurant Groups",
    headline: "Restaurant Group Partners",
    desc: "Multi-location operators and franchise groups. Deploy Veratori at scale and unlock volume pricing, custom reporting, and dedicated support.",
    benefits: [
      "Volume pricing (4+ units)",
      "Custom dashboard & reporting",
      "Priority installation scheduling",
      "Quarterly business reviews",
    ],
  },
];

export default function PartnersPage() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({ name: "", email: "", company: "", type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className={isDark ? "bg-black text-white" : "bg-white text-black"}>

      {/* ── Hero ── */}
      <section className={`pt-32 pb-16 border-b ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Partners</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              Build the future of <br />
              <span className="text-sage">food operations together</span>
            </h1>
            <p className={`text-lg max-w-xl leading-relaxed mb-8 ${isDark ? "text-white/55" : "text-black/55"}`}>
              Veratori partners with technology companies, research institutions, distributors, and restaurant groups to accelerate the adoption of intelligent inventory management.
            </p>
            <a
              href="#become-a-partner"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-white font-bold text-sm hover:bg-sage-light transition-colors"
            >
              Become a Partner <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Current Partners ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Our Ecosystem</span>
            <h2 className="text-3xl font-bold">Current Partners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`rounded-2xl border overflow-hidden ${
                  isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                }`}
              >
                {/* <ImagePlaceholder
                  text={partner.placeholder}
                  className="h-28 rounded-none border-0 border-b-2"
                /> */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold">{partner.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sage/10 text-sage">
                      {partner.type}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/45" : "text-black/45"}`}>{partner.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partnership Types ── */}
      <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Partnership Tracks</span>
            <h2 className="text-3xl font-bold mb-3">How We Work Together</h2>
            <p className={`text-base max-w-xl mx-auto ${isDark ? "text-white/50" : "text-black/50"}`}>
              Choose the partnership track that fits your organization. Every partnership is custom — reach out to discuss what makes sense.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnershipTypes.map((pt, i) => (
              <motion.div
                key={pt.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`p-8 rounded-2xl border ${
                  isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <pt.icon className="w-6 h-6 text-sage" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-sage mb-2 block">{pt.type}</span>
                <h3 className="text-lg font-bold mb-2">{pt.headline}</h3>
                <p className={`text-sm leading-relaxed mb-5 ${isDark ? "text-white/50" : "text-black/50"}`}>{pt.desc}</p>
                <ul className="space-y-2">
                  {pt.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                      <span className={`text-sm ${isDark ? "text-white/65" : "text-black/65"}`}>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image band ── */}
      {/* <section className="px-6 max-w-7xl mx-auto py-16">
        <ImagePlaceholder
          text="Partners page image: Wide shot of Veratori team presenting at an Atlanta Tech Village networking event — modern co-working space, projector screen, engaged audience of startup founders and investors"
          className="h-60 w-full"
        />
      </section> */}

      {/* ── Become a Partner Form ── */}
      <section id="become-a-partner" className={`py-20 border-t ${isDark ? "border-white/[0.06] bg-midnight" : "border-black/[0.06] bg-mist"}`}>
        <div className="max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="mb-10 text-center">
              <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Inquire</span>
              <h2 className="text-3xl font-bold mb-3">Become a Partner</h2>
              <p className={`text-base ${isDark ? "text-white/50" : "text-black/50"}`}>
                Tell us about your organization and the type of partnership you have in mind. We&apos;ll follow up within 2 business days.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-10 rounded-2xl border text-center ${isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07]"}`}
              >
                <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-sage" />
                </div>
                <h3 className="text-xl font-bold mb-2">Inquiry received!</h3>
                <p className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>
                  We&apos;ll review your message and reach out within 2 business days.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={`p-8 rounded-2xl border space-y-5 ${
                  isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Your Name", key: "name", type: "text", placeholder: "Felipe Cardozo" },
                    { label: "Work Email", key: "email", type: "email", placeholder: "you@company.com" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/50" : "text-black/50"}`}>{field.label}</label>
                      <input
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-sage/50"
                            : "bg-white border-black/10 text-black placeholder-black/30 focus:border-sage/50"
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/50" : "text-black/50"}`}>Company / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-sage/50"
                        : "bg-white border-black/10 text-black placeholder-black/30 focus:border-sage/50"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/50" : "text-black/50"}`}>Partnership Type</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors cursor-pointer ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white focus:border-sage/50"
                        : "bg-white border-black/10 text-black focus:border-sage/50"
                    }`}
                  >
                    <option value="">Select a partnership type…</option>
                    <option value="technology">Technology / Integration</option>
                    <option value="distribution">Distribution / Reseller</option>
                    <option value="academic">Research / Academic</option>
                    <option value="restaurant">Restaurant Group</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/50" : "text-black/50"}`}>Tell us more</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your organization and what kind of partnership you have in mind…"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors resize-none ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-sage/50"
                        : "bg-white border-black/10 text-black placeholder-black/30 focus:border-sage/50"
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-sage text-white font-bold text-sm hover:bg-sage-light transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  Submit Inquiry <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className={`text-center text-xs mt-5 ${isDark ? "text-white/25" : "text-black/25"}`}>
              Or email us directly at{" "}
              <a href="mailto:partners@veratori.com" className="text-sage hover:underline">
                partners@veratori.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
