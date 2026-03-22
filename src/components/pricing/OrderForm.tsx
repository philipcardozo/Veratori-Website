"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Plus, Minus, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

export default function OrderForm() {
  const { isDark } = useTheme();
  const [hardwareCount, setHardwareCount] = useState(1);
  const pricePerUnit = 359;
  
  const total = hardwareCount * pricePerUnit;

  const handleCheckout = (provider: string) => {
    if (provider === "phantom") {
      // Basic check for Phantom wallet
      if (typeof window !== "undefined" && (window as any).solana && (window as any).solana.isPhantom) {
        alert("Phantom Wallet detected. Requesting connection... (Integration pending)");
      } else {
        alert("Phantom Wallet not found. Please install the extension.");
      }
    } else if (provider === "stripe") {
      alert("Redirecting to Stripe Checkout... (Integration pending)");
    } else if (provider === "paypal") {
      alert("Redirecting to PayPal... (Integration pending)");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`p-8 md:p-10 rounded-2xl border text-left flex flex-col h-full ${isDark ? "bg-[#0B1526]/50 border-white/10 shadow-lg shadow-white/5" : "bg-mist/50 border-black/5 shadow-2xl shadow-black/5"}`}
    >
      <h3 className="text-3xl font-bold mb-2">Order Beta Access</h3>
      <p className={`text-sm mb-8 ${isDark ? "text-white/50" : "text-black/50"}`}>
        Secure your deployment. Enter the number of hardware units required for your coolers.
      </p>

      {/* Configuration */}
      <div className="mb-8 space-y-6">
        <div className={`p-5 rounded-xl border flex items-center justify-between ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5"}`}>
          <div>
            <p className="font-bold text-lg">Sensor Units</p>
            <p className={`text-sm ${isDark ? "text-white/40" : "text-black/40"}`}>$359 / mo per hardware</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setHardwareCount(Math.max(1, hardwareCount - 1))}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${isDark ? "border-white/10 hover:bg-white/10" : "border-black/10 hover:bg-black/5"}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-xl">{hardwareCount}</span>
            <button 
              onClick={() => setHardwareCount(hardwareCount + 1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${isDark ? "border-white/10 hover:bg-white/10" : "border-black/10 hover:bg-black/5"}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between px-2">
          <span className={`text-base font-medium ${isDark ? "text-white/60" : "text-black/60"}`}>Monthly Total</span>
          <span className="text-4xl font-black tracking-tight">${total}</span>
        </div>
        <div className={`h-px w-full ${isDark ? "bg-white/10" : "bg-black/10"}`} />
      </div>

      <div className="flex-1" />

      {/* Payment Options */}
      <div className="space-y-3">
        <p className={`text-xs font-bold uppercase tracking-widest text-center mb-4 ${isDark ? "text-white/30" : "text-black/30"}`}>Select Payment Method</p>
        
        <button
          onClick={() => handleCheckout("stripe")}
          className="w-full flex items-center justify-between px-6 py-4 bg-[#635BFF] hover:bg-[#5851E6] text-white rounded-xl font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.976 9.15c-2.172.806-3.356 1.948-3.356 3.378 0 1.578.896 2.649 2.605 2.649.872 0 1.472-.254 1.948-.697l.532-.533V9.6c-.592-.28-1.072-.41-1.729-.41zm2.403.16c.88 0 1.643-.643 1.643-1.423s-.763-1.423-1.643-1.423c-.88 0-1.642.643-1.642 1.423s.763 1.423 1.642 1.423zm6.921-7.883H.97C.433 1.247 0 1.68 0 2.217v19.566c0 .537.433.97.97.97h22.06c.537 0 .97-.433.97-.97V2.217c0-.537-.433-.97-.97-.97z"/></svg>
            Stripe
          </span>
          <ArrowRight className="w-4 h-4 opacity-50" />
        </button>

        <button 
          onClick={() => handleCheckout("paypal")}
          className="w-full flex items-center justify-between px-6 py-4 bg-[#0070BA] hover:bg-[#005EA6] text-white rounded-xl font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.076 21.337H2.47a.5.5 0 0 1-.49-.58L5.05 1.57a.5.5 0 0 1 .49-.42h5.86c3.48 0 5.43 1.48 5.43 4.28 0 3.2-2.12 5.05-4.8 5.37l-.37.04h-2.12a.66.66 0 0 0-.66.56l-1.8 11.23a.24.24 0 0 1-.24.21h-.11l-.1-.49z"/><path d="M10.33 13.92l.84-5.32a.15.15 0 0 1 .15-.12h1.62c1.78 0 3.01.81 3.01 2.37 0 1.63-1.08 2.87-2.67 3.12l-.21.03h-1.63a.35.35 0 0 0-.35.29l-.6 3.78a.12.12 0 0 1-.12.1H7.83a.25.25 0 0 0 .25-.3z" opacity="0.6"/></svg>
            PayPal
          </span>
          <ArrowRight className="w-4 h-4 opacity-50" />
        </button>

        <button
          onClick={() => handleCheckout("phantom")}
          className="w-full flex items-center justify-between px-6 py-4 bg-[#AB9FF2] hover:bg-[#978AE8] text-white rounded-xl font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <span className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><circle cx="12" cy="12" r="10" fill="white" opacity="0.2"/><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
            Phantom Wallet (Bitcoin)
          </span>
          <ArrowRight className="w-4 h-4 opacity-50" />
        </button>
      </div>
      
      <p className={`mt-6 text-center text-[10px] uppercase font-bold tracking-widest ${isDark ? "text-white/20" : "text-black/20"}`}>
        SSL Encrypted Secure Checkout
      </p>
    </motion.div>
  );
}
