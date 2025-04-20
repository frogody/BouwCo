import cv2
import numpy as np
from ultralytics import YOLO
import pytesseract
from typing import List, Dict, Any
import logging
import random

logger = logging.getLogger(__name__)

# Initialize YOLO model
try:
    model = YOLO("best_floorplan_model.pt")  # Load your trained model
except Exception as e:
    logger.error(f"Failed to load YOLO model: {str(e)}")
    model = None

def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Preprocess the image for better detection.
    """
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Denoise
    denoised = cv2.fastNlMeansDenoising(thresh)
    
    return denoised

def analyze_drawing(file_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Process the uploaded drawing and return detected components.
    This is a DEMO version that returns mock data.
    
    Args:
        file_bytes: Raw bytes of the uploaded file
        
    Returns:
        List of dictionaries containing detected components with their properties
    """
    try:
        logger.info(f"Received file of size {len(file_bytes)} bytes")
        
        # For demo purposes, generate some random components
        components = [
            {
                "type": "wall",
                "confidence": 0.95,
                "dimensions": {
                    "width": 500,
                    "height": 10,
                    "area": 5000
                }
            },
            {
                "type": "floor",
                "confidence": 0.98,
                "dimensions": {
                    "width": 500,
                    "height": 400,
                    "area": 200000
                }
            },
            {
                "type": "window",
                "confidence": 0.89,
                "dimensions": {
                    "width": 120,
                    "height": 150
                }
            },
            {
                "type": "door",
                "confidence": 0.93,
                "dimensions": {
                    "width": 90,
                    "height": 210
                }
            },
            {
                "type": "kitchen",
                "confidence": 0.85,
                "dimensions": {
                    "width": 300,
                    "height": 250
                }
            },
            {
                "type": "bathroom",
                "confidence": 0.91,
                "dimensions": {
                    "width": 200,
                    "height": 200
                }
            },
        ]
        
        # Add some randomization to make it look more realistic
        for component in components:
            component["dimensions"]["width"] *= random.uniform(0.9, 1.1)
            component["dimensions"]["height"] *= random.uniform(0.9, 1.1)
            component["confidence"] *= random.uniform(0.95, 1.0)
            
            if "area" in component["dimensions"]:
                component["dimensions"]["area"] = component["dimensions"]["width"] * component["dimensions"]["height"]
        
        return components
        
    except Exception as e:
        logger.error(f"Error in analyze_drawing: {str(e)}")
        # For demo, return empty components instead of raising
        return []

def calculate_areas(components: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Calculate areas for components that need it (e.g., walls, floors).
    """
    for component in components:
        if component["type"] in ["wall", "floor", "ceiling"]:
            dims = component["dimensions"]
            component["area"] = dims["width"] * dims["height"]
    
    return components

def extract_measurements(text: str) -> Dict[str, float]:
    """
    Extract measurements from OCR text.
    Returns a dictionary of measurements if found.
    """
    # TODO: Implement measurement extraction from text
    # This would parse text like "width: 5m" or "area: 20m²"
    return {} 