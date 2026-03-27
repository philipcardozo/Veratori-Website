"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Clock, ShieldCheck, ArrowRight, FileText, BookOpen, ExternalLink, Microscope, X } from "lucide-react";
import DataFlowSection from "@/components/mission/DataFlowSection";
import ROICalculator from "@/components/mission/ROICalculator";
import { useTheme } from "@/components/ui/ThemeProvider";
import SectionHeading from "@/components/ui/SectionHeading";

/* ═══════════════════ PILLARS SECTION ═══════════════════ */
const pillars = [
  {
    icon: Leaf,
    title: "Built for Zero Waste",
    text: "Every feature is evaluated against one question: does this reduce the amount of food that ends up in the trash? If not, we don't build it."
  },
  {
    icon: Clock,
    title: "12 Hours Back Per Week",
    text: "Manual inventory counting averages 90 minutes per shift per location. Veratori brings that to zero, letting staff focus on guests instead of clipboards."
  },
  {
    icon: ShieldCheck,
    title: "Your Data, Encrypted",
    text: "Operational data stays on your edge device and is encrypted in transit. We have no access to your raw footage. GDPR and SOC 2 Type II compliant."
  }
];

function Pillars() {
  const { isDark } = useTheme();
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 text-center">
          <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">How We Operate</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Operating Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className={`p-8 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
              <p.icon className="w-7 h-7 text-sage mb-5" />
              <h3 className="text-lg font-bold mb-3">{p.title}</h3>
              <p className={`text-base leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Research() {
  const { isDark } = useTheme();
  const [isPaperOpen, setIsPaperOpen] = useState(false);

  return (
    <section className={`py-28 overflow-hidden relative transition-colors duration-500 ${isDark ? "bg-[#0A0F1E]" : "bg-[#F8FAFC]"}`}>
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className={`absolute -top-1/4 -right-1/4 w-1/2 h-full rounded-full blur-[120px] ${isDark ? "bg-sage/20" : "bg-sage/10"}`} />
        <div className={`absolute -bottom-1/4 -left-1/4 w-1/2 h-full rounded-full blur-[120px] ${isDark ? "bg-blue-500/10" : "bg-blue-500/5"}`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest mb-8 ${isDark ? "bg-sage/10 text-sage border border-sage/20" : "bg-sage/10 text-sage-dark border border-sage/20"}`}>
              <Microscope className="w-6 h-6 md:w-8 md:h-8" />
              Research & Development
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight text-balance">
              The Science of <br />
              <span className="text-sage">Zero Waste</span>
            </h2>
            <p className={`text-xl md:text-2xl leading-relaxed mb-12 ${isDark ? "text-white/60" : "text-black/60"}`}>
              Our mission isn't just operational—it's scientific. We conduct internal research to push the limits of computer vision and spatial computing in commercial environments.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex gap-5 items-start">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <ShieldCheck className="w-7 h-7 text-sage" />
                </div>
                <div>
                  <h4 className="font-bold text-lg md:text-xl mb-2">Precision Inventory Modeling</h4>
                  <p className={`text-base md:text-lg ${isDark ? "text-white/40" : "text-black/40"}`}>Using LiDAR to map volumetric changes in stock with millimeter accuracy.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <Leaf className="w-7 h-7 text-sage" />
                </div>
                <div>
                  <h4 className="font-bold text-lg md:text-xl mb-2">Predictive Waste Mitigation</h4>
                  <p className={`text-base md:text-lg ${isDark ? "text-white/40" : "text-black/40"}`}>Algorithmic approaches to identifying shelf-life anomalies before they occur.</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Interactive Paper Preview */}
          <div style={{ perspective: "900px" }} className="relative w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative w-full"
          >
            <motion.div
              onClick={() => setIsPaperOpen(true)}
              whileHover="hovered"
              whileTap={{ scale: 0.97 }}
              initial="idle"
              animate="idle"
              variants={{
                idle: { y: 0, rotateX: 0, rotateY: 0, scale: 1 },
                hovered: { y: -14, rotateX: 4, rotateY: -3, scale: 1.03 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className={[
                "relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border p-6 sm:p-8 cursor-pointer",
                "will-change-transform",
                isDark
                  ? "bg-white/[0.07] border-white/10 backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.35),0_18px_48px_rgba(0,0,0,0.55)]"
                  : "bg-white border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.05),0_12px_32px_rgba(91,151,79,0.08)]",
              ].join(" ")}
            >
              {/* Glow halo that shows on hover */}
              <motion.div
                variants={{
                  idle: { opacity: 0, scale: 0.85 },
                  hovered: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.35 }}
                className="absolute -inset-px rounded-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 60% 20%, rgba(91,151,79,0.35) 0%, transparent 65%)",
                  filter: "blur(2px)",
                }}
              />

              {/* Shine sweep */}
              <motion.div
                variants={{
                  idle: { opacity: 0, x: "-100%" },
                  hovered: { opacity: 1, x: "120%" },
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
                  zIndex: 10,
                }}
              />

              {/* Paper Header Mockup */}
              <div className="border-b border-sage/30 pb-6 mb-8">
                <div className="flex justify-between items-start mb-4 relative">
                  <motion.div
                    variants={{ idle: { width: "12%" }, hovered: { width: "78%" } }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="h-1 rounded-full bg-sage absolute top-[11px] left-0"
                  />
                  <div className="h-1 w-[12%]" />
                  <motion.div
                    variants={{ idle: { rotate: 0, color: "rgba(91,151,79,0.4)" }, hovered: { rotate: -8, color: "rgba(91,151,79,0.9)" } }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FileText className="w-6 h-6" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold font-serif mb-2">Volumetric Inventory Analysis via LiDAR Depth Sensing</h3>
                <div className="flex gap-3 text-[10px] font-mono text-sage/60 uppercase tracking-tighter">
                  <span>Veratori Labs</span>
                  <span>•</span>
                  <span>March 2024</span>
                </div>
              </div>

              {/* Paper Content Mockup */}
              <div className="space-y-6 relative">
                <div>
                  <span className="text-[10px] font-bold text-sage uppercase tracking-widest block mb-3">Abstract</span>
                  <blockquote className={`text-sm leading-relaxed italic border-l-2 border-sage/40 pl-4 ${isDark ? "text-white/70" : "text-black/70"}`}>
                    "Modern commercial kitchens demand more than simple count-based inventory; they require true spatial awareness. Veratori's LiDAR-based depth sensing architecture embodies this shift, moving beyond traditional computer vision by integrating volumetric data points with YOLO-v8 object detection."
                  </blockquote>
                </div>
                <div className="h-3 w-[85%] bg-current opacity-10 rounded-full" />
                <div className="h-3 w-[70%] bg-current opacity-10 rounded-full" />

                {/* CTA reveal on hover */}
                <div className="pt-2">
                  <motion.div
                    variants={{
                      idle: { backgroundColor: "rgba(91,151,79,0.04)", borderColor: "rgba(91,151,79,0.1)" },
                      hovered: { backgroundColor: "rgba(91,151,79,0.14)", borderColor: "rgba(91,151,79,0.4)" },
                    }}
                    transition={{ duration: 0.25 }}
                    className="w-full rounded-lg border flex items-center justify-center py-5"
                  >
                    <div className="text-center px-4">
                      <motion.div
                        variants={{ idle: { scale: 1, rotate: 0 }, hovered: { scale: 1.2, rotate: -6 } }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="w-8 h-8 text-sage mx-auto mb-2" />
                      </motion.div>
                      <motion.span
                        variants={{ idle: { opacity: 0.5, letterSpacing: "0.15em" }, hovered: { opacity: 1, letterSpacing: "0.22em" } }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] font-bold uppercase text-sage block"
                      >
                        Read Full Paper
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </div>

      {/* ── Paper Visualization Modal ── */}
      <AnimatePresence mode="wait">
        {isPaperOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaperOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header (Logo Bar) */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="relative h-8 w-32">
                    <Image
                      src="/images/Logos/Brand Identity/Logos/Logo_name_dark-nobg.png"
                      alt="Veratori"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Labs Research</span>
                </div>
                <button
                  onClick={() => setIsPaperOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8 sm:p-12">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  {/* Top Banner (Similar to image) */}
                  <div className="relative bg-[#EBEDF0] p-10 sm:p-16 border-r-[12px] border-sage overflow-hidden">
                    <div className="relative z-10 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 block">White Paper</span>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2D3139] leading-[1.1] mb-8 max-w-2xl">
                        Volumetric Inventory Analysis via LiDAR Depth Sensing: A Multi-Modal Edge Architecture
                      </h3>
                    </div>
                    {/* Abstract background shape */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/40 skew-x-[-12deg] translate-x-12" />
                  </div>

                  {/* Body Content */}
                  <div className="p-10 sm:p-16 grid grid-cols-1 lg:grid-cols-5 gap-12 text-left">
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-bold border-b border-gray-200 pb-2 mb-4">Abstract</h4>
                      <p className="text-sm leading-relaxed text-gray-500 italic">
                        "Modern commercial kitchens demand more than simple count-based inventory; they require true spatial awareness. Veratori's LiDAR-based depth sensing architecture embodies this shift, moving beyond traditional computer vision by integrating volumetric data points with YOLO-v8 object detection. By logically bonding these domains at the edge, the system guarantees 99%+ accuracy even in moisture-rich and low-light industrial refrigeration environments."
                      </p>
                    </div>
                    <div className="lg:col-span-3">
                      <p className="text-sm leading-relaxed text-gray-600 mb-6 font-medium">
                        Built on proven NVIDIA Jetson Orin compute modules and Veratori's proprietary V1 Sensor housing, this approach ensures operational continuity during planned or unplanned kitchen outages. By bonding these spatial domains, it guarantees seamless failover and uninterrupted inventory updates.
                      </p>
                      <p className="text-sm leading-relaxed text-gray-600 mb-8">
                        With this blueprint, food service operators, franchise owners, and supply chain architects can move beyond basic counts and design workflows that guarantee zero-waste production.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href="/documents/lidar-paper.pdf"
                          target="_blank"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sage text-white font-bold rounded-lg hover:bg-sage-dark transition-all shadow-md group"
                        >
                          Read Full Research <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button
                          onClick={() => setIsPaperOpen(false)}
                          className="px-6 py-3 border border-gray-200 text-gray-500 font-bold rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                        >
                          Collapse Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════ PAGE ASSEMBLY ═══════════════════ */
export default function MissionPage() {
  const { isDark } = useTheme();
  return (
    <main className={isDark ? "bg-black text-white" : "bg-white text-black"}>

      {/* Page Header */}
      <section className={`pt-28 pb-14 border-b ${isDark ? "border-white/5" : "border-black/5"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Impact</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6">
              Food waste is a<br />
              <span className="text-sage">solvable problem</span>
            </h1>
            <p className={`text-lg max-w-2xl leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
              One-third of all food produced globally is wasted. For restaurants, the number is even higher. We're building the infrastructure to change that, starting with the cooler.
            </p>
          </motion.div>
        </div>
      </section>

      <Pillars />

      {/* Context section */}
      <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
            <Image
              src="/images/assets/mission-hero.png"
              alt="Environmental impact"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-midnight/30" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              If food waste were a country, it would be the third-largest greenhouse gas emitter on Earth.
            </h2>
            <p className={`text-base leading-relaxed mb-5 ${isDark ? "text-white/55" : "text-black/55"}`}>
              Food waste generates 8% of global greenhouse gas emissions — more than the entire aviation industry. At the restaurant level, that waste starts in the walk-in cooler.
            </p>
            <p className={`text-base leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
              At Veratori, every line of code is written with one question in mind: <em>does this help reduce waste?</em>
            </p>
          </div>
        </div>
      </section>

      <DataFlowSection />

      <ROICalculator />

      <Research />

    </main>
  );
}
