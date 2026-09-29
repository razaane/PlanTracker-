import { store } from '../data/store.js';

export const getProjects = (req, res) => {
  try {
    const projects = store.get('projects');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProject = (req, res) => {
  try {
    const { name, category, color, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Le nom du projet est obligatoire' });

    const newProject = store.insert('projects', {
      name,
      category: category || 'academic',
      color: color || '#3F5B44',
      description: description || ''
    });

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = (req, res) => {
  try {
    const project = store.findById('projects', req.params.id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });

    const updated = store.update('projects', req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = (req, res) => {
  try {
    const deleted = store.delete('projects', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Projet non trouvé' });
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
