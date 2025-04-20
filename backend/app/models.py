from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserPlan(str, enum.Enum):
    FREE = "Free"
    PROFESSIONAL = "Professional"
    ENTERPRISE = "Enterprise"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    plan = Column(Enum(UserPlan), default=UserPlan.FREE)
    region = Column(String)
    monthly_project_limit = Column(Integer, default=2)
    monthly_projects_used = Column(Integer, default=0)
    api_key = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MaterialCost(Base):
    __tablename__ = "material_costs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    unit = Column(String)  # e.g., "m2", "piece"
    unit_cost = Column(Float)
    region = Column(String)
    category = Column(String)  # e.g., "Afwerking", "Bouwschil", "Ruwbouw"
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LaborCost(Base):
    __tablename__ = "labor_costs"

    id = Column(Integer, primary_key=True, index=True)
    trade = Column(String, index=True)  # e.g., "Carpenter", "Electrician"
    hourly_rate = Column(Float)
    region = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EquipmentCost(Base):
    __tablename__ = "equipment_costs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    daily_rate = Column(Float)
    region = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class IndirectCost(Base):
    __tablename__ = "indirect_costs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    percentage = Column(Float)  # Percentage of total direct costs
    region = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    total_cost = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="projects")

# Add relationship to User model
User.projects = relationship("Project", back_populates="user") 