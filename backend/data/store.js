import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'plantracker_db.json');

const INITIAL_DATA = {
  projects: [
    {
      id: 'proj-1',
      name: 'PlanTracker (MERN Deliverable)',
      category: 'academic',
      color: '#3F5B44',
      description: 'Développement de la plateforme intelligente de suivi hebdomadaire et recherche d’emploi.'
    },
    {
      id: 'proj-2',
      name: 'Recherche Stage PFE & Alternance',
      category: 'job_search',
      color: '#E7AEB4',
      description: 'Campagne de prospection LinkedIn, candidatures ciblées et préparation aux entretiens techniques.'
    },
    {
      id: 'proj-3',
      name: 'Veille & Perfectionnement Tech',
      category: 'personal',
      color: '#B7C99A',
      description: 'Veille technologique hebdomadaire, Problem Solving sur LeetCode et documentation.'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Conception Architecture & Cahier des Charges',
      description: 'Structurer l’application PlanTracker selon les exigences MERN et la charte graphique.',
      projectId: 'proj-1',
      status: 'done',
      priority: 'urgent',
      progress: 100,
      dueDate: '2026-09-28',
      tags: ['Architecture', 'MERN'],
      subtasks: [
        { id: 'st-1', title: 'Analyse fonctionnelle', completed: true },
        { id: 'st-2', title: 'Modélisation des données', completed: true },
        { id: 'st-3', title: 'Validation charte graphique', completed: true }
      ],
      createdAt: '2026-09-22T09:00:00.000Z'
    },
    {
      id: 'task-2',
      title: 'Implémentation Grille Calendrier Hebdo',
      description: 'Créer la vue interactive 7 jours façon Google Calendar avec le code couleur officiel.',
      projectId: 'proj-1',
      status: 'in_progress',
      priority: 'high',
      progress: 75,
      dueDate: '2026-09-29',
      tags: ['Frontend', 'Calendar'],
      subtasks: [
        { id: 'st-4', title: 'Créneaux horaires 07h-23h', completed: true },
        { id: 'st-5', title: 'Drag and drop depuis Kanban', completed: false },
        { id: 'st-6', title: 'Modal de création/édition', completed: true }
      ],
      createdAt: '2026-09-23T10:00:00.000Z'
    },
    {
      id: 'task-3',
      title: 'Postuler à 5 offres Ingénieur Fullstack sur LinkedIn',
      description: 'Cibler des offres avec stack React/Node, adapter le CV et envoyer un message personnalisé.',
      projectId: 'proj-2',
      status: 'todo',
      priority: 'high',
      progress: 20,
      dueDate: '2026-10-01',
      tags: ['LinkedIn', 'Candidatures'],
      subtasks: [
        { id: 'st-7', title: 'Sélectionner les entreprises cibles', completed: true },
        { id: 'st-8', title: 'Personnaliser la lettre de motivation', completed: false },
        { id: 'st-9', title: 'Relance des recruteurs', completed: false }
      ],
      createdAt: '2026-09-24T14:30:00.000Z'
    },
    {
      id: 'task-4',
      title: 'Préparation Technique Entretien Capgemini',
      description: 'Réviser les questions d’architecture MERN, hooks React et optimisation requêtes MongoDB.',
      projectId: 'proj-2',
      status: 'in_review',
      priority: 'urgent',
      progress: 80,
      dueDate: '2026-10-02',
      tags: ['Entretien', 'Technique'],
      subtasks: [
        { id: 'st-10', title: 'Mock interview React', completed: true },
        { id: 'st-11', title: 'Pitch de présentation de projet', completed: true },
        { id: 'st-12', title: 'Questions RH / Soft skills', completed: false }
      ],
      createdAt: '2026-09-25T11:00:00.000Z'
    },
    {
      id: 'task-5',
      title: 'Session Problem Solving & Algorithmique',
      description: 'Résoudre 3 exercices LeetCode Medium (Arbres, Graphes, DP).',
      projectId: 'proj-3',
      status: 'todo',
      priority: 'medium',
      progress: 0,
      dueDate: '2026-10-03',
      tags: ['LeetCode', 'Algo'],
      subtasks: [
        { id: 'st-13', title: 'Graph BFS/DFS problem', completed: false },
        { id: 'st-14', title: 'Dynamic programming memoization', completed: false }
      ],
      createdAt: '2026-09-26T16:00:00.000Z'
    },
    {
      id: 'task-6',
      title: 'Veille Technologique IA & Agentic Coding',
      description: 'Lire la documentation sur l’orchestration LLM et rédiger une note synthétique.',
      projectId: 'proj-3',
      status: 'done',
      priority: 'medium',
      progress: 100,
      dueDate: '2026-09-27',
      tags: ['Veille', 'Documentation'],
      subtasks: [
        { id: 'st-15', title: 'Lecture articles Gemini API', completed: true },
        { id: 'st-16', title: 'Rédaction note de synthèse', completed: true }
      ],
      createdAt: '2026-09-26T17:00:00.000Z'
    }
  ],
  slots: [
    {
      id: 'slot-1',
      title: 'Cours : Architecture Distribuée',
      day: 0, // Lundi
      startTime: '08:30',
      endTime: '11:30',
      category: 'cours',
      color: '#3F5B44',
      location: 'Amphi B / En ligne',
      notes: 'Module avancé sur les microservices et event streaming.'
    },
    {
      id: 'slot-2',
      title: 'Sport & Déplacement Salle',
      day: 0, // Lundi
      startTime: '12:30',
      endTime: '14:00',
      category: 'sport_trajets',
      color: '#E7AEB4',
      location: 'Gym / Trajet',
      notes: 'Séance cardio + renforcement.'
    },
    {
      id: 'slot-3',
      title: 'Candidatures LinkedIn & Prospection',
      day: 0, // Lundi
      startTime: '14:30',
      endTime: '16:30',
      category: 'candidatures',
      color: '#E7AEB4',
      location: 'Bureau personnel',
      notes: 'Envoi des candidatures et adaptation des profils.'
    },
    {
      id: 'slot-4',
      title: 'Veille Technologique Hebdo',
      day: 1, // Mardi
      startTime: '09:00',
      endTime: '11:00',
      category: 'veille',
      color: '#B7C99A',
      location: 'Espace Documentation',
      notes: 'Lecture newsletters Dev, Next.js & MERN architecture.'
    },
    {
      id: 'slot-5',
      title: 'Problem Solving (LeetCode / Codeforces)',
      day: 1, // Mardi
      startTime: '14:00',
      endTime: '16:00',
      category: 'problem_solving',
      color: '#526D82',
      location: 'Workspace',
      notes: 'Exercices d’algorithmique complexe et structures de données.'
    },
    {
      id: 'slot-6',
      title: 'Présentation Projet Académique PlanTracker',
      day: 2, // Mercredi
      startTime: '10:00',
      endTime: '12:00',
      category: 'presentation',
      color: '#8C3B4C',
      location: 'Salle 204 / Jury',
      notes: 'Soutenance de mi-parcours devant les encadrants.'
    },
    {
      id: 'slot-7',
      title: 'Documentation & Synthèse des Cours',
      day: 2, // Mercredi
      startTime: '15:00',
      endTime: '17:00',
      category: 'documentation',
      color: '#B7C99A',
      location: 'Bibliothèque',
      notes: 'Mise au propre des fiches de synthèse.'
    },
    {
      id: 'slot-8',
      title: 'Entretien Technique : Tech Lead / Capgemini',
      day: 3, // Jeudi
      startTime: '14:30',
      endTime: '16:00',
      category: 'entretiens',
      color: '#8C3B4C',
      location: 'Google Meet',
      notes: 'Entretien technique d’1h30 portant sur Node/React et les designs patterns.'
    },
    {
      id: 'slot-9',
      title: 'Travail Scolaire & TP MERN',
      day: 4, // Vendredi
      startTime: '09:00',
      endTime: '12:00',
      category: 'cours',
      color: '#3F5B44',
      location: 'Lab Informatique',
      notes: 'Finalisation des modules backend et frontend.'
    },
    {
      id: 'slot-10',
      title: 'Séance Sportive & Footing',
      day: 5, // Samedi
      startTime: '10:00',
      endTime: '11:30',
      category: 'sport_trajets',
      color: '#E7AEB4',
      location: 'Parc',
      notes: 'Footing en plein air.'
    }
  ],
  applications: [
    {
      id: 'app-1',
      company: 'Capgemini Engineering',
      role: 'Ingénieur d’Études MERN / Fullstack',
      location: 'Casablanca / Hybride',
      url: 'https://linkedin.com/jobs/capgemini',
      status: 'interview',
      appliedDate: '2026-09-18',
      interviewDate: '2026-10-01T14:30:00',
      satisfactionRating: 5,
      difficultyRating: 4,
      notes: 'Premier contact RH très positif. Entretien technique fixé jeudi 14h30.'
    },
    {
      id: 'app-2',
      company: 'DXC Technology',
      role: 'Développeur React.js / Node.js',
      location: 'Rabat / Remote',
      url: 'https://linkedin.com/jobs/dxc',
      status: 'applied',
      appliedDate: '2026-09-22',
      interviewDate: null,
      satisfactionRating: 4,
      difficultyRating: 3,
      notes: 'Candidature envoyée suite à la recommandation d’un alumni.'
    },
    {
      id: 'app-3',
      company: 'Société Générale Africa Tech',
      role: 'Stagiaire PFE Fullstack MERN & Cloud',
      location: 'Casablanca',
      url: 'https://linkedin.com/jobs/sg-tech',
      status: 'interview',
      appliedDate: '2026-09-15',
      interviewDate: '2026-10-06T10:00:00',
      satisfactionRating: 5,
      difficultyRating: 5,
      notes: 'Test technique réussi (92/100). Entretien final de cadrage programmé.'
    },
    {
      id: 'app-4',
      company: 'Atos Syntel',
      role: 'Software Engineer Junior',
      location: 'Casablanca',
      url: 'https://linkedin.com/jobs/atos',
      status: 'rejected',
      appliedDate: '2026-09-10',
      interviewDate: null,
      satisfactionRating: 2,
      difficultyRating: 3,
      notes: 'Poste pourvu en interne.'
    },
    {
      id: 'app-5',
      company: 'Inwi Telecom',
      role: 'Développeur Digital & API Web',
      location: 'Casablanca',
      url: 'https://linkedin.com/jobs/inwi',
      status: 'offer',
      appliedDate: '2026-09-05',
      interviewDate: '2026-09-20T11:00:00',
      satisfactionRating: 5,
      difficultyRating: 4,
      notes: 'Offre reçue ! En attente de comparaison avec Capgemini et SG.'
    }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Synthèse Architecture MERN & Event Loop Node.js',
      category: 'technique',
      tags: ['Node.js', 'Express', 'Architecture'],
      content: `# Synthèse Architecture MERN

### 1. Composants Clés
- **MongoDB** : Base NoSQL orientée documents JSON/BSON, idéale pour la flexibilité des structures de données.
- **Express.js** : Framework minimaliste et performant pour la mise en place d'APIs REST.
- **React.js** : Librairie front-end déclarative, optimisée grâce au Virtual DOM et l'écosystème de composants.
- **Node.js** : Environnement d'exécution JavaScript côté serveur basé sur le moteur V8.

### 2. Points d'attention pour l'entretien technique
- Gestion de l'asynchronisme : Promises, async/await, Event Loop et Microtask Queue.
- Indexation MongoDB et projection pour accélérer les temps de réponse.
- Sécurisation des routes : CORS, Helmet, validation des schémas.`,
      updatedAt: '2026-09-26T18:00:00.000Z'
    },
    {
      id: 'note-2',
      title: 'Veille : Les nouveautés React 19 et Tailwind CSS v4',
      category: 'veille',
      tags: ['Frontend', 'Veille', 'React'],
      content: `# Veille Technologique — Septembre 2026

- **React Server Components (RSC)** et Server Actions en production.
- **Compiler React** : Mémorisation automatique des hooks sans obligation de \`useMemo\` et \`useCallback\`.
- **Tailwind Engine** : Détection ultra rapide des classes utilitaires et optimisation du bundle CSS.`,
      updatedAt: '2026-09-25T14:00:00.000Z'
    }
  ],
  activityLogs: [
    {
      id: 'log-1',
      taskId: 'task-1',
      taskTitle: 'Conception Architecture & Cahier des Charges',
      action: 'completed',
      details: 'La tâche a été marquée comme terminée (100%).',
      timestamp: '2026-09-27T18:30:00.000Z'
    },
    {
      id: 'log-2',
      taskId: 'task-2',
      taskTitle: 'Implémentation Grille Calendrier Hebdo',
      action: 'status_change',
      details: 'Statut changé de "À faire" vers "En cours".',
      timestamp: '2026-09-27T19:00:00.000Z'
    },
    {
      id: 'log-3',
      taskId: 'task-4',
      taskTitle: 'Préparation Technique Entretien Capgemini',
      action: 'created',
      details: 'Tâche créée et liée à l’entretien Capgemini.',
      timestamp: '2026-09-27T19:15:00.000Z'
    }
  ]
};

// Persistent Store Handler
class DataStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('⚠️ Erreur lecture store local, utilisation des données initiales:', err.message);
    }
    this.save(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  save(dataToSave = this.data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Erreur sauvegarde store local:', err.message);
    }
  }

  get(collection) {
    return this.data[collection] || [];
  }

  findById(collection, id) {
    const list = this.get(collection);
    return list.find((item) => item.id === id);
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newItem = {
      ...item,
      id: item.id || `${collection.slice(0, 4)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: item.createdAt || new Date().toISOString()
    };
    this.data[collection].unshift(newItem);
    this.save();
    return newItem;
  }

  update(collection, id, updates) {
    const list = this.get(collection);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.data[collection][index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data[collection][index];
  }

  delete(collection, id) {
    const list = this.get(collection);
    const initialLen = list.length;
    this.data[collection] = list.filter((item) => item.id !== id);
    this.save();
    return this.data[collection].length < initialLen;
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
    return this.data;
  }
}

export const store = new DataStore();
