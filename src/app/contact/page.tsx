"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface FormData { name: string; email: string; company: string; message: string }
interface FormErrors { name?: string; email?: string; message?: string }

export default function ContactPage() {
  const { isDark } = useTheme();
  const [form, setForm] = useState<FormData>({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const ic = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 ${
      isDark
        ? `bg-white/5 text-white placeholder-white/30 ${errors[field] ? "border-red-500/50" : focused === field ? "border-electric/50 ring-1 ring-electric/20" : "border-white/10 hover:border-white/20"}`
        : `bg-midnight/5 text-midnight placeholder-midnight/30 ${errors[field] ? "border-red-500/50" : focused === field ? "border-electric/50 ring-1 ring-electric/20" : "border-midnight/10 hover:border-midnight/20"}`
    }`;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-midnight via-midnight-light to-midnight" : "bg-gradient-to-b from-mist via-white to-mist"}`} />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-electric/5 blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-semibold text-electric uppercase tracking-widest">Contact</span>
            <h1 className={`mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight ${isDark ? "text-white" : "text-midnight"}`}>
              Let&apos;s <span className="gradient-text">Connect</span>
            </h1>
            <p className={`mt-4 text-lg max-w-2xl mx-auto ${isDark ? "text-white/50" : "text-midnight/50"}`}>
              Ready to transform your inventory management? Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-16 overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? "bg-midnight" : "bg-mist"}`} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" exit={{ opacity: 0, y: -20 }} onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-2xl border space-y-5 ${isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-midnight/5 shadow-xl"}`} noValidate>
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-midnight/70"}`}>Full Name *</label>
                    <input id="name" type="text" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} className={ic("name")} placeholder="Jane Doe" />
                    <AnimatePresence>{errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-400 text-xs mt-1">{errors.name}</motion.p>}</AnimatePresence>
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-midnight/70"}`}>Email *</label>
                    <input id="email" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: undefined }); }} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} className={ic("email")} placeholder="jane@company.com" />
                    <AnimatePresence>{errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-400 text-xs mt-1">{errors.email}</motion.p>}</AnimatePresence>
                  </div>
                  <div>
                    <label htmlFor="company" className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-midnight/70"}`}>Company</label>
                    <input id="company" type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} onFocus={() => setFocused("company")} onBlur={() => setFocused(null)} className={ic("message")} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label htmlFor="message" className={`block text-sm font-medium mb-1.5 ${isDark ? "text-white/70" : "text-midnight/70"}`}>Message *</label>
                    <textarea id="message" rows={5} value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); if (errors.message) setErrors({ ...errors, message: undefined }); }} onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} className={`${ic("message")} resize-none`} placeholder="Tell us about your inventory challenges..." />
                    <AnimatePresence>{errors.message && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-400 text-xs mt-1">{errors.message}</motion.p>}</AnimatePresence>
                  </div>
                  <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 bg-electric text-white font-semibold rounded-xl glow-electric glow-electric-hover transition-all duration-300 cursor-pointer">
                    Send Message
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`p-12 rounded-2xl border text-center ${isDark ? "bg-white/[0.02] border-white/5" : "bg-white border-midnight/5 shadow-xl"}`}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-midnight"}`}>Message Sent!</h3>
                  <p className={isDark ? "text-white/50" : "text-midnight/50"}>Thank you, {form.name}. We&apos;ll be in touch within 24 hours.</p>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", message: "" }); }} className="mt-6 px-6 py-2 text-sm text-electric border border-electric/30 rounded-lg hover:bg-electric/10 transition-colors cursor-pointer">
                    Send another
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info side */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Veratori office" fill className="object-cover" sizes="50vw" loading="lazy" />
              <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-midnight/70 to-transparent" : "bg-gradient-to-t from-white/50 to-transparent"}`} />
            </div>

            {[
              { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", label: "Email", value: "hello@veratori.com", color: "text-electric" },
              { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", label: "Headquarters", value: "San Francisco, CA", color: "text-sage" },
              { icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", label: "Response Time", value: "Within 24 hours", color: "text-sky" },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className={`flex items-center gap-4 p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-midnight/5"}`}>
                <svg className={`w-5 h-5 flex-shrink-0 ${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                <div>
                  <p className={`text-xs ${isDark ? "text-white/40" : "text-midnight/40"}`}>{item.label}</p>
                  <p className={`font-medium ${isDark ? "text-white" : "text-midnight"}`}>{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" alt="San Francisco skyline" fill className="object-cover" sizes="50vw" loading="lazy" />
              <div className={`absolute inset-0 ${isDark ? "bg-midnight/40" : "bg-white/30"}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`px-4 py-2 rounded-xl backdrop-blur-sm ${isDark ? "bg-midnight/80 text-white" : "bg-white/80 text-midnight"}`}>
                  <p className="text-sm font-medium flex items-center gap-1.5"><MapPin className="w-4 h-4 text-electric" strokeWidth={1.8} /> San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
