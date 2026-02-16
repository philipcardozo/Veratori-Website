# Veratori — Ethical Inventory Management Platform

A cutting-edge SaaS platform for ethical inventory management in food retail and logistics. Using AI-driven forecasting, real-time object detection, multi-franchise management, and mobile restock documentation, we reduce food waste by up to 40%, optimize space utilization, and deliver precise, waste-free operations for sustainable efficiency.

## 🚀 Quick Links

- [Full Documentation](README.md)
- [Quick Start Guide](QUICKSTART.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Mobile App Docs](Poke-Bowl---updated-January/veratori_restock_flutter/README.md)

## ✨ Key Features

- **Real-time AI Detection** - YOLO v8+ with GPU acceleration
- **Multi-Franchise Dashboard** - Executive control room for all locations
- **Mobile Restock App** - Flutter-based employee app
- **Advanced Analytics** - Trend analysis and forecasting
- **Automated Alerts** - Low-stock and expiration monitoring
- **Sales Attribution** - Automatic sales detection

## 🏗️ Components

1. **Backend** - Python + aiohttp server with YOLO detection
2. **Web Dashboard** - Executive control room and analytics
3. **Mobile App** - Flutter app for employee restock submissions
4. **Marketing Site** - Next.js marketing pages

## 📦 Installation

```bash
git clone https://github.com/FelipeCardozo0/Veratori.git
cd Veratori/Poke-Bowl---updated-January
pip3 install -r requirements.txt
cd backend && python3 main.py
```

Access at `http://localhost:8080`

## 📱 Mobile App

```bash
cd Poke-Bowl---updated-January/veratori_restock_flutter
flutter pub get
flutter run
```

## 📚 Documentation

See [README.md](README.md) for complete documentation.

