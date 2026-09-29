# PlanTracker — Suivi Scolaire, Recherche d'Emploi & Organisation Personnelle

Application web complète basée sur la pile **MERN** (MongoDB, Express.js, React, Node.js), développée selon les spécifications strictes du Cahier des Charges.

---

## 🎨 Charte Graphique & Identité Visuelle

L'application respecte à 100% la palette de couleurs officielle :

| Couleur | Code Hex | Usage dans l'application |
|---|---|---|
| **Vert foncé** | `#3F5B44` | Blocs « cours / école », en-têtes, boutons principaux, accents majeurs |
| **Vert clair (sauge)** | `#B7C99A` | Blocs « veille », « documentation », zones secondaires |
| **Rose clair** | `#E7AEB4` | Blocs « candidatures LinkedIn », « sport / trajets » |
| **Bordeaux** | `#8C3B4C` | Blocs « présentation », « entretiens », priorité haute/urgente |
| **Beige / Crème** | `#F5F1E6` | Fond général, cartes, canevas doux et reposant |

---

## 🚀 Modules Fonctionnels Implémentés

### 1. 📅 Module Planning Hebdomadaire (Google Calendar style)
- Vue responsive 7 jours (Lundi à Dimanche) avec créneaux horaires 08h00 - 22h00.
- Coloration automatique des blocs selon le type d'activité.
- Navigation par semaine (Semaine précédente, Aujourd'hui, Semaine suivante).
- Modal de création, modification et suppression rapide des créneaux.
- **Synchronisation Directe Kanban -> Calendrier** : Tiroir latéral de tâches non planifiées avec **glisser-déposer direct** sur une plage horaire libre.

### 2. 📋 Module Mini-Jira / Kanban (Gestion de projet)
- Colonnes dynamiques : **À faire (To Do)**, **En cours (In Progress)**, **En revue (In Review)**, **Terminé (Done)**.
- Décomposition des tâches en **sous-tâches interactives** avec calcul en direct de l'avancement (%).
- Filtre instantané par projet.
- **Journal d'activité (Audit log)** conservant l'historique de chaque action.

### 3. 📊 Module Dashboard Analytique (Inspiré du Modèle RH Tableau)
- **KPI Cards en en-tête** : Total tâches, tâches achevées, taux d'avancement moyen, candidatures envoyées, entretiens obtenus, total heures prévues.
- **Diagramme Circulaire (Donut Chart)** : Répartition du temps par type d'activité (équivalent *Department Wise Attrition*).
- **Histogramme groupé** : Heures prévues vs consacrées par catégorie (équivalent *Age Group Histogram*).
- **Matrice Heatmap** : Taux de satisfaction et niveau de difficulté ressenti par sujet (équivalent *Job Satisfaction Rating*).
- **Anneaux de Conversion** : Pipeline des candidatures (équivalent *Radial Conversion Rings*).

### 4. 💼 Module Candidatures LinkedIn & Entretiens Dynamiques
- Suivi du statut des candidatures (Postulée, Entretien, Offre, Refusée).
- **Programmation instantanée d'entretien** : insertion automatique d'un créneau Bordeaux (`#8C3B4C`) dans le calendrier hebdomadaire et incrément des métriques du dashboard sans aucune double saisie !

### 5. 📝 Module Documentation & Veille Technologique
- Espace de prise de notes et synthèses (Markdown supporté).
- Classement par catégorie (Veille, Technique, Cours, Réunions).
- Recherche instantanée par mot-clé et tags.

### 6. 🤖 Assistant IA & Orchestrateur Intelligent
- **Optimisation en 1 clic** : Analyse des disponibilités et affectation automatique des tâches prioritaires dans les plages libres.
- **Détection des conflits** : Alerte visuelle et recommandations en cas de chevauchement d'horaires.
- **Bilan hebdomadaire automatisé** : Synthèse textuelle de la progression et des priorités restantes.
- **Commandes en langage naturel** : Compréhension d'instructions comme :
  - *« Libère-moi du temps jeudi pour une présentation »*
  - *« Planifie 1h30 de veille technologique mardi »*
  - *« Optimise mon emploi du temps »*

---

## 🛠️ Instructions de Lancement Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (v18+ ou supérieur)
- npm (inclus avec Node.js)
- (Optionnel) MongoDB local ou Atlas. *Note : Si MongoDB n'est pas actif, un DataStore local persistant prend le relais automatiquement.*

### 1. Démarrer le Backend Express
Ouvrez un premier terminal dans le dossier du projet :
```bash
cd backend
npm run dev
```
Le serveur démarrera sur **`http://localhost:5000`** avec toutes les routes `/api/...`.

### 2. Démarrer le Frontend React (Vite)
Ouvrez un second terminal dans le dossier du projet :
```bash
cd frontend
npm run dev
```
L'application web sera accessible sur **`http://localhost:3000`**.

---

## 📡 Endpoints API Disponibles

- `GET /api/health` : Statut du backend
- `GET /api/tasks` & `POST /api/tasks` : CRUD des tâches Jira
- `GET /api/tasks/logs/activity` : Historique des changements
- `GET /api/slots` & `POST /api/slots` : Gestion du planning hebdomadaire
- `POST /api/slots/assign-task` : Glisser-déposer tâche -> créneau
- `GET /api/jobs` & `POST /api/jobs` : Suivi candidatures
- `POST /api/jobs/interview` : Synchronisation entretien -> planning
- `GET /api/analytics/dashboard` : Métriques KPI & graphiques
- `POST /api/ai/optimize` : Auto-planification intelligente
- `GET /api/ai/conflicts` : Détecteur de chevauchements
- `GET /api/ai/summary` : Synthèse hebdomadaire
- `POST /api/ai/chat` : Moteur NLP en langage naturel
- `GET /api/notes` & `POST /api/notes` : Espace documentation & veille

---

## 🌿 Suivi Git & Commits
Toutes les fonctionnalités ont été développées et commitées par étapes sur la branche **`feature-khaoula`** et synchronisées avec le dépôt GitHub distant.
