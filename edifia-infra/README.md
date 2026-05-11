# EDIFIA — Infrastructure Sprint 1

Infrastructure cloud-native, securisee et scalable pour la plateforme EDIFIA (Evaluation Digitale de l'Ingenierie et de la FAisabilite en Infrastructures et Amenagements).

---

## Table des matieres

- [Architecture](#architecture)
- [Prerequis](#prerequis)
- [Demarrage rapide](#demarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Variables d'environnement](#variables-denvironnement)
- [Acces aux services](#acces-aux-services)
- [Kubernetes](#kubernetes)
- [Monitoring](#monitoring)
- [CI/CD](#cicd)
- [Securite](#securite)
- [Troubleshooting](#troubleshooting)

---

## Architecture

```
                    +-----------------+
                    |   Ingress Nginx  |
                    |  edifia.local   |
                    +--------+--------+
                             |
              +--------------+--------------+
              |                             |
     +--------v--------+         +----------v---------+
     |  Frontend (SPA) |         |   Backend (API)    |
     |    Nginx:80     |         |  FastAPI:8000      |
     |   React/Vite    |<------->|   Python 3.12      |
     |   2 replicas    |         |   2-10 replicas    |
     +--------+--------+         +----------+---------+
                                              |
                                    +---------+---------+
                                    |                   |
                           +--------v------+   +--------v-----+
                           |  PostgreSQL   |   |    Redis     |
                           |  PostGIS 16   |   |   Cache      |
                           |  1 replica    |   |   1 replica  |
                           +---------------+   +--------------+
                                    |
                           +--------v--------+
                           |   Prometheus    |
                           |   Grafana       |
                           +-----------------+
```

### Stack technique

| Composant   | Technologie                        | Version |
|-------------|------------------------------------|---------|
| Frontend    | React + Vite + Nginx               | Node 20 |
| Backend     | FastAPI + Uvicorn                  | Python 3.12 |
| Database    | PostgreSQL + PostGIS               | 16-3.4  |
| Cache       | Redis                              | 7-alpine |
| Proxy       | Nginx Ingress Controller           | latest  |
| Monitoring  | Prometheus                         | v2.55   |
| Dashboards  | Grafana                            | v11.0   |
| CI/CD       | GitLab CI                          | -       |
| Securite    | Trivy (scan)                       | latest  |

---

## Prerequis

### Environnement local (docker-compose)

- Docker >= 24.0
- Docker Compose >= 2.20
- 4 GB RAM minimum
- 10 GB espace disque

### Environnement Kubernetes

- Kubernetes >= 1.28
- kubectl configure
- nginx-ingress controller installe
- Metrics Server (pour le HPA)
- Helm (optionnel)

---

## Demarrage rapide

### Local (docker-compose)

```bash
# Cloner le projet
cd edifia-infra

# Deploiement complet
./scripts/deploy-local.sh

# Ou manuellement
docker-compose -f docker/docker-compose.yml up -d --build

# Initialiser la base de donnees
DB_PASSWORD=edifia_secret ./scripts/init-db.sh
```

### Kubernetes

```bash
# 1. Creer le namespace et les ressources de base
kubectl apply -f kubernetes/namespace.yml
kubectl apply -f kubernetes/configmap.yml
kubectl apply -f kubernetes/secret.yml

# 2. Deployer la base de donnees
kubectl apply -f kubernetes/postgres-pvc.yml
kubectl apply -f kubernetes/postgres-deployment.yml
kubectl apply -f kubernetes/postgres-service.yml

# 3. Deployer Redis
kubectl apply -f kubernetes/redis-deployment.yml
kubectl apply -f kubernetes/redis-service.yml

# 4. Deployer le backend et le frontend
kubectl apply -f kubernetes/backend-deployment.yml
kubectl apply -f kubernetes/backend-service.yml
kubectl apply -f kubernetes/backend-hpa.yml
kubectl apply -f kubernetes/frontend-deployment.yml
kubectl apply -f kubernetes/frontend-service.yml

# 5. Deployer l'ingress
kubectl apply -f kubernetes/ingress.yml

# 6. Verifier le deploiement
kubectl get all -n edifia
```

---

## Structure du projet

```
edifia-infra/
├── docker/
│   ├── Dockerfile.backend          # Multi-stage Python/FastAPI
│   ├── Dockerfile.frontend         # Multi-stage React/Nginx
│   └── docker-compose.yml          # Stack local de dev
├── kubernetes/
│   ├── namespace.yml               # Namespace edifia
│   ├── configmap.yml               # Variables non sensibles
│   ├── secret.yml                  # Secrets (base64)
│   ├── postgres-pvc.yml            # Volume 10Gi PostgreSQL
│   ├── postgres-deployment.yml     # PostGIS 16-3.4
│   ├── postgres-service.yml        # ClusterIP:5432
│   ├── redis-deployment.yml        # Redis 7-alpine
│   ├── redis-service.yml           # ClusterIP:6379
│   ├── backend-deployment.yml      # FastAPI (2 replicas)
│   ├── backend-service.yml         # ClusterIP:8000
│   ├── backend-hpa.yml             # HPA 2-10 replicas
│   ├── frontend-deployment.yml     # Nginx (2 replicas)
│   ├── frontend-service.yml        # ClusterIP:80
│   └── ingress.yml                 # Ingress Nginx
├── monitoring/
│   ├── prometheus-config.yml       # Scraping configuration
│   ├── prometheus-deployment.yml   # Prometheus v2.55
│   ├── prometheus-service.yml      # ClusterIP:9090
│   ├── grafana-deployment.yml      # Grafana 11.0
│   ├── grafana-service.yml         # ClusterIP:3000
│   ├── grafana-dashboard-api.json  # Dashboard API Metrics
│   ├── grafana-dashboard-compliance.json # Dashboard Conformite
│   ├── grafana-dashboard-business.json # Dashboard Business
│   └── alerting-rules.yml          # Regles d'alerting
├── cicd/
│   └── .gitlab-ci.yml              # Pipeline CI/CD
├── scripts/
│   ├── init-db.sh                  # Initialisation DB
│   └── deploy-local.sh             # Deploy local
└── README.md                       # Ce fichier
```

---

## Variables d'environnement

### Base de donnees

| Variable        | Description              | Defaut       |
|-----------------|--------------------------|--------------|
| POSTGRES_USER   | Utilisateur PostgreSQL   | edifia       |
| POSTGRES_PASSWORD | Mot de passe DB         | edifia_secret |
| POSTGRES_DB     | Nom de la base           | edifia       |
| DB_HOST         | Host PostgreSQL          | postgres     |

### Backend

| Variable      | Description                | Defaut                        |
|---------------|----------------------------|-------------------------------|
| DATABASE_URL  | URL de connexion DB        | postgresql+asyncpg://...      |
| REDIS_URL     | URL de connexion Redis     | redis://redis:6379/0          |
| SECRET_KEY    | Cle JWT                    | (a changer en production)     |
| LOG_LEVEL     | Niveau de log              | info                          |
| ENV           | Environnement              | production                    |

### Monitoring

| Variable                      | Description           | Defaut    |
|-------------------------------|-----------------------|-----------|
| GF_SECURITY_ADMIN_USER        | User Grafana          | admin     |
| GF_SECURITY_ADMIN_PASSWORD    | Password Grafana      | admin123  |

### Docker Compose

Ces variables peuvent etre surchargees via un fichier `.env` :

```bash
POSTGRES_USER=edifia
POSTGRES_PASSWORD=votre_mot_de_passe_fort
POSTGRES_DB=edifia
SECRET_KEY=votre_cle_jwt_securisee
GRAFANA_PASSWORD=votre_password_grafana
```

---

## Acces aux services

### Local (docker-compose)

| Service    | URL                       | Credentials       |
|------------|---------------------------|-------------------|
| Frontend   | http://localhost          | -                 |
| Backend    | http://localhost:8000     | -                 |
| API Docs   | http://localhost:8000/docs| -                 |
| Health     | http://localhost:8000/health| -               |
| Prometheus | http://localhost:9090     | -                 |
| Grafana    | http://localhost:3000     | admin / admin123  |
| PostgreSQL | localhost:5432            | edifia / *        |
| Redis      | localhost:6379            | -                 |

### Kubernetes (Ingress)

| Host            | Chemin | Destination |
|-----------------|--------|-------------|
| edifia.local    | /      | Frontend    |
| edifia.local    | /api   | Backend     |

**Note :** Ajouter `127.0.0.1 edifia.local` dans `/etc/hosts` pour les tests locaux.

---

## Kubernetes

### Labels coherents

Toutes les ressources utilisent les labels suivants :

- `app: edifia` — Application
- `tier: database|cache|backend|frontend|monitoring|ingress` — Tier
- `component: postgres|redis|api|web|prometheus|grafana` — Composant
- `env: production` — Environnement

### Resource limits

| Composant   | Memory Limit | CPU Limit | Memory Request | CPU Request |
|-------------|-------------|-----------|----------------|-------------|
| Backend     | 512Mi       | 500m      | 256Mi          | 250m        |
| Frontend    | 128Mi       | 150m      | 64Mi           | 50m         |
| PostgreSQL  | 1Gi         | 500m      | 256Mi          | 100m        |
| Redis       | 256Mi       | 100m      | 64Mi           | 50m         |
| Prometheus  | 512Mi       | 200m      | 128Mi          | 50m         |
| Grafana     | 256Mi       | 100m      | 64Mi           | 50m         |

### Scaling

Le backend est configure pour auto-scaler horizontalement (HPA) :
- **Minimum** : 2 replicas (haute disponibilite)
- **Maximum** : 10 replicas
- **Declencheurs** : CPU > 70%, Memory > 80%

### Health checks

- **Backend** : Readiness + Liveness sur `/health` (HTTP 200)
- **Frontend** : Readiness + Liveness sur `/` (HTTP 200)
- **PostgreSQL** : TCP socket sur le port 5432
- **Redis** : `redis-cli ping`

---

## Monitoring

### Prometheus

- Scrape interval : 15s (backend), 30s (frontend)
- Targets : backend, frontend, postgres-exporter, redis-exporter
- Retention : 15 jours (par defaut)

### Grafana — Dashboards disponibles

| Dashboard           | Fichier                                | Description                |
|---------------------|----------------------------------------|----------------------------|
| API Metrics         | `grafana-dashboard-api.json`           | Request rate, latence, erreurs |
| Conformite          | `grafana-dashboard-compliance.json`    | Regles, taux conformite    |
| Business            | `grafana-dashboard-business.json`      | KPIs metier               |

### Alerting (Prometheus)

| Alerte            | Condition                                         | Severite  |
|-------------------|---------------------------------------------------|-----------|
| BackendDown       | backend UP == 0 (pendant 2min)                    | Critical  |
| HighErrorRate     | Taux d'erreur 5xx > 5% (pendant 5min)             | Warning   |
| HighLatency       | Latence p95 > 2s (pendant 5min)                   | Warning   |
| DBConnectionsHigh | Connexions DB > 80% du max (pendant 5min)         | Warning   |
| RedisDown         | redis UP == 0 (pendant 2min)                      | Critical  |
| FrontendDown      | frontend UP == 0 (pendant 2min)                   | Warning   |

---

## CI/CD

### Pipeline GitLab CI

```
build           ---->    build backend + frontend
 |                       push registry
 v
test            ---->    pytest backend
 |                       vitest frontend
 v
security-scan   ---->    trivy scan images
 |                       trivy scan filesystem
 v
deploy-staging  ---->    kubectl apply (auto on develop)
 |
 v
deploy-prod     ---->    kubectl apply (manual approval on main)
```

### Environnements

| Environnement | Branche    | Declencheur       |
|---------------|------------|-------------------|
| Staging       | `develop`  | Automatique       |
| Production    | `main`     | Approbation manuelle |

---

## Securite

### Bonnes pratiques appliquees

- **Utilisateurs non-root** : Tous les containers tournent avec un utilisateur dedie (UID >= 1000)
- **Secrets** : Aucun secret en clair dans les manifests (base64, gestionnaire de secrets recommande)
- **Resource limits** : Limits et requests definis sur tous les containers
- **Probes** : Readiness + Liveness sur tous les services critiques
- **Network policies** : Services internes en ClusterIP uniquement
- **Read-only root FS** : Active pour Redis et Frontend
- **No privilege escalation** : Desactive sur tous les containers
- **Security headers** : X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Rate limiting** : 50 req/s par IP sur l'Ingress
- **Scan de securite** : Trivy integre dans la CI/CD

### Recommandations production

1. Utiliser **HashiCorp Vault** ou **Sealed Secrets** pour les secrets
2. Activer **PodSecurityPolicies** / **Pod Security Standards**
3. Deployer **Network Policies** Kubernetes
4. Configurer **cert-manager** pour les certificats TLS
5. Utiliser un **registry prive** pour les images
6. Activer **audit logging** sur le cluster
7. Deployer **Falco** pour la detection d'intrusion
8. Changer tous les mots de passe par defaut

---

## Troubleshooting

### Les services ne demarrent pas

```bash
# Verifier les logs
docker-compose -f docker/docker-compose.yml logs -f [service]

# Verifier l'etat des containers
docker-compose -f docker/docker-compose.yml ps

# Redemarrer un service specifique
docker-compose -f docker/docker-compose.yml restart backend
```

### PostgreSQL inaccessible

```bash
# Verifier que le container tourne
docker-compose -f docker/docker-compose.yml ps postgres

# Tester la connexion
docker-compose -f docker/docker-compose.yml exec postgres pg_isready -U edifia

# Verifier les logs
docker-compose -f docker/docker-compose.yml logs postgres
```

### Backend ne se connecte pas a la DB

```bash
# Verifier les variables d'environnement
docker-compose -f docker/docker-compose.yml exec backend env | grep DATABASE

# Tester depuis le container backend
docker-compose -f docker/docker-compose.yml exec backend \
  python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
```

### Kubernetes — Pods en CrashLoopBackOff

```bash
# Logs du pod
kubectl logs -n edifia deployment/edifia-backend --previous

# Description detaillee
kubectl describe pod -n edifia -l tier=backend

# Evenements
kubectl get events -n edifia --sort-by='.lastTimestamp'
```

### HPA ne scale pas

```bash
# Verifier le status du HPA
kubectl get hpa -n edifia

# Metrics server installe ?
kubectl top nodes
kubectl top pods -n edifia

# Verifier les ressources actuelles
kubectl describe hpa edifia-backend-hpa -n edifia
```

### Ingress ne fonctionne pas

```bash
# Verifier l'Ingress controller
kubectl get pods -n ingress-nginx

# Verifier l'Ingress resource
kubectl get ingress -n edifia
kubectl describe ingress edifia-ingress -n edifia

# Verifier les services
kubectl get svc -n edifia
```

---

## Licence

Propriete du projet EDIFIA. Tous droits reserves.

## Contact

Pour toute question concernant l'infrastructure, contacter l'equipe DevOps.
