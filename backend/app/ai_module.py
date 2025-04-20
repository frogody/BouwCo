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
    """
    try:
        logger.info(f"Received file of size {len(file_bytes)} bytes")
        
        # Convert bytes to numpy array
        nparr = np.frombuffer(file_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Failed to decode image")
            
        # Preprocess image
        processed_image = preprocess_image(image)
        
        # Perform object detection if model is available
        components = []
        if model is not None:
            # Run YOLO detection
            results = model(processed_image)
            
            # Process each detection
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    # Get coordinates and dimensions
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    width = x2 - x1
                    height = y2 - y1
                    area = width * height
                    confidence = box.conf[0].item()
                    class_id = box.cls[0].item()
                    component_type = model.names[int(class_id)]
                    
                    components.append({
                        "type": component_type,
                        "confidence": confidence,
                        "dimensions": {
                            "width": width,
                            "height": height,
                            "area": area,
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2
                        }
                    })
        
        # Extract text annotations using OCR
        text_results = pytesseract.image_to_data(processed_image, output_type=pytesseract.Output.DICT)
        for i in range(len(text_results["text"])):
            if int(text_results["conf"][i]) > 60:  # Filter low confidence text
                components.append({
                    "type": "text_annotation",
                    "text": text_results["text"][i],
                    "confidence": float(text_results["conf"][i]) / 100,
                    "dimensions": {
                        "x": text_results["left"][i],
                        "y": text_results["top"][i],
                        "width": text_results["width"][i],
                        "height": text_results["height"][i]
                    }
                })
        
        return components
        
    except Exception as e:
        logger.error(f"Error in analyze_drawing: {str(e)}")
        raise

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