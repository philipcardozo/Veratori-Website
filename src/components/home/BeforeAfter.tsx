"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/ui/ThemeProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import { CheckCircle2, XCircle } from "lucide-react";

export default function BeforeAfter() {
  const { isDark } = useTheme();

  return (
    <section className={`py-28 border-y ${isDark ? "bg-[#0D1829] border-white/5" : "bg-[#F5F8FA] border-black/5"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          tag="The Veratori Difference"
          title="Manual vs."
          highlight="Automated"
          subtitle="How technology replaces the clipboard and eliminates 12 hours of manual labor per week."
        />

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Manual Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`p-10 rounded-2xl border ${isDark ? "bg-white/2 border-white/5" : "bg-mist border-black/5"}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </span>
              <h3 className="text-2xl font-bold">Manual Clipboard Method</h3>
            </div>
            
            <ul className="space-y-6">
              {[
                { id: "manual-1", text: "90 minutes per shift spent counting boxes and weighing prep." },
                { id: "manual-2", text: "High error rate due to human fatigue and low-light conditions." },
                { id: "manual-3", text: "Inventory is only 'accurate' for the five minutes after the count." },
                { id: "manual-4", text: "Zero data on intra-day waste, theft, or door-open duration." },
              ].map((item) => (
                <li key={item.id} className="flex gap-4">
                  <span className="w-1 h-1 bg-red-500/40 rounded-full mt-2.5 shrink-0" />
                  <p className={`text-base ${isDark ? "text-white/50" : "text-black/50"}`}>{item.text}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Automated Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`p-10 rounded-2xl border relative overflow-hidden ${isDark ? "bg-sage/10 border-sage/20" : "bg-sage/5 border-sage/10 shadow-lg"}`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage/10 blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-sage" />
              </span>
              <h3 className="text-2xl font-bold">Veratori System</h3>
            </div>
            
            <ul className="space-y-6">
              {[
                { id: "veratori-1", text: "Zero minutes per shift. Tracking happens 24/7 in the background." },
                { id: "veratori-2", text: "99.2% accuracy using calibrated LiDAR and YOLO models." },
                { id: "veratori-3", text: "Live dashboard shows exact quantities on hand at any second." },
                { id: "veratori-4", text: "Instant alerts for open doors, low stock, or expiring labels." },
              ].map((item) => (
                <li key={item.id} className="flex gap-4">
                  <CheckCircle2 className="w-4 h-4 text-sage mt-1 shrink-0" />
                  <p className={`text-base font-medium ${isDark ? "text-white/80" : "text-black/80"}`}>{item.text}</p>
                </li>
              ))}
            </ul>

            <div className={`mt-10 pt-8 border-t ${isDark ? "border-white/10" : "border-black/5"}`}>
              <div>
                <p className={`text-xs uppercase tracking-widest font-bold mb-1 ${isDark ? "text-sage" : "text-sage-dark"}`}>Avg. Impact</p>
                <p className="text-3xl font-bold font-mono">12 hrs/wk <span className="text-xl font-normal opacity-50">Saved</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
