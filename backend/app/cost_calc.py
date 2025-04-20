from typing import List, Dict, Any
from sqlalchemy.orm import Session
from .models import MaterialCost, LaborCost, EquipmentCost, IndirectCost
import logging
import random

logger = logging.getLogger(__name__)

def get_material_cost(
    db: Session,
    material_name: str,
    region: str,
    quantity: float = 1.0
) -> float:
    """
    Get the cost for a specific material in a given region.
    """
    material = db.query(MaterialCost).filter(
        MaterialCost.name == material_name,
        MaterialCost.region == region
    ).first()
    
    if not material:
        logger.warning(f"Material cost not found for {material_name} in {region}")
        return 0.0
        
    return material.unit_cost * quantity

def get_labor_cost(
    db: Session,
    trade: str,
    region: str,
    hours: float = 1.0
) -> float:
    """
    Get the labor cost for a specific trade in a given region.
    """
    labor = db.query(LaborCost).filter(
        LaborCost.trade == trade,
        LaborCost.region == region
    ).first()
    
    if not labor:
        logger.warning(f"Labor cost not found for {trade} in {region}")
        return 0.0
        
    return labor.hourly_rate * hours

def get_equipment_cost(
    db: Session,
    equipment_name: str,
    region: str,
    days: float = 1.0
) -> float:
    """
    Get the equipment rental cost for a specific piece of equipment.
    """
    equipment = db.query(EquipmentCost).filter(
        EquipmentCost.name == equipment_name,
        EquipmentCost.region == region
    ).first()
    
    if not equipment:
        logger.warning(f"Equipment cost not found for {equipment_name} in {region}")
        return 0.0
        
    return equipment.daily_rate * days

def get_indirect_costs(
    db: Session,
    region: str,
    direct_cost: float
) -> Dict[str, float]:
    """
    Calculate indirect costs as percentages of direct costs.
    """
    indirect_costs = db.query(IndirectCost).filter(
        IndirectCost.region == region
    ).all()
    
    result = {}
    total_percentage = 0.0
    
    for cost in indirect_costs:
        amount = direct_cost * (cost.percentage / 100.0)
        result[cost.name] = amount
        total_percentage += cost.percentage
    
    result["total"] = sum(result.values())
    result["total_percentage"] = total_percentage
    
    return result

def calculate_costs(
    components: List[Dict[str, Any]],
    region: str = "default"
) -> Dict[str, Any]:
    """
    Calculate total construction costs based on detected components.
    All dimensions are calculated in square meters except for ceiling.
    """
    try:
        breakdown = []
        total_direct_cost = 0.0
        
        # More accurate cost rates ($ per square meter)
        cost_rates = {
            "wall": {
                "material": {"rate": 95, "unit": "m2", "includes": ["drywall", "insulation", "paint"]},
                "labor": {"rate": 45, "unit": "m2", "hours_per_unit": 1.2},
                "equipment": {"rate": 0, "unit": "day"},
                "calculate_area": lambda w, h: w * h  # Standard wall area
            },
            "floor": {
                "material": {"rate": 65, "unit": "m2", "includes": ["subfloor", "finish flooring"]},
                "labor": {"rate": 30, "unit": "m2", "hours_per_unit": 0.8},
                "equipment": {"rate": 5, "unit": "day"},
                "calculate_area": lambda w, h: w * h  # Floor area is width * length
            },
            "window": {
                "material": {"rate": 350, "unit": "piece", "includes": ["frame", "glass", "hardware"]},
                "labor": {"rate": 120, "unit": "piece", "hours_per_unit": 3},
                "equipment": {"rate": 0, "unit": "day"},
                "calculate_area": lambda w, h: 1  # Windows are counted as pieces
            },
            "door": {
                "material": {"rate": 250, "unit": "piece", "includes": ["door", "frame", "hardware"]},
                "labor": {"rate": 85, "unit": "piece", "hours_per_unit": 2.5},
                "equipment": {"rate": 0, "unit": "day"},
                "calculate_area": lambda w, h: 1  # Doors are counted as pieces
            },
            "kitchen": {
                "material": {"rate": 450, "unit": "m2", "includes": ["cabinets", "countertops", "fixtures"]},
                "labor": {"rate": 200, "unit": "m2", "hours_per_unit": 4},
                "equipment": {"rate": 10, "unit": "day"},
                "calculate_area": lambda w, h: w * h  # Kitchen area is floor space
            },
            "bathroom": {
                "material": {"rate": 550, "unit": "m2", "includes": ["fixtures", "tile", "plumbing"]},
                "labor": {"rate": 250, "unit": "m2", "hours_per_unit": 5},
                "equipment": {"rate": 15, "unit": "day"},
                "calculate_area": lambda w, h: w * h  # Bathroom area is floor space
            },
            "ceiling": {
                "material": {"rate": 45, "unit": "piece", "includes": ["drywall", "paint"]},
                "labor": {"rate": 35, "unit": "piece", "hours_per_unit": 0.9},
                "equipment": {"rate": 0, "unit": "day"},
                "calculate_area": lambda w, h: 1  # Ceiling is now counted as pieces
            },
            "roof": {
                "material": {"rate": 120, "unit": "m2", "includes": ["shingles", "underlayment"]},
                "labor": {"rate": 65, "unit": "m2", "hours_per_unit": 1.5},
                "equipment": {"rate": 10, "unit": "day"},
                "calculate_area": lambda w, h: w * h * 1.15  # Roof area with 15% extra for slope
            }
        }
        
        # Regional cost factors
        regional_factors = {
            "default": 1.0,
            "amsterdam": 1.2,
            "rotterdam": 1.15,
            "utrecht": 1.1,
            "denhaag": 1.15
        }
        
        region_factor = regional_factors.get(region.lower(), 1.0)
        
        # Process each detected component
        for component in components:
            component_type = component["type"]
            dimensions = component.get("dimensions", {})
            
            # Skip non-physical components
            if component_type == "text_annotation":
                continue
                
            # Get cost rates for this component
            rates = cost_rates.get(component_type)
            if not rates:
                logger.warning(f"No cost data for component type: {component_type}")
                continue
            
            # Get dimensions in meters
            width = dimensions.get("width", 0) * 0.001  # Convert mm to meters
            height = dimensions.get("height", 0) * 0.001  # Convert mm to meters
            
            # Calculate area using component-specific calculation
            area = rates["calculate_area"](width, height)
            
            # Calculate costs with regional adjustment
            material_cost = rates["material"]["rate"] * area * region_factor
            labor_hours = rates["labor"]["hours_per_unit"] * area
            labor_cost = rates["labor"]["rate"] * labor_hours * region_factor
            equipment_cost = rates["equipment"]["rate"] * (labor_hours / 8) * region_factor  # Assuming 8-hour workday
            
            # Calculate total for this component
            component_total = material_cost + labor_cost + equipment_cost
            total_direct_cost += component_total
            
            breakdown.append({
                "component": component_type,
                "dimensions": {
                    "width": round(width, 2),
                    "height": round(height, 2),
                    "area": round(area, 2)
                },
                "unit": rates["material"]["unit"],
                "material_cost": round(material_cost, 2),
                "labor_cost": round(labor_cost, 2),
                "equipment_cost": round(equipment_cost, 2),
                "total": round(component_total, 2),
                "includes": rates["material"]["includes"]
            })
        
        # Calculate indirect costs
        indirect_costs = {
            "overhead": round(total_direct_cost * 0.12, 2),  # 12% overhead
            "profit": round(total_direct_cost * 0.10, 2),    # 10% profit
            "contingency": round(total_direct_cost * 0.08, 2),  # 8% contingency
            "permits": round(total_direct_cost * 0.02, 2),      # 2% permits
            "insurance": round(total_direct_cost * 0.03, 2),    # 3% insurance
        }
        
        indirect_costs["total"] = sum(indirect_costs.values())
        indirect_costs["total_percentage"] = 35  # Total of all percentages
        
        # Prepare final result
        result = {
            "breakdown": breakdown,
            "direct_costs": {
                "total": round(total_direct_cost, 2),
                "material_total": round(sum(item["material_cost"] for item in breakdown), 2),
                "labor_total": round(sum(item["labor_cost"] for item in breakdown), 2),
                "equipment_total": round(sum(item["equipment_cost"] for item in breakdown), 2)
            },
            "indirect_costs": indirect_costs,
            "total_cost": round(total_direct_cost + indirect_costs["total"], 2),
            "region_factor": region_factor
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Error calculating costs: {str(e)}")
        raise 