#!/usr/bin/env python3
"""
Poke Bowl Inventory System - Main Entry Point
Production-ready computer vision system for Jetson Orin Nano
"""

import asyncio
import logging
import signal
import sys
from pathlib import Path
from typing import Optional

import yaml

# Import local modules
from camera import USBCamera
from detector import YOLODetector
from inventory import InventoryTracker
from product_tracker import ProductTracker
from server import VideoStreamServer, StreamManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('/tmp/pokebowl_inventory.log')
    ]
)

logger = logging.getLogger(__name__)


class InventorySystem:
    """
    Main application class
    Coordinates all components and manages lifecycle
    """
    
    def __init__(self, config_path: Path):
        """
        Initialize inventory system
        
        Args:
            config_path: Path to configuration YAML file
        """
        self.config_path = config_path
        self.config = self.load_config()
        
        # Components
        self.camera: Optional[USBCamera] = None
        self.detector: Optional[YOLODetector] = None
        self.inventory_tracker: Optional[InventoryTracker] = None
        self.product_tracker: Optional[ProductTracker] = None
        self.server: Optional[VideoStreamServer] = None
        self.stream_manager: Optional[StreamManager] = None
        
        # Shutdown flag
        self.shutdown_event = asyncio.Event()
        
    def load_config(self) -> dict:
        """
        Load configuration from YAML file
        
        Returns:
            Configuration dictionary
        """
        try:
            with open(self.config_path, 'r') as f:
                config = yaml.safe_load(f)
            logger.info(f"Configuration loaded from {self.config_path}")
            return config
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            logger.info("Using default configuration")
            return self.get_default_config()
    
    def get_default_config(self) -> dict:
        """
        Get default configuration
        
        Returns:
            Default configuration dictionary
        """
        return {
            'camera': {
                'index': 0,
                'width': 1280,
                'height': 720,
                'fps': 30
            },
            'detector': {
                'model_path': 'best.pt',
                'conf_threshold': 0.25,
                'iou_threshold': 0.45,
                'imgsz': 640,
                'device': '0',
                'half': True
            },
            'inventory': {
                'smoothing_window': 10,
                'smoothing_method': 'median'
            },
            'server': {
                'host': '0.0.0.0',
                'port': 8080
            },
            'stream': {
                'target_fps': 30
            }
        }
    
    def initialize_components(self) -> bool:
        """
        Initialize all system components
        
        Returns:
            True if all components initialized successfully
        """
        try:
            # Initialize camera
            logger.info("Initializing camera...")
            camera_config = self.config['camera']
            self.camera = USBCamera(
                camera_index=camera_config['index'],
                width=camera_config['width'],
                height=camera_config['height'],
                fps=camera_config['fps']
            )
            
            if not self.camera.open():
                logger.error("Failed to open camera")
                return False
            
            logger.info(f"Camera initialized: {self.camera.get_info()}")
            
            # Initialize detector
            logger.info("Initializing YOLO detector...")
            detector_config = self.config['detector']
            
            # Resolve model path relative to project root
            model_path = Path(detector_config['model_path'])
            if not model_path.is_absolute():
                project_root = Path(__file__).parent.parent
                model_path = project_root / model_path
            
            self.detector = YOLODetector(
                model_path=str(model_path),
                conf_threshold=detector_config['conf_threshold'],
                iou_threshold=detector_config['iou_threshold'],
                imgsz=detector_config['imgsz'],
                device=detector_config['device'],
                half=detector_config['half']
            )
            
            if not self.detector.load():
                logger.error("Failed to load YOLO model")
                return False
            
            # Warmup detector
            self.detector.warmup(num_iterations=5)
            
            logger.info(f"Detector initialized: {self.detector.get_info()}")
            
            # Initialize inventory tracker
            logger.info("Initializing inventory tracker...")
            inventory_config = self.config['inventory']
            self.inventory_tracker = InventoryTracker(
                smoothing_window=inventory_config['smoothing_window'],
                smoothing_method=inventory_config['smoothing_method'],
                class_names=self.detector.class_names
            )
            
            logger.info("Inventory tracker initialized")
            
            # Initialize product tracker for time-based tracking and sale recording
            logger.info("Initializing product tracker...")
            self.product_tracker = ProductTracker(verification_interval=5.0)
            logger.info("Product tracker initialized")
            
            # Initialize web server
            logger.info("Initializing web server...")
            server_config = self.config['server']
            frontend_dir = Path(__file__).parent.parent / 'frontend'
            
            self.server = VideoStreamServer(
                host=server_config['host'],
                port=server_config['port'],
                frontend_dir=frontend_dir
            )
            
            logger.info(f"Web server initialized at http://{server_config['host']}:{server_config['port']}")
            
            # Initialize stream manager
            stream_config = self.config['stream']
            self.stream_manager = StreamManager(
                camera=self.camera,
                detector=self.detector,
                inventory_tracker=self.inventory_tracker,
                product_tracker=self.product_tracker,
                server=self.server,
                target_fps=stream_config['target_fps']
            )
            
            logger.info("Stream manager initialized")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize components: {e}", exc_info=True)
            return False
    
    def setup_signal_handlers(self):
        """Setup signal handlers for graceful shutdown"""
        def signal_handler(signum, frame):
            logger.info(f"Received signal {signum}, initiating shutdown...")
            asyncio.create_task(self.shutdown())
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
    
    async def shutdown(self):
        """Graceful shutdown of all components"""
        logger.info("Shutting down inventory system...")
        
        # Stop streaming
        if self.stream_manager:
            await self.stream_manager.stop()
        
        # Release camera
        if self.camera:
            self.camera.release()
        
        # Log final statistics
        if self.inventory_tracker:
            stats = self.inventory_tracker.get_statistics()
            logger.info(f"Final statistics: {stats}")
        
        self.shutdown_event.set()
        logger.info("Shutdown complete")
    
    async def run(self):
        """
        Main application loop
        """
        logger.info("=" * 60)
        logger.info("Poke Bowl Inventory System")
        logger.info("=" * 60)
        
        # Initialize components
        if not self.initialize_components():
            logger.error("Initialization failed, exiting")
            return
        
        try:
            # Start web server
            logger.info("Starting web server...")
            await self.server.start()
            
            # Start streaming
            logger.info("Starting video stream...")
            self.stream_manager.start()
            
            logger.info("=" * 60)
            logger.info("System ready!")
            logger.info(f"Web interface available at: {self.server.get_url()}")
            logger.info("Press Ctrl+C to stop")
            logger.info("=" * 60)
            
            # Wait for shutdown signal
            await self.shutdown_event.wait()
            
        except Exception as e:
            logger.error(f"Runtime error: {e}", exc_info=True)
        
        finally:
            await self.shutdown()


async def main():
    """
    Application entry point
    """
    # Determine config path
    config_path = Path(__file__).parent.parent / 'config' / 'config.yaml'
    
    # Create and run system
    system = InventorySystem(config_path)
    
    # Setup signal handlers
    loop = asyncio.get_event_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, lambda: asyncio.create_task(system.shutdown()))
    
    # Run system
    await system.run()


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)

