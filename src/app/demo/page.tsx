"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, CheckCircle, Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export default function DemoPage() {
  const { isDark } = useTheme();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey?.trim()) {
      setFormError("Form is not configured yet. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to your environment.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const firstName = (formData.get("firstName") as string)?.trim() ?? "";
    const lastName = (formData.get("lastName") as string)?.trim() ?? "";

    formData.append("access_key", accessKey);
    formData.append("name", [firstName, lastName].filter(Boolean).join(" ") || "Demo request");
    formData.append("subject", "Veratori — Demo Request");

    setFormState("submitting");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: formData });
      const data = (await res.json()) as { success?: boolean; message?: string };

      if (res.ok && data.success) {
        setFormState("success");
        form.reset();
      } else {
        setFormError(data.message ?? "Something went wrong. Please try again or email contact@veratori.com.");
        setFormState("idle");
      }
    } catch {
      setFormError("Network error. Please try again or email contact@veratori.com.");
      setFormState("idle");
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-sage transition-colors ${isDark ? "bg-white/5 border-white/10 text-white placeholder-white/20" : "bg-mist border-black/8 text-black"}`;
  const labelClass = `text-xs font-semibold tracking-widest uppercase ${isDark ? "text-white/40" : "text-black/40"}`;

  return (
    <main className={`transition-colors duration-500 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>

      {/* ── Page Header ── */}
      <section className={`pt-28 pb-14 border-b ${isDark ? "border-white/5" : "border-black/5"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-4 block">Book a Demo</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
              See Veratori in action.
            </h1>
            <p className={`text-lg max-w-2xl leading-relaxed ${isDark ? "text-white/55" : "text-black/55"}`}>
              Schedule a 30-minute live walkthrough with our team. We'll show you exactly how Veratori works in your type of operation — and give you a transparent estimate of what you'd save.
            </p>
          </motion.div>
        </div>
      </section>

      <section className={`py-20 ${isDark ? "bg-midnight" : "bg-mist"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ── Left: What to expect ── */}
            <div className="flex flex-col gap-10">
              <div className="space-y-8">
                {[
                  {
                    icon: CalendarDays,
                    title: "30-minute video call",
                    desc: "A focused session with a member of our founding team — no junior reps, no scripts.",
                  },
                  {
                    icon: CheckCircle,
                    title: "Live dashboard demo",
                    desc: "We'll walk through real inventory data, anomaly alerts, and the morning digest in a live environment.",
                  },
                  {
                    icon: Clock,
                    title: "Your savings estimate",
                    desc: "Based on your number of locations and current method, we'll calculate exactly how many hours and dollars you'd recover.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-5 items-start">
                    <div className={`p-3 rounded-lg shrink-0 ${isDark ? "bg-white/5" : "bg-white shadow-sm"}`}>
                      <Icon className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{title}</h3>
                      <p className={`text-base leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
                <p className={`text-sm italic leading-relaxed ${isDark ? "text-white/50" : "text-black/50"}`}>
                  "Saves us 12 hours a week every single shift."
                </p>
                <p className="text-sage font-semibold text-sm mt-3">— Poke Bowl Restaurant, New York</p>
              </div>
            </div>

            {/* ── Right: Demo request form ── */}
            <div className={`p-10 md:p-12 rounded-xl border ${isDark ? "bg-black border-white/10" : "bg-white border-black/5 shadow-xl"}`}>
              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 bg-sage/15 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">You&apos;re on the list</h3>
                  <p className={`text-base ${isDark ? "text-white/50" : "text-black/50"}`}>
                    We&apos;ll reach out within one business day to confirm your demo slot.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="mt-8 font-semibold text-sage flex items-center gap-2 mx-auto hover:opacity-80 transition-opacity"
                  >
                    Submit another request <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold mb-6">Request your demo slot</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={labelClass}>First Name</label>
                      <input name="firstName" required type="text" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Last Name</label>
                      <input name="lastName" required type="text" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Work Email</label>
                    <input name="email" required type="email" className={inputClass} />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Restaurant / Business Name</label>
                    <input name="company" required type="text" className={inputClass} />
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Number of Locations</label>
                    <select name="locations" required className={inputClass}>
                      <option value="">Select...</option>
                      <option value="1">1 location</option>
                      <option value="2-5">2–5 locations</option>
                      <option value="6-20">6–20 locations</option>
                      <option value="20+">20+ locations</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Current Inventory Method</label>
                    <select name="currentMethod" required className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Manual clipboard">Manual clipboard / pen & paper</option>
                      <option value="Spreadsheet">Spreadsheet</option>
                      <option value="Software">Inventory software</option>
                      <option value="None">No formal process</option>
                    </select>
                  </div>

                  {formError && (
                    <p
                      className={`text-sm rounded-lg border px-4 py-3 ${isDark ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-red-200 bg-red-50 text-red-800"}`}
                      role="alert"
                    >
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className={`w-full py-4 bg-sage text-white font-semibold rounded-md hover:bg-sage-dark transition-colors duration-200 flex items-center justify-center gap-2.5 ${formState === "submitting" ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {formState === "submitting" ? "Sending..." : "Book My Demo"}
                    <CalendarDays className="w-4 h-4" />
                  </button>

                  <p className={`text-xs text-center ${isDark ? "text-white/25" : "text-black/25"}`}>
                    Slots available Mon–Fri, 9 AM–5 PM CT. We&apos;ll confirm within one business day.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
