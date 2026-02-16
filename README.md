# Veratori — Ethical Inventory Management Platform

[![Platform](https://img.shields.io/badge/Platform-Jetson%20Orin%20Nano-76B900?logo=nvidia)](https://developer.nvidia.com/embedded/jetson-orin)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python)](https://www.python.org/)
[![YOLO](https://img.shields.io/badge/YOLO-v8+-00FFFF?logo=yolo)](https://github.com/ultralytics/ultralytics)
[![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B?logo=flutter)](https://flutter.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Cutting-edge SaaS platform for ethical inventory management in food retail and logistics**

AI-driven forecasting • Real-time object detection • Multi-franchise management • Mobile restock app • 40% waste reduction

[Quick Start](#quick-start) • [Features](#features) • [Architecture](#architecture) • [Mobile App](#mobile-app) • [Documentation](#documentation)

---

## Overview

Veratori is a comprehensive inventory management platform that combines real-time AI detection, multi-franchise management, mobile restock documentation, and advanced analytics to reduce food waste by up to 40% while optimizing space utilization and delivering precise, waste-free operations.

![Veratori Platform Overview](docs/images/platform-overview.png)

### Key Capabilities

- **Real-time AI Detection**: YOLO v8+ object detection with GPU acceleration
- **Multi-Franchise Dashboard**: Executive control room for managing multiple locations
- **Mobile Restock App**: Flutter-based employee app for documenting restock actions
- **Advanced Analytics**: Trend analysis, forecasting, and operational intelligence
- **Automated Alerts**: Low-stock and expiration monitoring with notifications
- **Sales Attribution**: Automatic sales detection and tracking

---

## Features

### Core Platform

**Real-time Detection**
- YOLO v8+ with GPU acceleration (15-30 FPS)
- Temporal smoothing for stable inventory counts
- Support for 40+ product classes

**Multi-Franchise Management**
- Centralized control room for all locations
- Cross-franchise comparison and benchmarking
- Role-based access control (Owner, Regional Manager, Supervisor, Employee)

**Executive Dashboard**
- Real-time KPI tracking and analytics
- Sales trends and inventory turnover analysis
- Predictive stockout estimation
- Financial impact estimation

**System Monitoring**
- Live activity feed with real-time events
- System health monitoring (GPU usage, latency, database health)
- Automated alerts for low-stock and expiration
- WebSocket-based real-time updates

**Data Persistence**
- SQLite database with audit trails
- Inventory snapshots and sales attribution
- Complete operational history

### Mobile App (Flutter)

**Employee Restock Submissions**
- Photo-based restock documentation (minimum 3 photos)
- Real-time YOLO detection preview before submission
- Submission management with status tracking
- Push notifications for manager reviews
- Cross-platform support (iOS and Android)
- Offline capability for intermittent connectivity

![Mobile App Interface](docs/images/mobile-app-screenshot.png)

### Web Dashboard

**Business Control Room**
- Executive KPI strip with real-time metrics
- Franchise comparison with side-by-side analysis
- Advanced analytics with interactive charts
- Forecast snapshot with predictive insights
- Risk and attention panel for operational issues
- Restock moderation workflow for managers
- Export and reporting (PDF and Excel)

![Web Dashboard](docs/images/dashboard-screenshot.png)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Veratori Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Camera     │───▶│ YOLO Detector│───▶│  Inventory   │  │
│  │   Feed       │    │  (GPU)       │    │  Tracker     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         └────────────────────┼────────────────────┘          │
│                              │                               │
│                    ┌─────────▼─────────┐                    │
│                    │   Web Server      │                    │
│                    │   (aiohttp)       │                    │
│                    └─────────┬─────────┘                    │
│                              │                               │
│         ┌────────────────────┼────────────────────┐         │
│         │                    │                    │         │
│  ┌──────▼──────┐    ┌─────────▼─────────┐  ┌──────▼──────┐ │
│  │   Web       │    │  Restock Manager  │  │  Database   │ │
│  │  Dashboard  │    │  (API Endpoints) │  │  (SQLite)   │ │
│  └─────────────┘    └───────────────────┘  └─────────────┘ │
│         │                    │                               │
│         └────────────────────┼───────────────────────────────┘
│                              │
│                    ┌─────────▼─────────┐
│                    │  Flutter Mobile  │
│                    │      App          │
│                    └───────────────────┘
│
└─────────────────────────────────────────────────────────────┘
```

![Architecture Diagram](docs/images/architecture-diagram.png)

### Tech Stack

**Backend**
- Python 3.10 + aiohttp (async web server)
- PyTorch 2.1.0 (FP16 precision)
- Ultralytics YOLO v8+
- OpenCV 4.8+ (computer vision)
- SQLite (data persistence)

**Frontend**
- HTML5 + JavaScript (web dashboard)
- WebSocket (real-time updates)
- Chart.js (data visualization)
- Flatpickr (date selection)

**Mobile**
- Flutter 3.0+ (cross-platform)
- Provider (state management)
- Dio (HTTP client)
- Image Picker (camera/gallery)

**Hardware**
- NVIDIA Jetson Orin Nano
- USB camera (UVC-compliant)
- Optional: HDMI display

---

## Mobile App

### Veratori Restock (Flutter)

Employee-facing mobile application for documenting restock actions through structured photo submissions.

**Key Features:**
- Photo capture (minimum 3 photos: front, left, right)
- Real-time YOLO detection preview
- Submission management with status tracking
- Push notifications for manager reviews
- Role-based access (employees only see their franchise)

**Setup:**
```bash
cd Poke-Bowl---updated-January/veratori_restock_flutter
flutter pub get
flutter run
```

**Configuration:**
Update `lib/services/api_service.dart` with your backend URL:
```dart
_baseUrl = 'http://YOUR_SERVER_IP:8080';
```

See [veratori_restock_flutter/README.md](Poke-Bowl---updated-January/veratori_restock_flutter/README.md) for full documentation.

---

## Quick Start

### Prerequisites

- NVIDIA Jetson Orin Nano with JetPack 6.x
- USB camera (UVC-compliant)
- Python 3.10+
- Flutter SDK (for mobile app)

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/FelipeCardozo0/Veratori.git
cd Veratori/Poke-Bowl---updated-January
```

**2. Backend Setup**
```bash
# Install dependencies
pip3 install -r requirements.txt

# Configure (edit config/config.yaml)
# - Camera device index
# - YOLO model path
# - Detection thresholds

# Run server
cd backend
python3 main.py
```

**3. Access Web Dashboard**
```
http://localhost:8080
```

**4. Production Deployment (Auto-start)**
```bash
cd deployment
sudo bash setup_autostart.sh
sudo reboot
```

**Full installation guide**: [QUICKSTART.md](QUICKSTART.md)

---

## Project Structure

```
Veratori/
├── Poke-Bowl---updated-January/        # Main application
│   ├── backend/                        # Python backend
│   │   ├── main.py                     # Entry point
│   │   ├── camera.py                   # Camera handler
│   │   ├── detector.py                 # YOLO inference
│   │   ├── inventory.py                # Inventory tracking
│   │   ├── server.py                   # Web server + APIs
│   │   ├── restock_manager.py          # Restock submission manager
│   │   └── auth.py                     # Authentication
│   ├── frontend/                        # Web dashboard
│   │   ├── home.html                   # Executive control room
│   │   ├── index.html                  # Main dashboard
│   │   ├── upload.html                 # Upload + moderation
│   │   ├── analytics.html              # Analytics page
│   │   └── login.html                  # Authentication
│   ├── veratori_restock_flutter/       # Mobile app
│   │   ├── lib/
│   │   │   ├── screens/                 # App screens
│   │   │   ├── login_screen.dart
│   │   │   ├── upload_restock_screen.dart
│   │   │   ├── submissions_screen.dart
│   │   │   └── notifications_screen.dart
│   │   │   ├── services/               # API services
│   │   │   └── providers/              # State management
│   │   └── pubspec.yaml
│   ├── config/                         # Configuration
│   │   └── config.yaml
│   ├── deployment/                     # Deployment scripts
│   │   ├── setup_jetson.sh
│   │   └── setup_autostart.sh
│   └── best.pt                          # Pre-trained YOLO model
├── src/                                 # Next.js marketing site
│   └── app/                            # Marketing pages
└── docs/                               # Documentation
```

---

## API Endpoints

### Core APIs

- `GET /` - Web dashboard
- `GET /api/stats` - System statistics
- `GET /api/inventory` - Current inventory
- `GET /api/sales` - Sales history
- `GET /api/alerts` - Active alerts
- `GET /ws` - WebSocket connection

### Restock APIs (Mobile App)

- `POST /api/restock/login` - Employee login
- `POST /api/restock/validate` - Session validation
- `POST /api/restock/detect` - YOLO detection on photo
- `POST /api/restock/upload` - Submit restock with photos
- `GET /api/restock/submissions` - Get employee submissions
- `GET /api/restock/notifications` - Get notifications
- `GET /api/restock/all` - Manager view (all submissions)
- `POST /api/restock/status` - Update submission status

---

## Performance

| Metric | Typical | Optimized |
|--------|---------|-----------|
| FPS | 18-22 | 25-30 |
| Latency | 60ms | <50ms |
| Inference | 35ms | 30ms |
| CPU Usage | 40% | 35% |
| GPU Usage | 35% | 40% |
| Memory | 200MB | 180MB |

---

## Brand Palette

- **Deep Midnight** `#0E1526` — primary dark base
- **Sage Operation** `#5F974F` — ethical green
- **Electric Blue** `#2640CE` — action/alerts
- **Sky Tint** `#ABCEE1` — light accents
- **Mist** `#F2F6F9` — cool white background

---

## Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | 10-minute setup guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture |
| [SYSTEM_DIAGRAM.md](SYSTEM_DIAGRAM.md) | Visual system diagrams |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Production deployment |
| [veratori_restock_flutter/README.md](Poke-Bowl---updated-January/veratori_restock_flutter/README.md) | Mobile app documentation |

---

## Configuration

Edit `config/config.yaml`:

```yaml
camera:
  index: 0              # USB camera device
  width: 1280
  height: 720
  fps: 30

detector:
  model_path: best.pt
  conf_threshold: 0.25
  iou_threshold: 0.45
  device: '0'          # GPU
  half: true           # FP16 precision

inventory:
  smoothing_window: 10
  smoothing_method: median
  enable_persistence: true
  snapshot_interval: 5.0
  expiration_days: 5

alerts:
  enable_alerts: true
  low_stock_thresholds:
    mango: 3
    watermelon: 2
    # ... more products

server:
  host: '0.0.0.0'
  port: 8080
```

---

## Usage

### Start Backend
```bash
cd backend
python3 main.py
```

### Start as Service
```bash
sudo systemctl start veratori-inventory
sudo systemctl status veratori-inventory
```

### View Logs
```bash
sudo journalctl -u veratori-inventory -f
tail -f /tmp/veratori_inventory.log
```

### Mobile App
```bash
cd veratori_restock_flutter
flutter run
```

---

## Troubleshooting

### Camera not detected
```bash
v4l2-ctl --list-devices
# Update config.yaml with correct device index
```

### Low FPS
```bash
# Enable max performance
sudo nvpmodel -m 0
sudo jetson_clocks
```

### Service won't start
```bash
# Check logs
sudo journalctl -u veratori-inventory -n 50
```

### Mobile app connection issues
- Verify backend server is running
- Check API base URL in `api_service.dart`
- Ensure firewall allows connections

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Ultralytics YOLO](https://github.com/ultralytics/ultralytics) - Object detection framework
- [NVIDIA Jetson](https://developer.nvidia.com/embedded/jetson) - Edge AI platform
- [Flutter](https://flutter.dev/) - Cross-platform mobile framework
- [aiohttp](https://docs.aiohttp.org/) - Async HTTP framework

---

## Contact

**Felipe Cardozo**  
GitHub: [@FelipeCardozo0](https://github.com/FelipeCardozo0)  
Repository: [Veratori](https://github.com/FelipeCardozo0/Veratori)

---

## Status

**Version**: 2.0.0  
**Status**: Production Ready  
**Last Updated**: January 2026

Ready for immediate deployment.
