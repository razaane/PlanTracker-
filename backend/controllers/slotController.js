import { store } from '../data/store.js';

export const CATEGORY_COLORS = {
  cours: '#3F5B44',
  veille: '#B7C99A',
  documentation: '#B7C99A',
  candidatures: '#E7AEB4',
  sport_trajets: '#E7AEB4',
  presentation: '#8C3B4C',
  entretiens: '#8C3B4C',
  problem_solving: '#526D82'
};

export const getSlots = (req, res) => {
  try {
    const { day, category } = req.query;
    let slots = store.get('slots');

    if (day !== undefined) {
      slots = slots.filter((s) => s.day === parseInt(day, 10));
    }
    if (category) {
      slots = slots.filter((s) => s.category === category);
    }

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSlot = (req, res) => {
  try {
    const { title, day, startTime, endTime, category, location, notes, taskId } = req.body;
    if (!title || day === undefined || !startTime || !endTime || !category) {
      return res.status(400).json({ error: 'Champs obligatoires manquants pour le créneau' });
    }

    const color = req.body.color || CATEGORY_COLORS[category] || '#3F5B44';

    const newSlot = store.insert('slots', {
      title,
      day: parseInt(day, 10),
      startTime,
      endTime,
      category,
      color,
      location: location || '',
      notes: notes || '',
      taskId: taskId || null
    });

    if (taskId) {
      const task = store.findById('tasks', taskId);
      if (task) {
        store.insert('activityLogs', {
          taskId: task.id,
          taskTitle: task.title,
          action: 'scheduled',
          details: `Tâche planifiée dans le calendrier le jour ${day} de ${startTime} à ${endTime}.`
        });
      }
    }

    res.status(201).json(newSlot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSlot = (req, res) => {
  try {
    const slot = store.findById('slots', req.params.id);
    if (!slot) return res.status(404).json({ error: 'Créneau non trouvé' });

    const updates = { ...req.body };
    if (updates.category && !updates.color) {
      updates.color = CATEGORY_COLORS[updates.category] || slot.color;
    }
    if (updates.day !== undefined) {
      updates.day = parseInt(updates.day, 10);
    }

    const updated = store.update('slots', req.params.id, updates);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSlot = (req, res) => {
  try {
    const deleted = store.delete('slots', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Créneau non trouvé' });
    res.json({ message: 'Créneau supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Direct sync: drag task onto calendar grid
export const assignTaskToSlot = (req, res) => {
  try {
    const { taskId, day, startTime, endTime, category } = req.body;
    const task = store.findById('tasks', taskId);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

    const determinedCategory = category || (task.tags.includes('LinkedIn') ? 'candidatures' : 'cours');
    const color = CATEGORY_COLORS[determinedCategory] || '#3F5B44';

    const newSlot = store.insert('slots', {
      title: task.title,
      day: parseInt(day, 10),
      startTime: startTime || '10:00',
      endTime: endTime || '12:00',
      category: determinedCategory,
      color,
      location: 'Planifié via Kanban',
      notes: task.description || '',
      taskId: task.id
    });

    // Update task status if it was in 'todo'
    if (task.status === 'todo') {
      store.update('tasks', task.id, { status: 'in_progress' });
    }

    store.insert('activityLogs', {
      taskId: task.id,
      taskTitle: task.title,
      action: 'scheduled',
      details: `Glissé-déposé depuis le Kanban vers le créneau du jour ${day} (${newSlot.startTime} - ${newSlot.endTime}).`
    });

    res.status(201).json({ slot: newSlot, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
