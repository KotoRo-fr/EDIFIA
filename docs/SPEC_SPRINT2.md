# EDIFIA — Sprint 2 : Conformité Opérationnelle + Site Intelligence
## SPEC.md | Version 1.0 | Mai 2026

---

## 1. Objectif du Sprint

Transformer le moteur de conformité du prototype (Sprint 1) en moteur opérationnel intégré à l'API, ajouter la couche Site Intelligence (géocodage, données foncières, PLU), et créer l'interface d'évaluation conformité temps réel.

**Livrables concrets** : 
- Conformité : évaluation deterministe end-to-end (projet → règles → résultat)
- Site Intelligence : géocodage BAN, ingestion PLU 10 communes, cache
- Frontend : page conformité opérationnelle, rapport de synthèse
- Backend : routers intégrés DSL, pipeline d'évaluation

---

## 2. Architecture Sprint 2

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPRINT 2 — CONFORMITÉ + TERRAIN              │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│   MODULE A   │   MODULE B   │   MODULE C   │     MODULE D       │
│  Conformité  │   Frontend   │   Site Intel │   Intégration      │
│  Backend+DSL │   (React)    │   (Python)   │   (Tests+Doc)      │
├──────────────┼──────────────┼──────────────┼────────────────────┤
│ - Intégrer   │ - Page conf. │ - Géocodage  │ - Tests E2E        │
│   DSL dans   │   opération- │   BAN        │   conformité       │
│   FastAPI    │   nelle      │ - Ingestion  │ - Tests site intel │
│ - Pipeline   │ - Rapport    │   PLU 10     │ - Integration      │
│   évaluation │   conformité │   communes   │   backend+DSL      │
│ - Audit      │ - Visualisa- │ - Cache      │ - Doc API          │
│   trail      │   tion       │   Redis      │                    │
│ - 50 règles  │ - Score      │ - API IGN    │                    │
│   actives    │   global     │   LIDAR      │                    │
└──────────────┴──────────────┴──────────────┴────────────────────┘
```

---

## 3. Module A : Conformité Backend + DSL (CRITIQUE)

### 3.1 Intégration DSL dans FastAPI

**Nouveau : `app/dsl_integration.py`**
- Initialise le RulesRegistry au démarrage de l'app
- Charge les 50 règles YAML depuis `edifia-dsl/rules/`
- Crée ComplianceEngine singleton
- Fonction `evaluate_project(project_id: UUID, variant_id: Optional[UUID]) → EvaluationReport`

**Nouveau : `app/services/site_intel_service.py`**
- Récupère les données terrain (PLU, parcelle) pour un projet
- Construit ProjectContext pour le moteur DSL
- Cache les résultats en Redis (TTL 1h)

### 3.2 Router Conformité v2 (`app/routers/compliance_v2.py`)

**POST /api/v2/compliance/evaluate/{project_id}**
```json
// Request
{ "variant_id": null }

// Response 200
{
  "project_id": "uuid",
  "variant_id": null,
  "evaluated_at": "2026-05-12T10:30:00Z",
  "summary": {
    "total_rules": 50,
    "passed": 38,
    "failed": 8,
    "warnings": 2,
    "not_applicable": 2,
    "compliance_rate": 76.0
  },
  "results": [
    {
      "rule_code": "URB-COS-001",
      "rule_name": "Coefficient d'Occupation du Sol",
      "category": "urbanisme",
      "status": "pass",
      "message": "Surface au sol (25.0m²) respecte le COS (0.5 → 375.0m² max)",
      "evaluated_values": { "surface_au_sol": 25.0, "cos_max": 0.5, "surface_parcelle": 750.0 },
      "evaluated_at": "2026-05-12T10:30:00Z"
    }
  ],
  "blocking_issues": [...],
  "report_url": null
}
```

**GET /api/v2/compliance/report/{project_id}**
- Retourne le dernier rapport d'évaluation
- Format PDF-ready (HTML structuré)

**GET /api/v2/compliance/rules?category=&zone=&page=**
- Liste paginée des règles avec filtres

**GET /api/v2/compliance/rules/{rule_code}**
- Détail d'une règle avec historique

### 3.3 Router Site Intelligence (`app/routers/site_intel_v2.py`)

**GET /api/v2/site/geocode?address={address}**
```json
{
  "address": "12 rue de la Paix, Tremblay-en-France",
  "coordinates": { "lat": 48.9896, "lng": 2.5701 },
  "parcelle": {
    "cadastre_id": "93073-000-AB-0123",
    "section": "AB",
    "numero": "0123",
    "surface": 750.0,
    "geometry": { "type": "Polygon", "coordinates": [...] }
  },
  "commune": {
    "code": "93073",
    "name": "Tremblay-en-France"
  }
}
```

**GET /api/v2/site/intel/{project_id}**
- Retourne les données terrain agrégées (PLU + parcelle + risques)

**GET /api/v2/site/plu/{commune_code}**
- Retourne les règles PLU pour une commune

### 3.4 Cache & Performance

**`app/services/cache_service.py`**
- Cache Redis pour : données PLU (TTL 24h), données IGN (TTL 7j), évaluations (TTL 1h)
- Clés : `plu:{commune_code}`, `intel:{project_id}`, `eval:{project_id}:{variant_id}`
- Fallback : si Redis down, requête directe (pas de cache)

---

## 4. Module B : Frontend — Pages Conformité + Site Intel

### 4.1 Nouvelle page : Conformité (`src/pages/CompliancePage.tsx`)
- Route : `/compliance/:projectId`
- **Score global** : jauge circulaire (compliance_rate %), couleur selon score
  - >= 90% : emerald | >= 70% : amber | < 70% : red
- **Résumé** : 4 cards (Pass/Fail/Warning/N/A avec counts)
- **Table des résultats** : triable par colonnes
  - Colonnes : Règle | Catégorie | Statut | Message | Détails
  - Filtrage par catégorie (urbanisme, DTU, RE2020, PMR, incendie)
  - Filtrage par statut (pass/fail/warning)
  - Recherche texte
- **Export PDF** : bouton "Télécharger le rapport" (génère HTML pour impression)
- **Bloquant** : section "Problèmes bloquants" en haut si failed sur règle severity=blocking

### 4.2 Nouvelle page : Site Intelligence (`src/pages/SiteIntelPage.tsx`)
- Route : `/site-intel/:projectId`
- **Carte** : visualisation de la parcelle (mock Leaflet/map)
- **Fiche terrain** : 
  - Parcelle : surface, cadastre_id, section, numéro
  - PLU : zone, COS, hauteur max, reculs
  - Risques : GASPAR, PPRN, sismicité
- **Données brutes** : onglet JSON brut pour debug

### 4.3 Mise à jour : ProjectDetailPage
- Onglet "Conformité" : ajouter le score global + bouton "Lancer l'évaluation"
- Onglet "Terrain" : lien vers SiteIntelPage

### 4.4 Composants

**ComplianceGauge** (`src/components/ComplianceGauge.tsx`)
- Jauge circulaire SVG animée
- Props : score (0-100), size, label
- Couleur dynamique selon score

**ComplianceResultsTable** (`src/components/ComplianceResultsTable.tsx`)
- Tableau triable avec @tanstack/react-table
- Pagination, filtres, recherche
- Row expand pour détails des valeurs évaluées

**SiteIntelMap** (`src/components/SiteIntelMap.tsx`)
- Mock carte avec placeholder Parcelle
- Panneau latéral info terrain

---

## 5. Module C : Site Intelligence Service

### 5.1 Service Géocodage

**`app/services/geocoding_service.py`**
- `geocode_address(address: str) → GeocodeResult`
- Mock BAN API (data.gouv.fr/adresse) — retourne coordonnées + parcelle cadastre
- Fallback si API down → cache + approximation

### 5.2 Service PLU

**`app/services/plu_service.py`**
- `get_plu_rules(commune_code: str) → List[PLURule]`
- `parse_plu_document(commune_code: str) → ParsedPLU`
- Mock données PLU pour 10 communes pilotes :
  1. **Tremblay-en-France** (93073) — Zone U, COS 0.5, Hmax 12m
  2. **Aulnay-sous-Bois** (93005) — Zone U, COS 0.6, Hmax 15m
  3. **Sevran** (93071) — Zone U/AU, COS 0.5, Hmax 10m
  4. **Livry-Gargan** (93046) — Zone U, COS 0.5, Hmax 12m
  5. **Le Blanc-Mesnil** (93007) — Zone U, COS 0.7, Hmax 15m
  6. **Villepinte** (93078) — Zone U, COS 0.5, Hmax 10m
  7. **Gonesse** (95277) — Zone AU/U, COS 0.4, Hmax 8m
  8. **Roissy-en-France** (95527) — Zone AU, COS 0.3, Hmax 8m
  9. **Mitry-Mory** (77294) — Zone U, COS 0.5, Hmax 12m
  10. **Villeparisis** (77508) — Zone U, COS 0.6, Hmax 12m

### 5.3 Service Données Foncieres

**`app/services/foncier_service.py`**
- `get_cadastre(lat: float, lng: float) → CadastreInfo`
- `get_ign_data(cadastre_id: str) → IGNData` — LIDAR HD, BDTOPO
- `get_risks(commune_code: str) → RiskData` — GASPAR, PPRN, sismicité
- `get_dvf(commune_code: str) → DVFData` — prix m²
- Cache Redis pour toutes les données

---

## 6. Module D : Tests & Documentation

### 6.1 Tests E2E Conformité
- `test_compliance_e2e.py` : Projet créé → brief → évaluation → résultat valide
- `test_compliance_rules_applicability.py` : Vérifier que seules les règles applicables sont évaluées
- `test_compliance_audit_trail.py` : Traçabilité complète

### 6.2 Tests Site Intelligence
- `test_geocoding.py` : Géocodage adresse → coordonnées
- `test_plu_service.py` : Récupération PLU par commune
- `test_foncier_integration.py` : Flux complet parcelle → données

### 6.3 Documentation API
- Mise à jour OpenAPI/Swagger avec v2 endpoints
- README avec exemples d'appels API

---

## 7. Definition of Done Sprint 2

- [ ] Évaluation conformité end-to-end (projet → 50 règles → résultat détaillé)
- [ ] Score de conformité calculé et affiché
- [ ] Audit trail de chaque évaluation (qui, quand, quoi)
- [ ] Cache Redis pour PLU et évaluations
- [ ] Géocodage adresse → parcelle fonctionnel (mock BAN)
- [ ] PLU des 10 communes pilotes ingéré
- [ ] Page conformité opérationnelle (score, table, filtres, export)
- [ ] Page site intelligence (fiche terrain, données PLU)
- [ ] Tests E2E conformité (> 80% coverage)
- [ ] Tests site intelligence (> 80% coverage)
- [ ] Documentation API à jour
