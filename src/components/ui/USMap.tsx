"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import mapData from "@/data/us-map-dots.json";

interface Dot {
  x: number;
  y: number;
}

/** Quadratic curve with upward bulge — “trajectory” between hubs */
function trajectoryPath(from: [number, number], to: [number, number], bulge = 52) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx = mx + (x2 - x1) * 0.06;
  const cy = my - bulge;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

const AUSTIN = "#2563eb";
const ATLANTA = "#3b82f6";
const NEWYORK = "#eab308";
const LINE = "#38bdf8";

export default function USMap() {
  const { isDark } = useTheme();

  const dots: Dot[] = mapData.dots.map((d: number[]) => ({ x: d[0], y: d[1] }));
  const { austin, atlanta, newyork } = mapData.cities;

  const ny = newyork as [number, number];
  const au = austin as [number, number];
  const at = atlanta as [number, number];

  const pathNyToAustin = trajectoryPath(ny, au, 58);
  const pathNyToAtlanta = trajectoryPath(ny, at, 44);

  const dotColor = isDark ? "fill-white/20" : "fill-black/10";

  const pulseVariant = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [1, 0.6, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const ringVariant = {
    animate: {
      scale: [1, 2.5],
      opacity: [0.6, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeOut" as const,
      },
    },
  };

  const labelClass =
    "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-[13px] font-bold leading-tight shadow-sm backdrop-blur-sm sm:text-[15px] sm:px-3.5 sm:py-2";

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[8/5]">
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base map dots */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r="2.5"
            className={`${dotColor} transition-colors duration-500`}
          />
        ))}

        {/* NY → Austin & NY → Atlanta: faint track + flowing pulse (5s loop) */}
        {[pathNyToAustin, pathNyToAtlanta].map((d, i) => (
          <g key={i}>
            {/* Static route (faint) */}
            <path
              d={d}
              stroke={LINE}
              strokeWidth="1.25"
              strokeOpacity="0.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Traveling pulse — full loop every 5s */}
            <path
              d={d}
              stroke={LINE}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray="0.14 0.86"
              strokeOpacity="1"
              filter="url(#line-glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="1"
                dur="5s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}

        {/* Austin */}
        <g transform={`translate(${austin[0]}, ${austin[1]})`}>
          <motion.circle
            r="12"
            fill="none"
            stroke={AUSTIN}
            strokeWidth="1"
            variants={ringVariant}
            animate="animate"
          />
          <motion.circle r="5" fill={AUSTIN} variants={pulseVariant} animate="animate" />
          <foreignObject x="-88" y="-58" width="176" height="52" className="overflow-visible pointer-events-none">
            <div className="flex flex-col items-center justify-end h-full">
              <span
                className={`${labelClass} border border-[#2563eb]/70 bg-[#2563eb]/85 ${isDark ? "text-[#ffffff]" : "text-[#ffffff]"}`}
              >
                Researching
              </span>
            </div>
          </foreignObject>
        </g>

        {/* Atlanta */}
        <g transform={`translate(${atlanta[0]}, ${atlanta[1]})`}>
          <motion.circle
            r="12"
            fill="none"
            stroke={ATLANTA}
            strokeWidth="1"
            variants={ringVariant}
            animate="animate"
          />
          <motion.circle r="5" fill={ATLANTA} variants={pulseVariant} animate="animate" />
          <foreignObject x="-88" y="-58" width="176" height="52" className="overflow-visible pointer-events-none">
            <div className="flex flex-col items-center justify-end h-full">
              <span
                className={`${labelClass} border border-[#3b82f6]/70 bg-[#3b82f6]/85 ${isDark ? "text-[#ffffff]" : "text-[#ffffff]"}`}
              >
                Developing
              </span>
            </div>
          </foreignObject>
        </g>

        {/* New York */}
        <g transform={`translate(${newyork[0]}, ${newyork[1]})`}>
          <motion.circle
            r="12"
            fill="none"
            stroke={NEWYORK}
            strokeWidth="1"
            variants={ringVariant}
            animate="animate"
          />
          <motion.circle r="5" fill={NEWYORK} variants={pulseVariant} animate="animate" />
          <foreignObject x="-88" y="-58" width="176" height="52" className="overflow-visible pointer-events-none">
            <div className="flex flex-col items-center justify-end h-full">
              <span
                className={`${labelClass} border border-[#eab308]/70 bg-[#eab308]/85 text-[#ffffff]`}
              >
                Deploying
              </span>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}
