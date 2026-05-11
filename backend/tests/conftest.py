"""Configuration pytest pour les tests backend EDIFIA."""

import pytest
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent.parent / "app"))
