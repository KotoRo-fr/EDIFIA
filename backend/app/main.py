"""EDIFIA FastAPI Backend Application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.compliance_v2 import router as compliance_router
from routers.site_intel_v2 import router as site_intel_router
from routers.programming import router as programming_router
from routers.design import router as design_router
from routers.deliverables import router as deliverables_router

app = FastAPI(
    title="EDIFIA API",
    description="API backend pour la plateforme EDIFIA - Conformite et Site Intelligence",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(compliance_router)
app.include_router(site_intel_router)
app.include_router(programming_router)
app.include_router(design_router)
app.include_router(deliverables_router, prefix="/api/v2")


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "version": "2.0.0"}


@app.get("/", tags=["Root"])
def root():
    """Root endpoint."""
    return {
        "message": "EDIFIA API v2",
        "docs": "/docs",
        "version": "2.0.0",
    }
