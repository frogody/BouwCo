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
    This is a DEMO version that returns simulated cost data.
    
    Args:
        components: List of detected components from AI analysis
        region: Region code for cost lookup (not used in demo)
        
    Returns:
        Dictionary containing cost breakdown and total
    """
    try:
        breakdown = []
        total_direct_cost = 0.0
        
        # Cost rates for demo ($ per square unit)
        cost_rates = {
            "wall": {"material": 95, "labor": 45, "equipment": 0},
            "floor": {"material": 65, "labor": 30, "equipment": 5},
            "window": {"material": 350, "labor": 120, "equipment": 0},
            "door": {"material": 250, "labor": 85, "equipment": 0},
            "kitchen": {"material": 450, "labor": 200, "equipment": 10},
            "bathroom": {"material": 550, "labor": 250, "equipment": 15},
            "ceiling": {"material": 45, "labor": 35, "equipment": 0},
            "roof": {"material": 120, "labor": 65, "equipment": 10},
        }
        
        # Process each detected component
        for component in components:
            component_type = component["type"]
            dimensions = component.get("dimensions", {})
            
            # Skip non-physical components
            if component_type == "text_annotation":
                continue
                
            # Calculate area if not provided
            area = dimensions.get("area", dimensions.get("width", 1.0) * dimensions.get("height", 1.0))
            
            # Get cost rates or use defaults
            rates = cost_rates.get(component_type, {"material": 100, "labor": 50, "equipment": 5})
            
            # Calculate costs
            material_cost = rates["material"] * area / 10000  # Convert to reasonable numbers
            labor_cost = rates["labor"] * area / 10000
            equipment_cost = rates["equipment"] * area / 10000
            
            # Add some randomization
            material_cost *= random.uniform(0.9, 1.1)
            labor_cost *= random.uniform(0.9, 1.1)
            equipment_cost *= random.uniform(0.9, 1.1)
            
            # Calculate total for this component
            component_total = material_cost + labor_cost + equipment_cost
            total_direct_cost += component_total
            
            breakdown.append({
                "component": component_type,
                "quantity": 1,
                "area": round(area, 2),
                "material_cost": round(material_cost, 2),
                "labor_cost": round(labor_cost, 2),
                "equipment_cost": round(equipment_cost, 2),
                "total": round(component_total, 2)
            })
        
        # Calculate indirect costs
        indirect_cost_rate = 0.25  # 25% for demo
        indirect_costs = {
            "overhead": round(total_direct_cost * 0.10, 2),
            "profit": round(total_direct_cost * 0.08, 2),
            "contingency": round(total_direct_cost * 0.07, 2),
            "total": round(total_direct_cost * indirect_cost_rate, 2),
            "total_percentage": 25
        }
        
        # Prepare final result
        result = {
            "breakdown": breakdown,
            "direct_costs": {
                "total": round(total_direct_cost, 2)
            },
            "indirect_costs": indirect_costs,
            "total_cost": round(total_direct_cost + indirect_costs["total"], 2)
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Error calculating costs: {str(e)}")
        # Return an empty result for demo instead of raising
        return {
            "breakdown": [],
            "direct_costs": {"total": 0},
            "indirect_costs": {"total": 0, "total_percentage": 0},
            "total_cost": 0
        } 