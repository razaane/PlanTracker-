import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Search,
  Tag,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  FileText,
  X
} from 'lucide-react';

export default function DocsWorkspace() {
  const { notes, addNote, updateNote, deleteNote } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('veille');
  const [formTags, setFormTags] = useState('');
  const [formContent, setFormContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Toutes les notes' },
    { id: 'veille', label: 'Veille Technologique' },
    { id: 'technique', label: 'Notes Techniques' },
    { id: 'cours', label: 'Synthèses de Cours' },
    { id: 'reunion', label: 'Comptes Rendus' }
  ];

  const filteredNotes = notes.filter((n) => {
    if (activeCategory !== 'all' && n.category !== activeCategory) return false;
    if (
      searchQuery &&
      !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenCreateModal = () => {
    setFormTitle('');
    setFormCategory('veille');
    setFormTags('React, Node');
    setFormContent('# Titre de la note\n\nNotes détaillées...');
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setFormTitle(note.title);
    setFormCategory(note.category);
    setFormTags((note.tags || []).join(', '));
    setFormContent(note.content);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle,
      category: formCategory,
      tags,
      content: formContent
    };

    if (isEditing && selectedNote) {
      const updated = await updateNote(selectedNote.id, payload);
      setSelectedNote(updated);
    } else {
      const created = await addNote(payload);
      setSelectedNote(created);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 lg:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest/10 text-forest">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-forest">Documentation & Veille Technologique</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Espace centralisé de rédaction, fiches de synthèse, ressources et comptes-rendus
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition shadow-xs self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle note</span>
        </button>
      </div>

      {/* Main Workspace (Notes List & Reader) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List & Filters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher une note, veille..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-forest/40"
            />
          </div>

          {/* Categories pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                  activeCategory === c.id
                    ? 'bg-forest text-white shadow-xs font-semibold'
                    : 'bg-[#EAE3D2] text-gray-700 hover:bg-[#EAE3D2]/80'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Notes items list */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                  selectedNote?.id === note.id
                    ? 'bg-[#FCFAF6] border-forest shadow-xs ring-1 ring-forest'
                    : 'bg-white border-gray-200 hover:border-forest/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage/30 text-forest">
                    {note.category}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(note.updatedAt || Date.now()).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{note.title}</h4>

                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {note.content.replace(/[#*`]/g, '')}
                </p>

                {note.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {filteredNotes.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-xs">
                Aucune note trouvée.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Note Reader & Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-6 shadow-xs min-h-[500px] flex flex-col justify-between">
          {selectedNote ? (
            <div className="space-y-5">
              {/* Note Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase font-bold px-2.5 py-0.5 rounded-full bg-forest text-white">
                      {selectedNote.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(selectedNote.updatedAt || Date.now()).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-forest">{selectedNote.title}</h3>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(selectedNote)}
                    className="p-2 rounded-xl bg-[#EAE3D2] text-forest hover:bg-forest hover:text-white transition"
                    title="Modifier la note"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Voulez-vous supprimer cette note ?')) {
                        deleteNote(selectedNote.id);
                        setSelectedNote(null);
                      }
                    }}
                    className="p-2 rounded-xl bg-wine/10 text-wine hover:bg-wine hover:text-white transition"
                    title="Supprimer la note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {selectedNote.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNote.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-sage/30 text-forest font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Content Body */}
              <div className="text-sm text-gray-800 leading-relaxed space-y-3 whitespace-pre-line bg-white/60 p-5 rounded-2xl border border-gray-200/80 font-mono text-xs">
                {selectedNote.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 text-sm">
              <FileText className="w-12 h-12 stroke-[1.2] mb-2 opacity-50" />
              <span>Sélectionnez ou créez une note pour afficher son contenu</span>
            </div>
          )}
        </div>
      </div>

      {/* Note Modal (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FCFAF6] border border-[#3F5B44]/20 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-scaleUp">
            <div className="bg-[#EAE3D2] px-6 py-4 flex items-center justify-between border-b border-[#3F5B44]/15">
              <h3 className="font-bold text-forest text-base">
                {isEditing ? 'Modifier la Note' : 'Nouvelle Note de Veille / Documentation'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Titre de la note
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Veille sur Next.js 15, Notes de révision..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                  >
                    <option value="veille">Veille Technologique</option>
                    <option value="technique">Notes Techniques</option>
                    <option value="cours">Synthèses de Cours</option>
                    <option value="reunion">Comptes Rendus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Tags (séparés par une virgule)
                  </label>
                  <input
                    type="text"
                    placeholder="MERN, Algo, React"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Contenu (Markdown supporté)
                </label>
                <textarea
                  rows={8}
                  placeholder="Rédigez votre synthèse, snippets de code, liens..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition shadow-sm"
                >
                  {isEditing ? 'Enregistrer' : 'Créer la note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
