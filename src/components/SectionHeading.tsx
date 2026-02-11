"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface Props {
  tag: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  tagColor?: string;
}

export default function SectionHeading({
  tag,
  title,
  highlight,
  subtitle,
  tagColor = "text-electric",
}: Props) {
  const { isDark } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="text-center mb-14 sm:mb-18"
    >
      <span
        className={`text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] ${tagColor}`}
      >
        {tag}
      </span>
      <h2
        className={`mt-4 text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-tight ${
          isDark ? "text-white" : "text-midnight"
        }`}
      >
        {title}{" "}
        {highlight && (
          <span className="bg-gradient-to-r from-electric to-sage bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
            isDark ? "text-white/45" : "text-midnight/45"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
