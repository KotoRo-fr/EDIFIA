# EDIFIA — Sprint 5 : Corrections, Polish & Tests E2E
## SPEC.md | Mai 2026

---

## 1. Objectifs

1. **Corriger les bugs** des pages S2 (Conformite, SiteIntel) et S4 (Livrables)
2. **Ajouter les liens manquants** (Livrables dans sidebar, page projet)
3. **Polish UX** (animations, feedback, responsive)
4. **Tests E2E** avec Playwright

---

## 2. Bugs identifiés en S4

### Bug 1 : Pages S2/S4 timeout (CRITIQUE)
**Symptome** : Les pages Conformite, SiteIntel et Livrables ne rendent pas correctement.
**Cause probable** : Boucles infinies dans les hooks useEffect/useMemo dues a des dependances mal definies ou des appels API mock asynchrones qui bouclent.
**Fichiers concernes** : CompliancePage.tsx, SiteIntelPage.tsx, DeliverablesPage.tsx

### Bug 2 : Lien Livrables manquant (MOYEN)
**Symptome** : Pas d'acces direct aux livrables depuis la sidebar ni depuis la page projet.
**Fichiers concernes** : Sidebar.tsx, ProjectDetailPage.tsx

### Bug 3 : Donnees mock non coherentes (FAIBLE)
**Symptome** : Certains composants attendent des structures de donnees differentes de ce que les mocks fournissent.
**Fichiers concernes** : complianceData.ts, api.ts

---

## 3. Module A : Corrections de Bugs

### 3.1 CompliancePage.tsx — Refonte
- Simplifier les hooks (enlever les useEffect complexes)
- Utiliser directement les mocks sans appel async
- Structure : score gauge + cards resume + table results statique
- Pas de boucle, pas d'appel API

### 3.2 SiteIntelPage.tsx — Refonte
- Meme principe : donnees statiques directement depuis les mocks
- Pas d'appel API, pas de useEffect complexe
- Carte placeholder + fiche PLU + risques

### 3.3 DeliverablesPage.tsx — Refonte
- Donnees statiques pour les 4 documents
- Tabs pour chaque document viewer
- Pas de boucle de rendu

### 3.4 Sidebar.tsx — Ajout lien Livrables
- Ajouter "Livrables" avec icone FileText dans le menu
- Lien vers /deliverables (liste des livrables du dernier projet)

### 3.5 ProjectDetailPage.tsx — Ajout lien
- Dans l'onglet Programme ou Vue d'ensemble : bouton "Voir les livrables"

---

## 4. Module B : Polish UX

### 4.1 Animations de transition
- Framer Motion pour les transitions de page (fade in)
- Animations sur les cards (hover lift)
- Loading skeletons sur les pages lourdes

### 4.2 Feedback utilisateur
- Toast notifications (sonner) pour les actions (succes, erreur)
- Etats de chargement sur les boutons d'action
- Confirmation dialogs pour les actions destructrices

### 4.3 Responsive mobile
- Sidebar devient bottom nav sur mobile
- Grille de projets : 1 colonne sur mobile
- Tables scrollables horizontalement
- Typography adaptee

### 4.4 Accessibilite
- ARIA labels sur les composants interactifs
- Focus visible
- Contraste couleurs verifie

---

## 5. Module C : Tests E2E Playwright

### 5.1 Configuration
- playwright.config.ts
- Setup : lancement serveur dev, base URL

### 5.2 Scenarios de test
- `auth.spec.ts` : login, acces page protegee, logout
- `project-flow.spec.ts` : creation projet → brief → programmation → conception → conformite
- `navigation.spec.ts` : sidebar, routing, 404
- `compliance.spec.ts` : evaluation conformite, table results
- `deliverables.spec.ts` : generation documents, viewers

---

## 6. Definition of Done
- [ ] CompliancePage rend correctement (score, table, filtres)
- [ ] SiteIntelPage rend correctement (carte, PLU, risques)
- [ ] DeliverablesPage rend correctement (4 documents, tabs, viewers)
- [ ] Sidebar a lien Livrables
- [ ] ProjectDetailPage a lien vers livrables
- [ ] Animations de page fonctionnent
- [ ] Toast notifications sur les actions cles
- [ ] Responsive mobile verifie
- [ ] 5+ tests E2E passent
- [ ] Build TypeScript 0 erreur
