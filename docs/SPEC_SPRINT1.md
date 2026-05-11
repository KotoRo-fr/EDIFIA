# EDIFIA — Sprint 1 : Fondations Techniques
## SPEC.md | Version 1.0 | 12 Mai 2026

---

## 1. Objectif du Sprint

Poser les fondations techniques de la plateforme EDIFIA : architecture de code, modele de donnees, authentification, infrastructure conteneurisée, monitoring, et le DSL réglementaire (format des 6000 regles de conformite).

**Livrables concrets** : Code source fonctionnel (frontend + backend), fichiers d'infrastructure, documentation technique.

**Contrainte sandbox** : Le backend FastAPI est produit comme code source référence (pas de serveur en écoute). Le frontend React est entièrement fonctionnel avec mock data.

---

## 2. Architecture Sprint 1 (Modules)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPRINT 1 — FONDATIONS                        │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│   MODULE A   │   MODULE B   │   MODULE C   │     MODULE D       │
│   Backend    │   Frontend   │   DSL Reg    │     Infra/Ops      │
│   (FastAPI)  │   (React)    │   (Python)   │   (Docker/K8s)     │
├──────────────┼──────────────┼──────────────┼────────────────────┤
│ - API v1     │ - Dashboard  │ - Parser     │ - Dockerfiles      │
│ - Models     │ - Auth UI    │ - Validator  │ - docker-compose   │
│ - Auth JWT   │ - Onboarding │ - Rule       │ - K8s manifests    │
│ - Pydantic   │ - Timeline   │   engine     │ - Prometheus/GF    │
│ - Schemas    │ - Brief form │ - 50 regles  │ - CI/CD config     │
└──────────────┴──────────────┴──────────────┴────────────────────┘
```

---

## 3. Module A : Backend API (FastAPI)

### 3.1 Structure
```
edifia-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Point d'entree FastAPI
│   ├── config.py               # Configuration (env vars, settings)
│   ├── database.py             # Connexion PostgreSQL + PostGIS
│   ├── dependencies.py         # Dependencies injectables (DB, auth)
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py             # Utilisateur, profil, RBAC
│   │   ├── project.py          # Projet, parcelle, brief
│   │   ├── compliance.py       # Regles, validations, audit trail
│   │   └── site_intel.py       # Donnees foncieres, PLU
│   ├── schemas/                # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── brief.py
│   │   └── compliance.py
│   ├── routers/                # Endpoints API
│   │   ├── __init__.py
│   │   ├── auth.py             # /auth/* JWT + OAuth
│   │   ├── users.py            # /users/* CRUD profil
│   │   ├── projects.py         # /projects/* CRUD projet
│   │   ├── brief.py            # /brief/* saisie brief
│   │   ├── site_intel.py       # /site/* analyse terrain
│   │   └── compliance.py       # /compliance/* moteur regles
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py     # JWT, hashing, RBAC
│   │   ├── project_service.py  # Logique projet
│   │   └── compliance_service.py
│   ├── core/                   # Core utilities
│   │   ├── __init__.py
│   │   ├── security.py         # Hashing mots de passe, JWT
│   │   └── exceptions.py       # Custom exceptions
│   └── dsl/                    # DSL Reglementaire (voir Module C)
│       ├── __init__.py
│       ├── parser.py
│       ├── engine.py
│       └── rules/
├── tests/
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_projects.py
│   └── test_compliance.py
├── alembic/                    # Migrations DB
├── Dockerfile
├── requirements.txt
└── pyproject.toml
```

### 3.2 Models principaux (SQLAlchemy)

**User**
- id (UUID, PK), email (unique), hashed_password, is_active, is_verified
- role (enum: owner, admin, compliance_officer), created_at, updated_at
- Relation: → Profile (1:1)

**Profile**
- id (UUID, PK), user_id (FK), first_name, last_name, phone
- address_line, postal_code, city, country (default FR)
- Chiffrement AES-256 sur les données sensibles

**Project**
- id (UUID, PK), user_id (FK), name, description
- project_type (enum: extension_under_40, mob_under_150, other)
- status (enum: draft, site_intel, programming, design, compliance, deliverables, submitted)
- parcel_address, parcel_cadastre_id, surface_approx, commune_code
- created_at, updated_at
- Relation: → Brief (1:1), → SiteIntel (1:1), → Variants (1:N), → ComplianceCheck (1:N)

**Brief**
- id (UUID, PK), project_id (FK), rooms (JSONB), constraints (JSONB)
- preferences (JSONB), budget_range, style_preference
- status (enum: draft, completed, validated)

**ComplianceRule** (Couche 6 - CRITIQUE)
- id (UUID, PK), rule_code (unique), name, description
- category (enum: urbanisme, dtu, re2020, pmr, incendie, structure)
- rule_definition (YAML/JSONB - DSL), source_document, article_ref
- commune_code (nullable - null = national), effective_date
- version, is_active, created_by, created_at
- Audit trail: qui a modifié quoi quand

**ComplianceCheck**
- id (UUID, PK), project_id (FK), variant_id (nullable)
- rule_code (FK), status (pass/fail/warning/not_applicable)
- details (JSONB - params évalués, valeurs comparées), evaluated_at

### 3.3 API Endpoints (v1)

**Auth** (`/api/v1/auth`)
- POST `/register` → 201 + JWT
- POST `/login` → 200 + JWT + refresh
- POST `/refresh` → 200 + nouveau JWT
- POST `/logout` → 204 (blacklist token)
- POST `/oauth/google` → 200 + JWT
- GET `/me` → 200 + user profile

**Users** (`/api/v1/users`)
- GET `/me` → 200 profil complet
- PUT `/me` → 200 update profil
- DELETE `/me` → 204 RGPD suppression

**Projects** (`/api/v1/projects`)
- GET `/` → 200 liste (pagination, filtres status)
- POST `/` → 201 création
- GET `/{id}` → 200 détail complet avec relations
- PUT `/{id}` → 200 modification
- DELETE `/{id}` → 204
- GET `/{id}/timeline` → 200 étapes + statuts

**Brief** (`/api/v1/brief`)
- POST `/` → 201 (crée ou met à jour)
- GET `/{project_id}` → 200
- POST `/{project_id}/validate` → 200 validation

**Site Intel** (`/api/v1/site`)
- GET `/geocode?address=` → 200 + parcelle cadastrale
- GET `/intel/{project_id}` → 200 données terrain agrégées
- GET `/plu/{commune_code}` → 200 règles PLU

**Compliance** (`/api/v1/compliance`)
- POST `/check/{project_id}` → 200 résultat évaluation
- GET `/rules` → 200 liste règles (pagination, filtres)
- GET `/rules/{rule_code}` → 200 détail règle
- GET `/audit/{project_id}` → 200 audit trail conformité

### 3.4 Stack & Dependances
- FastAPI 0.115+, Pydantic v2, SQLAlchemy 2.0+ (async)
- asyncpg (PostgreSQL async), GeoAlchemy2 (PostGIS)
- Passlib[bcrypt] (hashing), PyJWT, python-jose[cryptography]
- Alembic (migrations), pytest, httpx

---

## 4. Module B : Frontend (React SPA)

### 4.1 Structure
```
edifia-frontend/
├── public/
│   └── (assets)
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Router + providers
│   ├── index.css                   # Global styles + Tailwind
│   ├── lib/
│   │   ├── api.ts                  # Client HTTP (axios/fetch) + mocks
│   │   ├── auth.ts                 # Context auth, hooks JWT
│   │   └── utils.ts                # Utils divers
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── Navbar.tsx              # Navigation top
│   │   ├── Sidebar.tsx             # Menu latéral dashboard
│   │   ├── Footer.tsx              # Footer
│   │   ├── Layout.tsx              # Layout app (nav + sidebar + content)
│   │   ├── ProjectTimeline.tsx     # Timeline verticale projet
│   │   ├── ProjectCard.tsx         # Carte projet (liste)
│   │   ├── BriefBuilder.tsx        # Formulaire brief pieces
│   │   ├── SiteIntelPanel.tsx      # Panel données terrain
│   │   ├── ComplianceBadge.tsx     # Badge conformité
│   │   └── OnboardingWizard.tsx    # Wizard 3 questions
│   ├── pages/
│   │   ├── HomePage.tsx            # Landing page
│   │   ├── LoginPage.tsx           # Auth login/register
│   │   ├── DashboardPage.tsx       # Liste projets
│   │   ├── ProjectDetailPage.tsx   # Détail projet + timeline
│   │   ├── BriefPage.tsx           # Saisie brief
│   │   ├── SiteIntelPage.tsx       # Analyse terrain
│   │   └── SettingsPage.tsx        # Profil utilisateur
│   ├── types/
│   │   └── index.ts                # Types TypeScript
│   └── mocks/
│       └── data.ts                 # Mock data pour demo
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 4.2 Pages & Fonctionnalités

**HomePage** : Landing EDIFIA avec value prop, stats, CTA
**LoginPage** : Connexion email + Google (mock), inscription
**DashboardPage** : Liste projets, stats, bouton "Nouveau projet"
**ProjectDetailPage** : Timeline verticale (7 étapes), infos projet, actions
**BriefPage** : Formulaire pieces/contraintes, résumé, validation
**SiteIntelPage** : Carte parcelle, données PLU, risques, synthèse
**SettingsPage** : Profil, préférences, suppression compte

### 4.3 Design System
- **Palette** : Slate (fond) + Orange/Emerald accents (construction/conformité)
- **Typographie** : Inter (body) + Space Grotesk (titres tech)
- **Composants** : shadcn/ui (base) + custom EDIFIA
- **États projet** : draft(gray) → site_intel(blue) → programming(indigo) → design(violet) → compliance(amber) → deliverables(emerald) → submitted(green)

### 4.4 Mock Data
10 projets mock avec différents statuts, 1 projet complet (end-to-end) pour démo

---

## 5. Module C : DSL Réglementaire

### 5.1 Format YAML des règles
```yaml
rule:
  code: "URB-COS-001"
  name: "Coefficient d'Occupation du Sol"
  category: "urbanisme"
  description: "Vérifie que la surface au sol ne dépasse pas le COS autorisé"
  severity: "blocking"  # blocking, warning, info
  applicability:
    project_types: ["extension_under_40", "mob_under_150"]
    communes: []  # vide = toutes les communes
    zones: ["U", "AU", "A"]  # zones PLU concernées
  formula:
    type: "comparison"
    input:
      - name: "surface_au_sol"
        source: "variant.floor_area"
      - name: "cos_autorise"
        source: "plu.cos"
      - name: "surface_parcelle"
        source: "parcelle.area"
    operation: "lte"
    expression: "surface_au_sol <= cos_autorise * surface_parcelle"
  error_message:
    fr: "La surface au sol ({surface_au_sol}m²) dépasse le COS autorisé ({cos_max}m²)"
  source:
    document: "PLU"
    article: "Règlement graphique"
    reference: "COS"
  metadata:
    version: "1.0"
    created_by: "EDIFIA_Compliance_Engine"
    created_at: "2026-05-01"
```

### 5.2 Composants
- **Parser** : YAML → objet Python (validation schema)
- **Validator** : Vérifie la cohérence de la règle (champs obligatoires, types)
- **Engine** : Évalue une règle contre un projet + variante + données terrain
- **Registry** : Charge et indexe toutes les règles, recherche par projet/commune

### 5.3 50 règles initiales
- 10 règles urbanisme (COS, hauteur, reculs, emprise)
- 10 règles DTU (isolation, fondations, structure bois)
- 10 règles RE2020 (Bbio, TIC, Cep)
- 10 règles PMR (accessibilité, seuils, circulations)
- 10 règles sécurité incendie (désenfumage, issue, matériaux)

---

## 6. Module D : Infrastructure

### 6.1 Docker
- `Dockerfile.backend` : Python 3.12 slim, multi-stage
- `Dockerfile.frontend` : Node 20, build + nginx
- `docker-compose.yml` : Full stack local (backend + frontend + PostgreSQL + PostGIS + Redis)

### 6.2 Kubernetes (manifests)
- `namespace.yml`
- `configmap.yml` (variables d'environnement)
- `secret.yml` (mots de passe, clés JWT)
- `postgres-deployment.yml` + `pvc.yml`
- `backend-deployment.yml` + `service.yml` + `hpa.yml`
- `frontend-deployment.yml` + `service.yml`
- `ingress.yml` (nginx-ingress)
- `network-policy.yml` (isolation IA/déterministe)

### 6.3 Monitoring
- `prometheus.yml` : Config scrape targets
- `grafana-dashboards/` : Dashboards applicatifs (API, conformité, business)
- `alerting-rules.yml` : Alertes critiques (moteur conformité down, erreur rate > 5%)

### 6.4 CI/CD (GitLab CI)
- `.gitlab-ci.yml` : Build → Test → Security Scan → Deploy staging → Deploy prod

---

## 7. Interfaces entre modules

| Interface | Module A ↔ B | Module A ↔ C | Module A ↔ D |
|-----------|-------------|-------------|-------------|
| Format | REST API JSON | Import Python | Env vars / Config files |
| Contrat | OpenAPI 3.0 | `dsl/` package | YAML configs |
| Auth | JWT Bearer | - | K8s RBAC |

---

## 8. Definition of Done Sprint 1

- [ ] Backend : API v1 fonctionnelle (tests passent)
- [ ] Backend : Modèles de données avec migrations Alembic
- [ ] Backend : Auth JWT + RBAC implémentés
- [ ] Frontend : Toutes les pages codées avec mock data
- [ ] Frontend : Dashboard interactif avec timeline
- [ ] DSL : Parser + Engine + 50 règles encodées
- [ ] Infra : Docker + docker-compose fonctionnels
- [ ] Infra : Manifests K8s complets
- [ ] Infra : Prometheus + Grafana configurés
- [ ] Tests : Coverage > 80% backend
- [ ] Documentation : README + API docs (Swagger)
