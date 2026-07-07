"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download, ExternalLink, Mail, Calendar, Building2, Users, MapPin, Lightbulb } from "lucide-react";
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

const pressReleases = [
  {
    date: "March 5, 2026",
    title: "Veratori Launches Beta Program for Restaurant Walk-In Cooler Monitoring",
    excerpt: "Atlanta-based food-tech startup Veratori today announced the launch of its beta program, offering $359/unit/month pricing for its AI-powered V1 Sensor system.",
    tag: "Product Launch",
  },
  {
    date: "January 20, 2026",
    title: "Veratori Joins Atlanta Tech Village Accelerator Cohort",
    excerpt: "Veratori Inc. has been accepted into the Atlanta Tech Village startup accelerator, gaining access to resources, mentorship, and the Southeast's leading tech ecosystem.",
    tag: "Company News",
  },
  {
    date: "March 15, 2024",
    title: "Veratori Publishes LiDAR Research Paper on Volumetric Inventory Analysis",
    excerpt: "Veratori Labs releases its first academic white paper, detailing the multi-modal edge architecture that combines LiDAR depth sensing with YOLO-v8 object detection.",
    tag: "Research",
  },
];

const mediaCoverage = [
  { outlet: "TechCrunch", placeholder: "TechCrunch logo — dark red wordmark on white/transparent background" },
  { outlet: "Atlanta Business Chronicle", placeholder: "Atlanta Business Chronicle logo — professional news publication wordmark" },
  { outlet: "Food & Wine Tech", placeholder: "Food & Wine Tech logo — modern food-tech publication mark" },
  { outlet: "Restaurant Business", placeholder: "Restaurant Business magazine logo — industry trade publication" },
];

const companyFacts = [
  { icon: Building2, label: "Founded", value: "2023, Atlanta, GA" },
  { icon: MapPin, label: "Headquarters", value: "Austin, TX (R&D)" },
  { icon: Users, label: "Team Size", value: "6 full-time" },
  { icon: Lightbulb, label: "Focus", value: "AI inventory for food service" },
  { icon: Calendar, label: "Beta Launch", value: "Q1 2026" },
];

export default function PressPage() {
  const { isDark } = useTheme();

  return (
    <main className={isDark ? "bg-black text-white" : "bg-white text-black"}>

      {/* ── Hero ── */}
      <section className={`pt-32 pb-16 border-b ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Press & Media</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              Media Center
            </h1>
            <p className={`text-lg max-w-xl leading-relaxed mb-8 ${isDark ? "text-white/55" : "text-black/55"}`}>
              Official press releases, media coverage, company facts, and downloadable brand assets for journalists and media partners.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:press@veratori.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage text-white font-bold text-sm hover:bg-sage-light transition-colors"
              >
                <Mail className="w-4 h-4" /> Media Inquiries
              </a>
              <Link
                href="/resources"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border transition-colors ${
                  isDark
                    ? "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                    : "border-black/15 text-black/70 hover:border-black/40 hover:text-black"
                }`}
              >
                <Download className="w-4 h-4" /> Brand Assets
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Company Fact Sheet ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Company Overview</span>
              <h2 className="text-2xl font-bold mb-4">Fast Facts</h2>
              <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
                Veratori is an early-stage food-tech company building AI-powered inventory management hardware for commercial kitchens. Founded in Atlanta, now operating out of Austin, TX.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {companyFacts.map((fact, i) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`flex items-center gap-4 p-5 rounded-2xl border ${
                    isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                    <fact.icon className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${isDark ? "text-white/30" : "text-black/30"}`}>
                      {fact.label}
                    </p>
                    <p className="text-sm font-bold">{fact.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero image band ── */}
      {/* <section className="px-6 max-w-7xl mx-auto pb-16">
        <ImagePlaceholder
          text="Press center hero image: Professional team photo of Veratori founders at the ATV Demo Day event, casual-professional setting with tech/startup aesthetic. Clean modern background."
          className="h-64 w-full"
        />
      </section> */}

      {/* ── Press Releases ── */}
      <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Announcements</span>
            <h2 className="text-3xl font-bold">Press Releases</h2>
          </div>
          <div className="space-y-4">
            {pressReleases.map((pr, i) => (
              <motion.div
                key={pr.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row md:items-center gap-5 group ${
                  isDark ? "bg-white/[0.03] border-white/[0.08] hover:border-white/20" : "bg-white border-black/[0.07] hover:border-black/20 shadow-sm"
                } transition-all`}
              >
                <div className="md:w-36 shrink-0">
                  <span className={`text-xs font-semibold ${isDark ? "text-white/35" : "text-black/35"}`}>{pr.date}</span>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-sage/10 text-sage">
                      {pr.tag}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-1 group-hover:text-sage transition-colors">{pr.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/45" : "text-black/45"}`}>{pr.excerpt}</p>
                </div>
                <ArrowRight className={`w-5 h-5 shrink-0 text-sage opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Media Coverage ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">In the News</span>
            <h2 className="text-3xl font-bold mb-2">Media Coverage</h2>
            <p className={`text-sm ${isDark ? "text-white/40" : "text-black/40"}`}>
              Veratori as featured in:
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaCoverage.map((item, i) => (
              <motion.div
                key={item.outlet}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`rounded-2xl border overflow-hidden ${
                  isDark ? "border-white/[0.08]" : "border-black/[0.07]"
                }`}
              >
                {/* <ImagePlaceholder
                  text={item.placeholder}
                  className="h-28 rounded-none border-0"
                /> */}
                <div className={`px-4 py-3 border-t ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                  <p className={`text-xs font-semibold text-center ${isDark ? "text-white/40" : "text-black/40"}`}>
                    {item.outlet}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press Kit ── */}
      <section className={`py-20 border-t ${isDark ? "border-white/[0.06] bg-midnight" : "border-black/[0.06] bg-mist"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Press Kit</span>
              <h2 className="text-3xl font-bold mb-4">Brand Assets & Downloads</h2>
              <p className={`text-base leading-relaxed mb-8 ${isDark ? "text-white/50" : "text-black/50"}`}>
                Download our official brand assets for use in editorial coverage. All assets are provided under our media license — please credit Veratori Inc.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Logo Pack (SVG + PNG, all variants)", size: "~2.4 MB" },
                  { label: "Founder Headshots (High-res JPEG)", size: "~8 MB" },
                  { label: "Product Images & Hardware Renders", size: "~12 MB" },
                  { label: "Company One-Pager (PDF)", size: "~1.1 MB" },
                ].map((asset) => (
                  <div
                    key={asset.label}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-sage shrink-0" />
                      <span className="text-sm font-medium">{asset.label}</span>
                    </div>
                    <span className={`text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>{asset.size}</span>
                  </div>
                ))}
              </div>
              <p className={`text-xs mt-4 ${isDark ? "text-white/30" : "text-black/30"}`}>
                Full press kit available on request — email{" "}
                <a href="mailto:press@veratori.com" className="text-sage hover:underline">press@veratori.com</a>
              </p>
            </div>
            {/* <ImagePlaceholder
              text="Press kit preview image: Mockup showing printed one-pager, business card, logo sheet, and USB drive with Veratori branding — clean flat-lay on white surface"
              className="h-80"
            /> */}
          </div>
        </div>
      </section>

      {/* ── Media Contact ── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold mb-3">Media Contact</h2>
            <p className={`text-base mb-6 ${isDark ? "text-white/50" : "text-black/50"}`}>
              For press inquiries, interview requests, or editorial partnerships, reach out directly.
            </p>
            <div className={`inline-flex flex-col items-center gap-2 p-6 rounded-2xl border ${isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"}`}>
              <p className="font-bold">Press Team — Veratori Inc.</p>
              <a href="mailto:press@veratori.com" className="text-sage font-semibold flex items-center gap-1.5 hover:underline">
                <Mail className="w-4 h-4" /> press@veratori.com
              </a>
              <p className={`text-xs ${isDark ? "text-white/35" : "text-black/35"}`}>Typically respond within 24 hours</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
