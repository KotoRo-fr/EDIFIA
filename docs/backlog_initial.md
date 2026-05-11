# EDIFIA — Backlog Priorise V1 Complet

---

## 1. Vision du Backlog V1

### Objectif V1 en 1 phrase
> Permettre a un proprietaire de deposer une demande de travaux (extension <40m2 ou MOB <150m2) entierement generee par IA — du brief multimodal au depot CERFA en mairie — sur 5-10 communes pilotes d'Ile-de-France, avec pour objectif 10 PC deposes et 5+ acceptes dans l'annee.

### Criteres de succes V1 (mesurables)

| # | Critere | Cible | Methode de mesure |
|---|---------|-------|-------------------|
| CS1 | PC deposes complets (CERFA + plan + notice) | 10 | Comptage des dossiers transmis aux mairies |
| CS2 | PC acceptes par les services d'urbanisme | >= 5 | Suivi des reponses de mairie |
| CS3 | Temps moyen de generation d'un dossier complet | < 48h | Mesure end-to-end depuis brief valide |
| CS4 | Taux de conformite PLU automatique | > 95% | Comparaison regles encodees vs validation manuelle |
| CS5 | Communes pilotes couvertes (PLU ingere + teste) | 5-10 | Communes avec au moins 1 PC accepte |
| CS6 | Taux de completion du parcours utilisateur | > 60% | Analytics funnel : brief -> dossier genere |
| CS7 | Coût de generation d'un dossier (hors relecture) | < 500EUR | Cout infra + agents par dossier |

### Hypotheses

| ID | Hypothese | Impact si fausse |
|----|-----------|------------------|
| H1 | Les extensions <40m2 et MOB <150m2 ne necessitent pas d'architecte (declaration prealable suffisante) | Blockage total — pivot vers permis de construire obligatoire |
| H2 | Les PLU des communes pilotes sont accessibles et parseables (PDF/GeoJSON) | Delai ingestion > 3 mois |
| H3 | Le marche cible (particuliers sans architecte) est pret a payer/utiiser un outil IA | Invalide le wedge, necessite pivot B2B |
| H4 | Les regles de conformite peuvent etre formalisees de maniere deterministe (pas de LLM) | Risque mortel #1 — blocage couche 6 |
| H5 | Le volume de ~250 000 extensions/an en France est reel et verifiable | Sous-estimation du marche |
| H6 | Les mairies acceptent les dossiers numeriques generes par IA (validite juridique) | Risque legal majeur |
| H7 | Les donnees IGN (LIDAR, cadastre, DVF) sont suffisamment precises pour la conformite | Imprecision structurale |

### Contraintes V1

| ID | Contrainte |
|----|------------|
| C1 | **Pas de LLM pour la conformite reglementaire** — couche 6 strictement deterministe |
| C2 | **Souverainete des donnees** — aucune donnee utilisateur ne quitte l'infra europeenne |
| C3 | **Budget V1 contenu** — MVP tech lean, pas de sur-ingenierie |
| C4 | **Delai V1 : 12 mois** — deadline fixe pour les premiers PC acceptes |
| C5 | **Scope fige** — aucune couche V2 (3, 7, 8, 9 detaille, 11, 12) ne demarre avant P0 V1 atteints |
| C6 | **RGPD** — traitement de donnees personnelles (coordonnees, photos parcelle) conforme |
| C7 | **Marche vierge IA** — pas de reference directe, validation continue du modele |

---

## 2. Themes de travail V1

Le backlog V1 est structure en **8 themes** couvrant l'ensemble du perimetre fonctionnel et technique.

| # | Theme | Description | Couches concernees | Nb Epics (approx.) |
|---|-------|-------------|-------------------|-------------------|
| T1 | **Onboarding & Experience Utilisateur** | Parcours d'inscription, onboarding proprietaire, dashboard, paiement, support | 1, 10 | 5 |
| T2 | **Brief Multimodal** | Capture du besoin client via texte, voix, photos, sketchs, LIDAR | 1 | 6 |
| T3 | **Site Intelligence** | Analyse automatique du terrain : PLU, cadastre, DVF, risques, servitudes | 2 | 7 |
| T4 | **Programmation Architecturale** | Transformation du brief + contraintes terrain en programme spatial fonctionnel | 4 | 5 |
| T5 | **Conception Generative** | Solveur parametrique, generation de variantes, modele BIM/IFC simplifie | 5 | 7 |
| T6 | **Conformite Deterministe** | Moteur de ~6000 regles formalisees, validation automatique PLU + règlement national | 6 | 8 |
| T7 | **Production des Livrables** | Generation CERFA, plans 2D/3D, notices techniques, dossier complet mairie | 10 | 6 |
| T8 | **Fondations Techniques** | Infra, CI/CD, securite, monitoring, ingestion donnees, tests, documentation | Transverse | 8 |

**Repartition des 52 epics par priorite :**
- **P0 (Chemin critique)** : 18 epics — indispensables pour le 1er PC depose
- **P1 (Important)** : 22 epics — necessaires pour les 10 PC et la qualite
- **P2 (Nice-to-have)** : 12 epics — amelioration du taux de conversion et de l'UX

---

## 3. Epics par Theme

---

### T1 — ONBOARDING & EXPERIENCE UTILISATEUR

**Objectif theme :** Convertir un proprietaire curieux en utilisateur actif qui complete son brief et genere son dossier.

---

#### T1-E1 : Page d'accueil & Landing Produit
- **Description :** Landing page explicative du service EDIFIA, valeur proposee ("Votre extension en 48h, sans architecte"), temoignages, FAQ, tarification transparente. Optimisee SEO local (communes pilotes).
- **Objectif business :** Generer du trafic qualifie et convertir en inscription (Cible : taux de conversion > 5% visiteur -> signup)
- **Couches EDIFIA :** 1, 10
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Content_Designer
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** Aucune

---

#### T1-E2 : Inscription & Authentification Proprietaire
- **Description :** Systeme complet d'inscription (email, Google OAuth), authentification securisee (JWT), profil utilisateur (nom, adresse, telephone), gestion des mots de passe, verification d'email. Conforme RGPD (consentement explicite).
- **Objectif business :** Creer la base utilisateurs, securiser l'acces, collecter les donnees minimales necessaires au dossier administratif.
- **Couches EDIFIA :** 1
- **Agents responsables :** EDIFIA_Backend_Lead, EDIFIA_Frontend_Dev, EDIFIA_Security_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** Aucune

---

#### T1-E3 : Dashboard Proprietaire & Suivi des Projets
- **Description :** Interface centrale de l'utilisateur post-inscription : liste des projets en cours, statut du dossier (brief -> analyse terrain -> conception -> conformite -> livrables -> depose), notifications, acces aux documents generes, historique.
- **Objectif business :** Maintenir l'engagement utilisateur, reduire l'abandon (Cible : taux d'completion parcours > 60%)
- **Couches EDIFIA :** 1, 10
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T1-E2 (authentification), T1-E7 (systeme de paiement) pour la monetisation

---

#### T1-E4 : Parcours Onboarding Guide (Wizard)
- **Description :** Parcours pas-a-pas pour guider le proprietaire dans sa premiere utilisation : "Quel est votre projet ?" (extension / MOB), explication du processus, estimation du delai, collecte initiale de l'adresse de la parcelle. Design mobile-first.
- **Objectif business :** Reduire le taux d'abandon des nouveaux utilisateurs, qualifier le projet des le 1er contact.
- **Couches EDIFIA :** 1
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Content_Designer
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T1-E2 (auth)

---

#### T1-E5 : Systeme de Paiement & Monetisation
- **Description :** Integration d'un systeme de paiement (Stripe ou equivalent europeen) avec plusieurs paliers : (1) Analyse terrain gratuite, (2) Generation du concept payante, (3) Dossier complet CERFA + plans payant. Facturation, reçus, gestion des remboursements.
- **Objectif business :** Generer du revenu des le V1, valider le modele economique (Cible : 10 dossiers payants)
- **Couches EDIFIA :** 10
- **Agents responsables :** EDIFIA_Backend_Lead, EDIFIA_Frontend_Dev, EDIFIA_Legal_Risk
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T1-E2 (auth), T1-E3 (dashboard)

---

### T2 — BRIEF MULTIMODAL (Couche 1)

**Objectif theme :** Capturer le besoin du proprietaire de maniere riche, multimodale et structuree pour alimenter la programmation architecturale.

---

#### T2-E1 : Interface de Saisie Textuelle Structuree (Brief Builder)
- **Description :** Formulaire intelligent progressif pour decrire le projet : type (extension / MOB), usage (chambre, bureau, cuisine...), surface souhaitee, budget indicatif, contraintes specifiques (accessibilite, exposition, vue...). Suggestions auto en fonction des reponses precedentes.
- **Objectif business :** Collecter un brief suffisamment riche pour la programmation architecturale sans friction utilisateur.
- **Couches EDIFIA :** 1
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Data_AI
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T1-E4 (onboarding wizard)

---

#### T2-E2 : Upload & Analyse de Photos du Site
- **Description :** Upload multi-photos de l'existant (facade, jardin, interieur adjacant), analyse automatique par vision IA : detection des ouvertures existantes, materiaux de facade, topographie approximative, vegetation, ensoleillement. Generation d'un rapport visuel.
- **Objectif business :** Enrichir le brief avec des donnees visuelles sans deplacement, alimenter la conception generative.
- **Couches EDIFIA :** 1
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Backend_Lead, EDIFIA_UX_Lead
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T1-E2 (auth), T2-E1 (brief texte)

---

#### T2-E3 : Capture Vocale & Transcription (Brief Vocal)
- **Description :** Enregistrement vocal du proprietaire decrivant son projet, transcription automatique ( Whisper ou equivalent local ), extraction automatique des entites (surface, pieces, materiaux, contraintes) vers le brief structure.
- **Objectif business :** Baisser la barriere a l'entree pour les utilisateurs peu a l'aise avec l'ecrit, capturer la "vision" du proprietaire.
- **Couches EDIFIA :** 1
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** L
- **Priorite :** P1
- **Dependances :** T2-E1 (brief texte)

---

#### T2-E4 : Sketchpad Interactif (Dessin du Projet)
- **Description :** Canvas interactif ou le proprietaire peut dessiner a main levee son idee de projet : position sur la parcelle, forme approximative, ouvertures souhaitees. Conversion automatique en esquisse normalisee (SVG) alimentant la conception generative.
- **Objectif business :** Permettre au proprietaire d'exprimer sa vision spatiale sans competence technique.
- **Couches EDIFIA :** 1
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Geometric_Solver
- **Estimation :** XL
- **Priorite :** P2
- **Dependances :** T5-E1 (solveur parametrique) pour interpretation du sketch

---

#### T2-E5 : Upload de Scan LIDAR / Photogrammetrie (Avance)
- **Description :** Support pour l'upload de donnees LIDAR existantes ou photogrammetrie (drone) de la parcelle. Integration avec les donnees IGN pour fusion nuage de points. Reserve aux projets complexes ou donnees deja disponibles.
- **Objectif business :** Haute precision pour les projets complexes, differenciation vs concurrents futurs.
- **Couches EDIFIA :** 1, 2
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Backend_Lead
- **Estimation :** XL
- **Priorite :** P2
- **Dependances :** T3-E2 (donnees IGN integrees)

---

#### T2-E6 : Validation & Structuration du Brief (Brief Final)
- **Description :** Etape finale de synthese du brief : affichage du brief complet structure (texte + analyse photos + extrait vocal + esquisse), possibilite de modification, validation explicite par le proprietaire. Generation d'un document brief formalise (PDF) telechargeable. Ce brief valide declenche la programmation architecturale.
- **Objectif business :** Verrouiller le perimetre du projet, eviter les modifications en cours de route, contractualiser le brief.
- **Couches EDIFIA :** 1, 4
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Backend_Lead, EDIFIA_Frontend_Dev
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T2-E1 (brief texte), T2-E2 (photos)

---

### T3 — SITE INTELLIGENCE (Couche 2)

**Objectif theme :** Collecter, parser et structurer automatiquement toutes les donnees publiques relatives a la parcelle pour alimenter la conformite et la conception.

---

#### T3-E1 : Geocodage & Identification Parcelle Cadastrale
- **Description :** A partir de l'adresse saisie par le proprietaire, geocodage precis (BAN - Base Adresse Nationale), identification de la parcelle cadastrale (section, numero, feuille), appel API cadastre.gouv.fr, recuperation des limites de parcelle (GeoJSON).
- **Objectif business :** Base de toute l'analyse terrain : sans parcelle identifiee, aucune donnee PLU ni conformite possible.
- **Couches EDIFIA :** 2
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Backend_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T1-E4 (onboarding - collecte adresse)

---

#### T3-E2 : Ingestion Donnees IGN (LIDAR, Cadastre, Orthophotos)
- **Description :** Pipeline d'ingestion automatique des donnees IGN via les API officielles : donnees LIDAR HD (altimetrie, hauteur de vegetation), orthophotos haute resolution, couche BDTOPO (batiments, cours d'eau, routes). Stockage et indexation geospatiale.
- **Objectif business :** Disposer d'un modele 3D precis du terrain et des environs pour la conception et la conformite (hauteur, COS, emprise).
- **Couches EDIFIA :** 2
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_DevOps_SRE, EDIFIA_Backend_Lead
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T3-E1 (parcelle identifiee), T8-E7 (infra stockage geospatial)

---

#### T3-E3 : Ingestion & Parsing PLU des Communes Pilotes
- **Description :** Collecte des PLU (Plans Locaux d'Urbanisme) des 10 communes pilotes au format PDF et/ou GIS. Pipeline de parsing : extraction des reglement graphique (zonage, COS, hauteurs maximales, recul, implantation) et reglement ecrit (regles de constructibilite, interdictions). Structuration en base de donnees reglementaires. **Note :** C'est l'epic la plus critique du projet — le PLU est le cœur de la conformite.
- **Objectif business :** Disposer des regles d'urbanisme exploitables par le moteur de conformite (couche 6). Sans PLU, pas de conformite, pas de dossier.
- **Couches EDIFIA :** 2, 6
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** XL
- **Priorite :** P0
- **Dependances :** T3-E1 (parcelle identifiee), T6-E1 (schema de formalisation des regles)

---

#### T3-E4 : Analyse DVF (Demande de Valeurs Foncières) — Prix du m2
- **Description :** Integration des donnees DVF pour la commune/secteur : prix moyen du m2 de construction, tendance, comparables. Affichage au proprietaire d'une fourchette de valeur pour son projet. Ne remplace pas un devis mais donne un ordre d'idee.
- **Objectif business :** Aider le proprietaire a calibrer son budget, augmenter la confiance dans le projet.
- **Couches EDIFIA :** 2, 9 (estimation basique V1)
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Backend_Lead
- **Estimation :** S
- **Priorite :** P1
- **Dependances :** T3-E1 (parcelle identifiee)

---

#### T3-E5 : Analyse des Risques (GASPAR, PPRN, Sismicite)
- **Description :** Interrogation automatique des bases de risques : GASPAR (risques naturels et technologiques), PPRN (Plans de Prevention des Risques Naturels), zonage sismique, inondation (TRI). Generation d'un rapport de risques integre au dossier.
- **Objectif business :** Obligation legale d'information dans le dossier de travaux, impact sur les regles de construction.
- **Couches EDIFIA :** 2, 6, 10
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T3-E1 (parcelle identifiee)

---

#### T3-E6 : Detection des Servitudes & Empietements
- **Description :** Analyse des servitudes notariales (conservation des actes), detection des easements ( passage de canalisation, vue, mitoyennete), detection d'empietement potentiel sur parcelle voisine. Alerte dans le rapport terrain.
- **Objectif business :** Eviter les conflits de voisinage, securiser juridiquement le dossier.
- **Couches EDIFIA :** 2
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Legal_Risk
- **Estimation :** L
- **Priorite :** P1
- **Dependances :** T3-E1 (parcelle), T3-E2 (donnees IGN)

---

#### T3-E7 : Generation du Rapport Site Intelligence
- **Description :** Synthese automatique de toutes les donnees terrain collectees dans un rapport PDF structure et visual : carte de localisation, zonage PLU, contraintes principales, risques, servitudes, prix du m2, recommandations preliminaires. Ce rapport est presente au proprietaire avant la phase de conception.
- **Objectif business :** Point de validation majeur dans le parcours : le proprietaire voit la "realite" de son terrain avant de payer pour la conception.
- **Couches EDIFIA :** 2, 10
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Backend_Lead, EDIFIA_UX_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T3-E1, T3-E2, T3-E3 (donnees collectees)

---

### T4 — PROGRAMMATION ARCHITECTURALE (Couche 4)

**Objectif theme :** Transformer le brief utilisateur + les contraintes terrain en programme architectural detaille (surfaces, enchainement des pieces, contraintes structurelles).

---

#### T4-E1 : Moteur de Programmation Spatiale (Room Solver)
- **Description :** Algorithme de programmation spatiale : a partir du brief (pieces souhaitees, surfaces, relations) + contraintes terrain (emprise max, hauteur max, reculs), generation d'un programme architectural (liste des espaces, surfaces CAO/CHA/Circulation, ratio surface utile). Base sur des heuristiques architecturales (ex: cuisine proche salon, chambre orientee est...).
- **Objectif business :** Traduire le "je veux une chambre et un bureau" en donnees chiffrees exploitables par le solveur de conception.
- **Couches EDIFIA :** 4
- **Agents responsables :** EDIFIA_Geometric_Solver, EDIFIA_Data_AI, EDIFIA_Backend_Lead
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T2-E6 (brief valide), T3-E7 (rapport terrain)

---

#### T4-E2 : Moteur d'Emprise au Sol (Footprint Generator)
- **Description :** Calcul de l'emprise au sol maximale autorisee a partir du PLU (COS/CES, reculs, limites de propriete) + hauteur maximale. Generation de l'enveloppe constructible 3D (volume maximal autorise sur la parcelle). Visualisation pour l'utilisateur.
- **Objectif business :** Definir le "cadre" dans lequel le solveur de conception peut operer. Garantie que les variantes generees respectent l'enveloppe.
- **Couches EDIFIA :** 4, 6
- **Agents responsables :** EDIFIA_Geometric_Solver, EDIFIA_Compliance_Engine
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T3-E3 (PLU parse), T6-E3 (regles d'emprise encodees)

---

#### T4-E3 : Interface de Validation du Programme
- **Description :** Ecran de presentation du programme genere au proprietaire : plan schématique des pieces, surfaces, orientation. Le proprietaire peut modifier : ajouter/supprimer des pieces, ajuster les surfaces, deplacer des cloisons. Chaque modification met a jour le programme en temps reel avec impact sur la conformite.
- **Objectif business :** Impliquer le proprietaire dans la conception sans le perdre en details techniques, verrouiller le programme avant conception generative.
- **Couches EDIFIA :** 4
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Geometric_Solver
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T4-E1 (programme genere)

---

#### T4-E4 : Analyse d'Ensoleillement & Orientation (Basique)
- **Description :** Calcul simplifie de l'ensoleillement des pieces principales en fonction de l'orientation et des masques (batiments voisins via BDTOPO). Recommandation d'orientation pour les pieces du programme. Integre dans la validation du programme.
- **Objectif business :** Qualite architecturale du programme, confort futur du proprietaire.
- **Couches EDIFIA :** 4
- **Agents responsables :** EDIFIA_Geometric_Solver, EDIFIA_Data_AI
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T3-E2 (donnees IGN BDTOPO), T4-E3 (interface programme)

---

#### T4-E5 : Estimation Budgetaire Automatique (Basique V1)
- **Description :** A partir du programme valide (surfaces, type de construction, materiaux choisis), estimation grossiere du cout de construction (fourchette basse/haute) basee sur des prix moyens departementaux (BTP). Avertissement "Estimation indicative, non contractuelle". Pas de devis detaille (V2).
- **Objectif business :** Calibrage budgetaire du proprietaire avant de payer la phase conception complete.
- **Couches EDIFIA :** 4, 9 (basique)
- **Agents responsables :** EDIFIA_Backend_Lead, EDIFIA_Data_AI
- **Estimation :** S
- **Priorite :** P1
- **Dependances :** T4-E3 (programme valide)

---

### T5 — CONCEPTION GENERATIVE (Couche 5)

**Objectif theme :** Generer automatiquement des variantes architecturales valides (plan 2D, elevation 3D) a partir du programme et de l'enveloppe constructible.

---

#### T5-E1 : Solveur Parametrique Geometrique V1
- **Description :** Solveur geometrique 2D/3D generant des plans d'extension/MOB a partir du programme valide et de l'enveloppe constructible. Algorithme de placement des pieces (bin packing contraint), generation des circulations, des ouvertures (fenetres, portes), des elevations. 2-4 variantes par projet. Modele simplifie BIM (pas de IFC complet V1).
- **Objectif business :** Cœur de la valeur d'EDIFIA — la generation architecturale automatisee. Qualite "permis de construire" des plans.
- **Couches EDIFIA :** 5
- **Agents responsables :** EDIFIA_Geometric_Solver, EDIFIA_BIM_Specialist, EDIFIA_Backend_Lead
- **Estimation :** XL
- **Priorite :** P0
- **Dependances :** T4-E2 (emprise au sol), T4-E3 (programme valide), T6-E2 (moteur conformite operationnel)

---

#### T5-E2 : Generateur de Variantes Architecturales (2-4 options)
- **Description :** A partir du solveur, generation de 2 a 4 variantes architecturales differentes : (A) Maximisation surface, (B) Optimisation ensoleillement, (C) Minimisation cout, (D) Esthetique privilegiee. Chaque variante est validee par le moteur de conformite avant presentation.
- **Objectif business :** Donner le choix au proprietaire, augmenter la satisfaction et le taux de conversion.
- **Couches EDIFIA :** 5
- **Agents responsables :** EDIFIA_Geometric_Solver, EDIFIA_BIM_Specialist
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T5-E1 (solveur operationnel)

---

#### T5-E3 : Visualisateur 3D Interactif (Viewer WebGL)
- **Description :** Visualisateur 3D dans le navigateur permettant au proprietaire d'explorer chaque variante : rotation, zoom, walkthrough simplifie, changement de materiaux (facade, toiture). Rendu realiste mais pas photorealiste V1. Base sur Three.js ou Babylon.js.
- **Objectif business :** Experience "wow" pour le proprietaire — il voit son projet en 3D avant de payer. Critique pour la conversion.
- **Couches EDIFIA :** 5
- **Agents responsables :** EDIFIA_Frontend_Dev, EDIFIA_UX_Lead, EDIFIA_BIM_Specialist
- **Estimation :** XL
- **Priorite :** P0
- **Dependances :** T5-E2 (variantes generees)

---

#### T5-E4 : Moteur de Structure Simplifie V1 (Portique/Poutre)
- **Description :** Calcul structural simplifie pour les extensions <40m2 et MOB <150m2 : dimensionnement des poteaux, poutres, fondations superficielles (semelles). Verification de la stabilite (efforts normaux, tranchants). Pas de calcul complet V2 (beton arme, ferraillage) mais suffisant pour le dossier DP.
- **Objectif business :** Securite structurelle minimum, mention dans la notice technique du dossier.
- **Couches EDIFIA :** 5, 7 (basique)
- **Agents responsables :** EDIFIA_Geometric_Solver, EDIFIA_BIM_Specialist, EDIFIA_Compliance_Engine
- **Estimation :** L
- **Priorite :** P1
- **Dependances :** T5-E1 (solveur), T6-E2 (conformite structure)

---

#### T5-E5 : Generation des Plans 2D (Coupe, Elevation, Plan Masse)
- **Description :** Generation automatique des plans 2D standard : plan de masse (parcelle + projet), plan de niveau (RDC, etage si applicable), elevations (4 faces), coupe transversale. Respect des conventions architecturales (echelles, cotations, hachures). Export PDF.
- **Objectif business :** Documents obligatoires pour le depot CERFA, qualite professionnelle.
- **Couches EDIFIA :** 5, 10
- **Agents responsables :** EDIFIA_BIM_Specialist, EDIFIA_Geometric_Solver
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T5-E2 (variantes), T5-E4 (structure pour coupe)

---

#### T5-E6 : Export BIM Simplifie (Format Intermediaire)
- **Description :** Export d'un modele BIM simplifie (pas d'IFC complet V1 mais format intermediaire JSON/STEP) contenant la geometrie, les materiaux, les surfaces. Preparation du terrain pour l'IFC V2.
- **Objectif business :** Base de donnees pour la generation des livrables, interoperabilite future.
- **Couches EDIFIA :** 5
- **Agents responsables :** EDIFIA_BIM_Specialist, EDIFIA_Backend_Lead
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T5-E1 (solveur)

---

#### T5-E7 : Interface de Selection & Personnalisation de la Variante
- **Description :** Ecran de comparaison des variantes (tableau comparatif + visuel 3D), selection par le proprietaire, personnalisation limitee : choix des materiaux de facade, type de couverture, couleurs. Verrouillage du choix declenchant la phase conformite + livrables.
- **Objectif business :** Point de decision utilisateur critique — conversion vers la phase payante.
- **Couches EDIFIA :** 5
- **Agents responsables :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T5-E3 (viewer 3D)

---

### T6 — CONFORMITE DETERMINISTE (Couche 6)

**Objectif theme :** Encoder et executer de maniere deterministe les regles d'urbanisme et de construction pour valider automatiquement chaque projet contre le PLU et le reglement national.

---

#### T6-E1 : Schema de Formalisation des Regles (DSL Reglementaire)
- **Description :** Conception d'un Domain Specific Language (DSL) pour exprimer les regles d'urbanisme de maniere formelle et executable : "hauteur_max(zonage) <= 8m", "recul_fond(zonage) >= 5m", "COS_max(zonage) <= 0.5". Chaque regle est un predicat deterministe evaluable sur un projet. Ce DSL est le fondement de tout le moteur de conformite.
- **Objectif business :** Permettre l'encodage systematique de milliers de regles sans ambiguite, garantir la deterministe (pas de LLM).
- **Couches EDIFIA :** 6
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk, EDIFIA_CTO
- **Estimation :** XL
- **Priorite :** P0
- **Dependances :** Aucune (fondation) — mais bloque T6-E2, T6-E3, T3-E3

---

#### T6-E2 : Moteur d'Execution des Regles (Rule Engine)
- **Description :** Moteur d'inference deterministe executant les regles encodees contre un projet donne : evaluation de chaque predicat sur la geometrie + le zonage + les parametres PLU. Resultat binaire (PASS/FAIL) par regule avec justification. Temps d'execution < 2s par projet.
- **Objectif business :** Valider automatiquement la conformite de chaque variante generee — sans ce moteur, pas de validation, pas de dossier.
- **Couches EDIFIA :** 6
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Backend_Lead
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T6-E1 (DSL definit)

---

#### T6-E3 : Encodage des Regles PLU — 10 Communes Pilotes
- **Description :** Encodage manuel (avec assistance IA pour le parsing) des regles PLU des 10 communes pilotes dans le DSL. Chaque commune a en moyenne 50-200 regles specifiques (zonage, hauteurs, reculs, aspect). Cible : Tremblay-en-France + 9 communes de la couronne 93 (Seine-Saint-Denis).
- **Objectif business :** Couverture reglementaire des communes pilotes. Objectif : > 95% des regles PLU encodees.
- **Couches EDIFIA :** 6, 2
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk, EDIFIA_Data_AI
- **Estimation :** XL
- **Priorite :** P0
- **Dependances :** T6-E1 (DSL), T3-E3 (PLU ingere)

---

#### T6-E4 : Encodage Reglement National (RNU + DU/DP)
- **Description :** Encodage des regles du Reglement National d'Urbanisme (RNU) applicables aux extensions <40m2 et MOB <150m2 : regles de la DP (declaration prealable) — surfaces, hauteurs, distances de mitoyennete, aspect des constructions. Plus les regles specifiques des zones (U, AU, A, N).
- **Objectif business :** Conformite au niveau national, independante du PLU local. Critique pour la validite du dossier.
- **Couches EDIFIA :** 6
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T6-E1 (DSL), T6-E2 (moteur)

---

#### T6-E5 : Regles d'Accessibilite & Securite (PMR + Incendie basique)
- **Description :** Encodage des regles d'accessibilite PMR (personnes a mobilite reduite) pour les extensions : largeur de passage, seuils, sanitaires. Regles basiques de securite incendie pour les petites surfaces (issue, materiaux REI). V1 simplifiee pour les petites surfaces.
- **Objectif business :** Conformite reglementaire obligatoire, securite des occupants.
- **Couches EDIFIA :** 6
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T6-E1 (DSL), T6-E2 (moteur)

---

#### T6-E6 : Reglementation Thermique & Environnementale (RE2020 basique)
- **Description :** Encodage des exigences RE2020 applicables aux extensions <40m2 et MOB <150m2 : performance thermique envelope (Ubat), apport solaire (Bbio), confort d'ete. Simplification V1 : seuils et verification des materiaux proposes, pas de calcul dynamique complet.
- **Objectif business :** Conformite RE2020 obligatoire pour tout permis post-2022.
- **Couches EDIFIA :** 6
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** L
- **Priorite :** P1
- **Dependances :** T6-E1 (DSL), T6-E2 (moteur)

---

#### T6-E7 : Rapport de Conformite & Non-Conformites
- **Description :** Generation automatique d'un rapport de conformite detaille pour chaque projet : liste des regules testees, statut PASS/FAIL par regule, justification, recommandations de correction en cas d'echec. Ce rapport alimente la decision de conformite finale.
- **Objectif business :** Transparence sur la conformite, base de la correction si non-conformite.
- **Couches EDIFIA :** 6, 10
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Backend_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T6-E2 (moteur), T6-E3 (PLU encode), T6-E4 (RN encode)

---

#### T6-E8 : Mecanisme de "Fail-Safe" & Revision Manuelle
- **Description :** En cas de non-conformite detectee ou de regle non encodee pour la commune, mecanisme de fallback : alerte a l'equipe EDIFIA, revision manuelle par un expert (membre de l'equipe ou partenaire), correction du projet ou ajout de la regle manquante. Audit trail complet.
- **Objectif business :** Garantir qu'aucun dossier non conforme ne parte, gerer les cas limites.
- **Couches EDIFIA :** 6
- **Agents responsables :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk, EDIFIA_CTO
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T6-E7 (rapport conformite)

---

### T7 — PRODUCTION DES LIVRABLES (Couche 10)

**Objectif theme :** Generer l'ensemble des documents necessaires au depot de la declaration prealable : CERFA rempli, plans, notice technique, attestation.

---

#### T7-E1 : Generateur de CERFA 13406*07 (DP) Pre-rempli
- **Description :** Remplissage automatique du formulaire CERFA 13406*07 (Declaration Prealable de Travaux) a partir des donnees du projet : identite du proprietaire ( profil ), adresse, description des travaux, surfaces, materiaux, architecte (non requis pour DP <40m2). Generation du PDF CERFA final pre-rempli, pret pour signature.
- **Objectif business :** Document administratif central du dossier — sans CERFA valide, pas de depot. **Epic la plus critique pour l'objectif 10 PC.**
- **Couches EDIFIA :** 10
- **Agents responsables :** EDIFIA_BIM_Specialist, EDIFIA_Backend_Lead, EDIFIA_Legal_Risk
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** T1-E2 (profil), T2-E6 (brief), T3-E1 (parcelle), T5-E5 (plans 2D)

---

#### T7-E2 : Generateur de Notice Technique & Descriptive
- **Description :** Generation automatique de la notice descriptive et technique du projet : description des travaux, materiaux, structure, equipements, impact environnemental, conformite RE2020, accessibilite. Basee sur le brief + la variante selectionnee + le rapport de conformite.
- **Objectif business :** Document obligatoire annexe au CERFA pour certaines communes.
- **Couches EDIFIA :** 10
- **Agents responsables :** EDIFIA_BIM_Specialist, EDIFIA_Content_Designer, EDIFIA_Compliance_Engine
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T2-E6 (brief), T5-E7 (variante selectionnee), T6-E7 (rapport conformite)

---

#### T7-E3 : Generation du Dossier Complet (Assemblage PDF)
- **Description :** Assemblage automatique du dossier complet de declaration prealable : CERFA rempli + plans 2D + notice technique + plan de situation + rapport site intelligence + rapport conformite + attestation de non-oppostion (si applicable). PDF unique telechargeable, numerote, avec table des matieres.
- **Objectif business :** Livrable final du proprietaire — dossier pret a etre depose en mairie ou envoye par email.
- **Couches EDIFIA :** 10
- **Agents responsables :** EDIFIA_BIM_Specialist, EDIFIA_Backend_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T7-E1 (CERFA), T7-E2 (notice), T5-E5 (plans), T3-E7 (rapport terrain), T6-E7 (rapport conformite)

---

#### T7-E4 : Generation de Plans 4K & Rendus Haute Qualite
- **Description :** Generation de rendus 3D haute qualite (4K) de la variante selectionnee : vues exterieures (perspectives), vues interieures, plan de situation esthetique. Utilisation pour la presentation au proprietaire et potentiellement pour le dossier mairie (non obligatoire mais valorisant).
- **Objectif business :** Experience premium, document de communication pour le proprietaire.
- **Couches EDIFIA :** 10, 5
- **Agents responsables :** EDIFIA_BIM_Specialist, EDIFIA_Frontend_Dev
- **Estimation :** L
- **Priorite :** P1
- **Dependances :** T5-E7 (variante selectionnee)

---

#### T7-E5 : Guide de Depot & Tele-procedures Mairie
- **Description :** Generation d'un guide personnalise de depot : adresse de la mairie de la commune, procedure (physique vs teleprocedure selon la mairie), delai legal d'instruction (1 mois pour DP), modele de lettre d'accompagnement, liste de verification du dossier.
- **Objectif business :** Accompagner le proprietaire jusqu'au bout du processus, reduire les erreurs de depot.
- **Couches EDIFIA :** 10
- **Agents responsables :** EDIFIA_Content_Designer, EDIFIA_Backend_Lead, EDIFIA_Legal_Risk
- **Estimation :** S
- **Priorite :** P1
- **Dependances :** T3-E1 (commune identifiee), T7-E3 (dossier genere)

---

#### T7-E6 : Signature Electronique & Depot Numerique
- **Description :** Integration d'une solution de signature electronique qualifiee (ou avancee) pour signer le CERFA et les documents. Si la mairie pilote accepte le depot numerique, transmission directe. Sinon, generation d'un QR code pour suivi.
- **Objectif business :** Fluidifier le dernier kilometre, faciliter le depot.
- **Couches EDIFIA :** 10
- **Agents responsables :** EDIFIA_Backend_Lead, EDIFIA_Legal_Risk, EDIFIA_Security_Lead
- **Estimation :** L
- **Priorite :** P2
- **Dependances :** T7-E3 (dossier complet)

---

### T8 — FONDATIONS TECHNIQUES (Transverse)

**Objectif theme :** Deployer et maintenir l'infrastructure, la securite, le monitoring, les tests et la documentation necessaires au bon fonctionnement de la plateforme EDIFIA.

---

#### T8-E1 : Infrastructure Cloud & Environnements (Dev/Staging/Prod)
- **Description :** Mise en place de l'infrastructure cloud (AWS eu-west-3 ou Scaleway/Outscale pour souverainete) : 3 environnements (dev, staging, production), conteneurisation (Docker), orchestration (Kubernetes ou ECS), base de donnees PostgreSQL + PostGIS, stockage objet S3, CDN. IAC (Terraform).
- **Objectif business :** Base technique fiable, scalable, securisee. Souverainete des donnees garantie (hebergement UE).
- **Couches EDIFIA :** Transverse
- **Agents responsables :** EDIFIA_DevOps_SRE, EDIFIA_CTO, EDIFIA_Security_Lead
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** Aucune (premiere epic technique)

---

#### T8-E2 : CI/CD & Automatisation des Deploiements
- **Description :** Pipeline CI/CD complete : build automatique a chaque commit, tests unitaires + integration, scan de securite (SAST/DAST), deploiement automatique en staging, deploiement manuel en production (avec validation). GitOps pour la gestion des configurations.
- **Objectif business :** Velocity d'equipe — livraison rapide et sans regression. Qualite du code.
- **Couches EDIFIA :** Transverse
- **Agents responsables :** EDIFIA_DevOps_SRE, EDIFIA_QA_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T8-E1 (infra)

---

#### T8-E3 : Authentification & Autorisation (RBAC)
- **Description :** Systeme complet d'authentification et d'autorisation : JWT securise, refresh tokens, RBAC (proprietaire, admin, expert conformite), gestion des sessions, protection contre les attaques courantes (brute force, injection). OAuth2 pour Google.
- **Objectif business :** Securite des comptes utilisateurs et des donnees.
- **Couches EDIFIA :** Transverse
- **Agents responsables :** EDIFIA_Security_Lead, EDIFIA_Backend_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T8-E1 (infra)

---

#### T8-E4 : Conformite RGPD & Traçabilite
- **Description :** Mise en conformite RGPD : registre des traitements, consentement explicite, droit a l'oubli, portabilite des donnees, politique de confidentialite, DPO (delegue a la protection des donnees). Chiffrement des donnees au repos et en transit. Journal d'audit des acces.
- **Objectif business :** Conformite legale obligatoire, confiance des utilisateurs, eviter les sanctions.
- **Couches EDIFIA :** Transverse
- **Agents responsables :** EDIFIA_Security_Lead, EDIFIA_Legal_Risk, EDIFIA_Backend_Lead
- **Estimation :** M
- **Priorite :** P0
- **Dependances :** T8-E1 (infra), T8-E3 (auth)

---

#### T8-E5 : Monitoring, Alerting & Observabilite
- **Description :** Stack de monitoring complete : metriques applicatives (Prometheus), logs centralises (Loki/ELK), tracing distribue (Jaeger), dashboards (Grafana), alerting (PagerDuty/Opsgenie). Monitoring des performances du moteur de conformite, des temps de generation, des erreurs.
- **Objectif business :** Detection proactive des incidents, capacite a debugger rapidement, optimisation des performances.
- **Couches EDIFIA :** Transverse
- **Agents responsables :** EDIFIA_DevOps_SRE, EDIFIA_QA_Lead
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T8-E1 (infra)

---

#### T8-E6 : Tests Automatises (Unitaires, Integration, E2E)
- **Description :** Pyramide de tests complete : tests unitaires (>= 80% coverage), tests d'integration (API, BDD), tests E2E (parcours utilisateur complet avec Playwright/Cypress), tests de conformite (jeux de test avec projets de reference dont la conformite est connue).
- **Objectif business :** Zero regression, confiance dans les livraisons, validation de la conformite.
- **Couches EDIFIA :** Transverse
- **Agents responsables :** EDIFIA_QA_Lead, EDIFIA_DevOps_SRE, EDIFIA_Compliance_Engine
- **Estimation :** L
- **Priorite :** P1
- **Dependances :** T8-E2 (CI/CD)

---

#### T8-E7 : Ingestion Donnees Foncieres — 10 Communes Pilotes
- **Description :** Pipeline d'ingestion et de mise a jour reguliere des donnees foncieres pour les 10 communes pilotes : PLU (mise a jour annuelle), cadastre (mise a jour trimestrielle), DVF (mise a jour semestrielle), risques (alertes). Automation complete avec detection de changement.
- **Objectif business :** Donnees a jour = conformite a jour. Donnees perimees = risque de non-conformite.
- **Couches EDIFIA :** 2, 6
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_DevOps_SRE, EDIFIA_Compliance_Engine
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** T3-E3 (PLU ingere), T8-E1 (infra)

---

#### T8-E8 : Documentation Technique & API
- **Description :** Documentation complete : API documentation (OpenAPI/Swagger), architecture documentation (C4 model), guides de developpement, runbooks d'operations, documentation du DSL de conformite. Publiee et maintenue a jour.
- **Objectif business :** Onboarding rapide des agents IA, maintenance a long terme, transfert de connaissances.
- **Couches EDIFIA :** Transverse
- **Agents responsables :** EDIFIA_Documentation, EDIFIA_CTO
- **Estimation :** M
- **Priorite :** P1
- **Dependances :** Aucune (demarre des le debut)

---


## 4. Stories Detaillees — Epics P0 (Chemin Critique)

> **Legende :** S = 1-2 jours | M = 3-5 jours | L = 1-2 semaines | XL = 2-4 semaines

---

### T1-E2 : Inscription & Authentification Proprietaire

#### Story T1-E2-S1 : Inscription par email
- **Format :** En tant que proprietaire, je veux creer un compte avec mon email et un mot de passe, afin d'acceder au service EDIFIA.
- **Criteres d'acceptation :**
  - Le formulaire d'inscription demande : email valide, mot de passe (min 8 caracteres, 1 majuscule, 1 chiffre), confirmation de mot de passe
  - Un email de verification est envoye avec un lien valide 24h
  - Le compte n'est pas actif sans verification d'email
  - Message d'erreur clair si l'email existe deja
  - Protection contre les inscriptions massives (rate limiting : max 3 tentatives/minute/IP)
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T8-E1 (infra), T8-E4 (RGPD - consentement)

#### Story T1-E2-S2 : Authentification (login/logout)
- **Format :** En tant que proprietaire inscrit, je veux me connecter avec mon email et mot de passe, afin d'acceder a mon espace personnel.
- **Criteres d'acceptation :**
  - Login reussi retourne un JWT valide 24h + refresh token 7j
  - Apres 3 echecs consecutifs, compte verrouille 15 minutes
  - Logout invalide le token cote serveur (blacklist Redis)
  - Session persistante via refresh token (renouvellement automatique)
  - Tous les endpoints proteges retournent 401 si token invalide/absent
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T1-E2-S1 (inscription)

#### Story T1-E2-S3 : Inscription & Login OAuth (Google)
- **Format :** En tant que proprietaire, je veux m'inscrire et me connecter via mon compte Google, afin de gagner du temps.
- **Criteres d'acceptation :**
  - Bouton "Se connecter avec Google" sur les pages inscription et login
  - Flux OAuth2 complet : redirection Google, consentement scopes (email, profile), callback, creation/mapping compte
  - Si l'email Google existe deja en base, liaison du compte OAuth
  - Photo de profil Google importee (option)
  - Desassociation du compte Google possible depuis le profil
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Backend_Lead, EDIFIA_Frontend_Dev
- **Estimation :** M
- **Dependencies :** T1-E2-S1 (inscription email)

#### Story T1-E2-S4 : Profil utilisateur & Donnees personnelles
- **Format :** En tant que proprietaire connecte, je veux completer mon profil (nom, prenom, telephone, adresse postale), afin que ces informations pre-remplissent mes futurs dossiers CERFA.
- **Criteres d'acceptation :**
  - Formulaire profil avec : civilite, nom, prenom, telephone (validation format FR), adresse (autocomplete BAN)
  - Les donnees sont stockees chiffrees en base (AES-256)
  - Les donnees profil sont reutilisables pour pre-remplir le CERFA
  - Modification possible a tout moment
  - Suppression du compte conforme RGPD (droit a l'oubli)
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Backend_Lead, EDIFIA_Frontend_Dev
- **Estimation :** S
- **Dependencies :** T1-E2-S1 (inscription)

---

### T1-E3 : Dashboard Proprietaire & Suivi des Projets

#### Story T1-E3-S1 : Liste des projets
- **Format :** En tant que proprietaire connecte, je veux voir la liste de mes projets en cours et passes, afin de suivre leur avancement.
- **Criteres d'acceptation :**
  - Affichage des projets avec : nom, type (extension/MOB), adresse, statut (badge colore), date de creation, date de derniere modification
  - Tri par date de modification (defaut) et par statut
  - Possibilite de renommer un projet
  - Possibilite de dupliquer un projet (nouveau a partir d'un existant)
  - Possibilite de supprimer un projet (avec confirmation)
  - Pagination si > 10 projets
- **Couche EDIFIA :** 1, 10
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T1-E2 (auth)

#### Story T1-E3-S2 : Vue detaillee d'un projet (Timeline)
- **Format :** En tant que proprietaire, je veux voir le detail d'un projet avec sa timeline d'avancement, afin de comprendre ou j'en suis dans le processus.
- **Criteres d'acceptation :**
  - Timeline verticale avec les etapes : Brief -> Terrain -> Programme -> Conception -> Conformite -> Livrables -> Depot
  - Chaque etape affiche : statut (a faire/en cours/termine/bloque), date de completion, actions disponibles
  - Etape courante mise en evidence visuellement
  - Acces direct a chaque etape via la timeline
  - Historique des actions (log) consultable
  - Notification visuelle si une action utilisateur est requise
- **Couche EDIFIA :** 1, 10
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_UX_Lead
- **Estimation :** M
- **Dependencies :** T1-E3-S1 (liste projets)

#### Story T1-E3-S3 : Notifications & Alertes
- **Format :** En tant que proprietaire, je veux recevoir des notifications quand une etape est completee ou qu'une action est requise de ma part, afin de ne pas oublier d'avancer mon projet.
- **Criteres d'acceptation :**
  - Notifications in-app (cloche avec badge non lu)
  - Notifications email pour les etapes importantes (brief complete, conception prete, dossier genere)
  - Preferences de notification modifiables (email on/off, frequence)
  - Marquage des notifications comme lues
  - Historique des notifications des 30 derniers jours
- **Couche EDIFIA :** 1, 10
- **Agent responsable :** EDIFIA_Backend_Lead, EDIFIA_Frontend_Dev
- **Estimation :** S
- **Dependencies :** T1-E3-S1 (liste projets)

---

### T1-E4 : Parcours Onboarding Guide (Wizard)

#### Story T1-E4-S1 : Wizard d'accueil (3 questions qualifiantes)
- **Format :** En tant que nouveau proprietaire inscrit, je veux repondre a 3 questions simples sur mon projet, afin qu'EDIFIA me guide dans la suite du processus.
- **Criteres d'acceptation :**
  - Question 1 : Type de projet — boutons visuels (Extension / Maison Ossature Bois / Autre)
  - Question 2 : Surface approximative — slider (10m2 a 150m2) avec validation (<40m2 pour extension)
  - Question 3 : Adresse de la parcelle — autocomplete BAN (Base Adresse Nationale) avec geocodage
  - Validation bloquante : si surface > 40m2 pour extension, message "Hors scope V1, contactez-nous"
  - Validation bloquante : si adresse hors communes pilotes, message "Commune bientot disponible"
  - Resultat : creation automatique du projet avec les donnees initiales
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev
- **Estimation :** M
- **Dependencies :** T1-E2 (auth)

#### Story T1-E4-S2 : Explication du processus & Estimation delai
- **Format :** En tant que proprietaire apres le wizard, je veux voir une explication claire du processus et une estimation du delai, afin de savoir a quoi m'attendre.
- **Criteres d'acceptation :**
  - Affichage du processus en 5 etapes visuelles avec icones : (1) Decrivez votre projet, (2) Analyse terrain, (3) Choisissez votre conception, (4) Validation conformite, (5) Dossier pret
  - Estimation de delai : "Votre dossier sera pret en 24-48h"
  - Transparence sur les prix : "Analyse terrain gratuite / Conception a partir de XX EUR"
  - CTA "Commencer mon projet" menant au brief
  - Option "Revenir plus tard" — sauvegarde du projet
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_UX_Lead, EDIFIA_Content_Designer, EDIFIA_Frontend_Dev
- **Estimation :** S
- **Dependencies :** T1-E4-S1 (wizard)

---

### T2-E1 : Interface de Saisie Textuelle Structuree (Brief Builder)

#### Story T2-E1-S1 : Formulaire de description du projet (pieces, surfaces, usage)
- **Format :** En tant que proprietaire, je veux decrire mon projet piece par piece avec leur usage et surface souhaitee, afin que le programme architectural soit adapte a mes besoins.
- **Criteres d'acceptation :**
  - Interface d'ajout de pieces : selection type (chambre, salon, bureau, cuisine, salle de bain, WC, dressing, autre), surface souhaitee (m2), orientation preferee (N/S/E/O), expositions souhaitees
  - Au moins 1 piece obligatoire, maximum 10 pieces (coherence V1)
  - Somme des surfaces interieures affichee en temps reel avec validation vs surface max autorisee
  - Suggestions de pieces selon le type de projet (extension = chambre/salon par defaut ; MOB = plan complet)
  - Possibilite de reordonner les pieces (priorite)
  - Sauvegarde automatique a chaque modification (draft)
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_UX_Lead
- **Estimation :** L
- **Dependencies :** T1-E4 (onboarding)

#### Story T2-E1-S2 : Questionnaire complementaire (contraintes & preferences)
- **Format :** En tant que proprietaire, je veux repondre a des questions complementaires sur mes contraintes et preferences, afin d'affiner la conception.
- **Criteres d'acceptation :**
  - Questions sur : budget fourchette (4 options), style architectural (moderne/traditionnel/contemporain/indifferent)
  - Contraintes specifiques : acces handicape (oui/non), toit terrasse souhaite (oui/non), etage souhaite pour MOB (RDC / RDC+1 / RDC+2 max pour V1)
  - Materiaux preferes : menu deroulant (brique, bois, beton, enduit, indifferent)
  - Exigences particulieres : textarea libre (max 500 caracteres)
  - Progress bar indiquant l'avancement du brief (%)
  - Toutes les questions optionnelles sauf budget
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_Data_AI
- **Estimation :** M
- **Dependencies :** T2-E1-S1 (formulaire pieces)

#### Story T2-E1-S3 : Resume & Validation du brief texte
- **Format :** En tant que proprietaire, je veux voir un resume de mon brief texte avant de passer a l'etape suivante, afin de verifier et corriger mes reponses.
- **Criteres d'acceptation :**
  - Page de resume avec toutes les reponses groupees par categorie (pieces, contraintes, preferences)
  - Mode edition inline pour chaque champ (sans retour en arriere)
  - Compteur de pieces et surface totale
  - Badge "Brief complet" quand toutes les sections obligatoires sont remplies
  - Bouton "Valider et continuer" menant a l'upload de photos
  - Sauvegarde du brief en base de donnees
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** S
- **Dependencies :** T2-E1-S1, T2-E1-S2

---

### T2-E2 : Upload & Analyse de Photos du Site

#### Story T2-E2-S1 : Upload multi-photos (facade, terrain, interieur)
- **Format :** En tant que proprietaire, je veux uploader des photos de mon site (facade, terrain, interieur adjacent), afin qu'EDIFIA analyse le contexte visuel de mon projet.
- **Criteres d'acceptation :**
  - Upload drag-and-drop et selection fichier, max 10 photos, formats (JPG, PNG, HEIC), max 10 Mo par photo
  - Categories de photos obligatoires : (1) Facade sur laquelle s'appuie l'extension, (2) Vue du terrain/cote, (3) Piece interieure adjacente
  - Categories optionnelles : vue aerienne/drone, photo environnement (voisinage), photo existant detail
  - Redimensionnement automatique cote serveur (max 2048px)
  - Barre de progression pendant l'upload
  - Verification anti-virus/malware des fichiers
  - Chiffrement des fichiers au stockage
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T2-E1 (brief texte valide)

#### Story T2-E2-S2 : Analyse IA des photos (detection elements)
- **Format :** En tant que proprietaire, je veux que les photos uploadees soient analysees automatiquement, afin d'enrichir mon brief avec des informations visuelles.
- **Criteres d'acceptation :**
  - Detection automatique sur les photos facade : portes, fenetres, materiau de facade, toiture, gouttieres
  - Detection sur photos terrain : vegetation, pente, obstacles (mur, piscine, arbre), surface disponible
  - Detection sur photos interieur : hauteur sous plafond, type de sol, mur porteur (indication)
  - Resultats affiches sous forme de tags sur chaque photo
  - Carte de chaleur (heatmap) sur la photo montrant les zones detectees
  - Donnees extraites injectees dans le brief structure (champs enrichis)
  - Temps d'analyse < 30 secondes par photo
  - Fallback : si l'analyse echoue, le brief avance sans les donnees visuelles (warning)
- **Couche EDIFIA :** 1
- **Agent responsable :** EDIFIA_Data_AI, EDIFIA_Backend_Lead
- **Estimation :** L
- **Dependencies :** T2-E2-S1 (upload photos)

---

### T2-E6 : Validation & Structuration du Brief (Brief Final)

#### Story T2-E6-S1 : Synthese multimodale du brief
- **Format :** En tant que proprietaire, je veux voir une synthese complete de mon brief incluant le texte, l'analyse des photos et mes esquisses, afin de valider l'ensemble avant de lancer l'analyse terrain.
- **Criteres d'acceptation :**
  - Page de synthese avec 3 onglets : (1) Brief texte (pieces, contraintes, preferences), (2) Photos analysees avec tags IA, (3) Resume vocal (si capturee) avec transcription
  - Score de "completude du brief" (0-100%) base sur les sections remplies
  - Recommandations pour ameliorer le brief si score < 70% (ex: "Ajoutez une photo de facade pour une meilleure analyse")
  - Comparaison surface demandee vs surface maximale autorisee (estimation)
  - Bouton "Modifier" renvoyant a l'etape correspondante
  - Bouton "Valider le brief" — action irreversible, declenche T3 (Site Intelligence)
- **Couche EDIFIA :** 1, 4
- **Agent responsable :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T2-E1 (brief texte), T2-E2 (photos), T2-E3 (vocal — si disponible)

#### Story T2-E6-S2 : Generation du PDF Brief
- **Format :** En tant que proprietaire, je veux pouvoir telecharger mon brief valide en PDF, afin d'en garder une trace.
- **Criteres d'acceptation :**
  - Generation PDF du brief : titre, date, identifiant projet, contenu texte structure, vignettes photos, resume des contraintes
  - Mise en page professionnelle (logo EDIFIA, pagination)
  - Telechargement depuis le dashboard a tout moment
  - Taille PDF < 5 Mo
- **Couche EDIFIA :** 1, 10
- **Agent responsable :** EDIFIA_Backend_Lead, EDIFIA_Content_Designer
- **Estimation :** S
- **Dependencies :** T2-E6-S1 (synthese brief)

---

### T3-E1 : Geocodage & Identification Parcelle Cadastrale

#### Story T3-E1-S1 : Geocodage adresse & identification parcelle
- **Format :** En tant que systeme, je veux convertir l'adresse saisie par le proprietaire en coordonnees geographiques precises et identifier la parcelle cadastrale correspondante, afin d'alimenter toute l'analyse terrain.
- **Criteres d'acceptation :**
  - Appel API Base Adresse Nationale (BAN) avec autocomplete et geocodage
  - Score de geocodage > 0.8 accepte, < 0.8 demande confirmation utilisateur
  - A partir des coordonnees, appel API Cadastre pour recuperer : section, numero de parcelle, contenance, GeoJSON des limites
  - Si plusieurs parcelles a l'adresse (copropriete), demande de selection utilisateur
  - Stockage des donnees parcelle (GeoJSON, reference cadastrale) en base
  - Temps de reponse < 3 secondes
  - Cache Redis des resultats par adresse (TTL 24h)
- **Couche EDIFIA :** 2
- **Agent responsable :** EDIFIA_Data_AI, EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T1-E4-S1 (adresse collectee onboarding)

#### Story T3-E1-S2 : Visualisation carte parcelle
- **Format :** En tant que proprietaire, je veux voir ma parcelle mise en evidence sur une carte interactive, afin de verifier que l'adresse est correcte.
- **Criteres d'acceptation :**
  - Carte interactive (Leaflet/MapLibre) centree sur la parcelle
  - Polygone de la parcelle en surbrillance (couleur EDIFIA)
  - Fond de carte IGN (orthophoto + plan)
  - Controles : zoom, deplacement, reset
  - Popup au clic sur la parcelle : section, numero, contenance
  - Bouton "C'est bien ma parcelle" / "Corriger l'adresse"
- **Couche EDIFIA :** 2
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_Data_AI
- **Estimation :** S
- **Dependencies :** T3-E1-S1 (geocodage)

---

### T3-E2 : Ingestion Donnees IGN (LIDAR, Cadastre, Orthophotos)

#### Story T3-E2-S1 : Pipeline ingestion LIDAR HD & BDTOPO
- **Format :** En tant que systeme, je veux recuperer et stocker les donnees LIDAR HD et BDTOPO de la parcelle et de son voisinage, afin d'avoir un modele 3D precis du terrain.
- **Criteres d'acceptation :**
  - Appel API Geoservices IGN : telechargement tuiles LIDAR HD couvrant la parcelle + buffer 100m
  - Telechargement couche BDTOPO : batiments, routes, hydrographie, vegetatio, equipements
  - Traitement : generation MNT (Modele Numerique de Terrain), MNS (Modele Numerique de Surface), extraction hauteur de vegetation
  - Stockage dans S3 + indexation PostGIS
  - Temps de traitement < 2 minutes par parcelle
  - Gestion des erreurs : retry 3x, fallback sur donnees moins precises si LIDAR indisponible
  - Donnees mises en cache (pas de re-telechargement si deja presentes)
- **Couche EDIFIA :** 2
- **Agent responsable :** EDIFIA_Data_AI, EDIFIA_DevOps_SRE
- **Estimation :** L
- **Dependencies :** T3-E1 (parcelle identifiee), T8-E7 (infra stockage geo)

#### Story T3-E2-S2 : Extraction contraintes topographiques
- **Format :** En tant que systeme, je veux extraire automatiquement les contraintes topographiques de la parcelle (pente, vegetation, batiments voisins), afin d'alimenter la conformite et la conception.
- **Criteres d'acceptation :**
  - Calcul de la pente moyenne et max de la parcelle a partir du MNT
  - Detection des zones boisees (hauteur vegetation > 2m)
  - Identification des batiments voisins : distance, hauteur, emprise (via BDTOPO)
  - Calcul des ensoleillements/masques (angles solaires par saison)
  - Donnees stockees au format JSON structure dans le profil terrain du projet
  - Validation : comparaison avec les photos uploadees pour coherence
- **Couche EDIFIA :** 2
- **Agent responsable :** EDIFIA_Data_AI, EDIFIA_Geometric_Solver
- **Estimation :** M
- **Dependencies :** T3-E2-S1 (LIDAR ingere), T2-E2 (photos pour validation croisee)

---

### T3-E3 : Ingestion & Parsing PLU des Communes Pilotes

#### Story T3-E3-S1 : Collecte PLU des 10 communes pilotes
- **Format :** En tant que systeme, je veux collecter les documents PLU (reglement ecrit + reglement graphique) des 10 communes pilotes, afin de les rendre exploitables par le moteur de conformite.
- **Criteres d'acceptation :**
  - Liste des 10 communes pilotes definie et validee : Tremblay-en-France, Villepinte, Sevran, Livry-Gargan, Le Raincy, Clichy-sous-Bois, Montfermeil, Coubron, Vaujours, plus 2 communes de reserve
  - Collecte des documents : reglement ecrit (PDF), reglement graphique (PDF + GIS si dispo), annexes
  - Sources : geoportail-urbanisme.gouv.fr, sites des mairies, contact direct
  - Stockage versionne (S3) avec date de collecte et source
  - Suivi de couverture : % de communes avec PLU complet, % avec reglement graphique vectoriel
  - Identification des PLU en cours de revision (alerte)
- **Couche EDIFIA :** 2, 6
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** L
- **Priorite :** P0
- **Dependances :** Aucune (peut demarrer immediatement)

#### Story T3-E3-S2 : Parsing reglement graphique (zonage)
- **Format :** En tant que systeme, je veux parser le reglement graphique du PLU pour extraire les zones, afin de determiner quelles regles s'appliquent a la parcelle.
- **Criteres d'acceptation :**
  - Extraction des zones : U (urbanise), AU (a urbaniser), A (agricole), N (naturel), plus sous-zones (Ua, Ub...)
  - Pour chaque zone : determination de la constructibilite (oui/non/limite)
  - Association parcelle -> zone(s) intersectee(s)
  - Si format vectoriel disponible (GeoJSON/Shapefile) : parsing direct
  - Si format PDF/raster uniquement : traitement OCR + georeferencement (qualite moindre, flaggue)
  - Taux de succes cible : 100% des parcelles associees a au moins une zone
  - Validation manuelle echantillon : 20 parcelles par commune
- **Couche EDIFIA :** 2, 6
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Compliance_Engine
- **Estimation :** XL
- **Dependencies :** T3-E3-S1 (PLU collecte)

#### Story T3-E3-S3 : Parsing reglement ecrit (regles)
- **Format :** En tant que systeme, je veux parser le reglement ecrit du PLU pour extraire les regles quantitatives, afin de les encoder dans le DSL de conformite.
- **Criteres d'acceptation :**
  - Parsing du reglement ecrit (PDF) : extraction des articles concernant la construction
  - Detection des regules quantitatives : hauteurs max, COS, CES, reculs (fond, cotes, mitoyennete), implantation, aspect
  - Structuration des regules par zone et par type de construction
  - Taux d'extraction automatique cible : 60% des regules (reste manuel)
  - Flag des ambiguites (regules contradictoires, manquantes)
  - Export dans un format intermediaire (JSON) pour relecture avant encodage DSL
  - Revue manuelle par Compliance_Engine + Legal_Risk
- **Couche EDIFIA :** 2, 6
- **Agents responsables :** EDIFIA_Data_AI, EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** XL
- **Dependencies :** T3-E3-S1 (PLU collecte), T6-E1 (DSL reglementaire)

---

### T3-E7 : Generation du Rapport Site Intelligence

#### Story T3-E7-S1 : Synthese & generation rapport terrain
- **Format :** En tant que proprietaire, je veux recevoir un rapport synthetique sur mon terrain (zonage, contraintes, risques), afin de comprendre les possibilites et limites de mon projet avant la phase de conception.
- **Criteres d'acceptation :**
  - PDF de 3-5 pages contenant : (1) Carte de localisation, (2) Zonage PLU avec legende, (3) Contraintes principales (hauteur max, COS, reculs), (4) Risques identifies, (5) Topographie (pente), (6) Prix du m2 moyen (DVF), (7) Recommandations preliminaires
  - Mise en page professionnelle avec logo EDIFIA
  - Langage accessible (pas de jargon juridique sans explication)
  - Generation automatique apres completion de T3 (temps < 30s apres donnees collectees)
  - Envoi notification email "Votre analyse terrain est prete"
  - Consultable et telechargeable depuis le dashboard
- **Couche EDIFIA :** 2, 10
- **Agent responsable :** EDIFIA_Data_AI, EDIFIA_Backend_Lead, EDIFIA_Content_Designer
- **Estimation :** M
- **Dependencies :** T3-E1, T3-E2, T3-E3 (donnees collectees)

#### Story T3-E7-S2 : Validation utilisateur du rapport terrain
- **Format :** En tant que proprietaire, je veux valider le rapport terrain et confirmer que les informations sont correctes, afin de passer a la phase de programmation.
- **Criteres d'acceptation :**
  - Ecran de presentation du rapport avec sections depliables
  - CTA "Les informations sont correctes — Passer a la programmation"
  - CTA "Signaler une erreur" — formulaire avec type d'erreur (zonage, parcelle, risque)
  - Si erreur signalee : flag dans le systeme, escalation vers expert, blocage du projet temporaire
  - Compteur temps : le rapport est valide 30 jours (re-generation si depasse)
  - Passage a T4 (Programmation) declenche par la validation
- **Couche EDIFIA :** 2, 4
- **Agent responsable :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** S
- **Dependencies :** T3-E7-S1 (rapport genere)

---

### T4-E1 : Moteur de Programmation Spatiale (Room Solver)

#### Story T4-E1-S1 : Algorithme de placement des pieces
- **Format :** En tant que systeme, je veux generer un programme spatial (plan de repartition des pieces avec surfaces) a partir du brief et des contraintes terrain, afin d'alimenter le solveur de conception.
- **Criteres d'acceptation :**
  - Entree : brief valide (pieces, surfaces, relations) + emprise au sol max + hauteur max
  - Sortie : programme spatial JSON — liste pieces avec surface assignee (CHA/CAO), circulations, surface totale, ratio SHON/Surface parcelle
  - Heuristiques architecturales : cuisine proche salon (> 50% de la piece commune), chambre orientee E/SE si possible, salle de bain proche chambre, WC accessible depuis circulation
  - Verification : somme des surfaces <= surface habitable max autorisee
  - Generation en < 5 secondes
  - Si impossible de placer toutes les pieces dans l'enveloppe : alerte avec liste des conflits et suggestions de reduction
- **Couche EDIFIA :** 4
- **Agent responsable :** EDIFIA_Geometric_Solver, EDIFIA_Backend_Lead
- **Estimation :** L
- **Dependencies :** T2-E6 (brief valide), T3-E7 (rapport terrain), T4-E2 (emprise au sol)

#### Story T4-E1-S2 : Calcul des surfaces reglementaires
- **Format :** En tant que systeme, je veux calculer les surfaces reglementaires (SHON, SHAB, CAO, CHA) du programme genere, afin de verifier la conformite surfacique.
- **Criteres d'acceptation :**
  - Calcul automatique : SHON (surface hors oeuvre nette), SHAB (surface habitable), CAO (surface au sol des ouvrages), CHA (charge admise)
  - Verification : SHON <= SHON max (si defini par le PLU), CAO <= surface parcelle * COS max
  - Affichage detaille par piece avec les surfaces CAO/CHA
  - Comparaison avec les seuils reglementaires de la DP (< 40m2 pour extension)
  - Precision : arrondi au dixieme de m2
- **Couche EDIFIA :** 4, 6
- **Agent responsable :** EDIFIA_Geometric_Solver, EDIFIA_Compliance_Engine
- **Estimation :** M
- **Dependencies :** T4-E1-S1 (placement pieces)

---

### T4-E2 : Moteur d'Emprise au Sol (Footprint Generator)

#### Story T4-E2-S1 : Calcul enveloppe constructible
- **Format :** En tant que systeme, je veux calculer l'enveloppe constructible 3D a partir du PLU et des donnees terrain, afin de definir le volume maximal dans lequel le solveur peut generer des variantes.
- **Criteres d'acceptation :**
  - Entree : zonage parcelle, regles PLU (COS, hauteur max, reculs), limites de parcelle (GeoJSON)
  - Sortie : enveloppe constructible 3D (prisme en GeoJSON 3D ou polyedre) + emprise au sol max (polygone 2D)
  - Application des reculs : recul de fond, reculs lateraux, recul de mitoyennete
  - Application du COS : surface au sol max = contenance parcelle * COS
  - Application hauteur max : hauteur de facade / hauteur de faitage
  - Visualisation 3D de l'enveloppe superposee sur la parcelle (viewer web)
  - Si regles contradictoires : detection + flag pour revision manuelle
- **Couche EDIFIA :** 4, 6
- **Agent responsable :** EDIFIA_Geometric_Solver, EDIFIA_Compliance_Engine
- **Estimation :** L
- **Dependencies :** T3-E3 (PLU parse), T6-E3 (regles emprise encodees)

---

### T4-E3 : Interface de Validation du Programme

#### Story T4-E3-S1 : Affichage programme & modification pieces
- **Format :** En tant que proprietaire, je veux voir le programme spatial propose et pouvoir modifier les pieces (ajouter, supprimer, deplacer), afin qu'il corresponde exactement a mes besoins.
- **Criteres d'acceptation :**
  - Plan schematique du programme (vue 2D simplifiee) avec pieces colorisees par type
  - Tableau des pieces : nom, surface CAO, surface CHA, orientation, etage
  - Actions par piece : modifier surface (+/- 1m2), supprimer, deplacer (changer ordre)
  - Ajout de piece : selection type -> surface par defaut -> integration dans le plan
  - Mise a jour temps reel du plan schematique et des totaux
  - Alertes si modification invalide (surface > max, piece incompatible)
  - Historique des modifications (undo/redo, max 10 actions)
- **Couche EDIFIA :** 4
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_UX_Lead, EDIFIA_Geometric_Solver
- **Estimation :** L
- **Dependencies :** T4-E1 (programme genere)

#### Story T4-E3-S2 : Validation programme & passage conception
- **Format :** En tant que proprietaire, je veux valider le programme modifie et declencher la generation des variantes architecturales, afin de voir les plans concrets de mon projet.
- **Criteres d'acceptation :**
  - Recapitulatif final du programme : nombre de pieces, surface totale, nombre de niveaux
  - Comparaison avec l'enveloppe constructible (% d'utilisation)
  - Checkbox de validation : "Je valide ce programme et demande la generation des variantes"
  - Desactivation du programme apres validation (verrouillage)
  - Declenchement automatique de T5-E1 (solveur parametrique) + notification
  - Temps estime affiche : "Vos variantes seront pretes dans ~2h"
- **Couche EDIFIA :** 4, 5
- **Agent responsable :** EDIFIA_Backend_Lead, EDIFIA_Frontend_Dev
- **Estimation :** S
- **Dependencies :** T4-E3-S1 (interface programme)

---

### T5-E1 : Solveur Parametrique Geometrique V1

#### Story T5-E1-S1 : Generation plan architectural 2D
- **Format :** En tant que systeme, je veux generer automatiquement un plan architectural 2D a partir du programme valide et de l'enveloppe constructible, afin de produire un plan conforme aux standards du permis.
- **Criteres d'acceptation :**
  - Entree : programme spatial valide (pieces, surfaces, relations) + enveloppe constructible
  - Sortie : plan 2D vectoriel (SVG) avec : murs porteurs, cloisons, ouvertures (fenetres, portes), circulations, cotes, surfaces de chaque piece, orientation (fleche Nord)
  - Respect des normes de representation architecturale (echelle 1:100, epaisseurs de ligne, hachures)
  - Contraintes de placement : respect des reculs PLU, surface au sol <= COS max, hauteur <= hauteur max
  - Generation de 2-4 variantes avec differents positionnements
  - Temps de generation < 30 secondes par variante
- **Couche EDIFIA :** 5
- **Agent responsable :** EDIFIA_Geometric_Solver, EDIFIA_BIM_Specialist
- **Estimation :** XL
- **Dependencies :** T4-E2 (emprise au sol), T4-E3 (programme valide)

#### Story T5-E1-S2 : Generation elevations 3D
- **Format :** En tant que systeme, je veux generer les 4 elevations (facades) du projet a partir du plan 2D, afin de completer les documents architecturaux.
- **Criteres d'acceptation :**
  - 4 elevations generees : facade principale, facade arriere, facade gauche, facade droite
  - Elements representes : toiture, fenetres, portes, materiaux de facade (hachures/couleurs), hauteurs, niveaux de reference
  - Coherence avec le plan 2D (memes ouvertures, memes dimensions)
  - Cotation des hauteurs principales
  - Export SVG vectoriel
- **Couche EDIFIA :** 5
- **Agent responsable :** EDIFIA_Geometric_Solver, EDIFIA_BIM_Specialist
- **Estimation :** L
- **Dependencies :** T5-E1-S1 (plan 2D genere)

---

### T5-E2 : Generateur de Variantes Architecturales

#### Story T5-E2-S1 : Generation 4 variantes (A: surface, B: soleil, C: cout, D: esthetique)
- **Format :** En tant que systeme, je veux generer 4 variantes architecturales optimisees selon differents criteres, afin de proposer des choix au proprietaire.
- **Criteres d'acceptation :**
  - Variante A "Max Surface" : maximise la SHON dans l'enveloppe (priorite surface > esthetique)
  - Variante B "Soleil" : optimise l'ensoleillement des pieces principales (orientation, taille ouvertures)
  - Variante C "Economique" : minimise la complexite geometrique (forme simple, moins d'angles) pour reduire le cout
  - Variante D "Design" : priorise l'esthetique (traitements architecturaux, proportions, materiaux)
  - Chaque variante est validee par le moteur de conformite avant presentation (T6-E2)
  - Si une variante echoue la conformite : re-generation avec ajustements, max 3 tentatives
  - Donnees comparatives : surface, estimation cout, score ensoleillement, complexite
- **Couche EDIFIA :** 5, 6
- **Agent responsable :** EDIFIA_Geometric_Solver, EDIFIA_Compliance_Engine
- **Estimation :** L
- **Dependencies :** T5-E1 (solveur), T6-E2 (rule engine)

---

### T5-E3 : Visualisateur 3D Interactif (Viewer WebGL)

#### Story T5-E3-S1 : Viewer 3D base (Three.js)
- **Format :** En tant que proprietaire, je veux explorer ma variante architecturale en 3D dans mon navigateur, afin de visualiser mon projet avant de le valider.
- **Criteres d'acceptation :**
  - Rendu 3D temps reel dans le navigateur (Three.js ou MapLibre 3D)
  - Controles : rotation (click+drag), zoom (molette), deplacement (right-click+drag)
  - Modelisation du batiment genere : murs, toiture, ouvertures avec textures basiques
  - Contexte terrain : parcelle, batiments voisins (BDTOPO), vegetation
  - Performance : > 30 FPS sur navigateur moderne, chargement < 5s
  - Fallback 2D si WebGL non supporte
  - Responsive (fonctionne sur tablette)
- **Couche EDIFIA :** 5
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_BIM_Specialist
- **Estimation :** XL
- **Dependencies :** T5-E2 (variantes generees)

#### Story T5-E3-S2 : Comparaison variantes (split view)
- **Format :** En tant que proprietaire, je veux comparer cote a cote deux variantes en 3D, afin de choisir celle qui me convient le mieux.
- **Criteres d'acceptation :**
  - Mode split-screen : deux viewers 3D synchronises (meme angle de vue, meme zoom)
  - Tableau comparatif synchronise : surface, nombre de pieces, estimation cout, score ensoleillement
  - Navigation synchronisee entre les deux vues (rotation/zoom couplés)
  - Selection de la variante preferee avec bouton "Choisir cette variante"
  - Export image PNG de chaque variante depuis le viewer
- **Couche EDIFIA :** 5
- **Agent responsable :** EDIFIA_Frontend_Dev, EDIFIA_UX_Lead
- **Estimation :** M
- **Dependencies :** T5-E3-S1 (viewer base)

---

### T5-E5 : Generation des Plans 2D (Coupe, Elevation, Plan Masse)

#### Story T5-E5-S1 : Generation plans techniques complets
- **Format :** En tant que systeme, je veux generer l'ensemble des plans techniques 2D necessaires au dossier de declaration prealable, afin que le dossier soit complet pour la mairie.
- **Criteres d'acceptation :**
  - Plan de masse : parcelle avec limites, projet en couleur, echelle 1:500, Nord, distances de recul, legende
  - Plan de niveau : plan 2D architectural detaille (variante choisie), echelle 1:100, cotes, surfaces, materiaux
  - Elevations (4 facades) : echelle 1:100, cotation hauteurs, materiaux, finitions
  - Coupe transversale : echelle 1:100, niveaux, hauteurs, structure basique, fondations
  - Tous les plans au format PDF vectoriel (impression A3/A2 compatible)
  - Convention graphique coherente sur tous les plans (couleurs, epaisseurs, typographie)
  - Compliant avec les exigences des services d'urbanisme des communes pilotes
- **Couche EDIFIA :** 5, 10
- **Agent responsable :** EDIFIA_BIM_Specialist, EDIFIA_Geometric_Solver
- **Estimation :** L
- **Dependencies :** T5-E1 (solveur), T5-E7 (variante selectionnee)

---

### T5-E7 : Interface de Selection & Personnalisation de la Variante

#### Story T5-E7-S1 : Ecran de comparaison & selection
- **Format :** En tant que proprietaire, je veux comparer les variantes generees et selectionner ma preferee, afin de verrouiller le choix architectural.
- **Criteres d'acceptation :**
  - Page de comparaison : grille de 2-4 variantes avec miniature 3D, titre, description
  - Tableau comparatif : surface SHON, nombre pieces, estimation cout, score ensoleillement, complexite
  - Clic sur variante : ouverture detaillee avec viewer 3D plein ecran
  - Bouton "Choisir cette variante" sur chaque carte
  - Confirmation : modal de validation avec recapitulatif
  - Apres selection : blocage des modifications, declenchement T6 (conformite) + T7 (livrables)
- **Couche EDIFIA :** 5
- **Agent responsable :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev
- **Estimation :** M
- **Dependencies :** T5-E3 (viewer 3D), T5-E2 (variantes)

---

### T6-E1 : Schema de Formalisation des Regles (DSL Reglementaire)

#### Story T6-E1-S1 : Conception DSL reglementaire
- **Format :** En tant que moteur de conformite, je veux disposer d'un langage formel pour exprimer les regles d'urbanisme, afin de les executer de maniere deterministe sur n'importe quel projet.
- **Criteres d'acceptation :**
  - DSL concu avec syntaxe claire : `RULE <nom> : IF <condition> THEN <result> ELSE <result> [MESSAGE "..."]`
  - Types de conditions supportees : comparaisons numeriques (hauteur > max, surface < min), appartenance zonage, geometriques (distance, intersection), booleennes
  - Parametres dynamiques : valeurs extraites du PLU (parametrables par commune/zone)
  - Resultats : PASS, FAIL, WARNING, MANUAL_CHECK
  - Messages explicatifs en cas d'echec : "La hauteur de faitage (8.5m) depasse le maximum autorise (8m) dans la zone Ua"
  - Documentation du DSL complete (specification technique)
  - Validation syntaxique du DSL (parser + lexer)
  - Tests unitaires : 100% des constructions DSL testees
- **Couche EDIFIA :** 6
- **Agent responsable :** EDIFIA_Compliance_Engine, EDIFIA_CTO
- **Estimation :** XL
- **Dependencies :** Aucune

#### Story T6-E1-S2 : Editeur de regles (interface d'encodage)
- **Format :** En tant qu'expert conformite, je veux disposer d'une interface pour encoder et tester les regles, afin de peupler le moteur de conformite.
- **Criteres d'acceptation :**
  - Interface web (backoffice) : editeur de texte avec syntax highlighting du DSL
  - Validation en temps reel : indicateur syntaxe valide/invalide
  - Test unitaire de regle : selection d'un projet de test, execution, resultat PASS/FAIL
  - Organisation par commune / zone / categorie (hauteur, recul, aspect...)
  - Versioning des regles (historique des modifications)
  - Export/import batch (JSON)
  - Acces restreint (role EXPERT_CONFORMITE)
- **Couche EDIFIA :** 6
- **Agent responsable :** EDIFIA_Compliance_Engine, EDIFIA_Frontend_Dev
- **Estimation :** M
- **Dependencies :** T6-E1-S1 (DSL concu)

---

### T6-E2 : Moteur d'Execution des Regles (Rule Engine)

#### Story T6-E2-S1 : Execution deterministe des regles
- **Format :** En tant que systeme, je veux executer automatiquement les regles encodees contre un projet donne, afin de determiner s'il est conforme ou non.
- **Criteres d'acceptation :**
  - Chargement des regles applicables selon la commune et le zonage du projet
  - Execution sequentielle de chaque regule avec acces aux donnees du projet (geometrie, surfaces, materiaux, parcelle)
  - Resultat par regule : PASS (vert), FAIL (rouge), WARNING (orange), MANUAL_CHECK (jaune)
  - Temps d'execution < 2 secondes pour un jeu de 200 regules
  - Determinisme garanti : meme projet -> meme resultat, toujours
  - Pas d'appel a un LLM dans le pipeline d'execution (contrainte C1)
  - Journal d'execution trace (audit)
  - Parallelisation possible si regules independantes
- **Couche EDIFIA :** 6
- **Agent responsable :** EDIFIA_Compliance_Engine, EDIFIA_Backend_Lead
- **Estimation :** L
- **Dependencies :** T6-E1 (DSL), T8-E6 (tests automatises)

#### Story T6-E2-S2 : Jeux de test de reference (cas passes/echoues)
- **Format :** En tant que QA, je veux disposer de jeux de test de reference (projets dont la conformite est connue), afin de valider que le moteur de conformite fonctionne correctement.
- **Criteres d'acceptation :**
  - 10 jeux de test minimum par commune pilote (5 conformes, 5 non-conformes avec raison connue)
  - Description de chaque test : geometrie, zonage, resultat attendu, regule(s) visee(s)
  - Execution automatique a chaque modification du moteur ou des regles (CI)
  - Taux de succes cible : 100% des tests passes avant merge
  - Couverture : au moins 80% des regules testees par au moins un cas
  - Documentation des cas limites et comportement attendu
- **Couche EDIFIA :** 6
- **Agent responsable :** EDIFIA_QA_Lead, EDIFIA_Compliance_Engine
- **Estimation :** M
- **Dependencies :** T6-E2-S1 (moteur operationnel)

---

### T6-E3 : Encodage des Regles PLU — 10 Communes Pilotes

#### Story T6-E3-S1 : Encodage regles Tremblay-en-France (commune ref)
- **Format :** En tant qu'expert conformite, je veux encoder les regles PLU de Tremblay-en-France dans le DSL, afin de valider le processus d'encodage sur la commune de reference.
- **Criteres d'acceptation :**
  - Revue complete du PLU de Tremblay-en-France (reglement ecrit + graphique)
  - Encodage de toutes les regules quantitatives identifiees (hauteur, COS, reculs, implantation)
  - Nombre de regules encodees : 50-150 selon la complexite du PLU
  - Tests de validation : execution sur 5 projets de test, resultats coherents
  - Revue croisee Compliance_Engine + Legal_Risk
  - Documentation des regules specifiques et ambiguites
  - Temps cible : 1 semaine pour la commune de reference
- **Couche EDIFIA :** 6, 2
- **Agent responsable :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** L
- **Dependencies :** T6-E1 (DSL), T3-E3 (PLU parse)

#### Story T6-E3-S2 : Encodage regles 9 communes couronne 93
- **Format :** En tant qu'expert conformite, je veux encoder les regles PLU des 9 autres communes pilotes, afin d'atteindre la couverture complete des communes V1.
- **Criteres d'acceptation :**
  - Communes : Villepinte, Sevran, Livry-Gargan, Le Raincy, Clichy-sous-Bois, Montfermeil, Coubron, Vaujours, plus 2 communes de reserve
  - Process industrialise a partir de l'experience Tremblay
  - Cible : 3-5 jours par commune (vs 1 semaine pour la premiere)
  - Taux de regules encodees : > 95% des regules quantitatives identifiees
  - Tests automatises passes pour chaque commune
  - Suivi de progression : dashboard avec % completion par commune
  - Identification des regules communes (factorisation possible)
- **Couche EDIFIA :** 6, 2
- **Agent responsable :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk, EDIFIA_Data_AI
- **Estimation :** XL
- **Dependencies :** T6-E3-S1 (Tremblay reference)

---

### T6-E4 : Encodage Reglement National (RNU + DU/DP)

#### Story T6-E4-S1 : Encodage regles DP / extension <40m2
- **Format :** En tant qu'expert conformite, je veux encoder les regles nationales applicables aux declarations prealables pour extensions <40m2, afin qu'elles s'appliquent a tous les projets V1.
- **Criteres d'acceptation :**
  - Regles encodees : surface extension < 40m2 (Article R421-9), hauteur max (4m/6m/8m selon cas), distances de mitoyennete (3.20m standard), recul de fond (5m standard), aspect des constructions
  - Regles specifiques zone U (urbaine), AU (a urbaniser), A (agricole), N (naturelle)
  - Reference article legal dans chaque regule (traçabilite)
  - Application systematique a tous les projets (independante du PLU)
  - Tests sur cas de reference passes
  - Revue Legal_Risk
- **Couche EDIFIA :** 6
- **Agent responsable :** EDIFIA_Compliance_Engine, EDIFIA_Legal_Risk
- **Estimation :** L
- **Dependencies :** T6-E1 (DSL), T6-E2 (moteur)

---

### T6-E7 : Rapport de Conformite & Non-Conformites

#### Story T6-E7-S1 : Generation rapport conformite
- **Format :** En tant que proprietaire, je veux recevoir un rapport detaille de conformite de mon projet, afin de savoir s'il est conforme et quelles sont les eventuelles non-conformites.
- **Criteres d'acceptation :**
  - Rapport structure avec : (1) Synthese globale (CONFORME / NON CONFORME / CONFORME SOUS RESERVES), (2) Detail regule par regule, (3) Recommandations de correction
  - Pour chaque regule : nom, description, resultat (PASS/FAIL/WARNING), valeur mesuree, valeur autorisee, ecart, message explicatif
  - Synthese par categorie : hauteur, reculs, surfaces, aspect, accessibilite
  - Si conforme : mention "Projet pret pour depot" + prochaines etapes
  - Si non conforme : liste des corrections possibles avec impact estime
  - Generation PDF professionnel (2-4 pages)
  - Temps de generation < 10 secondes apres execution moteur
- **Couche EDIFIA :** 6, 10
- **Agent responsable :** EDIFIA_Compliance_Engine, EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T6-E2 (rule engine), T6-E3 (PLU encode), T6-E4 (RN encode)

---

### T7-E1 : Generateur de CERFA 13406*07 (DP) Pre-rempli

#### Story T7-E1-S1 : Mapping donnees projet -> champs CERFA
- **Format :** En tant que systeme, je veux remplir automatiquement le formulaire CERFA 13406*07 avec les donnees du projet, afin de generer un CERFA pre-rempli pret pour signature.
- **Criteres d'acceptation :**
  - Champs pre-remplis : identite demandeur (profil), adresse travaux (parcelle), nature des travaux (type projet), description (brief resume), surfaces (SHON, SHAB), hauteurs, materiaux, architecte ("non requis pour DP <40m2")
  - Champs a remplir manuellement (si donnees manquantes) : flaggue avec indicateur visuel
  - Validation : tous les champs obligatoires du CERFA sont remplis ou signales
  - Generation PDF au format exact du CERFA 13406*07 (mise en page conforme)
  - Numero de CERFA visible et valide
  - Date de generation automatique
  - Reference du projet EDIFIA en en-tete
  - Test : comparaison avec CERFA manuel rempli pour un projet de reference -> 100% des champs coherents
- **Couche EDIFIA :** 10
- **Agent responsable :** EDIFIA_BIM_Specialist, EDIFIA_Backend_Lead, EDIFIA_Legal_Risk
- **Estimation :** L
- **Dependencies :** T1-E2-S4 (profil), T2-E6 (brief), T3-E1 (parcelle), T5-E5 (plans)

#### Story T7-E1-S2 : Validation CERFA par expert
- **Format :** En tant que systeme, je veux qu'un expert conformite valide chaque CERFA genere avant livraison, afin d'eviter toute erreur dans le document administratif central.
- **Criteres d'acceptation :**
  - Workflow de validation : CERFA genere -> file d'attente validation -> revue expert -> approuve/rejete avec commentaires
  - Temps de validation cible : < 4h ouvrables par CERFA
  - Si rejete : retour au systeme avec corrections requises, regeneration
  - Si approuve : statut "CERFA valide" dans le projet
  - Audit trail : qui a valide, quand, quels commentaires
  - Bypass possible apres 10 CERFA valides (confiance etablie) — a decision CTO
- **Couche EDIFIA :** 10, 6
- **Agent responsable :** EDIFIA_Legal_Risk, EDIFIA_Compliance_Engine
- **Estimation :** S
- **Dependencies :** T7-E1-S1 (CERFA genere)

---

### T7-E2 : Generateur de Notice Technique & Descriptive

#### Story T7-E2-S1 : Generation notice descriptive
- **Format :** En tant que systeme, je veux generer automatiquement la notice descriptive du projet a partir des donnees du brief et de la variante selectionnee, afin de completer le dossier de declaration prealable.
- **Criteres d'acceptation :**
  - Contenu genere : description des travaux (type, etendue), materiaux proposes (structure, facades, couverture), equipements, surface detaillee
  - Redaction professionnelle (langage technique standardise, pas de LLM pour le fond — templates parametres)
  - Integration des donnees : pieces, surfaces, materiaux choisis, hauteurs, structure
  - Mention de la conformite RE2020 (applicable)
  - Mention de l'accessibilite (si applicable)
  - Format PDF, 2-3 pages, en-tete EDIFIA + reference projet
  - Complementaire au CERFA (pas de redondance)
- **Couche EDIFIA :** 10
- **Agent responsable :** EDIFIA_BIM_Specialist, EDIFIA_Content_Designer
- **Estimation :** M
- **Dependencies :** T2-E6 (brief), T5-E7 (variante), T6-E7 (rapport conformite)

---

### T7-E3 : Generation du Dossier Complet (Assemblage PDF)

#### Story T7-E3-S1 : Assemblage document unique
- **Format :** En tant que proprietaire, je veux telecharger un dossier complet et unique contenant tous les documents necessaires au depot, afin de tout avoir dans un seul fichier PDF.
- **Criteres d'acceptation :**
  - Table des matieres avec liens cliquables
  - Documents inclus dans l'ordre : (1) CERFA rempli, (2) Plan de situation, (3) Plan de masse, (4) Plan(s) de niveau, (5) Elevations, (6) Coupe, (7) Notice descriptive, (8) Rapport site intelligence, (9) Rapport conformite, (10) Attestation (si generee)
  - Pagination continue avec numero de page
  - En-tete : "Dossier de Declaration Prealable — EDIFIA" + reference projet + date
  - Signets PDF par section
  - Taille : < 15 Mo pour telechargement
  - Generation < 30 secondes
  - Telechargement direct depuis le dashboard + lien email
- **Couche EDIFIA :** 10
- **Agent responsable :** EDIFIA_BIM_Specialist, EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T7-E1 (CERFA), T7-E2 (notice), T5-E5 (plans), T3-E7 (rapport terrain), T6-E7 (rapport conformite)

#### Story T7-E3-S2 : Validation finale & livraison
- **Format :** En tant que proprietaire, je veux valider le dossier complet et recevoir les instructions pour le deposer en mairie, afin de finaliser mon projet EDIFIA.
- **Criteres d'acceptation :**
  - Ecran de validation du dossier : liste des documents avec vignettes, checkbox de validation par document
  - Checklist de verification : "J'ai verifie mon identite", "J'ai verifie l'adresse", "Je comprends que je suis responsable du depot"
  - Generation du dossier final apres validation
  - Instructions de depot personnalisees (voir T7-E5)
  - Email recapitulatif avec lien de telechargement du dossier (valide 30 jours)
  - Message de felicitations + feedback optionnel (NPS)
  - Statut projet passe a "Dossier livre — En attente de depot"
- **Couche EDIFIA :** 10
- **Agent responsable :** EDIFIA_UX_Lead, EDIFIA_Frontend_Dev, EDIFIA_Backend_Lead
- **Estimation :** S
- **Dependencies :** T7-E3-S1 (assemblage)

---

### T8-E1 : Infrastructure Cloud & Environnements

#### Story T8-E1-S1 : Deploiement infrastructure de base
- **Format :** En tant que DevOps, je veux deployer l'infrastructure cloud de base pour EDIFIA, afin d'heberger la plateforme de maniere securisee et scalable.
- **Criteres d'acceptation :**
  - Region : eu-west-3 (Paris) ou provider souverain (Scaleway/Outscale)
  - VPC isole avec subnets publics/prives, NAT Gateway, bastion
  - PostgreSQL 15+ avec PostGIS extension
  - Redis (cache + sessions + file d'attente)
  - S3-compatible (stockage objets : documents, photos, LIDAR)
  - 3 environnements : dev, staging, production (isolation complete)
  - IAC avec Terraform (state versionne, lock)
  - HTTPS partout (certificats TLS 1.3, auto-renewal)
  - Backup automatique BDD : quotidien, retention 30 jours
  - Cout mensuel estime et budget alerte
- **Couche EDIFIA :** Transverse
- **Agent responsable :** EDIFIA_DevOps_SRE
- **Estimation :** L
- **Dependencies :** Aucune

#### Story T8-E1-S2 : Conteneurisation & orchestration
- **Format :** En tant que DevOps, je veux conteneuriser les services EDIFIA et les orchestrer, afin de garantir la coherence entre les environnements et faciliter les deploiements.
- **Criteres d'acceptation :**
  - Dockerfiles pour chaque service (API, frontend, worker conformite, worker generation)
  - Docker Compose pour dev/local
  - Orchestration Kubernetes (staging + production) ou ECS
  - Service mesh pour communication inter-services (mTLS)
  - Auto-scaling horizontal (HPA) : CPU > 70% -> scale out
  - Health checks sur chaque service (liveness + readiness)
  - Graceful shutdown (pas de requetes perdues)
  - Secrets management (HashiCorp Vault ou AWS Secrets Manager)
- **Couche EDIFIA :** Transverse
- **Agent responsable :** EDIFIA_DevOps_SRE
- **Estimation :** L
- **Dependencies :** T8-E1-S1 (infra base)

---

### T8-E2 : CI/CD & Automatisation des Deploiements

#### Story T8-E2-S1 : Pipeline CI/CD complete
- **Format :** En tant que developpeur, je veux que chaque commit declenche automatiquement une pipeline de build, test et deploiement, afin de livrer rapidement et sans erreur.
- **Criteres d'acceptation :**
  - GitHub Actions / GitLab CI (au choix, standardise)
  - Stages : lint -> test unitaires -> build -> test integration -> scan securite -> deploy staging
  - Tests unitaires : couverture minimum 80% (bloquant si < 80%)
  - Scan securite SAST (SonarQube/Semgrep) + dependances (Snyk/Dependabot)
  - Deploiement automatique en staging apres tests passes
  - Deploiement production : manuel (bouton) apres validation staging
  - Notifications Slack/Discord en cas d'echec
  - Temps total pipeline < 15 minutes
  - Rollback automatique si health check echoue post-deploiement
- **Couche EDIFIA :** Transverse
- **Agent responsable :** EDIFIA_DevOps_SRE, EDIFIA_QA_Lead
- **Estimation :** M
- **Dependencies :** T8-E1 (infra)

---

### T8-E3 : Authentification & Autorisation (RBAC)

#### Story T8-E3-S1 : Systeme RBAC complet
- **Format :** En tant que systeme, je veux gerer les roles et permissions des utilisateurs, afin de securiser l'acces aux fonctionnalites et aux donnees.
- **Criteres d'acceptation :**
  - Roles definis : PROPRIETAIRE (utilisateur standard), EXPERT_CONFORMITE (backoffice conformite), ADMIN (gestion), DEV (acces technique)
  - Permissions par role : matrice complete (lecture/creation/modification/suppression par ressource)
  - Middleware d'autorisation sur chaque endpoint API
  - JWT avec claims (role, permissions)
  - Impersonation possible pour support (loggue, avec autorisation)
  - Tests : chaque endpoint teste avec chaque role (403 si non autorise)
- **Couche EDIFIA :** Transverse
- **Agent responsable :** EDIFIA_Security_Lead, EDIFIA_Backend_Lead
- **Estimation :** M
- **Dependencies :** T8-E1 (infra)

---

### T8-E4 : Conformite RGPD & Tracabilite

#### Story T8-E4-S1 : Mise en conformite RGPD complete
- **Format :** En tant que DPO, je veux que la plateforme soit conforme au RGPD, afin de proteger les donnees personnelles des utilisateurs et eviter les sanctions.
- **Criteres d'acceptation :**
  - Consentement explicite lors de l'inscription (case a cocher obligatoire, pas pre-cochee) avec lien vers politique de confidentialite
  - Politique de confidentialite redigee et publiee
  - Registre des traitements (donnees collectees, finalite, duree conservation, base legale)
  - Duree de conservation : donnees projet 3 ans apres derniere activite, compte utilisateur jusqu'a suppression
  - Droit a l'acces : endpoint API pour exporter toutes les donnees d'un utilisateur (JSON)
  - Droit a l'oubli : endpoint API pour suppression complete du compte + donnees (cascade)
  - Droit a la rectification : modification des donnees personnelles depuis le profil
  - Droit d'opposition : desinscription marketing en 1 clic
  - Notification de violation sous 72h si applicable
  - Journal d'audit des acces aux donnees personnelles (qui, quand, quelle donnnee)
- **Couche EDIFIA :** Transverse
- **Agent responsable :** EDIFIA_Security_Lead, EDIFIA_Legal_Risk
- **Estimation :** M
- **Dependencies :** T8-E1 (infra), T8-E3 (RBAC)

---


---

## 5. Chemin Critique V1

### 5.1 Sequence chronologique des epics P0

Le chemin critique represente la sequence d'epics qui determine la duree minimale du projet. Tout retard sur ce chemin retarde l'objectif "10 PC deposes, 5+ acceptes".

```
PHASE 0 — FONDATIONS (Mois 1-2)
================================
[S0.1] T8-E1  Infrastructure Cloud & Environnements
[S0.2] T8-E2  CI/CD & Automatisation des Deploiements
[S0.3] T8-E3  Authentification & Autorisation (RBAC)
[S0.4] T8-E4  Conformite RGPD & Tracabilite
       |
       v
PHASE 1 — COLLECTE DONNEES TERRAIN (Mois 1-3, parallelisable)
============================================================
[S1.1] T6-E1  Schema DSL Reglementaire  -------------------------+
[S1.2] T3-E1  Geocodage & Identification Parcelle               |
[S1.3] T3-E3  Collecte & Parsing PLU 10 communes                |
       |                                                        |
       +----------------+----------------------------------------+
                        |
                        v
PHASE 2 — ENCODAGE CONFORMITE (Mois 2-4)
========================================
[S2.1] T6-E2  Moteur d'Execution des Regles (Rule Engine)
[S2.2] T6-E4  Encodage Reglement National (RNU + DP)
[S2.3] T6-E3  Encodage Regles PLU — 10 Communes Pilotes
       |
       v
PHASE 3 — EXPERIENCE UTILISATEUR (Mois 2-4, parallelisable avec Phase 2)
========================================================================
[S3.1] T1-E2  Inscription & Authentification
[S3.2] T1-E4  Parcours Onboarding Wizard
[S3.3] T2-E1  Interface Brief Textuel
[S3.4] T2-E2  Upload & Analyse Photos
[S3.5] T2-E6  Validation & Structuration Brief
       |
       v
PHASE 4 — SITE INTELLIGENCE & PROGRAMMATION (Mois 3-5)
======================================================
[S4.1] T3-E2  Ingestion Donnees IGN (LIDAR, BDTOPO)
[S4.2] T3-E7  Generation Rapport Site Intelligence
[S4.3] T4-E2  Moteur d'Emprise au Sol
[S4.4] T4-E1  Moteur Programmation Spatiale
[S4.5] T4-E3  Interface Validation Programme
       |
       v
PHASE 5 — CONCEPTION GENERATIVE (Mois 4-7)
==========================================
[S5.1] T5-E1  Solveur Parametrique Geometrique V1
[S5.2] T5-E2  Generateur de Variantes Architecturales
[S5.3] T5-E3  Visualisateur 3D Interactif
[S5.4] T5-E7  Interface Selection & Personnalisation Variante
       |
       v
PHASE 6 — VALIDATION CONFORMITE (Mois 5-7)
==========================================
[S6.1] T6-E7  Rapport de Conformite & Non-Conformites
       |
       v
PHASE 7 — LIVRABLES & DEPOT (Mois 6-8)
======================================
[S7.1] T5-E5  Generation Plans 2D Complets
[S7.2] T7-E1  Generateur CERFA 13406*07 Pre-rempli
[S7.3] T7-E2  Generateur Notice Technique
[S7.4] T7-E3  Generation Dossier Complet (Assemblage PDF)
[S7.5] T1-E3  Dashboard Proprietaire (finalisation)
       |
       v
PHASE 8 — PILOTAGE & ITERATION (Mois 8-12)
==========================================
[S8.1] Depot des 10 premiers PC en mairies pilotes
[S8.2] Suivi des reponses mairies (delai 1-2 mois)
[S8.3] Corrections & ajustements selon retours mairies
[S8.4] Objectif : 5+ PC acceptes
```

### 5.2 Points de validation majeurs (Milestones)

| Milestone | Nom | Date cible | Livrable | Validation |
|-----------|-----|------------|----------|------------|
| **M0** | Fondations techniques | Fin mois 1 | Infra deployee, CI/CD operationnel, auth fonctionnel | Demo deploiement staging + production, tests passes |
| **M1** | DSL & Moteur conformite | Fin mois 2 | DSL specifie, rule engine execute les 1eres regules, jeux de test passes | Execution 100 regules sur projet test, resultat deterministe |
| **M2** | PLU 10 communes encode | Fin mois 3 | 80%+ regules des 10 communes encodees, tests OK | Execution conformite sur 5 projets test par commune |
| **M3** | Brief & Site Intelligence | Fin mois 3 | Parcours utilisateur complet jusqu'au rapport terrain | Test utilisateur : 5 proprietaires parcourent le funnel complet |
| **M4** | Conception generative V1 | Fin mois 5 | Solveur genere 4 variantes conformes, viewer 3D interactif | Demo : brief -> variantes en < 5 minutes |
| **M5** | Dossier complet genere | Fin mois 6 | 1er dossier complet (CERFA + plans + notice) genere automatiquement | Comparaison avec dossier manuel expert -> equivalence |
| **M6** | 1er PC depose | Fin mois 7 | 1er dossier depose en mairie avec suivi | Accuse de reception mairie |
| **M7** | 10 PC deposes | Fin mois 10 | 10 dossiers deposes dans les 10 communes pilotes | Accuses de reception |
| **M8** | 5+ PC acceptes | Fin mois 12 | 5 reponses positives de mairies | Pieces justificatives acceptation |

### 5.3 Livraisons incrementales

| Phase | Livrable utilisateur | Livrable technique | Audience |
|-------|---------------------|-------------------|----------|
| **M0** | — | Infra + CI/CD + Auth | Equipe |
| **M1-M2** | — | Moteur conformite + PLU encode | Equipe + Experts |
| **M3** | Rapport terrain PDF | Pipeline Site Intelligence | Testeurs pilotes |
| **M4** | Visualisation 3D variantes | Solveur + Viewer + Variantes | Beta testeurs (20) |
| **M5** | Dossier complet PDF (CERFA+plans+notice) | Generateurs livrables | Premiers clients payants |
| **M6-M8** | Dossier valide par mairie + guide depot | Process complet end-to-end | Clients V1 |

### 5.4 Risques sur le chemin critique

| # | Risque | Probabilite | Impact | Mitigation |
|---|--------|-------------|--------|------------|
| R1 | **Parsing PLU trop complexe** — Les PLU sont majoritairement en PDF non-structuré, parsing automatique rate | Haute | Critique | Parser hybride IA (extraction) + manuel (validation). Accepter 60% auto / 40% manuel V1. |
| R2 | **Rule engine trop lent** — Temps d'execution > 2s avec 200+ regules | Moyenne | Majeur | Optimisation algo, parallelisation, cache des resultats par commune/zone |
| R3 | **Solveur geometrique ne converge pas** — Echec generation plan pour certaines configurations | Moyenne | Majeur | Heuristiques de fallback, limites V1 claires (formes simples), fail-safe manual |
| R4 | **PLU en cours de revision** — Un PLU pilote change pendant le V1 | Moyenne | Majeur | Detection automatique (alerte), process de mise a jour mensuel, disclaimer date du PLU utilise |
| R5 | **Mairie refuse dossier IA** — Un service d'urbanisme conteste la validite du dossier | Moyenne | Critique | Mention "Document etabli par logiciel EDIFIA" (legal), accompaniment humain si besoin, selection mairies ouvertes |
| R6 | **Performance viewer 3D** — Lenteur sur mobile/navigateurs anciens | Faible | Mineur | Fallback 2D, optimisation LOD, detection capacite navigateur |
| R7 | **Donnees IGN indisponibles** — Service IGN degrade ou tuile manquante | Faible | Majeur | Cache local, retry exponentiel, fallback donnees moins precises |
| R8 | **Dependance expert humain validation CERFA** — Goulot d'etranglement si volume augmente | Moyenne | Majeur | Automatisation progressive (bypass apres N CERFA valides), hiring expert si volume > 10/semaine |

---

## 6. Backlog Technique Transversal

Ce chapitre synthetise les epics techniques transverses detaillees dans le T8, avec leurs dependances et prioritisation.

### 6.1 Infrastructure & CI/CD

| Epic | Description | Priorite | Estimation | Dependencies |
|------|-------------|----------|------------|--------------|
| T8-E1 | Infrastructure Cloud & Environnements (Dev/Staging/Prod) | **P0** | L | — |
| T8-E2 | CI/CD & Automatisation des Deploiements | **P0** | M | T8-E1 |

**Stories cles :**
- T8-E1-S1 : Deploiement infrastructure de base (VPC, BDD, Redis, S3, 3 envs)
- T8-E1-S2 : Conteneurisation & orchestration (Docker, K8s, auto-scaling)
- T8-E2-S1 : Pipeline CI/CD complete (lint -> test -> build -> scan -> deploy)

### 6.2 Securite & Conformite RGPD

| Epic | Description | Priorite | Estimation | Dependencies |
|------|-------------|----------|------------|--------------|
| T8-E3 | Authentification & Autorisation (RBAC) | **P0** | M | T8-E1 |
| T8-E4 | Conformite RGPD & Tracabilite | **P0** | M | T8-E1, T8-E3 |

**Stories cles :**
- T8-E3-S1 : Systeme RBAC complet (4 roles, permissions, JWT)
- T8-E4-S1 : Conformite RGPD complete (consentement, droit oubli, portabilite, audit)

**Checklist securite V1 :**
- [ ] Chiffrement donnees au repos (AES-256) et en transit (TLS 1.3)
- [ ] Authentification JWT securisee (access + refresh tokens)
- [ ] RBAC avec 4 roles minimum
- [ ] RGPD : consentement, droit a l'oubli, portabilite, registre traitements
- [ ] Aucune donnee utilisateur hors UE (hebergement eu-west-3)
- [ ] Secrets externalises (Vault/Secrets Manager)
- [ ] Scan securite SAST/DAST dans CI/CD
- [ ] Rate limiting sur API publiques
- [ ] Protection XSS, CSRF, SQL injection
- [ ] Journal d'audit des acces aux donnees sensibles

### 6.3 Monitoring & Alerting

| Epic | Description | Priorite | Estimation | Dependencies |
|------|-------------|----------|------------|--------------|
| T8-E5 | Monitoring, Alerting & Observabilite | **P1** | M | T8-E1 |

**Metrics cles a monitorer V1 :**
| Categorie | Metrique | Seuil d'alerte |
|-----------|----------|----------------|
| Performance | Temps generation variantes | > 60s |
| Performance | Temps execution conformite | > 5s |
| Performance | Temps chargement viewer 3D | > 10s |
| Disponibilite | Uptime API | < 99.5% sur 24h |
| Disponibilite | Uptime viewer 3D | < 99% sur 24h |
| Business | Taux completion parcours | < 40% sur 7 jours |
| Business | Nombre de projets crees/jour | = 0 sur 48h |
| Erreurs | Taux erreur 5xx | > 1% sur 1h |
| Erreurs | Echec generation conformite | > 10% sur 24h |
| Erreurs | Files d'attente workers (bloquees) | > 50 jobs sur 30min |

### 6.4 Documentation Technique

| Epic | Description | Priorite | Estimation | Dependencies |
|------|-------------|----------|------------|--------------|
| T8-E8 | Documentation Technique & API | **P1** | M | — |

**Documents a produire V1 :**
- [ ] Architecture Decision Records (ADRs) — toutes les decisions architecturales
- [ ] API Documentation (OpenAPI 3.0) — tous les endpoints
- [ ] DSL Specification — langage de formalisation des regles
- [ ] Runbooks operations — procedures d'incident, rollback, scaling
- [ ] Guide contributeur — onboarding developpeurs
- [ ] Documentation utilisateur — FAQ, guide parcours
- [ ] Schema de donnees — modele relationnel + geospatial

### 6.5 Tests Automatises

| Epic | Description | Priorite | Estimation | Dependencies |
|------|-------------|----------|------------|--------------|
| T8-E6 | Tests Automatises (Unitaires, Integration, E2E) | **P1** | L | T8-E2 |

**Pyramide de tests V1 :**
| Niveau | Type | Couverture cible | Outils |
|--------|------|-----------------|--------|
| Unitaires | Fonctions, regles DSL | > 80% | pytest/Jest |
| Integration | API, BDD, services | > 60% | pytest + TestContainers |
| E2E | Parcours utilisateur complet | 5 parcours critiques | Playwright |
| Conformite | Jeux de test reglementaires | 10+ cas/commune | Framework interne |
| Performance | Temps de reponse, charge | Seuils definis | k6/Artillery |

**Parcours E2E critiques a tester :**
1. Inscription -> Onboarding -> Brief texte -> Upload photos -> Validation brief
2. Validation brief -> Analyse terrain -> Rapport terrain -> Validation terrain
3. Validation terrain -> Programme -> Modification programme -> Validation programme
4. Validation programme -> Generation variantes -> Viewer 3D -> Selection variante
5. Selection variante -> Conformite -> Generation CERFA -> Dossier complet -> Telechargement

### 6.6 Ingestion Donnees Foncieres — 10 Communes Pilotes

| Epic | Description | Priorite | Estimation | Dependencies |
|------|-------------|----------|------------|--------------|
| T8-E7 | Ingestion Donnees Foncieres — 10 Communes Pilotes | **P1** | M | T3-E3, T8-E1 |

**Pipeline de donnees :**
```
Source (IGN, Etalab, Mairie) -> Collecte (API/Scraping) -> Stockage brut (S3)
    -> Parsing/Traitement -> Donnees structurees (PostGIS) -> Cache (Redis)
    -> Consommation (API interne) -> Moteur conformite / Site Intelligence
```

**Frequences de mise a jour V1 :**
| Donnee | Source | Frequence update | Methode detection |
|--------|--------|-----------------|-------------------|
| PLU | geoportail-urbanisme | Mensuelle |Polling + webhook si dispo |
| Cadastre | cadastre.gouv.fr | Trimestrielle | Polling |
| DVF | data.gouv.fr (Etalab) | Semestrielle | Polling |
| LIDAR HD | IGN Geoservices | Annuelle | Polling |
| BDTOPO | IGN Geoservices | Annuelle | Polling |
| Risques (GASPAR) | Etalab | Annuelle | Polling |

---

## 7. Matrice Risque x Valeur

### 7.1 Positionnement des Epics

```
RISQUE TECHNIQUE
    |
 XL |  T5-E1 (Solveur)          T6-E1 (DSL)
    |  T3-E3 (Parsing PLU)      T6-E3 (Encodage PLU)
    |  T5-E3 (Viewer 3D)
    |
  L |  T5-E4 (Structure)        T6-E2 (Rule Engine)
    |  T3-E6 (Servitudes)       T5-E2 (Variantes)
    |  T2-E4 (Sketchpad)        T5-E5 (Plans 2D)
    |                           T6-E7 (Rapport conf.)
    |
  M |  T2-E3 (Vocal)            T4-E1 (Room Solver)
    |  T3-E5 (Risques)          T4-E2 (Emprise)
    |  T6-E6 (RE2020)           T4-E3 (Validation prog.)
    |  T6-E5 (Accessibilite)    T5-E7 (Selection var.)
    |  T7-E4 (Rendus 4K)        T7-E1 (CERFA)
    |  T7-E6 (Signature)        T7-E2 (Notice)
    |                           T7-E3 (Dossier complet)
    |
  S |  T2-E5 (LIDAR upload)     T3-E7 (Rapport terrain)
    |  T3-E4 (DVF)              T1-E4 (Onboarding)
    |  T4-E4 (Ensoleillement)   T2-E1 (Brief texte)
    |  T4-E5 (Estimation)       T2-E2 (Photos)
    |  T5-E6 (Export BIM)       T2-E6 (Brief final)
    |  T7-E5 (Guide depot)      T3-E1 (Parcelle)
    |                           T3-E2 (IGN)
    |
  XS |                            T1-E2 (Auth)
    |                            T1-E3 (Dashboard)
    |                            T1-E5 (Paiement)
    |                            T1-E1 (Landing)
    |
    +-------------------------------------------------------------
      XS     S      M      L      XL         XL+   VALEUR BUSINESS
```

### 7.2 Quadrants detailles

#### Quadrant 1 : Haute Valeur / Risque Faible — "Quick Wins" (Priorite : lancer immediatement)

| Epic | Valeur | Risque | Justification |
|------|--------|--------|---------------|
| T1-E2 | XL | XS | Auth standard, fondation de tout le parcours, valeur critique |
| T1-E4 | L | S | Onboarding = conversion, patterns connus, faible risque tech |
| T2-E1 | L | S | Brief texte = cœur de l'input, formulaire intelligent mais standard |
| T2-E6 | L | XS | Synthese brief = validation utilisateur, logique metier simple |
| T3-E1 | L | XS | Geocodage BAN + cadastre = APIs stables, tres haute valeur |
| T3-E2 | L | S | Donnees IGN = API officielle, pipeline standard |
| T3-E7 | L | S | Rapport terrain = 1er WOW, generation PDF simple |

**Action :** Ces epics peuvent demarrer des le mois 1, equipe reduite suffit.

---

#### Quadrant 2 : Haute Valeur / Haute Risque — "Batailles Strategiques" (Priorite : investiguer + prototype rapidement)

| Epic | Valeur | Risque | Justification |
|------|--------|--------|---------------|
| T5-E1 | XL | XL | Solveur parametrique = cœur differentiant, risque algo/convergence |
| T5-E3 | XL | XL | Viewer 3D = experience cle, risque performance/WebGL |
| T6-E1 | XL | XL | DSL reglementaire = fondation conformite, risque specification |
| T6-E3 | XL | XL | Encodage PLU 10 communes = volume + complexite, risque parsing |
| T5-E2 | L | M | Variantes = satisfaction utilisateur, depend du solveur |

**Action :** Prototype des le mois 1 (spike technique), validation par proof-of-concept avant commitment total. Paralleliser les investigations.

---

#### Quadrant 3 : Valeur Faible / Haute Risque — "A eviter V1" (Priorite : reporter V2)

| Epic | Valeur | Risque | Justification |
|------|--------|--------|---------------|
| T2-E4 | S | L | Sketchpad interactif = UX sympathique mais complexe, pas critique pour DP |
| T2-E5 | S | XL | LIDAR upload = cas limite, rare pour <40m2 |
| T3-E6 | M | L | Servitudes = donnees difficiles a obtenir, cas marginaux |
| T6-E5 | S | M | Accessibilite PMR detaillee = peu d'impact pour petites surfaces |
| T6-E6 | M | M | RE2020 detaillee = obligation mais simplifiable V1 |
| T7-E4 | S | M | Rendus 4K = valorisant mais pas obligatoire pour le PC |
| T7-E6 | S | M | Signature electronique = mairies acceptent signature manuscrite |

**Action :** Reporter en V2. Maintenir dans le backlog avec tag "V2 candidate".

---

#### Quadrant 4 : Valeur Faible / Risque Faible — "Fill-ins" (Priorite : faire entre les epics critiques)

| Epic | Valeur | Risque | Justification |
|------|--------|--------|---------------|
| T1-E1 | S | XS | Landing page = acquisition, pas bloquant pour les 10 PC |
| T1-E5 | M | XS | Paiement = monetisation, mais pas critique pour l'objectif 10 PC |
| T3-E4 | S | S | DVF = indicateur budget, valeur informationnelle |
| T4-E4 | S | S | Ensoleillement basique = qualite, calcul simple |
| T4-E5 | S | S | Estimation budget = indicatif, pas dans le dossier mairie |
| T5-E6 | S | S | Export BIM = preparation V2, pas utile V1 |
| T7-E5 | S | S | Guide depot = facilitation, pas dans le dossier |

**Action :** Inserer dans les sprints quand les epics P0 du chemin critique sont bloquees. Ne pas prioriser avant les Quadrants 1 et 2.

---

### 7.3 Synthese de priorisation

```
Ordre de realisation recommande (par vague) :

VAGUE 1 (Mois 1) : Fondations + Quick Wins
- T8-E1, T8-E2, T8-E3, T8-E4  [Infra + Securite]
- T1-E2, T1-E4                  [Auth + Onboarding]
- T3-E1, T3-E2                  [Parcelle + IGN]
- T2-E1                         [Brief texte]
- SPIKE : T6-E1 (prototype DSL), T5-E1 (proto solveur)

VAGUE 2 (Mois 2-3) : Conformite + Site Intelligence
- T6-E1, T6-E2                  [DSL + Rule Engine]
- T3-E3                         [PLU collecte + parsing]
- T6-E3 (debut), T6-E4          [Encodage PLU + RN]
- T2-E2, T2-E6                  [Photos + Brief final]
- T3-E7                         [Rapport terrain]

VAGUE 3 (Mois 3-5) : Programmation + Conception
- T4-E1, T4-E2, T4-E3           [Programmation + Emprise]
- T5-E1, T5-E2                  [Solveur + Variantes]
- T5-E3                         [Viewer 3D]
- T5-E7                         [Selection variante]
- T6-E3 (fin), T6-E7            [Fin encodage PLU + Rapport conformite]

VAGUE 4 (Mois 5-8) : Livrables + Depot
- T5-E5                         [Plans 2D]
- T7-E1, T7-E2, T7-E3           [CERFA + Notice + Dossier]
- T1-E3 (finalisation)          [Dashboard]
- T7-E5                         [Guide depot]
- Depot des 10 PC

VAGUE 5 (Mois 8-12) : Iteration + Objectif 5 acceptes
- Corrections selon retours mairies
- T8-E5, T8-E6, T8-E7, T8-E8   [Monitoring + Tests + Donnees + Doc]
- T1-E1, T1-E5                  [Landing + Paiement]
- Fill-ins Quadrant 4
```

---

## Annexe A : Glossaire

| Terme | Definition |
|-------|------------|
| **BDTOPO** | Base de donnees topographiques de l'IGN (batiments, routes, hydro...) |
| **CERFA** | Formulaire administratif officiel (13406*07 = Declaration Prealable) |
| **CHA** | Charge Admise — surface prise en compte pour le COS |
| **COS** | Coefficient d'Occupation des Sols — surface construite / surface parcelle |
| **DP** | Declaration Prealable — procedure simplifiee pour travaux < 40m2 |
| **DSL** | Domain Specific Language — langage dedie a un domaine (ici reglementaire) |
| **DVF** | Demandes de Valeurs Fonctionnieres — prix de vente des biens immobiliers |
| **IGN** | Institut Geographique National — fournisseur de donnees geospatiales |
| **LIDAR HD** | Donnees d'elevation haute precision de l'IGN |
| **MOB** | Maison Ossature Bois |
| **MNS/MNT** | Modele Numerique de Surface / de Terrain |
| **PC** | Permis de Construire (ici, Declaration Prealable) |
| **PLU** | Plan Local d'Urbanisme — reglement d'urbanisme de la commune |
| **PMR** | Personne a Mobilite Reduite |
| **PPRN** | Plan de Prevention des Risques Naturels |
| **RE2020** | Reglementation Environnementale 2020 — performance energetique |
| **RNU** | Reglement National d'Urbanisme |
| **SHON/SHAB** | Surface Hors Oeuvre Nette / Surface Habitable |

## Annexe B : Tableau recapitulatif des 52 Epics

| ID | Theme | Nom | Priorite | Estimation | Couches |
|----|-------|-----|----------|------------|---------|
| T1-E1 | T1 | Page d'accueil & Landing | P1 | M | 1, 10 |
| **T1-E2** | **T1** | **Inscription & Authentification** | **P0** | **M** | **1** |
| **T1-E3** | **T1** | **Dashboard Proprietaire** | **P0** | **L** | **1, 10** |
| **T1-E4** | **T1** | **Parcours Onboarding Wizard** | **P0** | **M** | **1** |
| T1-E5 | T1 | Systeme de Paiement | P1 | M | 10 |
| **T2-E1** | **T2** | **Brief Textuel Structure** | **P0** | **M** | **1** |
| **T2-E2** | **T2** | **Upload & Analyse Photos** | **P0** | **L** | **1** |
| T2-E3 | T2 | Capture Vocale | P1 | L | 1 |
| T2-E4 | T2 | Sketchpad Interactif | P2 | XL | 1, 5 |
| T2-E5 | T2 | Upload LIDAR Avance | P2 | XL | 1, 2 |
| **T2-E6** | **T2** | **Validation & Brief Final** | **P0** | **M** | **1, 4** |
| **T3-E1** | **T3** | **Geocodage & Parcelle** | **P0** | **M** | **2** |
| **T3-E2** | **T3** | **Ingestion Donnees IGN** | **P0** | **L** | **2** |
| **T3-E3** | **T3** | **Parsing PLU 10 Communes** | **P0** | **XL** | **2, 6** |
| T3-E4 | T3 | Analyse DVF | P1 | S | 2, 9 |
| T3-E5 | T3 | Analyse Risques | P1 | M | 2, 6, 10 |
| T3-E6 | T3 | Detection Servitudes | P1 | L | 2 |
| **T3-E7** | **T3** | **Rapport Site Intelligence** | **P0** | **M** | **2, 10** |
| **T4-E1** | **T4** | **Programmation Spatiale** | **P0** | **L** | **4** |
| **T4-E2** | **T4** | **Emprise au Sol** | **P0** | **L** | **4, 6** |
| **T4-E3** | **T4** | **Validation Programme** | **P0** | **L** | **4** |
| T4-E4 | T4 | Ensoleillement | P1 | M | 4 |
| T4-E5 | T4 | Estimation Budget | P1 | S | 4, 9 |
| **T5-E1** | **T5** | **Solveur Parametrique V1** | **P0** | **XL** | **5** |
| **T5-E2** | **T5** | **Generateur Variantes** | **P0** | **L** | **5** |
| **T5-E3** | **T5** | **Viewer 3D Interactif** | **P0** | **XL** | **5** |
| T5-E4 | T5 | Structure Simplifiee | P1 | L | 5, 7 |
| **T5-E5** | **T5** | **Plans 2D Complets** | **P0** | **L** | **5, 10** |
| T5-E6 | T5 | Export BIM | P1 | M | 5 |
| **T5-E7** | **T5** | **Selection Variante** | **P0** | **M** | **5** |
| **T6-E1** | **T6** | **DSL Reglementaire** | **P0** | **XL** | **6** |
| **T6-E2** | **T6** | **Rule Engine** | **P0** | **L** | **6** |
| **T6-E3** | **T6** | **Encodage PLU 10 Communes** | **P0** | **XL** | **6, 2** |
| **T6-E4** | **T6** | **Reglement National** | **P0** | **L** | **6** |
| T6-E5 | T6 | Accessibilite PMR | P1 | M | 6 |
| T6-E6 | T6 | RE2020 | P1 | L | 6 |
| **T6-E7** | **T6** | **Rapport Conformite** | **P0** | **M** | **6, 10** |
| T6-E8 | T6 | Fail-Safe & Revision | P1 | M | 6 |
| **T7-E1** | **T7** | **Generateur CERFA** | **P0** | **L** | **10** |
| **T7-E2** | **T7** | **Notice Technique** | **P0** | **M** | **10** |
| **T7-E3** | **T7** | **Dossier Complet** | **P0** | **M** | **10** |
| T7-E4 | T7 | Rendus 4K | P1 | L | 10, 5 |
| T7-E5 | T7 | Guide Depot | P1 | S | 10 |
| T7-E6 | T7 | Signature Electronique | P2 | L | 10 |
| **T8-E1** | **T8** | **Infrastructure Cloud** | **P0** | **L** | **Transverse** |
| **T8-E2** | **T8** | **CI/CD** | **P0** | **M** | **Transverse** |
| **T8-E3** | **T8** | **RBAC** | **P0** | **M** | **Transverse** |
| **T8-E4** | **T8** | **RGPD** | **P0** | **M** | **Transverse** |
| T8-E5 | T8 | Monitoring | P1 | M | Transverse |
| T8-E6 | T8 | Tests Automatises | P1 | L | Transverse |
| T8-E7 | T8 | Ingestion Donnees | P1 | M | 2, 6 |
| T8-E8 | T8 | Documentation | P1 | M | Transverse |

**Total : 52 epics** — 18 P0 | 22 P1 | 12 P2

---

*Document genere le 2025-01-15. Version V1.0 du backlog EDIFIA.*
*Prochaine revision : a la fin de chaque milestone (voir section 5.2)*
*Methode de priorisation : Matrice Risque x Valeur + Chemin Critique (PERT simplifie)*
