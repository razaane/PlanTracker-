import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Clock, MapPin, Tag, AlignLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CATEGORIES = [
  { id: 'cours', label: 'Cours / Travail scolaire', color: '#3F5B44', textColor: 'text-white' },
  { id: 'veille', label: 'Veille technologique', color: '#B7C99A', textColor: 'text-[#203324]' },
  { id: 'documentation', label: 'Documentation / Notes', color: '#B7C99A', textColor: 'text-[#203324]' },
  { id: 'candidatures', label: 'Candidatures LinkedIn', color: '#E7AEB4', textColor: 'text-[#3E1119]' },
  { id: 'sport_trajets', label: 'Sport & Trajets', color: '#E7AEB4', textColor: 'text-[#3E1119]' },
  { id: 'presentation', label: 'Présentation / Soutenance', color: '#8C3B4C', textColor: 'text-white' },
  { id: 'entretiens', label: 'Entretien de recrutement', color: '#8C3B4C', textColor: 'text-white' },
  { id: 'problem_solving', label: 'Problem Solving / Algo', color: '#526D82', textColor: 'text-white' },
];

export const DAYS_NAMES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function SlotModal({ isOpen, onClose, initialData = null, defaultDay = 0, defaultHour = '09:00' }) {
  const { addSlot, updateSlot, deleteSlot, tasks } = useApp();

  const [title, setTitle] = useState('');
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState('cours');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [taskId, setTaskId] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDay(initialData.day !== undefined ? initialData.day : 0);
      setStartTime(initialData.startTime || '09:00');
      setEndTime(initialData.endTime || '11:00');
      setCategory(initialData.category || 'cours');
      setLocation(initialData.location || '');
      setNotes(initialData.notes || '');
      setTaskId(initialData.taskId || '');
    } else {
      setTitle('');
      setDay(defaultDay);
      setStartTime(defaultHour);
      // Auto set 2h duration
      const [h, m] = defaultHour.split(':').map(Number);
      const nextH = Math.min(22, h + 2);
      setEndTime(`${String(nextH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      setCategory('cours');
      setLocation('');
      setNotes('');
      setTaskId('');
    }
  }, [initialData, defaultDay, defaultHour, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      day: Number(day),
      startTime,
      endTime,
      category,
      location,
      notes,
      taskId: taskId || null
    };

    if (initialData && initialData.id) {
      await updateSlot(initialData.id, payload);
    } else {
      await addSlot(payload);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (initialData && initialData.id) {
      if (window.confirm('Voulez-vous supprimer ce créneau horaire ?')) {
        await deleteSlot(initialData.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/20 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-[#EAE3D2] px-6 py-4 flex items-center justify-between border-b border-[#3F5B44]/15">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: CATEGORIES.find((c) => c.id === category)?.color || '#3F5B44'
              }}
            />
            <h3 className="font-bold text-forest text-lg">
              {initialData ? 'Modifier le Créneau' : 'Nouveau Créneau Horaire'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-[#F5F1E6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Titre de l'activité
            </label>
            <input
              type="text"
              required
              placeholder="Ex: TP Architecture MERN, Candidatures..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest text-sm font-medium"
            />
          </div>

          {/* Catégorie (Charte graphique) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Type d'activité (Charte graphique officielle)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    category === cat.id
                      ? 'ring-2 ring-forest shadow-xs font-semibold'
                      : 'hover:bg-white border-gray-200'
                  }`}
                  style={{
                    backgroundColor: category === cat.id ? `${cat.color}25` : '#FFFFFF',
                    borderColor: category === cat.id ? cat.color : '#E5E7EB',
                    color: category === cat.id ? cat.color : '#374151'
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Jour & Horaires */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Jour
              </label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              >
                {DAYS_NAMES.map((dName, idx) => (
                  <option key={idx} value={idx}>
                    {dName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Début
              </label>
              <input
                type="time"
                step="900"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Fin
              </label>
              <input
                type="time"
                step="900"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </div>
          </div>

          {/* Rapprocher d'une tâche Jira */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Rattacher à une tâche Jira (Optionnel)
            </label>
            <select
              value={taskId}
              onChange={(e) => {
                setTaskId(e.target.value);
                const selectedTask = tasks.find((t) => t.id === e.target.value);
                if (selectedTask && !title) {
                  setTitle(selectedTask.title);
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
            >
              <option value="">Aucune tâche liée</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.status.toUpperCase()}] {t.title} ({t.progress}%)
                </option>
              ))}
            </select>
          </div>

          {/* Lieu & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Lieu / Plateforme
              </label>
              <input
                type="text"
                placeholder="Google Meet, Amphi B..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Notes / Objectif
              </label>
              <input
                type="text"
                placeholder="Objectifs de la session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-gray-200">
            {initialData ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-wine bg-wine/10 hover:bg-wine/20 text-xs font-semibold transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                {initialData ? 'Enregistrer' : 'Créer le créneau'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
