# EDIFIA — EQUIPE IA COMPLETE
## Structure de developpement Full IA Team | Pret au demarrage

**Version:** 1.0 | **Date:** Mai 2026 | **Statut:** Operationnel — Pret a l'emploi

---

## Vue d'ensemble

L'equipe IA EDIFIA est constituee de **14 agents specialises** repartis en **4 piliers** , couvrant l'integralite du spectre : strategie, experience utilisateur, moteur technique et operations. Chaque agent possede des responsabilites definies, des livrables attendus, des KPIs de performance et des niveaux de decision clairement etablis.

> **Chiffres cles de l'equipe :**
> - 14 agents | 4 piliers | 52 epics V1 | 12 ADR architecturaux
> - Couverture complete : du brief multimodal au CERFA de mairie
> - 5 risques mortels géres activement | 0 compromis sur la conformite

---

## L'equipe en 1 page

```
                           E D I F I A
                    Equipe IA — 14 Agents / 4 Piliers
                          |
       ┌──────────┬───────┼────────┬──────────┐
       ▼          ▼       ▼        ▼          │
  ┌─────────┐ ┌────────┐ ┌───────────┐ ┌────────────┐
  │PILIER   │ │PILIER  │ │PILIER     │ │PILIER      │
  │STRATEGIE│ │EXPERI- │ │MOTEUR     │ │OPERATIONS  │
  │ 3 Agent │ │ENCE    │ │ 5 Agents  │ │ 4 Agents   │
  │         │ │ 3 Agent│ │           │ │            │
  │CTO      │ │UX Lead │ │Backend Ld │ │DevOps/SRE  │
  │Product  │ │Front   │ │Geom.Solver│ │QA Lead     │
  │ Owner   │ │Dev     │ │Compliance │ │Security Ld │
  │Legal    │ │Content │ │BIM Spec.  │ │Documen-    │
  │ Risk    │ │Design. │ │Data AI    │ │tation      │
  └────┬────┘ └───┬────┘ └─────┬─────┘ └─────┬──────┘
       │          │            │             │
       └──────────┴────────────┴─────────────┘
                          |
                   ┌──────┴──────┐
                   │  LIVRABLES  │
                   │  CERFA 4K   │
                   │ BIM IFC PCMI│
                   └─────────────┘
```

---

## Les 14 Agents — Fiches synthetiques

### PILIER STRATEGIE (Direction & Gouvernance)

| Agent | Mission | Decision | KPI principal |
|-------|---------|----------|---------------|
| **EDIFIA_CTO** | Vision technique transversale, arbitrage stack, coherence 12 couches | Strategique | Dette technique < 15%, ADR respectes a 100% |
| **EDIFIA_Product_Owner** | Roadmap, priorisation, scope V1 impitoyable | Strategique | 10 PC deposes / 5+ acceptes en an 1 |
| **EDIFIA_Legal_Risk** | Conformite reglementaire, protection juridique, veille Ordre des Architectes | Strategique (Veto) | 0 contestation legale, 100% livrables conformes |

### PILIER EXPERIENCE (Utilisateur & Interfaces)

| Agent | Mission | Decision | KPI principal |
|-------|---------|----------|---------------|
| **EDIFIA_UX_Lead** | Parcours utilisateur, wireframes, recherche, accessibilite | Tactique | Taux completion > 60%, NPS > 40 |
| **EDIFIA_Frontend_Dev** | Interfaces web/mobile, composants, performance front | Operationnel | Lighthouse > 90, TTI < 2s |
| **EDIFIA_Content_Designer** | Copy, micro-copy, ton EDIFIA, documentation utilisateur | Operationnel | Clarte score > 4.5/5 |

### PILIER MOTEUR (Coeur Technique)

| Agent | Mission | Decision | KPI principal |
|-------|---------|----------|---------------|
| **EDIFIA_Backend_Lead** | APIs, base de donnees, orchestration services, scalabilite | Tactique | Uptime > 99.9%, Latence API P95 < 200ms |
| **EDIFIA_Geometric_Solver** | Solveur parametrique, generation variants, contraintes spatiales | Tactique | Fiabilite geometrique > 99.5% |
| **EDIFIA_Compliance_Engine** | Moteur 6000 regles deterministe — **ZERO LLM** | Tactique (Veto) | Taux conformite PLU > 95%, 0 erreur reglementaire |
| **EDIFIA_BIM_Specialist** | Generation IFC, plans 2D/3D, rendus 4K, CERFA | Tactique | Precision IFC 100%, rendu < 5min |
| **EDIFIA_Data_AI** | LLM, ingestion donnees foncieres, ML pipelines | Tactique | Hallucination rate < 1%, Couverture donnees > 90% |

### PILIER OPERATIONS (Qualite & Infrastructure)

| Agent | Mission | Decision | KPI principal |
|-------|---------|----------|---------------|
| **EDIFIA_DevOps_SRE** | CI/CD, Kubernetes, scaling, souverainete Scaleway | Tactique | RTO < 30min, Deploiement < 15min |
| **EDIFIA_QA_Lead** | Tests, validation conformite, non-regression | Operationnel | Couverture tests > 85%, 0 bug P0 en production |
| **EDIFIA_Security_Lead** | Securite, RGPD, chiffrement, audits | Strategique (Veto) | 0 incident securite, 100% conformite RGPD |
| **EDIFIA_Documentation** | Docs techniques, utilisateur, reglementaire, API | Operationnel | Documentation a jour < 48h apres merge |

---

## Matrice RACI — 12 Couches EDIFIA x 14 Agents (extrait)

| Couche | CTO | PO | Legal | UX | Front | Content | Back | Geo | Comp | BIM | AI | DevOps | QA | Sec | Doc |
|--------|:---:|:--:|:-----:|:--:|:-----:|:-------:|:----:|:---:|:----:|:---:|:--:|:------:|:--:|:---:|:---:|
| 1-Brief | C | A | I | R | C | C | I | I | I | I | R | I | C | I | C |
| 2-Site Intel | C | I | A | I | I | I | C | I | C | I | R | C | C | C | I |
| 4-Programmation | A | R | I | C | I | I | C | R | C | I | C | I | C | I | I |
| 5-Conception | A | R | I | C | C | I | C | R | C | C | C | I | C | I | I |
| 6-**Conformite** | C | I | **A** | I | I | I | C | I | **R** | I | **I** | I | **C** | **C** | C |
| 10-Livrables | C | R | A | C | C | C | C | I | C | R | I | I | C | I | C |

> **Legende :** R = Responsible | A = Accountable | C = Consulted | I = Informed
> **Veto Conformite :** Compliance_Engine + Legal_Risk + Security_Led ont un veto absolu sur tout livrable touchant a la couche 6.

---

## Architecture Technique en 4 points

### 1. Separation IA / Deterministe (critique)
- **Couche 6 (Conformite)** : 100% deterministe, moteur CSP, zero LLM
- **Barrieres physiques** : Services separes, NetworkPolicy Kubernetes, pas d'appel synchrone IA→Deterministe
- **Audit trail immuable** : Chaque decision de conformite est tracee avec la regle, la source, la date

### 2. Stack technologique V1

| Domaine | Choix principal | Justification |
|---------|-----------------|---------------|
| Backend API | FastAPI (Python) | Performance, auto-doc OpenAPI, ecosystem Python scientifique |
| Solveur geometrique | Open CASCADE (PythonOCC) | Kernel BRep mature, LGPL, industrie standard |
| Moteur conformite | Moteur CSP custom + YAML regles | Deterministe, auditable, versionne dans Git |
| BIM / IFC | IfcOpenShell + BlenderBIM | Open source, ISO 16739, perennite |
| Base de donnees | PostgreSQL + PostGIS + JSONB | Relations + geospatial + documents flexibles |
| Cache / Queue | Redis + Apache Kafka | Performance temps reel + event-driven |
| IA / LLM | vLLM (self-hosted) + Mistral/Llama | Souverainete, controle couts, zero fuite donnees |
| Frontend | Next.js + TypeScript + Tailwind | SSR, performance, DX |
| Mobile | React Native + ARKit (LIDAR) | Cross-platform, scan 3D natif |
| DevOps | Kubernetes (Scaleway) + GitLab CI + ArgoCD | Souverainete EU, GitOps, scaling |
| Monitoring | Prometheus + Grafana + Loki | Observabilite complete |
| Securite | Keycloak (OAuth2/RBAC) + Vault | Auth enterprise, secrets management |

### 3. Modele de donnees cles
```
Projet → Parcelle → Brief → Programme → Variante(n) → [Conformite Check] → Livrable
  ↓          ↓         ↓         ↓          ↓               ↓                ↓
Client   PLU/IGN   Texte/   Surfaces   BIM/IFC    Pass/Fail +    CERFA + Plans
id_user  cadastre  Photos   pieces    variants   Regles violees  Notice + 3D
```

### 4. Infrastructure cible (cout mensuel V1 : ~1 770 EUR)
- **Scaleway** : Kubernetes Kapsule, PostgreSQL RDB, Redis, Object Storage
- **Haute disponibilite** : RPO 5min / RTO 30min
- **Scaling** : Horizontal auto-scaling sur CPU/RAM, HPA Kubernetes

---

## Backlog V1 — Ce qu'on livre en annee 1

### 8 Themes | 52 Epics | 18 P0 (chemin critique)

| # | Theme | Epics P0 | Livrable cle |
|---|-------|----------|--------------|
| T1 | Onboarding & Experience | 2 epics | Parcours complet brief → paiement |
| T2 | Brief Multimodal | 3 epics | Texte, voix, photos, sketchs → brief structure |
| T3 | Site Intelligence | 3 epics | PLU + cadastre + risques auto (10 communes) |
| T4 | Programmation | 2 epics | Programme architectural automatique |
| T5 | Conception Generative | 3 epics | Variantes BIM/IFC conformes |
| T6 | **Conformite Deterministe** | **3 epics** | **Moteur 6000 regles, PLU encode** |
| T7 | **Production Livrables** | **2 epics** | **CERFA auto + plans + notice** |
| T8 | Fondations Techniques | 6 epics | CI/CD, RBAC, RGPD, monitoring, tests |

### Chemin critique — 8 phases sur 12 mois

```
M0 (Mois 1)  : Fondations — CI/CD, infra, auth, modele donnees
M1 (Mois 2)  : DSL Reglementaire — format regles, moteur CSP v1, ingestion PLU
M2 (Mois 3)  : Site Intelligence v1 — API IGN, cache PLU, analyse parcelle
M3 (Mois 4)  : Brief v1 — texte + photos → brief structure
M4 (Mois 5)  : Programmation v1 — brief → programme pieces/surfaces
M5 (Mois 6)  : Conception v1 — solveur parametrique → variants IFC
M6 (Mois 8)  : Integration — pipeline end-to-end, conformite + livrables
M7 (Mois 10) : Beta — 3 PC test avec utilisateurs reels
M8 (Mois 12) : V1 — 10 PC deposes, 5+ acceptes
```

---

## Methodologie — Comment l'equipe travaille

### Sprint Agent (tous les 2 cycles)
1. **Daily Agent Sync** — Rapport court : hier / aujourd'hui / blocage
2. **Sprint Planning** — PO priorise, CTO valide, estimation collective
3. **Sprint Review** — Demo livrables, decision go/no-go
4. **Retrospective** — Amelioration continue

### 4 Processus clefs

| Type de tache | Agents cles | Duree moyenne |
|---------------|-------------|---------------|
| **Nouvelle fonctionnalite** | UX → Back/Geo → QA → Legal (si reglementaire) | 1-3 sprints |
| **Encodage reglementaire** | Compliance_Engine + Legal_Risk + double validation | 2-5 jours/regle |
| **Evolution transversale** | CTO + leads impactes + migration + tests | 1-2 sprints |
| **Bug/Incident** | Severity P0→P3, War Room si P0 reglementaire | P0: < 4h, P1: < 24h |

### 3 Vetos absolus (jamais contourne)
1. **Conformite livrable** : Compliance_Engine + Legal_Risk disent NON → c'est NON
2. **Securite critique** : Security_Led dit NON → c'est NON
3. **Hallucination LLM en conformite** : SI un LLM touche a la couche 6 → arret immediat, investigation

---

## Securite & Risques — Les 5 risques mortels géres

| Risque | Mitigation | Agent responsable |
|--------|-----------|-------------------|
| **Hallucination LLM sur conformite** | Separation physique IA/deterministe, 6 garde-fous automatises, audit trail | Compliance_Engine + Security_Lead |
| **Attaque Ordre des Architectes** | Marche A V1 (sans archi), advisory ex-Ordre, narrative "outil au service" | Legal_Risk |
| **Sinistralite decennale** | Filtre dur cas-tordus V1-V2, captive assurance an 4 | Legal_Risk + Product_Owner |
| **Concurrence Autodesk/Bentley** | Vitesse d'execution + vertical FR + donnees IGN gratuites + integration permis | CTO + Product_Owner |
| **Scope creep / 12 couches** | Discipline phases ruthless, V1 fige, validation CTO+PO pour tout ecart | Product_Owner (Veto) |

---

## Prochaines etapes — Plan de demarrage immediat

### Semaine 1 (Demarrage)
- [ ] CTO : Finaliser ADR et architecture detaillee
- [ ] Product_Owner : Prioriser les 3 premiers sprints a partir du backlog
- [ ] Legal_Risk : Lancer la veille reglementaire et constituer le reseau advisory
- [ ] DevOps_SRE : Deployer l'infrastructure de base (K8s, CI/CD, PostgreSQL)
- [ ] Backend_Lead : Modele de donnees v1 + API authentification

### Sprint 1 (Fondations)
- [ ] Infrastructure Kubernetes sur Scaleway operationnelle
- [ ] CI/CD pipeline (build, test, deploy) fonctionnelle
- [ ] Modele de donnees PostgreSQL + PostGIS deploye
- [ ] Auth RBAC (Keycloak) integree
- [ ] Monitoring de base (Prometheus + Grafana)
- [ ] Definition du DSL reglementaire (format YAML des regles)

### Sprint 2-3 (Moteur reglementaire — chemin critique)
- [ ] Moteur CSP v1 operational
- [ ] 50 premieres regles encodees (regles nationales basiques)
- [ ] Ingestion PLU des 10 communes pilotes
- [ ] Tests de non-regression du moteur

---

## Documents de reference complets (7 891 lignes)

| Document | Lignes | Contenu |
|----------|--------|---------|
| `equipe_edifia.md` | 1 614 | Fiches de poste detaillees, matrice RACI complete, flux de decision |
| `methodologie_workflow.md` | 2 450 | Workflows, templates, checklists, tableau de bord 27 metriques |
| `backlog_initial.md` | 2 096 | 52 epics, 60 stories P0 detaillees, chemin critique 8 phases |
| `architecture_cible.md` | 1 731 | 12 ADR, architecture 3 tiers, modele donnees, stack detaillee |

---

## Resume executif pour Mathieu (Founder & CEO)

**Vous avez maintenant une equipe IA complete, structuree et operationnelle pour developper EDIFIA.**

| Aspect | Etat |
|--------|------|
| **Equipe** | 14 agents, 4 piliers, 3 niveaux de decision, 3 vetos absolus |
| **Backlog V1** | 52 epics priorises, 18 P0 detailles, chemin critique sur 12 mois |
| **Architecture** | 12 principes fondateurs, stack souveraine, separation IA/deterministe |
| **Methodologie** | Sprints agents, 4 processus types, 28 templates, 27 metriques |
| **Risques** | 5 risques mortels géres, 6 garde-fous automatises, War Room P0 |
| **Cout infra V1** | ~1 770 EUR/mois (Scaleway) |

> **La separation IA / Deterministe est le coeur de la securite.** La couche 6 (conformite) est hermetiquement isolee des LLMs. C'est un risque mortel gérate activement par l'architecture, les processus et la gouvernance.

**L'equipe est prete a demarrer. Le sprint 1 peut etre lance des aujourd'hui.**

---

*Document confidentiel — Distribution restreinte aux fondateurs EDIFIA et investisseurs identifies.*
