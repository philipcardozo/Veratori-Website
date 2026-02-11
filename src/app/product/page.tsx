"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, TrendingDown, Boxes, Bell, BarChart3, LayoutDashboard, ShieldCheck, BrainCircuit, ShieldAlert, ScanLine, Zap } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import SectionHeading from "@/components/SectionHeading";
import InfiniteMarquee from "@/components/InfiniteMarquee";

const Warehouse3D = dynamic(() => import("@/components/Warehouse3D"), { ssr: false });
const ObjectDetection = dynamic(() => import("@/components/ObjectDetection"), { ssr: false });

/* ═══════════════════════════════════════════════════════
   PRODUCT HERO — Professional, wide breathing room
   ═══════════════════════════════════════════════════════ */
const screenshots = [
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", alt: "Analytics dashboard" },
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", alt: "Inventory overview" },
  { src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80", alt: "Real-time monitoring" },
  { src: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80", alt: "Warehouse view" },
  { src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", alt: "Logistics tracking" },
  { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", alt: "Security panel" },
];

function ProductHero() {
  const { isDark } = useTheme();
  return (
    <section className="relative pt-36 sm:pt-44 pb-24 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="absolute top-32 right-[-8rem] w-[500px] h-[500px] rounded-full bg-electric/[0.04] blur-[120px]" />
      <div className="absolute bottom-0 left-[-6rem] w-[400px] h-[400px] rounded-full bg-sage/[0.04] blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text block */}
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-semibold text-electric uppercase tracking-[0.2em] mb-5"
          >
            Product
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.08] ${
              isDark ? "text-white" : "text-midnight"
            }`}
          >
            The Platform That{" "}
            <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">
              Sees Everything
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
              isDark ? "text-white/50" : "text-midnight/50"
            }`}
          >
            Real-time inventory intelligence that prevents waste and maximizes
            efficiency — built for operations teams who demand precision.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-electric text-white text-sm font-semibold rounded-xl glow-electric glow-electric-hover transition-all duration-300 cursor-pointer"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link href="/mission">
              <motion.span
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-sage text-white text-sm font-semibold rounded-xl glow-sage glow-sage-hover transition-all duration-300 cursor-pointer"
              >
                Our Mission
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Infinite screenshot carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-20"
        >
          <InfiniteMarquee speed={35}>
            {screenshots.map((s, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[300px] sm:w-[400px] h-[200px] sm:h-[260px] mx-3 rounded-2xl overflow-hidden border relative group ${
                  isDark
                    ? "border-white/[0.06]"
                    : "border-midnight/[0.06] shadow-lg"
                }`}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="400px"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 ${
                    isDark
                      ? "bg-gradient-to-t from-midnight/80 to-transparent"
                      : "bg-gradient-to-t from-white/80 to-transparent"
                  }`}
                >
                  <span className={`text-sm font-medium ${isDark ? "text-white" : "text-midnight"}`}>
                    {s.alt}
                  </span>
                </div>
              </div>
            ))}
          </InfiniteMarquee>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   WASTE COMPARISON — Refined professional chart bars
   ═══════════════════════════════════════════════════════ */
const wasteStages = [
  { label: "Harvest", desc: "Post-harvest handling & storage losses", beforePct: 100, afterPct: 100 },
  { label: "Processing", desc: "Quality sorting, trimming, and preparation", beforePct: 85, afterPct: 96 },
  { label: "Distribution", desc: "Cold chain logistics & transport", beforePct: 72, afterPct: 93 },
  { label: "Retail", desc: "Shelf management & expiration tracking", beforePct: 60, afterPct: 90 },
  { label: "Consumer", desc: "End-user availability and freshness", beforePct: 45, afterPct: 85 },
];

function CountUpNum({ target, inView, suffix = "%" }: { target: number; inView: boolean; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span>{val}{suffix}</span>;
}

function WasteComparison() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-midnight to-midnight-light" : "bg-gradient-to-b from-mist to-white"}`} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Waste Reduction"
          title="Where Food Is Lost —"
          highlight="And How We Save It"
          subtitle="Scroll-triggered visualization comparing industry averages with Veratori-optimized supply chains."
        />

        <div ref={ref} className="space-y-16 mt-4">
          {/* ── Before: Industry Average ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <h3 className={`text-base font-semibold ${isDark ? "text-white/70" : "text-midnight/70"}`}>
                Without Veratori
                <span className="text-red-400 ml-2 font-normal text-sm">(Industry Average)</span>
              </h3>
            </div>
            <div className="space-y-4">
              {wasteStages.map((s, i) => (
                <div key={`before-${s.label}`} className="flex items-center gap-4">
                  <div className={`w-28 shrink-0 text-right ${isDark ? "text-white/50" : "text-midnight/50"}`}>
                    <p className="text-sm font-medium">{s.label}</p>
                  </div>
                  <div className="flex-1">
                    <div className={`h-9 rounded-lg overflow-hidden ${isDark ? "bg-white/[0.04]" : "bg-midnight/[0.04]"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${s.beforePct}%` } : {}}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="h-full rounded-lg bg-gradient-to-r from-red-500/80 to-red-400/60 flex items-center justify-end pr-3"
                      >
                        <span className="text-white/90 text-xs font-semibold">
                          <CountUpNum target={s.beforePct} inView={inView} />
                        </span>
                      </motion.div>
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? "text-white/25" : "text-midnight/25"}`}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Transition indicator ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="flex justify-center"
          >
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${isDark ? "bg-electric/10 text-electric" : "bg-electric/10 text-electric"}`}>
              <TrendingDown className="w-4 h-4" />
              With Veratori — optimized at every stage
            </div>
          </motion.div>

          {/* ── After: Veratori Optimized ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-sage" />
              <h3 className={`text-base font-semibold ${isDark ? "text-white/70" : "text-midnight/70"}`}>
                With Veratori
                <span className="text-sage ml-2 font-normal text-sm">(Optimized)</span>
              </h3>
            </div>
            <div className="space-y-4">
              {wasteStages.map((s, i) => (
                <div key={`after-${s.label}`} className="flex items-center gap-4">
                  <div className={`w-28 shrink-0 text-right ${isDark ? "text-white/50" : "text-midnight/50"}`}>
                    <p className="text-sm font-medium">{s.label}</p>
                  </div>
                  <div className="flex-1">
                    <div className={`h-9 rounded-lg overflow-hidden ${isDark ? "bg-white/[0.04]" : "bg-midnight/[0.04]"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${s.afterPct}%` } : {}}
                        transition={{ delay: i * 0.1 + 1.3, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="h-full rounded-lg bg-gradient-to-r from-sage to-sage-light flex items-center justify-end pr-3"
                      >
                        <span className="text-white/90 text-xs font-semibold">
                          <CountUpNum target={s.afterPct} inView={inView} />
                        </span>
                      </motion.div>
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? "text-white/25" : "text-midnight/25"}`}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   DETAILED FEATURES — Same grid, lucide icons
   ═══════════════════════════════════════════════════════ */
const features: { title: string; desc: string; accent: "sage" | "electric" | "sky"; Icon: typeof Boxes; img: string }[] = [
  { title: "Ethical Core", desc: "Built on sustainability-first principles, every optimization reduces food waste and supports ethical supply chain practices.", accent: "sage", Icon: TrendingDown, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" },
  { title: "Smart Space Optimization", desc: "AI-powered algorithms maximize storage efficiency, reduce clutter, and ensure every square foot works harder.", accent: "electric", Icon: Boxes, img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80" },
  { title: "High-Contrast Alerts", desc: "Never miss an expiration date or threshold with real-time, visually distinct notifications for speed and clarity.", accent: "electric", Icon: Bell, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" },
  { title: "Real-Time Analytics", desc: "Comprehensive dashboards with live data feeds, predictive insights, and waste reduction metrics for smarter decisions.", accent: "sage", Icon: BarChart3, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" },
  { title: "Decluttered Efficiency", desc: "Streamlined interfaces and workflows eliminate noise, letting your team focus on precision and productivity.", accent: "sky", Icon: LayoutDashboard, img: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80" },
  { title: "Secure & Compliant", desc: "Enterprise-grade encryption, GDPR compliance, and role-based access ensure your inventory data remains protected.", accent: "electric", Icon: ShieldCheck, img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80" },
];

const aMap: Record<string, { bg: string; text: string; bar: string }> = {
  sage: { bg: "bg-sage/10", text: "text-sage", bar: "bg-sage" },
  electric: { bg: "bg-electric/10", text: "text-electric", bar: "bg-electric" },
  sky: { bg: "bg-sky/10", text: "text-sky", bar: "bg-sky" },
};

function FeatureGrid() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Features"
          title="Everything You Need."
          highlight="Nothing You Don't."
          subtitle="Purpose-built tools for ethical inventory management at scale."
        />
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => {
            const a = aMap[f.accent];
            return (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative rounded-2xl overflow-hidden border card-tilt ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:shadow-xl"
                    : "bg-white border-midnight/[0.06] hover:shadow-xl"
                } transition-all duration-300`}
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={f.img}
                    alt={f.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width:768px)100vw,(max-width:1024px)50vw,33vw"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isDark
                        ? "bg-gradient-to-t from-midnight via-midnight/60 to-transparent"
                        : "bg-gradient-to-t from-white via-white/60 to-transparent"
                    }`}
                  />
                </div>
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${a.bg} ${a.text}`}>
                    <f.Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-midnight"}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/45" : "text-midnight/45"}`}>
                    {f.desc}
                  </p>
                </div>
                <div className={`h-[3px] w-0 group-hover:w-full transition-all duration-500 ${a.bar}`} />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   3D WAREHOUSE
   ═══════════════════════════════════════════════════════ */
function Warehouse3DSection() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-28 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-midnight to-midnight-light" : "bg-gradient-to-b from-mist to-white"}`} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Visualize"
          title="See Your Warehouse in"
          highlight="3D"
          subtitle="Interactive spatial intelligence gives you a bird's-eye view of every shelf."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl overflow-hidden border h-[400px] sm:h-[500px] ${
            isDark ? "bg-midnight-light border-white/[0.06]" : "bg-white border-midnight/[0.06] shadow-xl"
          }`}
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <span className={isDark ? "text-white/30" : "text-midnight/30"}>Loading 3D…</span>
              </div>
            }
          >
            <Warehouse3D />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   ADVANCED INTELLIGENCE — Predictive, Security, LiDAR
   ═══════════════════════════════════════════════════════ */
const intelligenceCards = [
  {
    title: "AI Predictive Analytics",
    desc: "Anticipate sales and revenue with AI-driven forecasting tailored for food retail. Reduce overstock, minimize waste, and optimize ordering based on real-time trends, seasonality, and historical data.",
    Icon: BrainCircuit,
    accent: "sage" as const,
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80",
  },
  {
    title: "24/7 AI-Powered Security",
    desc: "Transform existing cameras into intelligent monitors. Continuous anomaly detection, intrusion alerts, and operational oversight for total warehouse security without additional hardware.",
    Icon: ShieldAlert,
    accent: "electric" as const,
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&q=80",
  },
  {
    title: "LiDAR Integration",
    desc: "Precise 3D spatial mapping for accurate inventory volume measurement, automated rack scanning, and optimized space utilization. Bird\u2019s-eye accuracy meets real-world efficiency.",
    Icon: ScanLine,
    accent: "sky" as const,
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&q=80",
  },
];

const intelligenceStats = [
  { value: 40, suffix: "%", label: "Waste Reduction" },
  { value: 95, suffix: "%+", label: "Forecast Accuracy" },
  { value: 3, suffix: "x", label: "Faster Scanning" },
  { value: 24, suffix: "/7", label: "Security Coverage" },
];

function AdvancedIntelligence() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-electric/[0.03] blur-[160px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Advanced Intelligence"
          title="Predictive Insights &"
          highlight="Spatial Precision"
          subtitle="AI forecasting, real-time security monitoring, and LiDAR-powered 3D mapping — integrated into one platform."
        />

        {/* Cards */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {intelligenceCards.map((c, i) => {
            const accentMap = {
              sage: { bg: "bg-sage/10", text: "text-sage", bar: "bg-sage" },
              electric: { bg: "bg-electric/10", text: "text-electric", bar: "bg-electric" },
              sky: { bg: "bg-sky/10", text: "text-sky", bar: "bg-sky" },
            };
            const a = accentMap[c.accent];
            return (
              <motion.article
                key={c.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`group relative rounded-2xl overflow-hidden border card-tilt ${
                  isDark
                    ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:shadow-xl"
                    : "bg-white border-midnight/[0.06] hover:shadow-xl"
                } transition-all duration-300`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width:1024px)100vw,33vw"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isDark
                        ? "bg-gradient-to-t from-midnight via-midnight/60 to-transparent"
                        : "bg-gradient-to-t from-white via-white/60 to-transparent"
                    }`}
                  />
                </div>
                <div className="p-6">
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${a.bg} ${a.text}`}
                  >
                    <c.Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 ${
                      isDark ? "text-white" : "text-midnight"
                    }`}
                  >
                    {c.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? "text-white/45" : "text-midnight/45"
                    }`}
                  >
                    {c.desc}
                  </p>
                </div>
                <div
                  className={`h-[3px] w-0 group-hover:w-full transition-all duration-500 ${a.bar}`}
                />
              </motion.article>
            );
          })}
        </div>

        {/* Combined benefits stats bar */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border ${
            isDark
              ? "bg-white/[0.02] border-white/[0.06]"
              : "bg-white border-midnight/[0.06] shadow-md"
          }`}
        >
          {intelligenceStats.map((s, i) => (
            <div key={s.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Zap
                  className={`w-3.5 h-3.5 ${
                    i % 2 === 0 ? "text-sage" : "text-electric"
                  }`}
                  strokeWidth={2}
                />
                <span
                  className={`text-2xl sm:text-3xl font-bold ${
                    i % 2 === 0 ? "text-sage" : "text-electric"
                  }`}
                >
                  <CountUpNum target={s.value} inView={statsInView} suffix={s.suffix} />
                </span>
              </div>
              <p
                className={`text-xs font-medium ${
                  isDark ? "text-white/40" : "text-midnight/40"
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TF.js DETECTION DEMO
   ═══════════════════════════════════════════════════════ */
function DetectionSection() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-28 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Live Demo"
          title="AI-Powered"
          highlight="Object Detection"
          subtitle="Experience real-time inventory recognition using TensorFlow.js — runs entirely in your browser."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl overflow-hidden border ${
            isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-midnight/[0.06] shadow-xl"
          }`}
        >
          <Suspense
            fallback={
              <div className="h-[450px] flex items-center justify-center">
                <span className={isDark ? "text-white/30" : "text-midnight/30"}>Loading AI model…</span>
              </div>
            }
          >
            <ObjectDetection />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD MOCK
   ═══════════════════════════════════════════════════════ */
function DashboardMockup() {
  const { isDark } = useTheme();
  const alerts = [
    { text: "Dairy section: 23 items expiring in 48 h", color: "bg-yellow-400" },
    { text: "Produce waste down 12% this week", color: "bg-sage" },
    { text: "Warehouse B at 92% capacity", color: "bg-electric" },
    { text: "New shipment received — 340 items scanned", color: "bg-sage" },
  ];

  return (
    <section className="relative py-28 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-midnight-light to-midnight" : "bg-gradient-to-b from-white to-mist"}`} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Dashboard"
          title="Command Center at a"
          highlight="Glance"
          subtitle="Live alerts, analytics, and insights — all in one view."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl border p-6 sm:p-8 ${
            isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-midnight/[0.06] shadow-xl"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse" />
            <span className={`text-sm font-medium ${isDark ? "text-white/60" : "text-midnight/60"}`}>
              System Online — All modules operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Items", value: "12,847", change: "+2.3%", color: "text-sage" },
              { label: "Waste Rate", value: "4.2%", change: "−18%", color: "text-electric" },
              { label: "Space Used", value: "91%", change: "+3%", color: "text-sky" },
            ].map((m) => (
              <div key={m.label} className={`p-4 rounded-xl ${isDark ? "bg-white/[0.04]" : "bg-mist"}`}>
                <p className={`text-xs ${isDark ? "text-white/35" : "text-midnight/35"}`}>{m.label}</p>
                <p className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-midnight"}`}>{m.value}</p>
                <p className={`text-xs font-medium mt-1 ${m.color}`}>{m.change} this week</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {alerts.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 3 }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-default ${
                  isDark ? "bg-white/[0.04] hover:bg-white/[0.06]" : "bg-mist hover:bg-mist-dark"
                } transition-all`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.color}`} />
                <span className={`text-sm ${isDark ? "text-white/60" : "text-midnight/60"}`}>{a.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE ASSEMBLY
   ═══════════════════════════════════════════════════════ */
export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <WasteComparison />
      <FeatureGrid />
      <Warehouse3DSection />
      <AdvancedIntelligence />
      <DetectionSection />
      <DashboardMockup />
    </>
  );
}
