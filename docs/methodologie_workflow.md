# Methodologie Workflow - Equipe IA EDIFIA
## Workflow de Collaboration Inter-Agents Complet

**Version:** 1.0  
**Date:** 2025-01  
**Statut:** Operationnel - Pret a application immediate  
**Proprietaire:** CTO / Product_Owner  
**Classification:** Interne - Critique

---

## Sommaire

1. [Cadence de travail (Sprint Agent)](#1-cadence-de-travail-sprint-agent)
2. [Processus de developpement par type de tache](#2-processus-de-développement-par-type-de-tache)
   - A. Nouvelle fonctionnalite produit
   - B. Encodage reglementaire
   - C. Evolution technique transversale
   - D. Bug / Incidents
3. [Mecanismes de communication inter-agents](#3-mecanismes-de-communication-inter-agents)
4. [Gouvernance de la qualite](#4-gouvernance-de-la-qualite)
5. [Gestion des risques en continu](#5-gestion-des-risques-en-continu)
6. [Tableau de bord de suivi](#6-tableau-de-bord-de-suivi)
7. [Anti-patterns et garde-fous](#7-anti-patterns-et-garde-fous)

---

## Introduction

Ce document definit le workflow de collaboration inter-agents pour l'equipe IA de la plateforme EDIFIA. Il s'applique a l'ensemble des 14 agents repartis sur 4 piliers et constitue la reference unique des processus de developpement, de communication et de gouvernance.

### Principes directeurs

- **Zero compromis sur la conformite** : La Couche 6 (Moteur Reglementaire) est deterministe. Jamais de LLM. Double validation systematique.
- **Scope controle** : V1 = extensions <40m2 + MOB <150m2. Toute sortie de scope necessite une decision du comite de gouvernance.
- **Qualite technique superieure** : Chaque livrable passe par les portes de qualite definies. Pas de raccourci.
- **Souverainete des donnees** : Hosting Scaleway. Aucune donnee ne sort de l'infrastructure sans autorisation explicite.
- **Tracabilite complete** : Chaque decision est documentee, chaque action est tracable.

### Organisation des 14 agents

```
Pilier STRATEGIE
├── CTO               (Responsable technique final, arbitrages, architecture)
├── Product_Owner     (Roadmap, priorisation, valeur utilisateur)
└── Legal_Risk        (Conformite reglementaire, veille juridique, risques)

Pilier EXPERIENCE
├── UX_Lead           (Conception UX, parcours utilisateur, accessibilite)
├── Frontend_Dev      (Implementation UI/UX, composants, performance front)
└── Content_Designer  (Contenu educatif, copies, micro-copy, documentation utilisateur)

Pilier MOTEUR
├── Backend_Lead      (Architecture backend, API, performance, scalabilite)
├── Geometric_Solver  (Solveur geometrique, contraintes spatiales, algorithmes)
├── Compliance_Engine (Couche 6 - Moteur Reglementaire - DETERMINISTE)
├── BIM_Specialist    (Generation IFC, interoperabilite, flux BIM)
└── Data_AI           (Modeles IA, training data, prompt engineering, ML pipeline)

Pilier OPERATIONS
├── DevOps_SRE        (Infrastructure, CI/CD, monitoring, hosting Scaleway)
├── QA_Lead           (Qualite, tests, recette, validation fonctionnelle)
├── Security_Lead     (Securite, audit, penetration testing, conformite RGPD)
└── Documentation     (Documentation technique, guides, API references)
```

---

## 1. Cadence de travail (Sprint Agent)

### 1.1 Duree du Sprint Agent

| Parametre | Valeur | Justification |
|-----------|--------|---------------|
| Duree | **2 cycles** (~24-48h selon complexite) | Permet l'achevement complet d'une tache avec ses dependances |
| Nombre de taches par sprint | **1 tache principale + corrections bloquantes** | Focus absolu sur la qualite, pas le volume |
| Taches en parallele | **Non autorise** | Un agent = une tache principale a la fois |
| Buffer de stabilisation | **20% du sprint** dedie a la validation et correction |

### 1.2 Daily Agent Sync (Rituel quotidien)

**Frequence :** Une fois par cycle (2 fois par sprint)  
**Duree :** 15 minutes maximum  
**Participants :** Tous les agents actifs sur le sprint courant  
**Format :** Rapport structure asynchrone + point synchrone si blocages

#### Template de rapport Daily Agent Sync

```markdown
## [AGENT_NAME] - Daily Sync - [DATE] - Sprint [N]

### 1. Accomplissements depuis le dernier sync
- [ ] Tache accomplie avec reference (ex: "Implementation API gestion surélevations - commit #a1b2c3")
- [ ] Livrable produit avec lien

### 2. Tache en cours
- **ID Tache :** [TASK-001]
- **Avancement :** [0-25%] / [25-50%] / [50-75%] / [75-100%]
- **Prochaine etape immediate :** [description concrete]
- **Estimation restante :** [X heures]

### 3. Blocages / Risques / Besoins
- **Blocage actif :** [OUI/NON] + description si oui
- **Risque identifie :** [description + probabilite + impact]
- **Besoin d'aide de :** [agent(s) requis + competence]

### 4. Decisions necessaires
- [ ] Decision [REF-DEC-XXX] : [description] -> Decideur : [role]

### 5. Conformite & Securite (obligatoire pour tous)
- [ ] Aucun changement impactant la conformite : [OUI/NON]
- [ ] Aucun changement impactant la securite : [OUI/NON]
- [ ] Si NON : escalation immediate au Security_Lead et Legal_Risk
```

#### Deroulement du point synchrone (si blocages identifies)

```
T+0:00  - Tour de table rapide (2 min/agent max)
T+0:10  - Focus sur les blocages identifies
T+0:14  - Decisions prises + actions assignees
T+0:15  - Fin (report si besoin de plus de 15 min)
```

### 1.3 Sprint Planning

**Frequence :** En debut de chaque sprint (tous les 2 cycles)  
**Duree :** 60 minutes maximum  
**Participants obligatoires :** CTO, Product_Owner, tous les agents pilotes concernes  
**Participants optionnels :** Agents contributeurs selon les taches planifiees

#### Deroulement

| Phase | Duree | Responsable | Sortie |
|-------|-------|-------------|--------|
| 1. Rappel objectifs produit | 5 min | Product_Owner | Contexte aligne |
| 2. Revue backlog priorise | 10 min | Product_Owner | Liste des candidats taches |
| 3. Analyse faisabilite technique | 15 min | Agents pilotes | Estimations + dependances |
| 4. Identification risques | 10 min | Legal_Risk + Security_Lead | Risques identifies + mitigations |
| 5. Engagement sprint | 10 min | Tous | Taches engagees |
| 6. Validation conformite preliminaire | 10 min | Legal_Risk | Go/No-Go conformite |

#### Sorties du Sprint Planning

1. **Sprint Backlog** : Liste des taches engagees avec identifiant, responsable, et critere d'acceptation
2. **Matrice de dependances** : Quel agent attend quel livrable de quel autre agent
3. **Plan de validation** : Qui valide quoi et quand
4. **Decision Conformite Preliminaire** : Document signe par Legal_Risk (Go/No-Go)

#### Template d'engagement de sprint

```markdown
## Sprint [N] Engagement - [DATE_DEBUT] au [DATE_FIN]

### Taches engagees
| ID | Tache | Responsable | Estimation | Dependances | Critere d'acceptation |
|----|-------|-------------|------------|-------------|----------------------|
| TASK-001 | [Description] | [Agent] | [Xh] | [Taches bloquantes] | [Critere mesurable] |

### Risques identifies
| ID | Risque | Probabilite | Impact | Mitigation | Owner |
|----|--------|-------------|--------|------------|-------|

### Validation conformite
- [ ] Legal_Risk : Go / No-Go / Go avec reserves
- Commentaires : [ ]

### Signatures
- CTO : [ ]  Product_Owner : [ ]  Legal_Risk : [ ]
```

### 1.4 Sprint Review

**Frequence :** En fin de chaque sprint  
**Duree :** 45 minutes  
**Participants :** Tous les agents, CTO, Product_Owner  
**Objectif :** Demontrer les livrables, valider les criteres d'acceptation, decider du merge

#### Deroulement

| Phase | Duree | Responsable |
|-------|-------|-------------|
| 1. Demo fonctionnelle | 20 min | Agents responsables des taches |
| 2. Validation criteres d'acceptation | 10 min | QA_Lead + Product_Owner |
| 3. Revue conformite impactee | 10 min | Legal_Risk |
| 4. Decision merge / correction / report | 5 min | CTO |

#### Grille de decision merge

```
VALIDATION QA      + VALIDATION SECURITE     + VALIDATION CONFORMITE    = DECISION
-----------------    ----------------------    -----------------------    ----------
PASS                 PASS                      PASS                       MERGE autorise
PASS                 PASS                      PASS avec reserves         MERGE + ticket suivi
FAIL                 -                         -                          CORRECTION obligatoire
PASS                 FAIL                      -                          CORRECTION securite
PASS                 PASS                      FAIL                       BLOCAGE - pas de merge
```

### 1.5 Sprint Retrospective

**Frequence :** En fin de chaque sprint (apres la Review)  
**Duree :** 30 minutes  
**Participants :** Tous les agents  
**Facilitateur :** Rotation entre les 4 piliers

#### Format de la retrospective (methodologie Start-Stop-Continue + Risques)

```markdown
## Retrospective Sprint [N] - [DATE]
Facilitateur : [Agent]

### Ce qui a bien fonctionne (Start/Continue)
- [ ] [Agent] : [Observation concrete + impact mesurable]

### Ce qui doit s'arreter / s'ameliorer (Stop)
- [ ] [Agent] : [Observation concrete + proposition d'amelioration]

### Apprentissages techniques
- [ ] [Agent] : [Nouvelle connaissance acquise + diffusion recommandee]

### Risques emergents
| ID | Risque | Probabilite | Impact | Action proposee | Owner |
|----|--------|-------------|--------|-----------------|-------|

### Metriques du sprint
- Taches planifiees : [X] | Taches achevees : [Y] | Taux : [Y/X * 100]%
- Defauts decouverts en review : [N]
- Temps moyen de correction : [T]
- Escalations : [N]

### Actions d'amelioration
| ID | Action | Responsable | Echeance | Critere de succes |
|----|--------|-------------|----------|-------------------|
| ACT-001 | [Description] | [Agent] | [Date] | [Mesurable] |

### Signatures
Tous les agents : [ ]
```

---

## 2. Processus de developpement par type de tache

### A. Nouvelle fonctionnalite produit

**Exemple type :** Ajouter la gestion des surelevations dans le configurateur

#### Diagramme de flux (texte)

```
[Product_Owner]        [UX_Lead]           [Frontend_Dev]      [Backend_Lead]      [Data_AI]
      |                     |                     |                    |                  |
      |--- 1. User Story --->|                     |                    |                  |
      |                     |--- 2. Wireframes --->|                    |                  |
      |                     |                     |--- 3. Maquettes --->|                  |
      |                     |                     |                    |                  |
      |<--- 4. Validation UX ---|                  |                    |                  |
      |                     |                     |--- 5. Dev Front --->|                  |
      |                     |                     |                    |--- 6. API --->    |
      |                     |                     |                    |                  |
      |                     |                     |--- 7. Integration --->                  |
      |                     |                     |                    |                  |
      |                     |<--- 8. Review UX ---|                    |                  |
      |                     |                     |--- 9. Tests -------->|                  |
      |                     |                     |                    |                  |
      |<--- 10. Demo -------+----------+----------+                    |                  |
      |                                |                               |                  |
      |--- 11. Validation PO -------->|                               |                  |
      |                                |                               |                  |
      |<--- 12. Merge (si tous PASS) --+----------+----------+---------+
      |
[Legal_Risk]          [Security_Lead]      [QA_Lead]           [Documentation]
      |                     |                     |                    |
      |--- (parallele) 4b. Analyse juridique     |                    |
      |                     |--- (parallele) 4c. Revue menace          |
      |                     |                     |--- 8b. Tests QA --->|
      |                     |                     |                    |--- 11b. Doc --->
      |                     |                     |                    |
      |<--- 12. Validation finale (tous les piliers) ------------------+
```

#### Etapes detaillees avec agents et criteres de passage

##### ETAGE 1 : CONCEPTION (Cycles 1-2)

**Etape 1.1 : Expression du besoin (User Story)**
- **Responsable :** Product_Owner
- **Contributions :** Legal_Risk (impact reglementaire), UX_Lead (faisabilite UX)
- **Sortie :** User Story documentee avec critere d'acceptation
- **Critere de passage :** Story revue et validee par au moins 1 agent pilier technique + Legal_Risk

```markdown
## User Story Template - EDIFIA
**ID :** US-[NNN]
**Titre :** [Action] pour [benefice]
**Pilier :** [STRATEGIE/EXPERIENCE/MOTEUR/OPERATIONS]
**Agent responsable :** [Nom]

### Description
En tant que [persona], je veux [action] afin de [benefice].

### Contexte technique
- Couche(s) impactee(s) : [1-12]
- Agent(s) contributeur(s) : [liste]

### Criteres d'acceptation (GIVEN/WHEN/THEN)
1. GIVEN [contexte], WHEN [action], THEN [resultat attendu]
2. ...

### Impact conformite
- [ ] Aucun impact sur la Couche 6 (Moteur Reglementaire)
- [ ] Impact mineur (affichage uniquement) -> Validation Legal_Risk requise
- [ ] Impact majeur (logique reglementaire) -> Gate B obligatoire

### Contraintes
- Scope V1 : [ ] Oui / [ ] Non (si Non : justification requise)
- Performance : [objectif]
- Accessibilite : conforme RGAA si interface utilisateur

### Validations requises
- [ ] UX_Lead (conception)
- [ ] Legal_Risk (conformite)
- [ ] Security_Lead (securite)
- [ ] QA_Lead (testabilite)
```

**Etape 1.2 : Conception UX/UI**
- **Responsable :** UX_Lead
- **Contributions :** Content_Designer (micro-copy), Frontend_Dev (faisabilite technique)
- **Sortie :** Wireframes + maquettes + parcours utilisateur
- **Critere de passage :** Validation par Product_Owner + 1 agent technique

**Etape 1.3 : Architecture technique**
- **Responsable :** Agent pilier MOTEUR le plus pertinent (Backend_Lead pour API, Geometric_Solver pour logique geometrique, etc.)
- **Contributions :** CTO (validation pattern), tous les agents impactes (revue impact)
- **Sortie :** Document d'architecture technique (DAT) leger
- **Critere de passage :** Revue technique par CTO + 2 agents pilotes

```markdown
## Document d'Architecture Technique (DAT) - Template
**ID :** DAT-[NNN]
**Fonctionnalite :** [Nom]

### 1. Vue d'ensemble
[Description technique de la solution]

### 2. Composants impactes
| Composant | Changement | Agent responsable |
|-----------|-----------|-------------------|

### 3. Flux de donnees
[Diagramme texte ou description]

### 4. Interface API (si applicable)
```json
{
  "endpoint": "/api/v1/...",
  "method": "POST",
  "request": { ... },
  "response": { ... }
}
```

### 5. Impact Couche 6
- [ ] Aucun contact avec Couche 6
- [ ] Lecture Couche 6 uniquement (donnees reglementaires)
- [ ] Ecriture Couche 6 -> INTERDIT pour V1 (seul Compliance_Engine ecrit)

### 6. Risques techniques
| Risque | Mitigation |
|--------|------------|

### 7. Plan de test
- Tests unitaires : [ ]
- Tests integration : [ ]
- Tests E2E : [ ]
- Tests performance : [ ]

### Validations
- [ ] Backend_Lead
- [ ] Frontend_Dev (si UI)
- [ ] CTO
- [ ] Security_Lead (revue menace)
```

##### ETAGE 2 : DEVELOPPEMENT (Cycles 3-6)

**Etape 2.1 : Developpement parallele par pilier**

| Pilier | Responsable | Livrable | Duree estimée |
|--------|-------------|----------|---------------|
| EXPERIENCE | Frontend_Dev | Composants UI, integration maquettes | 2 cycles |
| MOTEUR | Backend_Lead / Agent specialisé | API, logique metier, modele de donnees | 2-3 cycles |
| MOTEUR (IA) | Data_AI | Modeles, prompts, pipeline de donnees | 2-3 cycles |

**Regle de synchronisation :** Commit quotidien obligatoire. Pas de branche longue (>2 cycles sans merge sur develop).

**Etape 2.2 : Revue croisee (Cross-Review)**
- **Responsable :** Agent pilote + 1 reviewer obligatoire d'un autre pilier
- **Processus :** 
  - Code review technique (qualite, pattern, performance)
  - Revue securite (Security_Lead si touchant auth, donnees, API externe)
  - Revue conformite (Legal_Risk si touchant reglementation)

##### ETAGE 3 : VALIDATION (Cycles 7-8)

**Etape 3.1 : Tests QA**
- **Responsable :** QA_Lead
- **Processus :**
  1. Tests fonctionnels selon criteres d'acceptation
  2. Tests de regression sur les fonctionnalites liees
  3. Tests de performance (si seuil defini)
  4. Tests d'accessibilite (si interface utilisateur)
  5. Tests cross-navigateur / cross-device

**Etape 3.2 : Revue conformite finale (Gate B)**
- **Responsable :** Legal_Risk
- **Obligatoire si :** La fonctionnalite affiche des donnees reglementaires ou impacte le parcours de conformite
- **Sortie :** Attestation de conformite ou liste de corrections

**Etape 3.3 : Revue securite finale (Gate S)**
- **Responsable :** Security_Lead
- **Checklist :** Voir section 4.4 (Revue securite)

**Etape 3.4 : Validation Produit**
- **Responsable :** Product_Owner
- **Demos :** Demo fonctionnelle a la Sprint Review
- **Decision :** Merge sur main / Correction / Report au sprint suivant

---

### B. Encodage reglementaire

**Exemple type :** Encoder les regles PLU d'une nouvelle commune

**Principe fondamental :** Ce processus est le plus critique de toute la plateforme. Une erreur d'encodage reglementaire peut entrainer des risques mortels (construction non conforme). Le processus est donc le plus rigoureux.

#### Diagramme de flux (texte)

```
[Legal_Risk]                    [Compliance_Engine]             [Data_AI]              [QA_Lead]
      |                                 |                             |                    |
      |-- 1. Receuil source officielle  |                             |                    |
      |   (document juridique)          |                             |                    |
      |                                 |                             |                    |
      |-- 2. Analyse & decoupage ----->|                             |                    |
      |   (regles atomiques)            |                             |                    |
      |                                 |-- 3. Encodage deterministe  |                    |
      |                                 |   (JSON regles formelles)   |                    |
      |                                 |                             |                    |
      |                                 |-- 4. Auto-validation ------>|                    |
      |                                 |   (tests structurels)       |                    |
      |                                 |                             |                    |
      |<-- 5. Revue croisee ------------+                             |                    |
      |   (Legal_Risk vs Compliance)    |                             |                    |
      |                                 |                             |                    |
      |-- 6. Validation formelle ------>|                             |                    |
      |   (checklist exhaustive)        |                             |                    |
      |                                 |                             |                    |
      |                                 |-- 7. Tests contre source -->|                    |
      |                                 |                             |                    |
      |                                 |-- 8. Recette exhaustive --->|------------------->|
      |                                 |   (jeu de test complet)     |                    |
      |                                 |                             |   9. Validation QA  |
      |                                 |                             |                    |
      |<-- 10. Decision finale ---------+-----------------------------+--------------------+
      |   (MERGE / CORRECTION / REJET)  |                             |                    |
```

#### Processus detaille - 10 etapes

##### ETAPE 1 : Recueil de la source officielle
- **Responsable :** Legal_Risk
- **Actions :**
  - Collecte du document reglementaire officiel (PLU, RNU, PPR, etc.)
  - Verification de l'authentification (source officielle, a jour, valide)
  - Archivage avec reference juridique complete
- **Sortie :** Document source archive + fiche d'identification

```markdown
## Fiche d'identification reglementaire
**ID :** REG-[NNN]
**Type :** [PLU/RNU/PPR/Autre]
**Commune :** [Nom] (Code INSEE : [XXX])
**Document source :** [URL officielle / Reference]
**Date de validite :** [DATE]
**Date de collecte :** [DATE]
**Collecte par :** Legal_Risk
**Statut :** [En vigueur / En revision / Abroge]
**Prise de connaissance par :** [Liste des agents]
```

##### ETAPE 2 : Analyse et decoupage en regles atomiques
- **Responsable :** Legal_Risk + Compliance_Engine
- **Actions :**
  - Lecture line par line du document source
  - Decoupage en regles atomiques (une regle = une contrainte verifiable)
  - Classification par type : hauteur, emprise, distance, recul, COS, CES, etc.
  - Identification des regles conditionnelles (si... alors...)
- **Sortie :** Liste des regles atomiques avec reference au document source

```markdown
## Regle atomique - Template
**ID :** RULE-[NNN]
**Source :** REG-[NNN] - Page [X] - Article [Y]
**Type :** [Hauteur/Emprise/Recul/COS/CES/Distance/Autre]
**Zone :** [U/UA/AU/NC/N tous]
**Description textuelle :**
[Texte exact du document source]

**Formalisme attendu :**
[Description de la regle en langage formel/pseudo-code]

**Exemples de test :**
| Cas | Entree | Resultat attendu |
|-----|--------|------------------|
| Nominal | [ ] | [Conforme/Non conforme] |
| Limite | [ ] | [Conforme/Non conforme] |
| Hors scope | [ ] | [Hors scope/Non applicable] |

**Complexite :** [Simple/Conditionnelle/Composee]
**Priorite :** [Obligatoire/Recommandee/Information]
```

##### ETAPE 3 : Encodage deterministe
- **Responsable :** Compliance_Engine
- **CONTRAINTE ABSOLUE :** Aucun LLM n'intervient dans l'encodage. L'encodage est fait manuellement ou via des outils deterministes verifies.
- **Format d'encodage :** JSON structure avec schema valide

```json
{
  "rule_id": "RULE-001",
  "version": "1.0",
  "source": {
    "regulation_id": "REG-001",
    "page": 12,
    "article": "AU-3",
    "text": "Hauteur maximale de construction : 8m en zone AU"
  },
  "applicability": {
    "zones": ["AU"],
    "lot_conditions": null,
    "building_types": ["all"]
  },
  "constraint": {
    "type": "HEIGHT_MAX",
    "value": 8.0,
    "unit": "meters",
    "measurement": "height_at_ridge",
    "comparison": "LESS_THAN_OR_EQUAL"
  },
  "error_message": {
    "fr": "Hauteur maximale depassee (8m max en zone AU)",
    "severity": "blocking",
    "reference": "PLU [Commune] - Article AU-3"
  },
  "test_cases": [
    {"input": {"height": 7.5}, "expected": "PASS"},
    {"input": {"height": 8.0}, "expected": "PASS"},
    {"input": {"height": 8.1}, "expected": "FAIL"}
  ]
}
```

##### ETAPE 4 : Auto-validation structurelle
- **Responsable :** Compliance_Engine
- **Actions :**
  - Validation du schema JSON
  - Verification de la completude des champs obligatoires
  - Execution des tests unitaires automatiques
  - Verification des references croisees (rule_id unique, regulation_id existant)
- **Critere de passage :** 100% des tests structurels PASS

##### ETAPE 5 : Revue croisee Legal_Risk + Compliance_Engine
- **Responsable :** Legal_Risk (reviewer) + Compliance_Engine (auteur)
- **Methode :** Lecture conjointe, regle par regle
- **Checklist :**
  - [ ] Le texte encode correspond exactement au texte source
  - [ ] La traduction en formalisme est correcte
  - [ ] Les cas limites sont correctement geres
  - [ ] Les messages d'erreur sont comprehensibles et referencent la source
  - [ ] Aucune regle n'a ete oubliee dans le document source

##### ETAPE 6 : Validation formelle par Legal_Risk
- **Responsable :** Legal_Risk
- **Checklist exhaustive (obligatoire) :**

```markdown
## Checklist validation formelle encodage reglementaire
**Regle :** RULE-[NNN] | **Validateur :** Legal_Risk | **Date :** [DATE]

### Fidelite au document source
- [ ] Le texte de la regle encodee correspond mot pour mot au document source
- [ ] L'article et la page de reference sont corrects
- [ ] Le type de contrainte est correctement identifie
- [ ] La valeur numerique est exacte (unite, precision)
- [ ] Les conditions d'applicabilite sont correctes

### Exhaustivite
- [ ] Toutes les regles du document source ont ete encodees
- [ ] Aucune regle n'a ete divisee ou fusionnee incorrectement
- [ ] Les regles conditionnelles ont toutes leurs branches traitees

### Cohérence technique
- [ ] L'encodage est valide selon le schema JSON
- [ ] Les references aux autres regles sont correctes
- [ ] Les tests cases couvrent les cas nominal, limite et d'erreur
- [ ] Le message d'erreur est comprehensible pour l'utilisateur final

### Decision
- [ ] VALIDE - pret pour recette
- [ ] A CORRIGER - voir commentaires : [ ]
- [ ] REJET - a re-encoder : [ ]

Signature Legal_Risk : [ ]
```

##### ETAPE 7 : Tests de recette contre source officielle
- **Responsable :** Compliance_Engine + Data_AI (generation de cas de test)
- **Processus :**
  - Generation exhaustive de cas de test couvrant tous les scenarios
  - Execution automatique des tests
  - Comparaison systematique des resultats avec l'interpretation humaine du document source
- **Couverture requise :** 100% des regles, 100% des cas limites identifies

##### ETAPE 8 : Recette exhaustive par QA_Lead
- **Responsable :** QA_Lead
- **Actions :**
  - Recette independante (QA_Lead n'a pas participe a l'encodage)
  - Tests de non-regression sur les regles existantes
  - Validation que les nouvelles regles n'entrent pas en conflit avec les existantes
- **Sortie :** Rapport de recette

##### ETAPE 9 : Decision finale
- **Responsable :** Legal_Risk (decision finale), CTO (execution)
- **Conditions de MERGE :**
  1. Validation formelle Legal_Risk : PASS
  2. Recette QA : PASS (0 defect)
  3. Tests contre source : PASS (100%)
  4. Revue croisee : signee par les 2 parties
- **Si CORRECTION :** Retour a l'etape 3 (encodage) avec commentaires detailles

##### ETAPE 10 : Mise en production et monitoring
- **Responsable :** Compliance_Engine + DevOps_SRE
- **Actions :**
  - Deploiement en production avec flag de feature
  - Activation progressive (canary)
  - Monitoring des erreurs pendant 7 jours
  - Rapport de stabilite a J+7

#### Regles d'or de l'encodage reglementaire

1. **JAMAIS de LLM** dans l'encodage ou la validation des regles
2. **Double validation systematique** : Compliance_Engine encode, Legal_Risk valide
3. **Traceabilite parfaite** : Chaque regle reference sa source exacte
4. **Tests exhaustifs** : 100% des cas limites testes avant merge
5. **Recette independante** : QA_Lead n'a pas participe a l'encodage
6. **Zero defect tolerance** : Un seul defect = pas de merge
7. **Rollback immediat** : Si un bug est detecte en production, rollback automatique

---

### C. Evolution technique transversale

**Exemple type :** Changer de version de solveur geometrique

#### Diagramme de flux (texte)

```
[CTO]                      [Agent initiateur]          [Agents impactes]         [QA_Lead]
      |                            |                            |                      |
      |<-- 1. Proposition ---------|                            |                      |
      |                            |                            |                      |
      |-- 2. Decision arbitrage -->|                            |                      |
      |                            |                            |                      |
      |                            |-- 3. Impact Analysis ------>|                      |
      |                            |   (matrice d'impact)       |                      |
      |                            |                            |                      |
      |<-- 4. Revue impact --------+----------+-----------------+                      |
      |                            |          |                 |                      |
      |-- 5. Plan de migration --->|          |                 |                      |
      |                            |          |                 |                      |
      |                            |-- 6. Execution --------->|                        |
      |                            |   (branche feature)        |                      |
      |                            |                            |                      |
      |                            |-- 7. Tests integration ---->|                      |
      |                            |                            |-- 8. Validation QA -->|
      |                            |                            |                      |
      |<-- 9. Go/No-Go final -----+----------+-----------------+----------------------+
```

#### Processus detaille

##### ETAPE 1 : Proposition d'evolution
- **Responsable :** Agent initiateur (n'importe quel agent)
- **Sortie :** Fiche d'evolution technique

```markdown
## Fiche Evolution Technique Transversale
**ID :** EVT-[NNN]
**Titre :** [Description]
**Agent initiateur :** [Nom]
**Date :** [DATE]

### 1. Contexte
[Pourquoi cette evolution est necessaire]

### 2. Description technique
[Quoi exactement change]

### 3. Composants impactes
| Composant | Agent responsable | Niveau d'impact (1-5) |
|-----------|-------------------|----------------------|
| [Nom]     | [Agent]           | [1-5]                |

### 4. Risques identifies
| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|

### 5. Estimation
- Duree : [X cycles]
- Complexite : [Faible/Moyenne/Eleve/Critique]
- Risque de regression : [Faible/Moyenne/Eleve]

### 6. Alternatives considerees
[Pourquoi cette solution et pas une autre]
```

##### ETAPE 2 : Decision d'arbitrage par le CTO
- **Responsable :** CTO
- **Decision :**
  - **GO** : L'evolution est validee, passe en planification
  - **CONDITIONNEL** : GO avec modifications (voir commentaires)
  - **NO-GO** : L'evolution est rejetee (justification obligatoire)
- **Delai de decision :** 1 cycle maximum

##### ETAPE 3 : Impact Analysis
- **Responsable :** Agent initiateur + tous les agents impactes
- **Processus :**
  - Chaque agent impacte analyse l'impact sur son domaine
  - Identification des modifications necessaires
  - Estimation du cout de migration
- **Sortie :** Matrice d'impact completee

```markdown
## Matrice d'impact - EVT-[NNN]
**Agent analyseur :** [Nom] | **Domaine :** [Pilier]

### Impact sur mon domaine
| Composant | Impact (OUI/NON) | Description | Cout de migration |
|-----------|------------------|-------------|-------------------|

### Travaux necessaires
- [ ] [Description] | Estimation : [Xh]

### Risques specifiques a mon domaine
| Risque | Mitigation |
|--------|------------|

### Disponibilite
- [ ] Je suis disponible pour la migration
- [ ] Je ne suis pas disponible -> Plan B : [ ]

Signature : [Agent] - Date : [ ]
```

##### ETAPE 4 : Revue d'impact par le CTO
- **Responsable :** CTO
- **Actions :**
  - Revue de toutes les analyses d'impact
  - Validation du plan de migration global
  - Arbitrage si conflits entre agents
- **Sortie :** Plan de migration valide

##### ETAPE 5 : Plan de migration
- **Responsable :** Agent initiateur
- **Contenu :**
  - Chronologie des migrations par domaine
  - Points de synchronisation
  - Strategie de rollback
  - Tests de validation intermediaires

##### ETAPE 6 : Execution
- **Responsable :** Chaque agent sur son domaine
- **Regles :**
  - Travail sur branche dediee
  - Tests unitaires avant integration
  - Daily sync accentue pendant la migration

##### ETAPE 7 : Tests d'integration
- **Responsable :** Agent initiateur + Backend_Lead
- **Tests :**
  - Tests d'integration entre composants modifies
  - Tests de non-regression complets
  - Tests de performance (si pertinent)

##### ETAPE 8 : Validation QA
- **Responsable :** QA_Lead
- **Validation :** Tests complets de non-regression + tests specifiques a l'evolution

##### ETAPE 9 : Decision finale Go/No-Go
- **Responsable :** CTO
- **Merge autorise si :** Tous les tests PASS + Validation QA + Aucun agent bloquant

---

### D. Bug / Incidents

#### Classification par severite

| Niveau | Code | Definition | Delai de reponse | Processus |
|--------|------|------------|------------------|-----------|
| **P0 - Critique** | `SEV-P0` | Risque reglementaire : La Couche 6 produit un resultat faux ou la plateforme autorise une construction non conforme | Immediate (< 1h) | Escalation automatique CTO + Legal_Risk. War room. |
| **P1 - Majeur** | `SEV-P1` | Blocage fonctionnel : Fonctionnalite core inexploitable (generer un plan, obtenir un permis) | < 4h | Escalation CTO. Resolution prioritaire. |
| **P2 - Modere** | `SEV-P2` | Degrade : Fonctionnalite accessible avec contournement ou degrad | < 24h | Planification sprint courant ou suivant. |
| **P3 - Mineur** | `SEV-P3` | Cosmetique : Probleme d'UI, typo, performance non critique | < 1 sprint | Backlog, traite selon priorite. |

#### Processus P0 - Risque reglementaire (War Room)

```
Detection
    |
    v
[Immediate] Arret de la fonctionnalite impactee (feature flag / rollback)
    |
    v
[Immediate] Escalation automatique : CTO + Legal_Risk + Compliance_Engine + Security_Lead
    |
    v
[0-15min] War Room (reunion d'urgence) - Tous les agents impactes
    |
    v
[15-30min] Diagnostic : Identification de la cause racine
    |           - Quelle regle est fausse ?
    |           - Quels utilisateurs sont impactes ?
    |           - Quelle est l'ampleur du dommage potentiel ?
    |
    v
[30min-2h] Resolution immediate
    |           - Correction de la regle
    |           - Validation par Legal_Risk (express)
    |           - Tests de non-regression
    |
    v
[2-4h] Deploiement correctif
    |           - Canary deployment
    |           - Monitoring renforce
    |
    v
[+24h] Post-mortem obligatoire (voir template ci-dessous)
    |
    v
[+48h] Rapport d'incident au comite de gouvernance
```

#### Template de declaration d'incident

```markdown
## Declaration d'incident - EDIFIA
**ID :** INC-[NNN] | **Date :** [DATE] | **Heure :** [HEURE]
**Declare par :** [Agent]

### 1. Classification
- **Severite :** [P0/P1/P2/P3]
- **Type :** [Reglementaire/Fonctionnel/Technique/Securite/Performance]
- **Composant impacte :** [Couche X / Composant Y]

### 2. Description
[Description factuelle du probleme]

### 3. Impact
- **Utilisateurs impactes :** [Nombre / Segment]
- **Donnees impactees :** [Oui/Non - lesquelles]
- **Conformite impactee :** [Oui/Non]
- **Regle(s) concernee(s) :** [RULE-XXX si applicable]

### 4. Reproduction
**Etapes :**
1. [ ]
2. [ ]
3. [ ]

**Resultat attendu :** [ ]
**Resultat obtenu :** [ ]

### 5. Mesures immediates prises
- [ ] Fonctionnalite desactivee : [Oui/Non - laquelle]
- [ ] Rollback effectue : [Oui/Non]
- [ ] Communication utilisateur : [Oui/Non - contenu]
- [ ] Escalation : [Liste des agents notifies]

### 6. Investigation en cours
- **Hypothese 1 :** [Description] | Statut : [A verifier/Valide/Incorrect]
- **Hypothese 2 :** [Description] | Statut : [ ]

### 7. Suivi
| Heure | Evenement | Agent |
|-------|-----------|-------|
| [H]   | [Action]  | [Nom] |
```

#### Template de post-mortem (obligatoire pour P0 et P1)

```markdown
## Post-mortem incident - [ID_INCIDENT]
**Date de l'incident :** [DATE]
**Date du post-mortem :** [DATE] (+24h pour P0, +72h pour P1)
**Facilitateur :** [Agent - ne pas etre l'auteur de l'incident]
**Participants :** [Liste obligatoire]

### 1. Resume (5 lignes maximum)
[Que s'est-il passe, quel en ete l'impact, comment a-t-on resolu]

### 2. Chronologie detaillee
| Heure | Evenement | Decision |
|-------|-----------|----------|

### 3. Cause racine (5 Whys)
- Probleme apparent : [ ]
- Why 1 : [ ]
- Why 2 : [ ]
- Why 3 : [ ]
- Why 4 : [ ]
- Cause racine : [ ]

### 4. Facteurs contribuants
- [ ] Facteur 1 : [ ]
- [ ] Facteur 2 : [ ]

### 5. Impact mesure
- Duree d'indisponibilite : [ ]
- Utilisateurs impactes : [ ]
- Regles fausses identifiees : [ ]
- Corrections necessaires : [ ]

### 6. Actions correctives
| ID | Action | Responsable | Echeance | Type |
|----|--------|-------------|----------|------|
| COR-001 | [Prevention/Detection/Attenuation] | [Agent] | [Date] | [Type] |

### 7. Lecons apprises
[Ce que l'equipe a appris et comment eviter la recurrence]

### 8. Validation
- [ ] Legal_Risk (si P0) : [Valide/Commentaires]
- [ ] CTO : [Valide/Commentaires]
- [ ] Tous les participants : [Signe]
```

#### Processus P1 - Blocage fonctionnel

```
Detection
    |
    v
[< 1h] Triage par l'agent qui detecte ou QA_Lead
    |         - Classification P1 confirmee
    |         - Assignation a l'agent responsable du composant
    |
    v
[< 4h] Investigation par l'agent assigne
    |         - Reproduction du bug
    |         - Analyse de l'impact
    |         - Proposition de correctif
    |
    v
[< 8h] Revue du correctif
    |         - Code review par un autre agent
    |         - Validation QA
    |
    v
[< 24h] Deploiement correctif
    |
    v
[+48h] Post-mortem (pour P1 critique uniquement)
```

#### Processus P2 / P3

```
Detection
    |
    v
[Backlog] Triage par QA_Lead en debut de sprint
    |
    v
[Sprint Planning] Priorisation avec Product_Owner
    |
    v
[Sprint courant ou suivant] Correction par l'agent responsable
    |
    v
[Review] Code review + Validation QA
    |
    v
[Merge] Integration au prochain deploiement
```

---

## 3. Mecanismes de communication inter-agents

### 3.1 Canaux de communication

| Canal | Type | Usage | Participants | Frequence |
|-------|------|-------|-------------|-----------|
| **Daily Agent Sync** | Formel synchrone | Rapport d'avancement, blocages, decisions | Tous les agents actifs | 2x par sprint |
| **Sprint Planning** | Formel synchrone | Planification, engagement, priorisation | CTO, PO, agents pilotes | 1x par sprint |
| **Sprint Review** | Formel synchrone | Demo, validation livrables, decision merge | Tous | 1x par sprint |
| **Sprint Retrospective** | Formel synchrone | Amelioration continue | Tous | 1x par sprint |
| **Comite de gouvernance** | Formel synchrone | Arbitrages, decisions strategiques, risques | CTO, PO, Legal_Risk, Security_Lead | 1x par mois ou sur convocation |
| **Revue technique croisee** | Formel asynchrone | Code review, revue architecture | 2+ agents (pilier different) | En continu |
| **Alerte risque** | Formel synchrone | Escalation risque reglementaire/securite | Legal_Risk, Security_Lead, CTO | A la detection |
| **War Room P0** | Formel synchrone | Crise reglementaire/fonctionnelle | Tous les agents impactes | A l'incident |
| **Echanges informels** | Informel | Questions rapides, clarifications | 2+ agents | En continu |
| **Documentation** | Formel asynchrone | DAT, specs, guides, decisions | Tous | En continu |

### 3.2 Regles de communication

```
PRINCIPE FONDAMENTAL : "Le bon canal pour le bon message"

Urgent + Important     -> War Room (P0) ou Alerte directe CTO/Legal_Risk
Urgent + Pas important -> Canal dedie avec tag [URGENT]
Pas urgent + Important -> Reunion planifiee ou Documentation
Pas urgent + Pas important -> Echange informel ou report a la prochaine reunion
```

**Regles strictes :**
1. **Pas de decision critique** dans les echanges informels. Toute decision doit etre documentee.
2. **Escalade immédiate** si un agent detecte un risque reglementaire ou de securite.
3. **Pas de silo** : Un agent ne peut pas travailler plus d'1 cycle sans rendre compte.
4. **Transparence par defaut** : Les informations techniques sont partagees par defaut, sauf exception securite.
5. **Reponse sous 4h** : Tout message formel necessite une reponse sous 4h ouvrées.

### 3.3 Format des rapports d'avancement

#### Rapport hebdomadaire d'avancement (par pilier)

```markdown
## Rapport d'avancement hebdomadaire - Pilier [NOM]
**Semaine :** [S XX] | **Periode :** [DATE] au [DATE]
**Redacteur :** [Agent pilier] | **Date de redaction :** [DATE]

### 1. Vue d'ensemble du pilier
**Sante globale :** [VERT / ORANGE / ROUGE]
**Tendance :** [Improving / Stable / Degrading]

### 2. Avancement par agent

#### [Agent 1]
| Tache | Avancement | Statut | Risque | Prochaine livraison |
|-------|-----------|--------|--------|---------------------|
| TASK-001 | 75% | EN COURS | Faible | Cycle +1 |

#### [Agent 2]
| Tache | Avancement | Statut | Risque | Prochaine livraison |
|-------|-----------|--------|--------|---------------------|
| TASK-002 | 100% | EN REVUE | - | - |

### 3. Points de blocage
| ID | Description | Agent bloque | Agent requis | Delai |
|----|-------------|--------------|--------------|-------|
| BLK-001 | [ ] | [Agent] | [Agent] | [X cycles] |

### 4. Risques emergents
| ID | Description | Probabilite | Impact | Action |
|----|-------------|-------------|--------|--------|
| RIS-001 | [ ] | [ %] | [1-5] | [ ] |

### 5. Decisions prises cette semaine
| ID | Decision | Decideur | Impact |
|----|----------|----------|--------|
| DEC-001 | [ ] | [Agent] | [ ] |

### 6. Livrables produits
| ID | Description | Statut | Validateurs | Lien |
|----|-------------|--------|-------------|------|
| LIV-001 | [ ] | [OK/KO] | [ ] | [ ] |

### 7. Besoins pour la semaine prochaine
[Description des ressources, decisions, ou informations necessaires]

### 8. Metriques du pilier
- Taux d'achevement sprint : [X]%
- Defauts decouverts : [N]
- Temps moyen de reparation : [T]
- Satisfaction technique (auto-evaluation) : [1-5]
```

#### Rapport mensuel de synthese (CTO)

```markdown
## Rapport mensuel de synthese - EDIFIA IA
**Mois :** [Mois Annee] | **Redacteur :** CTO | **Date :** [DATE]

### 1. Synthese executive (5 lignes)
[Resume du mois en termes d'avancement, risques, et decisions clefs]

### 2. Avancement produit
| Fonctionnalite | Statut | Avancement | Livraison estimee |
|----------------|--------|-----------|-------------------|
| [Nom] | [En cours/Termine/Reporte] | [X%] | [Date] |

### 3. Sante des piliers
| Pilier | Sante | Tendance | Principaux risques |
|--------|-------|----------|---------------------|
| STRATEGIE | [V/O/R] | [^/->/<-] | [ ] |
| EXPERIENCE | [V/O/R] | [^/->/<-] | [ ] |
| MOTEUR | [V/O/R] | [^/->/<-] | [ ] |
| OPERATIONS | [V/O/R] | [^/->/<-] | [ ] |

### 4. Qualite
| Metrique | Valeur | Seuil | Statut |
|----------|--------|-------|--------|
| Defauts critiques (P0/P1) | [N] | 0 | [OK/ALERTE] |
| Couverture de tests | [X%] | >80% | [OK/ALERTE] |
| Bugs en production | [N] | <3 | [OK/ALERTE] |
| Temps moyen de resolution P1 | [T] | <4h | [OK/ALERTE] |

### 5. Conformite
| Indicateur | Statut | Commentaire |
|------------|--------|-------------|
| Regles encodees validees | [N/N] | [ ] |
| Incidents conformite | [N] | [ ] |
| Veille juridique a jour | [OUI/NON] | [ ] |

### 6. Securite
| Indicateur | Statut | Commentaire |
|------------|--------|-------------|
| Vulnerabilites critiques | [N] | [ ] |
| Audits effectues | [N] | [ ] |
| Penetration tests | [Date dernier] | [ ] |

### 7. Decisions du mois
[Resume des decisions strategiques prises]

### 8. Objectifs mois prochain
[Top 3 priorites pour le mois suivant]

### 9. Recommandations
[Recommandations du CTO au comite de gouvernance]
```

### 3.4 Systeme de signalement de blocages

#### Grille de criticite des blocages

```
Niveau 1 - Blocage technique local
  -> Agent resout seul ou demande aide informelle
  -> Delai max : 1 cycle avant escalation

Niveau 2 - Blocage inter-agents
  -> Escalation au Daily Agent Sync
  -> Agent requis identifie et notifie
  -> Delai max : 2 cycles avant escalation niveau 3

Niveau 3 - Blocage strategique
  -> Escalation au CTO
  -> Decision d'arbitrage requise
  -> Delai max : 1 cycle pour decision

Niveau 4 - Blocage critique (risque reglementaire/projet)
  -> Escalation immediate CTO + Product_Owner + Legal_Risk
  -> Comite de crise convoque sous 4h
```

#### Procedure de signalement

```markdown
## Signalement de blocage - Template
**ID :** BLK-[NNN] | **Date :** [DATE] | **Heure :** [HEURE]
**Signale par :** [Agent] | **Pilier :** [NOM]

### 1. Description du blocage
[Description factuelle et concrete]

### 2. Contexte
- Tache en cours : [TASK-XXX]
- Avancement au moment du blocage : [X%]
- Actions deja essayees : [ ]

### 3. Agent / competence requis
- **Agent identifie :** [Nom] (si connu)
- **Competence requise :** [ ]
- **Disponibilite estimée :** [ ]

### 4. Impact
- Tache retardee de : [X cycles]
- Taches dependantes impactees : [Liste]
- Risque sur le sprint : [Faible/Moyen/Eleve/Critique]

### 5. Niveau de blocage
- [ ] Niveau 1 - Local (auto-resolution)
- [ ] Niveau 2 - Inter-agents (escalation Daily Sync)
- [ ] Niveau 3 - Strategique (escalation CTO)
- [ ] Niveau 4 - Critique (escalation Comite Crise)

### 6. Resolution
**Resolu par :** [Agent] | **Date :** [DATE]
**Solution :** [Description]
**Prevention :** [Action pour eviter la recurrence]
```

### 3.5 Reunions de synchronisation inter-piliers

#### Synchronisation hebdomadaire inter-piliers

**Frequence :** 1 fois par semaine  
**Duree :** 30 minutes  
**Participants :** 1 representant par pilier (le lead ou un agent designe)  
**Objectif :** Synchroniser les avancements, identifier les dependances croisees, resoudre les conflits

```
Ordre du jour type :

1. Tour de table rapide (15 min = 3-4 min/pilier)
   - Avancees majeures de la semaine
   - Livrables produits
   - Blocages a signaler

2. Dependances croisees (10 min)
   - "Le pilier MOTEUR a besoin de X pour Y"
   - "Le pilier EXPERIENCE attend Z du pilier OPERATIONS"
   - Accord sur les priorisations

3. Decisions et actions (5 min)
   - Actions assignees avec responsable et echeance
```

#### Comite de gouvernance mensuel

**Frequence :** 1 fois par mois (ou convocation extraordinaire)  
**Duree :** 90 minutes  
**Participants obligatoires :** CTO, Product_Owner, Legal_Risk, Security_Lead  
**Participants optionnels :** Leads de piliers selon l'ordre du jour  
**Objectif :** Decisions strategiques, arbitrages, revue risques, alignment roadmap

```
Ordre du jour type :

1. Revue de la roadmap (20 min)
   - Avancement vs plan
   - Ajustements necessaires
   - Nouvelles priorites

2. Revue des risques (20 min)
   - Risques actifs et mitigations en cours
   - Nouveaux risques identifies
   - Decision sur les risques a escalader

3. Revue conformite et securite (20 min)
   - Incidents du mois
   - Veille reglementaire
   - Etat des audits

4. Revue technique (15 min)
   - Dette technique
   - Evolutions architecturales envisagees
   - Performance et scalabilite

5. Decisions (15 min)
   - Points de decision prepares en amont
   - Vote si necessaire (CTO a voix preponderante en cas d'egalite)
```

### 3.6 Matrice RACI des communications

| Activite | CTO | PO | Legal_Risk | UX_Lead | Frontend_Dev | Content_Designer | Backend_Lead | Geometric_Solver | Compliance_Engine | BIM_Specialist | Data_AI | DevOps_SRE | QA_Lead | Security_Lead | Documentation |
|----------|-----|-----|------------|---------|--------------|------------------|--------------|------------------|-------------------|----------------|---------|------------|---------|---------------|---------------|
| Daily Agent Sync | I | I | I | R | R | I | R | R | R | I | R | R | R | R | I |
| Sprint Planning | A | R | C | C | C | I | C | C | C | I | C | C | C | C | I |
| Sprint Review | A | R | C | C | C | I | C | C | C | I | C | I | R | I | I |
| Sprint Retrospective | I | I | I | R | R | R | R | R | R | R | R | R | R | R | R |
| Comite Gouvernance | R | R | R | I | - | - | C | - | C | - | - | C | I | R | - |
| War Room P0 | A | C | R | I | I | - | C | - | R | - | C | R | C | R | - |
| Revue Code | I | - | - | C | R | - | A | C | R | C | C | I | I | C | - |
| Revue Conformite | I | I | A | - | - | - | C | - | R | - | - | - | C | - | - |
| Revue Securite | I | - | C | - | C | - | C | - | - | - | C | C | I | A | - |
| Decision Architecture | A | C | I | - | C | - | R | C | C | C | C | C | - | C | - |

*Legende : R = Responsible, A = Accountable, C = Consulted, I = Informed, - = Non implique*

---

## 4. Gouvernance de la qualite

### 4.1 Checklist de qualite par type de livrable

#### LIVRABLE : Code / Implementation

**Checklist obligatoire avant soumission a la revue :**

```markdown
## Checklist Qualite - Code / Implementation
**Agent :** [Nom] | **Tache :** [TASK-XXX] | **Date :** [DATE]

### Qualite intrinseque
- [ ] Le code compile / s'execute sans erreur
- [ ] Les tests unitaires passent (100%)
- [ ] La couverture de tests est >= 80% (logique metier) ou >= 60% (UI)
- [ ] Le code suit les conventions de codage du projet
- [ ] Pas de duplication de code (>5 lignes = refactoring)
- [ ] Les noms de variables/fonctions sont explicites
- [ ] La documentation du code est a jour (docstrings, comments)

### Fonctionnel
- [ ] Les criteres d'acceptation de la User Story sont implementes
- [ ] Les cas d'erreur sont geres
- [ ] Les cas limites sont traites
- [ ] La fonctionnalite est testable manuellement

### Performance
- [ ] Pas de requetes N+1
- [ ] Pas de chargements synchrones inutiles
- [ ] Les ressources sont liberees correctement
- [ ] Temps de reponse acceptable (si seuil defini)

### Securite
- [ ] Pas de donnees sensibles en dur
- [ ] Pas d'injection possible (SQL, XSS, etc.)
- [ ] Les entrees sont validees
- [ ] Les autorisations sont verifiees

### Conformite (si applicable)
- [ ] Aucune modification de la Couche 6 sans validation Legal_Risk
- [ ] Les donnees affichees sont conformes aux regles encodees
- [ ] Les textes juridiques sont exacts et a jour

### Documentation
- [ ] Le changelog est mis a jour
- [ ] La documentation technique est mise a jour (si API modifiee)
- [ ] Le guide utilisateur est mis a jour (si comportement modifie)

Signature agent : [ ] | Date : [ ]
```

#### LIVRABLE : Regle reglementaire encodee

```markdown
## Checklist Qualite - Regle Reglementaire
**Agent encodeur :** Compliance_Engine | **Validateur :** Legal_Risk
**Regle :** RULE-[NNN] | **Date :** [DATE]

### Fidelite a la source
- [ ] Le texte encode correspond exactement au document source
- [ ] La reference (document, page, article) est exacte et complete
- [ ] La regle est atomique (une seule contrainte)
- [ ] Les conditions d'applicabilite sont correctement identifiees

### Formalisme
- [ ] Le JSON est valide selon le schema
- [ ] Tous les champs obligatoires sont renseignes
- [ ] La valeur numerique a la bonne unite et la bonne precision
- [ ] Le type de contrainte est correctement identifie

### Tests
- [ ] Au moins 3 cas de test sont definis (nominal, limite, erreur)
- [ ] Les cas de test sont realistes
- [ ] Les resultats attendus sont corrects
- [ ] Les tests automatiques passent

### Integration
- [ ] La regle n'entre pas en conflit avec les regles existantes
- [ ] Les messages d'erreur sont comprehensibles
- [ ] La regle est applicable a toutes les zones concernees

### Validation croisee
- [ ] Revue par Legal_Rout (signature) : [ ]
- [ ] Revue par Compliance_Engine (signature) : [ ]
- [ ] Recette par QA_Lead (signature) : [ ]
```

#### LIVRABLE : Modele IA / Prompt

```markdown
## Checklist Qualite - Modele IA / Prompt
**Agent :** Data_AI | **Tache :** [TASK-XXX] | **Date :** [DATE]

### Conformite et securite (PRIORITAIRE)
- [ ] Le modele/prompt ne touche JAMAIS a la Couche 6
- [ ] Le modele/prompt ne genere pas de conseil reglementaire direct
- [ ] Le modele/prompt inclut un avertissement "verifier aupres d'un professionnel"
- [ ] Les sorties sont bornees et validees
- [ ] Pas de fuite de donnees sensibles possible

### Qualite du modele
- [ ] Le jeu de test couvre les cas nominal, limite et d'erreur
- [ ] Le taux de reussite sur le jeu de test est >= 95%
- [ ] Les reponses sont coherentes sur des entrees similaires
- [ ] Les temps de reponse sont acceptables

### Qualite du prompt (si applicable)
- [ ] Le prompt est versionne
- [ ] Le prompt a une documentation claire
- [ ] Le prompt a ete teste avec des cas reels
- [ ] Les edge cases sont documentes

### Biais et fairness
- [ ] Le modele a ete teste sur des cas diversifies
- [ ] Pas de biais detecte dans les sorties
- [ ] Les limitations du modele sont documentees

### Performance
- [ ] Le cout d'inference est maitrise
- [ ] Le temps de reponse est acceptable
- [ ] Le modele ne surcharge pas l'infrastructure

Signature : [ ]
```

#### LIVRABLE : Documentation

```markdown
## Checklist Qualite - Documentation
**Agent :** Documentation / [Agent auteur] | **Date :** [DATE]

### Exhaustivite
- [ ] Toutes les fonctionnalites sont documentees
- [ ] Tous les endpoints API sont documentes
- [ ] Tous les champs de configuration sont documentes
- [ ] Les prerequis sont clairement listes

### Precision
- [ ] Les informations techniques sont exactes
- [ ] Les exemples de code sont testes et fonctionnels
- [ ] Les captures d'ecran sont a jour
- [ ] Les versions referencees sont correctes

### Clarte
- [ ] Le langage est adapte au public cible
- [ ] Les termes techniques sont definis
- [ ] La structure est logique et navigable
- [ ] Les exemples sont concrets

### Conformite
- [ ] Les mentions legales sont presentes
- [ ] Les avertissements de securite sont visibles
- [ ] Les clauses de non-responsabilite sont incluses (si applicable)

### Revue
- [ ] Revue technique par un agent du pilier concerne : [ ]
- [ ] Revue editoriale : [ ]
- [ ] Validation Product_Owner (si doc utilisateur) : [ ]
```

### 4.2 Processus de code review

#### Principe general

**Tout code merge doit avoir ete revu par au moins un agent d'un pilier different.**

```
Auteur (Pilier X) --> Reviewer 1 (Pilier Y) --> Reviewer 2 (si critique) --> Merge
```

#### Qui review quoi

| Type de code | Reviewer obligatoire 1 | Reviewer obligatoire 2 (si > 200 lignes ou critique) |
|-------------|----------------------|-----------------------------------------------------|
| **Frontend** (UI/UX) | Frontend_Dev (autre tache) | UX_Lead ou Backend_Lead |
| **Backend API** | Backend_Lead (autre module) | Frontend_Dev (consommateur) ou Security_Lead |
| **Solveur geometrique** | Geometric_Solver + Backend_Lead | CTO |
| **Couche 6 (Conformite)** | Compliance_Engine + Legal_Risk | QA_Lead |
| **Modeles IA / Prompts** | Data_AI (peer) + Backend_Lead | CTO (si impact metier) |
| **BIM / IFC** | BIM_Specialist + Backend_Lead | QA_Lead |
| **Infrastructure / CI/CD** | DevOps_SRE (peer) + Security_Lead | CTO |
| **Tests** | QA_Lead + Agent responsable du code teste | - |
| **Securite (auth, crypto)** | Security_Lead + Backend_Lead | CTO |

#### Checklist de code review

```markdown
## Code Review Checklist
**Reviewer :** [Nom] | **Auteur :** [Nom] | **PR :** [NUMERO]
**Date :** [DATE] | **Lignes modifiees :** [N]

### Lecture et comprehension
- [ ] Je comprends ce que le code fait
- [ ] Je comprends POURQUOI le code le fait ainsi
- [ ] La description du PR est claire et complete

### Correctitude
- [ ] Le code fait ce qu'il est cense faire
- [ ] Les cas d'erreur sont geres
- [ ] Les cas limites sont traites
- [ ] Pas de regression identifiee

### Qualite
- [ ] Le code est lisible et maintenable
- [ ] Les noms sont explicites
- [ ] Pas de code mort ou commentaire obsolete
- [ ] Pas de duplication inutile

### Tests
- [ ] Les tests sont presents et pertinents
- [ ] Les tests passent
- [ ] Les cas limites sont testes

### Securite
- [ ] Pas de vulnerabilite evidente
- [ ] Les donnees sensibles sont protegees
- [ ] Les autorisations sont verifiees

### Performance
- [ ] Pas de probleme de performance evident
- [ ] Pas de requete inefficiente

### Documentation
- [ ] Le code est documente si complexe
- [ ] Le changelog est mis a jour
- [ ] La doc API est mise a jour (si applicable)

### Decision
- [ ] APPROVE - Pret pour merge
- [ ] REQUEST CHANGES - Voir commentaires
- [ ] COMMENT - Questions sans blocage

**Commentaires :**
[ ]

Signature reviewer : [ ]
```

#### Gravite des commentaires de review

```markdown
| Niveau | Icone | Signification | Action attendue |
|--------|-------|---------------|-----------------|
| **Blocking** | [BLOCKING] | Doit etre corrige avant merge | Correction obligatoire |
| **Major** | [MAJOR] | Devrait etre corrige, peut etre traite dans un follow-up | Correction ou justification |
| **Minor** | [MINOR] | Preference, pas obligatoire | A la discretion de l'auteur |
| **Question** | [QUESTION] | Besoin de clarification | Reponse attendue |
| **Praise** | [PRAISE] | Feedback positif | Aucune action |
```

### 4.3 Processus de review de conformite (Couche 6)

**La Couche 6 (Moteur Reglementaire) est la composante la plus critique de la plateforme.**

#### Principe fondamental

```
COUCHE 6 = DETERMINISTE + IMMUTABLE + TRACEABLE
- Jamais de LLM dans la Couche 6
- Jamais de modification directe sans double validation
- Jamais de suppression de regle (archivage uniquement)
- Chaque regle = source + tests + validation + signature
```

#### Architecture de la review de conformite

```
+------------------+     +------------------+     +------------------+
|  Compliance      |     |   Legal_Risk     |     |     QA_Lead      |
|  Engine          |     |                  |     |                  |
|  (Auteur)        | --> |  (Validateur 1)  | --> |  (Validateur 2)  |
|                  |     |                  |     |  (Independant)   |
+------------------+     +------------------+     +------------------+
        |                         |                         |
        v                         v                         v
   Encodage regle           Revue juridique            Tests recette
   JSON deterministe         Fidelite source           Exhaustivite
   Tests unitaires            Checklist formelle        Non-regression
        |                         |                         |
        +------------+------------+------------+------------+
                     |                         |
                     v                         v
              [MERGE] Si tous PASS      [REJET] Si un FAIL
```

#### Checklist de review conformite Couche 6

```markdown
## Review Conformite - Couche 6 - Checklist exhaustive
**Regle :** RULE-[NNN] | **Date :** [DATE]

### 1. Tracabilite source (Legal_Risk)
- [ ] Le document source est authentique et officiel
- [ ] Le document source est la version en vigueur
- [ ] La reference (document, page, article) est exacte
- [ ] Le texte encode est la traduction exacte du texte source

### 2. Formalisme technique (Compliance_Engine)
- [ ] Le JSON est valide selon le schema v[VERSION]
- [ ] Le type de contrainte est correctement identifie
- [ ] La valeur est correcte (unite, precision)
- [ ] Les conditions d'applicabilite sont exhaustives
- [ ] Les zones concernees sont correctement listees

### 3. Qualite des tests (QA_Lead)
- [ ] Au minimum 3 cas de test par regle (nominal, limite, erreur)
- [ ] Les cas de test couvrent toutes les branches conditionnelles
- [ ] Les resultats attendus sont corrects
- [ ] Les tests automatiques passent a 100%
- [ ] Les tests de non-regression passent a 100%

### 4. Absence de conflit (Compliance_Engine + QA_Lead)
- [ ] La regle n'entre pas en conflit avec les regles existantes
- [ ] La regle est coherente avec les regles de la meme zone
- [ ] Les priorites de regles sont correctement gerees

### 5. Qualite utilisateur (UX_Lead si message utilisateur)
- [ ] Le message d'erreur est comprehensible
- [ ] Le message d'erreur reference la source reglementaire
- [ ] Le message propose une action corrective

### Decision finale
- [ ] VALIDE - La regle peut etre deployee
- [ ] A CORRIGER - Voir commentaires : [ ]
- [ ] REJET - La regle doit etre re-encodee

Signatures :
- Compliance_Engine : [ ] Date : [ ]
- Legal_Risk : [ ] Date : [ ]
- QA_Lead : [ ] Date : [ ]
```

### 4.4 Processus de review securite

#### Declencheurs de la review securite

Une review securite est OBLIGATOIRE dans les cas suivants :
- [ ] Toute modification du systeme d'authentification/autorisation
- [ ] Toute modification de la gestion des donnees personnelles (RGPD)
- [ ] Toute nouvelle connexion a un service externe
- [ ] Toute modification de l'infrastructure (Scaleway)
- [ ] Toute modification des regles de pare-feu / reseau
- [ ] Toute utilisation de donnees utilisateur dans un modele IA
- [ ] Toute modification de la chaine de chiffrement
- [ ] Toute modification touchant aux API exposant des donnees sensibles

#### Checklist de review securite

```markdown
## Review Securite - Checklist
**Demande par :** [Agent] | **Tache :** [TASK-XXX]
**Reviewer :** Security_Lead | **Date :** [DATE]

### Authentification et autorisation
- [ ] Les permissions sont verifiees cote serveur
- [ ] Les tokens sont securises (duree, renouvellement, revocation)
- [ ] Pas de contournement possible des autorisations

### Donnees
- [ ] Les donnees sensibles sont chiffrees (au repos et en transit)
- [ ] Pas de donnees sensibles en dur dans le code
- [ ] Les logs ne contiennent pas de donnees sensibles
- [ ] Le RGPD est respecte (consentement, droit a l'oubli, portabilite)

### API et services externes
- [ ] Les appels externes sont authentifies
- [ ] Les donnees reques sont validees
- [ ] Les timeouts sont configures
- [ ] Les retries ne causent pas de degradation

### Infrastructure
- [ ] Les ports exposes sont minimises
- [ ] Les regles de pare-feu sont a jour
- [ ] Les secrets sont geres via un vault (pas en variable d'env)
- [ ] Les acces SSH sont restreints et audites

### Modeles IA
- [ ] Les prompts sont proteges contre l'injection
- [ ] Les donnees d'entrainement sont anonymisees si necessaire
- [ ] Les sorties sont filtrees si necessaire
- [ ] Pas de fuite de donnees via le modele

### Conformite hébergement (Scaleway - Souverainete)
- [ ] Les donnees restent sur l'infrastructure Scaleway
- [ ] Aucun transfert hors EU sans autorisation CTO + Legal_Risk
- [ ] Les backups sont chiffres et localises en France

### Tests de securite
- [ ] Les tests de securite passent
- [ ] Les dependances n'ont pas de vulnerabilites connues
- [ ] Le code a ete analyse par outil d'analyse statique

### Decision
- [ ] PASS - Aucun probleme de securite
- [ ] PASS avec remediations - Voir actions : [ ]
- [ ] FAIL - Bloquant pour le merge. Voir : [ ]

Signature Security_Lead : [ ] | Date : [ ]
```

### 4.5 Definition of Done universelle

```markdown
## Definition of Done - EDIFIA Universelle
**Applicable a :** Toutes les taches de tous les piliers
**Version :** 1.0

### Criteres de base (obligatoires pour TOUS)
- [ ] Le code est ecrit et fonctionne sur l'environnement de developpement
- [ ] Les tests unitaires sont ecrits et passent
- [ ] La couverture de tests est >= 80% (metier) ou >= 60% (UI)
- [ ] La revue de code est faite et approuvee par un agent d'un autre pilier
- [ ] La documentation technique est mise a jour
- [ ] Le changelog est mis a jour
- [ ] Aucune regression detectee sur les fonctionnalites existantes

### Criteres fonctionnels
- [ ] Les criteres d'acceptation de la User Story sont tous satisfaits
- [ ] Les cas d'erreur sont geres et testes
- [ ] Les cas limites sont traites et testes
- [ ] La fonctionnalite est testable en environnement de staging

### Criteres de qualite specifiques par pilier

#### Si livrable EXPERIENCE (UI/UX)
- [ ] La maquette est respectee (pixel-perfect si specifie)
- [ ] L'interface est responsive (desktop/tablette/mobile)
- [ ] L'accessibilite est conforme (RGAA niveau AA minimum)
- [ ] Les micro-copy sont valides par Content_Designer
- [ ] Les performances frontend sont mesurees et acceptables

#### Si livrable MOTEUR (Backend/IA)
- [ ] Les performances sont mesurees et acceptables
- [ ] Les API sont documentees (OpenAPI/Swagger)
- [ ] Les schemas de donnees sont a jour
- [ ] La compatibilite ascendante est preservee (ou migration documentee)

#### Si livrable COMPLIANCE (Couche 6)
- [ ] L'encodage est double-valide (Compliance_Engine + Legal_Risk)
- [ ] Les tests de recette passent a 100%
- [ ] Aucun conflit avec les regles existantes
- [ ] La tracabilite source est complete

#### Si livrable IA (Modeles/Prompts)
- [ ] Le modele ne touche pas a la Couche 6
- [ ] Le jeu de test couvre 95%+ de precision
- [ ] Les biais sont documentes et mitiges
- [ ] Le cout d'inference est maitrise

#### Si livrable OPERATIONS (Infra/Securite)
- [ ] Les monitoring et alertes sont configures
- [ ] Les runbooks sont mis a jour
- [ ] La revue securite est passee (Security_Lead)
- [ ] Les tests de deploiement sont passes

### Criteres de conformite et securite (obligatoires si applicable)
- [ ] Si impact conformite : Validation Legal_Risk signee
- [ ] Si impact securite : Revue Security_Lead passee
- [ ] Si nouvelle donnee utilisateur : Conformite RGPD verifiee
- [ ] Si API externe : Securite et souverainete verifiees

### Criteres de documentation
- [ ] Le guide utilisateur est mis a jour (si comportement change)
- [ ] La documentation API est mise a jour (si endpoint change)
- [ ] Les decisions architecturales sont documentees (si ADR)
- [ ] Le README est mis a jour (si necessaire)

### Critere de validation finale
- [ ] La demo a la Sprint Review est preparee
- [ ] Product_Owner valide la fonctionnalite
- [ ] QA_Lead valide la qualite
- [ ] CTO autorise le merge

### Signatures DoD
- [ ] Auteur : [ ] | Date : [ ]
- [ ] Reviewer code : [ ] | Date : [ ]
- [ ] QA_Lead : [ ] | Date : [ ]
- [ ] Legal_Risk (si applicable) : [ ] | Date : [ ]
- [ ] Security_Lead (si applicable) : [ ] | Date : [ ]
- [ ] Product_Owner : [ ] | Date : [ ]
```

---

## 5. Gestion des risques en continu

### 5.1 Processus de veille risque par Legal_Risk

#### Veille reglementaire continue

**Responsable :** Legal_Risk  
**Frequence :** Continue (veille quotidienne + rapport hebdomadaire)  
**Objectif :** Detecter les evolutions reglementaires qui impacteraient la plateforme

```markdown
## Processus de veille reglementaire

### Sources de veille (minimum)
1. Legifrance.gouv.fr (decrets, lois, ordonnances)
2. Circulaires ministerielles (DGALN, DGPR)
3. Publications professionnelles ( Ordre des architectes, CSTB)
4. Veille jurisprudentielle (construction, urbanisme)
5. Normes Eurocodes et DTU (evolutions)
6. Reglementation environnementale (RE2020, etc.)

### Frequence
- Veille automatisee (alertes) : Quotidienne
- Revue manuelle : Hebdomadaire
- Rapport synthese : Mensuel

### Classification des evolutions
| Niveau | Impact | Action | Delai |
|--------|--------|--------|-------|
| **Critique** | Obligation legale nouvelle ou modifiee | Escalation immediate + plan d'action | < 24h |
| **Majeur** | Evolution significative des regles | Analyse d'impact + planification | < 1 semaine |
| **Modere** | Evolution mineure ou interpretation | Enregistrement + analyse au prochain comite | < 1 mois |
| **Faible** | Information sans impact immediat | Archivage pour veille | Prochain rapport |
```

#### Template de rapport de veille

```markdown
## Rapport de veille reglementaire - Semaine [S XX]
**Redacteur :** Legal_Risk | **Date :** [DATE]

### Alertes critiques (action immediate)
| ID | Evolution | Impact sur EDIFIA | Action requise | Echeance |
|----|-----------|-------------------|----------------|----------|
| VEI-001 | [ ] | [ ] | [ ] | [ ] |

### Evolutions majeures (a planifier)
| ID | Evolution | Impact estime | Action proposee | Sprint cible |
|----|-----------|---------------|-----------------|--------------|
| VEI-002 | [ ] | [ ] | [ ] | [ ] |

### Evolutions moderees (suivi)
| ID | Evolution | Commentaire |
|----|-----------|-------------|
| VEI-003 | [ ] | [ ] |

### Decisions necessaires
| ID | Question | Decideur | Echeance |
|----|----------|----------|----------|
| DEC-001 | [ ] | [ ] | [ ] |

### Regles impactees identifiees
| Regle | Impact | Action |
|-------|--------|--------|
| RULE-XXX | [ ] | [ ] |
```

### 5.2 Processus d'alerte et escalation

#### Matrice d'escalation

```
Niveau 1 : Detection par un agent
    |
    |--> Risque technique local
    |    -> Resolution par l'agent + signalement au Daily Sync
    |
    |--> Risque inter-piliers
    |    -> Escalation au Daily Sync + agent responsable identifie
    |
    |--> Risque reglementaire / securite
    |    -> Escalation immediate Legal_Risk / Security_Lead
    |
    v
Niveau 2 : Escalation au lead de pilier
    |
    |--> Risque manageable au niveau pilier
    |    -> Plan d'action au niveau pilier + suivi hebdomadaire
    |
    |--> Risque depassant le pilier
    |    -> Escalation au CTO
    |
    v
Niveau 3 : Escalation au CTO
    |
    |--> Risque manageable au niveau projet
    |    -> Plan d'action projet + suivi au Comite de Gouvernance
    |
    |--> Risque critique (mortel, legal, existentiel)
    |    -> Convocation Comite de Crise sous 4h
    |
    v
Niveau 4 : Comite de Crise
    |    -> Decision executive
    |    -> Communication (interne/externe si necessaire)
    |    -> Plan d'action immediat
```

#### Template d'alerte risque

```markdown
## Alerte Risque - EDIFIA
**ID :** RIS-[NNN] | **Date :** [DATE] | **Heure :** [HEURE]
**Emetteur :** [Agent] | **Pilier :** [NOM]

### Classification
- **Niveau :** [Critique/Majeur/Modere/Faible]
- **Type :** [Reglementaire/Technique/Securite/Projet/Exterieur]
- **Probabilite :** [ %]
- **Impact :** [1-5]

### Description
[Description factuelle du risque identifie]

### Impact sur EDIFIA
- [ ] Risque mortel (conformite construction) : [OUI/NON]
- [ ] Risque legal : [OUI/NON]
- [ ] Risque securite donnees : [OUI/NON]
- [ ] Risque financier : [OUI/NON]
- [ ] Risque reputation : [OUI/NON]
- [ ] Risque technique : [OUI/NON]

### Mitigation proposee
[Actions proposees pour attenuer le risque]

### Escalation
- [ ] Niveau 1 - Agent local
- [ ] Niveau 2 - Lead pilier : [Nom] notifie le [DATE]
- [ ] Niveau 3 - CTO : [Nom] notifie le [DATE]
- [ ] Niveau 4 - Comite de Crise convoque : [DATE]

### Suivi
| Date | Action | Agent | Statut |
|------|--------|-------|--------|
| [ ]  | [ ]    | [ ]   | [ ]    |
```

### 5.3 Mecanismes de prevention (checklists, garde-fous)

#### Checklist de prevention des risques reglementaires

```markdown
## Prevention Risques Reglementaires - Checklist hebdomadaire
**Agent :** Legal_Risk | **Semaine :** [S XX] | **Date :** [DATE]

### Veille
- [ ] Les alertes automatisees ont ete revues
- [ ] Aucune evolution legislative critique detectee
- [ ] Les sources de veille sont a jour

### Regles encodees
- [ ] Le taux de regles a jour est de 100%
- [ ] Aucune regle en attente de validation > 1 semaine
- [ ] Les regles en cours de revision sont identifiees

### Incidents
- [ ] Aucun incident P0 ce mois-ci
- [ ] Les incidents P1 ont un plan d'action
- [ ] Les post-mortems sont a jour

### Processus
- [ ] Le processus d'encodage a ete respecte pour toutes les nouvelles regles
- [ ] Les double validations sont documentees
- [ ] Les recettes sont exhaustives

### Prediction
- [ ] Les evolutions reglementaires connues sont planifiees
- [ ] Les regles a risque de changement sont identifiees
- [ ] Un plan de mise a jour est en place pour les evolutions majeures

Signature : [ ]
```

#### Garde-fous automatises (implemented dans la plateforme)

```markdown
## Garde-fous Techniques - Couche 6

### Garde-fou 1 : Blocage LLM sur Couche 6
- **Description :** Le code de la Couche 6 ne peut pas appeler d'API LLM
- **Implementation :** Linting + test d'architecture (ArchUnit/TNG)
- **Detection :** CI/CD bloque le merge si violation
- **Action si violation :** REJET automatique du PR + alerte Security_Lead

### Garde-fou 2 : Validation schema regle
- **Description :** Toute regle doit valider le schema JSON avant stockage
- **Implementation :** Validation automatique a l'insertion
- **Detection :** Erreur technique si schema invalide
- **Action si violation :** Rejet de la regle + log d'audit

### Garde-fou 3 : Double signature obligatoire
- **Description :** Aucune regle ne peut etre activee sans 2 signatures
- **Implementation :** Flag `is_active` controle par la presence de 2 signatures
- **Detection :** Requete bloquee si regle non validee
- **Action si violation :** Erreur 403 + log securite

### Garde-fou 4 : Immutabilite des regles actives
- **Description :** Une regle active ne peut pas etre modifiee, seulement archivee + remplacee
- **Implementation :** Contrainte base de donnees + log d'historique
- **Detection :** Tentative de modification = erreur
- **Action si violation :** Blocage + audit

### Garde-fou 5 : Tests de non-regression automatiques
- **Description :** Tout changement dans la Couche 6 declenche les tests de non-regression
- **Implementation :** CI/CD pipeline
- **Detection :** Echec des tests
- **Action si violation :** MERGE bloque

### Garde-fou 6 : Monitoring des reponses conformite
- **Description :** Monitoring temps reel des reponses de la Couche 6
- **Implementation :** Dashboard + alertes
- **Seuil d'alerte :** > 0.1% de reponses en erreur
- **Action si violation :** Alerte P1 automatique
```

### 5.4 Processus de decision en crise (P0 reglementaire)

#### War Room - Processus d'urgence

```
DECLENCHEMENT : Detection d'un risque mortel (P0 reglementaire)
    |
    v
T+0min   : Escalation automatique
           - Notification : CTO, Legal_Risk, Compliance_Engine, Security_Lead
           - Canal dedie ouvert (War Room)
           - Tous les autres agents mis en mode "standby"
    |
    v
T+15min  : Reunion d'urgence (War Room)
           Participants obligatoires : CTO, Legal_Risk, Compliance_Engine
           Participants selon incident : Agent responsable, QA_Lead, DevOps_SRE
    |
    v
T+15-30min : Diagnostic rapide
           1. Quelle regle est fausse / manquante / contradictoire ?
           2. Quels utilisateurs sont impactes ?
           3. Quel est l'impact maximal potentiel ?
           4. Peut-on desactiver la regle sans causer plus de dommage ?
    |
    v
T+30min  : Decision d'urgence
           Option A : Desactivation immediate de la regle (feature flag)
           Option B : Rollback a la version precedente
           Option C : Correctif d'urgence
           
           Criteres de decision :
           - Si risque de mortel IMMEDIAT -> Option A ou B (delai < 30min)
           - Si risque controllable -> Option C (delai < 2h)
    |
    v
T+30min-2h : Execution
           - DevOps_SRE : Deploiement de la mesure d'urgence
           - Compliance_Engine : Preparation du correctif
           - Legal_Risk : Validation juridique du contournement
           - QA_Lead : Tests de validation du contournement
    |
    v
T+2h     : Stabilisation
           - Verification que la mesure d'urgence fonctionne
           - Monitoring renforce
           - Communication aux utilisateurs impactes (si necessaire)
    |
    v
T+4h     : Correctif definitif
           - Correctif prepare et valide
           - Deploiement en production
           - Verification post-deploiement
    |
    v
T+24h    : Post-mortem
           - Reunion obligatoire
           - Rapport d'incident
           - Actions correctives planifiees
    |
    v
T+48h    : Rapport gouvernance
           - Rapport au comite de gouvernance
           - Lecons apprises
           - Mise a jour des processus si necessaire
```

#### Roles en War Room

| Role | Responsable | Actions |
|------|-------------|---------|
| **War Room Lead** | CTO | Coordination, decisions finales, communication externe |
| **Expert Conformite** | Legal_Risk | Validation juridique, analyse risque, avis legal |
| **Expert Technique** | Compliance_Engine | Diagnostic technique, correctif, validation |
| **Execution** | DevOps_SRE | Deploiement, rollback, monitoring |
| **Validation** | QA_Lead | Tests, validation des mesures, non-regression |
| **Communication** | Product_Owner | Communication utilisateurs, FAQ, support |

#### Template de decision de crise

```markdown
## Decision de crise - War Room
**Incident :** INC-[NNN] | **Date :** [DATE] | **Heure decision :** [HEURE]
**War Room Lead :** [Nom]

### Situation
[Resume de la situation en 5 lignes max]

### Options evaluees
| Option | Description | Avantages | Risques | Delai |
|--------|-------------|-----------|---------|-------|
| A | [ ] | [ ] | [ ] | [ ] |
| B | [ ] | [ ] | [ ] | [ ] |
| C | [ ] | [ ] | [ ] | [ ] |

### Decision
**Option retenue :** [A/B/C]
**Justification :** [ ]

### Plan d'execution
| Etape | Action | Responsable | Delai |
|-------|--------|-------------|-------|
| 1 | [ ] | [ ] | [ ] |
| 2 | [ ] | [ ] | [ ] |

### Risques residuels
[Risques acceptes avec la decision prise]

### Signatures (War Room)
- [ ] CTO : [ ] | Heure : [ ]
- [ ] Legal_Risk : [ ] | Heure : [ ]
- [ ] Compliance_Engine : [ ] | Heure : [ ]
```

---

## 6. Tableau de bord de suivi

### 6.1 Metriques de sante du projet

#### Metriques techniques

| ID | Metrique | Definition | Responsable | Frequence | Seuil VERT | Seuil ORANGE | Seuil ROUGE |
|----|----------|-----------|-------------|-----------|------------|--------------|-------------|
| T-01 | Couverture de tests | % de code couvert par des tests | QA_Lead | Quotidien | > 80% | 60-80% | < 60% |
| T-02 | Defauts critiques | Nombre de bugs P0/P1 ouverts | QA_Lead | Quotidien | 0 | 1 | > 1 |
| T-03 | Temps moyen de resolution P1 | Duree moyenne de resolution d'un P1 | QA_Lead | Hebdo | < 4h | 4-8h | > 8h |
| T-04 | Defauts par sprint | Nombre de bugs decouverts par sprint | QA_Lead | Par sprint | < 5 | 5-10 | > 10 |
| T-05 | Dette technique | Score de dette technique (sonar) | Backend_Lead | Hebdo | < 5% | 5-15% | > 15% |
| T-06 | Performance API | Temps de reponse p95 des API | Backend_Lead | Quotidien | < 200ms | 200-500ms | > 500ms |
| T-07 | Disponibilite | Uptime de la plateforme | DevOps_SRE | Quotidien | > 99.9% | 99.5-99.9% | < 99.5% |
| T-08 | Temps de deploiement | Duree du pipeline CI/CD | DevOps_SRE | Par deploiement | < 15min | 15-30min | > 30min |
| T-09 | Incidents securite | Nombre de vulnerabilites critiques | Security_Lead | Hebdo | 0 | 1 | > 1 |
| T-10 | Couverture documentation | % de fonctionnalites documentees | Documentation | Mensuel | > 90% | 70-90% | < 70% |

#### Metriques produit

| ID | Metrique | Definition | Responsable | Frequence | Seuil VERT | Seuil ORANGE | Seuil ROUGE |
|----|----------|-----------|-------------|-----------|------------|--------------|-------------|
| P-01 | Velocity | Points de story completes par sprint | Product_Owner | Par sprint | > 80% engagement | 60-80% | < 60% |
| P-02 | Taux de livraison | % de taches livrees a temps | Product_Owner | Par sprint | > 90% | 70-90% | < 70% |
| P-03 | Satisfaction stakeholders | Note de satisfaction (1-5) | Product_Owner | Mensuel | > 4 | 3-4 | < 3 |
| P-04 | Backlog health | Age moyen des items backlog | Product_Owner | Hebdo | < 2 sprints | 2-4 sprints | > 4 sprints |
| P-05 | Scope adherence | % de taches dans le scope V1 | Product_Owner | Par sprint | > 95% | 85-95% | < 85% |

#### Metriques risque

| ID | Metrique | Definition | Responsable | Frequence | Seuil VERT | Seuil ORANGE | Seuil ROUGE |
|----|----------|-----------|-------------|-----------|------------|--------------|-------------|
| R-01 | Regles a jour | % de regles conformes aux textes en vigueur | Legal_Risk | Mensuel | 100% | 95-99% | < 95% |
| R-02 | Regles en attente de validation | Nombre de regles non validees | Legal_Risk | Hebdo | 0 | 1-5 | > 5 |
| R-03 | Incidents conformite | Nombre d'incidents P0/P1 conformite (30j) | Legal_Risk | Mensuel | 0 | 1 | > 1 |
| R-04 | Veille juridique a jour | Delai depuis derniere revue de veille | Legal_Risk | Hebdo | < 7 jours | 7-14 jours | > 14 jours |
| R-05 | Validation double conformite | % de regles avec double validation | Compliance_Engine | Par sprint | 100% | 95-99% | < 95% |
| R-06 | Risques actifs | Nombre de risques avec probabilite > 50% | Legal_Risk | Mensuel | < 3 | 3-5 | > 5 |
| R-07 | Temps de reponse risque | Delai moyen entre detection et traitement | CTO | Mensuel | < 24h | 24-48h | > 48h |

#### Metriques securite

| ID | Metrique | Definition | Responsable | Frequence | Seuil VERT | Seuil ORANGE | Seuil ROUGE |
|----|----------|-----------|-------------|-----------|------------|--------------|-------------|
| S-01 | Vulnerabilites critiques | Nombre de vuln critiques ouvertes | Security_Lead | Quotidien | 0 | 1 | > 1 |
| S-02 | Vulnerabilites majeures | Nombre de vuln majeures ouvertes | Security_Lead | Hebdo | < 3 | 3-10 | > 10 |
| S-03 | Temps de patch securite | Delai moyen de correction vuln | Security_Lead | Mensuel | < 48h | 48h-7j | > 7j |
| S-04 | Audits de securite | Nombre d'audits effectues (trimestre) | Security_Lead | Trimestriel | > 1 | 1 | 0 |
| S-05 | Conformite RGPD | Score de conformite RGPD | Security_Lead | Mensuel | > 95% | 80-95% | < 80% |
| S-06 | Penetration tests | Date du dernier pentest | Security_Lead | Mensuel | < 3 mois | 3-6 mois | > 6 mois |

### 6.2 Frequence de mise a jour des tableaux de bord

```
Metriques quotidiennes (auto)  : T-01, T-02, T-06, T-07, T-09, S-01
Metriques hebdomadaires        : T-03, T-04, T-05, T-10, P-04, R-02, R-04, S-02
Metriques par sprint           : P-01, P-02, P-05, R-05
Metriques mensuelles           : P-03, R-01, R-03, R-04, R-06, R-07, S-03, S-05, S-06
Metriques trimestrielles       : S-04
```

### 6.3 Tableau de bord synthetique (vue CTO)

```markdown
## Tableau de bord - Synthese EDIFIA IA
**Date :** [DATE] | **Sprint :** [N] | **Periode :** [Mois/Annee]

### Sante globale : [VERT / ORANGE / ROUGE]

### Vue metrique (dernieres valeurs)
| Categorie | Metrique | Valeur | Seuil | Statut |
|-----------|----------|--------|-------|--------|
| Technique | Couverture tests | [X%] | >80% | [V/O/R] |
| Technique | Defauts critiques | [N] | 0 | [V/O/R] |
| Technique | Disponibilite | [X%] | >99.9% | [V/O/R] |
| Produit | Velocity | [X%] | >80% | [V/O/R] |
| Produit | Scope adherence | [X%] | >95% | [V/O/R] |
| Risque | Regles a jour | [X%] | 100% | [V/O/R] |
| Risque | Incidents conformite | [N] | 0 | [V/O/R] |
| Securite | Vuln. critiques | [N] | 0 | [V/O/R] |
| Securite | Conformite RGPD | [X%] | >95% | [V/O/R] |

### Alertes actives
| ID | Alerte | Niveau | Depuis | Action en cours | Responsable |
|----|--------|--------|--------|-----------------|-------------|
| [ ] | [ ] | [P0/P1/P2] | [ ] | [ ] | [ ] |

### Tendances (vs periode precedente)
- Qualite : [En hausse / Stable / En baisse]
- Performance : [En hausse / Stable / En baisse]
- Conformite : [En hausse / Stable / En baisse]
- Securite : [En hausse / Stable / En baisse]

### Preoccupations principales
1. [ ]
2. [ ]
3. [ ]

### Actions prioritaires
| ID | Action | Responsable | Echeance |
|----|--------|-------------|----------|
| [ ] | [ ] | [ ] | [ ] |
```

---

## 7. Anti-patterns et garde-fous

### 7.1 Liste explicite des comportements interdits

#### Anti-patterns critiques (INTERDIT - Consequence : procedure disciplinaire)

| ID | Anti-pattern | Description | Consequence | Detection |
|----|-------------|-------------|-------------|-----------|
| **AP-CRIT-01** | **LLM dans la Couche 6** | Utiliser un LLM pour encoder, modifier, ou valider une regle reglementaire | Procedure disciplinaire + investigation + rapport gouvernance | Revue code automatique + audit |
| **AP-CRIT-02** | **Contourner la double validation conformite** | Merger une regle sans les 2 signatures requises (Compliance_Engine + Legal_Risk) | Procedure disciplinaire + rollback immediat | Garde-fou automatique |
| **AP-CRIT-03** | **Ignorer un risque mortel detecte** | Ne pas escalader un risque reglementaire identifie | Procedure disciplinaire + investigation | Monitoring + whistleblowing |
| **AP-CRIT-04** | **Fuite de donnees utilisateur** | Transmettre des donnees utilisateur hors infrastructure Scaleway sans autorisation | Procedure disciplinaire + rapport CNIL | Monitoring reseau + audit |
| **AP-CRIT-05** | **Backdoor ou contournement securite** | Implementer un mecanisme de contournement des controles de securite | Procedure disciplinaire + exclusion possible | Audit securite + code review |

#### Anti-patterns majeurs (INTERDIT - Consequence : correction immediate + rapport)

| ID | Anti-pattern | Description | Consequence | Detection |
|----|-------------|-------------|-------------|-----------|
| **AP-MAJ-01** | **Merge sans revue** | Merger du code sans revue par un agent d'un autre pilier | Revert immediat + rapport CTO | CI/CD bloque sans approval |
| **AP-MAJ-02** | **Scope creep non controle** | Ajouter une fonctionnalite hors scope V1 sans validation Product_Owner + CTO | Revert + rapport | Revue de sprint |
| **AP-MAJ-03** | **Tests non passes** | Merger du code alors que les tests echouent | Revert immediat | CI/CD bloque si tests KO |
| **AP-MAJ-04** | **Documentation non mise a jour** | Livrer une fonctionnalite sans mettre a jour la documentation | Blocage merge | Checklist DoD |
| **AP-MAJ-05** | **Silence sur blocage** | Ne pas signaler un blocage pendant plus d'1 cycle | Escalation forcee | Daily Sync obligatoire |
| **AP-MAJ-06** | **Conseil reglementaire par IA** | Laisser un LLM donner un conseil interpretatif sur la reglementation | Correction immediate + validation Legal_Risk | Revue prompts + output |
| **AP-MAJ-07** | **Modif regle sans test** | Modifier une regle reglementaire sans mettre a jour les tests associes | Blocage merge | CI/CD + checklist |
| **AP-MAJ-08** | **Bypass securite** | Ne pas passer par la revue securite quand elle est obligatoire | Blocage merge + rapport Security_Lead | Checklist merge |

#### Anti-patterns moderes (DECONSEILLE - Consequence : avertissement + formation)

| ID | Anti-pattern | Description | Consequence | Detection |
|----|-------------|-------------|-------------|-----------|
| **AP-MOD-01** | **Branche longue** | Travailler sur une branche feature pendant plus de 2 sprints sans merge | Avertissement + obligation de merge | Monitoring branches |
| **AP-MOD-02** | **Commit message vague** | Ecrire des messages de commit non descriptifs | Avertissement + guide | Revue code |
| **AP-MOD-03** | **Duplication de code** | Dupliquer du code au lieu de refactoriser | Avertissement + refactoring | Analyse statique |
| **AP-MOD-04** | **Absence de logs** | Ne pas ajouter de logs pour les flux critiques | Avertissement + ajout | Revue code |
| **AP-MOD-05** | **Decision orale non documentee** | Prendre une decision technique importante sans l'ecrire | Avertissement + documentation | Revue retrospective |

### 7.2 Garde-fous automatises

#### Garde-fous CI/CD

```yaml
# Configuration des garde-fous CI/CD (representation textuelle)
pipeline:
  stages:
    - lint
    - test
    - security_scan
    - compliance_check
    - build
    - deploy_staging
    - e2e_tests
    - deploy_production
  
  garde-fous:
    lint:
      - no_llm_in_compliance_layer: "ERROR if import openai/anthropic in compliance/"
      - code_style: "ERROR if non conforme"
    
    test:
      - unit_tests: "BLOCK if < 80% coverage metier"
      - integration_tests: "BLOCK if echec"
      - compliance_tests: "BLOCK if < 100% pass"
    
    security_scan:
      - dependency_check: "BLOCK si vuln critique"
      - secrets_detection: "BLOCK si secret detecte"
      - sast: "WARNING si high, BLOCK si critical"
    
    compliance_check:
      - schema_validation: "BLOCK si regle invalide"
      - dual_signature: "BLOCK si regle active sans 2 signatures"
      - conflict_detection: "BLOCK si conflit regles"
    
    deploy_production:
      - require_approval: "CTO + Legal_Risk si touch Couche 6"
      - canary: "10% -> 50% -> 100%"
      - rollback_ready: "Rollback automatique si erreur > 1%"
```

#### Garde-fous architecture

```markdown
## Garde-fous Architecture - EDIFIA

### Separation des responsabilites
- La Couche 6 (Conformite) ne peut pas dependre de la Couche IA (LLM)
- La Couche IA peut lire les resultats de la Couche 6, mais jamais ecrire
- Les donnees utilisateur ne quittent jamais Scaleway sans autorisation explicite

### Controle d'acces
- Compliance_Engine : Lecture/Ecriture Couche 6 uniquement
- Legal_Risk : Lecture + signature validation Couche 6
- Data_AI : Pas d'acces direct a la Couche 6 (API read-only)
- Security_Lead : Audit logs uniquement (pas de modification)

### Monitoring automatique
- Alerte si regle modifiee sans double signature
- Alerte si import LLM detecte dans code Couche 6
- Alerte si donnee utilisateur sort de l'infra Scaleway
- Alerte si > 0.1% erreurs Couche 6
- Alerte si temps reponse API > 500ms (p95)
```

### 7.3 Mecanismes de detection automatique

| Garde-fou | Type de detection | Frequence | Action en cas de declenchement |
|-----------|------------------|-----------|-------------------------------|
| Detection import LLM dans Couche 6 | Analyse statique code (lint) | A chaque commit | REJET commit + alerte Security_Lead |
| Validation schema regle | Test automatique | A chaque PR | REJET merge |
| Verification double signature | Test d'integration | A chaque PR | REJET merge |
| Detection conflit regles | Test d'integration | A chaque PR + nuitement | REJET merge / Alerte |
| Scan vulnerabilites dependances | Outil de scan (Dependabot/Snyk) | Nuitement | PR de correction / Alerte |
| Detection secrets dans code | GitLeaks / TruffleHog | A chaque commit | REJET commit + alerte |
| Monitoring performance API | APM (Datadog/New Relic) | Temps reel | Alerte si seuil depasse |
| Monitoring disponibilite | Health checks | Temps reel | Alerte P1 si < 99.5% |
| Monitoring erreurs Couche 6 | Dashboard + alertes | Temps reel | Alerte P0 si > 0.1% |
| Audit acces donnees | Logs d'acces | Temps reel | Alerte si acces anormal |
| Detection fuite donnees | DLP (Data Loss Prevention) | Temps reel | Alerte P0 + blocage |
| Tests de non-regression | Suite de tests complete | A chaque PR + nuitement | REJET merge si echec |

### 7.4 Processus d'application des garde-fous

```
Detection d'un anti-pattern
    |
    v
Identification du niveau (Critique / Majeur / Modere)
    |
    v
+----------------+----------------+----------------+
|   CRITIQUE     |    MAJEUR      |    MODERE      |
+----------------+----------------+----------------+
|                |                |                |
| 1. Blocage     | 1. Avertisse-  | 1. Signale-    |
|    immediat    |    ment formel |    ment a l'agent|
| 2. Escalation  | 2. Correction  | 2. Formation / |
|    CTO +       |    obligatoire |    coaching    |
|    Security_   |    sous Xh     | 3. Suivi prochain|
|    Lead        | 3. Rapport au  |    Daily Sync  |
| 3. Investigation|   CTO          |                |
| 4. Rapport     | 4. Verification|                |
|    gouvernance |    de correction|               |
| 5. Decision    |                |                |
|    sanctions   |                |                |
+----------------+----------------+----------------+
```

---

## Annexes

### Annexe A : Glossaire

| Terme | Definition |
|-------|-----------|
| **Couche 6** | Moteur Reglementaire - Composant deterministe qui encode et applique les regles d'urbanisme et de construction. Jamais de LLM. |
| **DAT** | Document d'Architecture Technique - Document decrivant les choix techniques d'une fonctionnalite |
| **DoD** | Definition of Done - Criteres que doit remplir une tache pour etre consideree comme terminee |
| **Gate B** | Gate Business/Conformite - Point de validation obligatoire par Legal_Risk |
| **Gate S** | Gate Securite - Point de validation obligatoire par Security_Lead |
| **MOB** | Maison Ossature Bois - Type de construction couvert par la V1 |
| **PLU** | Plan Local d'Urbanisme - Document reglementaire de zoning |
| **P0/P1/P2/P3** | Niveaux de severite des incidents (P0 = critique, P3 = mineur) |
| **RACI** | Matrice de responsabilite : Responsible, Accountable, Consulted, Informed |
| **V1** | Version 1 du produit : extensions < 40m2 + MOB < 150m2 |
| **War Room** | Reunion d'urgence pour gestion de crise |

### Annexe B : Recapitulatif des templates

| ID | Template | Section | Usage |
|----|----------|---------|-------|
| TPL-01 | Daily Agent Sync | 1.2 | Rapport quotidien |
| TPL-02 | Engagement de sprint | 1.3 | Sortie Sprint Planning |
| TPL-03 | Retrospective | 1.5 | Fin de sprint |
| TPL-04 | User Story | 2.A | Expression besoin |
| TPL-05 | DAT | 2.A | Architecture technique |
| TPL-06 | Fiche identification reglementaire | 2.B | Veille reglementaire |
| TPL-07 | Regle atomique | 2.B | Decoupage regle |
| TPL-08 | Checklist validation formelle | 2.B | Validation regle |
| TPL-09 | Fiche evolution technique | 2.C | Proposition EVT |
| TPL-10 | Matrice d'impact | 2.C | Analyse impact |
| TPL-11 | Declaration d'incident | 2.D | Signalement incident |
| TPL-12 | Post-mortem | 2.D | Analyse post-incident |
| TPL-13 | Rapport hebdomadaire pilier | 3.3 | Suivi pilier |
| TPL-14 | Rapport mensuel synthese | 3.3 | Suivi global |
| TPL-15 | Signalement de blocage | 3.4 | Escalation blocage |
| TPL-16 | Checklist qualite code | 4.1 | Auto-evaluation code |
| TPL-17 | Checklist qualite regle | 4.1 | Validation regle |
| TPL-18 | Checklist qualite IA | 4.1 | Validation modele |
| TPL-19 | Checklist qualite documentation | 4.1 | Validation doc |
| TPL-20 | Code review | 4.2 | Revue code |
| TPL-21 | Review conformite Couche 6 | 4.3 | Validation conformite |
| TPL-22 | Review securite | 4.4 | Validation securite |
| TPL-23 | Definition of Done | 4.5 | Validation livrable |
| TPL-24 | Rapport veille reglementaire | 5.1 | Veille Legal_Risk |
| TPL-25 | Alerte risque | 5.2 | Signalement risque |
| TPL-26 | Checklist prevention risques | 5.3 | Prevention hebdo |
| TPL-27 | Decision de crise | 5.4 | War Room |
| TPL-28 | Tableau de bord synthese | 6.3 | Vue CTO |

### Annexe C : Matrice de flux decisionnel

```
DECISION                          | DECIDEUR           | CONSULTE           | INFORME
----------------------------------|--------------------|--------------------|--------------------
Architecture technique            | CTO                | Backend_Lead       | Tous
Roadmap / Priorisation            | Product_Owner      | CTO                | Tous
Encodage regle reglementaire      | Legal_Risk         | Compliance_Engine  | CTO, QA_Lead
Merge code standard               | Auteur + Reviewer  | -                  | -
Merge code Couche 6               | CTO                | Legal_Risk,        | Tous
                                  |                    | Compliance_Engine  |
Merge code securite               | Security_Lead      | CTO                | -
Incident P0                       | War Room (CTO lead)| Tous impactes      | Comite gouvernance
Evolution technique transversale  | CTO                | Agents impactes    | Tous
Changement scope V1               | CTO + Product_Owner| Legal_Risk         | Tous
Deploiement production            | DevOps_SRE         | CTO                | Tous
Rollback production               | CTO + DevOps_SRE   | Tous impactes      | Tous
Decision crise conformite         | Legal_Risk         | CTO                | Tous
Budget / Ressources               | CTO                | Product_Owner      | Tous
```

---

**Fin du document**

*Ce document est vivant. Il est revise a chaque retrospective si des ameliorations sont identifiees. Toute modification doit etre validee par le CTO et le Product_Owner.*

*Version courante : 1.0*  
*Prochaine revision prevue : Apres 3 sprints ou sur decision du Comite de Gouvernance*
