"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Package, Mail, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Product", href: "/product", icon: Package },
  { label: "Contact", href: "/contact", icon: Mail },
];

export default function NotFound() {
  const { isDark } = useTheme();

  return (
    <main
      className={`relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden ${
        isDark ? "bg-midnight text-white" : "bg-white text-black"
      }`}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-sage/30"
            style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 18}%` }}
            animate={{ y: [0, -22, 0], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 2.8 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative text-center"
      >
        {/* Big 404 */}
        <motion.p
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
          className="text-[clamp(110px,18vw,210px)] font-black leading-none text-sage select-none"
        >
          404
        </motion.p>

        <h1 className="text-2xl md:text-3xl font-bold -mt-4 mb-4">Page not found</h1>
        <p className={`text-base max-w-sm mx-auto mb-10 leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
          Looks like this page got lost in the cooler. Let&apos;s get you back on track.
        </p>

        {/* Suggested links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {links.map((l, i) => (
            <motion.div
              key={l.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <Link
                href={l.href}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all group ${
                  i === 0
                    ? "bg-sage text-white hover:bg-sage-light shadow-lg shadow-sage/20"
                    : isDark
                    ? "border border-white/10 text-white/70 hover:text-white hover:border-white/30"
                    : "border border-black/10 text-black/60 hover:text-black hover:border-black/30"
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
