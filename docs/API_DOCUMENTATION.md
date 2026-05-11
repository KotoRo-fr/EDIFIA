# Documentation API EDIFIA v2

## Version 2.0.0 | Mai 2026

---

## Sommaire

1. [Introduction](#1-introduction)
2. [Configuration](#2-configuration)
3. [Authentification](#3-authentification)
4. [Endpoints Conformite](#4-endpoints-conformite)
5. [Endpoints Site Intelligence](#5-endpoints-site-intelligence)
6. [Modeles de Donnees](#6-modeles-de-donnees)
7. [Codes d'Erreur](#7-codes-derreur)
8. [Exemples d'Appels](#8-exemples-dappels)
9. [Swagger UI](#9-swagger-ui)

---

## 1. Introduction

L'API EDIFIA v2 fournit les services backend pour la plateforme de conformite reglementaire et d'analyse de terrain. Elle est construite avec FastAPI et expose des endpoints REST JSON.

**URL de base** : `http://localhost:8000`

**Headers requis** :
```
Content-Type: application/json
Accept: application/json
```

---

## 2. Configuration

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Lancement

```bash
cd backend/app
uvicorn main:app --reload --port 8000
```

### Tests

```bash
cd backend
pytest tests/ -v
```

---

## 3. Authentification

> **Note** : L'authentification sera implementee au Sprint 3. Les endpoints v2 sont actuellement accessibles sans authentification.

---

## 4. Endpoints Conformite

### 4.1 POST `/api/v2/compliance/evaluate/{project_id}`

Evalue un projet contre les 50 regles de conformite.

**Parametres de chemin** :
| Nom | Type | Description |
|-----|------|-------------|
| project_id | string | Identifiant du projet |

**Body** :
```json
{
  "variant_id": null
}
```

**Reponse 200** :
```json
{
  "project_id": "test-proj-1",
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
      "message": "Regle URB-COS-001 respectee",
      "evaluated_values": {"cos_max": 0.5},
      "evaluated_at": "2026-05-12T10:30:00Z"
    }
  ],
  "blocking_issues": [...],
  "report_url": null
}
```

**Statuts possibles** : `pass`, `fail`, `warning`, `not_applicable`

---

### 4.2 GET `/api/v2/compliance/report/{project_id}`

Retourne le dernier rapport d'evaluation pour un projet.

**Parametres de chemin** :
| Nom | Type | Description |
|-----|------|-------------|
| project_id | string | Identifiant du projet |

**Reponse 200** : Meme format que POST evaluate

**Reponse 404** :
```json
{"detail": "Rapport non trouve pour ce projet"}
```

---

### 4.3 GET `/api/v2/compliance/rules`

Liste paginee des regles avec filtres.

**Parametres de requete** :
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| category | string | Non | Filtrer par categorie (urbanisme, dtu, re2020, pmr, incendie) |
| zone | string | Non | Filtrer par zone applicable |
| page | int | Non | Numero de page (defaut: 1) |
| limit | int | Non | Taille de page (defaut: 50, max: 100) |

**Reponse 200** :
```json
{
  "total": 50,
  "page": 1,
  "limit": 50,
  "rules": [
    {
      "code": "URB-COS-001",
      "name": "Coefficient d'Occupation du Sol",
      "category": "urbanisme",
      "description": "Verifie que le COS n'est pas depasse",
      "severity": "blocking",
      "applicable_zones": ["U", "AU"],
      "parameters": {"cos_max": 0.5},
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-04-01T00:00:00Z"
    }
  ]
}
```

---

### 4.4 GET `/api/v2/compliance/rules/{rule_code}`

Retourne le detail d'une regle.

**Parametres de chemin** :
| Nom | Type | Description |
|-----|------|-------------|
| rule_code | string | Code de la regle (ex: URB-COS-001) |

**Reponse 200** : Objet RuleDetail

**Reponse 404** :
```json
{"detail": "Regle NONEXISTENT non trouvee"}
```

---

## 5. Endpoints Site Intelligence

### 5.1 GET `/api/v2/site/geocode`

Geocode une adresse et retourne les coordonnees + parcelle.

**Parametres de requete** :
| Nom | Type | Requis | Description |
|-----|------|--------|-------------|
| address | string | Oui | Adresse a geocoder |

**Reponse 200** :
```json
{
  "address": "12 rue de la Paix, Tremblay-en-France",
  "coordinates": {
    "lat": 48.9896,
    "lng": 2.5701
  },
  "parcelle": {
    "cadastre_id": "93073-000-AB-0123",
    "section": "AB",
    "numero": "0123",
    "surface": 750.0,
    "geometry": {
      "type": "Polygon",
      "coordinates": [...]
    }
  },
  "commune": {
    "code": "93073",
    "name": "Tremblay-en-France"
  }
}
```

---

### 5.2 GET `/api/v2/site/intel/{project_id}`

Retourne les donnees terrain agregees (PLU + parcelle + risques).

**Parametres de chemin** :
| Nom | Type | Description |
|-----|------|-------------|
| project_id | string | Identifiant du projet |

**Reponse 200** :
```json
{
  "project_id": "test-proj-1",
  "parcelle": {
    "cadastre_id": "93073-000-AB-0123",
    "section": "AB",
    "numero": "0123",
    "surface": 750.0,
    "geometry": {...}
  },
  "plu": {
    "zone": "U",
    "cos": 0.5,
    "hauteur_max": 12.0,
    "reculs_voirie": 3.0,
    "reculs_limitrophe": 1.5,
    "emprise_max": 375.0
  },
  "risques": {
    "gaspar": ["inondation", "secheresse"],
    "pprn": "PPRN-93-01",
    "sismicite": "1 - tres faible"
  },
  "dvf": {
    "prix_m2_moyen": 3850.0,
    "prix_m2_med": 3600.0,
    "annee": 2025
  }
}
```

---

### 5.3 GET `/api/v2/site/plu/{commune_code}`

Retourne les regles PLU pour une commune.

**Parametres de chemin** :
| Nom | Type | Description |
|-----|------|-------------|
| commune_code | string | Code INSEE de la commune |

**Reponse 200** :
```json
{
  "zone": "U",
  "cos": 0.5,
  "hauteur_max": 12.0,
  "reculs_voirie": 3.0,
  "reculs_limitrophe": 1.5,
  "emprise_max": 375.0
}
```

**Communes pilotes** :
| Code | Commune | Zone | COS | Hmax |
|------|---------|------|-----|------|
| 93073 | Tremblay-en-France | U | 0.5 | 12m |
| 93005 | Aulnay-sous-Bois | U | 0.6 | 15m |
| 93071 | Sevran | U/AU | 0.5 | 10m |
| 93046 | Livry-Gargan | U | 0.5 | 12m |
| 93007 | Le Blanc-Mesnil | U | 0.7 | 15m |
| 93078 | Villepinte | U | 0.5 | 10m |
| 95277 | Gonesse | AU/U | 0.4 | 8m |
| 95527 | Roissy-en-France | AU | 0.3 | 8m |
| 77294 | Mitry-Mory | U | 0.5 | 12m |
| 77508 | Villeparisis | U | 0.6 | 12m |

---

## 6. Modeles de Donnees

### ComplianceSummary
| Champ | Type | Description |
|-------|------|-------------|
| total_rules | int | Nombre total de regles evaluees |
| passed | int | Nombre de regles OK |
| failed | int | Nombre de regles en echec |
| warnings | int | Nombre d'avertissements |
| not_applicable | int | Nombre de regles non applicables |
| compliance_rate | float | Pourcentage de conformite (0-100) |

### ComplianceResult
| Champ | Type | Description |
|-------|------|-------------|
| rule_code | string | Code de la regle |
| rule_name | string | Nom de la regle |
| category | string | Categorie (urbanisme, dtu, re2020, pmr, incendie) |
| status | string | pass / fail / warning / not_applicable |
| message | string | Message de detail |
| evaluated_values | object | Valeurs evaluees |
| evaluated_at | string | Date ISO 8601 |

### RuleDetail
| Champ | Type | Description |
|-------|------|-------------|
| code | string | Code unique de la regle |
| name | string | Nom de la regle |
| category | string | Categorie |
| description | string | Description |
| severity | string | blocking / warning / info |
| applicable_zones | string[] | Zones applicables |
| parameters | object | Parametres de la regle |

### PLUData
| Champ | Type | Description |
|-------|------|-------------|
| zone | string | Zone PLU (U, AU, U/AU, AU/U) |
| cos | float | Coefficient d'Occupation du Sol |
| hauteur_max | float | Hauteur maximale (m) |
| reculs_voirie | float | Recul voirie (m) |
| reculs_limitrophe | float | Recul limitrophe (m) |
| emprise_max | float | Emprise maximale (m2) |

---

## 7. Codes d'Erreur

| Code HTTP | Signification | Cause |
|-----------|---------------|-------|
| 200 | OK | Succes |
| 400 | Bad Request | Parametre invalide |
| 404 | Not Found | Ressource inexistante |
| 422 | Unprocessable Entity | Validation Pydantic |
| 500 | Internal Server Error | Erreur serveur |

---

## 8. Exemples d'Appels

### cURL - Evaluation conformite

```bash
curl -X POST "http://localhost:8000/api/v2/compliance/evaluate/mon-projet-123" \
  -H "Content-Type: application/json" \
  -d '{"variant_id": null}'
```

### cURL - Liste des regles

```bash
curl "http://localhost:8000/api/v2/compliance/rules?category=urbanisme&limit=10"
```

### cURL - Detail d'une regle

```bash
curl "http://localhost:8000/api/v2/compliance/rules/URB-COS-001"
```

### cURL - Geocodage

```bash
curl "http://localhost:8000/api/v2/site/geocode?address=12+rue+de+la+Paix"
```

### cURL - Donnees terrain

```bash
curl "http://localhost:8000/api/v2/site/intel/mon-projet-123"
```

### cURL - PLU commune

```bash
curl "http://localhost:8000/api/v2/site/plu/93073"
```

### Python - Exemple complet

```python
import requests

BASE = "http://localhost:8000"

# Evaluer un projet
resp = requests.post(f"{BASE}/api/v2/compliance/evaluate/proj-123", json={})
print(resp.json()["summary"])

# Geocoder une adresse
resp = requests.get(f"{BASE}/api/v2/site/geocode?address=12+rue+de+la+Paix")
print(resp.json()["coordinates"])
```

### JavaScript - Exemple complet

```javascript
// Evaluer un projet
const evaluate = async (projectId) => {
  const resp = await fetch(`/api/v2/compliance/evaluate/${projectId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variant_id: null })
  });
  return await resp.json();
};

// Geocoder
const geocode = async (address) => {
  const resp = await fetch(`/api/v2/site/geocode?address=${encodeURIComponent(address)}`);
  return await resp.json();
};
```

---

## 9. Swagger UI

La documentation interactive est disponible a l'adresse :

```
http://localhost:8000/docs
```

---

## Changelog

### v2.0.0 (Mai 2026)
- Ajout endpoints conformite v2 (evaluate, report, rules)
- Ajout endpoints Site Intelligence (geocode, intel, plu)
- 50 regles de conformite actives
- 10 communes pilotes avec PLU
- Mock geocodage BAN

---

*EDIFIA - Plateforme de conformite reglementaire*
