"""
YOLO Object Detector Wrapper for Jetson Orin Nano
GPU-accelerated inference with Ultralytics YOLO
"""

import logging
import time
from pathlib import Path
from typing import List, Optional, Tuple
import numpy as np

logger = logging.getLogger(__name__)


class YOLODetector:
    """
    Wrapper for YOLO model inference
    Optimized for Jetson Orin Nano with CUDA acceleration
    """
    
    def __init__(
        self,
        model_path: str,
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45,
        imgsz: int = 640,
        device: str = '0',  # CUDA device
        half: bool = True   # FP16 precision for Jetson
    ):
        """
        Initialize YOLO detector
        
        Args:
            model_path: Path to trained YOLO model (.pt file)
            conf_threshold: Confidence threshold for detections
            iou_threshold: IoU threshold for NMS
            imgsz: Input image size (will be resized to this)
            device: CUDA device ('0' for GPU, 'cpu' for CPU)
            half: Use FP16 precision (recommended for Jetson)
        """
        self.model_path = Path(model_path)
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold
        self.imgsz = imgsz
        self.device = device
        self.half = half
        
        self.model = None
        self.class_names = {}
        self.is_loaded = False
        self.inference_times = []
        
    def load(self) -> bool:
        """
        Load YOLO model with CUDA acceleration
        
        Returns:
            True if model loaded successfully
        """
        try:
            from ultralytics import YOLO
            
            if not self.model_path.exists():
                logger.error(f"Model file not found: {self.model_path}")
                return False
            
            logger.info(f"Loading YOLO model from {self.model_path}")
            start_time = time.time()
            
            # Load model
            self.model = YOLO(str(self.model_path))
            
            # Move to device
            if self.device == '0' or self.device == 'cuda':
                try:
                    import torch
                    if torch.cuda.is_available():
                        self.model.to('cuda')
                        logger.info("Model moved to CUDA device")
                        
                        # Enable half precision for Jetson
                        if self.half:
                            self.model.model.half()
                            logger.info("FP16 (half precision) enabled")
                    else:
                        logger.warning("CUDA not available, using CPU")
                        self.device = 'cpu'
                except ImportError:
                    logger.warning("PyTorch not available for CUDA check")
            
            # Extract class names
            if hasattr(self.model, 'names'):
                self.class_names = self.model.names
                logger.info(f"Loaded {len(self.class_names)} classes")
            
            load_time = time.time() - start_time
            logger.info(f"Model loaded in {load_time:.2f}s")
            
            self.is_loaded = True
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False
    
    def detect(self, frame: np.ndarray) -> List[dict]:
        """
        Run inference on a single frame
        
        Args:
            frame: Input image as numpy array (H, W, 3) in BGR format
            
        Returns:
            List of detection dictionaries with keys:
            - class_id: int
            - class_name: str
            - confidence: float
            - bbox: [x1, y1, x2, y2] in pixel coordinates
        """
        if not self.is_loaded or self.model is None:
            logger.warning("Model not loaded, cannot run inference")
            return []
        
        try:
            start_time = time.time()
            
            # Run inference
            results = self.model.predict(
                source=frame,
                imgsz=self.imgsz,
                conf=self.conf_threshold,
                iou=self.iou_threshold,
                verbose=False,
                device=self.device,
                half=self.half
            )
            
            inference_time = time.time() - start_time
            self.inference_times.append(inference_time)
            
            # Keep only last 100 inference times for moving average
            if len(self.inference_times) > 100:
                self.inference_times.pop(0)
            
            # Parse results
            detections = []
            
            if len(results) > 0:
                result = results[0]
                
                if result.boxes is not None and len(result.boxes) > 0:
                    boxes = result.boxes.xyxy.cpu().numpy()
                    confidences = result.boxes.conf.cpu().numpy()
                    class_ids = result.boxes.cls.cpu().numpy().astype(int)
                    
                    for bbox, conf, class_id in zip(boxes, confidences, class_ids):
                        detection = {
                            'class_id': int(class_id),
                            'class_name': self.class_names.get(int(class_id), f'class_{class_id}'),
                            'confidence': float(conf),
                            'bbox': [float(x) for x in bbox]  # [x1, y1, x2, y2]
                        }
                        detections.append(detection)
            
            return detections
            
        except Exception as e:
            logger.error(f"Error during inference: {e}")
            return []
    
    def get_average_inference_time(self) -> float:
        """
        Get average inference time in seconds
        
        Returns:
            Average inference time over last 100 frames
        """
        if not self.inference_times:
            return 0.0
        return float(np.mean(self.inference_times))
    
    def get_fps(self) -> float:
        """
        Get average FPS based on inference time
        
        Returns:
            Frames per second
        """
        avg_time = self.get_average_inference_time()
        return 1.0 / avg_time if avg_time > 0 else 0.0
    
    def draw_detections(
        self,
        frame: np.ndarray,
        detections: List[dict],
        show_conf: bool = True,
        color: Tuple[int, int, int] = (0, 255, 0),
        thickness: int = 2
    ) -> np.ndarray:
        """
        Draw bounding boxes and labels on frame
        
        Args:
            frame: Input image
            detections: List of detection dictionaries from detect()
            show_conf: Whether to show confidence scores
            color: BGR color for boxes
            thickness: Line thickness
            
        Returns:
            Annotated frame
        """
        import cv2
        
        annotated = frame.copy()
        
        for det in detections:
            x1, y1, x2, y2 = det['bbox']
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            
            # Draw bounding box
            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, thickness)
            
            # Prepare label
            label = det['class_name']
            if show_conf:
                label += f" {det['confidence']:.2f}"
            
            # Draw label background
            (label_w, label_h), _ = cv2.getTextSize(
                label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1
            )
            cv2.rectangle(
                annotated,
                (x1, y1 - label_h - 8),
                (x1 + label_w + 4, y1),
                color,
                -1
            )
            
            # Draw label text
            cv2.putText(
                annotated,
                label,
                (x1 + 2, y1 - 4),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 0),
                1,
                cv2.LINE_AA
            )
        
        return annotated
    
    def update_thresholds(self, conf: Optional[float] = None, iou: Optional[float] = None):
        """
        Update detection thresholds at runtime
        
        Args:
            conf: New confidence threshold
            iou: New IoU threshold
        """
        if conf is not None:
            self.conf_threshold = conf
            logger.info(f"Confidence threshold updated to {conf}")
        
        if iou is not None:
            self.iou_threshold = iou
            logger.info(f"IoU threshold updated to {iou}")
    
    def get_info(self) -> dict:
        """
        Get detector information and statistics
        
        Returns:
            Dictionary with detector properties
        """
        return {
            "model_path": str(self.model_path),
            "is_loaded": self.is_loaded,
            "device": self.device,
            "half_precision": self.half,
            "conf_threshold": self.conf_threshold,
            "iou_threshold": self.iou_threshold,
            "imgsz": self.imgsz,
            "num_classes": len(self.class_names),
            "avg_inference_time": f"{self.get_average_inference_time():.4f}s",
            "avg_fps": f"{self.get_fps():.1f}"
        }
    
    def warmup(self, num_iterations: int = 10):
        """
        Warm up the model with dummy inferences
        Important for consistent timing on first real inference
        
        Args:
            num_iterations: Number of warmup iterations
        """
        if not self.is_loaded:
            logger.warning("Cannot warmup: model not loaded")
            return
        
        logger.info(f"Warming up model with {num_iterations} iterations...")
        dummy_frame = np.zeros((640, 640, 3), dtype=np.uint8)
        
        for i in range(num_iterations):
            self.detect(dummy_frame)
        
        logger.info("Warmup complete")

