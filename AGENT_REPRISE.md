# EDIFIA — Document de Reprise pour Agent Futur

> Ce document permet a n'importe quel agent de reprendre le projet sans perte d'information.
> Derniere mise a jour : 12 Mai 2026 — Sprints 1, 2, 3, 4 termines.

---

## 1. Contexte Projet

**EDIFIA** = plateforme "Prompt-to-Building" qui transforme un prompt utilisateur en dossier de permis de construire complet.
- Landing → Login → Dashboard → Projet → Programmation → Conception → Conformite → Livrables
- Stack : React 19 + TypeScript + Tailwind + shadcn/ui (frontend) | FastAPI + Python (backend) | DSL YAML (regles)

---

## 2. Etat Actuel (Sprint 4 = TERMINE)

### Frontend (DEPLOYE)
- **URL** : https://nhk3mqkjz52uk.kimi.page
- **Pages fonctionnelles** (12) : Landing, Login, Dashboard, Projet+Timeline, Programmation, Conception (comparateur+2D+3D), Conformite, Site Intelligence, Livrables
- **API client** : `src/lib/api-client.ts` avec fallback vers les solvers locaux si backend indisponible
- **Solvers locaux** (1534 lignes) : roomSolver, footprintGenerator, parametricSolver, variantGenerator
- **Composants livrables** : CerfaViewer, NoticeCalculViewer, RapportConformiteViewer, PlansViewer
- **Build** : 0 erreur TypeScript, bundle ~785KB

### Backend (OPERATIONNEL)
- FastAPI + Uvicorn sur port 8000
- **Routers v2** : `/api/v2/compliance/`, `/api/v2/site/`, `/api/v2/programming/`, `/api/v2/design/`, `/api/v2/deliverables/`
- **Endpoints** :
  - Compliance : evaluate, report, list rules, rule detail
  - Site Intel : geocode, site intel, PLU
  - Programming : generate programme, get programme
  - Design : generate variants, list variants, select variant
  - Deliverables : list documents, generate all, CERFA, notice, rapport, plans
- **Services** : cache (memoire), geocodage BAN (mock), PLU (10 communes), foncier
- **Tests API** : 84/84 PASS (pytest)

### DSL (OPERATIONNEL)
- **Moteur complet** : models, parser YAML, engine (operators, resolver, registry, compliance engine)
- **Regles** : 50+ regles YAML actives (urbanisme, DTU, RE2020, PMR, incendie)
- **Evaluation** : deterministe end-to-end (projet → regles → resultat)
- **Tests** : 86/86 PASS (pytest)
- **Reporters** : JSON + HTML

### Solvers TypeScript (1534 lignes)
- `roomSolver.ts` (217l) — Placement logique pieces, adjacences, ensoleillement, budget
- `footprintGenerator.ts` (61l) — Calcul emprise au sol depuis PLU
- `parametricSolver.ts` (785l) — Placement geometrique 2D (4 strategies)
- `variantGenerator.ts` (269l) — 4 strategies (surface/ensoleillement/cout/esthetique)

---

## 3. Backlog — Ce qui reste a faire

### Sprint 1 (TERMINE) ✅
- [x] Frontend complet (12 pages, 27k lignes)
- [x] Backend FastAPI (squelette)
- [x] DSL YAML (70+ regles)
- [x] Tests unitaires

### Sprint 2 (TERMINE) ✅
- [x] Moteur DSL operationnel (models, parser, engine, registry, compliance engine)
- [x] Routers compliance v2 + site intel v2
- [x] Services (cache, geocodage, PLU, foncier)
- [x] Client API frontend avec fallback
- [x] Tests API 37/37 PASS

### Sprint 3 (TERMINE) ✅
- [x] Routers programming + design
- [x] Frontend integration programming/design avec fallback
- [x] Solvers TypeScript locaux (room, footprint, parametric, variant)
- [x] Tests API 67/67 PASS

### Sprint 4 (TERMINE) ✅
- [x] Router deliverables (`deliverables.py`) : list documents, generate all, CERFA, notice, rapport, plans
- [x] Frontend deliverables connecte a l'API avec fallback
- [x] 4 viewers : CerfaViewer, NoticeCalculViewer, RapportConformiteViewer, PlansViewer
- [x] Tests API 84/84 PASS

### Sprint 5 (A VENIR) — Production & Infrastructure
- [ ] Generation PDF cote serveur (CERFA, notices, rapports) — WeasyPrint/Puppeteer
- [ ] Integration cartographique IGN (LIDAR, cadastre, geoportail)
- [ ] Base de donnees PostgreSQL (projets, utilisateurs, evaluations)
- [ ] Auth JWT (remplacer le mock actuel)
- [ ] Audit trail complet (historique evaluations, versions)
- [ ] Cache Redis reel (remplacer le dict en memoire)
- [ ] Workflow multi-utilisateurs (architecte, client, mairie)

### Sprint 5 (A VENIR) — Polish
- [ ] Internationalisation FR/EN/ES
- [ ] Optimisation mobile (code-splitting Three.js, lazy loading)
- [ ] Monitoring Prometheus/Grafana
- [ ] Tests E2E Playwright complets (> 20 specs)
- [ ] CI/CD GitHub Actions (build, test, deploy)

---

## 4. Architecture Technique

### Frontend
```
src/
  pages/           — 12 pages React (une par route)
  components/      — Composants partages (Navbar, Footer, Layout, Sidebar)
  components/ui/   — 40+ composants shadcn/ui
  components/viewers/ — Plan2DViewer, VariantComparison, Viewer3D (Three.js)
  lib/             — Utils, auth, solver, api, api-client
  lib/solver/      — Moteur de conception (6 algorithmes, 1534l)
  mocks/           — Donnees mock (complianceData, projectData)
  hooks/           — Hooks custom (use-mobile)
  types/           — Types TypeScript
```

### Backend
```
backend/
  app/
    main.py              — Point d'entree FastAPI
    dsl_integration.py   — Integration DSL
    models/schemas.py    — Modeles Pydantic
    routers/             — Endpoints API
      compliance_v2.py   — Evaluate, report, rules
      site_intel_v2.py   — Geocode, intel, PLU
      programming.py     — Generate programme, get programme
      design.py          — Generate variants, list, select
    services/            — Services metier
      cache_service.py
      geocoding_service.py
      plu_service.py
      foncier_service.py
    tests/               — 67 tests pytest
```

### DSL
```
edifia-dsl/
  models/              — Rule, ProjectContext, etc.
  parser/              — Parseur YAML
  engine/              — Operators, resolver, registry, compliance engine
  reporters/           — JSON + HTML
  rules/               — 50+ regles YAML
  tests/               — 86 tests pytest
```

---

## 5. Commands Utiles

```bash
# Cloner
git clone https://github.com/KotoRo-fr/EDIFIA.git
cd EDIFIA

# Frontend
npm install
npm run build          # Build production (vers dist/)
npm run dev            # Dev server

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Tests
python -m pytest backend/tests/ -v
npx playwright test

# Docker
docker-compose -f edifia-infra/docker/docker-compose.yml up
```

---

## 6. API Spec (v2)

### Conformite
- `POST /api/v2/compliance/evaluate/{project_id}` — Lance evaluation
- `GET /api/v2/compliance/report/{project_id}` — Rapport derniere evaluation
- `GET /api/v2/compliance/rules` — Liste regles (filtres: category, page)
- `GET /api/v2/compliance/rules/{rule_code}` — Detail regle

### Site Intelligence
- `GET /api/v2/site/geocode?address={address}` — Geocodage
- `GET /api/v2/site/intel/{project_id}` — Donnees terrain aggregees
- `GET /api/v2/site/plu/{commune_code}` — Regles PLU commune

### Programmation
- `POST /api/v2/programming/generate/{project_id}` — Genere programme architectural
- `GET /api/v2/programming/{project_id}` — Recupere programme

### Conception
- `POST /api/v2/design/generate/{project_id}` — Genere variantes (2-4)
- `GET /api/v2/design/{project_id}` — Liste variantes
- `POST /api/v2/design/select/{project_id}/{variant_id}` — Selectionne variante

### Livrables
- `GET /api/v2/deliverables/{project_id}` — Liste documents et status
- `POST /api/v2/deliverables/generate/{project_id}` — Genere tous les documents
- `GET /api/v2/deliverables/{project_id}/cerfa` — Donnees CERFA pre-remplies
- `GET /api/v2/deliverables/{project_id}/notice` — Notice de calcul
- `GET /api/v2/deliverables/{project_id}/rapport` — Rapport de conformite
- `GET /api/v2/deliverables/{project_id}/plans` — Plans architecturaux

---

## 7. Points d'Attention

1. **HashRouter** dans `main.tsx` — necessaire pour deploiement statique
2. **Three.js est lourd** (1.56MB) — code-splitting recommande pour V2
3. **API fallback** — Toutes les fonctions API ont un fallback vers les solvers locaux
4. **Auth est mock** — Connexion automatique sans veritable backend
5. **CERFA est HTML print-ready** — `window.print()` fonctionne, PDF serveur en V2 (Sprint 5)
6. **Cache est en memoire** — Placeholder pour Redis (Sprint 5)
7. **Pas de base de donnees** — Tout est en memoire/mock (Sprint 4)

---

## 8. Ressources

- **Repo** : https://github.com/KotoRo-fr/EDIFIA
- **Spec Sprint 2** : `docs/SPEC_SPRINT2.md`
- **Spec Sprint 3** : `docs/SPEC_SPRINT3.md`
- **Equipe IA** : `docs/EDIFIA_EQUIPE_IA_SYNTHESIS.md`
- **Architecture** : `docs/architecture_cible.md`
- **Test Report** : `docs/TEST_REPORT.md`

---

## 9. Checklist pour Reprise

- [ ] Cloner le repo
- [ ] Lire ce document (AGENT_REPRISE.md)
- [ ] Lire la spec du sprint en cours
- [ ] Verifier `npm install + npm run build` passe
- [ ] Verifier `cd backend && python -m pytest` passe
- [ ] Ne JAMAIS modifier sans commit
- [ ] Toujours push sur GitHub apres chaque session
