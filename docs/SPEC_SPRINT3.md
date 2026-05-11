# EDIFIA — Sprint 3 : Conception Generative (Couches 4+5)
## SPEC.md | Version 1.0 | Mai 2026

---

## 1. Objectif

Implementer les couches 4 (Programmation Architecturale) et 5 (Conception Generative) du moteur EDIFIA. A partir d'un brief valide, generer automatiquement un programme spatial, calculer l'emprise au sol, produire 2-4 variantes architecturales en plan 2D, et les visualiser en 3D interactif.

---

## 2. Architecture

```
BRIEF VALIDE (pieces, surfaces, contraintes, preferences)
  |
  v
[COUCHE 4 — PROGRAMMATION]
  |-- Room Solver : placement logique des pieces (adjacences, circulations)
  |-- Footprint Generator : calcul emprise au sol max (PLU → enveloppe)
  |-- Sun Analysis : orientation recommandee par piece
  |-- Budget Estimator : estimation cout construction
  |
  v
PROGRAMME ARCHITECTURAL (surfaces CAO/CHA/circulation, emprise, ensoleillement)
  |
  v
[COUCHE 5 — CONCEPTION GENERATIVE]
  |-- Solver Parametrique : placement geometrique 2D des pieces dans l'enveloppe
  |-- Variant Generator : 4 strategies (max surface, ensoleillement, cout, esthetique)
  |-- Conformity Checker : validation de chaque variante par le moteur reglementaire
  |-- 3D Viewer : visualisation interactive (Three.js / React Three Fiber)
  |
  v
VARIANTES (2-4 plans 2D/3D + score conformite par variante)
```

---

## 3. Module A : Moteur Programmation (TypeScript)

### 3.1 Room Solver (`src/lib/solver/roomSolver.ts`)

Algorithme de programmation spatiale a partir du brief :

**Input** : Brief (pieces avec type/surface/orientation/priorite) + contraintes terrain
**Output** : Programme spatial (liste espaces, surfaces CAO/CHA/circulation, graphe adjacence)

**Regles architecturales encodees** :
- Cuisine doit etre adjacente au salon/sejour
- Chambre parentale doit avoir salle de bain adjacente
- WC doit etre accessible depuis la circulation principale
- Piece de vie orientee sud/ouest prioritaire
- Surface circulation = 15-20% surface habitable
- Minimum 1 entree principale

**Algorithm** :
1. Classement des pieces par priorite
2. Placement de la piece principale (salon/sejour) centree
3. Placement des pieces satellites selon regles d'adjacence
4. Generation des circulations (couloirs/coursives)
5. Verification ratios surface
6. Attribution orientations selon contraintes

### 3.2 Footprint Generator (`src/lib/solver/footprintGenerator.ts`)

**Input** : Donnees PLU (COS, CES, hauteur max, reculs) + parcelle
**Output** : Enveloppe constructible 2D (rectangle max dans la parcelle avec reculs)

**Calcul** :
```
Emprise max = COS x Surface parcelle
Recul voie = PLU.setbacks.front (3.0m)
Recul lateral = PLU.setbacks.side (1.5m)  
Recul fond = PLU.setbacks.rear (3.0m)
Hauteur max = PLU.height_max (12.0m)

Enveloppe = Rectangle(
  x = recul_voie,
  y = recul_lateral,
  width = parcelle.width - recul_voie - recul_fond,
  height = parcelle.depth - 2 * recul_lateral,
  max_height = hauteur_max
)
```

### 3.3 Sun Analysis (`src/lib/solver/sunAnalysis.ts`)

**Input** : Coordonnees parcelle + programme spatial
**Output** : Recommandations d'orientation par piece

**Regles** :
- Sejour/salon : sud ou ouest (ensoleillement max)
- Chambre : est (soleil matinal)
- Cuisine : nord (pas de surchauffe)
- Bureau : nord ou est (lumiere douce)
- Salle de bain : sud (chaleur)

Score par orientation : +2 optimal, +1 acceptable, 0 neutre, -1 a eviter

### 3.4 Budget Estimator (`src/lib/solver/budgetEstimator.ts`)

**Input** : Programme spatial (surface, materiaux, type)
**Output** : Fourchette cout construction (bas/haut/moyen)

**Prix m2** (France metropolitaine 2026) :
- Extension bois : 1 800-2 500 EUR/m2
- Extension traditionnelle : 2 200-3 200 EUR/m2
- MOB ossature bois : 1 600-2 400 EUR/m2
- MOB traditionnelle : 2 000-3 000 EUR/m2
- Surélévation : 2 500-3 800 EUR/m2

---

## 4. Module B : Solveur Conception Generative (TypeScript)

### 4.1 Parametric Solver (`src/lib/solver/parametricSolver.ts`)

Algorithme de placement geometrique 2D (bin packing contraint) :

**Input** : Programme spatial + enveloppe constructible
**Output** : Plan 2D (position + dimensions de chaque piece)

**Strategies de placement** :
1. **Linear** : pieces en ligne le long du mur principal
2. **L-shaped** : piece principale en L, satellites dans le creux
3. **Central** : piece principale centree, pieces autour
4. **U-shaped** : 3 pieces en U avec patio central

**Contraintes** :
- Chaque piece dans l'enveloppe
- 10cm minimum entre pieces (cloison)
- Circulation 90cm minimum
- Ouvertures sur facade principale
- Portes ne se croisent pas

### 4.2 Variant Generator (`src/lib/solver/variantGenerator.ts`)

**Input** : Programme + enveloppe
**Output** : 2-4 variantes avec strategies differentes

**Strategies** :
1. **Maximisation surface** (A) : maximise surface habitable, minimise circulation
2. **Optimisation ensoleillement** (B) : priorise orientation sud/ouest pour les pieces de vie
3. **Minimisation cout** (C) : forme compacte, moins de murs peripheriques
4. **Esthetique** (D) : forme architecturale, proportions dorees

Chaque variante = plan 2D + score par critere + score conformite

---

## 5. Module C : Visualisateur 3D (Three.js / R3F)

### 5.1 Viewer 3D (`src/components/Viewer3D.tsx`)

Visualisation interactive des plans avec React Three Fiber :

**Features** :
- Vue plan 2D (dessus) + vue 3D isometrique
- Pieces colorees par type (chambre=bleu, salon=vert, cuisine=orange, SDB=cyan)
- Zoom / pan / rotate (orbit controls)
- Hover : tooltip avec nom + surface de la piece
- Click sur piece : highlight + details
- Toggle : pieces labels ON/OFF, murs transparents
- Dimensions affichees (longueur x largeur)

**Scene** :
- Sol : plan gris clair avec grid
- Murs : extrusion 2.8m hauteur, couleur blanche
- Pieces : surfaces colorees avec opacite 0.3
- Labels : texte flottant au centre de chaque piece
- Parcelle : contour rouge pointille
- Enveloppe : contour vert

### 5.2 Plan 2D Viewer (`src/components/Plan2DViewer.tsx`)

Vue plan SVG simple + rapide :
- Pieces comme rectangles colores
- Murs en lignes epaisses
- Portes en arcs
- Dimensions annotées
- Echelle : 1:100

### 5.3 Variant Comparison (`src/components/VariantComparison.tsx`)

Comparaison cote-a-cote des variantes :
- 2x2 grille (4 variants)
- Chaque cellule : plan 2D miniature + scores
- Selection : click pour agrandir
- Details : surface, ratio, orientation, cout estime

---

## 6. Module D : Frontend Pages + Backend

### 6.1 Nouvelles Pages

**ProgrammingPage** (`src/pages/ProgrammingPage.tsx`) :
- Route : `/programming/:projectId`
- Input : brief valide
- Output : programme architectural
- Sections : pieces programmees, graphe adjacence, emprise au sol, ensoleillement, estimation budget
- Bouton "Generer les variantes"

**DesignPage** (`src/pages/DesignPage.tsx`) :
- Route : `/design/:projectId`
- Input : programme
- Output : 2-4 variantes
- Sections : comparateur variantes, viewer 3D, details par variante
- Bouton "Valider la variante" + "Relancer"

### 6.2 Backend Updates

**`app/routers/programming.py`** :
- POST `/api/v1/programming/generate/{project_id}` → genere programme
- GET `/api/v1/programming/{project_id}` → recupere programme

**`app/routers/design.py`** :
- POST `/api/v1/design/generate/{project_id}` → genere variantes
- GET `/api/v1/design/{project_id}` → liste variantes
- POST `/api/v1/design/select/{project_id}/{variant_id}` → valide variante

### 6.3 Modeles

**ProgrammingResult** (nouveau model) :
- project_id, rooms_programmed (JSON), adjacency_graph (JSON), footprint (JSON), sun_analysis (JSON), budget_estimate (JSON), status

**DesignVariant** (nouveau model) :
- project_id, name (A/B/C/D), strategy, floor_plan (JSON), scores (JSON), conformity_status, is_selected

---

## 7. Definition of Done Sprint 3

- [ ] Room Solver : placement logique pieces avec regles architecturales
- [ ] Footprint Generator : calcul emprise au sol depuis PLU
- [ ] Sun Analysis : orientation recommandee par piece
- [ ] Budget Estimator : fourchette cout construction
- [ ] Parametric Solver : placement geometrique 2D (bin packing)
- [ ] Variant Generator : 4 strategies (surface/ensoleillement/cout/esthetique)
- [ ] Viewer 3D : R3F avec orbit controls, hover, labels
- [ ] Plan 2D : vue SVG avec dimensions
- [ ] Page Programmation : programme complet avec graphe adjacence
- [ ] Page Conception : comparateur variantes + viewer 3D
- [ ] Backend routers programming + design
- [ ] 20+ tests solver
