"""
Product Timer and Sale Tracking System
Tracks product presence over time and records sales when products disappear
"""

import logging
import time
from typing import Dict, List, Optional
from datetime import datetime
import pytz

logger = logging.getLogger(__name__)


class ProductTimer:
    """
    Tracks individual product presence and calculates time since first detection
    """
    
    def __init__(self, product_name: str, first_seen_time: float):
        """
        Initialize product timer
        
        Args:
            product_name: Name of the product
            first_seen_time: Unix timestamp when product was first detected
        """
        self.product_name = product_name
        self.first_seen_time = first_seen_time
        self.last_verified_time = first_seen_time
    
    def update_verification(self, current_time: float):
        """
        Update last verified time
        
        Args:
            current_time: Current Unix timestamp
        """
        self.last_verified_time = current_time
    
    def get_duration(self, current_time: float) -> float:
        """
        Get duration in seconds since first detection
        
        Args:
            current_time: Current Unix timestamp
            
        Returns:
            Duration in seconds
        """
        return current_time - self.first_seen_time
    
    def format_duration(self, current_time: float) -> str:
        """
        Format duration as human-readable string
        
        Args:
            current_time: Current Unix timestamp
            
        Returns:
            Formatted duration string (e.g., "2m 30s", "45s")
        """
        duration = self.get_duration(current_time)
        
        if duration < 60:
            return f"{int(duration)}s"
        elif duration < 3600:
            minutes = int(duration // 60)
            seconds = int(duration % 60)
            return f"{minutes}m {seconds}s"
        else:
            hours = int(duration // 3600)
            minutes = int((duration % 3600) // 60)
            return f"{hours}h {minutes}m"


class SaleRecord:
    """
    Represents a recorded sale event
    """
    
    def __init__(self, product_name: str, sale_timestamp: float):
        """
        Initialize sale record
        
        Args:
            product_name: Name of the product sold
            sale_timestamp: Unix timestamp when sale was recorded
        """
        self.product_name = product_name
        self.timestamp = sale_timestamp
        self.est_time = self._convert_to_est(sale_timestamp)
    
    def _convert_to_est(self, utc_timestamp: float) -> str:
        """
        Convert Unix timestamp to US Eastern Time string
        
        Args:
            utc_timestamp: Unix timestamp
            
        Returns:
            Formatted EST timestamp string
        """
        est_tz = pytz.timezone('US/Eastern')
        dt = datetime.fromtimestamp(utc_timestamp, tz=pytz.UTC)
        est_dt = dt.astimezone(est_tz)
        return est_dt.strftime('%Y-%m-%d %I:%M:%S %p %Z')
    
    def to_dict(self) -> dict:
        """
        Convert sale record to dictionary
        
        Returns:
            Dictionary with product name and formatted timestamp
        """
        return {
            'product': self.product_name,
            'timestamp': self.timestamp,
            'est_time': self.est_time
        }


class ProductTracker:
    """
    Tracks product timers and detects sales when products disappear
    """
    
    def __init__(self, verification_interval: float = 5.0):
        """
        Initialize product tracker
        
        Args:
            verification_interval: Interval in seconds between verification cycles (default: 5.0)
        """
        self.verification_interval = verification_interval
        self.last_verification_time = time.time()
        
        # Active product timers: {product_name: ProductTimer}
        self.active_timers: Dict[str, ProductTimer] = {}
        
        # Recorded sales: List[SaleRecord] (chronological order)
        self.sales_log: List[SaleRecord] = []
        
        # Previous inventory snapshot for comparison
        self.previous_inventory: Dict[str, int] = {}
        
        logger.info(f"Product tracker initialized with {verification_interval}s verification interval")
    
    def update_inventory(self, current_inventory: Dict[str, int], current_time: Optional[float] = None):
        """
        Update tracker with current inventory state
        Should be called on every frame
        
        Args:
            current_inventory: Dictionary mapping product names to counts
            current_time: Current Unix timestamp (optional, defaults to now)
        """
        if current_time is None:
            current_time = time.time()
        
        # Check if verification cycle should run
        time_since_last_verification = current_time - self.last_verification_time
        
        if time_since_last_verification >= self.verification_interval:
            self._run_verification_cycle(current_inventory, current_time)
            self.last_verification_time = current_time
        
        # Update active timers for currently detected products
        self._update_active_timers(current_inventory, current_time)
        
        # Store current inventory for next verification
        self.previous_inventory = current_inventory.copy()
    
    def _update_active_timers(self, current_inventory: Dict[str, int], current_time: float):
        """
        Update or create timers for products currently in inventory
        
        Args:
            current_inventory: Current inventory state
            current_time: Current Unix timestamp
        """
        for product_name in current_inventory.keys():
            if product_name not in self.active_timers:
                # New product detected - start timer
                self.active_timers[product_name] = ProductTimer(product_name, current_time)
                logger.debug(f"Started timer for product: {product_name}")
            else:
                # Existing product - update verification time
                self.active_timers[product_name].update_verification(current_time)
    
    def _run_verification_cycle(self, current_inventory: Dict[str, int], current_time: float):
        """
        Run verification cycle to detect sales (products that disappeared)
        
        Args:
            current_inventory: Current inventory state
            current_time: Current Unix timestamp
        """
        # Find products that were present before but are not present now
        products_in_previous = set(self.previous_inventory.keys())
        products_in_current = set(current_inventory.keys())
        
        disappeared_products = products_in_previous - products_in_current
        
        # Record sales for disappeared products
        for product_name in disappeared_products:
            if product_name in self.active_timers:
                # Product was verified before and is now gone - record as sale
                sale = SaleRecord(product_name, current_time)
                self.sales_log.append(sale)
                
                # Remove timer for this product
                timer = self.active_timers.pop(product_name)
                duration = timer.format_duration(current_time)
                
                logger.info(f"Sale recorded: {product_name} (was visible for {duration}) at {sale.est_time}")
    
    def get_active_timers(self, current_time: Optional[float] = None) -> Dict[str, str]:
        """
        Get formatted duration strings for all active product timers
        
        Args:
            current_time: Current Unix timestamp (optional, defaults to now)
            
        Returns:
            Dictionary mapping product names to formatted duration strings
        """
        if current_time is None:
            current_time = time.time()
        
        timers = {}
        for product_name, timer in self.active_timers.items():
            timers[product_name] = timer.format_duration(current_time)
        
        return timers
    
    def get_sales_log(self, limit: Optional[int] = None) -> List[dict]:
        """
        Get sales log entries
        
        Args:
            limit: Maximum number of recent sales to return (None for all)
            
        Returns:
            List of sale dictionaries, most recent last
        """
        sales = [sale.to_dict() for sale in self.sales_log]
        
        if limit is not None and limit > 0:
            # Return most recent N sales
            return sales[-limit:]
        
        return sales
    
    def get_total_sales_count(self) -> int:
        """
        Get total number of recorded sales
        
        Returns:
            Total sales count
        """
        return len(self.sales_log)
    
    def clear_sales_log(self):
        """
        Clear the sales log (useful for testing or reset)
        """
        self.sales_log.clear()
        logger.info("Sales log cleared")
    
    def reset(self):
        """
        Reset all tracking state (timers and sales log)
        """
        self.active_timers.clear()
        self.sales_log.clear()
        self.previous_inventory.clear()
        self.last_verification_time = time.time()
        logger.info("Product tracker reset")
    
    def get_statistics(self) -> dict:
        """
        Get tracker statistics
        
        Returns:
            Dictionary with tracking stats
        """
        return {
            'active_products': len(self.active_timers),
            'total_sales': len(self.sales_log),
            'verification_interval': self.verification_interval,
            'last_verification': self.last_verification_time
        }
