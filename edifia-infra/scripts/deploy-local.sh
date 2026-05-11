#!/bin/bash
# ============================================================
# EDIFIA — Script de deploiement local (docker-compose)
# ============================================================
set -euo pipefail

# Repertoire racine du projet
cd "$(dirname "$0")/.."
PROJECT_ROOT="$(pwd)"

echo "=========================================="
echo "  EDIFIA — Local Deployment"
echo "=========================================="
echo ""

# Verifier les prerequis
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "ERREUR: '$1' n'est pas installe."
        exit 1
    fi
}

echo "Checking prerequisites..."
check_command docker
check_command docker-compose
echo "  OK"
echo ""

# Lancer les services
echo "Starting EDIFIA services..."
echo ""

docker-compose -f docker/docker-compose.yml up -d --build

echo ""
echo "Waiting for services to be ready..."
sleep 10

echo ""
echo "=========================================="
echo "  EDIFIA Services are running!"
echo "=========================================="
echo ""
echo "Services disponibles:"
echo "  Frontend:     http://localhost"
echo "  Backend API:  http://localhost:8000"
echo "  API Docs:     http://localhost:8000/docs"
echo "  Health:       http://localhost:8000/health"
echo ""
echo "Monitoring:"
echo "  Prometheus:   http://localhost:9090"
echo "  Grafana:      http://localhost:3000"
echo "    Login:      admin / admin123"
echo ""
echo "Database:"
echo "  PostgreSQL:   localhost:5432"
echo "  Redis:        localhost:6379"
echo ""
echo "Commands:"
echo "  Logs:        docker-compose -f docker/docker-compose.yml logs -f"
echo "  Stop:        docker-compose -f docker/docker-compose.yml down"
echo "  Stop+data:   docker-compose -f docker/docker-compose.yml down -v"
echo ""

# Afficher le statut des containers
echo "Container status:"
docker-compose -f docker/docker-compose.yml ps
