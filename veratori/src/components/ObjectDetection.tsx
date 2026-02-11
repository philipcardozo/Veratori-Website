"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export default function ObjectDetection() {
  const { isDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "denied" | "fallback">("idle");
  const [detections, setDetections] = useState<Detection[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const modelRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  const startWebcam = useCallback(async () => {
    setStatus("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      // Dynamic imports to avoid SSR issues with TF
      const tf = await import("@tensorflow/tfjs");
      await tf.ready();
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      modelRef.current = await cocoSsd.load();
      setStatus("running");
      detect();
    } catch (err) {
      console.error("Webcam/model error:", err);
      setStatus("denied");
    }
  }, []);

  const detect = useCallback(async () => {
    if (!modelRef.current || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detect);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const predictions: Detection[] = await modelRef.current.detect(video);
    setDetections(predictions);
    setItemCount(predictions.length);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const inventoryItems = ["bottle", "cup", "bowl", "banana", "apple", "orange", "broccoli", "carrot", "sandwich", "cake", "pizza", "donut", "book", "cell phone", "laptop", "backpack", "handbag", "suitcase", "box"];

    predictions.forEach((pred) => {
      const [x, y, w, h] = pred.bbox;
      const isInventory = inventoryItems.some((item) => pred.class.toLowerCase().includes(item));
      const color = isInventory ? "#5F974F" : "#2640CE";

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Label background
      ctx.fillStyle = color;
      const label = `${pred.class} ${(pred.score * 100).toFixed(0)}%`;
      const textW = ctx.measureText(label).width + 10;
      ctx.fillRect(x, y - 22, textW, 22);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillText(label, x + 5, y - 6);
    });

    rafRef.current = requestAnimationFrame(detect);
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="p-6">
      {/* Status header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${status === "running" ? "bg-sage animate-pulse" : "bg-white/20"}`} />
          <span className={`text-sm font-medium ${isDark ? "text-white/70" : "text-midnight/70"}`}>
            {status === "idle" && "Click to start real-time detection"}
            {status === "loading" && "Loading AI model & camera…"}
            {status === "running" && `Detecting — ${itemCount} object${itemCount !== 1 ? "s" : ""} found`}
            {status === "denied" && "Camera access denied — showing fallback"}
            {status === "fallback" && "Fallback demo mode"}
          </span>
        </div>
        {status === "idle" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startWebcam}
            className="px-5 py-2 bg-electric text-white text-sm font-medium rounded-xl glow-electric glow-electric-hover transition-all cursor-pointer"
          >
            Start Detection
          </motion.button>
        )}
      </div>

      {/* Video area */}
      <div className={`relative rounded-xl overflow-hidden ${isDark ? "bg-midnight-light" : "bg-mist-dark"}`} style={{ aspectRatio: "4/3", maxHeight: 480 }}>
        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <svg className={`w-16 h-16 ${isDark ? "text-white/15" : "text-midnight/15"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className={`text-sm ${isDark ? "text-white/30" : "text-midnight/30"}`}>Point your camera at inventory items</p>
          </div>
        )}

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-electric/30 border-t-electric rounded-full animate-spin" />
          </div>
        )}

        {(status === "denied" || status === "fallback") && (
          <div className="absolute inset-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="https://videos.pexels.com/video-files/5532764/5532764-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
            <div className={`absolute inset-0 ${isDark ? "bg-midnight/40" : "bg-white/40"}`} />
            <div className="absolute bottom-4 left-4 right-4">
              <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-midnight/70"}`}>
                Camera unavailable. This is a static fallback demo showing how Veratori&apos;s detection overlay works in production.
              </p>
            </div>
          </div>
        )}

        <video ref={videoRef} className={`w-full h-full object-cover ${status === "running" || status === "loading" ? "" : "hidden"}`} playsInline muted />
        <canvas ref={canvasRef} className={`detection-canvas ${status === "running" ? "" : "hidden"}`} />

        {/* Veratori overlay UI */}
        {status === "running" && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-midnight/80 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              Live Tracking
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-midnight/80 backdrop-blur-sm text-white text-xs font-mono">
              Items: {itemCount}
            </div>
          </div>
        )}
      </div>

      {/* Detection list */}
      {status === "running" && detections.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {detections.slice(0, 8).map((d, i) => (
            <div key={`${d.class}-${i}`} className={`px-3 py-2 rounded-lg text-xs ${isDark ? "bg-white/5" : "bg-midnight/5"}`}>
              <span className={`font-medium ${isDark ? "text-white" : "text-midnight"}`}>{d.class}</span>
              <span className={`ml-2 ${d.score > 0.7 ? "text-sage" : "text-sky"}`}>{(d.score * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
