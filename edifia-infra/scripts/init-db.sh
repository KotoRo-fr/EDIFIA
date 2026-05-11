#!/bin/bash
# ============================================================
# EDIFIA — Script d'initialisation de la base de donnees
# ============================================================
set -euo pipefail

echo "=========================================="
echo "  EDIFIA — Initialisation de la base"
echo "=========================================="

# Variables
DB_HOST="${DB_HOST:-postgres}"
DB_USER="${DB_USER:-edifia}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-edifia}"

if [ -z "$DB_PASSWORD" ]; then
    echo "ERREUR: La variable DB_PASSWORD n'est pas definie."
    echo "Usage: DB_PASSWORD=motdepasse ./scripts/init-db.sh"
    exit 1
fi

echo "Creating EDIFIA database..."
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo "Database: $DB_NAME"

# Attendre que PostgreSQL soit disponible
echo "Waiting for PostgreSQL..."
until PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "\q" 2>/dev/null; do
    echo "PostgreSQL is not ready yet. Retrying in 2s..."
    sleep 2
done
echo "PostgreSQL is ready!"

# Creer la base de donnees si elle n'existe pas
echo "Creating database '$DB_NAME' (if not exists)..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

# Activer les extensions PostGIS
echo "Enabling PostGIS extension..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Activer uuid-ossp
echo "Enabling uuid-ossp extension..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Verifier les extensions
echo ""
echo "Installed extensions:"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "\dx"

echo ""
echo "=========================================="
echo "  Database initialized successfully!"
echo "=========================================="
