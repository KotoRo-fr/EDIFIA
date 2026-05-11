"""
Resolveur de references pour le moteur de conformite EDIFIA.
"""

from __future__ import annotations

from typing import Any

from models.project_context import ProjectContext


def resolve_reference(ref: str, context: ProjectContext) -> Any:
    """Resout une reference de type 'variante.surface_au_sol' dans le contexte.

    Args:
        ref: Chemin de la reference, ex: "variante.surface_au_sol".
        context: Instance de ProjectContext.

    Returns:
        La valeur correspondante ou None si non trouvee.

    Raises:
        ValueError: Si la reference est mal formee ou si le champ est inconnu.
    """
    parts = ref.split(".")
    if len(parts) < 2:
        raise ValueError(
            f"Reference mal formee : '{ref}' — format attendu : 'objet.champ'"
        )

    obj_name = parts[0]
    attr_path = parts[1:]

    root = getattr(context, obj_name, None)
    if root is None:
        raise ValueError(
            f"Objet '{obj_name}' inconnue dans le contexte. Reference : '{ref}'"
        )

    current: Any = root
    for part in attr_path:
        if current is None:
            return None
        if isinstance(current, dict):
            current = current.get(part)
        else:
            current = getattr(current, part, None)

    return current
