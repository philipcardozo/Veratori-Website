"""
Web Server with Frame Streaming
Serves frontend and streams video + inventory data via WebSockets
"""

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Optional, Set
import base64

import cv2
import numpy as np
from aiohttp import web
import aiohttp

logger = logging.getLogger(__name__)


class VideoStreamServer:
    """
    Lightweight async web server for streaming video and inventory data
    Uses WebSockets for low-latency bidirectional communication
    """
    
    def __init__(
        self,
        host: str = '0.0.0.0',
        port: int = 8080,
        frontend_dir: Optional[Path] = None
    ):
        """
        Initialize web server
        
        Args:
            host: Server host address
            port: Server port
            frontend_dir: Path to frontend files
        """
        self.host = host
        self.port = port
        self.frontend_dir = frontend_dir or Path(__file__).parent.parent / 'frontend'
        
        self.app = web.Application()
        self.setup_routes()
        
        # Active WebSocket connections
        self.websockets: Set[web.WebSocketResponse] = set()
        
        # Latest frame and inventory data
        self.latest_frame: Optional[np.ndarray] = None
        self.latest_inventory: dict = {}
        self.latest_stats: dict = {}
        self.latest_timers: dict = {}
        self.latest_sales: list = []
        
        # Server statistics
        self.frames_streamed = 0
        self.start_time = time.time()
        
    def setup_routes(self):
        """Setup HTTP and WebSocket routes"""
        self.app.router.add_get('/', self.handle_index)
        self.app.router.add_get('/ws', self.handle_websocket)
        self.app.router.add_get('/health', self.handle_health)
        self.app.router.add_get('/api/stats', self.handle_stats)
        
    async def handle_index(self, request: web.Request) -> web.Response:
        """Serve main HTML page"""
        index_path = self.frontend_dir / 'index.html'
        
        if not index_path.exists():
            return web.Response(
                text="Frontend not found. Please ensure frontend/index.html exists.",
                status=404
            )
        
        return web.FileResponse(index_path)
    
    async def handle_health(self, request: web.Request) -> web.Response:
        """Health check endpoint"""
        uptime = time.time() - self.start_time
        
        health_data = {
            'status': 'healthy',
            'uptime_seconds': uptime,
            'active_connections': len(self.websockets),
            'frames_streamed': self.frames_streamed
        }
        
        return web.json_response(health_data)
    
    async def handle_stats(self, request: web.Request) -> web.Response:
        """Return current statistics"""
        return web.json_response(self.latest_stats)
    
    async def handle_websocket(self, request: web.Request) -> web.WebSocketResponse:
        """
        Handle WebSocket connection for streaming
        Sends frames and inventory updates to client
        """
        ws = web.WebSocketResponse(
            heartbeat=30,  # Send ping every 30s
            compress=False  # Disable compression for lower latency
        )
        await ws.prepare(request)
        
        self.websockets.add(ws)
        client_addr = request.remote
        logger.info(f"WebSocket connected: {client_addr} (total: {len(self.websockets)})")
        
        try:
            # Send initial data
            await self.send_to_client(ws, {
                'type': 'inventory',
                'data': self.latest_inventory
            })
            
            if self.latest_timers:
                await self.send_to_client(ws, {
                    'type': 'timers',
                    'data': self.latest_timers
                })
            
            if self.latest_sales:
                await self.send_to_client(ws, {
                    'type': 'sales',
                    'data': self.latest_sales
                })
            
            # Handle incoming messages (if any)
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    try:
                        data = json.loads(msg.data)
                        await self.handle_client_message(ws, data)
                    except json.JSONDecodeError:
                        logger.warning(f"Invalid JSON from {client_addr}")
                
                elif msg.type == aiohttp.WSMsgType.ERROR:
                    logger.error(f"WebSocket error: {ws.exception()}")
        
        except asyncio.CancelledError:
            logger.info(f"WebSocket cancelled: {client_addr}")
        
        except Exception as e:
            logger.error(f"WebSocket error for {client_addr}: {e}")
        
        finally:
            self.websockets.discard(ws)
            logger.info(f"WebSocket disconnected: {client_addr} (remaining: {len(self.websockets)})")
        
        return ws
    
    async def handle_client_message(self, ws: web.WebSocketResponse, data: dict):
        """
        Handle incoming message from client
        
        Args:
            ws: WebSocket connection
            data: Parsed JSON data
        """
        msg_type = data.get('type')
        
        if msg_type == 'ping':
            await self.send_to_client(ws, {'type': 'pong'})
        
        elif msg_type == 'request_frame':
            # Client requesting latest frame
            if self.latest_frame is not None:
                await self.send_frame_to_client(ws, self.latest_frame)
    
    async def send_to_client(self, ws: web.WebSocketResponse, data: dict):
        """
        Send JSON data to a single client
        
        Args:
            ws: WebSocket connection
            data: Data to send
        """
        try:
            await ws.send_json(data)
        except Exception as e:
            logger.error(f"Failed to send to client: {e}")
    
    async def send_frame_to_client(self, ws: web.WebSocketResponse, frame: np.ndarray):
        """
        Encode and send frame to a single client
        
        Args:
            ws: WebSocket connection
            frame: Frame to send
        """
        try:
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            
            # Convert to base64
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            
            # Send with timestamp
            await ws.send_json({
                'type': 'frame',
                'data': frame_b64,
                'timestamp': time.time()
            })
        
        except Exception as e:
            logger.error(f"Failed to send frame: {e}")
    
    async def broadcast_frame(self, frame: np.ndarray):
        """
        Broadcast frame to all connected clients
        
        Args:
            frame: Frame to broadcast
        """
        if not self.websockets:
            return
        
        self.latest_frame = frame.copy()
        self.frames_streamed += 1
        
        # Encode once, send to all
        try:
            _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            
            message = {
                'type': 'frame',
                'data': frame_b64,
                'timestamp': time.time()
            }
            
            # Send to all clients concurrently
            if self.websockets:
                await asyncio.gather(
                    *[ws.send_json(message) for ws in self.websockets],
                    return_exceptions=True
                )
        
        except Exception as e:
            logger.error(f"Failed to broadcast frame: {e}")
    
    async def broadcast_inventory(self, inventory: dict):
        """
        Broadcast inventory update to all clients
        
        Args:
            inventory: Inventory dictionary
        """
        if not self.websockets:
            self.latest_inventory = inventory
            return
        
        self.latest_inventory = inventory
        
        message = {
            'type': 'inventory',
            'data': inventory,
            'timestamp': time.time()
        }
        
        # Send to all clients
        if self.websockets:
            await asyncio.gather(
                *[ws.send_json(message) for ws in self.websockets],
                return_exceptions=True
            )
    
    async def broadcast_stats(self, stats: dict):
        """
        Broadcast statistics to all clients
        
        Args:
            stats: Statistics dictionary
        """
        self.latest_stats = stats
        
        if not self.websockets:
            return
        
        message = {
            'type': 'stats',
            'data': stats,
            'timestamp': time.time()
        }
        
        if self.websockets:
            await asyncio.gather(
                *[ws.send_json(message) for ws in self.websockets],
                return_exceptions=True
            )
    
    async def broadcast_timers(self, timers: dict):
        """
        Broadcast product timers to all clients
        
        Args:
            timers: Dictionary mapping product names to duration strings
        """
        self.latest_timers = timers
        
        if not self.websockets:
            return
        
        message = {
            'type': 'timers',
            'data': timers,
            'timestamp': time.time()
        }
        
        if self.websockets:
            await asyncio.gather(
                *[ws.send_json(message) for ws in self.websockets],
                return_exceptions=True
            )
    
    async def broadcast_sales(self, sales: list):
        """
        Broadcast sales log to all clients
        
        Args:
            sales: List of sale dictionaries
        """
        self.latest_sales = sales
        
        if not self.websockets:
            return
        
        message = {
            'type': 'sales',
            'data': sales,
            'timestamp': time.time()
        }
        
        if self.websockets:
            await asyncio.gather(
                *[ws.send_json(message) for ws in self.websockets],
                return_exceptions=True
            )
    
    def update_frame(self, frame: np.ndarray):
        """
        Update latest frame (synchronous wrapper)
        
        Args:
            frame: New frame
        """
        self.latest_frame = frame.copy()
    
    def update_inventory(self, inventory: dict):
        """
        Update latest inventory (synchronous wrapper)
        
        Args:
            inventory: New inventory
        """
        self.latest_inventory = inventory
    
    def update_stats(self, stats: dict):
        """
        Update latest stats (synchronous wrapper)
        
        Args:
            stats: New statistics
        """
        self.latest_stats = stats
    
    async def start(self):
        """Start the web server"""
        runner = web.AppRunner(self.app)
        await runner.setup()
        
        site = web.TCPSite(runner, self.host, self.port)
        await site.start()
        
        logger.info(f"Server started at http://{self.host}:{self.port}")
        logger.info(f"Frontend directory: {self.frontend_dir}")
    
    def run(self):
        """Run the server (blocking)"""
        web.run_app(
            self.app,
            host=self.host,
            port=self.port,
            print=None,  # Disable aiohttp's startup message
            access_log=None  # Disable access logs for performance
        )
    
    def get_url(self) -> str:
        """
        Get server URL
        
        Returns:
            Server URL string
        """
        return f"http://{self.host}:{self.port}"


class StreamManager:
    """
    Manages streaming loop coordination between camera, detector, and server
    """
    
    def __init__(
        self,
        camera,
        detector,
        inventory_tracker,
        product_tracker,
        server: VideoStreamServer,
        target_fps: int = 30
    ):
        """
        Initialize stream manager
        
        Args:
            camera: USBCamera instance
            detector: YOLODetector instance
            inventory_tracker: InventoryTracker instance
            product_tracker: ProductTracker instance
            server: VideoStreamServer instance
            target_fps: Target streaming FPS
        """
        self.camera = camera
        self.detector = detector
        self.inventory_tracker = inventory_tracker
        self.product_tracker = product_tracker
        self.server = server
        self.target_fps = target_fps
        self.frame_interval = 1.0 / target_fps
        
        self.is_running = False
        self.loop_task = None
    
    async def stream_loop(self):
        """
        Main streaming loop
        Captures frames, runs inference, updates inventory, and broadcasts
        """
        import concurrent.futures
        
        logger.info("Starting stream loop...")
        self.is_running = True
        
        frame_count = 0
        last_stats_time = time.time()
        stats_interval = 1.0  # Update stats every second
        
        # Use thread pool for blocking operations
        executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)
        loop = asyncio.get_event_loop()
        
        while self.is_running:
            loop_start = time.time()
            
            try:
                # Capture frame in thread to avoid blocking
                success, frame = await loop.run_in_executor(executor, self.camera.read)
                
                if not success or frame is None:
                    logger.warning("Failed to capture frame, attempting reconnection...")
                    reconnect_success = await loop.run_in_executor(executor, self.camera.reconnect)
                    if not reconnect_success:
                        await asyncio.sleep(1.0)
                        continue
                    success, frame = await loop.run_in_executor(executor, self.camera.read)
                    if not success:
                        await asyncio.sleep(1.0)
                        continue
                
                # Run detection in thread to avoid blocking
                detections = await loop.run_in_executor(executor, self.detector.detect, frame)
            except Exception as e:
                logger.error(f"Error in stream loop: {e}")
                await asyncio.sleep(0.1)
                continue
            
            # Update inventory
            self.inventory_tracker.update(detections)
            inventory = self.inventory_tracker.get_inventory()
            
            # Update product tracker (handles timers and sale detection)
            current_time = time.time()
            previous_sales_count = self.product_tracker.get_total_sales_count()
            self.product_tracker.update_inventory(inventory, current_time)
            
            # Get active timers
            active_timers = self.product_tracker.get_active_timers(current_time)
            
            # Broadcast timers frequently (they update every frame conceptually)
            await self.server.broadcast_timers(active_timers)
            
            # Only broadcast sales if new sales were detected (verification cycle ran)
            current_sales_count = self.product_tracker.get_total_sales_count()
            if current_sales_count > previous_sales_count:
                all_sales = self.product_tracker.get_sales_log()
                await self.server.broadcast_sales(all_sales)
            
            # Draw detections on frame
            annotated_frame = self.detector.draw_detections(frame, detections)
            
            # Broadcast frame and inventory
            await self.server.broadcast_frame(annotated_frame)
            await self.server.broadcast_inventory(inventory)
            
            frame_count += 1
            
            # Broadcast stats periodically
            current_time = time.time()
            if current_time - last_stats_time >= stats_interval:
                stats = {
                    'fps': self.detector.get_fps(),
                    'inference_time': self.detector.get_average_inference_time(),
                    'total_items': self.inventory_tracker.get_total_items(),
                    'frame_count': frame_count,
                    'active_connections': len(self.server.websockets)
                }
                await self.server.broadcast_stats(stats)
                last_stats_time = current_time
            
            # Maintain target FPS
            elapsed = time.time() - loop_start
            sleep_time = max(0, self.frame_interval - elapsed)
            if sleep_time > 0:
                await asyncio.sleep(sleep_time)
        
        # Cleanup executor
        executor.shutdown(wait=False)
        logger.info("Stream loop stopped")
    
    def start(self):
        """Start streaming loop"""
        if self.is_running:
            logger.warning("Stream already running")
            return
        
        self.loop_task = asyncio.create_task(self.stream_loop())
    
    async def stop(self):
        """Stop streaming loop"""
        self.is_running = False
        
        if self.loop_task:
            await self.loop_task
            self.loop_task = None

