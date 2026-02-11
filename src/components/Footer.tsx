"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

const footerLinks = {
  Product: [
    { label: "Features", href: "/product" },
    { label: "Live Demo", href: "/product#demo" },
    { label: "3D Warehouse", href: "/product#3d" },
    { label: "Dashboard", href: "/product" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Mission", href: "/mission" },
    { label: "Team", href: "/about" },
    { label: "Careers", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Support", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

const socialIcons = [
  { label: "Twitter / X", path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" },
  { label: "LinkedIn", path: "M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" },
  { label: "GitHub", path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
];

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`relative border-t ${isDark ? "bg-midnight border-white/5" : "bg-mist border-midnight/5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-midnight"}`}>Veratori</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-sm bg-sky" />
                <span className="w-2 h-2 rounded-sm bg-electric" />
                <span className={`w-2 h-2 rounded-sm ${isDark ? "bg-white" : "bg-midnight"}`} />
                <span className="w-2 h-2 rounded-sm bg-sage" />
              </div>
            </Link>
            <p className={`text-sm leading-relaxed max-w-xs ${isDark ? "text-white/40" : "text-midnight/40"}`}>
              Ethical inventory management software reducing food waste and optimizing operations for a sustainable future.
            </p>
            <div className="flex gap-3 mt-6">
              {socialIcons.map((s) => (
                <motion.a key={s.label} href="#" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-white/50 hover:text-white" : "bg-midnight/5 hover:bg-midnight/10 text-midnight/50 hover:text-midnight"}`} aria-label={s.label}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className={`font-semibold text-sm mb-4 ${isDark ? "text-white" : "text-midnight"}`}>{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={`text-sm transition-colors ${isDark ? "text-white/40 hover:text-white" : "text-midnight/40 hover:text-midnight"}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`border-t pt-8 ${isDark ? "border-white/5" : "border-midnight/5"}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${isDark ? "text-white/30" : "text-midnight/30"}`}>&copy; {new Date().getFullYear()} Veratori. All rights reserved.</p>
            <p className={`text-sm ${isDark ? "text-white/30" : "text-midnight/30"}`}>Built with purpose. Designed for impact.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
