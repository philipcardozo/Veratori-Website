"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ui/ThemeProvider";
import Image from "next/image";
import {
  Camera, Cpu, Cloud, BarChart3, Bell, DollarSign,
  TrendingUp, Package, Clock, ShieldCheck, ChevronRight,
  Wifi, Database, Smartphone, Users, AlertTriangle, CheckCircle2
} from "lucide-react";

/* ─── Dataset stats derived from real pokebowl sales data ─── */
const STATS = [
  { label: "SKUs Tracked", value: "120+", sub: "per location", color: "#7dd87a" },
  { label: "Avg. Revenue Recovered", value: "$2,400", sub: "per month", color: "#60a5fa" },
  { label: "Waste Reduction", value: "38%", sub: "first 90 days", color: "#a78bfa" },
  { label: "Labor Hours Saved", value: "52 hrs", sub: "per month", color: "#fb923c" },
];

/* ─── Flow nodes for the 24/7 pipeline diagram ─── */
const PIPELINE = [
  {
    id: "sensor",
    label: "V1 Sensor",
    sublabel: "In cooler, ceiling-mounted",
    icon: Camera,
    detail: "4K RGB + ToF LiDAR · YOLO v8 · 15–30 FPS · IP67 · Heated lens",
    color: "#7dd87a",
    x: 50, y: 15,
  },
  {
    id: "edge",
    label: "Jetson Edge",
    sublabel: "On-device inference",
    icon: Cpu,
    detail: "NVIDIA Jetson Orin · Inference on-device · No raw footage leaves · AES-256 encrypted",
    color: "#60a5fa",
    x: 50, y: 38,
  },
  {
    id: "cloud",
    label: "Veratori Cloud",
    sublabel: "Secure sync every shift",
    icon: Cloud,
    detail: "SOC 2 Type II · GDPR compliant · Delta-sync (bandwidth-efficient) · 99.9% uptime SLA",
    color: "#a78bfa",
    x: 50, y: 61,
  },
  {
    id: "dashboard",
    label: "Manager Dashboard",
    sublabel: "Morning digest + live alerts",
    icon: Smartphone,
    detail: "Real-time stock levels · Anomaly push alerts · Morning summary email · Restock triggers",
    color: "#fb923c",
    x: 50, y: 84,
  },
];

/* ─── Value props for investors / owners ─── */
const VALUE_PROPS = [
  {
    icon: DollarSign,
    title: "Revenue Intelligence",
    desc: "Know exactly which SKUs generate highest margin. Prevent stockouts on top-sellers like Mango and Strawberry during peak hours — real data from your store, not estimates.",
    metric: "+$2,400/mo",
    metricLabel: "avg. recovered revenue",
    color: "#7dd87a",
  },
  {
    icon: TrendingUp,
    title: "Early Anomaly Detection",
    desc: "Detect misplaced items, unexpected stock drops, or door-left-open events before they cause waste. Our sensor caught 94% of anomalies in blind tests across 2 stores.",
    metric: "94%",
    metricLabel: "anomaly detection rate",
    color: "#60a5fa",
  },
  {
    icon: Package,
    title: "Zero-Speculation Ordering",
    desc: "Every restock decision is backed by volumetric data — not gut feeling. Eliminate over-ordering of slow movers like specialty teas while keeping fast runners stocked.",
    metric: "−38%",
    metricLabel: "food waste reduction",
    color: "#a78bfa",
  },
  {
    icon: Clock,
    title: "Time Back to Operations",
    desc: "Manual counting averages 90 min/shift/location. With Veratori, that drops to zero. Two employees × 26 shifts/month = 52 hours reallocated to guest experience.",
    metric: "52 hrs",
    metricLabel: "saved per month",
    color: "#fb923c",
  },
  {
    icon: BarChart3,
    title: "Investor-Grade Reporting",
    desc: "Franchise operators and investors get unified dashboards across all locations — comparing Store A vs Store B performance, margin per category, and trend analytics.",
    metric: "Multi-location",
    metricLabel: "unified reporting",
    color: "#f472b6",
  },
  {
    icon: ShieldCheck,
    title: "Compliance-Ready Data",
    desc: "Encrypted at rest and in transit. No raw video stored in cloud. GDPR, SOC 2 Type II. Every inventory record is auditable for health inspections and supply chain audits.",
    metric: "SOC 2",
    metricLabel: "Type II certified",
    color: "#34d399",
  },
];

/* ─── Sub-components ─── */

function PipelineDiagram({ isDark }: { isDark: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  // Step duration for the cascade (seconds)
  const STEP = 0.72;
  const CONNECTORS = PIPELINE.length - 1;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="space-y-0">
        {PIPELINE.map((node, i) => {
          const Icon = node.icon;
          const isActive = active === node.id;
          return (
            <div key={node.id}>
              {/* ── Node card ── */}
              <motion.button
                onClick={() => setActive(isActive ? null : node.id)}
                whileHover={{ x: 2 }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                  isActive
                    ? "border-opacity-80 bg-opacity-10"
                    : isDark
                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    : "border-black/8 bg-white hover:bg-black/[0.02]"
                }`}
                style={isActive ? { borderColor: node.color, backgroundColor: node.color + "18" } : {}}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: node.color + "22" }}
                >
                  <Icon className="w-5 h-5" style={{ color: node.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{node.label}</p>
                    {i === 0 && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{ backgroundColor: node.color + "25", color: node.color }}
                      >
                        <motion.span
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          className="w-1 h-1 rounded-full inline-block"
                          style={{ backgroundColor: node.color }}
                        />
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate ${isDark ? "text-white/40" : "text-black/40"}`}>
                    {node.sublabel}
                  </p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? "rotate-90" : ""}`}
                  style={{ color: node.color + "80" }}
                />
              </motion.button>

              {/* ── Expandable detail ── */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 py-3 mx-4 mb-1 rounded-b-xl text-xs leading-relaxed font-mono"
                      style={{
                        backgroundColor: node.color + "0D",
                        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
                        borderLeft: `2px solid ${node.color}40`,
                      }}
                    >
                      {node.detail}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Connector: seamless light-sweep ── */}
              {i < CONNECTORS && (
                <div className="flex justify-center my-0.5">
                  {/* Outer container clips the sweep */}
                  <div className="relative overflow-hidden rounded-full" style={{ width: 2, height: 48 }}>
                    {/* Static dim track */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isDark
                          ? "linear-gradient(to bottom, rgba(125,216,122,0.04) 0%, rgba(125,216,122,0.12) 50%, rgba(125,216,122,0.04) 100%)"
                          : "linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)",
                      }}
                    />
                    {/* Primary sweep — sharp leading edge, long fade tail */}
                    <motion.div
                      className="absolute w-full"
                      style={{
                        height: 96,       // 2× container so gradient never hard-clips
                        background:
                          "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(125,216,122,0.12) 42%, rgba(125,216,122,1) 50%, rgba(125,216,122,0.5) 60%, rgba(125,216,122,0.08) 72%, transparent 84%, transparent 100%)",
                      }}
                      animate={{ y: [-96, 48] }}
                      transition={{
                        duration: STEP,
                        repeat: Infinity,
                        delay: i * STEP,
                        repeatDelay: CONNECTORS * STEP,   // pause = one full silent cycle after all connectors fire
                        ease: [0.2, 0, 0.4, 1],           // fast-in, slow-out (data "arrives" decisively)
                      }}
                    />
                    {/* Secondary echo — dimmer, 80ms behind, gives depth */}
                    <motion.div
                      className="absolute w-full"
                      style={{
                        height: 96,
                        background:
                          "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(125,216,122,0.04) 45%, rgba(125,216,122,0.28) 52%, rgba(125,216,122,0.04) 62%, transparent 72%, transparent 100%)",
                      }}
                      animate={{ y: [-96, 48] }}
                      transition={{
                        duration: STEP,
                        repeat: Infinity,
                        delay: i * STEP + 0.08,
                        repeatDelay: CONNECTORS * STEP,
                        ease: [0.2, 0, 0.4, 1],
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data latency tags */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          { label: "< 50ms", sub: "edge inference" },
          { label: "< 2min", sub: "cloud sync" },
          { label: "6:00 AM", sub: "daily digest" },
        ].map(({ label, sub }) => (
          <div key={label} className={`px-3 py-1.5 rounded-full border text-center ${isDark ? "border-white/10 bg-white/5" : "border-black/8 bg-black/[0.03]"}`}>
            <span className="text-sage font-bold text-xs">{label}</span>
            <span className={`text-[10px] ml-1 ${isDark ? "text-white/40" : "text-black/40"}`}>{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatasetPreview({ isDark }: { isDark: boolean }) {
  const rows = [
    { product: "Mango", qty: 15, price: 12.50, margin: "60%", status: "in-stock" },
    { product: "Jasmine Green Tea", qty: 10, price: 5.50, margin: "55%", status: "in-stock" },
    { product: "Coke Diet", qty: 25, price: 3.50, margin: "57%", status: "in-stock" },
    { product: "Kilauea Lemon Cake", qty: 5, price: 18.75, margin: "52%", status: "low" },
    { product: "Strawberry", qty: 18, price: 16.00, margin: "56%", status: "in-stock" },
  ];

  return (
    <div className={`rounded-xl border overflow-hidden text-xs font-mono ${isDark ? "border-white/10 bg-white/[0.03]" : "border-black/8 bg-white"}`}>
      {/* Terminal header */}
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? "border-white/10 bg-white/5" : "border-black/5 bg-black/[0.02]"}`}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
          <div className="w-3 h-3 rounded-full bg-green-400/60" />
        </div>
        <span className={`text-[10px] ${isDark ? "text-white/30" : "text-black/30"}`}>veratori_inventory_live.csv · Store A</span>
        <div className="ml-auto flex items-center gap-1">
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
          <span className="text-sage text-[10px]">SYNCED</span>
        </div>
      </div>

      {/* Column headers */}
      <div className={`grid grid-cols-5 gap-2 px-4 py-2 text-[10px] uppercase tracking-wider ${isDark ? "text-white/25" : "text-black/25"}`}>
        <span className="col-span-2">Product</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Status</span>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <motion.div
          key={row.product}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className={`grid grid-cols-5 gap-2 px-4 py-2.5 border-t items-center ${isDark ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-black/[0.02]"} transition-colors`}
        >
          <span className={`col-span-2 truncate ${isDark ? "text-white/70" : "text-black/70"}`}>{row.product}</span>
          <span className={`text-right ${isDark ? "text-white/50" : "text-black/50"}`}>{row.qty}</span>
          <span className={`text-right ${isDark ? "text-white/50" : "text-black/50"}`}>${row.price.toFixed(2)}</span>
          <span className={`text-right text-[10px] font-bold ${row.status === "low" ? "text-orange-400" : "text-sage"}`}>
            {row.status === "low" ? "LOW" : "OK"}
          </span>
        </motion.div>
      ))}

      <div className={`px-4 py-2.5 border-t text-[10px] ${isDark ? "border-white/5 text-white/25" : "border-black/5 text-black/25"}`}>
        120+ SKUs tracked · 2 locations · synced every shift
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export default function DataFlowSection() {
  const { isDark } = useTheme();

  return (
    <section className={`py-28 relative overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#050810]" : "bg-[#F3F5F7]"}`}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] ${isDark ? "bg-sage/5" : "bg-sage/8"}`} />
        <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[160px] ${isDark ? "bg-blue-500/5" : "bg-blue-500/5"}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-20 space-y-24">

        {/* ── Header ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sage/30 bg-sage/5 mb-5">
            <Database className="w-3.5 h-3.5 text-sage" />
            <span className="text-sage text-xs font-mono font-bold tracking-widest uppercase">Dataset & Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-tight">
            From cooler to cloud
            <br />
            <span className="text-sage">in under 2 minutes.</span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
            Every shift. Every SKU. Every location. Operators and investors get real-time intelligence without lifting a clipboard.
          </p>
        </motion.div>

        {/* ── KPI Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`p-6 rounded-2xl border text-center ${isDark ? "border-white/10 bg-white/[0.04]" : "border-black/8 bg-white shadow-sm"}`}
            >
              <motion.p
                className="text-3xl md:text-4xl font-black mb-1"
                style={{ color: s.color }}
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
              >
                {s.value}
              </motion.p>
              <p className="font-bold text-sm">{s.label}</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/35" : "text-black/35"}`}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Pipeline Diagram + Dataset Preview ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? "text-white/30" : "text-black/30"}`}>Live Data Pipeline</span>
              <h3 className="text-2xl font-black mt-1">How it reaches you</h3>
            </div>
            <PipelineDiagram isDark={isDark} />

            {/* ATV Partnership badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`mt-5 flex items-center gap-3 px-4 py-3 rounded-xl border ${isDark ? "border-white/8 bg-white/[0.03]" : "border-black/6 bg-white shadow-sm"}`}
            >
              <div className="relative w-16 h-8 shrink-0">
                <Image
                  src="/images/clients/ATV-nobg.png"
                  alt="Atlanta Tech Village"
                  fill
                  className={`object-contain object-left ${isDark ? "invert brightness-90" : "brightness-75"}`}
                />
              </div>
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? "text-white/35" : "text-black/35"}`}>Backed by</p>
                <p className={`text-sm font-semibold leading-tight ${isDark ? "text-white/70" : "text-black/70"}`}>Atlanta Tech Village</p>
              </div>
              <div className="ml-auto">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? "bg-[#7dd87a]/10 text-[#7dd87a]" : "bg-[#7dd87a]/15 text-[#3a7d34]"}`}>
                  Partner
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? "text-white/30" : "text-black/30"}`}>Live Dataset Preview</span>
              <h3 className="text-2xl font-black mt-1">What gets tracked</h3>
            </div>
            <DatasetPreview isDark={isDark} />

            {/* Alert example */}
            <div className={`p-4 rounded-xl border flex gap-3 items-start ${isDark ? "border-orange-500/25 bg-orange-500/8" : "border-orange-400/30 bg-orange-50"}`}>
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-orange-400">Restock Alert · Store A · 2:43 PM</p>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-black/50"}`}>Kilauea Lemon Cake below threshold (5 units). Peak dinner service in 3h.</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border flex gap-3 items-start ${isDark ? "border-sage/25 bg-sage/8" : "border-sage/30 bg-sage/5"}`}>
              <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-sage">Morning Digest · 6:00 AM</p>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-black/50"}`}>All critical SKUs stocked. Projected revenue today: $1,847. No anomalies overnight.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Value Props Grid ── */}
        <div>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className={`text-xs font-mono uppercase tracking-widest ${isDark ? "text-white/30" : "text-black/30"}`}>For Operators & Investors</span>
            <h3 className="text-3xl md:text-4xl font-black mt-2">What the data delivers</h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUE_PROPS.map((vp, i) => {
              const Icon = vp.icon;
              return (
                <motion.div
                  key={vp.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={`p-6 rounded-2xl border group hover:scale-[1.01] transition-transform duration-200 ${isDark ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]" : "border-black/8 bg-white shadow-sm hover:shadow-md"}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: vp.color + "20" }}>
                      <Icon className="w-5 h-5" style={{ color: vp.color }} />
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg leading-none" style={{ color: vp.color }}>{vp.metric}</p>
                      <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/30" : "text-black/30"}`}>{vp.metricLabel}</p>
                    </div>
                  </div>
                  <h4 className="font-bold text-base mb-2">{vp.title}</h4>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-white/45" : "text-black/45"}`}>{vp.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom CTA bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${isDark ? "border-sage/20 bg-sage/5" : "border-sage/20 bg-sage/5"}`}
        >
          <div>
            <p className="font-black text-xl">Ready to see your store's data?</p>
            <p className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-black/50"}`}>Install in 30 minutes. First 30 days free. No IT team required.</p>
          </div>
          <a href="/pricing" className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sage text-black font-bold text-sm hover:bg-sage/90 transition-colors">
            See Pricing <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
