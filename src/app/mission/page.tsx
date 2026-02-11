"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  BarChart3,
  ShieldCheck,
  Bell,
  LayoutDashboard,
  Globe,
  ArrowRight,
  Target,
  Recycle,
  FileBarChart,
  Handshake,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import SectionHeading from "@/components/SectionHeading";
import InfiniteMarquee from "@/components/InfiniteMarquee";

/* ═══════════════════════════════════════════════════════
   HERO — Clean immersive video, professional text
   ═══════════════════════════════════════════════════════ */
function MissionHero() {
  const { isDark } = useTheme();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 600], [0, 120]);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: yBg }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3196049/3196049-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className={`video-overlay ${isDark ? "dark" : "light"}`} />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs sm:text-sm font-semibold text-sage uppercase tracking-[0.2em] mb-5">
            Our Mission
          </p>
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight leading-[1.1] ${
              isDark ? "text-white" : "text-midnight"
            }`}
          >
            Ethical Operations.{" "}
            <span className="text-sage">Zero Waste.</span>
          </h1>
          <p
            className={`mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-white/55" : "text-midnight/55"
            }`}
          >
            We build technology that proves efficiency and responsibility are not
            at odds — they are inseparable.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 1 — Core Mission Statement
   ═══════════════════════════════════════════════════════ */
function MissionStatement() {
  const { isDark } = useTheme();

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs sm:text-sm font-semibold text-electric uppercase tracking-[0.2em] mb-5">
            Why We Exist
          </p>
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight mb-8 ${
              isDark ? "text-white" : "text-midnight"
            }`}
          >
            A Conviction, Not a Feature
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`text-base sm:text-lg leading-[1.85] space-y-6 ${
            isDark ? "text-white/55" : "text-midnight/55"
          }`}
        >
          <p>
            Every year, roughly{" "}
            <span className="text-sage font-semibold">
              1.3 billion tons of food
            </span>{" "}
            are lost or wasted globally — one-third of everything produced for
            human consumption. This waste is not only an economic failure; it is
            an ethical one.
          </p>
          <p>
            Veratori was founded on the belief that inventory management
            technology should be a force for good. Our platform combines{" "}
            <span className={`font-semibold ${isDark ? "text-white/80" : "text-midnight/80"}`}>
              precision, security, and sustainability
            </span>{" "}
            to give food retail and logistics teams the visibility they need to
            make waste unacceptable — and preventable.
          </p>
          <p>
            We measure success not only in efficiency gains but in the
            measurable reduction of spoilage, the extension of product
            lifecycles, and the communities we help feed instead of landfills.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 2 — Impact Stats Grid
   ═══════════════════════════════════════════════════════ */
const impactStats = [
  { value: 40, suffix: "%", label: "Average Waste Reduction" },
  { value: 3.2, suffix: "M", label: "Pounds of Food Saved" },
  { value: 94, suffix: "%", label: "Optimized Space Utilization" },
  { value: 680, suffix: "K", label: "Tons of CO\u2082 Prevented" },
  { value: 500, suffix: "+", label: "Enterprise Clients Worldwide" },
  { value: 99.9, suffix: "%", label: "Platform Uptime SLA" },
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
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Number((eased * target).toFixed(target % 1 === 0 ? 0 : 1)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

function ImpactStats() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-b from-midnight to-midnight-light"
            : "bg-gradient-to-b from-white to-mist"
        }`}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Impact"
          title="Numbers That"
          highlight="Matter"
          tagColor="text-sage"
          subtitle="Real data from real operations — the measurable difference Veratori delivers."
        />
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {impactStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`p-6 rounded-2xl text-center border ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.06]"
                  : "bg-white border-midnight/[0.06] shadow-sm"
              }`}
            >
              <p className="text-sage text-3xl sm:text-4xl font-bold">
                <CountUp target={s.value} suffix={s.suffix} inView={inView} />
              </p>
              <p
                className={`mt-2 text-sm leading-snug ${
                  isDark ? "text-white/40" : "text-midnight/40"
                }`}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 3 — How We Achieve It (Staggered Cards)
   ═══════════════════════════════════════════════════════ */
const pillars = [
  {
    title: "Ethical Core",
    desc: "Every algorithm and feature is designed with sustainability as the primary constraint, not an afterthought.",
    Icon: Leaf,
    color: "text-sage",
    bg: "bg-sage/10",
  },
  {
    title: "Real-Time Alerts",
    desc: "High-contrast, visually distinct notifications ensure no expiration date or threshold is ever missed.",
    Icon: Bell,
    color: "text-electric",
    bg: "bg-electric/10",
  },
  {
    title: "Decluttered Interfaces",
    desc: "Clean workflows eliminate noise and cognitive load, letting teams focus entirely on precision operations.",
    Icon: LayoutDashboard,
    color: "text-sky",
    bg: "bg-sky/10",
  },
  {
    title: "Predictive Analytics",
    desc: "Machine learning models forecast demand, spoilage risk, and optimal reorder points before problems arise.",
    Icon: BarChart3,
    color: "text-sage",
    bg: "bg-sage/10",
  },
  {
    title: "Enterprise Security",
    desc: "End-to-end encryption, role-based access, and full GDPR compliance protect your data at every layer.",
    Icon: ShieldCheck,
    color: "text-electric",
    bg: "bg-electric/10",
  },
  {
    title: "Global Scale",
    desc: "Multi-region infrastructure and localized workflows serve 500+ enterprises across 30 countries seamlessly.",
    Icon: Globe,
    color: "text-sky",
    bg: "bg-sky/10",
  },
];

function HowWeAchieveIt() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Approach"
          title="How We"
          highlight="Achieve It"
          subtitle="Six pillars that define how Veratori turns ethical ambition into operational reality."
        />
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:translate-y-[-4px] ${
                isDark
                  ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:shadow-lg"
                  : "bg-white border-midnight/[0.06] hover:shadow-lg"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${p.bg} ${p.color}`}
              >
                <p.Icon className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <h3
                className={`text-base font-bold mb-2 ${
                  isDark ? "text-white" : "text-midnight"
                }`}
              >
                {p.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-white/45" : "text-midnight/45"
                }`}
              >
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 4 — Sustainability Commitment
   ═══════════════════════════════════════════════════════ */
const commitments = [
  { Icon: Target, label: "Carbon Neutral Operations" },
  { Icon: Recycle, label: "Zero-Waste Supply Chain Goal" },
  { Icon: FileBarChart, label: "Transparent Impact Reporting" },
  { Icon: Handshake, label: "Community Food Bank Partnerships" },
];

function SustainabilityCommitment() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      className="relative py-28 sm:py-36 overflow-hidden"
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-b from-midnight-light to-midnight"
            : "bg-gradient-to-b from-white to-mist"
        }`}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs sm:text-sm font-semibold text-sage uppercase tracking-[0.2em] mb-4">
            Sustainability
          </p>
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight mb-6 ${
              isDark ? "text-white" : "text-midnight"
            }`}
          >
            Responsibility Is{" "}
            <span className="text-sage">Non-Negotiable</span>
          </h2>
          <div
            className={`space-y-5 text-base leading-[1.85] ${
              isDark ? "text-white/55" : "text-midnight/55"
            }`}
          >
            <p>
              Food waste generates{" "}
              <span className="text-electric font-semibold">
                8% of global greenhouse gas emissions
              </span>
              . If it were a country, it would be the third-largest emitter on
              Earth.
            </p>
            <p>
              At Veratori, every line of code is written with one question:{" "}
              <em
                className={`font-medium ${
                  isDark ? "text-white/75" : "text-midnight/75"
                }`}
              >
                does this help reduce waste?
              </em>{" "}
              Our commitment to sustainability is embedded in our architecture,
              our algorithms, and our culture.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {commitments.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className={`flex items-center gap-3 p-3.5 rounded-xl ${
                  isDark ? "bg-white/[0.04]" : "bg-midnight/[0.04]"
                }`}
              >
                <c.Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isDark ? "text-sage" : "text-sage"
                  }`}
                  strokeWidth={1.8}
                />
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-white/65" : "text-midnight/65"
                  }`}
                >
                  {c.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image with parallax */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.div
            style={{ y: imgY }}
            className="relative h-[420px] rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80"
              alt="Sustainable fresh food display"
              fill
              className="object-cover"
              sizes="50vw"
              loading="lazy"
            />
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-t from-midnight/40 to-transparent"
                  : "bg-gradient-to-t from-white/20 to-transparent"
              }`}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   BEFORE / AFTER SLIDER — Retained, professional
   ═══════════════════════════════════════════════════════ */
function BeforeAfterSlider() {
  const { isDark } = useTheme();
  const [position, setPosition] = useState(50);

  return (
    <section className="relative py-28 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Visual Impact"
          title="Before & After"
          highlight="Veratori"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[450px] before-after-slider"
        >
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80"
            alt="Warehouse before optimization"
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
          />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80"
              alt="Warehouse after Veratori optimization"
              fill
              className="object-cover"
              sizes="100vw"
              loading="lazy"
            />
          </div>
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-electric z-20 shadow-[0_0_12px_rgba(38,64,206,0.5)]"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-electric flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
          </div>
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/80 text-white z-20">
            Before
          </span>
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-sage/80 text-white z-20">
            After
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-30"
            aria-label="Before and after comparison slider"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   QUOTE CAROUSEL — Minimal, tasteful
   ═══════════════════════════════════════════════════════ */
const quotes = [
  { text: "The greatest threat to our planet is the belief that someone else will save it.", author: "Robert Swan" },
  { text: "Waste is a design flaw.", author: "Kate Krebs" },
  { text: "Sustainability is no longer about doing less harm. It\u2019s about doing more good.", author: "Jochen Zeitz" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
];

function QuoteCarousel() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-16 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight-light" : "bg-white"}`} />
      <div className="relative z-10">
        <InfiniteMarquee speed={50}>
          {quotes.map((q, i) => (
            <div key={i} className="flex-shrink-0 mx-10 max-w-sm">
              <blockquote
                className={`text-lg italic leading-relaxed ${
                  isDark ? "text-white/25" : "text-midnight/25"
                }`}
              >
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <p
                className={`text-sm font-medium mt-2 ${
                  isDark ? "text-white/15" : "text-midnight/15"
                }`}
              >
                — {q.author}
              </p>
            </div>
          ))}
        </InfiniteMarquee>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════ */
function FinalCTA() {
  const { isDark } = useTheme();
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sage/[0.06] blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? "text-white" : "text-midnight"
          }`}
        >
          Join the Movement for{" "}
          <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">
            Zero Waste
          </span>
        </h2>
        <p
          className={`text-base sm:text-lg mb-10 leading-relaxed ${
            isDark ? "text-white/50" : "text-midnight/50"
          }`}
        >
          Every business that joins Veratori makes the global food system more
          efficient and more ethical.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <motion.span
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold rounded-xl glow-electric glow-electric-hover transition-all duration-300 cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
          <Link href="/product">
            <motion.span
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block px-8 py-4 border border-electric/20 text-electric rounded-xl font-semibold hover:bg-electric/[0.06] transition-all duration-300 cursor-pointer"
            >
              Explore the Platform
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE ASSEMBLY
   ═══════════════════════════════════════════════════════ */
export default function MissionPage() {
  return (
    <>
      <MissionHero />
      <MissionStatement />
      <ImpactStats />
      <HowWeAchieveIt />
      <SustainabilityCommitment />
      <BeforeAfterSlider />
      <QuoteCarousel />
      <FinalCTA />
    </>
  );
}
