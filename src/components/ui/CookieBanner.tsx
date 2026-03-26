"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem("cookie-consent");
    if (!choice) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (type: "all" | "necessary") => {
    localStorage.setItem("cookie-consent", type);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[200] bg-[#0d1520] border border-white/10 rounded-2xl p-4 shadow-2xl text-white"
          role="dialog"
          aria-label="Cookie consent"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Cookie Settings</p>
          <p className="text-sm text-white/65 mb-4 leading-relaxed">
            We use cookies to improve your experience and analyze site usage.{" "}
            <Link href="/legal" className="text-sage hover:underline underline-offset-2">
              Learn more
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => accept("all")}
              className="flex-1 py-2 rounded-lg bg-sage text-black font-bold text-sm hover:bg-sage-light transition-colors cursor-pointer"
            >
              Accept All
            </button>
            <button
              onClick={() => accept("necessary")}
              className="flex-1 py-2 rounded-lg border border-white/10 text-white/55 font-semibold text-sm hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              Only Necessary
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
