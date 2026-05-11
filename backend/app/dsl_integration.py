"""Integration du moteur DSL dans FastAPI."""
import sys
from pathlib import Path

# Add edifia-dsl to path
DSL_PATH = Path(__file__).parent.parent.parent / "edifia-dsl"
sys.path.insert(0, str(DSL_PATH))

from engine.registry import RulesRegistry
from engine.compliance_engine import ComplianceEngine
from models.project_context import ProjectContext, Parcelle, PLU, Variante, Batiment

# Singletons
_registry = None
_engine = None


def get_registry() -> RulesRegistry:
    global _registry
    if _registry is None:
        rules_dir = DSL_PATH / "rules"
        _registry = RulesRegistry.from_directory(rules_dir)
    return _registry


def get_engine() -> ComplianceEngine:
    global _engine
    if _engine is None:
        _engine = ComplianceEngine(get_registry())
    return _engine


def build_context(project_data: dict) -> ProjectContext:
    """Construit un ProjectContext depuis les donnees projet."""
    return ProjectContext(
        parcelle=Parcelle(**project_data["parcelle"]),
        plu=PLU(**project_data["plu"]),
        variante=Variante(**project_data["variante"]),
        batiment=Batiment(**project_data["batiment"]),
        project_type=project_data["project_type"],
    )
