# Veratori — Ethical Inventory Management Platform

A production-ready multi-page marketing site for Veratori, built with Next.js 16, Tailwind CSS v4, Framer Motion, Three.js, and TensorFlow.js.

## Tech Stack

| Technology                             | Purpose                                                           |
| -------------------------------------- | ----------------------------------------------------------------- |
| **Next.js 16** (App Router, Turbopack) | React framework with file-based routing                           |
| **TypeScript**                         | Type safety                                                       |
| **Tailwind CSS v4**                    | Utility-first styling with `@theme` tokens                        |
| **Framer Motion**                      | Scroll-triggered animations, page transitions, micro-interactions |
| **Three.js / React Three Fiber**       | Interactive 3D warehouse visualization                            |
| **TensorFlow.js + COCO-SSD**           | Real-time browser-based object detection demo                     |
| **Recharts**                           | (Available) Data visualization                                    |

## Brand Palette

- **Deep Midnight** `#0E1526` — primary dark base
- **Sage Operation** `#5F974F` — ethical green
- **Electric Blue** `#2640CE` — action/alerts
- **Sky Tint** `#ABCEE1` — light accents
- **Mist** `#F2F6F9` — cool white background

## Pages

| Route      | Description                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| `/`        | Home — Hero with video, feature teasers, stats, scrollytelling, testimonial marquee                      |
| `/product` | Product — Screenshot carousel, detailed features, 3D warehouse, AI object detection demo, dashboard mock |
| `/about`   | About Us — Company story, timeline, values cards, team grid                                              |
| `/mission` | Mission — Impact stats, food journey infographic, before/after slider, quote carousel                    |
| `/contact` | Contact — Animated form with validation, office info, map placeholder                                    |

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

## TensorFlow.js Object Detection

The Product page includes a live object detection demo using the COCO-SSD model:

- **Model**: Pre-trained COCO-SSD (loaded dynamically from CDN on first use)
- **Requirements**: Browser with WebGL support; webcam access for live detection
- **Fallback**: If webcam is denied, a static video demo is shown
- **Performance**: Model runs entirely in the browser — no server calls needed
- **First load**: The model (~5MB) is downloaded on first activation; subsequent visits use browser cache

## Features

- **Dark/Light mode** with smooth toggle, persisted to localStorage
- **Page transitions** with Framer Motion AnimatePresence
- **Infinite marquees** for testimonials, partners, screenshots, quotes
- **Kinetic typography** letter-by-letter hero animation
- **Parallax scrolling** on images and backgrounds
- **Interactive 3D** warehouse scene with orbit controls
- **Before/After slider** with draggable comparison
- **Count-up animations** for impact statistics
- **Responsive** mobile-first with hamburger menu
- **Accessible** with ARIA labels and semantic HTML

## Environment

No environment variables required. All external assets are loaded from public CDNs (Unsplash, Pexels).
