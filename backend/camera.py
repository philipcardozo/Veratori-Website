"""
USB Camera Handler for Jetson Orin Nano
Handles camera initialization, frame capture, and reconnection logic
"""

import cv2
import logging
import time
from typing import Optional, Tuple
import numpy as np

logger = logging.getLogger(__name__)


class USBCamera:
    """
    Robust USB camera handler with automatic reconnection
    Supports UVC-compliant cameras
    """
    
    def __init__(self, camera_index: int = 0, width: int = 1280, height: int = 720, fps: int = 30):
        """
        Initialize USB camera handler
        
        Args:
            camera_index: V4L2 device index (default: 0 for /dev/video0)
            width: Frame width in pixels
            height: Frame height in pixels
            fps: Target frames per second
        """
        self.camera_index = camera_index
        self.width = width
        self.height = height
        self.fps = fps
        self.cap: Optional[cv2.VideoCapture] = None
        self.is_opened = False
        self.frame_count = 0
        self.last_frame: Optional[np.ndarray] = None
        
    def open(self) -> bool:
        """
        Open camera connection with optimal settings for Jetson
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # Use V4L2 backend for Linux/Jetson
            self.cap = cv2.VideoCapture(self.camera_index, cv2.CAP_V4L2)
            
            if not self.cap.isOpened():
                logger.error(f"Failed to open camera at index {self.camera_index}")
                return False
            
            # Set camera properties
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            self.cap.set(cv2.CAP_PROP_FPS, self.fps)
            
            # Set MJPEG format for better USB bandwidth utilization
            self.cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
            
            # Set buffer size to 1 to minimize latency
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            
            # Verify actual settings
            actual_width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            actual_height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            actual_fps = int(self.cap.get(cv2.CAP_PROP_FPS))
            
            logger.info(f"Camera opened: {actual_width}x{actual_height} @ {actual_fps}fps")
            
            self.is_opened = True
            self.frame_count = 0
            return True
            
        except Exception as e:
            logger.error(f"Exception opening camera: {e}")
            return False
    
    def read(self) -> Tuple[bool, Optional[np.ndarray]]:
        """
        Read a frame from the camera
        
        Returns:
            Tuple of (success, frame)
            - success: True if frame was read successfully
            - frame: numpy array of shape (H, W, 3) in BGR format, or None
        """
        if not self.is_opened or self.cap is None:
            return False, None
        
        try:
            ret, frame = self.cap.read()
            
            if ret and frame is not None:
                self.frame_count += 1
                self.last_frame = frame.copy()
                return True, frame
            else:
                logger.warning(f"Failed to read frame (count: {self.frame_count})")
                return False, None
                
        except Exception as e:
            logger.error(f"Exception reading frame: {e}")
            return False, None
    
    def get_last_frame(self) -> Optional[np.ndarray]:
        """
        Return the last successfully captured frame
        Useful for displaying stale frame during reconnection
        """
        return self.last_frame
    
    def release(self):
        """Release camera resources"""
        if self.cap is not None:
            self.cap.release()
            self.cap = None
        self.is_opened = False
        logger.info("Camera released")
    
    def reconnect(self, max_attempts: int = 5, retry_delay: float = 2.0) -> bool:
        """
        Attempt to reconnect to camera
        
        Args:
            max_attempts: Maximum number of reconnection attempts
            retry_delay: Delay between attempts in seconds
            
        Returns:
            True if reconnection successful
        """
        logger.warning("Attempting camera reconnection...")
        self.release()
        
        for attempt in range(1, max_attempts + 1):
            logger.info(f"Reconnection attempt {attempt}/{max_attempts}")
            time.sleep(retry_delay)
            
            if self.open():
                logger.info("Camera reconnected successfully")
                return True
        
        logger.error("Camera reconnection failed")
        return False
    
    def is_healthy(self) -> bool:
        """
        Check if camera is healthy and responsive
        
        Returns:
            True if camera is working properly
        """
        if not self.is_opened or self.cap is None:
            return False
        
        # Try to grab a frame without decoding
        return self.cap.grab()
    
    def get_info(self) -> dict:
        """
        Get camera information and current settings
        
        Returns:
            Dictionary with camera properties
        """
        if not self.is_opened or self.cap is None:
            return {
                "status": "closed",
                "camera_index": self.camera_index
            }
        
        return {
            "status": "open",
            "camera_index": self.camera_index,
            "width": int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
            "height": int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
            "fps": int(self.cap.get(cv2.CAP_PROP_FPS)),
            "frames_captured": self.frame_count,
            "backend": self.cap.getBackendName()
        }
    
    def __enter__(self):
        """Context manager entry"""
        self.open()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.release()
    
    def __del__(self):
        """Destructor to ensure cleanup"""
        self.release()

