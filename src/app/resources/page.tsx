"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, BookOpen, Calculator, Video, Code, HelpCircle, Download, ExternalLink } from "lucide-react";
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

const whitepapers = [
  {
    title: "Volumetric Inventory Analysis via LiDAR Depth Sensing",
    subtitle: "Veratori Labs · March 2024",
    description:
      "Our flagship research paper covering the multi-modal edge architecture that powers the V1 Sensor. Covers LiDAR + YOLO fusion, accuracy benchmarks, and deployment methodology.",
    href: "/documents/lidar-paper.pdf",
    tag: "Research Paper",
    external: true,
    image: "/images/assets/whitepaper-lidar.png",
  },
  {
    title: "ROI Guide: Calculating Your Food Waste Savings",
    subtitle: "Veratori · 2026",
    description:
      "A practical guide for operators and CFOs. Walk through the exact formula Veratori uses to project waste reduction, labor savings, and recovered revenue.",
    href: "/mission#roi",
    tag: "Operator Guide",
    external: false,
    image: "/images/assets/roi-guide.png",
  },
];

const docSections = [
  {
    icon: Code,
    title: "API Overview",
    desc: "Integrate Veratori data into your POS, ERP, or custom dashboard. REST endpoints for inventory snapshots, alerts, and historical data.",
    status: "Coming Q3 2026",
  },
  {
    icon: FileText,
    title: "Setup & Installation Guide",
    desc: "Step-by-step hardware installation instructions for the V1 Sensor. Covers mounting, WiFi configuration, and initial calibration.",
    status: "Available on request",
  },
  {
    icon: BookOpen,
    title: "Manager Dashboard Guide",
    desc: "How to read your daily digest, respond to anomaly alerts, and export inventory reports from the Veratori web dashboard.",
    status: "Coming Q2 2026",
  },
  {
    icon: Code,
    title: "Webhook Reference",
    desc: "Receive real-time alerts and inventory events via webhooks. Supports Slack, PagerDuty, email, and custom endpoints.",
    status: "Coming Q3 2026",
  },
];

const tools = [
  {
    icon: Calculator,
    title: "ROI Calculator",
    desc: "Input your revenue, food cost %, and location count — get a 12-month projection of savings from Veratori.",
    href: "/mission#roi",
    cta: "Open Calculator",
  },
  {
    icon: Video,
    title: "Live YOLO Demo",
    desc: "Allow camera access and see Veratori's object detection run in real-time — the same model deployed in our V1 Sensor.",
    href: "/product",
    cta: "Try the Demo",
  },
];

const faqs = [
  {
    q: "What data does the V1 Sensor collect?",
    a: "The V1 Sensor captures depth maps and object detection metadata — never raw video. All inference happens on-device. No footage is transmitted or stored off-premises.",
  },
  {
    q: "Does Veratori work with all cooler types?",
    a: "Yes. The V1 Sensor works with reach-in coolers, walk-in units, and open refrigerated shelving. We calibrate per installation.",
  },
  {
    q: "What happens if my internet goes down?",
    a: "The sensor continues counting and storing data locally. Sync resumes automatically when connectivity is restored. No data is lost.",
  },
  {
    q: "How long does installation take?",
    a: "Typically 20–40 minutes per sensor unit. A Veratori technician handles the physical mount, network setup, and initial model training.",
  },
  {
    q: "Is there a minimum contract term?",
    a: "No. Veratori's beta program is month-to-month. You can cancel or pause at any time with 30 days notice.",
  },
];

export default function ResourcesPage() {
  const { isDark } = useTheme();

  return (
    <main className={isDark ? "bg-black text-white" : "bg-white text-black"}>

      {/* ── Hero ── */}
      <section className={`pt-32 pb-16 border-b ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Resources</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              Everything you need <br />
              <span className="text-sage">to get started</span>
            </h1>
            <p className={`text-lg max-w-xl leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
              Research papers, operator guides, documentation, and tools — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Whitepapers ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Whitepapers & Guides</span>
            <h2 className="text-3xl font-bold">Research & Reading</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {whitepapers.map((paper, i) => (
              <motion.div
                key={paper.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl border overflow-hidden flex flex-col gap-0 ${
                  isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                }`}
              >
                <div className="relative h-40 w-full">
                  <ImagePlaceholder
                    text={paper.image ? "Whitepaper cover or research visual" : "Document or research image"}
                    className="h-40 w-full border-0 border-b rounded-0"
                  />
                  <div className="absolute top-4 left-4">
                    <Image
                      src="/images/Logos/Brand Identity/Logos/Logo_symbol_dark-nobg.png"
                      alt="Veratori"
                      width={40}
                      height={40}
                      className="opacity-80"
                    />
                  </div>
                </div>
                <div className="p-8 flex flex-col gap-4">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sage/10 text-sage w-fit">
                    {paper.tag}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{paper.title}</h3>
                    <p className={`text-xs mb-3 ${isDark ? "text-white/35" : "text-black/35"}`}>{paper.subtitle}</p>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>{paper.description}</p>
                  </div>
                  <Link
                    href={paper.href}
                    target={paper.external ? "_blank" : undefined}
                    rel={paper.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 font-bold text-sage text-sm hover:gap-3 transition-all mt-auto"
                  >
                    {paper.external ? <Download className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    {paper.external ? "Download PDF" : "Open in Site"}
                    {paper.external && <ExternalLink className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image band ── */}
      <section className="px-6 max-w-7xl mx-auto pb-20">
        <ImagePlaceholder
          text="Full-width resource hub banner: Clean overhead shot of a commercial kitchen with tablet showing Veratori dashboard data, LiDAR scan overlay visible on cooler in background"
          className="h-52 w-full"
        />
      </section>

      {/* ── Documentation ── */}
      <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Documentation</span>
            <h2 className="text-3xl font-bold mb-2">Developer & Operator Docs</h2>
            <p className={`text-base ${isDark ? "text-white/50" : "text-black/50"}`}>
              Full documentation is in progress. Request early access by contacting{" "}
              <a href="mailto:contact@veratori.com" className="text-sage hover:underline">contact@veratori.com</a>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docSections.map((doc, i) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`flex gap-4 p-6 rounded-2xl border ${
                  isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                  <doc.icon className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold">{doc.title}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      doc.status === "Available on request"
                        ? "bg-sage/10 text-sage"
                        : isDark ? "bg-white/5 text-white/30" : "bg-black/5 text-black/30"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/45" : "text-black/45"}`}>{doc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Tools ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">Interactive Tools</span>
            <h2 className="text-3xl font-bold">Try It Yourself</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-8 rounded-2xl border flex gap-5 items-start ${
                  isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center shrink-0">
                  <tool.icon className="w-6 h-6 text-sage" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-1">{tool.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-white/45" : "text-black/45"}`}>{tool.desc}</p>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-sage hover:gap-3 transition-all"
                  >
                    {tool.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={`py-20 border-t ${isDark ? "border-white/[0.06] bg-midnight" : "border-black/[0.06] bg-mist"}`}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12 text-center">
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-3 block">FAQ</span>
            <h2 className="text-3xl font-bold">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`p-6 rounded-2xl border ${
                  isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-black/[0.07] shadow-sm"
                }`}
              >
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm mb-2">{faq.q}</p>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className={`text-sm mb-4 ${isDark ? "text-white/40" : "text-black/40"}`}>Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-white font-bold text-sm hover:bg-sage-light transition-colors"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
