"""
Package parser du DSL Réglementaire EDIFIA.
"""

from parser.yaml_parser import parse_rule_directory, parse_rule_file

__all__ = ["parse_rule_file", "parse_rule_directory"]
