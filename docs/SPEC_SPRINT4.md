# EDIFIA — Sprint 4 : Production de Livrables (Couche 10)
## SPEC.md | Mai 2026

---

## 1. Objectif

Produire les documents réglementaires finaux à partir d'un projet validé : CERFA auto-rempli,
notice de calcul, rapport de conformité, plans architecturaux, et pack de soumission complet.

---

## 2. Architecture

```
PROJET VALIDE (variante selectionnee + conformite OK)
  |
  v
[DOCUMENT GENERATORS]
  |-- CERFA Generator : formulaire CERFA 13406*05 rempli automatiquement
  |-- NoticeCalcul Generator : calculs structures + thermiques + conformite
  |-- RapportConformite Generator : synthese des verifications
  |-- PlansPDF Generator : plans 2D en mise en page A3
  |-- PackDepot Generator : assemblage documents pour mairie
  |
  v
DOCUMENTS (HTML pour impression + telechargement ZIP simule)
```

---

## 3. Frontend — Pages & Composants

### 3.1 DeliverablesPage (`src/pages/DeliverablesPage.tsx`)
- Route : `/deliverables/:projectId`
- Dashboard des documents produits pour un projet
- 5 cards de documents avec statut (genere/en attente)
- Bouton "Generer tous les documents" (lance generation parallele)
- Barre de progression globale
- Bouton telechargement par document (HTML print-ready)
- Resume : projet, variante, score conformite, date generation

### 3.2 CerfaViewer (`src/components/deliverables/CerfaViewer.tsx`)
Visualisation du CERFA rempli :
- Reproduction HTML du formulaire CERFA 13406*05
- Sections : identification projet, parcelle, descriptions travaux, architecte, surface
- Donnees pre-remplies depuis le projet (adresse, surface, type)
- Style : bordures noires comme formulaire officiel, typo monospace
- Bouton "Imprimer / PDF" (window.print())

### 3.3 NoticeCalculViewer (`src/components/deliverables/NoticeCalculViewer.tsx`)
Notice de calcul complete :
- Calculs structures (portees, sections, charges)
- Calculs thermiques (RT2012/RE2020, Bbio, CEP)
- Verifications reglementaires (PMR, incendie)
- Tableaux avec valeurs et resultats
- Conclusions pour chaque section

### 3.4 RapportConformiteViewer (`src/components/deliverables/RapportConformiteViewer.tsx`)
Rapport de conformite detaille :
- Page de garde (projet, date, reference)
- Sommaire
- Rappel reglementaire par categorie
- Resultats detailles (tableau : regle, critere, resultat, conforme/non)
- Conclusion et reserves
- Signature

### 3.5 PlansPDFViewer (`src/components/deliverables/PlansPDFViewer.tsx`)
Mise en page des plans pour impression A3 :
- Plan de situation
- Plan de masse
- Plans de niveau (RDC, etage)
- Coupe transversale
- Legendre complete
- Echelle 1:100

---

## 4. Backend — Routers

### 4.1 `app/routers/deliverables.py`
- GET `/api/v1/deliverables/{project_id}` → liste documents et status
- POST `/api/v1/deliverables/generate/{project_id}` → genere tous les documents
- GET `/api/v1/deliverables/{project_id}/cerfa` → HTML CERFA
- GET `/api/v1/deliverables/{project_id}/notice` → HTML notice
- GET `/api/v1/deliverables/{project_id}/rapport` → HTML rapport conformite
- GET `/api/v1/deliverables/{project_id}/plans` → HTML plans

---

## 5. Session de Test
Apres build, tester systematiquement :
1. Landing → Login → Dashboard (flux complet)
2. Chaque page de l'app (11 pages)
3. Flux projet : creation → brief → programmation → conception → conformite → livrables
4. Coherence visuelle (couleurs, typographie, layout)
5. Fonctionnalites interactives (viewer 3D, comparateur, timeline)
6. Mobile/responsive
