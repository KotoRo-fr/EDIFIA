from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ComplianceEvaluateRequest(BaseModel):
    variant_id: Optional[str] = None


class ComplianceEvaluateResponse(BaseModel):
    project_id: str
    variant_id: Optional[str]
    evaluated_at: str
    summary: dict
    results: list[dict]
    blocking_issues: list[dict]


class ComplianceRuleResponse(BaseModel):
    code: str
    name: str
    category: str
    severity: str
    description: str
    source_document: str
    source_article: str


class SiteIntelGeocodeResponse(BaseModel):
    address: str
    coordinates: dict  # {"lat": float, "lng": float}
    parcelle: dict
    commune: dict


class SiteIntelDataResponse(BaseModel):
    project_id: str
    parcelle: dict
    plu: dict
    risques: dict
    raw_data: dict
