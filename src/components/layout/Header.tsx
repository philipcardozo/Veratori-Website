"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "About", href: "/about" },
  { label: "Impact", href: "/mission" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { theme, toggleTheme, isDark } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setDrawerOpen(false), [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? isDark
            ? "bg-[#151D3B]/80 backdrop-blur-[24px] saturate-[1.4] border-b border-white/[0.06]"
            : "bg-[#F3F5F7]/80 backdrop-blur-[24px] saturate-[1.4] border-b border-black/[0.06]"
          : "bg-transparent"
          }`}
      >
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between h-20 sm:h-[88px]">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center" aria-label="Veratori Home">
              <Image
                src="/images/Logos/Brand Identity/Logos/Logo_name_dark_nobg.png"
                alt="Veratori Logo"
                width={180}
                height={45}
                className={`h-11 sm:h-[48px] w-auto object-contain transition-all duration-300 ${isDark ? "invert" : ""}`}
                priority
              />
            </Link>

            {/* ── Desktop Navigation (center) ── */}
            <nav
              className="hidden md:flex items-center gap-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {navLinks.filter(link => !["Home", "Contact"].includes(link.label)).map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[clamp(17px,1.2vw,19px)] font-semibold transition-colors duration-200 py-1 ${active
                      ? "text-sage"
                      : isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"
                      }`}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-sage rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Actions ── */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-black/70 hover:text-black hover:bg-black/5"}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link
                href="/contact"
                className={`hidden md:inline-flex items-center justify-center px-7 py-3 rounded-full text-[clamp(16px,1.1vw,18px)] font-bold transition-all duration-300 ${isDark
                  ? "bg-sage text-white hover:bg-sage-light"
                  : "bg-sage text-white hover:opacity-90 shadow-lg"
                  }`}
                aria-label="Contact us - open contact page"
              >
                Contact
              </Link>

              <button
                onClick={() => setDrawerOpen(true)}
                className={`md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-black/70 hover:text-black hover:bg-black/5"}`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Right-Slide Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className={`fixed top-0 right-0 bottom-0 z-[70] w-[320px] max-w-[85vw] flex flex-col backdrop-blur-[24px] saturate-[1.4] border-l ${isDark ? "bg-[#151D3B]/80 border-white/[0.06]" : "bg-[#F3F5F7]/80 border-black/[0.06]"}`}
              role="dialog"
              aria-label="Settings drawer"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-[clamp(16px,2vw,24px)] h-16 sm:h-[72px] shrink-0">
                <span className={`text-[clamp(12px,0.9vw,14px)] font-semibold uppercase tracking-widest ${isDark ? "text-white/40" : "text-black/40"}`}>
                  Menu
                </span>
                <div className="flex items-center gap-2">
                  {/* Close button */}
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${isDark ? "text-white/60 hover:text-white hover:bg-white/5" : "text-black/60 hover:text-black hover:bg-black/5"}`}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-[clamp(16px,2vw,24px)] h-px bg-white/[0.06]" />

              {/* Navigation links - visible on all screens */}
              <div className="px-[clamp(12px,1.5vw,16px)] pt-[clamp(16px,2vw,24px)] pb-[clamp(12px,1.5vw,16px)] space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`block px-[clamp(16px,2vw,24px)] py-[clamp(12px,1.5vw,16px)] rounded-xl text-[clamp(14px,1vw,16px)] font-medium transition-colors ${pathname === link.href
                        ? "text-sage bg-sage/10"
                        : isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-black/70 hover:text-black hover:bg-black/5"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Footer */}
              <div className="px-[clamp(24px,3vw,32px)] pb-[clamp(24px,3vw,32px)]">
                <p className={`text-[clamp(10px,0.85vw,12px)] ${isDark ? "text-white/30" : "text-black/30"}`}>
                  &copy; {new Date().getFullYear()} Veratori
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
