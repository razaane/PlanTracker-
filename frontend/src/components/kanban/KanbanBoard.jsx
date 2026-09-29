import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import ActivityLogModal from './ActivityLogModal';
import {
  Kanban,
  Plus,
  History,
  Filter,
  CheckCircle,
  Clock,
  Eye,
  ListTodo
} from 'lucide-react';

const COLUMNS = [
  { id: 'todo', label: 'À faire', icon: ListTodo, color: 'border-t-forest' },
  { id: 'in_progress', label: 'En cours', icon: Clock, color: 'border-t-sage-dark' },
  { id: 'in_review', label: 'En revue', icon: Eye, color: 'border-t-rose-dark' },
  { id: 'done', label: 'Terminé', icon: CheckCircle, color: 'border-t-wine' }
];

export default function KanbanBoard() {
  const { tasks, projects } = useApp();

  const [selectedProject, setSelectedProject] = useState('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedProject !== 'all' && t.projectId !== selectedProject) return false;
    return true;
  });

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Board Top Toolbar */}
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 lg:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest/10 text-forest">
              <Kanban className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-forest">Gestion de Projet (Mini-Jira)</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Suivi des tâches, avancement en temps réel, sous-tâches et journal d'activité
          </p>
        </div>

        {/* Filters and Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-2 bg-[#EAE3D2] px-3 py-1.5 rounded-xl border border-[#3F5B44]/10">
            <Filter className="w-4 h-4 text-forest" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Tous les projets</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Log Button */}
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAE3D2] hover:bg-[#EAE3D2]/80 text-forest text-xs font-semibold transition"
          >
            <History className="w-4 h-4" />
            <span>Journal d'activité</span>
          </button>

          {/* Add Task Button */}
          <button
            onClick={handleNewTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle tâche</span>
          </button>
        </div>
      </div>

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              className={`bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[500px] border-t-4 ${col.color}`}
            >
              {/* Column Header */}
              <div className="p-3.5 bg-[#EAE3D2]/50 border-b border-[#3F5B44]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-forest" />
                  <span className="font-bold text-xs text-forest tracking-tight">
                    {col.label}
                  </span>
                </div>
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest text-[11px] font-bold flex items-center justify-center">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-260px)]">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-xs italic">
                    Aucune tâche dans cette colonne
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal (Create / Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialData={editingTask}
      />

      {/* Activity Log Modal */}
      <ActivityLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
}
