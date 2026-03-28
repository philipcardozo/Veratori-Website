"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu, X, Sun, Moon, ChevronDown,
  Package, Cpu, LineChart, Users, MapPin, BookOpen,
  Microscope, Calculator, DollarSign, Mail, ArrowRight,
} from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

/* ─── Mega-menu data ─── */
type MegaSection = { title: string; desc: string; href: string; icon: React.ElementType };
type MegaMenu = { sections: MegaSection[]; quote?: string; locations?: string[] };

const megaMenus: Record<string, MegaMenu> = {
  Product: {
    sections: [
      { title: "Product Overview", desc: "See the full Veratori system", href: "/product", icon: Package },
      { title: "How It Works", desc: "Setup in 3 simple steps", href: "/product#how-it-works", icon: Cpu },
      { title: "Capabilities", desc: "YOLO detection & RL training", href: "/product#capabilities", icon: LineChart },
      { title: "Hardware Specs", desc: "V1 Sensor · Edge compute", href: "/product#hardware", icon: Package },
    ],
  },
  About: {
    sections: [
      { title: "Our Story", desc: "Founded 2023 in Atlanta, GA", href: "/about", icon: BookOpen },
      { title: "The Team", desc: "Meet the founders & engineers", href: "/about#team", icon: Users },
      { title: "Scale & Expansion", desc: "NYC · ATL · AUS", href: "/about#scale", icon: MapPin },
      { title: "Careers", desc: "Join the Veratori team →", href: "/about#hiring", icon: ArrowRight },
    ],
  },
  Impact: {
    sections: [
      { title: "Our Mission", desc: "Reducing food waste at scale", href: "/mission", icon: Microscope },
      { title: "Data Pipeline", desc: "Cooler to cloud, explained", href: "/mission#pipeline", icon: LineChart },
      { title: "ROI Calculator", desc: "See your savings in 30 sec", href: "/mission#roi", icon: Calculator },
      { title: "Research", desc: "LiDAR whitepaper & R&D", href: "/mission#research", icon: BookOpen },
    ],
  },
  Pricing: {
    sections: [
      { title: "Pricing Plans", desc: "$359 / unit / month", href: "/pricing", icon: DollarSign },
      { title: "Order Beta Access", desc: "Secure your deployment", href: "/pricing#order", icon: Package },
      { title: "FAQ", desc: "Common questions answered", href: "/pricing#faq", icon: BookOpen },
    ],
    quote: '"Saves us 12 hours a week every single shift." — Poke Bowl Restaurant',
  },
  Contact: {
    sections: [
      { title: "Get In Touch", desc: "contact@veratori.com", href: "/contact", icon: Mail },
      { title: "Book a Demo", desc: "Schedule a live walkthrough", href: "/contact?source=demo", icon: Calculator },
    ],
    locations: ["Austin, TX (HQ)", "Atlanta, GA", "New York, NY"],
  },
};

const navItems = Object.keys(megaMenus);

/* ─── Route map for active state ─── */
const routeMap: Record<string, string> = {
  Product: "/product",
  About: "/about",
  Impact: "/mission",
  Pricing: "/pricing",
  Contact: "/contact",
};

export default function Header() {
  const { toggleTheme, isDark } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setDrawerOpen(false); setActiveMenu(null); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const openMenu = (key: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setActiveMenu(key);
  };

  const scheduleClose = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const cancelClose = () => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
  };

  const isActive = (key: string) => pathname.replace(/\/$/, "") === routeMap[key];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-[#151D3B]/80 backdrop-blur-[24px] saturate-[1.4] border-b border-white/[0.06]"
              : "bg-[#F3F5F7]/80 backdrop-blur-[24px] saturate-[1.4] border-b border-black/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between h-20 sm:h-[88px]">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center shrink-0" aria-label="Veratori Home">
              <Image
                src={
                  isDark
                    ? "/images/Logos/Brand Identity/Logos/Logo_name_dark-nobg.png"
                    : "/images/Logos/Brand Identity/Logos/Logo_name_light_nobg.png"
                }
                alt="Veratori"
                width={180}
                height={45}
                className="h-11 sm:h-[48px] w-auto object-contain transition-all duration-300"
                priority
              />
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navItems.map((key) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => openMenu(key)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    className={`relative flex items-center gap-1 px-3 py-2 rounded-lg text-[clamp(15px,1.1vw,17px)] font-semibold transition-colors duration-200 cursor-pointer select-none ${
                      isActive(key)
                        ? "text-sage"
                        : isDark
                        ? "text-white/80 hover:text-white"
                        : "text-black/80 hover:text-black"
                    }`}
                    aria-expanded={activeMenu === key}
                    aria-haspopup="true"
                  >
                    <span className="relative">
                      {key}
                      {isActive(key) && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-sage rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </span>
                    <motion.span
                      animate={{ rotate: activeMenu === key ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </motion.span>
                  </button>
                </div>
              ))}
            </nav>

            {/* ── Actions ── */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isDark
                    ? "text-white/70 hover:text-white hover:bg-white/5"
                    : "text-black/70 hover:text-black hover:bg-black/5"
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link
                href="/contact?source=demo"
                className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-sage text-white hover:bg-sage-light shadow-lg shadow-sage/20"
              >
                Get a Demo
              </Link>

              <button
                onClick={() => setDrawerOpen(true)}
                className={`md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isDark
                    ? "text-white/70 hover:text-white hover:bg-white/5"
                    : "text-black/70 hover:text-black hover:bg-black/5"
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mega-menu dropdown ── */}
        <AnimatePresence>
          {activeMenu && megaMenus[activeMenu] && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className={`absolute left-0 right-0 top-full border-b shadow-2xl ${
                isDark
                  ? "bg-[#0d1520]/96 backdrop-blur-[28px] border-white/[0.07]"
                  : "bg-white/96 backdrop-blur-[28px] border-black/[0.07]"
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8">
                <div className="flex gap-12">
                  {/* Section links grid */}
                  <div className="flex-1 grid grid-cols-2 gap-1">
                    {megaMenus[activeMenu].sections.map((item, i) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setActiveMenu(null)}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                            isDark ? "hover:bg-white/[0.05]" : "hover:bg-black/[0.04]"
                          }`}
                        >
                          <div
                            className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isDark
                                ? "bg-white/5 group-hover:bg-sage/20"
                                : "bg-black/5 group-hover:bg-sage/10"
                            }`}
                          >
                            <item.icon className="w-4 h-4 text-sage" />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-semibold mb-0.5 transition-colors ${
                                isDark
                                  ? "text-white/90 group-hover:text-sage"
                                  : "text-black/90 group-hover:text-sage"
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className={`text-xs leading-relaxed ${isDark ? "text-white/40" : "text-black/40"}`}>
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right panel */}
                  {(megaMenus[activeMenu].quote || megaMenus[activeMenu].locations) && (
                    <div
                      className={`w-60 shrink-0 border-l pl-8 ${
                        isDark ? "border-white/[0.06]" : "border-black/[0.06]"
                      }`}
                    >
                      {megaMenus[activeMenu].quote && (
                        <div
                          className={`p-4 rounded-xl ${isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"}`}
                        >
                          <p
                            className={`text-xs italic leading-relaxed ${
                              isDark ? "text-white/50" : "text-black/50"
                            }`}
                          >
                            {megaMenus[activeMenu].quote}
                          </p>
                        </div>
                      )}
                      {megaMenus[activeMenu].locations && (
                        <div>
                          <p
                            className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${
                              isDark ? "text-white/30" : "text-black/30"
                            }`}
                          >
                            Our Offices
                          </p>
                          <div className="space-y-3">
                            {megaMenus[activeMenu].locations!.map((loc) => (
                              <div key={loc} className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
                                <span
                                  className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}
                                >
                                  {loc}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className={`fixed top-0 right-0 bottom-0 z-[70] w-[320px] max-w-[85vw] flex flex-col backdrop-blur-[24px] saturate-[1.4] border-l ${
                isDark
                  ? "bg-[#151D3B]/92 border-white/[0.06]"
                  : "bg-white/92 border-black/[0.06]"
              }`}
              role="dialog"
              aria-label="Navigation menu"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 shrink-0">
                <Link href="/" onClick={() => setDrawerOpen(false)}>
                  <Image
                    src={
                      isDark
                        ? "/images/Logos/Brand Identity/Logos/Logo_name_dark-nobg.png"
                        : "/images/Logos/Brand Identity/Logos/Logo_name_light_nobg.png"
                    }
                    alt="Veratori"
                    width={120}
                    height={30}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isDark
                      ? "text-white/60 hover:text-white hover:bg-white/5"
                      : "text-black/60 hover:text-black hover:bg-black/5"
                  }`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`mx-5 h-px ${isDark ? "bg-white/[0.06]" : "bg-black/[0.06]"}`} />

              {/* Accordion nav */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navItems.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <button
                      onClick={() =>
                        setExpandedMobile(expandedMobile === key ? null : key)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        isActive(key)
                          ? "text-sage bg-sage/10"
                          : isDark
                          ? "text-white/70 hover:text-white hover:bg-white/5"
                          : "text-black/70 hover:text-black hover:bg-black/5"
                      }`}
                    >
                      {key}
                      <motion.span
                        animate={{ rotate: expandedMobile === key ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center"
                      >
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedMobile === key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-1 pt-1 space-y-0.5">
                            {megaMenus[key].sections.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setDrawerOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                  isDark
                                    ? "text-white/50 hover:text-white hover:bg-white/5"
                                    : "text-black/50 hover:text-black hover:bg-black/5"
                                }`}
                              >
                                <item.icon className="w-4 h-4 text-sage shrink-0" />
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Get a Demo CTA */}
              <div className="px-4 pb-6 pt-2 space-y-2">
                <Link
                  href="/contact?source=demo"
                  onClick={() => setDrawerOpen(false)}
                  className="block w-full text-center py-3.5 rounded-xl bg-sage text-white font-bold text-sm hover:bg-sage-light transition-all shadow-lg shadow-sage/20"
                >
                  Get a Demo
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
