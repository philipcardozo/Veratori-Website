"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, AlarmClock, BellRing } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/ui/ThemeProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import YOLODemo from "@/components/features/YOLODemo";
import HardwareIntegrationViz from "@/components/product/HardwareIntegrationViz";
import RLTrainer from "@/components/product/RLTrainer";

const steps = [
  {
    n: "01",
    title: "Hardware installs in 30 minutes",
    body: "A compact sensor unit mounts to your walk-in ceiling. No drilling into refrigeration, no network configuration required. Power it on and it's live.",
  },
  {
    n: "02",
    title: "Models calibrate overnight",
    body: "The system spends its first 12–24 hours learning your specific inventory: labels, packaging, shelf positions, and containers unique to your operation.",
  },
  {
    n: "03",
    title: "Your team gets a dashboard",
    body: "From day two onward, managers see a live inventory view, receive morning digests, and get instant alerts for anomalies — no training required.",
  },
];

const capabilities = [
  {
    title: "Automatic Stock Tracking",
    desc: "YOLO-based object detection runs at 15–30 FPS on an NVIDIA Jetson edge device, identifying and counting items continuously without any manual input from staff.",
    Icon: Eye,
  },
  {
    title: "Manager Digest, Every Morning",
    desc: "A plain-English summary lands in your inbox before service begins — quantities on hand, items running low, and anything that expired overnight.",
    Icon: AlarmClock,
  },
  {
    title: "Anomaly Alerts",
    desc: "If a walk-in door is left open, an item disappears unexpectedly, or stock drops below a configured threshold, your team gets notified before it becomes a problem.",
    Icon: BellRing,
  },
];

function ImagePlaceholder({ text, className = "" }: { text: string; className?: string }) {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-center justify-center border-2 border-dashed rounded-xl p-6 ${
      isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-black/[0.02]"
    } ${className}`}>
      <p className={`text-xs text-center leading-relaxed italic ${isDark ? "text-white/25" : "text-black/25"}`}>
        {text}
      </p>
    </div>
  );
}

const stepImages: Record<string, string> = {
  "01": "Technician mounting V1 Sensor unit to walk-in cooler ceiling — ceiling bracket installation, compact white hardware unit, 30-minute install process",
  "02": "Veratori calibration interface — ML model training progress on edge device, item recognition bounding boxes overlaid on cooler shelves during 12-hour learning phase",
  "03": "Restaurant manager reviewing Veratori dashboard on smartphone — morning digest email, live stock levels, low-stock alert notification visible",
};

export default function ProductPage() {
  const { isDark } = useTheme();

  return (
    <main className={`transition-colors duration-500 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>

      {/* ── Problem / Solution Hero ── */}
      <section className={`pt-32 pb-20 border-b ${isDark ? "border-white/5" : "border-black/5"}`}>
        <div className="max-w-5xl mx-auto px-6 lg:px-20">

          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-20"
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">The Problem</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-8">
              Every year, US restaurants waste<br />
              <span className="text-sage">over 22 billion lbs of food.</span>
            </h1>
            <div className={`space-y-5 text-lg leading-relaxed max-w-3xl ${isDark ? "text-white/65" : "text-black/65"}`}>
              <p>
                Over 50% of food waste in the restaurant industry comes from uncoordinated food prep and expiring produce. Managers don't know how much food to stock. Frontline employees don't know how much food to prepare.
              </p>
              <p>
                This information gap — between how much a business produces and how many customers actually walk through the door — is the root of the food waste crisis.
              </p>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`h-px w-full mb-20 origin-left ${isDark ? "bg-white/10" : "bg-black/10"}`}
          />

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mb-20"
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8">
              If an information gap is the problem,<br />
              <span className="text-sage">Veratori closes the gap.</span>
            </h2>
            <div className={`space-y-5 text-lg leading-relaxed max-w-3xl ${isDark ? "text-white/65" : "text-black/65"}`}>
              <p>
                Veratori integrates seamless, non-invasive food tracking technology into your business — collecting data on supply and demand 24/7. The system builds a history of data and translates it into a real-time forecast of future customer traffic and menu demand.
              </p>
              <p>
                No more guessing what to stock. No more throwing away food that nobody ordered. Just clear, actionable intelligence delivered to your team every single day.
              </p>
            </div>
          </motion.div>

          {/* Analogy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className={`rounded-2xl p-10 border ${isDark ? "bg-white/[0.03] border-white/10" : "bg-sage/[0.04] border-sage/20"}`}
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Think of it like the weather</span>
            <p className={`text-xl md:text-2xl font-medium leading-relaxed mb-6 ${isDark ? "text-white/90" : "text-black/90"}`}>
              Just as you check the weather to know if it'll rain tomorrow, you check Veratori to know how many customers will walk in the next hour — and exactly what to have ready for them.
            </p>
            <p className={`text-base leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
              How many customers will come in? What items will be most popular? How much should we prep? Veratori answers all three — automatically, every day.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── How It Works Timeline ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHeading
            tag="Setup"
            title="From unboxing"
            highlight="to live in one day"
            subtitle="No enterprise IT project. No lengthy onboarding. Just a sensor, a ceiling mount, and 24 hours."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={`p-8 rounded-xl border relative ${isDark ? "bg-white/5 border-white/10" : "bg-mist border-black/5"}`}
              >
                {/* <ImagePlaceholder text={stepImages[step.n]} className="h-36 w-full mb-4" /> */}
                <span className={`text-5xl font-black tracking-wider mb-6 block text-sage`}>{step.n}</span>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Capabilities ── */}
      <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHeading
            tag="Features"
            title="What Veratori"
            highlight="does for your team"
            subtitle="Three core capabilities that replace manual inventory from day one."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {capabilities.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={`p-8 rounded-xl border ${isDark ? "bg-black border-white/10" : "bg-white border-black/5 shadow-sm"}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 ${isDark ? "bg-sage/15" : "bg-sage/10"}`}>
                  <item.Icon className="w-5 h-5 text-sage" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className={`text-base leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hardware Specifications ── */}
      <section className="py-24 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              tag="The Hardware"
              title="Industrial grade"
              highlight="Edge Computing"
              subtitle="The V1 Sensor is built to withstand the harshest kitchen environments while running complex neural networks in real-time."
              align="left"
            />
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 mt-12">
              {[
                { label: "Processor", value: "NVIDIA Jetson Orin Nano" },
                { label: "Sensing", value: "ToF LiDAR + 4K RGB" },
                { label: "Durability", value: "IP67 Waterproof" },
                { label: "Connectivity", value: "WiFi 6E + LTE Failover" },
              ].map((spec) => (
                <div key={spec.label}>
                  <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${isDark ? "text-white/30" : "text-black/30"}`}>{spec.label}</p>
                  <p className="text-lg font-bold">{spec.value}</p>
                </div>
              ))}
            </div>
            {/* <ImagePlaceholder
              text="V1 Sensor unit detailed product photography — angled hero shot showing IP67 housing, LiDAR aperture, RGB camera module, and NVIDIA Jetson compute module visible through ventilated panel"
              className="h-56 w-full mt-12"
            /> */}
          </div>
          <div className={`aspect-square rounded-2xl relative overflow-hidden border ${isDark ? "bg-white/5 border-white/10" : "bg-mist border-black/5"}`}>
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <HardwareIntegrationViz />
            </div>
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── RL Training Lab ── */}
      {/* <RLTrainer /> */}

      {/* ── Live Demo Sandbox (temporarily hidden) ── */}
      {/*<section className="py-20 border-y border-black/5 dark:border-white/5 bg-white/2 dark:bg-black/2">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <SectionHeading
            tag="Demonstration"
            title="Try the engine"
            highlight="live in your browser"
            subtitle="Veratori sensors run high-speed inference on the edge. You can test the underlying detection logic below using your current camera."
          />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <YOLODemo />
        </div>
      </section>*/}

    </main>
  );
}
