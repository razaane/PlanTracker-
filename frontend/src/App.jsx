import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import WeeklyCalendar from './components/calendar/WeeklyCalendar';
import KanbanBoard from './components/kanban/KanbanBoard';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import JobTracker from './components/jobs/JobTracker';
import DocsWorkspace from './components/docs/DocsWorkspace';
import AIAssistantDrawer from './components/ai/AIAssistantDrawer';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function MainLayout() {
  const { activeTab, toast } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F1E6] text-gray-800 flex flex-col font-sans selection:bg-[#B7C99A] selection:text-[#3F5B44]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'calendar' && <WeeklyCalendar />}
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'dashboard' && <AnalyticsDashboard />}
        {activeTab === 'jobs' && <JobTracker />}
        {activeTab === 'docs' && <DocsWorkspace />}
      </main>

      {/* Floating AI Assistant Drawer */}
      <AIAssistantDrawer />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
              toast.type === 'error'
                ? 'bg-wine text-white border-wine-dark'
                : 'bg-forest text-white border-forest-dark'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#EAE3D2]/70 border-t border-[#3F5B44]/15 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PlanTracker — Plateforme Intelligente de Suivi Scolaire & Recherche d'Emploi</span>
          <span className="font-medium text-forest">MERN Stack Architecture • Version 1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
