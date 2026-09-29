import { store } from '../data/store.js';

export const getNotes = (req, res) => {
  try {
    const { category } = req.query;
    let notes = store.get('notes');
    if (category) {
      notes = notes.filter((n) => n.category === category);
    }
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNote = (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    if (!title) return res.status(400).json({ error: 'Le titre est obligatoire' });

    const newNote = store.insert('notes', {
      title,
      content: content || '',
      category: category || 'veille',
      tags: tags || []
    });

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNote = (req, res) => {
  try {
    const note = store.findById('notes', req.params.id);
    if (!note) return res.status(404).json({ error: 'Note non trouvée' });

    const updated = store.update('notes', req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNote = (req, res) => {
  try {
    const deleted = store.delete('notes', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Note non trouvée' });
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
