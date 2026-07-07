"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Minus, X, Eye, EyeOff, ArrowRight, Lock,
  Check, Zap, Building2, Cpu, ShieldCheck, Wifi, Camera,
} from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

/* ─── Plan definitions ─── */
const plans = [
  {
    id: "standard",
    name: "Standard",
    price: 299,
    icon: Cpu,
    tagline: "One walk-in, fully automated",
    features: [
      "YOLO object detection (15 FPS)",
      "Daily manager digest email",
      "Anomaly & low-stock alerts",
      "Veratori dashboard access",
      "IP67 waterproof housing",
      "WiFi 6E connectivity",
    ],
    badge: null,
  },
  {
    id: "growth",
    name: "Growth",
    price: 359,
    icon: Zap,
    tagline: "For multi-cooler operations",
    features: [
      "Everything in Standard",
      "YOLO detection at 30 FPS",
      "4K RGB + ToF LiDAR sensing",
      "Multi-location dashboard",
      "Inventory forecasting",
      "WiFi 6E + LTE failover",
    ],
    badge: null,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 549,
    icon: Building2,
    tagline: "Full-chain operational intelligence",
    features: [
      "Everything in Growth",
      "Dual-camera array per unit",
      "Dedicated account manager",
      "API access & webhooks",
      "Custom alert thresholds",
      "Priority hardware support",
    ],
    badge: null,
  },
] as const;

type PlanId = (typeof plans)[number]["id"];

/* ─── Subscription terms ─── */
type Term = { months: 1 | 6 | 12 | 24; label: string; discount: number; badge?: string };

const terms: Term[] = [
  { months: 1,  label: "Monthly",   discount: 0 },
  { months: 6,  label: "6 Months",  discount: 5 },
  { months: 12, label: "12 Months", discount: 12, badge: "Best Value" },
  { months: 24, label: "24 Months", discount: 20 },
];

type TermMonths = Term["months"];

/* ─── Brand SVG logos ─── */
function StripeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-auto" aria-label="Stripe" fill="white">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </svg>
  );
}

function PayPalLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" aria-label="PayPal">
      <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ─── Login Modal ─── */
function LoginModal({ provider, onClose, onSuccess }: { provider: string; onClose: () => void; onSuccess: () => void }) {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<"google" | "email">("google");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const providerLabel: Record<string, string> = { stripe: "Stripe", paypal: "PayPal" };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1200);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
          isDark ? "bg-[#0B1526] border-white/10" : "bg-white border-black/8"
        }`}
      >
        <div className={`px-6 pt-6 pb-5 border-b ${isDark ? "border-white/8" : "border-black/6"}`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${isDark ? "hover:bg-white/10" : "hover:bg-black/5"}`}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-sage" />
            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/40" : "text-black/40"}`}>Secure Checkout</span>
          </div>
          <h2 className="text-xl font-bold">Sign in to continue</h2>
          <p className={`text-sm mt-1 ${isDark ? "text-white/45" : "text-black/45"}`}>
            Create or sign in to your account to proceed with{" "}
            <span className="font-semibold">{providerLabel[provider]}</span>.
          </p>
        </div>

        <div className={`flex gap-1 p-3 border-b ${isDark ? "border-white/8 bg-white/[0.02]" : "border-black/6 bg-black/[0.02]"}`}>
          {(["google", "email"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === t ? "bg-sage text-black shadow-sm" : isDark ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"
              }`}
            >
              {t === "google" ? "Google" : "Email & Password"}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "google" ? (
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogle}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
                  isDark ? "border-white/15 bg-white/5 hover:bg-white/10 text-white" : "border-black/10 bg-white hover:bg-black/[0.02] text-black shadow-sm"
                } disabled:opacity-60`}
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-5 h-5 rounded-full border-2 border-sage border-t-transparent" />
                ) : (
                  <><GoogleLogo />Continue with Google</>
                )}
              </motion.button>
              <p className={`text-center text-xs ${isDark ? "text-white/30" : "text-black/30"}`}>We'll create your Veratori account automatically</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className={`flex gap-1 p-1 rounded-lg ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      mode === m ? isDark ? "bg-white/15 text-white" : "bg-white text-black shadow-sm" : isDark ? "text-white/40" : "text-black/40"
                    }`}
                  >
                    {m === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/60" : "text-black/60"}`}>Email</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@restaurant.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark ? "bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-sage/60" : "bg-white border-black/10 text-black placeholder-black/30 focus:border-sage/60"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-white/60" : "text-black/60"}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none transition-all ${
                      isDark ? "bg-white/5 border-white/10 text-white placeholder-white/25 focus:border-sage/60" : "bg-white border-black/10 text-black placeholder-black/30 focus:border-sage/60"
                    }`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? "text-white/30 hover:text-white/60" : "text-black/30 hover:text-black/60"}`}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-sage text-black font-bold text-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="w-5 h-5 rounded-full border-2 border-black/40 border-t-transparent" />
                ) : (
                  <>{mode === "signin" ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>
          )}
          <p className={`mt-5 text-center text-[10px] leading-relaxed ${isDark ? "text-white/20" : "text-black/20"}`}>
            By continuing, you agree to Veratori's Terms of Service and Privacy Policy.<br />
            <span className="text-sage">SSL encrypted · SOC 2 compliant</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Pay Button ─── */
function PayButton({ onClick, bg, hoverBg, children }: { onClick: () => void; bg: string; hoverBg: string; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover="hovered"
      whileTap={{ scale: 0.98 }}
      variants={{ idle: {}, hovered: {} }}
      initial="idle"
      className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-semibold text-white shadow-sm cursor-pointer overflow-hidden relative text-sm"
      style={{ backgroundColor: bg }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = hoverBg; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = bg; }}
    >
      <span className="flex items-center gap-3 relative z-10">{children}</span>
      <motion.span
        variants={{ idle: { x: 0, opacity: 0.5 }, hovered: { x: 4, opacity: 1 } }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative z-10"
      >
        <ArrowRight className="w-4 h-4" />
      </motion.span>
      <motion.div
        variants={{ idle: { opacity: 0, x: "-100%" }, hovered: { opacity: 1, x: "110%" } }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
      />
    </motion.button>
  );
}

/* ─── Main Configurator ─── */
export default function OrderForm() {
  const { isDark } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("growth");
  const [unitCount, setUnitCount] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState<TermMonths>(12);
  const [loginFor, setLoginFor] = useState<string | null>(null);

  const plan = plans.find((p) => p.id === selectedPlan)!;
  const term = terms.find((t) => t.months === selectedTerm)!;

  const baseMonthly = plan.price * unitCount;
  const discountedMonthly = Math.round(baseMonthly * (1 - term.discount / 100));
  const totalCommitment = discountedMonthly * term.months;
  const monthlySavings = baseMonthly - discountedMonthly;
  const totalSavings = monthlySavings * term.months;

  const handleCheckout = (provider: string) => setLoginFor(provider);
  const handleLoginSuccess = () => {
    const provider = loginFor;
    setLoginFor(null);
    if (provider === "stripe") alert("Redirecting to Stripe Checkout... (Integration pending)");
    else if (provider === "paypal") alert("Redirecting to PayPal... (Integration pending)");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`p-8 md:p-10 rounded-2xl border text-left ${isDark ? "bg-[#0B1526]/50 border-white/10 shadow-lg shadow-white/5" : "bg-mist/50 border-black/5 shadow-2xl shadow-black/5"}`}
      >
        <h3 className="text-3xl font-bold mb-1">Configuring Beta Prices</h3>
        <p className={`text-sm mb-8 ${isDark ? "text-white/50" : "text-black/50"}`}>
          Choose your plan, number of units, and subscription term.
        </p>

        {/* ── Step 1: Plan ── */}
        <div className="mb-8">
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-white/35" : "text-black/35"}`}>1 — Select Plan</p>
          <div className="grid grid-cols-1 gap-3">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`relative w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-sage bg-sage/10"
                      : isDark ? "border-white/10 hover:border-white/20 bg-white/[0.02]" : "border-black/8 hover:border-black/15 bg-white"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-sage text-black px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-sage/20" : isDark ? "bg-white/5" : "bg-black/5"}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? "text-sage" : isDark ? "text-white/50" : "text-black/50"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className={`font-bold text-base ${isSelected ? "text-sage" : ""}`}>{p.name}</span>
                        <span className={`text-sm ${isDark ? "text-white/40" : "text-black/40"}`}>{p.tagline}</span>
                      </div>
                      <p className={`text-xl font-black mt-0.5 ${isSelected ? "" : isDark ? "text-white/80" : "text-black/80"}`}>
                        ${p.price}<span className={`text-xs font-normal ml-1 ${isDark ? "text-white/35" : "text-black/35"}`}>/unit/mo</span>
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center transition-all ${
                      isSelected ? "border-sage bg-sage" : isDark ? "border-white/20" : "border-black/20"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                    </div>
                  </div>
                  {/* Features */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-sage/20 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                          {p.features.map((f) => (
                            <div key={f} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-sage shrink-0" strokeWidth={2.5} />
                              <span className={`text-xs ${isDark ? "text-white/60" : "text-black/60"}`}>{f}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2: Units ── */}
        <div className="mb-8">
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-white/35" : "text-black/35"}`}>2 — Number of Sensor Units</p>
          <div className={`px-5 py-4 rounded-xl border flex items-center justify-between ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5"}`}>
            <div>
              <p className="font-bold">V1 Sensor Units</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-black/40"}`}>1 unit per walk-in cooler or storage room</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setUnitCount(Math.max(1, unitCount - 1))}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${isDark ? "border-white/10 hover:bg-white/10" : "border-black/10 hover:bg-black/5"}`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black text-2xl">{unitCount}</span>
              <button
                onClick={() => setUnitCount(unitCount + 1)}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${isDark ? "border-white/10 hover:bg-white/10" : "border-black/10 hover:bg-black/5"}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Step 3: Term ── */}
        <div className="mb-8">
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-white/35" : "text-black/35"}`}>3 — Subscription Term</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {terms.map((t) => {
              const isSelected = selectedTerm === t.months;
              return (
                <button
                  key={t.months}
                  onClick={() => setSelectedTerm(t.months)}
                  className={`relative py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-sage bg-sage/10"
                      : isDark ? "border-white/10 hover:border-white/20 bg-white/[0.02]" : "border-black/8 hover:border-black/15 bg-white"
                  }`}
                >
                  {t.badge && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest bg-sage text-black px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      {t.badge}
                    </span>
                  )}
                  <p className={`font-bold text-sm ${isSelected ? "text-sage" : ""}`}>{t.label}</p>
                  {t.discount > 0 ? (
                    <p className="text-xs text-sage font-semibold mt-0.5">{t.discount}% off</p>
                  ) : (
                    <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-black/30"}`}>standard</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Pricing Summary ── */}
        <div className={`rounded-xl border p-5 mb-8 space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5"}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? "text-white/30" : "text-black/30"}`}>Order Summary</p>

          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
              {plan.name} × {unitCount} unit{unitCount > 1 ? "s" : ""}
            </span>
            <span className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>${plan.price * unitCount}/mo</span>
          </div>

          {term.discount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-sage">{term.label} discount ({term.discount}% off)</span>
              <span className="text-sm text-sage font-semibold">−${monthlySavings}/mo</span>
            </div>
          )}

          <div className={`h-px ${isDark ? "bg-white/10" : "bg-black/8"}`} />

          <div className="flex justify-between items-end">
            <div>
              <p className={`text-xs ${isDark ? "text-white/40" : "text-black/40"}`}>Monthly charge</p>
              <p className="text-3xl font-black tracking-tight">${discountedMonthly}<span className={`text-sm font-normal ml-1 ${isDark ? "text-white/40" : "text-black/40"}`}>/mo</span></p>
            </div>
            {term.months > 1 && (
              <div className="text-right">
                <p className={`text-xs ${isDark ? "text-white/40" : "text-black/40"}`}>Total for {term.months} months</p>
                <p className="text-lg font-bold">${totalCommitment.toLocaleString()}</p>
              </div>
            )}
          </div>

          {totalSavings > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
              <p className="text-xs text-sage font-semibold">
                You save ${totalSavings.toLocaleString()} over {term.months} months vs month-to-month
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className={`text-xs ${isDark ? "text-white/35" : "text-black/35"}`}>+ One-time installation fee</span>
            <span className={`text-xs font-semibold ${isDark ? "text-white/35" : "text-black/35"}`}>Contact us</span>
          </div>
          <p className="text-xs text-sage/80 font-medium">✓ First 30 days free</p>
        </div>

        {/* ── Payment Options ── */}
        <div className="space-y-3">
          <p className={`text-xs font-bold uppercase tracking-widest text-center mb-4 ${isDark ? "text-white/30" : "text-black/30"}`}>Select Payment Method</p>
          <PayButton onClick={() => handleCheckout("stripe")} bg="#635BFF" hoverBg="#5247E8">
            <StripeLogo />
            <span>Credit Card (Stripe)</span>
          </PayButton>
          <PayButton onClick={() => handleCheckout("paypal")} bg="#0070BA" hoverBg="#005EA6">
            <PayPalLogo />
            <span>PayPal</span>
          </PayButton>
        </div>

        <p className={`mt-6 text-center text-[10px] uppercase font-bold tracking-widest ${isDark ? "text-white/20" : "text-black/20"}`}>
          SSL Encrypted Secure Checkout
        </p>
      </motion.div>

      <AnimatePresence>
        {loginFor && (
          <LoginModal
            provider={loginFor}
            onClose={() => setLoginFor(null)}
            onSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}
