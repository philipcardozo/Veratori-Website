"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useState } from "react";
import { Zap, Camera, Wifi, Radio } from "lucide-react";

/** SVG coordinates (viewBox 0 0 400 400) — chassis + four modules + connection paths */
const VB = 400;
const CX = 200;
const CY = 200;
const CH = 72; // half chassis size (center ±)
const chassis = { x: CX - CH, y: CY - CH, w: CH * 2, h: CH * 2, r: 14 };

const modules = [
  {
    id: "lidar",
    label: "ToF LiDAR",
    x: CX,
    y: 52,
    edge: { x: CX, y: CY - CH } as const,
    icon: Radio,
    spec: "3D Depth Sensing",
    detail: "Real-time spatial mapping"
  },
  {
    id: "rgb",
    label: "4K RGB",
    x: 348,
    y: CY,
    edge: { x: CX + CH, y: CY } as const,
    icon: Camera,
    spec: "Computer Vision",
    detail: "99.2% detection accuracy"
  },
  {
    id: "uplink",
    label: "WiFi / LTE",
    x: CX,
    y: 348,
    edge: { x: CX, y: CY + CH } as const,
    icon: Wifi,
    spec: "Cloud Connectivity",
    detail: "Live data synchronization"
  },
  {
    id: "power",
    label: "Power",
    x: 52,
    y: CY,
    edge: { x: CX - CH, y: CY } as const,
    icon: Zap,
    spec: "Solar + Battery",
    detail: "Autonomous operation"
  },
] as const;

/** Straight bus line from module to chassis edge (schematic). */
function pathLine(ax: number, ay: number, bx: number, by: number) {
  return `M ${ax} ${ay} L ${bx} ${by}`;
}

export default function HardwareIntegrationViz() {
  const { isDark } = useTheme();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const strokeMuted = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const strokeActive = "#7dd87a";
  const fillMod = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const fillModRing = isDark ? "rgba(125,216,122,0.15)" : "rgba(91,151,79,0.1)";

  return (
    <div className="relative w-full">
      {/* Main SVG Diagram */}
      <div className="relative h-full min-h-[320px] w-full p-4 md:p-8">
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="h-full w-full max-h-[min(100%,460px)] mx-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            {/* Glow filter for connections */}
            <filter id="hw-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for active lines */}
            <linearGradient id="hw-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={strokeActive} stopOpacity="0.2" />
              <stop offset="50%" stopColor={strokeActive} stopOpacity="1" />
              <stop offset="100%" stopColor={strokeActive} stopOpacity="0.2" />
            </linearGradient>

            {/* Radial glow for center */}
            <radialGradient id="center-glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor={strokeActive} stopOpacity="0.15" />
              <stop offset="100%" stopColor={strokeActive} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background glow at center */}
          <circle cx={CX} cy={CY} r="95" fill="url(#center-glow)" />

          {/* Connection paths: faint track + traveling pulse */}
          {modules.map((m, i) => {
            const d = pathLine(m.x, m.y, m.edge.x, m.edge.y);
            const delay = i * 0.9;
            const isHovered = hoveredModule === m.id;
            return (
              <g key={m.id}>
                {/* Faint base line */}
                <path
                  d={d}
                  stroke={strokeMuted}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  opacity={isHovered ? 0.25 : 0.1}
                  className="transition-opacity duration-300"
                />
                {/* Animated pulse line */}
                <path
                  d={d}
                  stroke="url(#hw-line)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  pathLength={1}
                  strokeDasharray="0.1 0.9"
                  filter="url(#hw-glow)"
                  opacity={isHovered ? 1 : 0.6}
                  className="transition-opacity duration-300"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="1"
                    to="0"
                    dur="4s"
                    repeatCount="indefinite"
                    begin={`${delay}s`}
                  />
                </path>
              </g>
            );
          })}

          {/* Outer chassis — glassmorphic box */}
          <motion.rect
            x={chassis.x}
            y={chassis.y}
            width={chassis.w}
            height={chassis.h}
            rx={chassis.r}
            fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)"}
            stroke={isDark ? "rgba(125,216,122,0.25)" : "rgba(91,151,79,0.3)"}
            strokeWidth="1.5"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Inner compute block */}
          <motion.rect
            x={CX - 48}
            y={CY - 32}
            width={96}
            height={64}
            rx={10}
            fill={isDark ? "rgba(125,216,122,0.08)" : "rgba(91,151,79,0.08)"}
            stroke={isDark ? "rgba(125,216,122,0.35)" : "rgba(91,151,79,0.4)"}
            strokeWidth="1.5"
            animate={{ boxShadow: hoveredModule ? "0 0 20px rgba(125,216,122,0.3)" : "0 0 0px rgba(125,216,122,0)" }}
            transition={{ duration: 0.3 }}
          />
          <text
            x={CX}
            y={CY - 4}
            textAnchor="middle"
            fill={strokeActive}
            className="font-mono font-bold"
            style={{ fontSize: 13, letterSpacing: "0.2em" }}
          >
            JETSON
          </text>
          <text
            x={CX}
            y={CY + 16}
            textAnchor="middle"
            fill="currentColor"
            className={isDark ? "text-white/40" : "text-black/40"}
            style={{ fontSize: 10 }}
          >
            EDGE
          </text>

          {/* Module nodes with enhanced styling */}
          {modules.map((m, i) => {
            const isHovered = hoveredModule === m.id;
            return (
              <motion.g
                key={m.id}
                onMouseEnter={() => setHoveredModule(m.id)}
                onMouseLeave={() => setHoveredModule(null)}
                className="cursor-pointer"
              >
                {/* Outer ring */}
                <motion.circle
                  cx={m.x}
                  cy={m.y}
                  r="32"
                  fill={fillMod}
                  stroke={fillModRing}
                  strokeWidth="1"
                  animate={{
                    r: isHovered ? 36 : 32,
                    stroke: isHovered ? strokeActive : fillModRing,
                    strokeOpacity: isHovered ? 0.8 : 0.15,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Pulsing center dot */}
                <motion.circle
                  cx={m.x}
                  cy={m.y}
                  r="7"
                  fill={strokeActive}
                  animate={{
                    r: isHovered ? 10 : 7,
                    opacity: isHovered ? 1 : [0.5, 1, 0.5],
                  }}
                  transition={{
                    r: { duration: 0.3 },
                    opacity: isHovered
                      ? { duration: 0.3 }
                      : { duration: 2.2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" },
                  }}
                />

                {/* Hover glow ring */}
                {isHovered && (
                  <motion.circle
                    cx={m.x}
                    cy={m.y}
                    r="32"
                    fill="none"
                    stroke={strokeActive}
                    strokeWidth="0.5"
                    initial={{ r: 32, opacity: 1 }}
                    animate={{ r: 50, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.g>
            );
          })}

          {/* Labels */}
          {modules.map((m) => (
            <text
              key={`${m.id}-label`}
              x={m.x}
              y={m.y + 52}
              textAnchor="middle"
              fill="currentColor"
              className={isDark ? "text-white/70 font-semibold" : "text-black/70 font-semibold"}
              style={{ fontSize: 11, letterSpacing: "0.05em" }}
            >
              {m.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Info Cards Below Diagram */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 md:px-8 pb-6">
        {modules.map((m) => {
          const Icon = m.icon;
          const isHovered = hoveredModule === m.id;
          return (
            <motion.div
              key={m.id}
              onMouseEnter={() => setHoveredModule(m.id)}
              onMouseLeave={() => setHoveredModule(null)}
              animate={{
                y: isHovered ? -4 : 0,
                backgroundColor: isHovered
                  ? isDark
                    ? "rgba(125,216,122,0.1)"
                    : "rgba(91,151,79,0.08)"
                  : isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.01)",
              }}
              transition={{ duration: 0.3 }}
              className={`p-3 md:p-4 rounded-lg border backdrop-blur-sm cursor-pointer transition-all ${
                isHovered
                  ? isDark
                    ? "border-sage/40"
                    : "border-sage/30"
                  : isDark
                    ? "border-white/10"
                    : "border-black/5"
              }`}
            >
              <motion.div
                animate={{ color: isHovered ? strokeActive : "currentColor" }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
              <p className="text-xs md:text-sm font-semibold mb-1">{m.spec}</p>
              <p className={`text-[10px] md:text-xs leading-tight ${isDark ? "text-white/50" : "text-black/50"}`}>
                {m.detail}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Footer text */}
      <p
        className={`px-4 md:px-8 text-center text-[10px] font-mono uppercase tracking-[0.25em] pb-4 ${
          isDark ? "text-white/30" : "text-black/35"
        }`}
      >
        Live Integration · Real-time Data Flow
      </p>
    </div>
  );
}
