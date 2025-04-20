from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging
from sqlalchemy import text
from app.database import SessionLocal

from .auth import get_current_user, verify_api_key
from .models import User
from .ai_module import analyze_drawing
from .cost_calc import calculate_costs

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Construction Cost Estimator API",
    description="API for analyzing construction drawings and estimating costs",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Construction Cost Estimator API"}

@app.post("/upload-drawing")
async def upload_drawing(
    file: UploadFile = File(...),
):
    """
    Upload and analyze a construction drawing.
    Returns cost breakdown based on detected elements.
    """
    try:
        # Read file content
        content = await file.read()
        
        # Analyze drawing with AI
        try:
            components = analyze_drawing(content)
        except Exception as e:
            logger.error(f"AI processing failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to process the drawing. Please ensure it's a valid construction plan."
            )

        # Calculate costs
        cost_breakdown = calculate_costs(components)

        return cost_breakdown

    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request."
        )

@app.post("/floor-plans/analyze")
async def analyze_floor_plan(
    file: UploadFile = File(...),
):
    """
    Upload and analyze a floor plan.
    Returns analysis of the floor plan.
    """
    try:
        # Read file content
        content = await file.read()
        
        # Analyze drawing with AI
        try:
            components = analyze_drawing(content)
        except Exception as e:
            logger.error(f"AI processing failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to process the drawing. Please ensure it's a valid floor plan."
            )

        # Calculate costs
        cost_breakdown = calculate_costs(components)

        return {
            "status": "success",
            "components": components,
            "cost_breakdown": cost_breakdown
        }

    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request."
        )

@app.get("/cost-data/{item_name}")
async def get_cost(
    item_name: str,
    api_key: Optional[str] = None,
):
    """
    Get cost data for a specific construction item.
    DEMO version that returns mock data.
    """
    # Demo cost data
    cost_data = {
        "wall": {"unit_cost": 95, "labor_rate": 45, "equipment_rate": 0},
        "floor": {"unit_cost": 65, "labor_rate": 30, "equipment_rate": 5},
        "window": {"unit_cost": 350, "labor_rate": 120, "equipment_rate": 0},
        "door": {"unit_cost": 250, "labor_rate": 85, "equipment_rate": 0},
    }
    
    if item_name not in cost_data:
        return {"item": item_name, "unit_cost": 100, "labor_rate": 50, "equipment_rate": 10}
    
    return {"item": item_name, **cost_data[item_name]}

@app.get("/health")
async def health_check():
    try:
        return {
            "status": "healthy",
            "database": "healthy",
            "version": "demo"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Import and include your other routers here
# ... existing code ... 