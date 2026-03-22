"use client";

import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { useTheme } from "@/components/ui/ThemeProvider";
import { Camera, StopCircle, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function YOLODemo() {
  const { isDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<cocoSsd.DetectedObject[]>([]);

  // Load COCO-SSD Model
  useEffect(() => {
    async function loadModel() {
      try {
        setIsLoading(true);
        // Ensure TF is ready
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load COCO-SSD model:", err);
        setError("Could not load the detection model. Please check your connection.");
        setIsLoading(false);
      }
    }
    loadModel();
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } else {
        setError("Camera access is not supported by your browser.");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied. Please allow camera permissions and try again.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setDetections([]);
    }
  };

  // Detection loop
  useEffect(() => {
    let animationId: number;

    const detectFrame = async () => {
      if (!model || !isStreaming || !videoRef.current || !canvasRef.current) return;

      if (videoRef.current.readyState === 4) {
        const predictions = await model.detect(videoRef.current);
        setDetections(predictions);
        renderPredictions(predictions);
      }
      animationId = requestAnimationFrame(detectFrame);
    };

    if (isStreaming && model) {
      detectFrame();
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isStreaming, model]);

  const renderPredictions = (predictions: cocoSsd.DetectedObject[]) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !videoRef.current || !canvasRef.current) return;

    // Set canvas dimensions to match video
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Styling - using CSS variable equivalent colors
    const SAGE_COLOR = "#7BAF7B"; // --color-sage from brand palette
    const TEXT_COLOR = "#ffffff";
    const BG_DARK = "rgba(0,0,0,0.5)";
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "top";

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      // Draw bounding box
      ctx.strokeStyle = SAGE_COLOR;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      ctx.fillStyle = SAGE_COLOR;
      const textWidth = ctx.measureText(prediction.class).width;
      ctx.fillRect(x, y, textWidth + 10, 24);

      // Draw label text
      ctx.fillStyle = TEXT_COLOR;
      ctx.fillText(prediction.class, x + 5, y + 4);

      // Confidence indicator
      ctx.fillStyle = BG_DARK;
      const confText = `${Math.round(prediction.score * 100)}%`;
      const confWidth = ctx.measureText(confText).width;
      ctx.fillRect(x, y + 24, confWidth + 10, 20);
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = "12px sans-serif";
      ctx.fillText(confText, x + 5, y + 27);
      ctx.font = "16px sans-serif";
    });
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl border p-4 md:p-8 ${isDark ? "bg-white/5 border-white/10" : "bg-mist border-black/5"}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
            YOLO Prototyping Sandbox
          </h3>
          <p className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>
            Experience real-time object detection processing in your browser.
          </p>
        </div>

        <div className="flex gap-3">
          {!isStreaming ? (
            <button
              onClick={startCamera}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 bg-sage text-white font-bold rounded-md hover:bg-sage-dark transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-wait`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading Weights...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Activate Live Demo
                </>
              )}
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-all shadow-lg active:scale-95"
            >
              <StopCircle className="w-4 h-4" />
              Stop Session
            </button>
          )}
        </div>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/90 border border-white/10 shadow-inner group">
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
              <EyeIcon className={`w-8 h-8 ${isDark ? "text-white/20" : "text-black/20"}`} />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">Camera Feed Offline</h4>
            <p className="text-white/40 max-w-xs text-sm">
              Click activate to start the YOLO-based detection engine on your device.
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isStreaming ? "opacity-100" : "opacity-0 invisible"}`}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
        />

        {error && (
          <div className="absolute top-4 left-4 right-4 z-30">
            <div className="bg-red-900/90 border border-red-500/50 backdrop-blur-md p-4 rounded-lg flex items-center gap-3 text-white">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {isStreaming && (
          <div className="absolute bottom-4 left-4 z-30 flex gap-2">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Live Engine
            </span>
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
              {detections.length} objects found
            </span>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-5 rounded-lg border ${isDark ? "bg-white/2 border-white/5" : "bg-white border-black/5"}`}>
          <h5 className="text-xs font-bold uppercase tracking-widest text-sage mb-3">Detection Pipeline</h5>
          <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-black/60"}`}>
            Our edge-deployed sensors use high-fidelity YOLO (You Only Look Once) architectures to count stock with 99%+ accuracy in low-light refrigerator environments.
          </p>
        </div>
        <div className={`p-5 rounded-lg border ${isDark ? "bg-white/2 border-white/5" : "bg-white border-black/5"}`}>
          <h5 className="text-xs font-bold uppercase tracking-widest text-sage mb-3">On-Device Processing</h5>
          <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-black/60"}`}>
            No video leaves your facility. Inference happens locally on NVIDIA Jetson modules, ensuring data privacy and zero latency for automated alerts.
          </p>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2.062 12.348a12.15 12.15 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 12.15 12.15 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
