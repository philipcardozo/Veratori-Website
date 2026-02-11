"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Fish,
  Flame,
  Cherry,
  Beef,
  Salad,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import SectionHeading from "@/components/SectionHeading";
import InfiniteMarquee from "@/components/InfiniteMarquee";

/* ═══════════════════════════════════════════════════════════
   HERO PARTICLES — Lightweight Framer Motion floating dots
   Only rendered inside the hero section for performance
   ═══════════════════════════════════════════════════════════ */
function HeroParticles({ count = 35 }: { count?: number }) {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      dur: number;
      delay: number;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    const colors = [
      "rgba(171,206,225,0.30)",
      "rgba(38,64,206,0.25)",
      "rgba(95,151,79,0.18)",
      "rgba(255,255,255,0.08)",
    ];
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3.5 + 1,
        dur: Math.random() * 10 + 8,
        delay: Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            y: [0, -20, -8, -28, 0],
            x: [0, 12, -8, 16, 0],
            opacity: [0.15, 0.6, 0.3, 0.7, 0.15],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO — Refined with gradient headline + particles
   ═══════════════════════════════════════════════════════════ */
function AboutHero() {
  const { isDark } = useTheme();

  return (
    <section className="relative pt-36 sm:pt-44 pb-24 overflow-hidden">
      {/* Ambient blurs */}
      <div className="absolute top-16 left-[-6rem] w-[420px] h-[420px] rounded-full bg-electric/[0.04] blur-[120px]" />
      <div className="absolute bottom-0 right-[-4rem] w-[350px] h-[350px] rounded-full bg-sage/[0.04] blur-[100px]" />

      {/* Subtle dot-grid pattern */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${
            isDark ? "rgba(255,255,255,0.5)" : "rgba(14,21,38,0.4)"
          } 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <HeroParticles count={40} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm font-semibold text-sage uppercase tracking-[0.2em] mb-5"
        >
          About Us
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.08] ${
            isDark ? "text-white" : "text-midnight"
          }`}
        >
          About{" "}
          <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">
            Veratori
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
            isDark ? "text-white/55" : "text-midnight/55"
          }`}
        >
          Building ethical, precise, and waste-free inventory intelligence.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-14"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-6 h-10 rounded-full border-2 mx-auto flex justify-center pt-2 ${
              isDark ? "border-white/15" : "border-midnight/15"
            }`}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full ${
                isDark ? "bg-white/40" : "bg-midnight/40"
              }`}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPANY STORY — Parallax images + polished text
   ═══════════════════════════════════════════════════════════ */
function CompanyStory() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imgY2 = useTransform(scrollYProgress, [0, 1], [80, -120]);

  return (
    <section ref={ref} className="relative py-28 sm:py-36 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs sm:text-sm font-semibold text-electric uppercase tracking-[0.2em] mb-4">
            Our Story
          </p>
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight mb-6 ${
              isDark ? "text-white" : "text-midnight"
            }`}
          >
            Authority. Security.{" "}
            <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">
              Sustainability.
            </span>
          </h2>
          <div
            className={`space-y-5 text-base leading-[1.85] ${
              isDark ? "text-white/55" : "text-midnight/55"
            }`}
          >
            <p>
              In 2021, our founding team witnessed first-hand how outdated
              inventory systems were contributing to massive food waste across
              the supply chain. They decided to build something different.
            </p>
            <p>
              Veratori combines{" "}
              <span className="text-electric font-semibold">
                enterprise-grade security
              </span>{" "}
              with intuitive design, enabling teams to manage inventory with
              surgical precision while minimizing environmental impact.
            </p>
            <p>
              Today, we serve over{" "}
              <span className="text-sage font-semibold">
                500 enterprise clients
              </span>{" "}
              across 30 countries, helping them reduce waste, optimize space, and
              operate with the ethical standards the world demands.
            </p>
          </div>
        </motion.div>

        {/* Parallax images */}
        <div className="relative h-[500px]">
          <motion.div
            style={{ y: imgY }}
            className="absolute top-0 right-0 w-[75%] h-[60%] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
              alt="Veratori team collaboration"
              fill
              className="object-cover"
              sizes="40vw"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            style={{ y: imgY2 }}
            className="absolute bottom-0 left-0 w-[65%] h-[55%] rounded-2xl overflow-hidden shadow-2xl border-4 border-electric/20"
          >
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
              alt="Veratori headquarters"
              fill
              className="object-cover"
              sizes="35vw"
              loading="lazy"
            />
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-sage/10 blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIMELINE — Electric Blue dot accent markers, polished
   ═══════════════════════════════════════════════════════════ */
const timeline = [
  {
    year: "2021",
    title: "The Spark",
    desc: "Founded in San Francisco with a mission to end food waste through technology.",
    color: "bg-sage",
  },
  {
    year: "2022",
    title: "First 100 Clients",
    desc: "Launched V1 platform; onboarded 100 enterprise clients in 6 months.",
    color: "bg-electric",
  },
  {
    year: "2023",
    title: "AI Integration",
    desc: "Introduced machine-learning forecasting and object detection features.",
    color: "bg-sky",
  },
  {
    year: "2024",
    title: "Global Expansion",
    desc: "Expanded to 30 countries; raised Series B to accelerate growth.",
    color: "bg-sage",
  },
  {
    year: "2025",
    title: "500+ Enterprises",
    desc: "Surpassed 500 enterprise clients; saved 3.2M pounds of food from waste.",
    color: "bg-electric",
  },
  {
    year: "2026",
    title: "The Future",
    desc: "Launching next-gen spatial intelligence, 3D warehouse mapping, and predictive analytics.",
    color: "bg-sky",
  },
];

function Timeline() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Our Journey"
          title="From Idea to"
          highlight="Global Impact"
          tagColor="text-sage"
        />
        <div ref={ref} className="relative">
          {/* Vertical spine */}
          <div
            className={`absolute left-[22px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 ${
              isDark ? "bg-white/10" : "bg-midnight/10"
            }`}
          />

          {timeline.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative flex items-start gap-6 mb-14 ${
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              } flex-row`}
            >
              {/* Dot with Electric Blue pulse ring */}
              <div className="absolute left-[18px] sm:left-1/2 sm:-translate-x-1/2 top-1 z-10">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${t.color} ring-[5px] ${
                    isDark ? "ring-midnight" : "ring-mist"
                  }`}
                />
                {/* Subtle outer glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={inView ? { opacity: [0, 0.4, 0], scale: [0.5, 1.8, 2] } : {}}
                  transition={{
                    delay: i * 0.15 + 0.5,
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                  className={`absolute inset-0 rounded-full ${t.color} blur-sm`}
                />
              </div>

              {/* Content */}
              <div
                className={`ml-12 sm:ml-0 ${
                  i % 2 === 0
                    ? "sm:w-1/2 sm:pr-12 sm:text-right"
                    : "sm:w-1/2 sm:pl-12"
                }`}
              >
                <span
                  className={`text-sm font-bold ${t.color.replace(
                    "bg-",
                    "text-"
                  )}`}
                >
                  {t.year}
                </span>
                <h3
                  className={`text-lg font-bold mt-1 ${
                    isDark ? "text-white" : "text-midnight"
                  }`}
                >
                  {t.title}
                </h3>
                <p
                  className={`text-sm mt-1.5 leading-relaxed ${
                    isDark ? "text-white/50" : "text-midnight/50"
                  }`}
                >
                  {t.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   VALUES CARDS — Palette-colored with refined hover reveals
   ═══════════════════════════════════════════════════════════ */
const values = [
  {
    name: "Deep Midnight",
    hex: "#0E1526",
    desc: "Our foundation — authority, depth, and unwavering reliability in everything we build.",
    color: "bg-midnight",
    hoverBg: "group-hover:bg-midnight/90",
    textColor: "text-white",
  },
  {
    name: "Sage Operation",
    hex: "#5F974F",
    desc: "The ethical heartbeat — sustainability, growth, and a commitment to reducing waste at every turn.",
    color: "bg-sage",
    hoverBg: "group-hover:bg-sage/90",
    textColor: "text-white",
  },
  {
    name: "Electric Blue",
    hex: "#2640CE",
    desc: "Precision in action — intelligent alerts, data clarity, and the speed to stay ahead.",
    color: "bg-electric",
    hoverBg: "group-hover:bg-electric/90",
    textColor: "text-white",
  },
  {
    name: "Sky Tint",
    hex: "#ABCEE1",
    desc: "Approachable innovation — clean interfaces, calm efficiency, and technology that feels human.",
    color: "bg-sky",
    hoverBg: "group-hover:bg-sky/90",
    textColor: "text-midnight",
  },
  {
    name: "Mist",
    hex: "#F2F6F9",
    desc: "Transparency and openness — a clear canvas where your data tells the story without noise.",
    color: "bg-mist",
    hoverBg: "group-hover:bg-mist/90",
    textColor: "text-midnight",
  },
];

function ValuesCards() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Our Values"
          title="Each Color Tells a"
          highlight="Story"
          subtitle="Our palette isn't decoration — it's a living expression of what we stand for."
        />
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {values.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative"
            >
              <div
                className={`${v.color} rounded-2xl p-6 h-56 flex flex-col justify-end transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl overflow-hidden`}
              >
                {/* Hover darken overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 rounded-2xl" />
                <div className="relative z-10">
                  <p
                    className={`text-xs font-mono mb-1 opacity-50 ${v.textColor}`}
                  >
                    {v.hex}
                  </p>
                  <h3 className={`text-lg font-bold ${v.textColor}`}>
                    {v.name}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed mt-2 opacity-0 group-hover:opacity-80 transition-opacity duration-300 ${v.textColor}`}
                  >
                    {v.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEAM GRID — Polished hover, consistent spacing
   ═══════════════════════════════════════════════════════════ */
const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-Founder",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Priya Sharma",
    role: "CTO & Co-Founder",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Engineering",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Lena Chen",
    role: "VP of Product",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "David Okonkwo",
    role: "Head of Sustainability",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    name: "Sofia Vasquez",
    role: "Head of Design",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
];

function TeamGrid() {
  const { isDark } = useTheme();

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Team"
          title="The People Behind"
          highlight="Veratori"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                isDark
                  ? "bg-white/[0.03] border-white/5 hover:border-white/10"
                  : "bg-white border-midnight/5 shadow-md hover:shadow-xl"
              }`}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:640px)50vw,33vw"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    isDark
                      ? "from-midnight via-transparent"
                      : "from-white via-transparent"
                  } opacity-60`}
                />
              </div>
              <div className="p-5">
                <h3
                  className={`font-bold ${
                    isDark ? "text-white" : "text-midnight"
                  }`}
                >
                  {m.name}
                </h3>
                <p
                  className={`text-sm mt-0.5 ${
                    isDark ? "text-white/50" : "text-midnight/50"
                  }`}
                >
                  {m.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PARTNERS — Real restaurant brands, marquee + cards
   ═══════════════════════════════════════════════════════════ */
const clientBrands = [
  { name: "Poke Bowl", Icon: Fish },
  { name: "Crack Rice", Icon: Flame },
  { name: "Sakura Teriyaki Japan", Icon: Cherry },
  { name: "Black Burger", Icon: Beef },
  { name: "Los Tacos Hermanos", Icon: Salad },
];

const clientCards = [
  {
    name: "Poke Bowl",
    desc: "Leading Hawaiian poke chain in NYC, streamlining fresh ingredient inventory across all locations.",
    Icon: Fish,
  },
  {
    name: "Crack Rice",
    desc: "Multiple locations optimized for crispy rice production and reduced ingredient waste with real-time tracking.",
    Icon: Flame,
  },
  {
    name: "Sakura Teriyaki Japan",
    desc: "Authentic Japanese fast-casual dining with precise portion control and stock management powered by Veratori.",
    Icon: Cherry,
  },
  {
    name: "Black Burger",
    desc: "Premium burger concept with efficient meat, produce, and bun inventory tracking for minimal spoilage.",
    Icon: Beef,
  },
  {
    name: "Los Tacos Hermanos",
    desc: "Authentic Mexican tacos with optimized fresh produce and protein usage across every preparation stage.",
    Icon: Salad,
  },
];

function PartnersSection() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      {/* Distinct tri-brand gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(38,64,206,0.12) 0%, rgba(95,151,79,0.12) 50%, rgba(171,206,225,0.12) 100%), #0E1526"
            : "linear-gradient(135deg, rgba(38,64,206,0.06) 0%, rgba(95,151,79,0.06) 50%, rgba(171,206,225,0.06) 100%), #F2F6F9",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Our Clients"
          title="Trusted by"
          highlight="Industry Leaders"
          subtitle="Powering inventory intelligence for some of New York's most exciting food brands."
        />

        {/* ── Marquee logos ── */}
        <InfiniteMarquee speed={28} className="mb-16">
          {clientBrands.map((brand) => (
            <div
              key={brand.name}
              className={`flex-shrink-0 mx-6 flex items-center gap-3 px-6 py-4 rounded-xl border transition-colors duration-300 ${
                isDark
                  ? "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                  : "border-midnight/[0.06] bg-white/60 hover:bg-white"
              } group`}
            >
              <brand.Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                  isDark
                    ? "text-white/25 group-hover:text-sage"
                    : "text-midnight/25 group-hover:text-sage"
                }`}
                strokeWidth={1.6}
              />
              <span
                className={`text-base font-semibold tracking-wide whitespace-nowrap transition-colors duration-300 ${
                  isDark
                    ? "text-white/20 group-hover:text-white/60"
                    : "text-midnight/20 group-hover:text-midnight/60"
                }`}
              >
                {brand.name}
              </span>
            </div>
          ))}
        </InfiniteMarquee>

        {/* ── Client feature cards ── */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {clientCards.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`partner-card-glow rounded-2xl border p-6 ${
                isDark
                  ? "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                  : "bg-white border-midnight/[0.06] hover:shadow-xl"
              } transition-all duration-300`}
            >
              <div className="bg-electric/10 text-electric w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                <p.Icon className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <h3
                className={`text-base font-bold mb-2 ${
                  isDark ? "text-white" : "text-midnight"
                }`}
              >
                {p.name}
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

/* ═══════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════ */
function FinalCTA() {
  const { isDark } = useTheme();

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-electric/[0.05] blur-[120px]" />

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
          Join Us in Reducing{" "}
          <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">
            Waste
          </span>
        </h2>
        <p
          className={`text-base sm:text-lg mb-10 leading-relaxed ${
            isDark ? "text-white/50" : "text-midnight/50"
          }`}
        >
          Every business that joins Veratori makes the global food system more
          efficient and more ethical. Let us show you how.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <motion.span
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold rounded-xl glow-electric glow-electric-hover transition-all duration-300 cursor-pointer"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
          <Link href="/product">
            <motion.span
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block px-8 py-4 border border-sage/30 text-sage rounded-xl font-semibold hover:bg-sage/[0.08] transition-all duration-300 cursor-pointer"
            >
              Explore the Platform
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE ASSEMBLY — Full-page diagonal gradient + grain
   ═══════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div
      className={`relative ${isDark ? "about-bg-dark" : "about-bg-light"} about-grain`}
    >
      <AboutHero />
      <CompanyStory />
      <Timeline />
      <ValuesCards />
      <TeamGrid />
      <PartnersSection />
      <FinalCTA />
    </div>
  );
}
