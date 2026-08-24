from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gene = Column(String)
    mutation = Column(String)
    risk_level = Column(String)
    pathogenicity = Column(String)
    clinical_summary = Column(String)
    sensitive_therapies = Column(JSON)
    resistant_therapies = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Simulation(Base):
    __tablename__ = "simulations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gene = Column(String)
    mutation = Column(String)
    drug = Column(String)
    patient_id = Column(String)
    trajectory_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Strategy(Base):
    __tablename__ = "strategies"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    indication = Column(String)
    variant = Column(String)
    strategy_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class BBBAnalysis(Base):
    __tablename__ = "bbb_analyses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    indication = Column(String)
    drugA = Column(String)
    drugB = Column(String)
    results = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
