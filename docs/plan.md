# EDIFIA — Equipe IA Complete & Plan d'Execution

## Contexte
EDIFIA est une plateforme prompt-to-building couvrant 100% du metier d'architecte via 12 couches techniques. Le PRD identifie 5 risques mortels, une roadmap sur 5 ans, et un scope tres vaste (solveur geometrique, moteur conformite 6000 regles, BIM IFC, DCE, permis, suivi chantier).

## Objectif
Constituer et orchestrer une equipe d'agents IA complete pour developper EDIFIA en mode "Full IA Team" — de la conception a la livraison, en passant par la veille legale, l'UX, la coherence fonctionnelle et le project management.

---

## Stade 1 — Structuration de l'equipe IA (ce livrable)
**Objectif** : Definir la hierarchie, les roles, les responsabilites et les interactions de l'equipe IA.

### Organisation en 4 Piliers

| Pilier | Agents | Role |
|--------|--------|------|
| **Pilier STRATEGIE** | `EDIFIA_CTO`, `EDIFIA_Product_Owner`, `EDIFIA_Legal_Risk` | Direction technique, vision produit, conformite legale |
| **Pilier EXPERIENCE** | `EDIFIA_UX_Lead`, `EDIFIA_Frontend_Dev`, `EDIFIA_Content_Designer` | Parcours utilisateur, interfaces, contenu |
| **Pilier MOTEUR** | `EDIFIA_Backend_Lead`, `EDIFIA_Geometric_Solver`, `EDIFIA_Compliance_Engine`, `EDIFIA_BIM_Specialist`, `EDIFIA_Data_AI` | Coeur technique, solveurs, conformite, BIM, IA/Data |
| **Pilier OPERATIONS** | `EDIFIA_DevOps_SRE`, `EDIFIA_QA_Lead`, `EDIFIA_Security_Lead`, `EDIFIA_Documentation` | Infrastructure, qualite, securite, documentation |

### Matrice de responsabilites (RACI) par couche EDIFIA

| Couche EDIFIA | Resp. Principal | Contributeurs | Validateurs |
|--------------|-----------------|---------------|-------------|
| 1-Brief multimodal | UX_Lead + Data_AI | Frontend_Dev, Content_Designer | Product_Owner, QA_Lead |
| 2-Site Intelligence | Data_AI | Backend_Lead, DevOps_SRE | Legal_Risk, QA_Lead |
| 3-Foncier autonome | Data_AI | Backend_Lead, DevOps_SRE | Legal_Risk, Security_Lead |
| 4-Programmation | Geometric_Solver | Data_AI, Backend_Lead | Product_Owner, Compliance_Engine |
| 5-Conception generative | Geometric_Solver | BIM_Specialist, Backend_Lead | Product_Owner, QA_Lead |
| 6-Conformite deterministe | Compliance_Engine | Legal_Risk, Backend_Lead | QA_Lead, Security_Lead |
| 7-Structure | Geometric_Solver | BIM_Specialist, Backend_Lead | Compliance_Engine, QA_Lead |
| 8-Fluides | BIM_Specialist | Backend_Lead, Compliance_Engine | QA_Lead |
| 9-Economie | Backend_Lead | Data_AI, Compliance_Engine | Product_Owner, Legal_Risk |
| 10-Production livrables | BIM_Specialist | Backend_Lead, Frontend_Dev | Compliance_Engine, QA_Lead |
| 11-Phasage chantier | BIM_Specialist | Backend_Lead, Frontend_Dev | Product_Owner |
| 12-Suivi chantier | Data_AI | BIM_Specialist, Backend_Lead | Product_Owner |

### Artefacts produits par le Stade 1
1. `equipe_edifia.md` — Organigramme complet avec fiches de poste
2. `methodologie_workflow.md` — Workflow de collaboration inter-agents
3. `backlog_initial.md` — Backlog priorise V1 (extensions <40m2 + MOB <150m2)
4. `architecture_cible.md` — Architecture technique cible et stack

---

## Stade 2 — Initialisation des fondations (prochaine phase)
**Skills a charger** : vibecoding-general-swarm, vibecoding-webapp-swarm
- Mise en place de l'architecture technique
- Debut du developpement couches 1, 2, 4, 5, 6, 10 (scope V1)
- Mise en place CI/CD, environnements
- Prototype interface brief multimodal

## Stade 3 — Developpement MVP (mois 3-12)
- Deploiement progressif des couches V1
- Tests de conformite sur 5-10 communes pilotes
- Iterate UX avec utilisateurs pilotes

## Stade 4 — Industrialisation (mois 12-24)
- Scale technique et fonctionnel
- Preparation Series A
- Internationalisation

---

## Regles de gouvernance inter-agents

### 1. Cycle de decision
- **Daily sync** : Rapport automatique de chaque agent sur ses taches en cours et blocages
- **Sprint planning** : Tous les 2 "jours agents" — le Product_Owner priorise, le CTO valide
- **Architecture Review** : A chaque changement transversal — le CTO + leads concernes
- **Legal Gate** : A chaque livrable touchant aux couches 2, 3, 6, 9, 10 — le Legal_Risk valide

### 2. Escalade des blocages
- Niveau 1 : Agent → Lead de son pilier
- Niveau 2 : Lead → Product_Owner + CTO
- Niveau 3 : CTO + Product_Owner + Legal_Risk (decision executive)

### 3. Qualite et validation
- Zero regression : Tout merge doit passer QA_Lead
- Conformite : Toute regle encodee doit etre revue par Compliance_Engine + Legal_Risk
- Documentation : Toute fonctionnalite doit etre documentee par Documentation
- Securite : Toute exposition externe doit etre validee par Security_Lead

### 4. Anti-patterns interdits
- Aucun agent ne decide seul d'ajouter une dependance externe
- Aucune couche ne fait appel a un LLM pour de la conformite reglementaire (risque mortel #1)
- Aucune donnee utilisateur ne quitte l'infrastructure souveraine sans validation Security_Lead
- Aucun scope creep : le Product_Owner garde la ligne V1 sans merci
