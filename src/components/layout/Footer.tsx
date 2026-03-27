"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

/* ─── Link columns ─── */
const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "How It Works", href: "/product#how-it-works" },
      { label: "Capabilities", href: "/product#capabilities" },
      { label: "Hardware Specs", href: "/product#hardware" },
    ],
  },
  {
    heading: "Impact",
    links: [
      { label: "Our Mission", href: "/mission" },
      { label: "Data Pipeline", href: "/mission#pipeline" },
      { label: "ROI Calculator", href: "/mission#roi" },
      { label: "Research", href: "/mission#research" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "The Team", href: "/about#team" },
      { label: "Scale & Reach", href: "/about#scale" },
      { label: "Careers", href: "/about#hiring" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "LiDAR Whitepaper", href: "/documents/lidar-paper.pdf" },
      { label: "Documentation", href: "/resources" },
      { label: "Press / Media", href: "/press" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Partners", href: "/partners" },
      { label: "Legal", href: "/legal" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    heading: "Pricing",
    links: [
      { label: "Beta Access", href: "/pricing" },
      { label: "Order Now", href: "/pricing#order" },
      { label: "FAQ", href: "/pricing#faq" },
    ],
  },
];

/* ─── Social icons ─── */
const socialIcons = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/veratori/",
    path: "M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/veratori_inc/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/veratori",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer className="relative border-t bg-midnight border-white/6 text-white">

      {/* ── Row 1: Brand + Newsletter — NYC background ── */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Background image */}
        <Image
          src="/images/assets/nyc-skyline.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
        {/* Dark blue overlay */}
        <div className="absolute inset-0 bg-[#0B1526]/80" />

        <div className="relative z-10 w-full mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row justify-between gap-10"
        >
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/images/Logos/Brand Identity/Logos/Logo_name_dark-nobg.png"
                alt="Veratori"
                width={180}
                height={45}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/55 mb-5">
              Veratori automates inventory management for food service operators using on-device computer vision and LiDAR depth sensing.
            </p>
            <a href="mailto:contact@veratori.com" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              contact@veratori.com
            </a>
            <div className="flex gap-3 mt-5">
              {socialIcons.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                  aria-label={s.label}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:max-w-sm w-full">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Newsletter</p>
            <h4 className="text-base font-bold text-white mb-1">Stay in the loop</h4>
            <p className="text-sm text-white/40 mb-4">Monthly updates on food-tech innovation and Veratori news.</p>
            {subscribed ? (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold text-sage"
              >
                You&apos;re subscribed! Thanks for joining.
              </motion.p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@restaurant.com"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 outline-none focus:border-sage/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-sage text-white font-bold text-sm hover:bg-sage-light transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  Subscribe <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
        </div>
      </div>

      {/* ── Rows 2–4: plain dark background ── */}
      <div className="w-full mx-auto px-6 sm:px-10 lg:px-12 pb-8">
        {/* ── Row 2: Link Columns ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10 py-12 border-b border-white/[0.06]"
        >
          {footerColumns.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-bold text-sm mb-5 text-white">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-medium text-white/45 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* ── Row 3: Locations ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="flex flex-wrap gap-6 py-8 border-b border-white/[0.06]"
        >
          {[
            { city: "Austin, TX", label: "HQ", hq: true },
            { city: "Atlanta, GA", label: "", hq: false },
            { city: "New York, NY", label: "", hq: false },
          ].map((loc) => (
            <div key={loc.city} className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
              <span className="text-sm text-white/50">{loc.city}</span>
              {loc.hq && (
                <span className="text-[10px] font-bold text-sage bg-sage/10 px-1.5 py-0.5 rounded">HQ</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* ── Row 4: Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
        >
          <p className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} Veratori Inc. All rights reserved. &nbsp;·&nbsp; Built with precision in Austin, TX 🌿
          </p>
          <div className="flex items-center gap-4">
            <Link href="/legal" className="text-xs text-white/35 hover:text-white/70 transition-colors">Legal</Link>
            <Link href="/privacy" className="text-xs text-white/35 hover:text-white/70 transition-colors">Privacy</Link>
            <button
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                window.location.reload();
              }}
              className="text-xs text-white/35 hover:text-white/70 transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
