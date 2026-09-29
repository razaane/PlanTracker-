import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Plus,
  CalendarCheck,
  Building,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { DAYS_NAMES } from '../calendar/SlotModal';

export default function JobTracker() {
  const { applications, addApplication, updateApplication, scheduleInterview } = useApp();

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // New Application Form State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('applied');
  const [notes, setNotes] = useState('');

  // Interview Schedule Form State
  const [interviewDay, setInterviewDay] = useState(3); // Jeudi
  const [interviewStartTime, setInterviewStartTime] = useState('14:30');
  const [interviewEndTime, setInterviewEndTime] = useState('16:00');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet / Visioconférence');
  const [interviewNotes, setInterviewNotes] = useState('');

  const handleOpenInterviewModal = (app) => {
    setSelectedApp(app);
    setInterviewLocation('Google Meet / Entretien Technique');
    setInterviewNotes(`Entretien technique pour ${app.role} chez ${app.company}.`);
    setIsInterviewModalOpen(true);
  };

  const handleSaveInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    await scheduleInterview({
      applicationId: selectedApp.id,
      day: interviewDay,
      startTime: interviewStartTime,
      endTime: interviewEndTime,
      location: interviewLocation,
      notes: interviewNotes
    });

    setIsInterviewModalOpen(false);
  };

  const handleSaveApp = async (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    await addApplication({
      company,
      role,
      location,
      url,
      status,
      notes
    });

    setCompany('');
    setRole('');
    setLocation('');
    setUrl('');
    setNotes('');
    setIsAppModalOpen(false);
  };

  const statusBadges = {
    applied: { label: 'Candidature Envoyée', bg: 'bg-[#B7C99A]/30 text-[#203324] border-[#B7C99A]' },
    interview: { label: 'Entretien Décroché', bg: 'bg-[#8C3B4C]/20 text-wine border-[#8C3B4C]' },
    offer: { label: 'Offre Reçue 🎉', bg: 'bg-forest/20 text-forest border-forest' },
    rejected: { label: 'Non Retenu', bg: 'bg-gray-100 text-gray-500 border-gray-200' },
    draft: { label: 'Brouillon', bg: 'bg-amber-100 text-amber-800 border-amber-200' }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 lg:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest/10 text-forest">
              <Briefcase className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-forest">Pipeline Candidatures & Entretiens</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Suivi des offres LinkedIn et synchronisation automatique des entretiens dans le planning
          </p>
        </div>

        <button
          onClick={() => setIsAppModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition shadow-xs self-end md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une candidature</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div>
              {/* Header company & status badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EAE3D2] flex items-center justify-center text-forest">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 leading-tight">
                      {app.company}
                    </h4>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {app.location || 'Maroc / Remote'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    statusBadges[app.status]?.bg || 'bg-gray-100'
                  }`}
                >
                  {statusBadges[app.status]?.label || app.status}
                </span>
              </div>

              {/* Role Title */}
              <h5 className="font-semibold text-xs text-forest mt-2">{app.role}</h5>

              {/* Notes */}
              {app.notes && (
                <p className="text-xs text-gray-600 bg-white/80 p-2.5 rounded-xl border border-gray-200/60 mt-2.5 leading-relaxed">
                  {app.notes}
                </p>
              )}

              {/* Date & Link */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
                <span>Postulé le {app.appliedDate}</span>
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forest hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Lien offre</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-gray-100">
              {app.status !== 'interview' ? (
                <button
                  onClick={() => handleOpenInterviewModal(app)}
                  className="w-full py-2 px-3 rounded-xl bg-wine hover:bg-wine-light text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Programmer un Entretien</span>
                </button>
              ) : (
                <div className="w-full py-2 px-3 rounded-xl bg-wine/10 text-wine text-xs font-semibold text-center flex items-center justify-center gap-1.5 border border-wine/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wine" />
                  <span>Entretien synchronisé au planning</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Programmer un Entretien (Direct Sync with Calendar) */}
      {isInterviewModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FCFAF6] border border-[#3F5B44]/20 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-scaleUp">
            <div className="bg-[#8C3B4C] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">
                  Programmer l'Entretien avec {selectedApp.company}
                </h3>
              </div>
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="p-6 space-y-4">
              <p className="text-xs text-gray-600 bg-[#EAE3D2]/50 p-2.5 rounded-xl border border-[#3F5B44]/15">
                💡 Cet entretien sera <strong>automatiquement inséré</strong> dans votre planning hebdomadaire avec le code couleur <strong>Bordeaux (#8C3B4C)</strong> et mettra à jour votre tableau de bord sans ressaisie.
              </p>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Jour de l'entretien
                </label>
                <select
                  value={interviewDay}
                  onChange={(e) => setInterviewDay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-wine/40"
                >
                  {DAYS_NAMES.map((dName, idx) => (
                    <option key={idx} value={idx}>
                      {dName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Heure Début
                  </label>
                  <input
                    type="time"
                    value={interviewStartTime}
                    onChange={(e) => setInterviewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-wine/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Heure Fin
                  </label>
                  <input
                    type="time"
                    value={interviewEndTime}
                    onChange={(e) => setInterviewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-wine/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Lieu / Lien de visioconférence
                </label>
                <input
                  type="text"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-wine/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Notes préparatoires
                </label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-wine/40"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-light text-white text-xs font-semibold transition shadow-sm"
                >
                  Synchroniser dans le planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nouvelle Candidature */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FCFAF6] border border-[#3F5B44]/20 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-scaleUp">
            <div className="bg-[#EAE3D2] px-6 py-4 flex items-center justify-between border-b border-[#3F5B44]/15">
              <h3 className="font-bold text-forest text-base">Nouvelle Candidature LinkedIn</h3>
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApp} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Entreprise
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Oracle, Orange, Amazon..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Intitulé du Poste
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Développeur Fullstack MERN"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    placeholder="Casablanca / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Statut initial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                  >
                    <option value="applied">Envoyée</option>
                    <option value="draft">Brouillon</option>
                    <option value="interview">Entretien</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Lien de l'offre (Optionnel)
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/jobs/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Notes & Suivi
                </label>
                <textarea
                  rows={2}
                  placeholder="Contact RH, salaire mentionné, relance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition shadow-sm"
                >
                  Ajouter au suivi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
