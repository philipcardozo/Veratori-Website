"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, AlarmClock, BellRing } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import SectionHeading from "@/components/ui/SectionHeading";

const capabilities = [
  {
    title: "Automatic Stock Tracking",
    desc: "State-of-the-art AI cameras and sensors identify food items and expiration dates. Inventory is continuously observed, removing the need for manual monitoring from frontline workers.",
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

export default function KeyCapabilities() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        tag="Capabilities"
        title="Everything your team needs"
        highlight="to stop counting by hand"
        subtitle="Three core features that replace manual inventory from day one."
      />
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {capabilities.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <div className={`relative h-full overflow-hidden rounded-xl border p-8 ${isDark ? "bg-white/5 border-white/10" : "bg-mist border-black/5 shadow-sm"}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 ${isDark ? "bg-sage/15" : "bg-sage/10"}`}>
                <c.Icon className="w-5 h-5 text-sage" strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-bold mb-3">{c.title}</h3>
              <p className={`text-base leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
                {c.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
