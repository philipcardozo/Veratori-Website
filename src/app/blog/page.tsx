"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

/* ─── Types ─── */
const categories = ["All", "Product Updates", "Research", "Food Industry", "Company News"];

const posts = [
  {
    slug: "why-lidar-for-inventory",
    title: "Why We Chose LiDAR for Inventory Instead of Cameras Alone",
    excerpt:
      "RGB cameras are great at identifying objects — but they can't tell you how much of something is left. Here's why volumetric depth sensing changes everything for food service operators.",
    category: "Research",
    date: "March 12, 2026",
    readTime: "8 min read",
    featured: true,
    imagePlaceholder: "Feature image: Close-up of a LiDAR depth scan overlay on a commercial cooler shelf showing volumetric measurements in teal/green false-color visualization",
  },
  {
    slug: "roi-90-days",
    title: "How One Restaurant Recovered $8,000 in 90 Days",
    excerpt:
      "A Poke Bowl pilot location was losing nearly $3,000/month to undetected spoilage and over-ordering. After installing Veratori's V1 Sensor, the results surprised even us.",
    category: "Company News",
    date: "February 28, 2026",
    readTime: "5 min read",
    featured: false,
    imagePlaceholder: "Blog card image: Split graph showing food waste costs before vs. after Veratori installation — red line dropping sharply over 90 days",
  },
  {
    slug: "atv-demo-day-recap",
    title: "ATV Demo Day Recap: What We Showed and What's Next",
    excerpt:
      "Atlanta Tech Village's spring Demo Day was a milestone for Veratori. We demoed the live YOLO detection pipeline and ROI calculator to an audience of investors and operators.",
    category: "Company News",
    date: "February 14, 2026",
    readTime: "4 min read",
    featured: false,
    imagePlaceholder: "Blog card image: Wide shot of the ATV Demo Day venue with Veratori branded presentation slide visible on screen and audience in foreground",
  },
  {
    slug: "yolo-in-commercial-cooler",
    title: "How YOLO Object Detection Works Inside a Commercial Cooler",
    excerpt:
      "Low light, moisture, condensation, and thermal interference — a walk-in cooler is one of the hardest environments for computer vision. Here's how we solved it.",
    category: "Research",
    date: "January 30, 2026",
    readTime: "10 min read",
    featured: false,
    imagePlaceholder: "Blog card image: Technical diagram showing YOLO bounding boxes overlaid on cooler shelf items in low-light conditions with confidence scores displayed",
  },
  {
    slug: "food-waste-global-crisis",
    title: "The $1 Trillion Problem: Food Waste by the Numbers",
    excerpt:
      "One-third of all food produced globally never gets eaten. We break down the data — and explain why the solution starts in the commercial kitchen.",
    category: "Food Industry",
    date: "January 15, 2026",
    readTime: "6 min read",
    featured: false,
    imagePlaceholder: "Blog card image: Infographic-style illustration showing global food waste statistics with stacked bar charts and geographic distribution map",
  },
  {
    slug: "edge-ai-explained",
    title: "Edge AI Explained: Why We Don't Send Your Video to the Cloud",
    excerpt:
      "Privacy-first design isn't just good marketing — it's an architectural choice we made from day one. Here's how NVIDIA Jetson Orin makes real-time inference possible without the cloud.",
    category: "Product Updates",
    date: "January 3, 2026",
    readTime: "7 min read",
    featured: false,
    imagePlaceholder: "Blog card image: Diagram of edge computing architecture — V1 Sensor box on left connected locally to Jetson module, with a crossed-out cloud icon indicating no cloud upload",
  },
];

/* ─── Image Placeholder ─── */
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

/* ─── Post Card ─── */
function PostCard({ post, index }: { post: (typeof posts)[0]; index: number }) {
  const { isDark } = useTheme();
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`group rounded-2xl border overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
        isDark
          ? "bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:shadow-black/40"
          : "bg-white border-black/[0.07] hover:border-black/20 hover:shadow-black/10"
      }`}
    >
      {/* <ImagePlaceholder text={post.imagePlaceholder} className="rounded-none border-0 border-b-2 h-48" /> */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sage/10 text-sage">
            <Tag className="w-2.5 h-2.5" />
            {post.category}
          </span>
          <span className={`flex items-center gap-1 text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h3 className={`text-base font-bold mb-2 leading-snug group-hover:text-sage transition-colors ${isDark ? "text-white" : "text-black"}`}>
          {post.title}
        </h3>
        <p className={`text-sm leading-relaxed flex-1 mb-4 ${isDark ? "text-white/45" : "text-black/45"}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>{post.date}</span>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-xs font-bold text-sage group-hover:gap-2 transition-all"
          >
            Read More <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Page ─── */
export default function BlogPage() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = posts.find((p) => p.featured)!;
  const filtered =
    activeCategory === "All"
      ? posts.filter((p) => !p.featured)
      : posts.filter((p) => !p.featured && p.category === activeCategory);

  return (
    <main className={isDark ? "bg-black text-white" : "bg-white text-black"}>

      {/* ── Hero ── */}
      <section className={`pt-32 pb-16 border-b ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Veratori Blog</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              Insights from <br />
              <span className="text-sage">the Veratori team</span>
            </h1>
            <p className={`text-lg max-w-xl leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
              Research, product updates, and perspectives on food technology, waste reduction, and the future of restaurant operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Post ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className={`text-xs font-bold uppercase tracking-widest mb-8 ${isDark ? "text-white/30" : "text-black/30"}`}>
            Featured Post
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl border overflow-hidden group cursor-pointer ${
              isDark ? "border-white/[0.08] bg-white/[0.02]" : "border-black/[0.08] bg-white"
            }`}
          >
            {/* <ImagePlaceholder
              text={featured.imagePlaceholder}
              className="rounded-none border-0 h-72 lg:h-auto"
            /> */}
            <div className="p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sage/10 text-sage">
                  {featured.category}
                </span>
                <span className={`text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>
                  {featured.readTime} · {featured.date}
                </span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold leading-snug mb-4 group-hover:text-sage transition-colors ${isDark ? "text-white" : "text-black"}`}>
                {featured.title}
              </h2>
              <p className={`text-base leading-relaxed mb-6 ${isDark ? "text-white/50" : "text-black/50"}`}>
                {featured.excerpt}
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-bold text-sage text-sm group-hover:gap-3 transition-all"
              >
                Read Full Article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Category Filter ── */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-sage text-white"
                    : isDark
                    ? "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    : "bg-black/5 text-black/50 hover:bg-black/10 hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
            {filtered.length === 0 && (
              <p className={`col-span-3 text-center py-16 ${isDark ? "text-white/30" : "text-black/30"}`}>
                No posts in this category yet — check back soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className={`py-20 border-t ${isDark ? "border-white/[0.06] bg-midnight" : "border-black/[0.06] bg-mist"}`}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Stay Updated</span>
            <h2 className="text-3xl font-bold mb-4">Get new posts in your inbox</h2>
            <p className={`text-base mb-8 ${isDark ? "text-white/50" : "text-black/50"}`}>
              Monthly roundups of Veratori research, product news, and food-tech insights.
            </p>
            <form className="flex gap-3 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@restaurant.com"
                className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none border transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-sage/50"
                    : "bg-white border-black/10 text-black placeholder-black/30 focus:border-sage/50"
                }`}
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-sage text-white font-bold text-sm hover:bg-sage-light transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
