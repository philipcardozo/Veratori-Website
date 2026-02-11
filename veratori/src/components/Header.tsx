"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "About Us", href: "/about" },
  { label: "Mission", href: "/mission" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-midnight/95 backdrop-blur-xl border-b border-white/[0.06]"
              : "bg-mist/95 backdrop-blur-xl border-b border-midnight/[0.06]"
            : isDark
            ? "bg-midnight"
            : "bg-mist"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5" aria-label="Veratori Home">
              <span
                className={`text-[22px] sm:text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-midnight"
                }`}
              >
                Veratori
              </span>
              <div className="flex gap-[3px]">
                <span className="w-[9px] h-[9px] rounded-[2px] bg-sky" />
                <span className="w-[9px] h-[9px] rounded-[2px] bg-electric" />
                <span
                  className={`w-[9px] h-[9px] rounded-[2px] ${
                    isDark ? "bg-white" : "bg-midnight"
                  }`}
                />
                <span className="w-[9px] h-[9px] rounded-[2px] bg-sage" />
              </div>
            </Link>

            {/* ── Desktop Navigation (center) ── */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-colors duration-200 ${
                      active
                        ? "text-electric"
                        : isDark
                        ? "text-white/60 hover:text-white"
                        : "text-midnight/60 hover:text-midnight"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-electric rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Hamburger (right, always visible) ── */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                isDark
                  ? "text-white/70 hover:text-white hover:bg-white/5"
                  : "text-midnight/70 hover:text-midnight hover:bg-midnight/5"
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.8} />
            </button>
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
              className={`fixed top-0 right-0 bottom-0 z-[70] w-[320px] max-w-[85vw] flex flex-col ${
                isDark
                  ? "bg-midnight border-l border-white/[0.06]"
                  : "bg-mist border-l border-midnight/[0.06]"
              }`}
              role="dialog"
              aria-label="Settings drawer"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-16 sm:h-[72px] shrink-0">
                <span
                  className={`text-sm font-semibold uppercase tracking-widest ${
                    isDark ? "text-white/40" : "text-midnight/40"
                  }`}
                >
                  Menu
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isDark
                      ? "text-white/60 hover:text-white hover:bg-white/5"
                      : "text-midnight/60 hover:text-midnight hover:bg-midnight/5"
                  }`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={1.8} />
                </button>
              </div>

              {/* Divider */}
              <div
                className={`mx-6 h-px ${
                  isDark ? "bg-white/[0.06]" : "bg-midnight/[0.06]"
                }`}
              />

              {/* Mobile nav links (visible only on small screens) */}
              <div className="md:hidden px-4 pt-5 pb-3 space-y-1">
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
                      className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                        pathname === link.href
                          ? "text-electric bg-electric/[0.08]"
                          : isDark
                          ? "text-white/70 hover:text-white hover:bg-white/5"
                          : "text-midnight/70 hover:text-midnight hover:bg-midnight/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div
                  className={`mx-2 mt-4 h-px ${
                    isDark ? "bg-white/[0.06]" : "bg-midnight/[0.06]"
                  }`}
                />
              </div>

              {/* Theme toggle */}
              <div className="px-6 pt-5">
                <button
                  onClick={toggleTheme}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors cursor-pointer ${
                    isDark
                      ? "bg-white/[0.04] hover:bg-white/[0.07] text-white/80"
                      : "bg-midnight/[0.04] hover:bg-midnight/[0.07] text-midnight/80"
                  }`}
                  aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isDark ? "bg-white/10" : "bg-midnight/10"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isDark ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Sun className="w-[18px] h-[18px] text-yellow-300" strokeWidth={1.8} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Moon className="w-[18px] h-[18px] text-midnight" strokeWidth={1.8} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Toggle Theme</p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/40" : "text-midnight/40"
                      }`}
                    >
                      Currently {isDark ? "dark" : "light"} mode
                    </p>
                  </div>
                </button>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Footer */}
              <div className="px-6 pb-6">
                <p
                  className={`text-xs ${
                    isDark ? "text-white/20" : "text-midnight/20"
                  }`}
                >
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
