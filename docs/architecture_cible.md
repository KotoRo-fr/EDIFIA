# EDIFIA V1 — Architecture Technique Cible

> **Document de reference technique** | Version 1.0 | Date : 2025-01
> Portee : Couches V1 (1-Brief, 2-Site Intelligence, 4-Programmation, 5-Conception generative, 6-Conformite, 10-Production livrables)
> Contraintes : Hosting souverain EU, moteur conformite 100% deterministe, BIM natif IFC, 5000 dossiers/an en annee 3

---

## Table des matieres

1. [Principes architecturaux (ADR)](#1-principes-architecturaux-adr)
2. [Architecture de haut niveau](#2-architecture-de-haut-niveau)
3. [Architecture detaillee par couche V1](#3-architecture-detaillee-par-couche-v1)
4. [Architecture de la conformite (CRITIQUE)](#4-architecture-de-la-conformite-critique)
5. [Modele de donnees](#5-modele-de-donnees)
6. [Architecture IA / LLM](#6-architecture-ia--llm)
7. [Architecture de securite](#7-architecture-de-securite)
8. [Architecture DevOps / Infrastructure](#8-architecture-devops--infrastructure)
9. [Matrice des decisions technologiques](#9-matrice-des-decisions-technologiques)
10. [Architecture V2-V3 (vision)](#10-architecture-v2v3-vision)

---

## 1. Principes architecturaux (ADR)

### ADR-001 : Determinisme total pour la conformite reglementaire
**Principe** : Le moteur de conformite est 100% deterministe — aucun LLM, aucun reseau de neurones, aucune probabilite n'intervient dans l'evaluation d'une regle.  
**Justification** : Risque mortel #1 identifie dans le PRD. Une erreur de conformite peut entrainer une autorisation de construire illegale, des poursuites penales, et la mort du produit. La confiance du client repose sur la certitude mathematique de chaque decision.  
**Implication** : Base de regles encodees formellement, moteur d'inference a chainage avant avec CSP (Constraint Satisfaction Problem), audit trail immuable de chaque decision.

### ADR-002 : IFC comme source de verite unique
**Principe** : Le format IFC (Industry Foundation Classes, ISO 16739) est le format natif et unique de representation des donnees de batiment. Aucun format proprietaire n'est utilise en interne.  
**Justification** : Interoperabilite, perennite des donnees, souverainete (format ouvert ISO), conformite aux exigences du marché public francais (BIM obligatoire). Permet l'echange avec tous les logiciels metiers (Revit, ArchiCAD, FreeCAD, BlenderBIM).  
**Implication** : Toutes les couches produisent et consomment de l'IFC. Les conversions vers d'autres formats (DXF, PDF, 3D glTF) sont des exports derives, jamais des formats internes.

### ADR-003 : Separation stricte IA / Deterministe
**Principe** : Une frontiere architecturale infranchissable separe les composants IA generative (LLM, diffusion) des composants deterministes (conformite, calculs reglementaires).  
**Justification** : Les LLM sont probabilistes et sujets aux hallucinations. Ils ne doivent jamais influencer directement une decision de conformite ou un calcul reglementaire. Cette separation est un garde-fou technique, pas seulement organisationnel.  
**Implication** : Barrieres physiques (services distincts, pas d'appel synchrone IA→Deterministe), validation humaine obligatoire pour tout franchissement de frontiere, revue de code systematique sur les interfaces.

### ADR-004 : API-first — Toute couche expose une API documentee
**Principe** : Chaque couche fonctionnelle expose une API REST/GraphQL documentee (OpenAPI). L'interface utilisateur n'appelle jamais directement une base de donnees ou un service interne.  
**Justification** : Permet l'integration tierce, les tests automatises, le remplacement incremental des composants, et le multi-client (web, mobile, partenaires). Facilite le decouplage et le scaling independant.  
**Implication** : Contract-first design, documentation OpenAPI 3.0 generee automatiquement, tests de contrat (Pact) entre services.

### ADR-005 : Event-driven entre couches — Asynchrone par defaut
**Principe** : La communication inter-couches privilegie le mode asynchrone via bus d'evenements. Les appels synchrones sont reserves aux requetes utilisateur rapides (<200ms).  
**Justification** : Le pipeline prompt-to-building est naturellement sequentiel mais long (30s-10min). L'asynchronisme permet la resilience (retry, dead-letter queue), le scaling elastique, et le decouplage temporel.  
**Implication** : Apache Kafka comme backbone d'evenements, pattern Saga pour les transactions distribuees, WebSocket/SSE pour notifier le frontend des progressions.

### ADR-006 : Hosting souverain EU — Donnees et compute sur le territoire europeen
**Principe** : Toutes les donnees clients, tous les modeles d'IA entraines, et tout le compute de production resident sur l'infrastructure d'un cloud provider europeen (Scaleway, OVHcloud, ou Hetzner).  
**Justification** : Donnees foncieres et projets de construction = donnees sensibles. Conformite RGPD, strategie de souverainete numerique, differenciation commerciale face aux solutions US.  
**Implication** : Pas d'appel API vers OpenAI/Anthropic pour les donnees sensibles sans anonymisation. LLM souverains (Mistral, Llama) en self-hosted pour les traitements internes. Donnees chiffrees, clefs gerees par le client (BYOK).

### ADR-007 : Geometrie computationnelle — Kernel BRep robuste
**Principe** : Le noyau geometrique repose sur une bibliotheque BRep (Boundary Representation) mature et open-source. Toute operation geometrique (boolean, offset, tessellation) passe par ce kernel.  
**Justification** : La fiabilite du solveur parametrique depend de la robustesse des operations geometriques. Un kernel maison est un risque mortel #2 (complexite geometrique).  
**Implication** : Open CASCADE (kernel BRep mature, license LGPL) comme fondation. Wrapper Python via PythonOCC. Tests de non-regression geometriques obligatoires.

### ADR-008 : Base de regles versionnee et auditable
**Principe** : La base de ~6000 regles de conformite est stockee dans un systeme de versionnement (Git), avec audit trail complet de chaque modification.  
**Justification** : Les reglements evuent (nouveaux arretes, modifications de PLU). Il faut pouvoir tracer qui a modifie quoi, quand, et pourquoi. La reproductibilite des decisions de conformite est legalement critique.  
**Implication** : Regles stockees en fichier texte (YAML/JSON), review obligatoire a chaque modification, CI qui valide la coherence de la base, tagging des versions correlees aux dates d'effet reglementaires.

### ADR-009 : Multi-tenancy avec isolation stricte des donnees
**Principe** : Chaque client (architecte, bureau d'etude) accede uniquement a ses propres projets et donnees. L'isolation est assuree au niveau applicatif ET base de donnees.  
**Justification** : Confidentialite commerciale, RGPD, separation des responsabilites. Un client ne doit jamais voir les projets d'un autre, meme par erreur.  
**Implication** : Row-level security (RLS) dans PostgreSQL, tenant_id dans chaque table, validation du tenant a chaque requete API, tests de penetration specifiques sur l'isolation.

### ADR-010 : Pipeline de donnees geospatiales — Temps reel et cache intelligent
**Principe** : Les donnees geospatiales (PLU, cadastre, risques) sont pre-fetch et mises en cache avec invalidation intelligente. Le systeme ne depend pas de la disponibilite des API externes pour fonctionner.  
**Justification** : Les API administratives (IGN, DVF, Sitadel) ont des SLA faibles et des indisponibilites frequentes. L'experience utilisateur ne doit pas en patir.  
**Implication** : Cache Redis avec TTL adapte (PLU : 24h, cadastre : 7j, DVF : 30j), fallback sur donnees stale, mode degrade explicite.

### ADR-011 : Progressive enhancement — Degradation degradee
**Principe** : Chaque fonctionnalite doit fonctionner en mode degrade si un service externe ou interne est indisponible. Le systeme expose explicitement son niveau de degradation.  
**Justification** : Un bureau d'etude ne peut pas s'arreter parce qu'une API externe est down. La productivite de l'utilisateur est la metrique premiere.  
**Implication** : Circuit breaker (pattern) sur chaque appel externe, health check aggrege, UI qui indique "Donnees PLU du 15/01 (non verifiees)" plutot qu'erreur brute.

### ADR-012 : Observabilite totale — Metriques, logs, traces
**Principe** : Chaque composant emet des metriques (Prometheus), des logs structures (JSON), et des traces distribuees (OpenTelemetry). Le dashboard de monitoring est accessible a toute l'equipe.  
**Justification** : A 5000 dossiers/an, les problemes de performance ou de fiabilite doivent etre detectes avant le client. Le debugging d'un pipeline distribue est impossible sans traces.  
**Implication** : Instrumentation automatique, SLO definis par couche (latence, taux d'erreur, throughput), alerting sur SLO, post-mortem systematique.

---

## 2. Architecture de haut niveau

### 2.1 Vue d'ensemble — 3 tiers

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    TIER CLIENT                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │   Web App    │  │   Mobile     │  │   Desktop    │  │   API Partenaires        │ │
│  │   (Next.js)  │  │   (PWA)      │  │   (Electron) │  │   (Architectes, MOA)     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───────────┬──────────────┘ │
│         │                 │                  │                      │                │
│         └─────────────────┴──────────────────┴──────────────────────┘                │
│                                   │                                                  │
│                          WebSocket (SSE) — Progression temps reel                    │
└───────────────────────────────────┼──────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 TIER API GATEWAY                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │   Kong /     │  │   Rate       │  │   Auth       │  │   Request                │ │
│  │   Traefik    │  │   Limiter    │  │   (JWT/      │  │   Router                 │ │
│  │   (Ingress)  │  │   (Redis)    │  │   OAuth2)    │  │   (/api/v1/*)            │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └───────────┬──────────────┘ │
│         └─────────────────┴──────────────────┴──────────────────────┘                │
│                                    │                                                  │
└────────────────────────────────────┼──────────────────────────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────────────────────┐
│   SERVICES         │  │   EVENT BUS        │  │   DATA & STORAGE                   │
│   METIERS          │  │   (Apache Kafka)   │  │                                    │
│                    │  │                    │  │  ┌──────────────┐  ┌──────────────┐ │
│  ┌──────────────┐  │  │  Topics :          │  │  │ PostgreSQL   │  │ MongoDB      │ │
│  │ Layer 1:     │  │  │  - brief.created   │  │  │ (projets,    │  │ (documents,   │ │
│  │ BRIEF        │  │  │  - site.analyzed   │  │  │  parcels,    │  │  briefs brut) │ │
│  │ MULTIMODAL   │◄─┼──┤  - program.computed│  │  │  regles)     │  │              │ │
│  └──────┬───────┘  │  │  - variant.gen     │  │  └──────────────┘  └──────────────┘ │
│         │          │  │  - compliance.chk  │  │                                   │
│  ┌──────▼───────┐  │  │  - deliverable.req │  │  ┌──────────────┐  ┌──────────────┐ │
│  │ Layer 2:     │  │  │                    │  │  │ Redis        │  │ MinIO /      │ │
│  │ SITE INTEL   │◄─┼──┘                    │  │  │ (cache,      │  │ S3-compatible│ │
│  │ (PLU/LIDAR)  │  │                       │  │  │  sessions)   │  │ (IFC, imgs)  │ │
│  └──────┬───────┘  │                       │  │  └──────────────┘  └──────────────┘ │
│         │          │                       │  │                                   │
│  ┌──────▼───────┐  │                       │  │  ┌──────────────┐  ┌──────────────┐ │
│  │ Layer 4:     │  │                       │  │  │ Neo4j        │  │ Elasticsearch│ │
│  │ PROGRAMME    │◄─┼───────────────────────┤  │  │ (graphe      │  │ (recherche   │ │
│  │ (Pieces/Surf)│  │                       │  │  │  adjacences) │  │  full-text)  │ │
│  └──────┬───────┘  │                       │  │  └──────────────┘  └──────────────┘ │
│         │          │                       │  └───────────────────────────────────┘
│  ┌──────▼───────┐  │                       │
│  │ Layer 5:     │  │                       │
│  │ CONCEPTION   │◄─┼───────────────────────┤
│  │ GENERATIVE   │  │                       │
│  │ (IFC/BIM)    │  │                       │
│  └──────┬───────┘  │                       │
│         │          │                       │
│  ┌──────▼───────┐  │                       │
│  │ Layer 6:     │  │                       │
│  │ CONFORMITE   │◄─┘                       │
│  │ DETERMINISTE │                          │
│  │ (6000 regles)│                          │
│  └──────┬───────┘                          │
│         │                                  │
│  ┌──────▼───────┐                          │
│  │ Layer 10:    │                          │
│  │ PRODUCTION   │                          │
│  │ LIVRABLES    │                          │
│  │ (PCMI/CERFA) │                          │
│  └──────────────┘                          │
└────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SERVICES TRANSVERSES                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ LLM Gateway  │  │  Geometric   │  │  Compliance  │  │   Notification           │ │
│  │ (Mistral/    │  │  Kernel      │  │  Engine      │  │   Service                │ │
│  │  Llama/vLLM) │  │  (OpenCASCADE│  │  (CLIPS/     │  │   (email, SMS,           │ │
│  │              │  │   + IfcOpen) │  │  Custom CSP) │  │    webhook)              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Auth Service │  │  Billing     │  │  Audit Log   │  │   Monitoring Stack       │ │
│  │ (Keycloak)   │  │  (Stripe EU) │  │  (immutable) │  │   (Prom/Grafana/         │ │
│  │              │  │              │  │              │  │    Jaeger)               │ │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  └──────────────────────────┘ │
│                                             │                                         │
└─────────────────────────────────────────────┼─────────────────────────────────────────┘
                                              │
┌─────────────────────────────────────────────┼─────────────────────────────────────────┐
│           INTEGRATIONS EXTERNES             │                                         │
│                                             ▼                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ IGN Geoportail│  │  API PLU     │  │  DVF         │  │   DIEC/Plat'AU         │ │
│  │ (LIDAR,Ortho)│  │  (docurba)   │  │  (prix)      │  │   (Sitadel)            │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Georisques   │  │  MeteoFrance │  │  Cadastre    │  │   LLM Cloud (fallback)  │ │
│  │ (aleas)      │  │  (clim 2050) │  │  (Etalab)    │  │   (OpenRouter)          │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Flux de donnees — Pipeline principal

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ETape 1   │────►│   Etape 2   │────►│   Etape 3   │────►│   Etape 4   │
│   BRIEF     │     │   SITE      │     │  PROGRAMME  │     │  VARIANTES  │
│  Multimodal │     │ Intelligence│     │ Archi.      │     │  BIM/IFC    │
│  (1-5 min)  │     │  (30-120s)  │     │  (10-60s)   │     │  (30-300s)  │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
     Input :              Input :              Input :               │
     - Texte/voix         - coord. GPS       - brief structure     Input :
     - Images             - PLU + reglement  - surfaces cibles     - programme
     - Croquis             - LIDAR IGN        - typologie MOB       - constraints
     - LIDAR user          - DVF + Sitadel                          - style
                           - Risques/climat                         Output :
     Output :             Output :           Output :               - Nx IFC
     - Brief JSON         - Fiche site       - Programme JSON       - Nx glTF
       structure            enrichie           (pieces, surf,         - metadonnees
                                                  adjacences)            variantes
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    ETape 5 : CONFORMITE DETERMINISTE                   │  │
│  │                    (Layer 6 — 100% deterministe)                       │  │
│  │                                                                       │  │
│  │  Pour chaque variante IFC :                                           │  │
│  │    1. Extraction parametres (surfaces, hauteurs, vitrage, SHON...)   │  │
│  │    2. Evaluation ~6000 regles (PLU, DTU, RE2020, PMR, incendie)      │  │
│  │    3. Generation rapport conformite (passe/anomalie/derogation)       │  │
│  │    4. Score conformite global + details par regle                     │  │
│  │                                                                       │  │
│  │  Output : Rapport conformite detaille + decision (validable/rejet)   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    ETape 6 : PRODUCTION LIVRABLES                      │  │
│  │                    (Layer 10)                                          │  │
│  │                                                                       │  │
│  │  - Pieces graphiques (plans, coupes, 3D) → rendu 4K                 │  │
│  │  - Dossier PCMI (pieces obligatoires permis construire)               │  │
│  │  - Formulaires CERFA pre-remplis                                      │  │
│  │  - Notices technique (RE2020, acoustique, accessibilite)              │  │
│  │  - Devis estimatif simplifie (V1)                                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Points d'integration externes

| Service externe | Donnees recuperees | Mode d'appel | SLA cible | Fallback |
|-----------------|-------------------|--------------|-----------|----------|
| **IGN Geoportail** | Orthophotos, MNT, LIDAR HD | WMS/WMTS/telechargement | 95% | Cache 7j, tuiles precedentes |
| **API Carto (Etalab)** | Cadastre, parcelles, sections | REST JSON | 99% | Cache 30j, donnees DGFiP |
| **docurba / API PLU** | PLU, reglement graphique, zonage | REST/SCRAP | 90% | Cache 24h, alerte admin |
| **DVF (Etalab)** | Prix de vente fonciers par parcelle | API REST | 95% | Cache 30j, donnees stale |
| **DIEC / Plat'AU (Sitadel)** | Autorisations de construire, recours | API REST | 85% | Cache 7j, mode degrade |
| **Georisques** | Aleas naturels (inondation, seisme, radon) | WMS/REST | 95% | Cache 30j |
| **MeteoFrance DRIAS** | Donnees climatiques 2050, 2100 | FTP/REST | 90% | Cache 365j (rarement mises a jour) |
| **BAN (Base Adresse Nationale)** | Adresses normalisees | API REST | 99% | Cache 90j |
| **LLM Cloud (OpenRouter)** | Inference LLM (fallback) | API REST | 99% | LLM local (vLLM) |

---

## 3. Architecture detaillee par couche V1

### 3.1 Layer 1 — BRIEF MULTIMODAL

**Responsabilite** : Transformer toute forme d'expression utilisateur (texte, voix, images, croquis, nuage de points LIDAR) en un brief architectural structure (JSON valide et complet).

**API exposee (Brief Service)** :
```yaml
POST   /api/v1/brief                    # Creer un brief
GET    /api/v1/brief/{id}               # Recuperer un brief
PUT    /api/v1/brief/{id}               # Modifier un brief
POST   /api/v1/brief/{id}/transcribe    # Soumettre audio → texte
POST   /api/v1/brief/{id}/upload-image  # Uploader image/croquis
POST   /api/v1/brief/{id}/upload-lidar  # Uploader nuage de points
GET    /api/v1/brief/{id}/structure     # Obtenir le brief structure
POST   /api/v1/brief/{id}/clarify       # Poser question de clarification
WebSocket /ws/brief/{id}/progress      # Progression temps reel
```

**Algorithmes / Composants cles** :
- **ASR (Automatic Speech Recognition)** : Whisper (OpenAI) ou Whisper.cpp pour la transcription voix→texte. Modele `large-v3`, self-hosted via vLLM/Whisper.cpp pour souverainete.
- **Vision Language Model (VLM)** : LLaVA 1.6 / Qwen2-VL pour l'analyse d'images et croquis. Extraction des elements visuels (fenetres, portes, volumes, style architectural).
- **LLM orchestrateur de brief** : Mistral Large / Llama 3.3-70B. Prompt system specialise pour transformer le contenu brut en JSON structure valide selon schema `BriefStructure`.
- **Moteur de clarification** : Analyse des champs manquants ou ambigus dans le brief, generation de questions de clarification contextualisees.
- **Validateur schema** : JSON Schema validation strict, verification de la completude des champs critiques (typologie, surface, budget, contraintes).

**Format de donnees** :
- **Entree** : Texte (markdown), Audio (wav/mp3, <50Mo), Image (jpg/png, <20Mo), LIDAR (las/laz/e57, <500Mo)
- **Sortie** : `BriefStructure` (JSON) — voir modele de donnees section 5

**Dependances** :
- LLM Gateway (inference)
- Storage MinIO (fichiers uploades)
- PostgreSQL (stockage briefs)
- Notification Service (progression)

**Stack technologique** :
| Composant | Technologie | Justification |
|-----------|------------|---------------|
| API | FastAPI (Python) | Performance, async natif, auto-doc OpenAPI |
| ASR | Whisper.cpp | Self-hosted, souverain, qualite SOTA |
| VLM | Qwen2-VL-7B (vLLM) | Performance/qualite ratio, vision multilingue |
| LLM Brief | Mistral-7B-Instruct v0.3 | Souverain, performant pour l'extraction structuree |
| Validation | Pydantic v2 | Validation type-safe, performance |
| File processing | Pillow, Open3D, laspy | Standards de l'industrie |

**Considerations de performance** :
- Transcription audio : ~0.5x temps reel (10min audio → 5s traitement)
- Analyse image : ~2-5s par image (GPU A10G)
- Generation brief structure : ~3-10s selon complexite
- Upload LIDAR : streaming progressif, traitement en background (30-120s)

---

### 3.2 Layer 2 — SITE INTELLIGENCE

**Responsabilite** : Agreger toutes les donnees contextuelles d'un site de construction (reglementation locale, topographie, marche foncier, risques naturels, donnees climatiques) en une fiche site enrichie exploitable par les couches aval.

**API exposee (Site Service)** :
```yaml
POST   /api/v1/site/analyze             # Lancer analyse site (async)
GET    /api/v1/site/{id}                # Fiche site complete
GET    /api/v1/site/{id}/plu            # Reglement PLU + zonage
GET    /api/v1/site/{id}/constraints    # Liste contraintes actives
GET    /api/v1/site/{id}/dvf            |# Donnees DVF voisinage
GET    /api/v1/site/{id}/risks          |# Rapport risques naturels
GET    /api/v1/site/{id}/climate        |# Donnees climatiques DRIAS
GET    /api/v1/site/{id}/sitadel        |# Autorisations construire proches
WebSocket /ws/site/{id}/progress       # Progression aggregation
```

**Algorithmes / Composants cles** :
- **Agrégateur PLU** : Scraping + parsing des documents PLU (PDF reglement, cartes zonage). Extraction des contraintes par zone (COS, hauteur, emprise, recul). Integration API docurba si disponible.
- **Analyse LIDAR IGN** : Telechargement tuiles LIDAR HD, generation MNT (Modèle Numerique de Terrain), extraction pente, orientation, vis-a-vis, ensoleillement.
- **Enrichissement DVF** : Agregation prix/m² par typologie et zone, tendances marche, comparables proches.
- **Analyse risques** : Croisement Georisques (inondation, seisme, radon, mouvement terrain) + base Gazpar (reseau gaz).
- **Donnees climatiques** : Extraction projections DRIAS 2050/2100 (temperature, pluie, vent) pour dimensionnement technique (etancheite, climatisation).

**Format de donnees** :
- **Entree** : coordonnees GPS (WGS84), code INSEE, identifiant parcelle cadastrale
- **Sortie** : `SiteReport` (JSON) — fiche site avec PLU, risques, contraintes, marche, climat

**Dependances** :
- PostgreSQL/PostGIS (donnees geospatiales stockees)
- Redis (cache API externes)
- External APIs (IGN, DVF, Georisques, MeteoFrance)
- Brief Service (coordonnees du projet)

**Stack technologique** :
| Composant | Technologie | Justification |
|-----------|------------|---------------|
| API | FastAPI | Async natif, gestion streaming |
| Geospatial | PostGIS | Extension PostgreSQL, requetes spatiales |
| LIDAR processing | PDAL, laspy, rasterio | Pipeline ETL point cloud standard |
| PDF parsing | PyMuPDF, Camelot | Extraction tableaux reglement |
| Cache | Redis + RediSearch | Cache geospatial, TTL adaptatifs |
| Scheduling | Celery + Redis | Taches asynchrones, retry, rate limiting |

**Considerations de performance** :
- Analyse complete : 30-120s (depend des API externes)
- Cache PLU : 24h (change peu frequemment)
- Cache cadastre : 7j
- LIDAR processing : 10-60s selon surface

---

### 3.3 Layer 4 — PROGRAMMATION ARCHITECTURALE

**Responsabilite** : Transformer le brief structure et la fiche site en un programme architectural formel : liste des pieces, surfaces reglementaires et fonctionnelles, graphe d'adjacences, flux de circulation.

**API exposee (Programme Service)** :
```yaml
POST   /api/v1/program/generate         # Generer programme depuis brief+site
GET    /api/v1/program/{id}             # Programme complet
PUT    /api/v1/program/{id}             # Modifier programme (manuel)
GET    /api/v1/program/{id}/pieces      # Liste pieces detaillee
GET    /api/v1/program/{id}/adjacency   # Graphe adjacences
GET    /api/v1/program/{id}/compliance  # Check programme vs regles basiques
POST   /api/v1/program/{id}/optimize    # Optimiser surfaces/ajustements
```

**Algorithmes / Composants cles** :
- **Moteur de programmation** : Algorithme de satisfaction de contraintes (CSP) + regles heuristiques metier. Generation d'un programme conforme aux contraintes reglementaires (surface min/moyenne par piece type, ratios surface habitable/pieces).
- **Graphe d'adjacences** : Generation automatique des relations de voisinage (chambre ↔ salle de bains, cuisine ↔ sejour, etc.) avec possibilite de modification manuelle.
- **Validateur reglementaire basique** : Verification des surfaces minimales (arrete du 31/01/1986), accessibilite PMR (PMR ≤ rez-de-chaussee ou ascenseur), ventilation (piece a vivre avec fenetre).
- **Optimiseur** : Ajustement des surfaces selon le budget DVF (rapport qualite/prix du marché local), typologie MOB (Maison Ossature Bois), et contraintes du site (pente, orientation).

**Format de donnees** :
- **Entree** : `BriefStructure` + `SiteReport`
- **Sortie** : `ArchitecturalProgram` (JSON) — pieces, surfaces, adjacences, flux

**Dependances** :
- Brief Service
- Site Service
- Conformite Engine (verification basique programme)
- Neo4j (graphe adjacences)

**Stack technologique** :
| Composant | Technologie | Justification |
|-----------|------------|---------------|
| API | FastAPI | |
| CSP Solver | OR-Tools (Google) | Solver contraintes mature, Python natif |
| Graphe | Neo4j + networkx | Stockage + algorithmes graphe |
| Regles programme | Python + YAML | Regles lisibles, versionnables |
| Validation | Pydantic + custom validators | |

**Considerations de performance** :
- Generation programme : 5-30s selon complexite
- CSP : resolution en O(n^2) pour n pieces, acceptable pour MOB ≤150m²
- Graphe adjacences : generation instantanee, stockage Neo4j pour requetes complexes

---

### 3.4 Layer 5 — CONCEPTION GENERATIVE (IFC/BIM)

**Responsabilite** : Generer N variantes architecturales en 3D au format IFC a partir du programme architectural et des contraintes du site. Chaque variante est un modele BIM complet avec geometrie, materiaux, proprietes techniques.

**API exposee (Conception Service)** :
```yaml
POST   /api/v1/design/generate          # Lancer generation variantes (async)
GET    /api/v1/design/{id}              # Etat generation + liste variantes
GET    /api/v1/design/{id}/variants     # Liste variantes generees
GET    /api/v1/variant/{variant_id}     # Details variante (IFC + metadonnees)
GET    /api/v1/variant/{id}/ifc         # Telechargement fichier IFC
GET    /api/v1/variant/{id}/gltf        # Visualisation 3D web (glTF)
GET    /api/v1/variant/{id}/metrics     # Metriques (surface, volume, vitrage)
PUT    /api/v1/variant/{id}/params      # Modifier parametres + regenerer
```

**Algorithmes / Composants cles** :
- **Solveur parametrique** : Systeme de generation base sur contraintes geometriques. Chaque variante = ensemble de parametres (longueur, largeur, hauteur, angle toit, position fenetres) evalue par le kernel BRep.
- **Kernel BRep** : Open CASCADE pour les operations geometriques (extrusion, booleen, fillet, offset). Wrapping PythonOCC.
- **Generateur IFC** : IfcOpenShell pour creer/modifier des fichiers IFC. Chaque piece du programme devient un `IfcSpace`, chaque mur un `IfcWall`, chaque ouverture un `IfcOpeningElement`.
- **Echantillonneur de variantes** : Algorithme d'exploration de l'espace des solutions (grid search + heuristique genetique legere). Generation de N variantes diversifiees selon axes de variation (compact/etale, toit plat/2 pans/contemporain, orientation principale).
- **Rendu glTF** : Conversion IFC → glTF pour visualisation web (Three.js). Tessellation BRep → maillage.

**Format de donnees** :
- **Entree** : `ArchitecturalProgram` + `SiteReport` + parametres de generation
- **Sortie** : `Variant` — fichier IFC + fichier glTF + fichier JSON metriques

**Dependances** :
- Programme Service
- Site Service
- Geometric Kernel (OpenCASCADE)
- IFC Library (IfcOpenShell)
- Storage MinIO (fichiers IFC/glTF)

**Stack technologique** :
| Composant | Technologie | Justification |
|-----------|------------|---------------|
| API | FastAPI | |
| Kernel BRep | Open CASCADE 7.8 + PythonOCC | Kernel BRep mature, industrie CAD |
| IFC | IfcOpenShell 0.8 | Bibliotheque IFC reference, Python bindings |
| 3D Web | Three.js + glTF | Standard web 3D, performant |
| Solveur | Python + OR-Tools + heuristiques custom | CSP + algorithmes genetiques legers |
| Conversion IFC→glTF | IfcConvert + custom pipeline | Pipeline eprouve |

**Considerations de performance** :
- Generation 1 variante : 5-30s selon complexite
- Generation 10 variantes : 30-300s (parallelisable sur GPU/CPU)
- Fichier IFC moyen : 2-10Mo
- Conversion glTF : ~2s par variante
- Stockage : ~50Mo par projet (10 variantes × 5Mo)

---

### 3.5 Layer 6 — CONFORMITE DETERMINISTE (CRITIQUE)

**Responsabilite** : Evaluer systematiquement chaque variante architecturale contre l'ensemble des regles applicables (~6000 regles encodees). Produire un rapport de conformite complet avec decision binaire (conforme/non conforme) pour chaque regle, justification formelle, et references reglementaires.

**Architecture detaillee dans la section 4.**

---

### 3.6 Layer 10 — PRODUCTION LIVRABLES

**Responsabilite** : Produire l'ensemble des documents obligatoires pour le depot de permis de construire et la consultation des entreprises : pieces graphiques (plans, coupes, vues 3D), dossier PCMI, formulaires CERFA, notices techniques.

**API exposee (Livrables Service)** :
```yaml
POST   /api/v1/deliverables/generate    # Generer livrables depuis variante
GET    /api/v1/deliverables/{id}        # Liste livrables generes
GET    /api/v1/deliverables/{id}/pcmi   # Dossier PCMI (ZIP)
GET    /api/v1/deliverables/{id}/cerfa  # Formulaires CERFA (PDF)
GET    /api/v1/deliverables/{id}/notice # Notices techniques (PDF/DOCX)
GET    /api/v1/deliverables/{id}/render # Rendus 4K (PNG/JPG)
POST   /api/v1/deliverables/custom     # Livrable personnalise
```

**Algorithmes / Composants cles** :
- **Generateur de plans 2D** : Projection orthogonale IFC (plan de masse, plans d'etage, coupes). Rendu vectoriel (SVG) puis rasterisation haute resolution (PNG 4K).
- **Moteur de rendu 3D** : Ray-tracing via Blender (Cycles) ou moteur integre Three.js + SSR. Generation de vues perspectives, vues aeriennes, rendus realistes.
- **Generateur PCMI** : Assemblage automatique des pieces obligatoires (plan de situation, plan de masse, plans, coupes, facade) au format PCMI.
- **Pre-remplissage CERFA** : Extraction donnees du projet (surface, adresse, proprietaire) vers formulaires CERFA 13406*04 et annexes.
- **Generateur de notices** : Templates LaTeX/DOCX avec injection de donnees projet. Notices RE2020, acoustique, accessibilite PMR, securite incendie.
- **Estimateur couts V1** : Base de prix simplifiee (Euro/gros oeuvre, second oeuvre, equipements) × surfaces du programme. Pas de decomposition structurelle (V2).

**Format de donnees** :
- **Entree** : `Variant` (IFC) + `SiteReport` + `BriefStructure`
- **Sortie** : ZIP contenant PDFs (PCMI, CERFA, notices), PNG 4K (rendus), CSV (devis estimatif)

**Dependances** :
- Variante IFC (Layer 5)
- Conformite rapport (Layer 6)
- Site Service (donnees adresse, parcelle)
- Brief Service (donnees client)

**Stack technologique** :
| Composant | Technologie | Justification |
|-----------|------------|---------------|
| API | FastAPI | |
| Rendu 2D | Matplotlib + CairoSVG + Pillow | Plans vectoriels + rasterisation |
| Rendu 3D | Blender (Cycles) via API Python | Ray-tracing qualite professionnelle |
| Rendu web | Three.js + html2canvas | Apercus rapides |
| Documents | Python-docx + LaTeX + Jinja2 | Templates parametrables |
| CERFA | PyPDF2 + reportlab | Remplissage PDF existants |
| Plans IFC→2D | IfcOpenShell + matplotlib | Projection geometrique |

**Considerations de performance** :
- Plans 2D : 5-15s par plan
- Rendu 3D (Blender) : 30-120s par vue (CPU), 10-30s (GPU)
- Generation PCMI complet : 60-180s
- Notices : 10-30s par notice
- Generation complete : 2-5 minutes

---

## 4. Architecture de la conformite (CRITIQUE)

> **Cette section est la plus critique du document. Une erreur ici = mort du produit.**

### 4.1 Principes fondamentaux

1. **Zero LLM dans la chaine de conformite** : Aucun modele de langage, aucun reseau de neurones, aucun composant probabiliste n'intervient dans l'evaluation d'une regle.
2. **Determinisme mathematique** : Meme entree → meme sortie, toujours. Pas de temperature, pas de sampling.
3. **Transparence totale** : Chaque decision de conformite est justifiable, tracable, et auditable.
4. **Separation physique** : Le service de conformite s'execute sur des pods Kubernetes distincts, sans acces reseau au LLM Gateway.
5. **Base de regles versionnee** : Git comme source de verite pour les regles. Chaque modification = PR + review + CI.

### 4.2 Structure de la base de ~6000 regles

Les regles sont stockees en format texte (YAML), versionnees dans Git, chargees en memoire au demarrage du moteur.

```yaml
# Exemple de structure d'une regle
rule_id: "PLU-COS-001"
name: "Respect du Coefficient d'Occupation des Sols"
description: "L'emprise au sol de la construction ne doit pas depasser le COS multiplie par la surface de la parcelle"
category: "urbanisme"
subcategory: "plu_cos"
severity: "blocking"  # blocking, warning, info
applicability:
  scope: ["new_construction", "extension"]
  building_types: ["house", "extension"]
  zone_types: ["U", "AU", "A"]
  # La regle ne s'applique que si ces conditions sont remplies

# Version reglementaire
text_source: "Code de l'urbanisme, Article L151-17"
plu_reference: "COS article 5 du reglement"
date_effective: "2019-01-01"
date_expires: null

# Parametres necessaires
inputs:
  - name: "emploi_sol"
    type: "float"
    unit: "m2"
    source: "ifc_extract"
    description: "Surface d'emprise au sol du batiment"
  - name: "surface_parcelle"
    type: "float"
    unit: "m2"
    source: "cadastre"
    description: "Surface de la parcelle cadastrale"
  - name: "cos_max"
    type: "float"
    unit: "ratio"
    source: "plu"
    description: "COS maximum autorise par le PLU"

# Logique de la regle (pseudo-code formel)
logic:
  type: "comparison"
  operation: "less_than_or_equal"
  left: "emploi_sol / surface_parcelle"
  right: "cos_max"
  error_message: "Le COS de {calculated_cos} depasse le COS autorise de {cos_max}"
  # Garde-fou : si cos_max est null (PLU non numerise), la regle renvoie "unknown"

# Derogations possibles
derogations:
  - condition: "zone_Uh"
    description: "Derogation possible en zone d'urbanisme historique"
    process: "demande_mairie"

# Audit
created_by: "compliance-team"
created_at: "2024-01-15"
reviewed_by: "legal-team"
reviewed_at: "2024-02-01"
validation_commune: ["Paris", "Lyon", "Bordeaux"]  # Communes ou la regle est validee
```

**Organisation de la base de regles** :
```
rules/
├── urbanisme/
│   ├── plu_cos/              # Coefficient d'occupation des sols (~50 regles)
│   ├── plu_hauteur/          # Hauteur maximale (~80 regles)
│   ├── plu_recul/            # Reculs de propriete (~100 regles)
│   ├── plu_empreinte/        # Emprise au sol (~60 regles)
│   ├── plu_zone/             # Regles par zone PLU (~200 regles)
│   └── alignment/            # Alignement rue (~40 regles)
├── dtu/
│   ├── dtu_31/               # Regles de base de calcul (~150 regles)
│   ├── dtu_45/               # Plomberie (~200 regles)
│   ├── dtu_60/               # Chaudieres (~100 regles)
│   └── ...
├── re2020/
│   ├── bec_bio/              # Bbio max (~30 regles)
│   ├── bec_cep/              # CEP max (~30 regles)
│   └── ...
├── pmr/
│   ├── accessibility/        # Accessibilite handicap (~200 regles)
│   └── ...
├── securite_incendie/
│   ├── evac/                 # Evacuation (~150 regles)
│   ├── compartimentage/      # Compartimentage feu (~100 regles)
│   └── ...
├── acoustique/
│   └── ...
└── _meta/
    ├── rule_schema.json      # Schema JSON de validation d'une regle
    ├── rule_index.yaml       # Index de toutes les regles
    └── rule_tests/           # Tests unitaires par regle
```

**Repartition estimée des ~6000 regles** :
| Domaine | Nombre de regles | Source principale | Frequence de mise a jour |
|---------|-----------------|-------------------|-------------------------|
| PLU / Urbanisme local | ~800 | Documents PLU par commune | Tres frequente (chaque revision PLU) |
| Code de l'urbanisme national | ~300 | Code de l'urbanisme | Annuelle (loi ELAN, etc.) |
| DTU normes techniques | ~1200 | UNE, AFNOR, CSTB | Annuelle |
| RE2020 / Environnement | ~200 | Decrets RE2020 | Annuelle |
| PMR / Accessibilite | ~400 | Arretes accessibilite | Bi-annuelle |
| Securite incendie | ~500 | Arretes securite | Annuelle |
| Acoustique | ~200 | Arretes acoustique | Annuelle |
| Electrique (NFC 15-100) | ~600 | UTE, AFNOR | Annuelle |
| Gaz / Plomberie | ~400 |normes sectorielles | Annuelle |
| Structure (V1 basique) | ~200 | DTU + Eurocodes | Annuelle |
| Fondations / Sol | ~200 | DTU 13, DTU 43 | Annuelle |
| **TOTAL V1** | **~6000** | | |

### 4.3 Moteur d'inference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOTEUR DE CONFORMITE DETERMINISTE                         │
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  1. EXTRACT  │───►│  2. FILTER   │───►│  3. EVALUATE │                  │
│  │  Parameters  │    │  Applicable  │    │  Rules       │                  │
│  │  from IFC    │    │  Rules       │    │              │                  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘                  │
│                                                  │                          │
│  ┌──────────────┐    ┌──────────────┐           ▼                          │
│  │  5. REPORT   │◄───│  4. AGGREGATE │    ┌──────────────┐                  │
│  │  Generate    │    │  Results      │◄───│  Rule Engine │                  │
│  │  (JSON/PDF)  │    │  (pass/fail)  │    │  (CSP/       │                  │
│  └──────────────┘    └──────────────┘    │   Forward Ch.)│                  │
│                                          └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Etape 1 — Extraction des parametres** :
Le moteur lit le fichier IFC et extrait les parametres geometriques et techniques necessaires :
- Surfaces (habitable, emprise au sol, SHON, SRT)
- Hauteurs (sous-faitage, sous-plafond, hauteur facade)
- Vitrage (surface baies, orientation, uw)
- Volumes (VMC, hauteur ventilation)
- Materiaux (types de parois, isolation)

**Etape 2 — Filtrage des regles applicables** :
Selon les metadonnees du projet :
- Type de construction (neuf, extension, surélévation)
- Typologie (maison individuelle, MOB, extension <40m²)
- Zone PLU (U, AU, A, N)
- Commune (certaines regles sont specifiques)

**Etape 3 — Evaluation** :
Pour chaque regle applicable :
- Resolution des expressions (ex: `emploi_sol / surface_parcelle`)
- Application de l'operateur de comparaison
- Resultat : `PASS`, `FAIL`, ou `UNKNOWN` (si donnee manquante)

**Etape 4 — Agregation** :
- Score global (% de regles en PASS)
- Liste des FAIL avec gravite (blocking, warning, info)
- Suggestions de correction (regles de remediation associees)

**Etape 5 — Rapport** :
- JSON structure pour l'API
- PDF pour l'architecte (rapport de controle)
- Audit trail immuable (hash de chaque decision)

### 4.4 Implementation du moteur

```python
# Architecture simplifiee du moteur (pseudo-code)

class ComplianceEngine:
    """Moteur 100% deterministe — aucun LLM, aucun reseau de neurones."""

    def __init__(self, rules_path: str):
        # Chargement des regles depuis Git (fichiers YAML)
        self.rules = self._load_rules(rules_path)
        self.schema_validator = RuleSchemaValidator()

    def evaluate(self, ifc_path: str, project_meta: ProjectMeta) -> ComplianceReport:
        # 1. Extraction parametres IFC
        params = IFCParameterExtractor.extract(ifc_path)

        # 2. Filtrage regles applicables
        applicable = [
            r for r in self.rules
            if r.is_applicable(project_meta)
        ]

        # 3. Evaluation deterministe
        results = []
        for rule in applicable:
            result = rule.evaluate(params)
            results.append(RuleResult(
                rule_id=rule.id,
                status=result.status,  # PASS | FAIL | UNKNOWN
                computed_value=result.value,
                expected_value=rule.threshold,
                message=rule.error_message.format(**result.context),
                references=rule.legal_references,
                severity=rule.severity,
                # Audit trail
                evaluated_at=datetime.utcnow().isoformat(),
                engine_version=ENGINE_VERSION,
                ruleset_commit=RULESET_GIT_COMMIT,
            ))

        # 4. Agregation
        return ComplianceReport(
            results=results,
            global_score=self._compute_score(results),
            blocking_issues=[r for r in results if r.is_blocking_fail()],
            warnings=[r for r in results if r.is_warning()],
            audit_hash=self._compute_audit_hash(results),
        )

class Rule:
    """Representation d'une regle formelle."""

    def evaluate(self, params: dict) -> EvalResult:
        # Resolution deterministe — pas de hasard, pas de LLM
        context = {}
        left_value = self._resolve_expression(self.logic.left, params, context)
        right_value = self._resolve_expression(self.logic.right, params, context)

        op = OPERATORS[self.logic.operation]
        passed = op(left_value, right_value)

        return EvalResult(
            status=RuleStatus.PASS if passed else RuleStatus.FAIL,
            value=left_value,
            context=context,
        )
```

**Stack technologique du moteur** :
| Composant | Technologie | Justification |
|-----------|------------|---------------|
| Langage | Python 3.12 + Rust (extensions) | Python pour la logique, Rust pour les calculs intensifs |
| Validation schema | JSON Schema + Pydantic | Validation type-safe des regles |
| Expressions | Lark (parser) + custom evaluator | Parser d'expressions mathematiques securise |
| IFC parsing | IfcOpenShell | Extraction parametres IFC |
| Cache regles | In-memory (Redis optionnel) | Chargement au demarrage, reload sur webhook Git |
| Tests | pytest + hypothèse | Tests unitaires + property-based testing |

### 4.5 Processus de validation d'une regle

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. REDACTION │────►│ 2. REVIEW    │────►│ 3. TESTS     │────►│ 4. DEPLOIEMENT│
│    (Legal)   │     │ (Peer + CI)  │     │ (Automatise) │     │ (Staged)    │
└─────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
     │                      │                      │                  │
     ▼                      ▼                      ▼                  ▼
  - Format YAML         - Schema valide        - Tests positifs   - Canary deploy
  - Referencedoc        - Logique coherente    - Tests negatifs   - Monitoring
  - Cas tests           - Pas de conflit       - Edge cases       - Rollback auto
    associes            - Coverage >90%        - Perf <10ms       si erreurs
```

### 4.6 Processus d'ajout d'une nouvelle commune

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ONBOARDING NOUVELLE COMMUNE                               │
│                                                                             │
│  1. IDENTIFICATION                                                          │
│     - Code INSEE de la commune                                              │
│     - Telechargement document PLU (Geoportail-URBA / docurba)               │
│     - Identification version PLU en vigueur                                 │
│                                                                             │
│  2. EXTRACTION (semi-automatise)                                            │
│     - Parsing PDF reglement (Camelot + PyMuPDF)                             │
│     - Extraction cartes zonage (PDF vectoriel)                              │
│     - Identification articles numeriques (COS, hauteur, recul...)           │
│                                                                             │
│  3. ENCODAGE                                                                │
│     - Redaction regles specifiques commune (~20-50 regles)                  │
│     - Ecriture fichiers YAML dans rules/urbanisme/communes/{INSEE}/         │
│     - Ajout cas de tests avec valeurs attendues                             │
│                                                                             │
│  4. VALIDATION                                                              │
│     - Review par Compliance_Engine + Legal_Risk                             │
│     - Tests automatises (pytest)                                            │
│     - Validation sur cas reels anonymises                                   │
│                                                                             │
│  5. DEPLOIEMENT                                                             │
│     - Merge sur main + tag version                                          │
│     - Deploiement continu (CD)                                              │
│     - Notification : commune disponible                                     │
│                                                                             │
│  Delai moyen : 2-4h pour une commune standard (apres automatisation)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.7 Separation stricte IA / Deterministe — Garde-fous techniques

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GARDE-FOU TECHNIQUES                              │
│                                                                             │
│  FRONTIERE ARCHITECTURALE (JAMAIS FRANCHIE AUTOMATIQUEMENT)                 │
│                                                                             │
│   ┌─────────────────────────┐              ┌─────────────────────────┐      │
│   │    ZONE IA GENERATIVE   │              │   ZONE DETERMINISTE     │      │
│   │    (Pods Kubernetes     │   ════════   │   (Pods Kubernetes      │      │
│   │     namespace: ai)      │   INTERDIT   │    namespace:           │      │
│   │                         │   AUTOMATISE │    compliance-core)     │      │
│   │  - LLM Gateway          │              │                         │      │
│   │  - Brief Service        │              │  - Compliance Engine    │      │
│   │  - Conception Service   │              │  - Rule Evaluator       │      │
│   │  - Livrables Service    │              │  - IFC Extractor        │      │
│   │                         │              │                         │      │
│   │  RESEAU :               │              │  RESEAU :               │      │
│   │  - Internet OK          │              │  - Internet INTERDIT    │      │
│   │  - Base de regles       │              │  - Acces LLM Gateway    │      │
│    │    INTERDIT             │              │    INTERDIT             │      │
│   │  - MinIO OK             │              │  - MinIO OK (lecture)   │      │
│   │  - PostgreSQL OK        │              │  - PostgreSQL OK        │      │
│   └─────────────────────────┘              └─────────────────────────┘      │
│                                                                             │
│  POINTS DE CONTROLE EXPLICITES (Validation humaine obligatoire)             │
│                                                                             │
│  1. Une suggestion IA ne peut JAMAIS devenir une regle encodee              │
│     sans review humaine par Compliance_Engine + Legal_Risk                  │
│                                                                             │
│  2. Le LLM peut SUGGERER une interpretation de reglementaire               │
│     → mais l'encodage est manuel et la regle est testee formellement       │
│                                                                             │
│  3. Le Compliance Engine peut DEMANDER une clarification                    │
│     → mais la requete passe par un service intermediaire (human-in-loop)    │
│                                                                             │
│  4. Tout acces reseau depuis compliance-core vers ai-namespace              │
│     → Alerte CRITIQUE, blocage automatique, investigation Securite          │
│                                                                             │
│  MESURES TECHNIQUES                                                         │
│  - NetworkPolicy K8s : deny-all entre namespaces ai et compliance           │
│  - OPA Gatekeeper : regles admission interdisant les montages cross-ns      │
│  - Audit reseau : tout paquet entre les namespaces = alerte P0              │
│  - Code review obligatoire : 2 approvers pour toute modification compliance │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.8 Audit trail de chaque decision

```json
{
  "audit_id": "uuid-v4",
  "timestamp": "2025-01-15T14:30:00Z",
  "project_id": "proj_abc123",
  "variant_id": "var_def456",
  "engine_version": "compliance-engine-v2.3.1",
  "ruleset_version": "git:sha256:a1b2c3d4",
  "rule_results": [
    {
      "rule_id": "PLU-COS-001",
      "status": "FAIL",
      "severity": "blocking",
      "computed_value": 0.65,
      "threshold": 0.50,
      "expression": "emploi_sol / surface_parcelle <= cos_max",
      "input_values": {
        "emploi_sol": 130.0,
        "surface_parcelle": 200.0,
        "cos_max": 0.50
      },
      "message": "Le COS de 0.65 depasse le COS autorise de 0.50",
      "legal_references": ["Code de l'urbanisme L151-17", "PLU Article 5"],
      "hash": "sha256:..."
    }
  ],
  "global_score": 0.92,
  "audit_hash": "sha256:...",
  "signatures": {
    "engine": "ed25519:...",
    "ruleset": "ed25519:..."
  }
}
```

---

## 5. Modele de donnees

### 5.1 Entites principales et relations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MODELE DE DONNEES EDIFIA                            │
│                                                                             │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐           │
│  │  User    │────►│  Tenant  │◄────│  Project │◄────│  Parcel  │           │
│  │ (auth)   │     │ (org)    │     │ (dossier)│     │ (terrain)│           │
│  └──────────┘     └──────────┘     └────┬─────┘     └──────────┘           │
│                                         │                                   │
│                    ┌────────────────────┼────────────────────┐               │
│                    │                    │                    │               │
│                    ▼                    ▼                    ▼               │
│               ┌──────────┐      ┌──────────┐       ┌──────────┐            │
│               │  Brief   │      │  Site    │       │Programme │            │
│               │(Layer 1) │      │Report(L2)│       │  (L4)    │            │
│               └────┬─────┘      └──────────┘       └────┬─────┘            │
│                    │                                     │                   │
│                    │    ┌────────────────────────────────┘                   │
│                    │    │                                                   │
│                    │    ▼                                                   │
│                    │ ┌──────────┐     ┌──────────┐     ┌──────────┐        │
│                    │ │ Variant  │────►│Compliance│     │Deliverable│       │
│                    │ │ (IFC)    │     │ Report   │     │  (L10)   │        │
│                    │ │(Layer 5) │     │ (Layer 6)│     │(Layer 10)│        │
│                    │ └──────────┘     └──────────┘     └──────────┘        │
│                    │                                                        │
│                    │     ┌──────────┐     ┌──────────┐                      │
│                    └────►│ Document │     │   Rule   │                      │
│                          │ (upload) │     │(Layer 6) │                      │
│                          └──────────┘     └──────────┘                      │
│                                                                             │
│  Relations :                                                                │
│  - User (N) ──► Tenant (1)                                                  │
│  - Tenant (1) ◄── Project (N)                                               │
│  - Project (1) ──► Parcel (1)                                               │
│  - Project (1) ──► Brief (1)                                                │
│  - Project (1) ──► SiteReport (1)                                           │
│  - Project (1) ──► Programme (1)                                            │
│  - Project (N) ──► Variant (N)                                              │
│  - Variant (1) ──► ComplianceReport (1)                                     │
│  - Variant (1) ──► DeliverableSet (1)                                       │
│  - Project (N) ──► Document (N)                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Schema detaille des entites principales

#### Project (PostgreSQL — table principale)
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    created_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',  -- draft, active, archived
    project_type VARCHAR(50) NOT NULL,  -- new_construction, extension, elevation
    building_typology VARCHAR(50),  -- mob, traditional, mixed
    target_surface_min DECIMAL(10,2),
    target_surface_max DECIMAL(10,2),
    estimated_budget DECIMAL(15,2),
    -- Localisation
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    country VARCHAR(2) DEFAULT 'FR',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    code_insee VARCHAR(5),
    parcelle_cadastre VARCHAR(50),
    -- Metadonnees
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Row Level Security
    CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- RLS : chaque utilisateur ne voit que les projets de son tenant
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON projects
    USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

#### Brief (MongoDB — document flexible)
```json
{
  "_id": "brief_abc123",
  "project_id": "proj_def456",
  "tenant_id": "tenant_789",
  "version": 3,
  "raw_inputs": {
    "text": "... markdown du brief texte ...",
    "audio_transcript": "... transcription ...",
    "images": ["minio://bucket/image1.jpg", "minio://bucket/image2.jpg"],
    "lidar": "minio://bucket/pointcloud.laz"
  },
  "structured": {
    "typology": "house",
    "style_preference": "contemporary",
    "room_requirements": [
      {"type": "bedroom", "count": 3, "min_surface": 12},
      {"type": "bathroom", "count": 2, "min_surface": 5},
      {"type": "kitchen", "count": 1, "connected_to": ["living_room"]}
    ],
    "budget": {"min": 200000, "max": 350000, "currency": "EUR"},
    "constraints": {
      "max_height": 8.5,
      "environmental": ["low_energy", "wood_preference"],
      "accessibility": "pmr_ground_floor"
    },
    "preferences": {
      "orientation_living": "south",
      "outdoor_spaces": ["terrace", "garden"]
    }
  },
  "completeness_score": 0.87,
  "clarification_questions": [
    {"field": "garage", "question": "Souhaitez-vous un garage integre ?"}
  ],
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T14:30:00Z"
}
```

#### Variant (PostgreSQL + MinIO)
```sql
CREATE TABLE variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,  -- "Variante A - Compact"
    status VARCHAR(50) DEFAULT 'generated',  -- generated, validated, rejected
    -- Fichiers
    ifc_file_path VARCHAR(500),  -- path MinIO
    gltf_file_path VARCHAR(500),
    thumbnail_path VARCHAR(500),
    -- Parametres de generation
    generation_params JSONB,
    -- Metriques extraites
    metrics JSONB,  -- {"shon": 125.5, "vitree_ratio": 0.18, "hauteur": 7.2}
    -- Relations
    compliance_report_id UUID,
    deliverable_set_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Compliance Report (PostgreSQL)
```sql
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES variants(id),
    tenant_id UUID NOT NULL,
    engine_version VARCHAR(50) NOT NULL,
    ruleset_version VARCHAR(100) NOT NULL,  -- git commit hash
    global_score DECIMAL(5,4) NOT NULL,  -- 0.0000 - 1.0000
    status VARCHAR(20) NOT NULL,  -- passed, failed, partial
    -- Resultats detailles (JSONB pour flexibilite)
    results JSONB NOT NULL,  -- [{rule_id, status, severity, message, ...}]
    -- Audit
    audit_hash VARCHAR(128) NOT NULL,
    evaluated_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index GIN pour recherche dans results JSONB
CREATE INDEX idx_compliance_results ON compliance_reports USING GIN (results);
```

### 5.3 Choix de stockage par type de donnee

| Type de donnee | Stockage | Justification |
|---------------|----------|---------------|
| **Donnees relationnelles** (projets, utilisateurs, variantes) | PostgreSQL 16 | ACID, RLS, JSONB, PostGIS extension |
| **Documents flexibles** (briefs, logs) | MongoDB 7 | Schema flexible, recherche texte, aggregations |
| **Graphe d'adjacences** (pieces, relations) | Neo4j 5 | Requetes Cypher pour parcours de graphe, performances |
| **Cache / Sessions** | Redis 7 | Latence <1ms, pub/sub pour temps reel |
| **Fichiers volumineux** (IFC, images, LIDAR) | MinIO (S3-compatible) | Stockage objet, versionnable, compatible S3 API |
| **Recherche full-text** | Elasticsearch 8 | Indexation documents, recherche multi-criteres |
| **Time-series** (metriques, monitoring) | TimescaleDB (extension PostgreSQL) | Hypertables, compression, requetes temporelles |

### 5.4 Strategie de migration des donnees

1. **Versioning des schemas** : Alembic (SQL migrations) + mongodb-migrate
2. **Zero-downtime migration** : Expand-contract pattern pour PostgreSQL
3. **Migration IFC** : IfcOpenShell pour convertir entre versions IFC (2x3 → 4)
4. **Backup cross-region** : Replication PostgreSQL streaming, MinIO mirror
5. **Archivage** : Projets >2 ans archives (cold storage Glacier-compatible)

---

## 6. Architecture IA / LLM

### 6.1 Matrice de decision : LLM vs Deterministe

| Tache | Approche | Justification |
|-------|----------|---------------|
| Transcription voix (ASR) | **Whisper.cpp** | Tache purement pattern recognition, Whisper SOTA, self-hosted |
| Analyse d'images/croquis | **VLM (Qwen2-VL)** | Comprehension visuelle necessaire, mais resultat structure valide par schema |
| Extraction brief structure | **LLM (Mistral/Llama)** | Comprehension du langage naturel, mais output JSON avec schema strict |
| Generation programme | **CSP deterministe** | Pas de creativite, satisfaction de contraintes |
| Generation variantes IFC | **Solveur parametrique** | Geometrie computationnelle, pas de langage |
| **Evaluation conformite** | **DETERMINISTE INTERDIT LLM** | Risque mortel — certitude requise |
| Generation notices | **LLM + Templates** | Langage naturel, mais verification deterministe des chiffres |
| Rendus 3D | **Moteur rendu (Blender)** | Purement geometrique |
| Classement risques site | **Deterministe + regles** | Croisement de bases de donnees |
| Suggestions de correction | **LLM (brief suggestion)** | Creativite OK ici, pas pour la decision |

### 6.2 Pattern d'orchestration LLM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LLM GATEWAY (Orchestration)                           │
│                                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│   │  Router  │───►│  Prompt  │───►│   vLLM   │───►│ Output   │            │
│   │          │    │  Manager │    │  Server  │    │ Parser   │            │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘            │
│                                                                             │
│   PATTERNS :                                                                │
│                                                                             │
│   1. FUNCTION CALLING (Extraction brief)                                    │
│      - Prompt system avec schema JSON                                       │
│      - LLM genere JSON valide                                               │
│      - Validation Pydantic post-generation                                  │
│      - Retry avec feedback si schema invalide (max 3 retries)               │
│                                                                             │
│   2. RAG (Questions de clarification)                                       │
│      - Base vectorielle de briefs precedents (anonymises)                   │
│      - Retrieval des briefs similaires                                      │
│      - Injection dans le prompt comme exemples                              │
│      - Generation contextualisee                                            │
│                                                                             │
│   3. CHAIN-OF-THOUGHT (Analyse complexe)                                    │
│      - Decomposition en etapes                                              │
│      - Chaque etape validee avant la suivante                               │
│      - Reduce : synthese finale                                             │
│                                                                             │
│   4. HUMAN-IN-THE-LOOP (Validation critique)                               │
│      - Seuil de confiance < 0.85 → validation humaine                      │
│      - Generation de livrables officiels → validation architecte            │
│      - Nouvelle commune → validation manuelle                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Modeles recommandes

| Usage | Modele primaire | Modele fallback | Hosting | Couts estimes/1M tokens |
|-------|----------------|----------------|---------|------------------------|
| **Extraction brief** | Mistral-7B-Instruct v0.3 | Llama-3.3-70B | Self-hosted (vLLM) | ~0.50-1 EUR (compute) |
| **Clarification** | Mistral-7B-Instruct v0.3 | Mistral Small API | Self-hosted | ~0.50 EUR |
| **Analyse image** | Qwen2-VL-7B | Llava-1.6-34B | Self-hosted (vLLM) | ~1-2 EUR (GPU) |
| **Generation notices** | Mixtral-8x7B | Mistral Large API | Self-hosted | ~2-3 EUR |
| **RAG / Embedding** | sentence-transformers/all-MiniLM-L6-v2 | BGE-large | Self-hosted | ~0.10 EUR |
| **Transcription** | Whisper large-v3 | Whisper medium | Self-hosted (Whisper.cpp) | ~0.20 EUR |
| **Fallback cloud** | Mistral Small via API | OpenRouter | API externe (anonymise) | ~1-2 EUR |

**Contraintes de souverainete** :
- Toutes les donnees clients RESTENT sur l'infrastructure EU
- Les appels API vers fournisseurs externes sont ANONYMISES (pas de donnees nominatives)
- Le LLM Gateway peut router vers le cloud uniquement apres anonymisation + validation securite
- Modele par defaut : self-hosted. Cloud = opt-in avec avertissement.

### 6.4 Mecanismes de garde contre les hallucinations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MECANISMES ANTI-HALLUCINATION                             │
│                                                                             │
│  1. SCHEMA STRICT (Output contraint)                                        │
│     - JSON Schema obligatoire pour toute sortie LLM                        │
│     - Validation Pydantic automatique post-generation                       │
│     - Retry avec correction si schema invalide (max 3 essais)               │
│                                                                             │
│  2. DOUBLE GENERATION + CONSENSUS                                          │
│     - 2 appels LLM avec temperatures differentes (0.1 et 0.3)              │
│     - Comparaison des sorties                                              │
│     - Si divergence > seuil → alerte + validation humaine                  │
│                                                                             │
│  3. RETRIEVAL AUGMENTED GENERATION (RAG)                                    │
│     - Contexte factuel injecte dans le prompt (donnees site)               │
│     - Moins d'hallucination car LLM a acces aux faits                      │
│                                                                             │
│  4. VERIFICATION DETERMINISTE POST-LLM                                     │
│     - Chaque nombre genere par LLM est verifie contre les donnees brutes   │
│     - Ex: surface generee > surface parcelle → rejet                       │
│     - Ex: budget genere incompatible avec DVF → flag                       │
│                                                                             │
│  5. HUMAN-IN-THE-LOOP                                                      │
│     - Generation de documents officiels = validation obligatoire            │
│     - Seuil de confiance LLM < 85% = validation obligatoire                 │
│     - Nouvelle fonctionnalite = revue par expert metier                     │
│                                                                             │
│  6. TRACABILITE                                                             │
│     - Chaque generation LLM est loguee (prompt, output, temperature)        │
│     - Possibilite d'audit et de replay                                      │
│     - Metriques de qualite suivies dans le temps                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Architecture de securite

### 7.1 Authentification & autorisation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTIFICATION & RBAC                              │
│                                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   Client     │────►│  API Gateway │────►│  Keycloak    │                │
│  │   (Browser)  │     │  (Kong)      │     │  (OAuth2/    │                │
│  │              │     │              │     │   OIDC)      │                │
│  └──────────────┘     └──────────────┘     └──────┬───────┘                │
│                                                    │                        │
│                         ┌─────────────────────────┘                        │
│                         │                                                  │
│                         ▼                                                  │
│                  ┌──────────────┐                                          │
│                  │  JWT Token   │  ──► Signe RS256, expiry 15min           │
│                  │  (access)    │  ──► Refresh token : 7j                   │
│                  └──────────────┘                                          │
│                                                                             │
│  ROLES :                                                                    │
│  - super_admin : Tous les tenants, tous les droits                         │
│  - admin : Administration du tenant (facturation, utilisateurs)            │
│  - architecte : CRUD projets, generation variantes, conformite             │
│  - assistant : Lecture projets, saisie briefs                              │
│  - viewer : Lecture seule (client MOA)                                     │
│                                                                             │
│  RBAC par ressource :                                                       │
│  - projects:{tenant_id}:* → read/write selon role                          │
│  - compliance:reports → read pour architecte, write pour engine            │
│  - admin:* → reserve admin/super_admin                                     │
│                                                                             │
│  Row Level Security (PostgreSQL) :                                          │
│  - Chaque table a un tenant_id                                             │
│  - SET app.current_tenant = 'uuid' avant chaque requete                    │
│  - Les politiques RLS filtrent automatiquement                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Chiffrement

| Couche | Methode | Details |
|--------|---------|---------|
| **Transit** | TLS 1.3 | Tout trafic externe + interne (mTLS entre services) |
| **Donnees sensibles** | AES-256-GCM | Chiffrement applicatif pour donnees personnelles |
| **Stockage (at rest)** | LUKS | Chiffrement disque complet sur tous les volumes |
| **Backup** | AES-256-GCM | Chiffrement avant upload cross-region |
| **Secrets** | HashiCorp Vault | Rotation automatique, acces audit |
| **IFC fichiers** | AES-256-GCM | Chiffrement cote client optionnel (BYOK) |

### 7.3 Segregation des environnements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ENVIRONNEMENTS EDIFIA                                 │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │   LOCAL     │  │    DEV      │  │   STAGING   │  │    PRODUCTION   │    │
│  │ (docker     │  │ (namespace  │  │ (namespace  │  │  (namespace     │    │
│  │  compose)   │  │  dev)       │  │  staging)   │  │   prod)         │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘    │
│                                                                             │
│  RESEAU :                                                                   │
│  - Dev/Staging : VPC isole, VPN pour acces                                  │
│  - Production : Pas d'acces direct, tout passe par CI/CD                    │
│                                                                             │
│  DONNEES :                                                                  │
│  - Dev : Donnees fictives (seeds)                                           │
│  - Staging : Snapshot anonymise production (mensuel)                        │
│  - Production : Donnees reelles, backup continu                             │
│                                                                             │
│  RESSOURCES :                                                               │
│  - Dev : 1/4 des ressources prod                                            │
│  - Staging : Identique prod (pour tests de charge)                          │
│  - Production : Full capacity + auto-scaling                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.4 Protection contre les attaques courantes

| Menace | Contre-mesure |
|--------|---------------|
| **Injection SQL** | ORM (SQLAlchemy) + requetes parametrees + RLS |
| **XSS** | Output encoding (React), CSP headers, validation input |
| **CSRF** | Tokens CSRF, SameSite cookies, CORS strict |
| **IDOR** | RLS PostgreSQL + validation tenant_id a chaque requete |
| **DoS/DDoS** | Rate limiting (Redis), WAF (Kong), CDN (Scaleway) |
| **Upload malveillant** | Validation type MIME, scan virus (ClamAV), sandbox |
| **Secrets leaks** | Git pre-commit hooks (detect-secrets), Vault, rotation |
| **Supply chain** | SBOM, Dependabot, scanning images (Trivy), pinned versions |

### 7.5 Conformite RGPD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RGPD COMPLIANCE                                 │
│                                                                             │
│  1. FINALITE                                                                │
│     - Traitement des donnees strictement limite a la mission EDIFIA         │
│     - Pas de revente de donnees                                             │
│     - Pas de profilage au-dela du service                                  │
│                                                                             │
│  2. DROITS DES PERSONNES                                                    │
│     - Droit d'acces : API /gdpr/export → export complet JSON               │
│     - Droit a l'effacement : /gdpr/delete → suppression + anonymisation    │
│     - Droit a la portabilite : format JSON standard                        │
│     - Droit d'opposition : desactivation compte possible                    │
│                                                                             │
│  3. MESURES TECHNIQUES                                                    │
│     - Pseudonymisation des donnees personnelles dans les logs               │
│     - Chiffrement des donnees sensibles                                     │
│     - Minimisation : collecte uniquement les donnees necessaires            │
│     - Registre des traitements (documentation)                              │
│     - DPA (Data Processing Agreement) avec Scaleway                         │
│                                                                             │
│  4. INCIDENTS                                                               │
│     - Procedure de notification CNIL sous 72h                               │
│     - Notification utilisateurs affectes                                    │
│     - Post-mortem et mesures correctives                                    │
│                                                                             │
│  5. DPO                                                                     │
│     - Nomination d'un DPO (Data Protection Officer)                         │
│     - Contact : dpo@edifia.fr                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.6 Audit et logs

- **Logs applicatifs** : JSON structure, niveau INFO/ERROR/WARN, conservation 90j
- **Audit trail** : Immuable (append-only), conservation 7 ans (obligation legale)
- **Acces donnees** : Log de chaque acces a donnees sensibles (qui, quoi, quand)
- **Modifications** : Log de chaque modification de regle de conformite
- **Alertes securite** : Detection anomalies (acces inhabituel, volume anormal)

---

## 8. Architecture DevOps / Infrastructure

### 8.1 Conteneurisation & Orchestration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE KUBERNETES                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        KUBERNETES CLUSTER                            │    │
│  │  (Scaleway Kapsule / OVH Managed Kubernetes)                         │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Namespace : ingress                                        │   │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │   │    │
│  │  │  │ Kong GW  │  │ Cert-    │  │ Rate     │                │   │    │
│  │  │  │ (API)    │  │ manager  │  │ Limiter  │                │   │    │
│  │  │  └──────────┘  └──────────┘  └──────────┘                │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Namespace : ai (LLM Gateway + services IA)                │   │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │   │    │
│  │  │  │ vLLM     │  │ Whisper  │  │ Brief    │                │   │    │
│  │  │  │ (Mistral)│  │ (ASR)    │  │ Service  │                │   │    │
│  │  │  │ GPU pod  │  │ CPU pod  │  │ CPU pod  │                │   │    │
│  │  │  └──────────┘  └──────────┘  └──────────┘                │   │    │
│  │  │  ┌──────────┐  ┌──────────┐                              │   │    │
│  │  │  │ Qwen2-VL │  │Embedding │                              │   │    │
│  │  │  │ (Vision) │  │ Service  │                              │   │    │
│  │  │  │ GPU pod  │  │ CPU pod  │                              │   │    │
│  │  │  └──────────┘  └──────────┘                              │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Namespace : compliance-core (ZONE DETERMINISTE)           │   │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                │   │    │
│  │  │  │ Compliance│  │ IFC      │  │ Rules    │                │   │    │
│  │  │  │ Engine   │  │ Extractor│  │ Loader   │                │   │    │
│  │  │  │ CPU x4   │  │ CPU x2   │  │ CPU x1   │                │   │    │
│  │  │  └──────────┘  └──────────┘  └──────────┘                │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Namespace : core (services metiers)                       │   │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │    │
│  │  │  │ Site     │  │ Programme│  │ Conception│  │Livrables │  │   │    │
│  │  │  │ Service  │  │ Service  │  │ Service  │  │ Service  │  │   │    │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Namespace : data (bases de donnees + stockage)            │   │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │    │
│  │  │  │PostgreSQL│  │ MongoDB  │  │ Redis    │  │ MinIO    │  │   │    │
│  │  │  │ HA x3   │  │ RS x3    │  │ Sentinel │  │ Distrib. │  │   │    │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │    │
│  │  │  ┌──────────┐  ┌──────────┐                              │   │    │
│  │  │  │ Neo4j    │  │ Kafka    │                              │   │    │
│  │  │  │ Cluster  │  │ Cluster  │                              │   │    │
│  │  │  └──────────┘  └──────────┘                              │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  Namespace : monitoring                                    │   │    │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │    │
│  │  │  │Prometheus│  │ Grafana  │  │ Jaeger   │  │ AlertMgr │  │   │    │
│  │  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 CI/CD Pipeline

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  DEVELOPPEUR │───►│    CI        │───►│    CD        │───►│  DEPLOIEMENT  │
│   Push PR    │    │  (GitLab CI) │    │  (ArgoCD)    │    │  (Kubernetes) │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                          │                   │                    │
                          ▼                   ▼                    ▼
                    ┌──────────┐      ┌──────────┐          ┌──────────┐
                    │ Lint +   │      │ Build    │          │ Canary   │
                    │ Format   │      │ Image    │          │ Deploy   │
                    │ (ruff)   │      │ (Docker) │          │ (10%)    │
                    ├──────────┤      ├──────────┤          ├──────────┤
                    │ Tests    │      │ Scan     │          │ Health   │
                    │ Unitaires│      │ Securite │          │ Check    │
                    │ (pytest) │      │ (Trivy)  │          ├──────────┤
                    ├──────────┤      ├──────────┤          │ Full     │
                    │ Tests    │      │ Push     │          │ Deploy   │
                    │ Integ.   │      │ Registry │          │ (100%)   │
                    │ (API)    │      │          │          └──────────┘
                    ├──────────┤      └──────────┘
                    │ Coverage │
                    │ >80%     │
                    ├──────────┤
                    │ Review   │
                    │ (2 approvers)│
                    └──────────┘
```

### 8.3 Monitoring & Alerting

| Metrique | Outil | Seuil d'alerte |
|----------|-------|----------------|
| Latence API p99 | Prometheus + Grafana | > 500ms |
| Taux d'erreur HTTP 5xx | Prometheus | > 0.1% |
| CPU / Memoire | Prometheus | > 80% |
| File d'attente Kafka | Prometheus | > 1000 messages |
| Temps generation variante | Prometheus | > 300s |
| Taux conformite FAIL | Custom metric | Anomalie vs baseline |
| Acces securite anormaux | Falco + Alertmanager | Detection automatique |

### 8.4 Backup & Disaster Recovery

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STRATEGIE BACKUP & DR                                     │
│                                                                             │
│  BACKUP :                                                                   │
│  - PostgreSQL : WAL streaming continu → replica Scaleway Paris/Amsterdam   │
│  - MongoDB : Oplog replication + snapshot quotidien                         │
│  - MinIO : Cross-region replication (Paris → Amsterdam)                    │
│  - Redis : RDB snapshot toutes les heures                                  │
│  - Regles de conformite : Git (deja versionne) + backup GitLab             │
│                                                                             │
│  RECOVERY :                                                                 │
│  - RPO (Recovery Point Objective) : 5 minutes                             │
│  - RTO (Recovery Time Objective) : 30 minutes                             │
│  - Procedure : Basculer DNS vers region secondaire                        │
│  - Tests DR : Exercice mensuel                                             │
│                                                                             │
│  ARCHIVAGE :                                                                │
│  - Projets > 2 ans : Cold storage (Scaleway Glacier)                      │
│  - Restauration : 4-48h selon priorit                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.5 Scaling Strategy

| Composant | Scaling | Declencheur |
|-----------|---------|-------------|
| API Gateway | HPA (2-10 pods) | CPU > 70% |
| Services metier | HPA (2-20 pods) | Requetes/sec > 100 |
| vLLM (GPU) | VPA + node pool GPU | Queue > 10 requetes |
| Compliance Engine | HPA (3-30 pods) | File variants > 50 |
| PostgreSQL | Read replicas (3) | Latence > 10ms |
| Redis | Cluster (6 shards) | Memoire > 70% |
| MinIO | Horizontal (4 nodes) | Espace > 80% |

### 8.6 Estimation de cout infrastructure V1 (mois)

| Composant | Provider | Spec | Cout mensuel |
|-----------|----------|------|-------------|
| Kubernetes cluster (control plane) | Scaleway Kapsule | 3 nodes GP1-M | 150 EUR |
| GPU nodes (vLLM) | Scaleway | 2x RENDER-S (A10G) | 800 EUR |
| PostgreSQL HA | Scaleway DB | GP1-L + 2 replicas | 300 EUR |
| MongoDB | Self-hosted | 3 replicas on GP1-S | 150 EUR |
| Redis | Self-hosted | 3 nodes on GP1-XS | 50 EUR |
| MinIO (stockage) | Scaleway Object | 500Go + traffic | 50 EUR |
| Monitoring | Self-hosted | Prometheus/Grafana pods | 50 EUR |
| Load Balancer + CDN | Scaleway | LB-GP + CDN | 100 EUR |
| Backup storage | Scaleway | 200Go Glacier | 20 EUR |
| **TOTAL INFRA V1** | | | **~1,770 EUR/mois** |

**Projection annee 3 (5000 dossiers/an = ~420/mois)** :
- GPU nodes : 4x (parallelisation) → 1,600 EUR
- PostgreSQL : XL + read replicas x5 → 600 EUR
- Stockage : 5To (historique) → 200 EUR
- **TOTAL annee 3 estime : ~3,500-4,000 EUR/mois**

---

## 9. Matrice des decisions technologiques

### 9.1 Framework API

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **FastAPI** | Async natif, auto-docs, Python ecosystem | Moins mature que Django | **RECOMMANDE** |
| B | Django + DRF | Mature, admin integre, ORM puissant | Synchrone, lourd pour microservices | Alternative |
| C | Node.js/NestJS | Performance E/S, JS full-stack | Moins adapte calcul scientifique | Non retenu |

**Justification** : FastAPI est optimal pour les services Python scientifiques (IFC, geometrie, IA). L'async natif est critique pour les I/O (API externes, LLM).

### 9.2 LLM Self-Hosted

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **vLLM + Mistral-7B** | Performance KV-cache, quantization AWQ, souverain | Gestion infrastructure GPU | **RECOMMANDE** |
| B | llama.cpp | Ultra-leger, CPU possible | Moins performant pour batch | Fallback CPU |
| C | API externe (Mistral AI) | Zero infra, scaling elastique | Donnees externes, cout, non souverain | Fallback cloud |

**Justification** : vLLM offre le meilleur throughput GPU avec PagedAttention. Mistral-7B est suffisant pour les taches d'extraction. AWQ 4-bit divise la memoire par 4.

### 9.3 Moteur de conformite

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **Python custom + YAML rules** | Controle total, debuggable, versionnable | Dev a construire | **RECOMMANDE** |
| B | CLIPS (NASA) | Moteur regles eprouve, forward chaining | Syntaxe proprietaire, community faible | Alternative |
| C | Drools (Java) | Mature, enterprise | JVM, lourd pour notre stack Python | Non retenu |

**Justification** : Un moteur custom Python offre le controle total necessaire pour la conformite. L'encodage YAML est lisible par les juristes. CLIPS est une alternative credible si besoin de moteur eprouve.

### 9.4 Kernel BRep

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **Open CASCADE + PythonOCC** | Kernel BRep de reference, IFC natif, LGPL | Courbe d'apprentissage, API verbeuse | **RECOMMANDE** |
| B | FreeCAD API | Plus haut niveau, interface utilisateur | Moins flexible pour batch | Alternative |
| C | CGAL (C++) | Plus performant, meilleures algorithmes | Pas de binding Python officiel | Complement |

**Justification** : Open CASCADE est le standard industriel (utilise par FreeCAD, CadQuery). PythonOCC permet l'integration directe avec IfcOpenShell.

### 9.5 Orchestration messages

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **Apache Kafka** | Throughput, persistance, ecosystem riche | Complexite operationnelle | **RECOMMANDE** |
| B | Redis Streams | Simple, deja dans la stack | Moins de features, moins robuste | Alternative legere |
| C | RabbitMQ | Mature, facile a deployer | Moins scalable pour l'event sourcing | Non retenu |

**Justification** : Kafka est le standard pour l'event sourcing et le pipeline de donnees. La persistance des evenements est critique pour l'audit.

### 9.6 Frontend

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **Next.js 14 (React)** | SSR, performance, ecosystem | Complexite pour visualisation 3D | **RECOMMANDE** |
| B | Vue.js + Nuxt | Plus simple, progressif | Moins d'outils 3D | Alternative |
| C | SvelteKit | Performance, leger | Ecosystem plus petit | Non retenu |

**Justification** : Next.js offre le meilleur ecosystem pour une application complexe (Three.js pour 3D, excellent support TypeScript).

### 9.7 Base de donnees principale

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **PostgreSQL 16 + PostGIS** | ACID, RLS, geospatial, JSONB | Moins flexible que NoSQL pour documents | **RECOMMANDE** |
| B | MongoDB principale | Flexible, scaling horizontal | Pas de transactions ACID completes, pas de RLS natif | Complement documents |
| C | CockroachDB | Distributed SQL, HA automatique | Complexite, cout | Future evolution |

**Justification** : PostgreSQL avec PostGIS est le standard pour les donnees geospatiales. RLS est indispensable pour le multi-tenancy.

### 9.8 Stockage fichiers

| Option | Technologie | Avantages | Inconvenients | Choix |
|--------|------------|-----------|---------------|-------|
| **A** | **MinIO** | S3-compatible, self-hosted, performant | A gerer nous-memes | **RECOMMANDE** |
| B | Scaleway Object Storage | Managed, pas d'ops | Vendor lock-in leger | Alternative |
| C | Ceph | Ultra-scalable, open source | Complexite operationnelle extreme | Non retenu |

**Justification** : MinIO offre la compatibilite S3 sans dependance cloud. Self-hosted = souverainete des donnees.

---

## 10. Architecture V2-V3 (vision)

### 10.1 Nouvelles couches V2

| Couche | Nom | Description | Stack anticipee |
|--------|-----|-------------|-----------------|
| **3** | Foncier Autonome | Recherche automatique de parcelles ( scraping foncier, scoring) | Scrapy + ML scoring |
| **7** | Structure | Calcul de structure (poteaux/poutres/voiles, descente de charges) | OpenSees + Eurocodes |
| **8** | Fluides | Dimensionnement CVC, electrique, plomberie | Regles DTU + IfcOpenShell |
| **9** | Economie | Devis detaille (DCE), quantitatifs, estimations | Base prix + IfcOpenShell quantification |

### 10.2 Nouvelles couches V3

| Couche | Nom | Description | Stack anticipee |
|--------|-----|-------------|-----------------|
| **11** | Phasage Chantier | Planning de chantier (Gantt), phases de construction | Algorithmes d'ordonnancement |
| **12** | Suivi Chantier | Suivi de conformite execution vs conception | Computer vision + IoT |

### 10.3 Points d'extension prevus dans V1

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POINTS D'EXTENSION V1 → V2/V3                           │
│                                                                             │
│  1. STRUCTURE (Layer 7 V2)                                                  │
│     - IFC deja enrichi avec materiaux dans V1                               │
│     - Points d'extension : IfcStructuralMember, IfcStructuralAnalysisModel │
│     - API : POST /api/v1/variant/{id}/structure (deja reserve)             │
│     - Modele de donnees : table structural_elements prete                 │
│                                                                             │
│  2. FLUIDES (Layer 8 V2)                                                    │
│     - Pieces deja definies avec fonctions (cuisine, sdb)                  │
│     - Points d'extension : IfcDistributionElement                          │
│     - API : POST /api/v1/variant/{id}/mep (deja reserve)                  │
│                                                                             │
│  3. ECONOMIE (Layer 9 V2)                                                   │
│     - Surfaces et materiaux deja dans IFC V1                                │
│     - Points d'extension : quantification automatique IFC                   │
│     - API : POST /api/v1/variant/{id}/estimate (deja reserve)             │
│                                                                             │
│  4. FONCIER (Layer 3 V2)                                                    │
│     - Site Intelligence deja aggrege les donnees foncieres                  │
│     - Points d'extension : scoring, scoring multicritere                   │
│                                                                             │
│  5. MULTILINGUE (V2)                                                        │
│     - Architecture deja pensée pour i18n                                    │
│     - Regles de conformite : systeme de traduction regles                  │
│                                                                             │
│  6. MULTI-PAYS (V3)                                                         │
│     - Base de regles deja structuree par pays                              │
│     - Extension : Belgique, Suisse, Luxembourg (proches du droit FR)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.4 Evolutions anticipees

| Domaine | V1 | V2 | V3 |
|---------|-----|-----|-----|
| **Typologies** | Maison individuelle, MOB, extension <40m² | + Immeubles collectifs, ERP | + Grandes infrastructures |
| **Conformite** | ~6000 regles FR | ~8000 regles (DTU complets) | + BE, CH, LU |
| **Structure** | Regles de portee basiques | Descente de charges complete | Calcul avance (seisme, vent) |
| **Cout estimatif** | Euro/m² simplifie | Devis detaille (DCE) | Analyse couts complets |
| **Rendu** | Plans 2D + 3D basique | Rendu photorealiste RT | VR / AR walkthrough |
| **Collaboration** | Mono-utilisateur | Multi-utilisateur temps reel | BimCollaborationFormat (BCF) |
| **API externe** | Lecture seule | Webhooks + write | Place de marche partenaires |

---

## Annexes

### A. Glossaire

| Terme | Definition |
|-------|------------|
| **IFC** | Industry Foundation Classes — format ouvert de donnees BIM (ISO 16739) |
| **BIM** | Building Information Modeling — modelisation des donnees du batiment |
| **BRep** | Boundary Representation — representation geometrique par frontieres |
| **CSP** | Constraint Satisfaction Problem — resolution de contraintes |
| **COS** | Coefficient d'Occupation des Sols — ratio emprise/surface parcelle |
| **SHON** | Surface Hors Oeuvre Nette — surface de plancher |
| **DTU** | Documents Techniques Unifies — normes de construction francaise |
| **RE2020** | Reglementation Environnementale 2020 — performance energetique |
| **PMR** | Personnes a Mobilite Reduite — accessibilite |
| **PCMI** | Permis de Construire — dossier de demande |
| **DVF** | Demandes de Valeurs Foncières — prix immobilier |
| **MOB** | Maison Ossature Bois |

### B. References

- [IFC4 Documentation](https://standards.buildingsmart.org/IFC/RELEASE/IFC4/ADD2_TC1/HTML/)
- [IfcOpenShell](https://ifcopenshell.org/)
- [Open CASCADE](https://dev.opencascade.org/)
- [Code de l'urbanisme](https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006074075/)
- [RE2020](https://www.ecologie.gouv.fr/reglementation-environnementale-re2020)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [vLLM](https://github.com/vllm-project/vllm)

### C. Versionning

| Version | Date | Auteur | Changements |
|---------|------|--------|-------------|
| 1.0 | 2025-01 | EDIFIA_CTO | Version initiale — Architecture V1 complete |

---

> **Document de reference technique EDIFIA V1** — Toute modification de l'architecture doit etre validee par le CTO et documentee dans ce fichier.
