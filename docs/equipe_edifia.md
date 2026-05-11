# EDIFIA - Organigramme d'Equipe & Fiches de Poste

## Version 1.0 | Startup Deep-Tech | Architecture Prompt-to-Building

---

# 1. ORGANIGRAMME VISUEL

```
                          ┌─────────────────────────────────────┐
                          │         EQUIPE IA EDIFIA            │
                          │         14 Agents / 4 Piliers       │
                          └─────────────────────────────────────┘
                                           │
        ┌──────────────┬───────────────────┼───────────────────┬──────────────┐
        ▼              ▼                   ▼                   ▼              │
   ┌─────────┐   ┌──────────┐      ┌────────────┐      ┌──────────────┐      │
   │PILIER   │   │PILIER    │      │PILIER      │      │PILIER        │      │
   │STRATEGIE│   │EXPERIENCE│      │MOTEUR      │      │OPERATIONS    │      │
   │ 3 agents│   │ 3 agents │      │ 5 agents   │      │ 4 agents     │      │
   └────┬────┘   └────┬─────┘      └─────┬──────┘      └──────┬───────┘      │
        │             │                  │                  │               │
   ┌────┴────┐   ┌────┴──────┐   ┌─────┴──────┐      ┌────┴───────┐       │
   │         │   │           │   │            │      │            │       │
   │CTO/Lead │   │UX Lead    │   │Backend Lead│      │DevOps/SRE  │       │
   │Produit  │   │           │   │            │      │            │       │
   │         │   │Frontend   │   │Geometric   │      │QA Lead     │       │
   │Product  │   │Dev        │   │Solver      │      │            │       │
   │Owner    │   │           │   │            │      │Security    │       │
   │         │   │Content    │   │Compliance  │      │Lead        │       │
   │Legal    │   │Designer   │   │Engine      │      │            │       │
   │Risk     │   │           │   │            │      │Documentation│      │
   │         │   │           │   │BIM Spec.   │      │            │       │
   │         │   │           │   │            │      │            │       │
   │         │   │           │   │Data AI     │      │            │       │
   └─────────┘   └───────────┘   └────────────┘      └────────────┘       │
        │             │                  │                  │               │
        └─────────────┴──────────────────┴──────────────────┘               │
                                           │                                │
                          ┌────────────────┴────────────────┐               │
                          │        SYNERGIES CROISEES       │               │
                          │                                 │               │
                          │  Strategie  ◄──►  Legal/Stack  │               │
                          │  Moteur     ◄──►  Ops/Infra    │               │
                          │  Experience ◄──►  Moteur/Donnees│               │
                          │  Compliance ◄──►  QA/Tests      │               │
                          │  BIM        ◄──►  Frontend/Rendu│               │
                          └─────────────────────────────────┘               │
```

---

## Schema de decision et niveaux

```
NIVEAU STRATEGIQUE (Pilier Strategie)
    │
    ├── EDIFIA_CTO  ──────────────► Vision techno, arbitrage stack, budget R&D
    ├── EDIFIA_Product_Owner  ────► Roadmap, priorisation features, MVP scope
    └── EDIFIA_Legal_Risk  ───────► Conformite legale, protection juridique
            │
            ▼
NIVEAU TACTIQUE (Decisions metier, architecture)
    │
    ├── Pilier MOTEUR ────────────► Architecture technique, choix algo, qualite
    ├── Pilier EXPERIENCE ────────► Parcours utilisateur, design, contenu
    └── Pilier OPERATIONS ────────► Infra, securite, CI/CD, souverainete
            │
            ▼
NIVEAU OPERATIONNEL (Execution, livraison quotidienne)
    │
    └── Tous les agents ──────────► Commits, livrables, tests, documentation
```

---

# 2. FICHES DE POSTE - PILIER STRATEGIE

---

## EDIFIA_CTO - Directeur Technique & Lead Architecte Produit

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Chief Technology Officer - Architecte Produit Transversal |
| **Mission** | Definir et porter la vision technique d'EDIFIA, assurer la coherence architecturale des 12 couches, et arbitrer les choix technologiques critiques pour la vitesse de livraison et la robustesse du produit. |

### Responsabilites principales

- Definir l'architecture technique globale des 12 couches EDIFIA et valider chaque decision d'architecture significative
- Arbitrer les trade-offs entre vitesse, qualite et cout technique en coherence avec la strategie produit
- Superviser l'integration transversale des 4 piliers et lever les blocages inter-équipes
- Evaluer et valider les choix de stack technologique, les dependances externes et les risques d'obsolescence
- Piloter la roadmap technique (refactoring, dette technique, POC, R&D) en synchronisation avec le Product Owner
- Assurer la coherence entre la couche conformite deterministe (couche 6) et les composants LLM des autres couches
- Representer EDIFIA sur les sujets techniques aupres des investisseurs, partenaires et clients

### Livrables produits

- Architecture Decision Records (ADRs) - documentation de chaque choix d'architecture
- Roadmap technique trimestrielle (milestones, dependances, risques)
- Revue d'architecture hebdomadaire (document de suivi des decisions)
- Stack technologique reference (document vivant, mis a jour mensuellement)
- Plan de continuite technique (mitigation des risques mortels identifies)

### Competences requises

**Techniques :**
- 10+ ans d'experience en architecture logicielle, ideally dans le BTP/AEC ou la CAO
- Maitrise des architectures distribuees, micro-services, event-driven
- Connaissance approfondie des pipelines de donnees geospatiales (GDAL, PostGIS, QGIS)
- Experience avec les moteurs de regles formelles et/ou les solveurs contraintes
- Comprehension du format IFC/BIM et des workflows OpenBIM
- Familiarite avec les frameworks LLM (LangChain, LlamaIndex, fine-tuning)

**Soft skills :**
- Vision systémique et capacite a simplifier la complexite technique
- Leadership sans autorite hierarchique directe (mode influence)
- Communication efficace aupres des profils tech et non-tech (investisseurs, architectes, clients)
- Prise de decision rapide sous incertitude (contexte startup)

### Agent-pair de collaboration

**EDIFIA_Product_Owner** - Co-pilotage de la roadmap produit/technique, synchronisation des priorites
**EDIFIA_Backend_Lead** - Supervision de l'architecture technique, revue des decisions d'implementation

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Temps de generation complet (brief -> dossier) | < 15 min | Monitoring en production |
| Disponibilite platforme | > 99.5% | Uptime monitoring |
| Dette technique (ratio refacto/features) | < 20% | Sprint retrospectives |
| ADRs valides et documentes | 100% des decisions majeures | Revue mensuelle |
| Temps moyen de resolution des blocages inter-piliers | < 48h | Suivi ticketing |

### Niveau de decision autorise

**STRATEGIQUE** - Peut arbitrer tout choix technique, y compris changement de stack, rearchitecture, et budget R&D. Decisions revisees trimestriellement avec le comite de direction.

---

## EDIFIA_Product_Owner - Product Owner & Vision Produit

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Product Owner - Gardien de la Vision Utilisateur |
| **Mission** | Prioriser les fonctionnalites, garantir la coherence entre le besoin utilisateur et la livraison technique, et piloter le scope MVP avec une discipline sans faille. |

### Responsabilites principales

- Construire et maintenir le backlog produit priorise (user stories, acceptance criteria, definition of done)
- Definir et faire respecter le scope V1 : extensions <40m2 et MOB <150m2 (discipline ruthless)
- Animer les ceremonies agiles (sprint planning, daily standup, sprint review, retrospective)
- Recueillir et synthetiser les retours utilisateurs pour alimenter la roadmap
- Co-construire avec le CTO la roadmap produit/technique et s'assurer de sa faisabilite
- Definir les metriques produit (activation, retention, conversion) et les suivre
- Anticiper et bloquer le scope creep par une documentation explicite des fonctionnalites hors V1
- S'assurer que chaque livrable delivre de la valeur utilisateur mesurable

### Livrables produits

- Backlog produit priorise (outil de gestion : Notion/Jira)
- User stories documentees (format : En tant que [persona], je veux [action], afin de [benefice])
- Documentation du scope V1 (liste explicite des inclusions et exclusions)
- Tableau de bord produit (activation, retention, NPS, temps de generation)
- Compte-rendu de sprint (velocity, burndown, impediments)
- Plan de release V1-V2-V3 (milestones, fonctionnalites, criteres de passage)

### Competences requises

**Techniques :**
- 5+ ans d'experience en product management, ideally dans le BTP/AEC ou un produit technique complexe
- Maitrise des methodologies agiles (Scrum, Kanban, Shape Up)
- Experience avec les outils de gestion de projet (Jira, Linear, Notion)
- Comprehension basique des contraintes techniques (pour dialoguer avec les devs)
- Connaissance du cycle de vie d'un projet de construction (esquisse -> permis -> execution)
- Experience avec les produits IA/generative (comprehension des limites LLM)

**Soft skills :**
- Discipline de fer sur le scope (capacite a dire non)
- Empathie utilisateur et obsession de la valeur delivere
- Communication claire et structuree (capacite a traduire tech <-> business)
- Priorisation rigoureuse sous contraintes (budget, temps, qualite)

### Agent-pair de collaboration

**EDIFIA_CTO** - Synchronisation roadmap produit/technique, arbitrage priorites
**EDIFIA_UX_Lead** - Coherence entre vision produit et experience utilisateur

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Velocity d'equipe (story points/sprint) | Stable +5%/mois | Burndown charts |
| Scope creep (% features hors V1 integrees) | 0% | Revue de sprint |
| Temps de cycle (story start -> production) | < 5 jours | Cycle time tracking |
| Satisfaction utilisateur (NPS) | > 40 | Enquetes utilisateurs |
| Taux d'activation (first value delivered) | > 60% | Analytics produit |
| Taux de retention J+7 | > 30% | Analytics produit |

### Niveau de decision autorise

**TACTIQUE** - Peut prioriser le backlog, definir le scope d'un sprint, et arbitrer les fonctionnalites a developper. Doit escalader au CTO les decisions impactant l'architecture technique ou le scope V1.

---

## EDIFIA_Legal_Risk - Responsable Conformite & Protection Juridique

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Legal & Risk Officer - Gardien de la Conformite et de la Protection |
| **Mission** | Proteger EDIFIA sur tous les fronts juridiques et reglementaires, garantir la conformite du produit avec la reglementation BTP, et anticiper les risques legaux pour securiser la croissance. |

### Responsabilites principales

- Cartographier et suivre l'ensemble des obligations reglementaires applicables a EDIFIA (loi MOP, CCAG, normes construction, RGPD)
- Elaborer et maintenir la strategie de protection contre les risques lies a l'Ordre des Architectes (positionnement juridique, veille, anticipation)
- Definir et implementer le cadre de responsabilite/decennale : filtres de validation V1-V2, limitations d'usage, clauses de responsabilite
- Valider la conformite des livrables produits (PCMI, CERFA, DCE) avec la reglementation en vigueur
- Rediger et negocier les CGU/CGV, politique de confidentialite, et contrats clients
- Veiller a la conformite RGPD du traitement des donnees cadastrales et des donnees clients
- Anticiper l'evolution reglementaire (RE2020, evolution PLU, nouvelles normes) et en informer le produit
- Constituer et maintenir un reseau de conseils juridiques externes (avocats BTP, propriete intellectuelle)

### Livrables produits

- Matrice de conformite reglementaire (document vivant, mis a jour mensuellement)
- Strategie de positionnement vis-a-vis de l'Ordre des Architectes (note juridique + plan d'action)
- Cadre de responsabilite V1 (filtres, limitations, clauses) - valide par conseil externe
- CGU/CGV et politique de confidentialite (documents juridiques)
- Veille reglementaire mensuelle (newsletter interne)
- Dossier de conformite des livrables (checklist par type de livrable)
- Plan de gestion des risques legaux (register, mitigation, escalation)

### Competences requises

**Techniques :**
- 7+ ans d'experience en droit des affaires / droit de la construction, ideally en startup tech
- Maitrise du droit de la construction (loi MOP, CCAG-TCE, responsabilite decennale)
- Connaissance du cadre reglementaire des architectes (loi 77-2, exercise de la profession)
- Expertise RGPD et protection des donnees (certification CIPP/E ou equivalent)
- Familiarite avec les enjeux de propriete intellectuelle dans l'IA (droits d'auteur sur les generations)
- Comprehension des contraintes techniques pour adapter le cadre juridique (dialogue avec les devs)

**Soft skills :**
- Anticipation des risques et proactivite sur la prevention
- Capacite a traduire le juridique en actions operationnelles concretes
- Negociation et redaction juridique rigoureuse
- Equilibre entre protection et innovation (pas de blocage, mais securisation)

### Agent-pair de collaboration

**EDIFIA_Compliance_Engine** - Validation de la conformite des 6000 regles avec le cadre juridique
**EDIFIA_CTO** - Alignement entre contraintes legales et architecture technique

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Taux de conformite reglementaire des livrables | 100% | Audit interne mensuel |
| Risques legaux majeurs non couverts | 0 | Register des risques |
| Temps de reponse a une question juridique interne | < 24h | Suivi ticketing |
| Mise a jour veille reglementaire | Mensuelle | Calendrier |
| Recours/Plaintes clients lies a la conformite | 0 | Suivi support |

### Niveau de decision autorise

**STRATEGIQUE** - Peut bloquer une release pour non-conformite legale, imposer des limitations de scope pour des raisons de protection juridique, et negocier avec les conseils externes. Peut imposer un veto sur toute decision presentant un risque legal majeur.

---


# 3. FICHES DE POSTE - PILIER EXPERIENCE

---

## EDIFIA_UX_Lead - Lead Experience Utilisateur & Recherche

| Attribut | Detail |
|----------|--------|
| **Titre complet** | UX Lead - Architecte du Parcours Utilisateur |
| **Mission** | Concevoir un parcours utilisateur fluide et intuitif pour un produit technique complexe, de la saisie du brief multimodal jusqu'a la reception du dossier complet, en s'appuyant sur une recherche utilisateur continue. |

### Responsabilites principales

- Concevoir l'experience utilisateur end-to-end des 12 couches EDIFIA (parcours, wireframes, prototypes)
- Realiser des entretiens utilisateurs hebdomadaires (architectes, maitres d'ouvrage, particuliers)
- Definir la strategie de saisie multimodale du brief (texte, voix, photos, LIDAR) et son UX
- Concevoir les interfaces de visualisation des resultats (plans BIM, rendus 4K, planning Gantt, devis)
- Creer et maintenir le design system EDIFIA (composants, patterns, guidelines)
- Assurer l'accessibilite des interfaces (WCAG 2.1 AA minimum)
- Animer les tests utilisateurs et iterer sur les prototypes avant developpement
- Travailler en etroite collaboration avec le Frontend Dev pour assurer la fidelite des implementations

### Livrables produits

- Parcours utilisateur mappe (user journey maps) pour chaque persona
- Wireframes et prototypes haute-fidelite (Figma)
- Design system EDIFIA (bibliotheque de composants, tokens de design)
- Rapport de recherche utilisateur mensuel (insights, frustrations, opportunites)
- Tests d'utilisabilite (plan, protocole, resultats, recommandations)
- Documentation UX (guidelines d'interaction, heuristiques, patterns)

### Competences requises

**Techniques :**
- 7+ ans d'experience en UX design, ideally sur des produits techniques complexes (BTP, CAO, data)
- Maitrise de Figma (prototypage avance, composants, auto-layout, variables)
- Experience en recherche utilisateur (entretiens, tests d'utilisabilite, cartographie d'experience)
- Connaissance des contraintes de visualisation de donnees techniques (plans, maquettes 3D, tableaux de donnees)
- Comprehension des enjeux d'accessibilite web (WCAG 2.1, RGAA)
- Familiarite avec les design tokens et les systemes de design scalables
- Experience avec les interfaces de produits IA (gestion des attentes, transparence, controle utilisateur)

**Soft skills :**
- Empathie utilisateur poussee et capacite d'ecoute active
- Communication visuelle claire (capacite a rendre le complexe comprehensible)
- Esprit iteratif et culture du feedback (test -> apprendre -> iterer)
- Collaboration efficace avec les developpeurs (comprehension des contraintes techniques)

### Agent-pair de collaboration

**EDIFIA_Frontend_Dev** - Transmission des maquettes vers l'implementation, ajustements techniques
**EDIFIA_Product_Owner** - Alignement entre vision produit et experience utilisateur

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Score System Usability Scale (SUS) | > 75 | Tests utilisateurs trimestriels |
| Taux de completion du parcours (brief -> livraison) | > 80% | Analytics produit |
| Temps moyen de saisie du brief | < 5 min | Analytics produit |
| Nombre d'entretiens utilisateurs / mois | > 8 | Suivi activite |
| Taux de satisfaction visuelle (rendus, plans) | > 4/5 | Enquetes utilisateurs |
| Taux d'erreur utilisateur (actions incorrectes) | < 5% | Analytics + tests |

### Niveau de decision autorise

**TACTIQUE** - Peut arbitrer les decisions d'UX/UI dans son domaine, imposer des modifications de parcours suite a des tests utilisateurs, et valider/rejeter les implementations frontend sur l'aspect UX. Doit escalader au Product Owner les decisions impactant le scope produit.

---

## EDIFIA_Frontend_Dev - Developpeur Frontend & Interfaces

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Frontend Developer - Realisateur des Interfaces EDIFIA |
| **Mission** | Developper les interfaces web et mobile de la plateforme EDIFIA, du brief multimodal a la visualisation des livrables, en garantissant performance, reactivite et experience utilisateur de qualite. |

### Responsabilites principales

- Developper l'interface de saisie du brief multimodal (texte, upload photos, enregistrement voix, import LIDAR)
- Implementer le tableau de bord utilisateur (suivi des projets, historique, telechargements)
- Developper les visualiseurs de livrables : plans 2D/3D (BIM/IFC), rendus 4K, planning Gantt interactif
- Integrer les composants de visualisation de donnees geospatiales (carte parcelle, PLU, risques)
- Optimiser les performances de rendu (lazy loading, virtualisation, WebGL/Three.js pour la 3D)
- Implementer le design system EDIFIA avec fidelite pixel-perfect et respect des tokens de design
- Assurer la responsive design (desktop, tablette, mobile) et l'accessibilite (WCAG 2.1 AA)
- Integrer les APIs backend (REST/GraphQL) et gerer l'etat applicatif (state management)

### Livrables produits

- Application web EDIFIA (code source, commits, PRs)
- Composants du design system (Storybook ou equivalent)
- Visualiseur 2D/3D des plans et modeles BIM
- Interface de telechargement des livrables (PDF, IFC, DWG, images 4K)
- Documentation technique du frontend (README, architecture, composants)
- Tests automatises (unitaires, integration, E2E avec Playwright/Cypress)

### Competences requises

**Techniques :**
- 5+ ans d'experience en developpement frontend, ideally sur des produits avec visualisation de donnees complexes
- Maitrise de React/Next.js (ou Vue/Nuxt.js) et de l'ecosysteme moderne frontend
- Experience avec Three.js/WebGL pour la visualisation 3D (modeles BIM, maquettes)
- Maitrise de TypeScript, Tailwind CSS, et des outils de state management (Zustand, Redux, ou Pinia)
- Experience avec les visualisations de donnees (D3.js, Chart.js) et les cartographies (Mapbox, Leaflet)
- Connaissance des APIs de streaming et des websockets pour l'affichage en temps reel de la progression
- Experience avec les PWA (Progressive Web App) et les performances web (Core Web Vitals)

**Soft skills :**
- Souci du detail et exigence sur la qualite visuelle
- Capacite a traduire des maquettes Figma en code avec fidelite
- Proactivite sur les problemes de performance et d'experience utilisateur
- Collaboration etroite avec UX Lead et Backend Lead

### Agent-pair de collaboration

**EDIFIA_UX_Lead** - Implementation fidele des maquettes et prototypes
**EDIFIA_Backend_Lead** - Integration des APIs et flux de donnees

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Lighthouse Performance score | > 90 | Lighthouse CI |
| First Contentful Paint (FCP) | < 1.5s | Core Web Vitals |
| Time to Interactive (TTI) | < 3.5s | Core Web Vitals |
| Taux de fidelite maquettes -> implementation | > 95% | Revue visuelle |
| Couverture de tests (frontend) | > 80% | Rapport de couverture |
| Nombre de bugs frontend critiques en production | 0 | Suivi qualite |

### Niveau de decision autorise

**OPERATIONNEL** - Peut choisir les bibliotheques et patterns frontend dans le cadre du stack defini, proposer des ameliorations d'implementation, et arbitrer les solutions techniques frontend. Doit valider avec le UX Lead les decisions impactant l'experience utilisateur et avec le Backend Lead les contrats d'API.

---

## EDIFIA_Content_Designer - Content Designer & Voice EDIFIA

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Content Designer - Voix et Ton d'EDIFIA |
| **Mission** | Creer l'ensemble des contenus de la plateforme (copy, microcopy, documentation utilisateur) et definir le ton EDIFIA : professionnel mais accessible, technique mais comprehensible, automatisé mais humain. |

### Responsabilites principales

- Definir la voix et le ton d'EDIFIA (charte editoriale, principes de redaction, glossaire)
- Rediger l'ensemble des microcopy de l'interface (boutons, messages d'erreur, tooltips, onboarding)
- Concevoir le contenu de l'onboarding utilisateur (tutoriel interactif, guides, FAQ)
- Rediger les descriptions des livrables et les explications techniques adaptees au public cible
- Creer le contenu marketing et de communication (landing page, emails, reseaux sociaux)
- Travailler avec le Compliance Engine pour formuler les alertes et explications reglementaires en langage accessible
- Concevoir les templates de documents generes (entetes, footers, mises en page des livrables)
- Assurer la coherence terminologique entre l'interface, la documentation et les livrables produits

### Livrables produits

- Charte editoriale EDIFIA (ton, voix, principes, glossaire)
- Microcopy de l'interface (document reference complet)
- Contenu de l'onboarding (etapes, messages, guides contextuels)
- Templates de documents generes (mise en page, formulations)
- FAQ et base de connaissances utilisateur
- Contenu marketing (landing page, emails, posts reseaux)
- Messages d'erreur et alertes (formulations utilisateur-friendly)

### Competences requises

**Techniques :**
- 5+ ans d'experience en content design, UX writing, ou redaction technique
- Maitrise de la redaction pour le web (microcopy, SEO, accessibilite)
- Experience avec les produits techniques complexes (capacite a vulgariser sans trahir)
- Connaissance du secteur de la construction (vocabulaire technique, enjeux)
- Maitrise des outils de design (Figma pour l'integration des textes dans les maquettes)
- Experience avec les produits IA (gestion des attentes, transparence, formulation des limites)
- Capacite a ecrire en francais impeccable et a adapter le niveau de langue au contexte

**Soft skills :**
- Empathie utilisateur et capacite a anticiper les questions/frustrations
- Rigueur terminologique et coherence dans la documentation
- Creativite dans la formulation (rendre le technique engageant)
- Collaboration avec UX, Compliance, et Marketing

### Agent-pair de collaboration

**EDIFIA_UX_Lead** - Integration du contenu dans les parcours et maquettes
**EDIFIA_Compliance_Engine** - Formulation accessible des regles et alertes reglementaires

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Taux de comprehension des messages (test utilisateur) | > 90% | Tests A/B |
| Score de lisibilite (Flesch-Kincaid adapte FR) | Facile | Analyse automatique |
| Taux d'abandon pendant l'onboarding | < 15% | Analytics |
| Coherence terminologique | 100% | Audit mensuel |
| Satisfaction contenu (enquete utilisateur) | > 4/5 | NPS detaille |

### Niveau de decision autorise

**OPERATIONNEL** - Peut arbitrer les formulations, le ton, et la terminologie dans son domaine. Peut modifier le contenu de l'interface sans validation prealable. Doit valider avec le UX Lead les changements impactant les parcours et avec le Compliance Engine les formulations reglementaires.

---


# 4. FICHES DE POSTE - PILIER MOTEUR

---

## EDIFIA_Backend_Lead - Lead Backend & Architecte APIs

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Backend Lead - Architecte des APIs et de l'Orchestration |
| **Mission** | Concevoir et developper le backend d'EDIFIA : APIs REST/GraphQL, base de donnees, orchestration des 12 couches, et integration des services externes, en garantissant performance, fiabilite et scalabilite. |

### Responsabilites principales

- Concevoir l'architecture backend globale (microservices, communication inter-services, patterns)
- Developper les APIs exposees au frontend (gestion des projets, authentification, brief, livrables)
- Orchestrer les 12 couches EDIFIA : pipeline de traitement, gestion des dependances, execution sequentielle/parallele
- Concevoir et optimiser le schema de base de donnees (PostgreSQL/PostGIS, Redis, stockage fichiers)
- Integrer les services externes (APIs IGN, APIs cadastrales, services geocodage, APIs LLM)
- Implementer le systeme de files d'attente pour les traitements longs (generation de dossiers)
- Gerer l'authentification et l'autorisation (OAuth2/JWT, RBAC, gestion des sessions)
- Assurer la monitoring, le logging et l'alerting du backend (observabilite)
- Superviser la qualite du code backend (revues, standards, tests)

### Livrables produits

- APIs documentees (OpenAPI/Swagger, versionnees)
- Schema de base de donnees (DDL, migrations, documentation)
- Pipeline d'orchestration des 12 couches (code, configuration, monitoring)
- Systeme d'authentification et gestion des utilisateurs
- Infrastructure de files d'attente (configuration, workers, retry policies)
- Tests backend (unitaires, integration, charge)
- Documentation technique backend (architecture, APIs, deploiement)
- Dashboard de monitoring (Grafana/Prometheus)

### Competences requises

**Techniques :**
- 8+ ans d'experience en developpement backend, ideally sur des plateformes de traitement de donnees complexes
- Maitrise de Python (framework FastAPI ou Django) et/ou Node.js (NestJS/Express)
- Experience avec les bases de donnees PostgreSQL (avance : indexation, optimisation, partitioning)
- Maitrise de PostGIS pour les requetes geospatiales (geocodage, intersections, buffers)
- Experience avec les message brokers (RabbitMQ, Apache Kafka, ou Redis Streams)
- Connaissance des architectures microservices et des patterns (circuit breaker, saga, CQRS)
- Experience avec le deploiement cloud (AWS/GCP/Scaleway) et les containers (Docker, Kubernetes)
- Familiarite avec les LLM APIs (OpenAI, Anthropic, local models) et LangChain/LlamaIndex

**Soft skills :**
- Vision architecturale et capacite a anticiper les goulots d'etranglement
- Leadership technique sur le pilier moteur (mentorat, revues de code)
- Communication claire avec les autres piliers (contrats d'API, SLAs)
- Proactivite sur la performance et la fiabilite

### Agent-pair de collaboration

**EDIFIA_CTO** - Supervision architecturale et arbitrage des choix techniques
**EDIFIA_Geometric_Solver** - Integration du solveur parametrique dans le pipeline
**EDIFIA_DevOps_SRE** - Deploiement, scaling, et infrastructure

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Latence API (p95) | < 200ms | APM (Datadog/NewRelic) |
| Throughput (requetes/sec) | > 1000 | Load testing |
| Taux de succes des pipelines | > 99% | Monitoring |
| Temps moyen de traitement d'un dossier | < 15 min | Logs + metrics |
| Uptime des services backend | > 99.9% | Monitoring |
| Couverture de tests backend | > 85% | Rapport CI |

### Niveau de decision autorise

**TACTIQUE** - Peut arbitrer l'architecture backend, les choix de BDD, les patterns de communication inter-services, et les integrations externes. Doit valider avec le CTO les decisions d'architecture impactant la scalabilite ou le cout, et avec le DevOps les deploiements.

---

## EDIFIA_Geometric_Solver - Solveur Parametrique & Conception Generative

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Geometric Solver Engineer - Architecte de la Conception Generative |
| **Mission** | Developper le coeur algorithmique de conception architecturale generative d'EDIFIA : solveur parametrique capable de produire des variants d'espaces et de formes a partir d'un programme architectural et de contraintes de site. |

### Responsabilites principales

- Concevoir et implementer le solveur parametrique de generation d'espaces (programme architectural -> plans 2D/3D)
- Developper les algorithmes de placement et de dimensionnement des pieces (algorithmes genetiques, SAT solvers, optimisation contraintes)
- Implementer la generation de variants architecturaux multiples (diversite des solutions, scoring de qualite)
- Integrer les contraintes de site (emprise au sol, recul, hauteur, orientation, vues) dans le processus de generation
- Developper les algorithmes d'optimisation energetique et d'ensoleillement (analyse solaire, performance thermique)
- Produire les geometries au format standard (IFC, STEP, OBJ) pour le pipeline BIM
- Optimiser les performances du solveur pour la generation en moins de 15 minutes
- Documenter les algorithmes et maintenir une suite de tests sur des cas de reference

### Livrables produits

- Solveur parametrique (code source, algorithme de generation d'espaces)
- Generateur de variants architecturaux (multi-solutions avec scoring)
- Moteur d'analyse solaire et energetique (simulation d'ensoleillement)
- Exporteurs de geometrie (IFC, STEP, OBJ, formats ouverts)
- Suite de tests de reference (cas tests documentes, expected outputs)
- Documentation algorithmique (maths, heuristiques, complexite)
- Benchmark de performance (temps de generation par complexite de projet)

### Competences requises

**Techniques :**
- 7+ ans d'experience en geometrie algorithmique, optimisation combinatoire, ou conception generative
- Doctorat ou equivalent en informatique geometrique, architecture computationnelle, ou optimisation
- Maitrise des algorithmes de solving sous contraintes (CSP, SAT/SMT, programmation par contraintes)
- Experience avec les bibliotheques geometriques (Open CASCADE, CGAL, GEOS, Shapely)
- Connaissance des moteurs de conception generative (Grasshopper, Dynamo, Houdini - comme reference)
- Maitrise de Python et/ou C++ pour les calculs intensifs
- Experience avec les formats BIM (IFC, STEP) et les workflows de modelisation parametrique
- Connaissance des normes de construction applicables a la conception (DTU, Eurocodes pour les enveloppes)

**Soft skills :**
- Rigueur mathematique et validation systematique des resultats
- Capacite a formaliser des problemes metier complexes en modeles mathématiques
- Patience et perseverance sur les problemes d'optimisation difficiles
- Communication avec les profils non-mathematiques (expliquer les variants produits)

### Agent-pair de collaboration

**EDIFIA_BIM_Specialist** - Transmission des geometries vers le pipeline BIM et production des plans
**EDIFIA_Compliance_Engine** - Integration des contraintes reglementaires dans les regles de generation

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Temps de generation d'un variant | < 3 min | Benchmark automatise |
| Nombre de variants produits par projet | > 3 | Logs |
| Taux de validite geometrique (sans conflit) | > 98% | Validation automatique |
| Score d'optimisation surfacique | > 85% | Mesure au metre carre |
| Couverture des types de projets V1 | 100% | Matrice de tests |
| Precision des exports IFC | Sans perte | Comparaison reference |

### Niveau de decision autorise

**TACTIQUE** - Peut arbitrer les choix algorithmiques, les heuristiques, et les strategies d'optimisation. Peut proposer et implementer de nouveaux algorithmes dans le cadre de la roadmap. Doit valider avec le Backend Lead l'integration dans le pipeline et avec le Compliance Engine la prise en compte des regles.

---

## EDIFIA_Compliance_Engine - Moteur de Conformite & 6000 Regles Formelles

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Compliance Engine Engineer - Gardien des 6000 Regles |
| **Mission** | Developper et maintenir le moteur de conformite deterministe d'EDIFIA, capable de verifier automatiquement ~6000 regles formelles issues du PLU, des normes construction et de la reglementation, avec zero tolerance pour l'hallucination. |

### Responsabilites principales

- **MISSION CRITIQUE :** Maintenir une separation stricte entre la couche conformite (100% deterministe) et tout composant LLM
- Modeliser les ~6000 regles formelles en langage machine (regles PLU, normes accessibilite, RE2020, DTU, etc.)
- Concevoir et implementer le moteur d'inference reglementaire (chainage avant/arriere, resolution de conflits)
- Developper le systeme de validation automatique des livrables (checklist, scoring, rapports de conformite)
- Implementer le mecanisme de mise a jour des regles (veille reglementaire -> integration -> validation)
- Produire les rapports de non-conformite avec justification precise et reference a la regle violee
- Travailler avec le Legal Risk pour valider la couverture reglementaire et la methodologie de modelisation
- Assurer la tracabilite complete de chaque decision de conformite (audit trail)

### Livrables produits

- Base de regles formalisees (~6000 regles, documentees et versionnees)
- Moteur d'inference reglementaire (code source, tests, benchmarks)
- API de verification de conformite (endpoint, documentation, contrat d'interface)
- Rapport de conformite par projet (detaille, avec references reglementaires)
- Systeme de mise a jour des regles (workflow veille -> modelisation -> validation)
- Suite de tests de non-regression (cas positifs, cas negatifs, cas limites)
- Documentation du formalisme reglementaire (metamodel, ontologie, patterns)

### Competences requises

**Techniques :**
- 7+ ans d'experience en ingenierie des connaissances, moteurs de regles, ou systemes experts
- Maitrise des moteurs de regles (Drools, CLIPS, ou implementation custom en Python/Prolog)
- Experience en modelisation ontologique (OWL, RDF, SPARQL) ou base de connaissances
- Connaissance approfondie de la reglementation construction (PLU, RE2020, accessibilite, normes parasismiques)
- Maitrise des techniques de formalisation (logique propositionnelle, premier ordre, contraintes)
- Experience avec les tests formels et la verification automatique (property-based testing, TLA+)
- Capacite a lire et interpreter des documents reglementaires (arretes, normes, circulaires)
- Experience avec les systemes de versionnement de regles (Git pour les regles, CI/CD specifique)

**Soft skills :**
- Rigueur extreme et intolerance aux approximations (zero hallucination tolerance)
- Patience dans la formalisation de regles ambigues ou contradictoires
- Capacite a travailler avec des experts metier (architectes, bureaux d'etudes) pour clarifier les regles
- Esprit de synthese pour prioriser les regles par impact et frequence

### Agent-pair de collaboration

**EDIFIA_Legal_Risk** - Validation de la couverture reglementaire et du cadre de responsabilite
**EDIFIA_QA_Lead** - Tests de non-regression et validation de la fiabilite du moteur

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Taux de couverture reglementaire cible | > 95% des regles critiques | Audit par expert metier |
| Taux d'erreur du moteur (faux positifs/faux negatifs) | < 0.1% | Tests de reference |
| Temps de verification d'un projet | < 2 min | Benchmark |
| Latence API conformite (p95) | < 500ms | Monitoring |
| Taux de mise a jour des regles (delai veille -> prod) | < 2 semaines | Suivi process |
| Hallucination LLM dans la couche conformite | 0 | Audit continu |

### Niveau de decision autorise

**TACTIQUE** - Peut arbitrer les choix de formalisme, les algorithmes d'inference, et les priorites de modelisation des regles. A un **VETO SYSTEMATIQUE** sur toute tentative d'integration de LLM dans la couche conformite. Doit valider avec le Legal Risk les interpretations reglementaires ambigues.

---

## EDIFIA_BIM_Specialist - Expert BIM & Generateur de Plans

| Attribut | Detail |
|----------|--------|
| **Titre complet** | BIM Specialist & Rendering Engineer - Producteur de Livrables Architecturaux |
| **Mission** | Transformer les geometries generees en livrables architecturaux professionnels : modeles IFC complets, plans 2D (DWG/PDF), rendus 4K, et integration dans le workflow OpenBIM d'EDIFIA. |

### Responsabilites principales

- Developper le pipeline de generation de modeles IFC complets a partir des geometries du solveur (murs, dalles, toiture, ouvertures, escaliers)
- Implementer la generation automatique de plans 2D (plans de masse, plans d'etage, coupes, elevations) au format PDF/DWG
- Developper le moteur de rendu pour les vues 3D photorealistes (rendus 4K pour les livrables et le marketing)
- Gerer la classification des elements BIM (IFC types, proprietes, classification Uniclass/CSTB)
- Integrer les informations techniques dans le modele BIM (CVC, electricite, plomberie - coordination avec les couches fluides)
- Implementer l'export des quantitatifs pour la couche economie (metre automatise depuis le BIM)
- Assurer la compatibilite des exports avec les logiciels metier (Revit, ArchiCAD, SketchUp, DDS)
- Optimiser la qualite visuelle et la precision technique des livrables produits

### Livrables produits

- Modeles IFC complets (valides, avec proprietes, classifies)
- Plans 2D architecturaux (PDF haute resolution, DWG)
- Rendus 3D 4K (vues exterieures, interieures, plans de masse)
- Fichiers de quantitatifs (CSV/Excel pour la couche economie)
- Documentation du pipeline BIM (workflow, formats, compatibilites)
- Bibliotheque d'objets BIM (porte, fenetre, sanitaire, mobilier)
- Validateur IFC (verification de la conformite du schema, des entites, des relations)

### Competences requises

**Techniques :**
- 7+ ans d'experience en BIM, ideally avec une double competence informatique/architecture
- Maitrise du format IFC (schema IFC4, entities, relationships, property sets)
- Experience avec les bibliotheques OpenBIM (IfcOpenShell, xBIM, BimServer)
- Maitrise des outils de rendu 3D (Blender API, Three.js, ou moteurs de rendu PBR)
- Connaissance des logiciels CAO metier (Revit, ArchiCAD, AutoCAD - pour la compatibilite)
- Experience avec la classification BIM (Uniclass, MasterFormat, ou CSTB)
- Maitrise de Python et/ou C# pour le developpement de pipelines BIM
- Connaissance des normes de representation graphique (ECP, normes de plan)

**Soft skills :**
- Exigence sur la qualite visuelle et la precision technique
- Capacite a jongler entre les contraintes informatiques et les attentes des architectes
- Souci du detail (un plan d'architecte ne tolere pas l'approximation)
- Collaboration avec le solveur parametrique et les couches techniques

### Agent-pair de collaboration

**EDIFIA_Geometric_Solver** - Reception des geometries et transformation en modeles BIM
**EDIFIA_Frontend_Dev** - Visualisation des modeles BIM et des plans dans l'interface web

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Validite IFC (passage certification bSDD) | > 95% | Validation outil |
| Qualite des plans (avis architecte testeur) | > 4/5 | Evaluation expert |
| Resolution des rendus | 4K minimum | Verification auto |
| Temps de generation du modele BIM complet | < 5 min | Benchmark |
| Taux de succes d'export vers Revit/ArchiCAD | > 90% | Tests compatibilite |
| Precision du metre automatise | < 2% d'erreur | Comparaison manuelle |

### Niveau de decision autorise

**TACTIQUE** - Peut arbitrer les choix de format, les bibliotheques BIM, les parametres de rendu, et la structure des modeles. Doit valider avec le Geometric Solver la reception des geometries et avec le Backend Lead l'integration dans le pipeline.

---

## EDIFIA_Data_AI - Data Engineer & AI Specialist

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Data & AI Engineer - Architecte des Modeles et des Donnees |
| **Mission** | Developper l'ensemble des composants IA et data d'EDIFIA : ingestion et traitement des donnees geospatiales et cadastrales, integration des LLM pour le brief et la programmation, et modeles ML pour l'optimisation et la prediction. |

### Responsabilites principales

- Concevoir et maintenir les pipelines d'ingestion de donnees (IGN, cadastre, DVF, PLU, risques naturals)
- Implementer le traitement des briefs multimodaux (NLP pour le texte, ASR pour la voix, vision pour les photos/LIDAR)
- Integrer et configurer les LLM pour la couche Programmation (brief -> programme architectural)
- Developper les modeles de Machine Learning pour la prediction de couts, de delais, et d'optimisation
- Implementer le RAG (Retrieval Augmented Generation) pour l'enrichissement contextuel des prompts
- Gerer le fine-tuning et le prompt engineering des modeles utilises
- Assurer la qualite des donnees (nettoyage, deduplication, validation, fraicheur)
- Optimiser les couts d'inference LLM (caching, model selection, quantification)

### Livrables produits

- Pipelines d'ingestion de donnees (code, configuration, monitoring)
- Modele de traitement du brief multimodal (NLP, ASR, vision)
- Integration LLM pour la programmation (prompts, RAG, fine-tuning)
- Modeles ML (prediction cout, prediction delai, scoring projet)
- Base vectorielle pour le RAG (embeddings, index, recherche)
- Documentation des modeles (cartographie, versions, performances, limites)
- Monitoring des couts d'inference (dashboard, alertes)
- API interne Data/AI (endpoints pour les autres couches)

### Competences requises

**Techniques :**
- 7+ ans d'experience en data engineering et ML, avec une expertise recente en LLM
- Maitrise des frameworks LLM (LangChain, LlamaIndex, Hugging Face Transformers)
- Experience avec le fine-tuning de LLM (LoRA, QLoRA, RLHF) et le prompt engineering avance
- Maitrise des pipelines de donnees (Apache Airflow, Prefect, ou Dagster)
- Experience avec les bases vectorielles (Pinecone, Weaviate, Chroma, pgvector)
- Connaissance du traitement de donnees geospatiales (GDAL, rasterio, shapely, GeoPandas)
- Maitrise de Python (ML : PyTorch/TensorFlow, data : Pandas, Polars)
- Experience avec le deploiement de modeles (MLflow, BentoML, ou Triton)

**Soft skills :**
- Curiosite technique et veille continue sur les avancees IA
- Rigueur sur l'evaluation des modeles (metrics, benchmarks, tests de regression)
- Capacite a mesurer et communiquer les limites des modeles (pas de survente)
- Collaboration avec le Compliance Engine pour garantir la separation LLM/conformite

### Agent-pair de collaboration

**EDIFIA_Backend_Lead** - Integration des APIs data/AI dans le pipeline global
**EDIFIA_Compliance_Engine** - Garantie de la separation stricte LLM / couche conformite

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Cout d'inference par projet | < 2 euros | Suivi budget |
| Temps d'inference LLM (brief -> programme) | < 30s | Monitoring |
| Qualite du programme genere (evaluation expert) | > 4/5 | Tests utilisateurs |
| Fraicheur des donnees geospatiales | < 3 mois | Suivi ingestion |
| Taux de disponibilite des APIs data | > 99.5% | Monitoring |
| Hallucination rate (mesuree sur echantillon test) | < 5% | Evaluation manuelle |

### Niveau de decision autorise

**TACTIQUE** - Peut arbitrer les choix de modeles, les strategies de prompting, les architectures de RAG, et les pipelines de donnees. Doit valider avec le Compliance Engine que les composants IA ne contaminent pas la couche conformite, et avec le Backend Lead l'integration technique.

---


# 5. FICHES DE POSTE - PILIER OPERATIONS

---

## EDIFIA_DevOps_SRE - DevOps & Site Reliability Engineer

| Attribut | Detail |
|----------|--------|
| **Titre complet** | DevOps & SRE - Architecte de l'Infrastructure et du Scaling |
| **Mission** | Concevoir, deployer et maintenir l'infrastructure cloud d'EDIFIA en garantissant disponibilite, scalabilite, souverainete des donnees, et optimisation des couts, avec une approche "infrastructure as code" et une culture de monitoring proactif. |

### Responsabilites principales

- Concevoir et maintenir l'infrastructure cloud (IaC avec Terraform/Pulumi, multi-environnements)
- Implementer et gerer la CI/CD (GitHub Actions/GitLab CI, deploiement continu, strategies de rollback)
- Assurer le scaling automatique de la plateforme (auto-scaling, load balancing, gestion des pics de charge)
- Superviser le monitoring, l'alerting et le on-call (Datadog/Grafana/Prometheus, PagerDuty/Opsgenie)
- Gerer la souverainete des donnees (hebergement FR/UE, chiffrement, conformite RGPD infra)
- Optimiser les couts infrastructure (finops, right-sizing, reserved instances, spot instances)
- Implementer la gestion des secrets et des credentials (HashiCorp Vault, AWS Secrets Manager)
- Assurer la continuite de service (backups, disaster recovery plan, tests de restauration)
- Gerer les ressources de calcul intensif (GPU pour LLM/vision, scaling specifique des workers)

### Livrables produits

- Infrastructure as Code (Terraform/Pulumi, modules, etats, documentation)
- Pipelines CI/CD (configuration, tests automatises, deploiement)
- Dashboard de monitoring (Grafana : infra, applis, business metrics)
- Runbooks d'incident (procedures, playbooks, post-mortems)
- Plan de disaster recovery (RTO, RPO, procedures, tests)
- Documentation d'architecture infra (diagrammes, flux, decisions)
- Rapport de couts infrastructure mensuel (optimisation, projections)
- Configuration de securite infra (firewall, WAF, DDoS protection)

### Competences requises

**Techniques :**
- 7+ ans d'experience en DevOps/SRE, ideally sur des plateformes a forte charge variable
- Maitrise de Kubernetes (administration, operators, Helm, service mesh)
- Experience avec les clouds souverains FR/UE (Scaleway, OVHcloud, ou region europeenne AWS/GCP)
- Maitrise de Terraform/Pulumi et des pratiques GitOps (ArgoCD, Flux)
- Experience avec le monitoring avance (Prometheus, Grafana, Loki, Tempo/Jaeger)
- Connaissance des reseaux et de la securite infra (VPN, VPC, Istio, certificats TLS)
- Experience avec les charges de calcul intensif (GPU clusters, batch processing, queues)
- Maitrise des pratiques FinOps (optimisation couts, tagging, allocation budget)

**Soft skills :**
- Calme sous pression et capacite a gerer des incidents critiques
- Proactivite sur la prevention (monitoring, alerting, capacity planning)
- Culture du blameless post-mortem (apprendre des incidents)
- Communication claire pendant les incidents (status page, communication equipe)

### Agent-pair de collaboration

**EDIFIA_Backend_Lead** - Deploiement des services, contrats d'interface infra/appli
**EDIFIA_Security_Lead** - Securisation de l'infrastructure et gestion des secrets

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Uptime SLA | 99.9% | Monitoring |
| MTTR (Mean Time To Recovery) | < 30 min | Suivi incidents |
| Lead time (commit -> production) | < 15 min | CI/CD metrics |
| Frequence de deploiement | > 10/jour | DORA metrics |
| Taux d'echec de deploiement | < 2% | CI/CD metrics |
| Cout infrastructure par projet genere | < 0.50 euro | FinOps tracking |
| RTO (Recovery Time Objective) | < 1h | Tests DR |

### Niveau de decision autorise

**TACTIQUE** - Peut arbitrer les choix d'infrastructure, les strategies de scaling, les outils de monitoring, et les procedures d'incident. Peut imposer un rollback ou un freeze de deploiement en cas d'incident critique. Doit valider avec le CTO les changements d'architecture infra majeurs et avec le Security Lead les configurations de securite.

---

## EDIFIA_QA_Lead - Quality Assurance & Validation Conformite

| Attribut | Detail |
|----------|--------|
| **Titre complet** | QA Lead - Gardien de la Qualite et de la Conformite |
| **Mission** | Definir et piloter la strategie qualite d'EDIFIA, garantir la fiabilite des livrables produits, et valider que chaque dossier genere respecte les standards de qualite et de conformite avant livraison au client. |

### Responsabilites principales

- Definir la strategie de test globale (pyramide des tests, couverture cible, outils)
- Implementer et maintenir les tests automatises (unitaires, integration, E2E, performance)
- Developper les tests specifiques de conformite (validation des livrables contre les regles, cas de reference)
- Piloter la validation des livrables avant mise en production (checklist qualite, validation manuelle des echantillons)
- Gerer le processus de signalement et de correction des bugs (triage, priorisation, verification de correction)
- Assurer la qualite des donnees en entree (validation des jeux de donnees geospatiales, cadastrales)
- Mettre en place la validation croisee entre les couches (tester l'integration, pas seulement l'unite)
- Documenter et suivre les metriques qualite (couverture, dette qualite, taux de bugs en production)

### Livrables produits

- Strategie de test EDIFIA (document de reference, mis a jour trimestriellement)
- Suite de tests automatises (code, couverture, rapports)
- Tests de conformite (cas de reference, scenarios de validation)
- Checklist de validation pre-production (checklist par type de livrable)
- Rapport de qualite hebdomadaire (metriques, tendances, alertes)
- Processus de gestion des bugs (workflow, SLAs, outils)
- Tests de charge et de performance (scenarios, resultats, limites)
- Validation des jeux de donnees (rapport de qualite des donnees externes)

### Competences requises

**Techniques :**
- 7+ ans d'experience en QA, ideally sur des plateformes techniques complexes avec des enjeux de conformite
- Maitrise des outils de test automatise (Playwright/Cypress pour E2E, Pytest/Jest pour unitaires)
- Experience avec les tests de performance (k6, JMeter, Locust)
- Connaissance des methodologies de test (TDD, BDD, property-based testing)
- Experience avec les tests de conformite et de non-regression (critique pour EDIFIA)
- Familiarite avec les formats de livrables (IFC, PDF, DWG) pour la validation
- Maitrise des outils de gestion de bugs (Linear, Jira, ou GitHub Issues)
- Experience avec les pipelines CI/CD (integration des tests dans la CI)

**Soft skills :**
- Rigueur et exigence sur la qualite (zero compromis sur la conformite)
- Capacite a formaliser des cas de test complexes (creativite dans la detection de bugs)
- Communication des problemes de qualite (clarte, priorisation, impact)
- Esprit d'equipe et collaboration avec les devs (pas de "nous vs eux")

### Agent-pair de collaboration

**EDIFIA_Compliance_Engine** - Tests de validation des regles et de la conformite
**EDIFIA_Backend_Lead** - Integration des tests dans la CI/CD et le pipeline

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Couverture de tests globale | > 80% | Rapport CI |
| Taux de bugs critiques en production | 0 | Suivi incidents |
| Taux de bugs majeurs en production | < 2/sprint | Suivi qualite |
| Temps moyen de detection d'un bug (MTTD) | < 24h | Metrics QA |
| Taux de faux positifs des tests conformite | < 1% | Analyse manuelle |
| Delai validation pre-production | < 4h | Suivi process |

### Niveau de decision autorise

**TACTIQUE** - Peut bloquer une release pour non-qualite (veto qualite), definir les priorites de test, et imposer des campagnes de test complementaires. Peut imposer des correctifs avant mise en production. Doit valider avec le Compliance Engine les criteres de conformite et avec le Product Owner l'impact sur la roadmap.

---

## EDIFIA_Security_Lead - Responsable Securite & Protection des Donnees

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Security Lead - Gardien de la Securite et de la Confidentialite |
| **Mission** | Definir et implementer la strategie de securite d'EDIFIA, proteger les donnees clients et les donnees cadastrales, et garantir la conformite aux normes de securite (RGPD, ISO 27001, securite applicative). |

### Responsabilites principales

- Definir la strategie de securite d'EDIFIA (politique, standards, procedures, classification des donnees)
- Implementer la securite applicative (OWASP Top 10, revues de code securite, SAST/DAST)
- Gerer la protection des donnees (chiffrement au repos et en transit, pseudonymisation, minimisation)
- Conduire les audits de securite reguliers (penetration testing, vulnerability scanning)
- Gerer les incidents de securite (detection, reponse, investigation, post-mortem)
- Assurer la conformite RGPD (registre des traitements, DPA, DPIA, droits des personnes)
- Former l'equipe aux bonnes pratiques de securite (sensibilisation, phishing, secure coding)
- Superviser la gestion des acces et des identites (IAM, RBAC, MFA, rotation des credentials)

### Livrables produits

- Politique de securite EDIFIA (document de reference)
- Plan de securite (mesures, echeances, responsabilites)
- Rapport d'audit de securite (trimestriel, avec plan d'action)
- Registre des traitements RGPD (a jour, avec DPIA si necessaire)
- Plan de reponse aux incidents de securite (procedures, equipe, outils)
- Rapport de vulnerabilites (scan regulier, criticite, remediation)
- Documentation des mesures de securite (pour les clients et les audits)
- Formation securite (materiel, sessions, evaluation)

### Competences requises

**Techniques :**
- 7+ ans d'experience en securite informatique, ideally en startup avec des donnees sensibles
- Certifications : CISSP, OSCP, ou equivalent (au moins une certification majeure)
- Maitrise de la securite applicative (OWASP, secure coding, revue de code)
- Experience avec les outils de securite (Snyk, SonarQube, Burp Suite, Nessus)
- Expertise RGPD (DPO experience ou certification CIPP/E)
- Connaissance de la securite cloud (CSPM, CASB, securite Kubernetes)
- Experience avec la cryptographie (chiffrement, signatures, PKI, gestion des cles)
- Familiarite avec la securite des APIs (authentification, autorisation, rate limiting, OWASP API Security)

**Soft skills :**
- Paranoia saine et culture de la securite (sans etre bloquant pour l'innovation)
- Capacite a communiquer les risques de securite de maniere comprehensible
- Reactivite sur les incidents (calme, methodique, efficace)
- Veille continue sur les menaces et les vulnerabilites

### Agent-pair de collaboration

**EDIFIA_DevOps_SRE** - Securisation de l'infrastructure et gestion des secrets
**EDIFIA_Legal_Risk** - Alignement RGPD et cadre de protection juridique

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Vulnerabilites critiques non corrigees | 0 | Scan securite |
| Vulnerabilites hautes non corrigees | < 3 (avec plan d'action) | Scan securite |
| Temps de reponse a un incident de securite | < 1h | Monitoring |
| Score de securite applicative (OWASP) | > 90/100 | Evaluation |
| Conformite RGPD (audit interne) | 100% | Checklist |
| Taux de succes des attaques simulees | 0% | Pen testing |
| Delai moyen de remediation | < 7 jours | Suivi vulns |

### Niveau de decision autorise

**TACTIQUE** - Peut imposer des mesures de securite, bloquer un deploiement pour risque critique, et definir les standards de securite. A un **VETO DE SECURITE** sur toute decision presentant un risque critique. Doit escalader au CTO les incidents majeurs et au Legal Risk les sujets RGPD complexes.

---

## EDIFIA_Documentation - Technical Writer & Documentation Lead

| Attribut | Detail |
|----------|--------|
| **Titre complet** | Documentation Lead - Architecte du Savoir EDIFIA |
| **Mission** | Produire et maintenir l'ensemble de la documentation d'EDIFIA : documentation technique pour l'equipe, documentation utilisateur pour les clients, et documentation reglementaire, en garantissant precision, accessibilite et fraicheur. |

### Responsabilites principales

- Concevoir l'architecture de la documentation EDIFIA (structure, outils, workflow de mise a jour)
- Rediger la documentation technique (API docs, guides de contribution, architecture decisions)
- Produire la documentation utilisateur (guides d'utilisation, FAQ, tutoriels video/scripts)
- Maintenir la documentation reglementaire (references normatives, guides de conformite, mises a jour)
- Assurer la coherence et la fraicheur de la documentation (revue reguliere, versionnement)
- Travailler avec chaque agent pour documenter les processus et les livrables
- Implementer la documentation "docs as code" (Markdown, Git, CI/CD pour la doc)
- Mesurer l'efficacite de la documentation (retours utilisateurs, temps de resolution des tickets)

### Livrables produits

- Architecture de la documentation (plan de classement, standards, outils)
- Documentation technique (API reference, guides developpeurs, runbooks)
- Documentation utilisateur (guides, tutoriels, FAQ, videos)
- Documentation reglementaire (references, guides conformite, veille integree)
- README et guides de contribution (pour chaque repository)
- Changelog et release notes (par version, par pilier)
- Glossaire EDIFIA (termes techniques, acronymes, definitions)
- Metriques de documentation (couverture, fraicheur, satisfaction)

### Competences requises

**Techniques :**
- 5+ ans d'experience en technical writing, ideally dans le BTP/AEC ou la tech complexe
- Maitrise des outils de documentation (Mintlify, ReadMe, Docusaurus, ou MkDocs)
- Experience avec le docs-as-code (Markdown, Git, CI/CD pour la documentation)
- Capacite a lire et comprendre du code (pour documenter les APIs et les algorithmes)
- Connaissance du secteur de la construction (vocabulaire, enjeux, reglementation)
- Experience avec les outils de feedback utilisateur (Hotjar, Intercom, ou equivalents)
- Maitrise de l'architecture de l'information (classification, recherche, navigation)
- Experience avec les outils de capture video (tutoriels, demos)

**Soft skills :**
- Pedagogie et capacite a vulgariser le complexe
- Rigueur et souci de la precision (la documentation reglementaire ne tolere pas l'erreur)
- Proactivite sur la mise a jour (documentation vivante, pas archive)
- Capacite a interviewer les experts techniques pour extraire le savoir

### Agent-pair de collaboration

**Tous les agents** - Chaque agent est responsable de la documentation de son domaine, le Documentation Lead coordonne et homogeneise
**EDIFIA_Content_Designer** - Coherence entre documentation et ton/voix EDIFIA

### KPIs de performance

| KPI | Cible V1 | Mesure |
|-----|----------|--------|
| Taux de documentation des features livrees | 100% | Audit sprint |
| Fraicheur de la documentation (pages a jour) | > 90% | Audit mensuel |
| Temps moyen de resolution d'un ticket support (avec doc) | < 2h | Suivi support |
| Satisfaction documentation utilisateur | > 4/5 | Enquete |
| Temps de recherche d'information dans la doc | < 2 min | Test utilisateur |
| Couverture API documentee | 100% | Checklist |

### Niveau de decision autorise

**OPERATIONNEL** - Peut arbitrer la structure de la documentation, les outils, et les standards de redaction. Peut demander a tout agent de completer sa documentation. Doit valider avec le Product Owner la prioritisation des documentations a produire.

---


# 6. MATRICE RACI COMPLETE

## Legende
- **R** = Responsible (Execute le travail)
- **A** = Accountable (Valide et prend la decision finale - un seul A par ligne)
- **C** = Consulted (Consulte avant decision)
- **I** = Informed (Informe apres decision)

## Matrice : Couches EDIFIA x Agents

| Couche EDIFIA | CTO | PO | Legal | UX | Front | Content | Back | Solver | Compliance | BIM | Data AI | DevOps | QA | Secu | Doc |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **1. Brief multimodal** | C | A | I | R | R | R | R | I | I | I | R | I | C | C | I |
| **2. Site Intelligence** | C | C | C | I | C | I | R | I | C | I | A | I | C | C | I |
| **3. Foncier autonome** | C | C | A | I | I | I | R | I | C | I | R | I | C | C | I |
| **4. Programmation** | C | A | C | C | I | C | R | I | C | I | R | I | C | I | C |
| **5. Conception generative** | A | C | I | C | I | I | R | R | C | C | I | I | C | I | I |
| **6. Conformite deterministe** | C | I | A | I | I | C | R | C | R | I | I | I | A | I | C |
| **7. Structure (Eurocodes)** | C | I | C | I | I | I | R | C | A | C | I | I | C | I | C |
| **8. Fluides (CVC/elec/plom)** | C | I | I | I | I | I | R | I | A | C | I | I | C | I | C |
| **9. Economie (DPGF/DCE)** | C | C | C | I | I | I | R | I | C | A | I | I | C | I | C |
| **10. Livrables (PCMI/CERFA)** | C | A | A | I | R | R | R | I | A | R | I | I | A | C | R |
| **11. Phasage chantier** | C | C | I | I | R | I | R | I | C | C | I | I | C | I | C |
| **12. Suivi chantier** | A | C | I | C | R | I | R | I | I | I | R | I | C | I | I |

## Details par couche

### Couche 1 - Brief multimodal (texte, voix, photos, LIDAR)
- **A** : Product Owner - Le brief est l'entree utilisateur, PO garante de la valeur
- **R** : UX Lead (parcours de saisie), Frontend Dev (implementation), Content Designer (copy), Data AI (traitement NLP/ASR/vision), Backend (APIs)
- **C** : CTO (coherence technique), QA (tests), Security (donnees sensibles)
- **I** : Legal, Compliance, BIM, DevOps, Documentation

### Couche 2 - Site Intelligence (PLU + LIDAR IGN + DVF + risques)
- **A** : Data AI - Maitrise des donnees et algorithmes d'analyse
- **R** : Backend Lead (APIs, orchestration), Data AI (ingestion, traitement)
- **C** : CTO, PO, Legal (donnees cadastrales), UX, Compliance (regles PLU), QA, Security
- **I** : Frontend, Content, BIM, DevOps, Documentation

### Couche 3 - Foncier autonome (agent scraping + scoring)
- **A** : Legal Risk - Enjeux juridiques majeurs sur le foncier
- **R** : Backend Lead (orchestration), Data AI (scraping, scoring ML)
- **C** : CTO, PO, Compliance (regles foncieres), QA, Security
- **I** : UX, Frontend, Content, BIM, DevOps, Documentation

### Couche 4 - Programmation (brief -> programme architectural)
- **A** : Product Owner - Le programme est le pivot entre besoin et solution
- **R** : Backend Lead (pipeline), Data AI (LLM pour transformation brief->programme)
- **C** : CTO, Legal, UX (affichage programme), Content (formulation), Compliance (contraintes reglementaires), QA, Documentation
- **I** : Frontend, BIM, DevOps, Security

### Couche 5 - Conception generative (solveur parametrique -> variants BIM/IFC)
- **A** : CTO - Coeur algorithmique, decision technique transversale
- **R** : Geometric Solver (algorithme), Backend Lead (pipeline)
- **C** : PO, UX, Compliance (contraintes reglees dans le solveur), BIM (reception geometries), QA
- **I** : Frontend, Content, Data AI, DevOps, Security, Documentation

### Couche 6 - Conformite deterministe (~6000 regles formelles)
- **A** : Legal Risk + QA Lead (co-Accountable) - Zero risque d'erreur
- **R** : Compliance Engine (moteur), Backend Lead (integration)
- **C** : CTO, Geometric Solver (contraintes), Structure/Fluides/Economie (regles metier), Content (formulation alertes), Documentation
- **I** : PO, UX, Frontend, Data AI, DevOps, Security

### Couche 7 - Structure (Eurocodes + FEM code_aster)
- **A** : Compliance Engine - Application des Eurocodes
- **R** : Backend Lead (pipeline), Geometric Solver (geometrie structure)
- **C** : CTO, Legal (responsabilite structure), BIM (modelisation), QA, Documentation
- **I** : PO, UX, Frontend, Content, Data AI, DevOps, Security

### Couche 8 - Fluides (CVC, elec, plomberie, VMC, gaz, EP/EU, PV)
- **A** : Compliance Engine - Regles techniques des fluides
- **R** : Backend Lead (pipeline, calculs)
- **C** : BIM (integration dans le modele), QA, Documentation
- **I** : CTO, PO, Legal, UX, Frontend, Content, Data AI, DevOps, Security

### Couche 9 - Economie (metre BIM, DPGF, CCTP, DCE)
- **A** : BIM Specialist - Metre automatise depuis le BIM
- **R** : Backend Lead (generation documents), BIM (quantitatifs)
- **C** : CTO, PO, Legal (mentions legales documents), Compliance (contenu reglementaire), QA, Documentation
- **I** : UX, Frontend, Content, Geometric Solver, Data AI, DevOps, Security

### Couche 10 - Production livrables (PCMI, CERFA, notices, rendus 4K)
- **A** : PO + Legal Risk + QA Lead - Livrables livres au client, risque maximal
- **R** : Frontend (telechargement), BIM (rendus 4K, plans), Backend (generation), Content (formulation notices), Documentation (structure)
- **C** : CTO, Compliance (validation conformite), Security
- **I** : UX, Geometric Solver, Data AI, DevOps

### Couche 11 - Phasage chantier (Gantt, OPC, 4D BIM)
- **R** : Backend Lead (calculs, generation), Frontend (affichage Gantt), BIM (4D)
- **C** : CTO, PO, Legal, Compliance, QA, Documentation
- **I** : UX, Content, Geometric Solver, Data AI, DevOps, Security

### Couche 12 - Suivi chantier (drones + vision IA)
- **A** : CTO - Innovation technologique, integration hardware/software
- **R** : Backend Lead (APIs), Frontend (interface), Data AI (vision par drone)
- **C** : PO, UX (interface suivi), QA
- **I** : Legal, Content, Geometric Solver, Compliance, BIM, DevOps, Security, Documentation

---

# 7. FLUX DE DECISION

## Principe general

```
Decision = Niveau OPERATIONNEL par defaut
         -> Escalade TACTIQUE si impact > 1 pilier ou > 2 agents
         -> Escalade STRATEGIQUE si risque mortel ou impact business critique
```

## Carte de decision par domaine

### 1. Architecture Technique & Stack

| Decision | Niveau | Decideur | Escalade si |
|----------|--------|----------|-------------|
| Choix bibliotheque/framework (1 pilier) | Operationnel | Agent concerne | Impact sur autre pilier |
| Changement de stack majeur | Strategique | CTO | Avec validation PO |
| Integration service externe | Tactique | Backend Lead | Cout > 500E/mois ou donnnees sensibles |
| Mise a jour version majeure dependance | Operationnel | Agent concerne | Breaking changes |

### 2. Scope Produit & Roadmap

| Decision | Niveau | Decideur | Escalade si |
|----------|--------|----------|-------------|
| Priorisation backlog sprint | Tactique | Product Owner | Conflit avec contrainte technique |
| Scope creep (feature hors V1) | **VETO** | Product Owner | Aucune exception V1 |
| Changement V1 -> V2 -> V3 | Strategique | CTO + PO | Validation fondateurs |
| Nouvelle cible utilisateur | Strategique | CTO + PO + Legal | Impact reglementaire |

### 3. Conformite & Risques Legaux

| Decision | Niveau | Decideur | Escalade si |
|----------|--------|----------|-------------|
| Modelisation d'une regle | Tactique | Compliance Engine | Interpretation ambigue |
| Mise a jour reglementaire | Tactique | Compliance + Legal | Impact architecture |
| **Veto conformite livrable** | **STRATEGIQUE VETO** | Legal Risk + QA | Aucun contournement |
| Limitation d'usage V1 | Strategique | Legal Risk | Validation CTO |
| Reponse a une menace legale | Strategique | Legal Risk + CTO | Immediate |

### 4. Securite

| Decision | Niveau | Decideur | Escalade si |
|----------|--------|----------|-------------|
| Configuration securite infra | Tactique | Security + DevOps | Incident en cours |
| **Veto securite (risque critique)** | **STRATEGIQUE VETO** | Security Lead | Aucun contournement |
| Audit de securite | Tactique | Security Lead | Failures critiques |
| Gestion incident securite | Tactique -> Strategique | Security Lead | Impact client ou donnees |

### 5. Qualite & Livrables

| Decision | Niveau | Decideur | Escalade si |
|----------|--------|----------|-------------|
| Campagne de tests complementaires | Tactique | QA Lead | Blocage release |
| **Veto qualite (release)** | **TACTIQUE VETO** | QA Lead | Validation PO |
| Validation livrable client | Tactique | QA + Compliance | Divergence d'avis |
| Correction bug post-release | Operationnel | Agent concerne | Hotfix critique |

### 6. Infrastructure & Scaling

| Decision | Niveau | Decideur | Escalade si |
|----------|--------|----------|-------------|
| Mise a l'echelle (auto-scaling) | Operationnel | DevOps/SRE | Cout > 200% prevu |
| Changement provider cloud | Strategique | CTO + DevOps | Impact souverainete |
| Plan de disaster recovery | Tactique | DevOps/SRE | Test echoue |
| Incident infrastructure | Operationnel -> Tactique | DevOps/SRE | SLA menace |

## Processus d'escalade

```
ETAPE 1 : Decision au niveau approprie (Operationnel/Tactique/Strategique)
    |
    | Desaccord ou risque identifie
    v
ETAPE 2 : Escalade au niveau superieur dans un delai de 4h
    |
    | Si blocage persiste ou risque mortel
    v
ETAPE 3 : Comite de crise (CTO + PO + Legal) dans un delai de 24h
    |
    | Decision finale + documentation
    v
ETAPE 4 : Documentation de la decision (ADR ou note de crise)
```

## Regles de veto

| Veto | Exerce par | Condition | Contournement |
|------|-----------|-----------|---------------|
| **Conformite livrable** | Legal Risk + QA Lead | Non-conformite reglementaire detectee | AUCUN - livrable bloque |
| **Securite critique** | Security Lead | Vulnerabilite critique ou incident securite | AUCUN - deploiement bloque |
| **Scope V1** | Product Owner | Feature hors scope V1 demandee | AUCUN - report V2 |
| **Hallucination LLM en conformite** | Compliance Engine | Tentative d'utiliser LLM pour conformite | AUCUN - architecture preservee |

---


# 8. STACK TECHNOLOGIQUE RECOMMANDE

## Stack global EDIFIA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND EXPERIENCE                                │
│  Next.js 14+ | TypeScript | Tailwind CSS | Three.js | Mapbox GL | Figma    │
├─────────────────────────────────────────────────────────────────────────────┤
│                         BACKEND & APIs                                      │
│  Python FastAPI | PostgreSQL + PostGIS | Redis | RabbitMQ | Celery        │
├─────────────────────────────────────────────────────────────────────────────┤
│                         IA / DATA / LLM                                     │
│  PyTorch | LangChain | pgvector | OpenAI/Anthropic APIs | GDAL | Polars   │
├─────────────────────────────────────────────────────────────────────────────┤
│                         GEOMETRIE / BIM                                     │
│  Python + Open CASCADE | IfcOpenShell | Blender API | CGAL | code_aster   │
├─────────────────────────────────────────────────────────────────────────────┤
│                         CONFORMITE                                          │
│  Python + Moteur regles custom | Prolog | TLA+ (specs formelles)          │
├─────────────────────────────────────────────────────────────────────────────┤
│                         INFRASTRUCTURE                                      │
│  Kubernetes | Terraform | Scaleway/OVH (souverainete) | GitHub Actions    │
├─────────────────────────────────────────────────────────────────────────────┤
│                         OBSERVABILITE                                       │
│  Prometheus | Grafana | Loki | Jaeger | PagerDuty                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                         SECURITE                                            │
│  Vault | Snyk | SonarQube | Let's Encrypt | WAF                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Stack detaille par agent

---

### EDIFIA_CTO

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Architecture Docs | Notion + Mermaid.js | ADRs, schemas d'architecture |
| Roadmap | Linear + Notion | Gestion de la roadmap technique |
| Prototypage | Figma (lecture) | Revue des maquettes |
| Monitoring | Grafana (lecture) | Tableaux de bord transversaux |
| Communication | Slack + Notion | Communication equipe |

---

### EDIFIA_Product_Owner

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Backlog | Linear ou Jira | Gestion du backlog, sprints |
| Documentation | Notion | PRD, user stories, scope V1 |
| Analytics | Mixpanel ou PostHog | Metriques produit, funnels |
| Prototypage | Figma | Revue des parcours utilisateur |
| Communication | Slack + Notion | Ceremonies agiles, compte-rendus |

---

### EDIFIA_Legal_Risk

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Gestion documentaire | Notion + DocuSign | Contrats, CGU, veille |
| Veille reglementaire | Feedly + Alerts Google | Veille automatisee |
| Register RGPD | Outil dédie ou Notion | Registre des traitements |
| Conseil externe | Teams/Zoom + emails | Consultations juridiques |
| Matrice conformite | Notion (tableaux) | Suivi conformite par couche |

---

### EDIFIA_UX_Lead

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Design UI | Figma (maitrise avancee) | Maquettes, prototypes, design system |
| Recherche UX | Dovetail ou Notion | Entretiens, analyse qualitative |
| Tests utilisateurs | Maze ou Useberry | Tests a distance, heatmaps |
| Analytics UX | Hotjar ou FullStory | Session replay, heatmaps |
| Design Tokens | Figma Variables + Style Dictionary | Tokens de design |

---

### EDIFIA_Frontend_Dev

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Framework | Next.js 14+ (App Router) | Application web |
| Langage | TypeScript 5+ | Typage statique |
| Styling | Tailwind CSS + shadcn/ui | UI components, styling rapide |
| 3D / BIM | Three.js + @thatopen/components | Visualisation IFC 3D |
| Cartographie | Mapbox GL JS | Carte parcelle, PLU, risques |
| State Management | Zustand | Gestion etat applicatif |
| Requetes API | TanStack Query (React Query) | Cache, synchronisation |
| Tests E2E | Playwright | Tests end-to-end |
| Tests Unitaires | Vitest | Tests rapides |
| Build/Vite | Vite | Bundling rapide |

---

### EDIFIA_Content_Designer

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Redaction | Notion + Google Docs | Contenu, copy, charte editoriale |
| Integration UI | Figma (mode edition texte) | Microcopy dans les maquettes |
| Mailing | Mailchimp ou Brevo | Emails utilisateurs |
| Analytics contenu | Grammarly + Hemingway | Lisibilite, clarte |
| Gestion multilingue | i18n (format JSON) | Internationalisation future |

---

### EDIFIA_Backend_Lead

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Langage | Python 3.11+ | Backend principal |
| Framework API | FastAPI | APIs REST haute performance |
| Base de donnees | PostgreSQL 16 + PostGIS | Donnees relationnelles + geospatiales |
| Cache | Redis | Cache, sessions, rate limiting |
| Queue | RabbitMQ ou Redis Streams | Files d'attente asynchrones |
| Workers | Celery + Flower | Traitements background |
| Auth | OAuth2 + JWT (FastAPI security) | Authentification |
| API Docs | OpenAPI/Swagger (auto FastAPI) | Documentation API |
| Tests | Pytest + pytest-asyncio | Tests backend |
| Migrations | Alembic | Migrations SQL |

---

### EDIFIA_Geometric_Solver

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Langage | Python 3.11+ + NumPy/SciPy | Algorithmes, optimisation |
| Geometrie | Shapely + GEOS | Geometrie 2D, operations booleennes |
| 3D | Open CASCADE (via PythonOCC) | Modelisation 3D parametrique |
| Optimisation | OR-Tools (Google) + PuLP | Solveurs contraintes, optimisation |
| Algorithmes genetiques | DEAP ou custom | Generation de variants |
| Analyse solaire | pvlib-python + suncalc | Calcul d'ensoleillement, ombres |
| Export geometrie | IfcOpenShell + trimesh | Export IFC, OBJ, STL |
| Tests reference | pytest + snapshots geometriques | Tests de non-regression |

---

### EDIFIA_Compliance_Engine

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Langage | Python 3.11+ | Moteur de regles |
| Moteur regles | Implementation custom + SQL | Base de regles formalisees |
| Specifications formelles | TLA+ ou Alloy | Verification formelle des regles critiques |
| Tests property-based | Hypothesis (Python) | Generation automatique de cas de test |
| Base de connaissances | PostgreSQL (regles versionnees) | Stockage et historisation des regles |
| Versionning regles | Git + CI specifique | Tracking des changements reglementaires |
| Audit trail | PostgreSQL (table audit) | Tracabilite complete |
| **INTERDIT** | **Aucun LLM** | **Zero LLM dans cette couche** |

---

### EDIFIA_BIM_Specialist

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Langage | Python 3.11+ + C++ si besoin | Pipeline BIM |
| IFC | IfcOpenShell (Python/C++) | Creation, lecture, validation IFC |
| Rendu 3D | Blender API (bpy) | Rendus photorealistes 4K |
| Web 3D | Three.js + @thatopen/components | Visualisation web |
| Plans 2D | Matplotlib + ReportLab | Generation plans PDF |
| Quantitatifs | IfcOpenShell (quantities) | Metre automatise |
| Classification | bSDD API + custom | Classification elements |
| Validation IFC | IfcValidator + bSDD | Controle qualite IFC |
| DWG | ezdxf ou Teigha File Converter | Export DWG |

---

### EDIFIA_Data_AI

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Langage | Python 3.11+ | Data + ML |
| LLM Framework | LangChain + Llamaindex | Orchestration LLM, RAG |
| LLM APIs | OpenAI GPT-4o / Anthropic Claude | Generation programme, brief |
| Embeddings | OpenAI Ada-002 ou local | Vecteurs pour RAG |
| Vector DB | pgvector (PostgreSQL) | Stockage embeddings |
| NLP | spaCy + Hugging Face Transformers | Traitement texte, NER |
| Vision | OpenCV + Hugging Face | Traitement photos, LIDAR |
| ASR | Whisper API (OpenAI) ou local | Transcription voix |
| Pipeline data | Apache Airflow ou Prefect | Orchestration ETL |
| Donnees geo | GDAL + rasterio + GeoPandas | Traitement donnees IGN, cadastre |
| ML | PyTorch | Modeles custom |
| Tracking ML | MLflow | Versionning modeles |

---

### EDIFIA_DevOps_SRE

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Cloud | Scaleway / OVHcloud (souverainete FR) | Infrastructure principale |
| Backup cloud | AWS S3 (region UE) | Backups secondaires |
| IaC | Terraform + Pulumi | Infrastructure as Code |
| Conteneurisation | Docker + Kubernetes | Orchestration conteneurs |
| GitOps | ArgoCD | Deploiement continu Git-based |
| CI/CD | GitHub Actions | Pipelines build/test/deploy |
| Monitoring | Prometheus + Grafana | Metriques, dashboards |
| Logs | Loki (Grafana Stack) | Aggregation logs |
| Tracing | Jaeger | Tracing distribue |
| Alerting | PagerDuty + Slack | Alertes, on-call |
| Secrets | HashiCorp Vault | Gestion secrets |
| FinOps | Kubecost + tags Terraform | Optimisation couts |

---

### EDIFIA_QA_Lead

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Tests E2E | Playwright | Tests frontend end-to-end |
| Tests API | Pytest + requests/httpx | Tests APIs backend |
| Tests performance | k6 ou Locust | Tests de charge |
| Tests conformite | pytest + jeux de reference | Validation regles |
| Bug tracking | Linear ou Jira | Suivi bugs |
| Couverture | coverage.py + Istanbul | Rapport de couverture |
| CI integration | GitHub Actions | Tests dans la CI |
| Snapshot testing | pytest-snapshot | Tests de non-regression visuels |

---

### EDIFIA_Security_Lead

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Scan vulnerabilites | Snyk + Dependabot | Scan dependances |
| SAST | SonarQube | Analyse statique code |
| DAST | OWASP ZAP | Test penetration dynamique |
| Pen testing | Burp Suite Pro | Tests penetration manuels |
| Secrets scanning | GitLeaks + TruffleHog | Detection secrets dans Git |
| Certificats | Let's Encrypt + cert-manager | TLS automatise |
| IAM | Keycloak ou Auth0 | Gestion identites |
| WAF | Cloudflare ou mod_security | Protection web |
| SIEM | Wazuh ou Splunk free | Detection incidents |

---

### EDIFIA_Documentation

| Domaine | Technologie | Usage |
|---------|-------------|-------|
| Docs-as-code | Mintlify ou Docusaurus | Site documentation |
| API Docs | Swagger UI + FastAPI docs | Documentation API auto-generee |
| Redaction | Notion + Markdown (Git) | Contenu documentation |
| Videos | Loom ou OBS | Tutoriels video |
| Diagrammes | Mermaid.js + Excalidraw | Diagrammes architecture |
| Feedback | Intercom ou Crisp | Retours sur la doc |

---

# 9. SYNTHETIQUE & RECAPITULATIF

## Vue d'ensemble des 14 agents

| # | Agent | Pilier | Niveau decision | Mission cle | Risque mortel géré |
|---|-------|--------|-----------------|-------------|-------------------|
| 1 | **CTO** | Strategie | Strategique | Vision technique transversale | Tous (arbitrage) |
| 2 | **Product Owner** | Strategie | Tactique | Priorisation, scope V1 | Scope creep |
| 3 | **Legal Risk** | Strategie | Strategique | Conformite, protection | Attaque Ordre des Architectes, Decennale |
| 4 | **UX Lead** | Experience | Tactique | Parcours utilisateur | Adoption utilisateur |
| 5 | **Frontend Dev** | Experience | Operationnel | Interfaces web/mobile | Performance percue |
| 6 | **Content Designer** | Experience | Operationnel | Voix et ton EDIFIA | Confiance utilisateur |
| 7 | **Backend Lead** | Moteur | Tactique | APIs, orchestration | Fiabilite platforme |
| 8 | **Geometric Solver** | Moteur | Tactique | Conception generative | Qualite architecturale |
| 9 | **Compliance Engine** | Moteur | Tactique (Veto) | 6000 regles formelles | **Hallucination LLM** |
| 10 | **BIM Specialist** | Moteur | Tactique | Livrables IFC/plans/rendus | Qualite livrables |
| 11 | **Data AI** | Moteur | Tactique | LLM, donnees, ML | Cout inference, qualite data |
| 12 | **DevOps/SRE** | Operations | Tactique | Infrastructure, scaling | Disponibilite, souverainete |
| 13 | **QA Lead** | Operations | Tactique (Veto) | Tests, validation | Qualite, conformite livrables |
| 14 | **Security Lead** | Operations | Tactique (Veto) | Securite, RGPD | Securite donnees, conformite |

## Distribution des effectifs

```
PILIER STRATEGIE    : 3 agents (21%)  [CTO, PO, Legal]
PILIER EXPERIENCE   : 3 agents (21%)  [UX, Frontend, Content]
PILIER MOTEUR       : 5 agents (36%)  [Backend, Solver, Compliance, BIM, Data AI]
PILIER OPERATIONS   : 4 agents (22%)  [DevOps, QA, Security, Documentation]
                    ─────────────────
TOTAL               : 14 agents (100%)
```

## Cles de succes identifiees

1. **Separation LLM/Conformite** : La frontiere entre la couche 6 (100% deterministe) et les couches utilisant des LLM doit etre physique et verifiable. Le Compliance Engine a un veto absolu.

2. **Discipline de scope V1** : Le Product Owner tient la barriere des extensions <40m2 et MOB <150m2. Aucune exception V1.

3. **Qualite des livrables** : La chaine QA + Compliance + Legal forme un triple verrou avant livraison au client.

4. **Souverainete** : L'infrastructure privilegie les hebergeurs FR/UE (Scaleway/OVH) pour les donnees cadastrales et clientes.

5. **Vitesse d'iteration** : La CI/CD vise un lead time < 15 min et > 10 deploiements/jour pour apprendre vite et corriger vite.

6. **Culture du feedback** : Chaque agent a des KPIs clairs, mesures, et revus regulierement. La documentation est vivante et mise a jour en continu.

---

*Document produit pour EDIFIA - Equipe IA | Version 1.0 | Pre-investissement*
*Ce document est un outil de pilotage, de recrutement, et de communication aupres des investisseurs.*
