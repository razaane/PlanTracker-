import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TaskModal({ isOpen, onClose, initialData = null }) {
  const { addTask, updateTask, projects } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('proj-1');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setProjectId(initialData.projectId || 'proj-1');
      setStatus(initialData.status || 'todo');
      setPriority(initialData.priority || 'medium');
      setDueDate(initialData.dueDate || '');
      setTagsInput((initialData.tags || []).join(', '));
      setSubtasks(initialData.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setProjectId('proj-1');
      setStatus('todo');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setTagsInput('MERN, Frontend');
      setSubtasks([
        { id: 'st-new-1', title: 'Analyse préliminaire', completed: false },
        { id: 'st-new-2', title: 'Développement du composant', completed: false }
      ]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (stId) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== stId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      projectId,
      status,
      priority,
      dueDate,
      tags,
      subtasks
    };

    if (initialData && initialData.id) {
      await updateTask(initialData.id, payload);
    } else {
      await addTask(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/20 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-[#EAE3D2] px-6 py-4 flex items-center justify-between border-b border-[#3F5B44]/15">
          <h3 className="font-bold text-forest text-lg">
            {initialData ? 'Modifier la Tâche' : 'Créer une Nouvelle Tâche Jira'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-[#F5F1E6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Titre de la tâche
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Refactoriser le contrôleur d'authentification..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest/40 text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Description / Spécifications
            </label>
            <textarea
              rows={3}
              placeholder="Détails techniques, critères d'acceptation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest/40 text-sm"
            />
          </div>

          {/* Projet & Priorité */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Projet Rattaché
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40 font-semibold"
              >
                <option value="low">Faible (Low)</option>
                <option value="medium">Moyenne (Medium)</option>
                <option value="high">Haute (High)</option>
                <option value="urgent">Urgente (Bordeaux #8C3B4C)</option>
              </select>
            </div>
          </div>

          {/* Statut & Date d'échéance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Statut Kanban
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              >
                <option value="todo">À faire (To Do)</option>
                <option value="in_progress">En cours (In Progress)</option>
                <option value="in_review">En revue (In Review)</option>
                <option value="done">Terminé (Done)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Échéance
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Étiquettes (séparées par une virgule)
            </label>
            <input
              type="text"
              placeholder="Ex: Architecture, MERN, LinkedIn, Algo"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest/40 text-sm"
            />
          </div>

          {/* Sous-tâches (Subtasks checklist) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Sous-tâches & Décomposition
            </label>
            <div className="space-y-2 mb-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-gray-200 text-xs"
                >
                  <label className="flex items-center gap-2 cursor-pointer flex-1 truncate">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() =>
                        setSubtasks((prev) =>
                          prev.map((s) => (s.id === st.id ? { ...s, completed: !s.completed } : s))
                        )
                      }
                      className="rounded text-forest focus:ring-forest"
                    />
                    <span className={st.completed ? 'line-through text-gray-400' : 'text-gray-800'}>
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-gray-400 hover:text-wine transition p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ajouter une sous-tâche..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl bg-[#EAE3D2] text-forest hover:bg-forest hover:text-white text-xs font-semibold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition shadow-sm"
            >
              {initialData ? 'Enregistrer les modifications' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
