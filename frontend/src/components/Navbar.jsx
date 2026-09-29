import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Kanban,
  BarChart3,
  Briefcase,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Bell,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    conflicts,
    reminders,
    isAiOpen,
    setIsAiOpen,
    loadAllData,
    loading
  } = useApp();

  const urgentRemindersCount = reminders.filter((r) => r.priority === 'urgent').length;

  return (
    <header className="sticky top-0 z-40 bg-[#F5F1E6]/95 backdrop-blur border-b border-[#3F5B44]/15 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-[#F5F1E6] shadow-sm">
            <Clock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-forest tracking-tight">PlanTracker</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-forest/10 text-forest border border-forest/20">
                v1.0 MERN
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">
              Suivi Scolaire & Recherche d'Emploi Intelligente
            </p>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#EAE3D2]/70 p-1.5 rounded-2xl border border-[#3F5B44]/10 shadow-inner overflow-x-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-forest text-[#F5F1E6] shadow-sm font-semibold'
                : 'text-gray-700 hover:text-forest hover:bg-[#F5F1E6]/80'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Planning</span>
          </button>

          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'kanban'
                ? 'bg-forest text-[#F5F1E6] shadow-sm font-semibold'
                : 'text-gray-700 hover:text-forest hover:bg-[#F5F1E6]/80'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Jira / Kanban</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-forest text-[#F5F1E6] shadow-sm font-semibold'
                : 'text-gray-700 hover:text-forest hover:bg-[#F5F1E6]/80'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard RH</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'jobs'
                ? 'bg-forest text-[#F5F1E6] shadow-sm font-semibold'
                : 'text-gray-700 hover:text-forest hover:bg-[#F5F1E6]/80'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Candidatures</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
              activeTab === 'docs'
                ? 'bg-forest text-[#F5F1E6] shadow-sm font-semibold'
                : 'text-gray-700 hover:text-forest hover:bg-[#F5F1E6]/80'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Veille & Docs</span>
          </button>
        </nav>

        {/* Actions & AI Assistant CTA */}
        <div className="flex items-center gap-2">
          {/* Conflict indicator */}
          {conflicts.hasConflicts && (
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-wine/10 text-wine border border-wine/30 text-xs font-semibold hover:bg-wine/20 transition animate-pulse"
              title={`${conflicts.totalConflicts} conflit(s) horaire(s) détecté(s)`}
            >
              <AlertTriangle className="w-4 h-4 text-wine" />
              <span className="hidden md:inline">{conflicts.totalConflicts} Conflit(s)</span>
            </button>
          )}

          {/* Urgent reminders badge */}
          {urgentRemindersCount > 0 && (
            <button
              onClick={() => setIsAiOpen(true)}
              className="relative p-2 rounded-xl bg-[#EAE3D2] text-gray-700 hover:text-wine hover:bg-[#EAE3D2]/80 transition"
              title="Rappels urgents"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-wine text-white text-[10px] font-bold flex items-center justify-center">
                {urgentRemindersCount}
              </span>
            </button>
          )}

          {/* Refresh button */}
          <button
            onClick={loadAllData}
            disabled={loading}
            className="p-2 rounded-xl bg-[#EAE3D2] text-gray-700 hover:text-forest hover:bg-[#EAE3D2]/80 transition disabled:opacity-50"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all shadow-sm ${
              isAiOpen
                ? 'bg-wine text-white ring-2 ring-wine/30'
                : 'bg-forest hover:bg-forest-light text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">Assistant IA</span>
          </button>
        </div>
      </div>
    </header>
  );
}
