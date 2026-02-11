"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BrainCircuit, ShieldAlert, ScanLine, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import SectionHeading from "@/components/SectionHeading";
import InfiniteMarquee from "@/components/InfiniteMarquee";

const Warehouse3D = dynamic(() => import("@/components/Warehouse3D"), { ssr: false });

/* ═══════════════════════ PARTICLES ═══════════════════════ */
function Particles({ count = 40 }: { count?: number }) {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; dur: number; delay: number; color: string }[]
  >([]);
  useEffect(() => {
    const c = ["rgba(38,64,206,.3)", "rgba(95,151,79,.25)", "rgba(171,206,225,.2)", "rgba(255,255,255,.1)"];
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        dur: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        color: c[Math.floor(Math.random() * c.length)],
      }))
    );
  }, [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [0, -30, -15, -40, 0], x: [0, 15, -10, 20, 0], opacity: [0.2, 0.7, 0.4, 0.8, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════ KINETIC HEADLINE ═══════════════════ */
function KineticHeadline({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, wI) => (
        <span key={wI} className="inline-block mr-[0.3em]">
          {word.split("").map((ch, cI) => (
            <motion.span
              key={`${wI}-${cI}`}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: wI * 0.12 + cI * 0.03 + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/* ═══════════════════════ HERO ═══════════════════════ */
function Hero() {
  const { isDark } = useTheme();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.1]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: yBg, scale }}>
        <video
          autoPlay muted loop playsInline
          poster="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/5532764/5532764-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>
        <div className={`video-overlay ${isDark ? "dark" : "light"}`} />
      </motion.div>

      <Particles count={50} />

      <div className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "white" : "#0E1526"} 1px, transparent 0)`, backgroundSize: "40px 40px" }} />

      <motion.div style={{ opacity }} className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium ${isDark ? "bg-white/5 border border-white/10 text-white/80" : "bg-midnight/5 border border-midnight/10 text-midnight/80"}`}>
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          Ethical Inventory Management Platform
        </motion.div>

        <KineticHeadline
          text="Veratori: Ethical Inventory. Zero Waste. Precision."
          className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 ${isDark ? "text-white" : "text-midnight"}`}
        />

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${isDark ? "text-white/60" : "text-midnight/60"}`}>
          A secure, reliable platform that reduces food waste, optimizes space, and empowers precise operations for food retail and logistics worldwide.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/product">
            <motion.span whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block px-8 py-4 bg-electric text-white font-semibold rounded-xl text-base sm:text-lg glow-electric glow-electric-hover transition-all duration-300 cursor-pointer">
              Explore Product
            </motion.span>
          </Link>
          <Link href="/mission">
            <motion.span whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block px-8 py-4 bg-sage text-white font-semibold rounded-xl text-base sm:text-lg glow-sage glow-sage-hover transition-all duration-300 cursor-pointer">
              Our Mission
            </motion.span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-16">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className={`w-6 h-10 rounded-full border-2 mx-auto flex justify-center pt-2 ${isDark ? "border-white/20" : "border-midnight/20"}`}>
            <motion.div animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/50" : "bg-midnight/50"}`} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════ KEY CAPABILITIES ═══════════════════ */
const capabilities = [
  {
    title: "Predictive Analytics",
    desc: "AI-driven forecasting anticipates demand, reduces overstock, and minimizes waste based on real-time trends.",
    Icon: BrainCircuit,
    accent: "sage",
    href: "/product",
  },
  {
    title: "LiDAR 3D Mapping",
    desc: "Precise spatial scanning for accurate volume measurement, rack optimization, and real-time space utilization.",
    Icon: ScanLine,
    accent: "electric",
    href: "/product",
  },
  {
    title: "24/7 AI Monitoring",
    desc: "Transform existing cameras into intelligent security systems with continuous anomaly detection and alerts.",
    Icon: ShieldAlert,
    accent: "sky",
    href: "/product",
  },
];

function KeyCapabilities() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const accentMap: Record<string, { bg: string; text: string; bar: string }> = {
    sage: { bg: "bg-sage/10", text: "text-sage", bar: "bg-sage" },
    electric: { bg: "bg-electric/10", text: "text-electric", bar: "bg-electric" },
    sky: { bg: "bg-sky/10", text: "text-sky", bar: "bg-sky" },
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Capabilities"
          title="Intelligent Tools for"
          highlight="Modern Operations"
          subtitle="Three pillars of technology that set Veratori apart."
        />
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((c, i) => {
            const a = accentMap[c.accent];
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <Link href={c.href} className="block group">
                  <div
                    className={`rounded-2xl border p-6 transition-all duration-300 card-tilt ${
                      isDark
                        ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:shadow-xl"
                        : "bg-white border-midnight/[0.06] hover:shadow-xl"
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${a.bg} ${a.text}`}>
                      <c.Icon className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-midnight"}`}>
                      {c.title}
                    </h3>
                    <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-white/50" : "text-midnight/50"}`}>
                      {c.desc}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${a.text} group-hover:gap-2.5 transition-all`}>
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <div className={`mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${a.bar}`} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ 3D WAREHOUSE VISUALIZATION ═══════════════════ */
function WarehouseVisualization() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-midnight-light to-midnight" : "bg-gradient-to-b from-white to-mist"}`} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Spatial Intelligence"
          title="See Your Warehouse in"
          highlight="3D"
          subtitle="Interactive spatial intelligence gives you a bird\u2019s-eye view of every shelf. Hover shelves to inspect stock levels."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl overflow-hidden border h-[380px] sm:h-[480px] ${
            isDark ? "bg-midnight-light border-white/[0.06]" : "bg-white border-midnight/[0.06] shadow-xl"
          }`}
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-electric/30 border-t-electric rounded-full animate-spin" />
                  <span className={isDark ? "text-white/30 text-sm" : "text-midnight/30 text-sm"}>Loading 3D warehouse...</span>
                </div>
              </div>
            }
          >
            <Warehouse3D />
          </Suspense>
        </motion.div>
        <div className="text-center mt-8">
          <Link href="/product">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-6 py-3 border border-electric/30 text-electric rounded-xl text-sm font-medium hover:bg-electric/10 transition-colors cursor-pointer"
            >
              Explore Full Product <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ FEATURE TEASER ═══════════════════ */
const teaserFeatures = [
  { title: "Ethical Core", desc: "Sustainability-first practices reducing food waste across every link.", accent: "sage", icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" },
  { title: "Smart Alerts", desc: "High-contrast real-time notifications for expirations and thresholds.", accent: "electric", icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" },
  { title: "Space Optimization", desc: "AI algorithms maximize storage efficiency and declutter operations.", accent: "sky", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80" },
  { title: "Secure & Reliable", desc: "Enterprise-grade encryption and 99.9 % uptime for total peace of mind.", accent: "electric", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80" },
];

function FeatureTeaser() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const accentColor: Record<string, string> = { sage: "bg-sage/10 text-sage border-sage/20", electric: "bg-electric/10 text-electric border-electric/20", sky: "bg-sky/10 text-sky border-sky/20" };
  const accentBar: Record<string, string> = { sage: "bg-sage", electric: "bg-electric", sky: "bg-sky" };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-midnight via-midnight-light/50 to-midnight" : "bg-gradient-to-b from-mist via-white to-mist"}`} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Features" title="Built for Precision." highlight="Designed for Impact." subtitle="Every feature engineered to reduce waste, optimize operations, and uphold ethical standards." />
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teaserFeatures.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden border card-tilt ${isDark ? "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]" : "bg-white border-midnight/5 hover:shadow-xl"} transition-all duration-300`}
            >
              <div className="relative h-40 overflow-hidden">
                <Image src={f.img} alt={f.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width:640px) 100vw, 25vw" loading="lazy" />
                <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-midnight via-midnight/60 to-transparent" : "bg-gradient-to-t from-white via-white/60 to-transparent"}`} />
              </div>
              <div className="p-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${accentColor[f.accent]}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                </div>
                <h3 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-midnight"}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-midnight/50"}`}>{f.desc}</p>
              </div>
              <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 ${accentBar[f.accent]}`} />
            </motion.article>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/product">
            <motion.span whileHover={{ scale: 1.05 }} className="inline-block px-6 py-3 border border-electric/30 text-electric rounded-xl text-sm font-medium hover:bg-electric/10 transition-colors cursor-pointer">
              See All Features →
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ IMPACT STATS ═══════════════════ */
const stats = [
  { value: 40, suffix: "%", label: "Avg Waste Reduction" },
  { value: 3.2, suffix: "M", label: "Pounds of Food Saved" },
  { value: 99.9, suffix: "%", label: "Platform Uptime" },
  { value: 500, suffix: "+", label: "Enterprise Clients" },
];

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Number((p * target).toFixed(target % 1 === 0 ? 0 : 1)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent text-4xl sm:text-5xl font-bold">{val}{suffix}</span>;
}

function ImpactStats() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <section className="relative py-20 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight-light" : "bg-white"}`} />
      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl ${isDark ? "bg-white/[0.03] border border-white/5" : "bg-mist border border-midnight/5 shadow-lg"}`}>
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }} className="text-center">
              <CountUp target={s.value} suffix={s.suffix} inView={inView} />
              <p className={`mt-2 text-sm font-medium ${isDark ? "text-white/40" : "text-midnight/40"}`}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════ TESTIMONIAL MARQUEE ═══════════════════ */
const testimonials = [
  { quote: "Veratori transformed our supply chain — 38 % waste reduction in Q1.", name: "Sarah Chen", role: "VP Ops, FreshMart" },
  { quote: "The precision alerts saved us hundreds of thousands in spoilage.", name: "Marcus Rodriguez", role: "Director, GreenChain" },
  { quote: "Ethical approach, clean design, and measurable impact from day one.", name: "Dr. Aisha Patel", role: "CSO, NutriGlobal" },
  { quote: "60 % → 94 % warehouse utilization. ROI within weeks.", name: "James Okonkwo", role: "CEO, AfriFood" },
  { quote: "Real-time analytics give our team superpowers.", name: "Elena Vasquez", role: "Ops Manager, Pacific Fresh" },
];

function TestimonialMarquee() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-20 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="relative z-10">
        <SectionHeading tag="Testimonials" title="Trusted by" highlight="Industry Leaders" />
        <InfiniteMarquee speed={40}>
          {testimonials.map((t, i) => (
            <div key={i} className={`flex-shrink-0 w-[340px] mx-4 p-6 rounded-2xl border ${isDark ? "bg-white/[0.03] border-white/5" : "bg-white border-midnight/5 shadow-md"}`}>
              <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-white/70" : "text-midnight/70"}`}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-midnight"}`}>{t.name}</p>
                <p className={`text-xs ${isDark ? "text-white/40" : "text-midnight/40"}`}>{t.role}</p>
              </div>
            </div>
          ))}
        </InfiniteMarquee>
      </div>
    </section>
  );
}

/* ═══════════════════ SCROLLYTELLING ═══════════════════ */
function Scrollytelling() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-midnight to-midnight-light" : "bg-gradient-to-b from-white to-mist"}`} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Images */}
        <div className="relative h-[500px]">
          <motion.div style={{ y: imgY1 }} className="absolute top-0 left-0 w-[70%] h-[60%] rounded-2xl overflow-hidden shadow-2xl">
            <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Cluttered warehouse before Veratori" fill className="object-cover" sizes="40vw" loading="lazy" />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white">Before</span>
          </motion.div>
          <motion.div style={{ y: imgY2 }} className="absolute bottom-0 right-0 w-[70%] h-[60%] rounded-2xl overflow-hidden shadow-2xl border-4 border-sage/30">
            <Image src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80" alt="Organized warehouse after Veratori" fill className="object-cover" sizes="40vw" loading="lazy" />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-sage/90 text-white">After</span>
          </motion.div>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-electric/10 blur-2xl" />
        </div>

        {/* Text */}
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="text-sm font-semibold text-sage uppercase tracking-widest">Transformation</span>
          <h2 className={`mt-4 text-3xl sm:text-4xl font-bold tracking-tight ${isDark ? "text-white" : "text-midnight"}`}>
            From Clutter to <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">Clarity</span>
          </h2>
          <div className={`mt-6 space-y-4 text-base leading-relaxed ${isDark ? "text-white/60" : "text-midnight/60"}`}>
            <p>Every year, <span className="text-sage font-semibold">1.3 billion tons of food</span> are wasted globally. Veratori turns disorganized shelves and blind spots into data-driven, optimized operations.</p>
            <p>Our platform provides <span className="text-electric font-semibold">real-time visibility</span> across your entire supply chain, reducing spoilage and maximizing every square foot of storage.</p>
          </div>
          <Link href="/mission" className="inline-block mt-8">
            <motion.span whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-xl font-medium glow-sage glow-sage-hover transition-all duration-300 cursor-pointer">
              Learn About Our Mission
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════ MISSION BLURB ═══════════════════ */
function MissionBlurb() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-24 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-midnight"}`}>
          Our Purpose Goes <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">Beyond Profit</span>
        </h2>
        <p className={`text-lg leading-relaxed mb-8 ${isDark ? "text-white/50" : "text-midnight/50"}`}>
          Veratori exists to prove that cutting-edge technology and ethical responsibility can coexist. Every algorithm we build, every alert we send, serves one goal: a world with zero food waste.
        </p>
        <Link href="/mission">
          <motion.span whileHover={{ scale: 1.05 }} className="inline-block px-8 py-4 bg-electric text-white font-semibold rounded-xl glow-electric glow-electric-hover transition-all duration-300 cursor-pointer">
            Discover Our Mission →
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}

/* ═══════════════════ PARTNER LOGOS MARQUEE ═══════════════════ */
const partners = ["FreshMart", "GreenChain", "NutriGlobal", "AfriFood", "Pacific Fresh", "EcoStore", "FarmLink", "UrbanHarvest"];

function PartnerLogos() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-12 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight-light" : "bg-white"}`} />
      <div className="relative z-10">
        <p className={`text-center text-xs font-semibold uppercase tracking-widest mb-8 ${isDark ? "text-white/30" : "text-midnight/30"}`}>Trusted by industry leaders</p>
        <InfiniteMarquee speed={25} direction="right">
          {partners.map((p) => (
            <span key={p} className={`mx-8 text-xl font-bold tracking-wider ${isDark ? "text-white/10" : "text-midnight/10"}`}>{p}</span>
          ))}
        </InfiniteMarquee>
      </div>
    </section>
  );
}

/* ═══════════════════ HOME PAGE ═══════════════════ */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerLogos />
      <KeyCapabilities />
      <FeatureTeaser />
      <ImpactStats />
      <WarehouseVisualization />
      <Scrollytelling />
      <TestimonialMarquee />
      <MissionBlurb />
    </>
  );
}
