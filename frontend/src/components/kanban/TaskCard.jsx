import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckSquare,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Tag,
  AlertCircle
} from 'lucide-react';

const STATUS_FLOW = ['todo', 'in_progress', 'in_review', 'done'];

export default function TaskCard({ task, onEdit }) {
  const { updateTask, deleteTask, toggleSubtask, projects } = useApp();
  const [showSubtasks, setShowSubtasks] = useState(false);

  const project = projects.find((p) => p.id === task.projectId);

  const handleStatusChange = (newStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const currentIndex = STATUS_FLOW.indexOf(task.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_FLOW.length - 1;

  const priorityStyles = {
    urgent: 'bg-[#8C3B4C] text-white border-[#8C3B4C]',
    high: 'bg-[#E7AEB4] text-[#3E1119] border-[#D99198]',
    medium: 'bg-[#B7C99A] text-[#203324] border-[#9CB17E]',
    low: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-md transition-all p-4 space-y-3 group select-none">
      {/* Top badges: Project & Priority */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full truncate"
          style={{
            backgroundColor: `${project?.color || '#3F5B44'}15`,
            color: project?.color || '#3F5B44'
          }}
        >
          {project?.name || 'Projet'}
        </span>

        <span
          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md border tracking-wider ${
            priorityStyles[task.priority] || priorityStyles.medium
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="font-bold text-sm text-gray-900 group-hover:text-forest transition-colors leading-snug">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-[#F5F1E6] text-gray-600 font-medium"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Progress & Subtasks */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <button
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="flex items-center gap-1.5 hover:text-forest font-semibold transition"
          >
            <CheckSquare className="w-3.5 h-3.5 text-forest" />
            <span>
              Sous-tâches ({completedSubtasks}/{totalSubtasks})
            </span>
          </button>
          <span className="font-bold text-forest">{task.progress || 0}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${task.progress || 0}%`,
              backgroundColor: task.progress === 100 ? '#3F5B44' : '#B7C99A'
            }}
          />
        </div>

        {/* Collapsible Subtasks Checklist */}
        {showSubtasks && totalSubtasks > 0 && (
          <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5 animate-fadeIn">
            {task.subtasks.map((st) => (
              <label
                key={st.id}
                className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => toggleSubtask(task.id, st.id)}
                  className="rounded text-forest focus:ring-forest w-3.5 h-3.5"
                />
                <span className={st.completed ? 'line-through text-gray-400' : ''}>
                  {st.title}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Due Date & Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-1 text-[11px]">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span>{task.dueDate || 'Non définie'}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Move left */}
          {canMoveLeft && (
            <button
              onClick={() => handleStatusChange(STATUS_FLOW[currentIndex - 1])}
              className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-forest transition"
              title="Déplacer vers la gauche"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Move right */}
          {canMoveRight && (
            <button
              onClick={() => handleStatusChange(STATUS_FLOW[currentIndex + 1])}
              className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-forest transition"
              title="Déplacer vers la droite"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-forest transition"
            title="Modifier"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              if (window.confirm('Voulez-vous supprimer cette tâche ?')) {
                deleteTask(task.id);
              }
            }}
            className="p-1 rounded hover:bg-wine/10 text-gray-400 hover:text-wine transition"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
