"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Brain, Target, TrendingDown, Award, ChevronRight, RotateCcw, Zap, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface TrainingImage {
  src: string;
  question: string;
  options: [string, string];
  correctIndex: 0 | 1;
  explanation: string;
  boxes: { x: number; y: number; w: number; h: number; label: string; conf: number }[];
}

const TRAINING_DATA: TrainingImage[] = [
  {
    // 4 poke bowls in 2×2 grid: left column orange/mango, right column red/berry. All fully stocked.
    src: "/images/rl-training-product/rl-1.jpg",
    question: "All four poke bowls are detected. What is the correct stock status to log?",
    options: ["Fully stocked — no restock needed", "Low stock — trigger restock alert"],
    correctIndex: 0,
    explanation: "All containers are filled above 70% capacity. No restock action required. Reward: POSITIVE.",
    boxes: [
      { x: 3,  y: 2,  w: 44, h: 48, label: "mango_poke",  conf: 0.94 },
      { x: 50, y: 2,  w: 46, h: 44, label: "berry_poke",  conf: 0.91 },
      { x: 3,  y: 47, w: 44, h: 40, label: "mango_poke",  conf: 0.89 },
      { x: 50, y: 47, w: 43, h: 40, label: "berry_poke",  conf: 0.87 },
    ],
  },
  {
    // Same 2×2 bowl display, gloved hand reaching in from left bottom — staff interaction visible.
    src: "/images/rl-training-product/rl-2.jpg",
    question: "A gloved hand is detected entering the display case. How should this frame be handled?",
    options: ["Ignore — treat as standard inventory frame", "Log staff interaction — pause stock count"],
    correctIndex: 1,
    explanation: "Staff interactions must be logged and the inventory count paused to prevent counting errors during item handling.",
    boxes: [
      { x: 5,  y: 12, w: 40, h: 38, label: "mango_poke",  conf: 0.90 },
      { x: 49, y: 10, w: 40, h: 36, label: "berry_poke",  conf: 0.88 },
      { x: 5,  y: 52, w: 40, h: 38, label: "mango_poke",  conf: 0.87 },
      { x: 49, y: 50, w: 40, h: 38, label: "berry_poke",  conf: 0.84 },
      { x: 0,  y: 82, w: 28, h: 18, label: "person_hand", conf: 0.93 },
    ],
  },
  {
    // Person holding a large clear container of pineapple slices in foreground. Poke bowls visible behind.
    src: "/images/rl-training-product/rl-3.jpg",
    question: "The foreground item is a pineapple container — a different SKU class. What label applies?",
    options: ["poke_bowl — same plastic container shape", "pineapple_sliced — distinct SKU, different class"],
    correctIndex: 1,
    explanation: "Container shape alone is not a valid classifier — product contents define the SKU. Mislabeling corrupts inventory counts.",
    boxes: [
      { x: 4,  y: 38, w: 72, h: 58, label: "pineapple_sliced", conf: 0.96 },
      { x: 52, y: 5,  w: 38, h: 34, label: "poke_bowl",        conf: 0.82 },
      { x: 60, y: 40, w: 32, h: 30, label: "poke_bowl",        conf: 0.79 },
    ],
  },
  {
    // Close-up of poke bowl being held in hand, handwritten date "7/2" clearly visible on lid.
    src: "/images/rl-training-product/rl-4.jpg",
    question: "A handwritten date '7/2' is visible on this container's lid. What action should be taken?",
    options: ["Flag for freshness review — log expiry date", "No action — label as standard in-stock unit"],
    correctIndex: 0,
    explanation: "Handwritten producer dates indicate expiry information. The model must flag the unit for freshness review to prevent expired stock from remaining on shelf.",
    boxes: [
      { x: 6, y: 8, w: 80, h: 74, label: "poke_bowl [7/2]", conf: 0.97 },
    ],
  },
  {
    // Motion-blurred poke bowl held close to camera in foreground. Mango flat containers visible in background shelf.
    src: "/images/rl-training-product/rl-5.jpg",
    question: "Primary object has motion blur — model confidence is 61%. What should the model do?",
    options: ["Reject frame — below 75% confidence threshold", "Accept frame — confidence is adequate"],
    correctIndex: 0,
    explanation: "Veratori's minimum detection threshold is 75%. Motion blur degrades confidence below that. Frame is excluded from the stock count.",
    boxes: [
      { x: 3,  y: 5,  w: 58, h: 72, label: "poke_bowl",      conf: 0.61 },
      { x: 60, y: 28, w: 36, h: 38, label: "mango_sliced",   conf: 0.73 },
    ],
  },
  {
    // Side view of display case — 2 poke bowls visible on top shelf (1 mango, 1 berry). Lower case shelf area exposed/open.
    src: "/images/rl-training-product/rl-6.jpg",
    question: "The display case lower shelf is exposed and the door is open. What alert should be triggered?",
    options: ["No alert — normal restocking activity", "Door-open anomaly — log temperature risk event"],
    correctIndex: 1,
    explanation: "An open display case risks temperature excursion and food safety compliance failure. Veratori logs a door-open event immediately.",
    boxes: [
      { x: 2,  y: 2,  w: 46, h: 44, label: "mango_poke",     conf: 0.89 },
      { x: 51, y: 2,  w: 46, h: 42, label: "berry_poke",     conf: 0.85 },
      { x: 0,  y: 48, w: 72, h: 52, label: "case_door_open", conf: 0.92 },
    ],
  },
  {
    // Display case with 5 poke bowls clearly visible in two rows (3 top + 2 bottom visible), water bottles on upper shelf, gloved hand.
    src: "/images/rl-training-product/rl-7.jpg",
    question: "How many poke bowl units should be logged in this inventory frame?",
    options: ["1–3 units", "4–5 units"],
    correctIndex: 1,
    explanation: "The model detects 5 poke bowl containers across two rows. Accurate counting ensures the inventory ledger matches physical stock.",
    boxes: [
      { x: 8,  y: 22, w: 36, h: 34, label: "mango_poke", conf: 0.92 },
      { x: 47, y: 20, w: 36, h: 32, label: "berry_poke", conf: 0.90 },
      { x: 84, y: 20, w: 14, h: 30, label: "berry_poke", conf: 0.80 },
      { x: 8,  y: 57, w: 36, h: 36, label: "mango_poke", conf: 0.91 },
      { x: 47, y: 55, w: 36, h: 36, label: "berry_poke", conf: 0.88 },
    ],
  },
  {
    // Top-down aerial view of many round dessert/lemon cake containers — clearly a different product category.
    src: "/images/rl-training-product/rl-8.jpg",
    question: "These round containers are a different product type than poke bowls. How should the model classify them?",
    options: ["poke_bowl — similar clear plastic shape", "unknown_sku — route to manual review"],
    correctIndex: 1,
    explanation: "Container shape is insufficient for SKU classification. Unknown product classes must be routed to manual review to prevent false inventory records.",
    boxes: [
      { x: 18, y: 2,  w: 62, h: 44, label: "dessert_cup", conf: 0.88 },
      { x: 4,  y: 50, w: 42, h: 38, label: "lemon_cake",  conf: 0.84 },
      { x: 50, y: 50, w: 46, h: 38, label: "lemon_cake",  conf: 0.81 },
    ],
  },
  {
    // Person holding a single poke bowl in hand at center frame. Display shelves visible in background.
    src: "/images/rl-training-product/rl-9.jpg",
    question: "A single poke bowl is being removed from the display. What inventory event should be logged?",
    options: ["Stock removal — decrement count by 1", "No change — item may be returned"],
    correctIndex: 0,
    explanation: "Any unit removed from the detection zone is logged as a stock decrement. Returns are tracked separately via re-entry detection.",
    boxes: [
      { x: 22, y: 50, w: 54, h: 48, label: "poke_bowl", conf: 0.95 },
    ],
  },
  {
    // Wide-angle tilted/blurry frame. Display case visible at angle. Image has significant geometric distortion.
    src: "/images/rl-training-product/rl-10.jpg",
    question: "This frame has significant camera tilt and motion blur. How should it be classified?",
    options: ["Include — angle variation improves model robustness", "Reject — geometric distortion corrupts bounding box labels"],
    correctIndex: 1,
    explanation: "Veratori's quality filter rejects frames with camera tilt above 15°. Distorted geometry makes bounding box annotations unreliable and degrades training quality.",
    boxes: [
      { x: 2,  y: 55, w: 42, h: 42, label: "poke_bowl",    conf: 0.68 },
      { x: 52, y: 62, w: 44, h: 36, label: "mango_sliced", conf: 0.64 },
    ],
  },
];

function YOLOOverlay({ boxes, animate }: { boxes: TrainingImage["boxes"]; animate: boolean }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="yolo-glow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {boxes.map((box, i) => (
        <g key={i}>
          <motion.rect
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            fill="none"
            stroke="#7dd87a"
            strokeWidth="0.6"
            filter="url(#yolo-glow)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={animate ? { opacity: [0, 1], pathLength: 1 } : { opacity: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          />
          {/* Corner accent */}
          <motion.line x1={box.x} y1={box.y} x2={box.x + 4} y2={box.y} stroke="#7dd87a" strokeWidth="1.2"
            initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: i * 0.15 + 0.3 }} />
          <motion.line x1={box.x} y1={box.y} x2={box.x} y2={box.y + 4} stroke="#7dd87a" strokeWidth="1.2"
            initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: i * 0.15 + 0.3 }} />
          <motion.line x1={box.x + box.w} y1={box.y} x2={box.x + box.w - 4} y2={box.y} stroke="#7dd87a" strokeWidth="1.2"
            initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: i * 0.15 + 0.3 }} />
          <motion.line x1={box.x + box.w} y1={box.y} x2={box.x + box.w} y2={box.y + 4} stroke="#7dd87a" strokeWidth="1.2"
            initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: i * 0.15 + 0.3 }} />
          {/* Label */}
          <motion.rect x={box.x} y={box.y - 5} width={box.label.length * 1.8 + 6} height={5}
            fill="#7dd87a" fillOpacity="0.85"
            initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: i * 0.15 + 0.4 }} />
          <motion.text x={box.x + 1.5} y={box.y - 1.2}
            style={{ fontSize: 3.2, fontFamily: "monospace", fill: "#000", fontWeight: "bold" }}
            initial={{ opacity: 0 }} animate={animate ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: i * 0.15 + 0.4 }}>
            {box.label} {Math.round(box.conf * 100)}%
          </motion.text>
        </g>
      ))}
      {/* Scan line */}
      {animate && (
        <motion.line
          x1="0" y1="0" x2="100" y2="0"
          stroke="#7dd87a"
          strokeWidth="0.3"
          opacity="0.5"
          animate={{ y1: [0, 100], y2: [0, 100] }}
          transition={{ duration: 1.5, ease: "linear" }}
        />
      )}
    </svg>
  );
}

function StatBar({ label, value, color = "#7dd87a" }: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-white/50">{label}</span>
        <motion.span
          className="font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {typeof value === "number" && value % 1 !== 0 ? value.toFixed(3) : value}
        </motion.span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export default function RLTrainer() {
  const [phase, setPhase] = useState<"intro" | "training" | "feedback" | "results">("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(0 | 1 | null)[]>(Array(10).fill(null));
  const [yoloReady, setYoloReady] = useState(false);
  const [selectedOption, setSelectedOption] = useState<0 | 1 | null>(null);
  const [reward, setReward] = useState(0);
  const [epoch, setEpoch] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = TRAINING_DATA[currentIdx];
  const isCorrect = selectedOption !== null && selectedOption === current.correctIndex;
  const correctCount = answers.filter((a, i) => a === TRAINING_DATA[i].correctIndex).length;
  const accuracy = (correctCount / TRAINING_DATA.length) * 100;
  const totalReward = answers.reduce<number>((acc, a, i) => {
    if (a === null) return acc;
    return acc + (a === TRAINING_DATA[i].correctIndex ? 1 : -0.5);
  }, 0);
  const loss = Math.max(0, 1 - totalReward / TRAINING_DATA.length);
  const mse = answers.reduce<number>((acc, a, i) => {
    if (a === null) return acc;
    const err = a === TRAINING_DATA[i].correctIndex ? 0 : 1;
    return acc + (err * err);
  }, 0) / TRAINING_DATA.length;

  useEffect(() => {
    if (phase === "training") {
      setYoloReady(false);
      const t = setTimeout(() => setYoloReady(true), 300);
      return () => clearTimeout(t);
    }
  }, [phase, currentIdx]);

  function handleAnswer(optionIdx: 0 | 1) {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const correct = optionIdx === current.correctIndex;
    const newReward = correct ? reward + 1 : reward - 0.5;
    setReward(newReward);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
    setPhase("feedback");
    timerRef.current = setTimeout(() => {
      if (currentIdx < TRAINING_DATA.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedOption(null);
        setEpoch(e => e + 1);
        setPhase("training");
      } else {
        setPhase("results");
      }
    }, 2400);
  }

  function handleReset() {
    setPhase("intro");
    setCurrentIdx(0);
    setAnswers(Array(10).fill(null));
    setSelectedOption(null);
    setReward(0);
    setEpoch(1);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  return (
    <section className="relative py-24 overflow-hidden bg-[#080c14]">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(rgba(125,216,122,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(125,216,122,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080c14]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-20">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sage/30 bg-sage/5 mb-5">
            <Brain className="w-3.5 h-3.5 text-sage" />
            <span className="text-sage text-xs font-mono font-bold tracking-widest uppercase">RL Training Lab</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            You are the{" "}
            <span className="text-sage">reward signal.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Label real frames from our pokebowl dataset. Every correct answer sharpens the model. Every mistake teaches it boundaries.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* Intro Screen */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="max-w-2xl mx-auto"
            >
              <div className="border border-white/10 rounded-2xl bg-white/[0.03] p-10 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-sage/10 border border-sage/30 flex items-center justify-center">
                      <Brain className="w-9 h-9 text-sage" />
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sage flex items-center justify-center"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Zap className="w-3 h-3 text-black" />
                    </motion.div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">10 frames. 10 decisions.</h3>
                  <p className="text-white/50 text-base leading-relaxed">
                    Each image was captured by our Jetson sensor inside a real pokebowl walk-in cooler. YOLO has already detected objects — now you decide what the model should learn.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Target, label: "Accuracy", sublabel: "Track your precision" },
                    { icon: TrendingDown, label: "Loss", sublabel: "Lower is better" },
                    { icon: Award, label: "Reward", sublabel: "Earn positive signal" },
                  ].map(({ icon: Icon, label, sublabel }) => (
                    <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <Icon className="w-5 h-5 text-sage mx-auto mb-2" />
                      <p className="text-white text-sm font-bold">{label}</p>
                      <p className="text-white/40 text-xs mt-0.5">{sublabel}</p>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => setPhase("training")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-sage text-black font-bold text-base flex items-center justify-center gap-2 hover:bg-sage/90 transition-colors"
                >
                  Begin Training Session <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Training Screen */}
          {(phase === "training" || phase === "feedback") && (
            <motion.div
              key={`training-${currentIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-6"
            >
              {/* Image Panel */}
              <div className="lg:col-span-3 space-y-3">
                {/* Progress */}
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-xs font-mono">FRAME {currentIdx + 1} / {TRAINING_DATA.length}</span>
                  <div className="flex-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-sage rounded-full"
                      animate={{ width: `${((currentIdx + 1) / TRAINING_DATA.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className="text-sage text-xs font-mono font-bold">EPOCH {epoch}</span>
                </div>

                {/* Image with YOLO */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black">
                  <Image
                    src={current.src}
                    alt={`Training frame ${currentIdx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <YOLOOverlay boxes={current.boxes} animate={yoloReady} />

                  {/* Corner HUD */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-sage"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-sage text-[10px] font-mono font-bold tracking-wider">YOLO v8 ACTIVE</span>
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] font-mono text-white/40">
                    {current.boxes.length} obj detected
                  </div>

                  {/* Feedback overlay */}
                  <AnimatePresence>
                    {phase === "feedback" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 flex flex-col items-center justify-center ${isCorrect ? "bg-sage/20" : "bg-red-500/20"}`}
                      >
                        {isCorrect
                          ? <CheckCircle2 className="w-16 h-16 text-sage drop-shadow-lg" />
                          : <XCircle className="w-16 h-16 text-red-400 drop-shadow-lg" />
                        }
                        <span className={`mt-3 font-bold text-lg ${isCorrect ? "text-sage" : "text-red-400"}`}>
                          {isCorrect ? `+1.0 Reward` : "-0.5 Penalty"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Explanation (shown on feedback) */}
                <AnimatePresence>
                  {phase === "feedback" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 rounded-xl border text-sm leading-relaxed ${isCorrect ? "border-sage/30 bg-sage/5 text-sage/80" : "border-red-500/30 bg-red-500/5 text-red-400/80"}`}
                    >
                      <span className="font-bold">{isCorrect ? "Correct: " : "Incorrect: "}</span>{current.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Question + Controls Panel */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {/* Live stats */}
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3">
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">Live Metrics</p>
                  <StatBar label="Reward" value={Math.max(0, (reward / Math.max(1, currentIdx)) * 100)} />
                  <StatBar label="Running Accuracy" value={answers.filter((a, i) => a !== null && a === TRAINING_DATA[i].correctIndex).length / Math.max(1, answers.filter(a => a !== null).length) * 100} color="#60a5fa" />
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 text-center p-2 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-sage text-sm font-black">{answers.filter(a => a !== null).length}</p>
                      <p className="text-white/30 text-[10px] font-mono">LABELED</p>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-blue-400 text-sm font-black">{answers.filter((a, i) => a !== null && a === TRAINING_DATA[i].correctIndex).length}</p>
                      <p className="text-white/30 text-[10px] font-mono">CORRECT</p>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-red-400 text-sm font-black">{answers.filter((a, i) => a !== null && a !== TRAINING_DATA[i].correctIndex).length}</p>
                      <p className="text-white/30 text-[10px] font-mono">WRONG</p>
                    </div>
                  </div>
                </div>

                {/* Question */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03]">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-sage/10 border border-sage/30 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-sage" />
                      </div>
                      <p className="text-white font-semibold text-base leading-snug">{current.question}</p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {current.options.map((opt, idx) => {
                      const chosen = selectedOption === idx;
                      const correct = idx === current.correctIndex;
                      const showResult = phase === "feedback";
                      const bg = showResult
                        ? chosen && correct ? "border-sage bg-sage/15" : chosen && !correct ? "border-red-500 bg-red-500/10" : correct ? "border-sage/50 bg-sage/5" : "border-white/10 opacity-40"
                        : "border-white/15 bg-white/[0.04] hover:border-sage/50 hover:bg-sage/5";
                      return (
                        <motion.button
                          key={idx}
                          onClick={() => handleAnswer(idx as 0 | 1)}
                          disabled={phase === "feedback"}
                          whileHover={phase === "training" ? { scale: 1.01 } : {}}
                          whileTap={phase === "training" ? { scale: 0.99 } : {}}
                          className={`w-full p-4 rounded-xl border text-left font-semibold text-sm text-white transition-all duration-200 flex items-center gap-3 ${bg}`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${showResult && correct ? "bg-sage text-black" : "bg-white/10 text-white/60"}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                          {showResult && correct && <CheckCircle2 className="w-4 h-4 text-sage ml-auto" />}
                          {showResult && chosen && !correct && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Screen */}
          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="border border-white/10 rounded-2xl bg-white/[0.03] overflow-hidden">
                {/* Header */}
                <div className="border-b border-white/10 p-6 flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">Training Session Complete</p>
                    <h3 className="text-2xl font-black text-white">Model Performance Report</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/30 flex items-center justify-center">
                    <Award className="w-7 h-7 text-sage" />
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Grade */}
                  <div className="text-center py-4">
                    <motion.div
                      className="text-7xl font-black"
                      style={{ color: accuracy >= 80 ? "#7dd87a" : accuracy >= 60 ? "#fbbf24" : "#f87171" }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    >
                      {accuracy >= 90 ? "S" : accuracy >= 80 ? "A" : accuracy >= 70 ? "B" : accuracy >= 60 ? "C" : "D"}
                    </motion.div>
                    <p className="text-white/50 text-sm mt-1 font-mono">{correctCount} / {TRAINING_DATA.length} correct labels</p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Accuracy", value: `${accuracy.toFixed(1)}%`, color: "text-sage", sub: "label precision" },
                      { label: "Total Reward", value: totalReward.toFixed(1), color: totalReward >= 0 ? "text-sage" : "text-red-400", sub: "cumulative signal" },
                      { label: "Final Loss", value: loss.toFixed(3), color: "text-blue-400", sub: "cross-entropy proxy" },
                      { label: "MSE", value: mse.toFixed(3), color: "text-purple-400", sub: "mean sq. error" },
                    ].map(({ label, value, color, sub }) => (
                      <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                        <p className={`text-2xl font-black ${color}`}>{value}</p>
                        <p className="text-white text-xs font-bold mt-1">{label}</p>
                        <p className="text-white/30 text-[10px] mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Per-image breakdown */}
                  <div>
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">Label Breakdown</p>
                    <div className="grid grid-cols-5 gap-2">
                      {TRAINING_DATA.map((item, i) => {
                        const ans = answers[i];
                        const correct = ans === item.correctIndex;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold border ${correct ? "border-sage/50 bg-sage/10 text-sage" : "border-red-500/50 bg-red-500/10 text-red-400"}`}
                          >
                            {i + 1}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`p-4 rounded-xl border text-sm ${accuracy >= 70 ? "border-sage/30 bg-sage/5 text-sage/80" : "border-yellow-500/30 bg-yellow-500/5 text-yellow-400/80"}`}>
                    {accuracy >= 90
                      ? "Exceptional labeling. Your signal would significantly improve convergence speed in production training."
                      : accuracy >= 70
                      ? "Good performance. With your labels, the model estimates a 12% improvement in detection confidence."
                      : "Keep practicing. Labeling quality directly impacts model robustness — every session makes the system smarter."}
                  </div>

                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 rounded-xl border border-white/20 bg-white/5 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Retrain Session
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
