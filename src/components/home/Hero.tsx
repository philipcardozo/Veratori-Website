"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── helpers ────────────────────────────────────────────────── */
function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stored(key: string, def: number): number {
  if (typeof window === "undefined") return def;
  const v = sessionStorage.getItem(key);
  return v !== null ? parseInt(v, 10) : def;
}

/**
 * Animates a number from `from` to `to` over `duration` ms.
 * Re-triggers whenever `from` or `to` changes.
 */
function useCountUpFromTo(from: number, to: number, duration: number) {
  const [value, setValue] = useState(from);
  const fromRef = useRef(from);
  const toRef   = useRef(to);

  useEffect(() => {
    fromRef.current = from;
    toRef.current   = to;
    if (duration === 0) { setValue(to); return; }

    let rafId: number;
    let startTime: number | null = null;
    const startFrom = from;

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(startFrom + eased * (to - startFrom)));
      if (progress < 1) rafId = requestAnimationFrame(step);
      else setValue(to);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, duration]);

  return value;
}

/* ─── StatPill ───────────────────────────────────────────────── */
interface StatPillProps {
  label: string;
  value: string;
  delta: string;
  isDark: boolean;
  flash?: boolean;
}

function StatPill({ label, value, delta, isDark, flash }: StatPillProps) {
  return (
    <motion.div
      animate={flash ? { scale: [1, 1.015, 1] } : {}}
      transition={{ duration: 0.4 }}
      className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-colors duration-300 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm"
      }`}
    >
      <div>
        <p className={`text-xs font-medium mb-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
          {label}
        </p>
        <p className="text-lg font-bold tabular-nums">{value}</p>
      </div>
      <span className="text-xs font-semibold text-sage bg-sage/10 px-2 py-1 rounded-md shrink-0">
        {delta}
      </span>
    </motion.div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
// Fixed base values — consistent across sessions, only update when scans fire
const BASE_UNITS    = 2_847;
const BASE_SAVINGS  = 4_320;
const BASE_HOURS    = 14;
const SAVINGS_PCT   = 38;

export default function Hero() {
  const { isDark } = useTheme();

  // ── Persistent values: survive navigation, only grow on scans ──
  const [unitsFrom,   setUnitsFrom]   = useState(0);
  const [unitsTo,     setUnitsTo]     = useState(() => stored("v_units",   BASE_UNITS));
  const [savingsFrom, setSavingsFrom] = useState(0);
  const [savingsTo,   setSavingsTo]   = useState(() => stored("v_savings", BASE_SAVINGS));
  const hoursTo                        = BASE_HOURS; // fixed — always 14
  const [flash,       setFlash]       = useState(false);

  // ── Initial count-up duration: long on first visit, 0 if already stored ──
  const [initDur] = useState(() => {
    if (typeof window === "undefined") return 1_700;
    return sessionStorage.getItem("v_units") ? 0 : 1_700;
  });
  const [ready, setReady] = useState(initDur === 0); // skip delay if already stored

  useEffect(() => {
    if (initDur === 0) return;
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, [initDur]);

  // ── Scan cycle ──
  const [secs,     setSecs]     = useState(() => rnd(4, 18));
  const [scanning, setScanning] = useState(false);
  const cycleLen = useRef(rnd(25, 42));

  useEffect(() => {
    const id = setInterval(() => {
      setSecs(s => {
        if (s >= cycleLen.current) {
          setScanning(true);
          setTimeout(() => {
            // Scan complete — increment live metrics
            const addUnits   = rnd(3, 11);
            const addSavings = rnd(14, 48);

            setUnitsTo(prev => {
              const next = prev + addUnits;
              setUnitsFrom(prev);             // animate FROM old value
              sessionStorage.setItem("v_units", String(next));
              return next;
            });
            setSavingsTo(prev => {
              const next = prev + addSavings;
              setSavingsFrom(prev);
              sessionStorage.setItem("v_savings", String(next));
              return next;
            });

            setFlash(true);
            setTimeout(() => setFlash(false), 500);
            setScanning(false);
            setSecs(0);
            cycleLen.current = rnd(25, 42);  // vary next cycle length
          }, 900);
          return s;
        }
        return s + 1;
      });
    }, 1_000);
    return () => clearInterval(id);
  }, []);

  // Count-up: long on first load, quick (500ms) on scan updates
  const unitsDisplay   = useCountUpFromTo(unitsFrom,   unitsTo,   ready ? (unitsFrom   === 0 ? initDur       : 500) : 0);
  const savingsDisplay = useCountUpFromTo(savingsFrom, savingsTo, ready ? (savingsFrom === 0 ? initDur + 200 : 500) : 0);
  const hoursDisplay   = 14; // always fixed at 14 hrs

  return (
    <section className="relative pt-44 pb-32 overflow-hidden">
      {/* Logo watermark background — 5s visible, 10s hidden, loop */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        animate={{ opacity: [0, 1, 1, 0, 0] }}
        transition={{
          duration: 15,          // total cycle: 5s visible + 10s hidden
          times: [0, 0.067, 0.333, 0.4, 1], // fade-in 1s | hold 4s | fade-out 1s | hold 9s
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <Image
          src={
            isDark
              ? "/images/Logos/Brand Identity/Logos/Logo_name_dark-nobg.png"
              : "/images/Logos/Brand Identity/Logos/Logo_name_light_nobg.png"
          }
          alt=""
          width={700}
          height={190}
          priority
          className={`w-[140%] max-w-none object-contain ${isDark ? "opacity-[0.13]" : "opacity-[0.16]"}`}
        />
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-sage font-semibold tracking-widest uppercase text-xs mb-6 block">
              For Food Service Operators
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-7xl font-bold tracking-tight leading-none mb-8">
              Your inventory, counted.{" "}
              <span className="text-sage block mt-1">Every shift, automatically</span>
            </h1>
            <p className={`text-xl md:text-2xl max-w-2xl leading-relaxed mb-12 ${isDark ? "text-white/55" : "text-black/55"}`}>
              Veratori installs computer vision hardware in your walk-in coolers and storage rooms.
              From that point on, stock levels are tracked in real time — no manual counts, no clipboards, no guesswork.
            </p>
          </motion.div>

          {/* Right: live stat pills */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="hidden lg:flex flex-col gap-4"
          >
            <StatPill
              label="Items tracked today"
              value={`${unitsDisplay.toLocaleString()} units`}
              delta="Live"
              isDark={isDark}
              flash={flash}
            />
            <StatPill
              label="Food waste prevented (last 30 days)"
              value={`$${savingsDisplay.toLocaleString()} saved`}
              delta={`−${SAVINGS_PCT}% vs prior`}
              isDark={isDark}
              flash={flash}
            />
            <StatPill
              label="Last inventory count completed"
              value={
                scanning
                  ? "Scanning…"
                  : secs === 0
                  ? "just now"
                  : secs < 60
                  ? `${secs}s ago`
                  : `${Math.floor(secs / 60)}m ${secs % 60}s ago`
              }
              delta={scanning ? "Running" : "Automatic"}
              isDark={isDark}
            />
            <StatPill
              label="Manual hours eliminated this week"
              value={`${hoursDisplay} hrs`}
              delta="Avg. per location"
              isDark={isDark}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
