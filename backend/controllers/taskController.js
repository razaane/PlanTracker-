import { store } from '../data/store.js';

export const getTasks = (req, res) => {
  try {
    const { status, priority, projectId } = req.query;
    let tasks = store.get('tasks');

    if (status) tasks = tasks.filter((t) => t.status === status);
    if (priority) tasks = tasks.filter((t) => t.priority === priority);
    if (projectId) tasks = tasks.filter((t) => t.projectId === projectId);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTaskById = (req, res) => {
  try {
    const task = store.findById('tasks', req.params.id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = (req, res) => {
  try {
    const { title, description, projectId, status, priority, dueDate, tags, subtasks } = req.body;
    if (!title) return res.status(400).json({ error: 'Le titre est obligatoire' });

    const newTask = store.insert('tasks', {
      title,
      description: description || '',
      projectId: projectId || 'proj-1',
      status: status || 'todo',
      priority: priority || 'medium',
      progress: 0,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      tags: tags || [],
      subtasks: (subtasks || []).map((s, idx) => ({
        id: s.id || `st-${Date.now()}-${idx}`,
        title: s.title || s,
        completed: Boolean(s.completed)
      }))
    });

    store.insert('activityLogs', {
      taskId: newTask.id,
      taskTitle: newTask.title,
      action: 'created',
      details: `Tâche créée avec la priorité ${newTask.priority}.`
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = (req, res) => {
  try {
    const task = store.findById('tasks', req.params.id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

    const updates = { ...req.body };

    // Auto-calculate progress if subtasks provided
    if (updates.subtasks && Array.isArray(updates.subtasks)) {
      const completedCount = updates.subtasks.filter((s) => s.completed).length;
      updates.progress =
        updates.subtasks.length > 0
          ? Math.round((completedCount / updates.subtasks.length) * 100)
          : updates.progress ?? 0;
    }

    if (updates.status === 'done' && task.status !== 'done') {
      updates.progress = 100;
      if (updates.subtasks) {
        updates.subtasks = updates.subtasks.map((s) => ({ ...s, completed: true }));
      }
    }

    const updated = store.update('tasks', req.params.id, updates);

    // Log status or progress changes
    if (updates.status && updates.status !== task.status) {
      store.insert('activityLogs', {
        taskId: task.id,
        taskTitle: task.title,
        action: 'status_change',
        details: `Statut changé de "${task.status}" à "${updates.status}".`
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = (req, res) => {
  try {
    const deleted = store.delete('tasks', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleSubtask = (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const task = store.findById('tasks', taskId);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

    const subtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    const completedCount = subtasks.filter((s) => s.completed).length;
    const progress = Math.round((completedCount / subtasks.length) * 100);
    const status = progress === 100 ? 'done' : progress > 0 ? 'in_progress' : task.status;

    const updated = store.update('tasks', taskId, { subtasks, progress, status });

    store.insert('activityLogs', {
      taskId: task.id,
      taskTitle: task.title,
      action: 'subtask_toggle',
      details: `Sous-tâche mise à jour. Avancement: ${progress}%.`
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getActivityLogs = (req, res) => {
  try {
    const logs = store.get('activityLogs');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
