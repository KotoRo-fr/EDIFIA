"""
Résolveur de références pour le moteur de conformité EDIFIA.

Permet de résoudre les chemins de type "variante.surface_au_sol" dans
le contexte projet pour obtenir les valeurs associées.
"""

from __future__ import annotations

from typing import Any

from models.project_context import ProjectContext


def resolve_reference(ref: str, context: ProjectContext) -> Any:
    """Résout une référence de type 'variante.surface_au_sol' dans le contexte.

    Args:
        ref: Chemin de la référence, ex: "variante.surface_au_sol",
             "plu.cos_max", "parcelle.zone", "parcelle.setbacks.front".
        context: Instance de ProjectContext contenant les données.

    Returns:
        La valeur correspondante ou None si non trouvée.

    Raises:
        ValueError: Si la référence est mal formée ou si le champ est inconnu.
    """
    parts = ref.split(".")
    if len(parts) < 2:
        raise ValueError(
            f"Référence mal formée : '{ref}' — format attendu : 'objet.champ[.sous_champ]'"
        )

    obj_name = parts[0]
    attr_path = parts[1:]

    # Récupère l'objet racine
    root = getattr(context, obj_name, None)
    if root is None:
        raise ValueError(
            f"Objet '{obj_name}' inconnu dans le contexte. "
            f"Référence : '{ref}'"
        )

    # Navigue dans les sous-attributs
    current: Any = root
    for part in attr_path:
        if current is None:
            return None
        if isinstance(current, dict):
            current = current.get(part)
        else:
            current = getattr(current, part, None)

    return current
