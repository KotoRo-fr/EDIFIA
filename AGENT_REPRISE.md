# EDIFIA — Document de Reprise pour Agent Futur

> Ce document permet a n'importe quel agent de reprendre le projet sans perte d'information.
> Derniere mise a jour : 12 Mai 2026 — Sprint 1 termine, Sprint 2 en cours.

---

## 1. Contexte Projet

**EDIFIA** = plateforme "Prompt-to-Building" qui transforme un prompt utilisateur en dossier de permis de construire complet.
- Landing → Login → Dashboard → Projet → Programmation → Conception → Conformité → Livrables
- Stack : React 19 + TypeScript + Tailwind + shadcn/ui (frontend) | FastAPI + Python (backend) | DSL YAML (regles)

---

## 2. Etat Actuel (Sprint 2 = TERMINE)

### Frontend (DEPLOYE)
- **URL** : https://nhk3mqkjz52uk.kimi.page
- **Pages fonctionnelles** (12) : Landing, Login, Dashboard, Projet+Timeline, Programmation, Conception (comparateur+2D+3D), Conformite, Site Intelligence, Livrables
- **API client** : `src/lib/api-client.ts` avec fallback vers les mocks si backend indisponible
- **Build** : 0 erreur TypeScript, bundle ~780KB

### Backend (OPERATIONNEL)
- FastAPI + Uvicorn sur port 8000
- **Routers v2** : `/api/v2/compliance/`, `/api/v2/site/`
- **Endpoints** : evaluate, report, list rules, rule detail, geocode, site intel, PLU
- **Services** : cache (memoire), geocodage BAN (mock), PLU (10 communes), foncier
- **Tests API** : 37/37 PASS (pytest)

### DSL (OPERATIONNEL)
- **Moteur complet** : models, parser YAML, engine (operators, resolver, registry, compliance engine)
- **Regles** : 50+ regles YAML actives (urbanisme, DTU, RE2020, PMR, incendie)
- **Evaluation** : deterministe end-to-end (projet → regles → resultat)
- **Tests** : 86/86 PASS (pytest)
- **Reporters** : JSON + HTML

### Infrastructure
- Docker/K8s configs dans `edifia-infra/`
- Playwright e2e (5 specs)

---

## 3. Backlog — Ce qui reste a faire

### Sprint 2 (TERMINE) ✅
- [x] Integrer DSL YAML dans FastAPI (`dsl_integration.py`)
- [x] Router conformite v2 (`compliance_v2.py`) : POST evaluate, GET report, GET rules
- [x] Router site intelligence v2 (`site_intel_v2.py`) : GET geocode, GET intel, GET plu
- [x] Service geocodage BAN (`geocoding_service.py`) — mock
- [x] Service PLU (`plu_service.py`) — 10 communes pilotes
- [x] Service foncier (`foncier_service.py`) — cadastre, risques
- [x] Cache (`cache_service.py`) — memoire (placeholder Redis)
- [x] Connecter frontend au backend avec fallback
- [x] Tests API 37/37 PASS
- [x] Doc API (`docs/API_DOCUMENTATION.md`)

### Sprint 3 (A VENIR) — Moteur Reglementaire Avance
- [ ] Solver parametric complet (6 algorithmes)
- [ ] Generation automatique des variants architecturaux
- [ ] Moteur de conformite avec 6000+ regles
- [ ] Audit trail complet (DB PostgreSQL)
- [ ] Base de donnees reelle (projets, utilisateurs, evaluations)
- [ ] Auth JWT (remplacer le mock)

### Sprint 4 (A VENIR) — Livraison Finale
- [ ] Generation PDF cote serveur (CERFA, notices, rapports)
- [ ] Integration cartographique IGN (LIDAR, cadastre)
- [ ] Workflow multi-utilisateurs
- [ ] Cache Redis reel

### Sprint 5 (A VENIR) — Polish
- [ ] Internationalisation FR/EN/ES
- [ ] Optimisation mobile (code-splitting Three.js)
- [ ] Monitoring (Prometheus/Grafana)
- [ ] Tests E2E Playwright complets

### Sprint 3 — Moteur Reglementaire Avance
- [ ] Solver parametric complet (6 algorithmes)
- [ ] Generation automatique des variants architecturaux
- [ ] Moteur de conformite avec 6000+ regles
- [ ] Audit trail complet

### Sprint 4 — Livraison Finale
- [ ] Generation PDF cote serveur (CERFA, notices, rapports)
- [ ] Integration cartographique IGN (LIDAR, cadastre)
- [ ] Workflow multi-utilisateurs

### Sprint 5 — Polish
- [ ] Internationalisation FR/EN/ES
- [ ] Optimisation mobile (code-splitting Three.js)
- [ ] Monitoring (Prometheus/Grafana)

---

## 4. Architecture Technique

### Frontend
```
src/
  pages/           — 12 pages React (une par route)
  components/      — Composants partages (Navbar, Footer, Layout, Sidebar)
  components/ui/   — 40+ composants shadcn/ui
  components/viewers/ — Plan2DViewer, VariantComparison, Viewer3D (Three.js)
  lib/             — Utils, auth, solver, api
  lib/solver/      — Moteur de conception (6 algorithmes)
  mocks/           — Donnees mock (complianceData, projectData)
  hooks/           — Hooks custom (use-mobile)
  types/           — Types TypeScript
```

### Backend (a construire)
```
backend/
  app/
    main.py              — Point d'entree FastAPI
    dsl_integration.py   — Integration DSL (NOUVEAU S2)
    services/            — Services metier (NOUVEAU S2)
      cache_service.py
      geocoding_service.py
      plu_service.py
      foncier_service.py
      site_intel_service.py
    routers/             — Endpoints API (NOUVEAU S2)
      compliance_v2.py
      site_intel_v2.py
    models/              — Modeles Pydantic
  edifia-dsl/            — Regles YAML (deja existe)
    rules/urbanisme/
    rules/dtu/
    rules/re2020/
    rules/pmr/
    rules/incendie/
```

### DSL (deja existe)
- 70+ regles YAML avec format : `rule_code`, `name`, `category`, `applies_when`, `check`, `severity`
- Parseur Python dans `edifia-dsl/`
- Tests unitaires passes

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

# Backend (a creer dans backend/)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Tests e2e
npx playwright test

# Docker (optionnel)
docker-compose -f edifia-infra/docker/docker-compose.yml up
```

---

## 6. API Spec (v2 — Sprint 2)

### Conformite
- `POST /api/v2/compliance/evaluate/{project_id}` — Lance evaluation
- `GET /api/v2/compliance/report/{project_id}` — Rapport derniere evaluation
- `GET /api/v2/compliance/rules` — Liste regles (filtres: category, zone, page)
- `GET /api/v2/compliance/rules/{rule_code}` — Detail regle

### Site Intelligence
- `GET /api/v2/site/geocode?address={address}` — Geocodage
- `GET /api/v2/site/intel/{project_id}` — Donnees terrain aggregees
- `GET /api/v2/site/plu/{commune_code}` — Regles PLU commune

---

## 7. Points d'Attention

1. **Frontend utilise HashRouter** (`react-router` avec `<HashRouter>`) — necessaire pour deploiement statique
2. **Three.js est lourd** (1.56MB) — code-splitting recommande pour V2
3. **Donnees mock a remplacer** — Tout le frontend utilise des donnees statiques dans `src/mocks/`
4. **Auth est mock** — Connexion automatique sans veritable backend
5. **CERFA est HTML print-ready** — Pas de PDF genere cote serveur (Sprint 4)
6. **Pas de base de donnees** — Tout est en memoire/mock (Sprint 2+ pourra utiliser SQLite)

---

## 8. Ressources

- **Repo** : https://github.com/KotoRo-fr/EDIFIA
- **Spec Sprint 2** : `docs/SPEC_SPRINT2.md`
- **Spec Sprint 3** : `docs/SPEC_SPRINT3.md`
- **Equipe IA** : `docs/EDIFIA_EQUIPE_IA_SYNTHESIS.md`
- **Architecture** : `docs/architecture_cible.md`
- **Test Report S1** : `docs/TEST_REPORT.md`

---

## 9. Checklist pour Reprise

- [ ] Cloner le repo
- [ ] Lire ce document (AGENT_REPRISE.md)
- [ ] Lire la spec du sprint en cours (docs/SPEC_SPRINT*.md)
- [ ] Verifier npm install + npm run build passe
- [ ] Verifier la structure des dossiers
- [ ] Ne JAMAIS modifier directement dans /mnt/agents/output/app/ sans commit
- [ ] Toujours push sur GitHub apres chaque session
