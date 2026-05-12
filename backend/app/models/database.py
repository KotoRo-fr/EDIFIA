"""Modèles SQLAlchemy pour PostgreSQL — EDIFIA."""

import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# ---------------------------------------------------------------------------
# Configuration DB — via variable d'environnement
# ---------------------------------------------------------------------------
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://edifia:edifia@localhost:5432/edifia"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()





# ---------------------------------------------------------------------------
# Modèles
# ---------------------------------------------------------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="owner")
    is_verified = Column(String, default="true")
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    project_type = Column(String, nullable=False)
    status = Column(String, default="draft")
    parcel_address = Column(String)
    parcel_cadastre_id = Column(String)
    surface_approx = Column(Float)
    commune_code = Column(String)
    commune_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    rooms = relationship("Room", back_populates="project", cascade="all, delete-orphan")
    compliance_checks = relationship("ComplianceCheck", back_populates="project", cascade="all, delete-orphan")
    site_intel = relationship("SiteIntel", back_populates="project", uselist=False, cascade="all, delete-orphan")
    evaluations = relationship("ComplianceEvaluation", back_populates="project", cascade="all, delete-orphan")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    room_type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    surface = Column(Float, nullable=False)
    orientation = Column(String)
    priority = Column(Integer, default=1)
    adjacency = Column(JSON)

    project = relationship("Project", back_populates="rooms")


class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    rule_code = Column(String, nullable=False)
    rule_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, nullable=False)
    message = Column(Text)
    severity = Column(String)
    evaluated_values = Column(JSON)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="compliance_checks")


class ComplianceEvaluation(Base):
    __tablename__ = "compliance_evaluations"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    evaluated_at = Column(DateTime, default=datetime.utcnow)
    total_rules = Column(Integer, default=0)
    passed = Column(Integer, default=0)
    failed = Column(Integer, default=0)
    warnings = Column(Integer, default=0)
    not_applicable = Column(Integer, default=0)
    compliance_rate = Column(Float, default=0.0)
    blocking_issues = Column(JSON)
    results = Column(JSON)

    project = relationship("Project", back_populates="evaluations")


class SiteIntel(Base):
    __tablename__ = "site_intel"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False, unique=True)
    parcelle_surface = Column(Float)
    parcelle_cadastre_id = Column(String)
    parcelle_section = Column(String)
    parcelle_numero = Column(String)
    parcelle_lat = Column(Float)
    parcelle_lng = Column(Float)
    parcelle_geometry = Column(JSON)
    plu_zone = Column(String)
    plu_zone_libelle = Column(String)
    plu_cos = Column(Float)
    plu_hauteur_max = Column(Float)
    plu_recul_voie = Column(Float)
    plu_recul_lateral = Column(Float)
    plu_recul_fond = Column(Float)
    plu_emprise_max = Column(Float)
    plu_niveaux_max = Column(Integer)
    risque_gaspar = Column(JSON)
    risque_sismicite = Column(JSON)
    risque_inondation = Column(JSON)
    risque_radon = Column(JSON)
    risque_argile = Column(JSON)
    dvf_data = Column(JSON)
    raw_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="site_intel")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_db():
    """Générateur de session DB pour FastAPI Depends."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Crée toutes les tables."""
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Supprime toutes les tables."""
    Base.metadata.drop_all(bind=engine)
