import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import SlotModal, { DAYS_NAMES } from './SlotModal';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  GripVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

function timeToHourFloat(tStr) {
  if (!tStr) return 8;
  const [h, m] = tStr.split(':').map(Number);
  return h + m / 60;
}

export default function WeeklyCalendar() {
  const { slots, tasks, assignTaskToCalendar, setIsAiOpen } = useApp();

  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultSlotProps, setDefaultSlotProps] = useState({ day: 0, hour: '09:00' });
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null); // { day, hour }

  // Compute dates for the week
  const getWeekDates = (offset) => {
    // Current base: 28 Septembre 2026 (Lundi)
    const baseMonday = new Date(2026, 8, 28);
    baseMonday.setDate(baseMonday.getDate() + offset * 7);

    return DAYS_NAMES.map((name, idx) => {
      const d = new Date(baseMonday);
      d.setDate(baseMonday.getDate() + idx);
      return {
        name,
        dateNum: d.getDate(),
        month: d.toLocaleString('fr-FR', { month: 'short' }),
        fullDateStr: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      };
    });
  };

  const weekDays = getWeekDates(weekOffset);

  // Unscheduled or pending tasks for the Kanban drawer
  const pendingTasks = tasks.filter((t) => t.status !== 'done');

  const handleCellClick = (dayIdx, hourStr) => {
    setDefaultSlotProps({ day: dayIdx, hour: hourStr });
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSlotClick = (e, slot) => {
    e.stopPropagation();
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  // Drag and drop from Jira tasks
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e, dayIdx, hourStr) => {
    e.preventDefault();
    setDragOverCell({ day: dayIdx, hour: hourStr });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = async (e, dayIdx, hourStr) => {
    e.preventDefault();
    setDragOverCell(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (!taskId) return;

    const [h] = hourStr.split(':').map(Number);
    const endH = Math.min(22, h + 2);
    const endTimeStr = `${String(endH).padStart(2, '0')}:00`;

    await assignTaskToCalendar(taskId, dayIdx, hourStr, endTimeStr);
    setDraggedTaskId(null);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header & Controls */}
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 lg:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest/10 text-forest">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-forest">Planning Hebdomadaire</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Semaine du {weekDays[0].dateNum} {weekDays[0].month} au {weekDays[6].dateNum} {weekDays[6].month} 2026
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3F5B44] text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-white" />
            Cours / École
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#B7C99A] text-[#203324] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#203324]" />
            Veille / Docs
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E7AEB4] text-[#3E1119] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#3E1119]" />
            Candidatures / Sport
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8C3B4C] text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-white" />
            Présentation / Entretien
          </span>
        </div>

        {/* Navigation & Add button */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center bg-[#EAE3D2] rounded-xl p-1 border border-[#3F5B44]/10">
            <button
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="p-1.5 rounded-lg hover:bg-[#F5F1E6] text-gray-700 transition"
              title="Semaine précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1 text-xs font-semibold text-forest hover:bg-[#F5F1E6] rounded-lg transition"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="p-1.5 rounded-lg hover:bg-[#F5F1E6] text-gray-700 transition"
              title="Semaine suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedSlot(null);
              setDefaultSlotProps({ day: 0, hour: '09:00' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau créneau</span>
          </button>
        </div>
      </div>

      {/* Main Grid + Draggable Jira Task Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Calendar Grid (10 cols) */}
        <div className="lg:col-span-9 bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              {/* Day headers */}
              <div className="grid grid-cols-8 border-b border-[#3F5B44]/15 bg-[#EAE3D2]/70 text-center">
                <div className="py-3 px-2 border-r border-[#3F5B44]/10 text-xs font-semibold text-gray-500 uppercase flex items-center justify-center">
                  Heure
                </div>
                {weekDays.map((d, idx) => (
                  <div
                    key={idx}
                    className={`py-3 px-2 border-r last:border-r-0 border-[#3F5B44]/10 ${
                      idx === 0 ? 'bg-forest/10 font-bold' : ''
                    }`}
                  >
                    <div className="text-xs font-bold text-forest tracking-tight">{d.name}</div>
                    <div className="text-[11px] text-gray-600">
                      {d.dateNum} {d.month}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time grid body */}
              <div className="relative">
                {HOURS.map((hourStr, hourIdx) => (
                  <div
                    key={hourStr}
                    className="grid grid-cols-8 border-b border-gray-200/80 min-h-[64px]"
                  >
                    {/* Time column */}
                    <div className="py-2 px-2 border-r border-[#3F5B44]/10 text-[11px] font-semibold text-gray-500 flex items-start justify-center bg-[#EAE3D2]/30 select-none">
                      {hourStr}
                    </div>

                    {/* Day cells */}
                    {weekDays.map((_, dayIdx) => {
                      const isHovered =
                        dragOverCell && dragOverCell.day === dayIdx && dragOverCell.hour === hourStr;
                      return (
                        <div
                          key={dayIdx}
                          onClick={() => handleCellClick(dayIdx, hourStr)}
                          onDragOver={(e) => handleDragOver(e, dayIdx, hourStr)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, dayIdx, hourStr)}
                          className={`relative border-r last:border-r-0 border-gray-200/80 p-1 cursor-pointer transition-colors ${
                            isHovered
                              ? 'bg-forest/20 ring-2 ring-forest ring-inset'
                              : 'hover:bg-cream-dark/50'
                          }`}
                        >
                          {/* Indicator line on hover */}
                          <span className="text-[9px] text-gray-400 opacity-0 hover:opacity-100 select-none">
                            + {hourStr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Render colored event blocks absolutely positioned */}
                {slots.map((slot) => {
                  const startH = timeToHourFloat(slot.startTime);
                  const endH = timeToHourFloat(slot.endTime);
                  const duration = Math.max(0.5, endH - startH);

                  // Base is 8:00 AM (start of grid), row height is 64px
                  const topPx = (startH - 8) * 64;
                  const heightPx = Math.max(36, duration * 64 - 4);
                  // Day column width: 1/8 of 100%, offset by 1 column
                  const leftPercent = ((slot.day + 1) / 8) * 100;
                  const widthPercent = (1 / 8) * 100;

                  const isDarkBg = slot.category === 'cours' || slot.category === 'presentation' || slot.category === 'entretiens' || slot.category === 'problem_solving';

                  return (
                    <div
                      key={slot.id}
                      onClick={(e) => handleSlotClick(e, slot)}
                      style={{
                        top: `${topPx}px`,
                        height: `${heightPx}px`,
                        left: `calc(${leftPercent}% + 2px)`,
                        width: `calc(${widthPercent}% - 4px)`,
                        backgroundColor: slot.color || '#3F5B44'
                      }}
                      className={`absolute z-10 rounded-xl p-2 cursor-pointer shadow-xs border border-white/20 hover:scale-[1.01] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between ${
                        isDarkBg ? 'text-white' : 'text-[#203324]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-bold opacity-80 truncate">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {slot.taskId && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-white font-mono shrink-0">
                              Jira
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-xs leading-tight line-clamp-2">
                          {slot.title}
                        </h4>
                      </div>

                      {slot.location && (
                        <div className="flex items-center gap-1 text-[10px] opacity-80 truncate mt-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{slot.location}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 7 Drag & Drop Sync: Jira Tasks Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-forest" />
                <h3 className="font-bold text-sm text-forest">Tâches à planifier</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-forest/10 text-forest font-semibold">
                {pendingTasks.length}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 mb-3">
              💡 <strong>Glissez-déposez</strong> une tâche directement sur un créneau libre du planning pour la programmer instantanément !
            </p>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {pendingTasks.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  className="p-3 bg-white rounded-xl border border-gray-200 hover:border-forest shadow-xs hover:shadow-md transition cursor-grab active:cursor-grabbing select-none group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        t.priority === 'urgent'
                          ? 'bg-wine/15 text-wine'
                          : t.priority === 'high'
                          ? 'bg-rose/40 text-wine'
                          : 'bg-sage/40 text-forest'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {t.progress}%
                    </span>
                  </div>

                  <h5 className="font-semibold text-xs text-gray-800 mt-1.5 group-hover:text-forest line-clamp-2">
                    {t.title}
                  </h5>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1 mt-2 overflow-hidden">
                    <div
                      className="bg-forest h-1 rounded-full transition-all"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>
              ))}

              {pendingTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Toutes les tâches sont terminées !
                </div>
              )}
            </div>
          </div>

          {/* Assistant IA Fast Assist */}
          <div className="bg-gradient-to-br from-[#EAE3D2] to-[#FCFAF6] border border-[#3F5B44]/20 rounded-2xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-wine font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Besoin d'aide pour planifier ?</span>
            </div>
            <p className="text-[11px] text-gray-600">
              L'Assistant IA peut organiser automatiquement votre semaine et libérer du temps pour vos urgences.
            </p>
            <button
              onClick={() => setIsAiOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ouvrir l'Assistant IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slot Modal (Add / Edit / Delete) */}
      <SlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedSlot}
        defaultDay={defaultSlotProps.day}
        defaultHour={defaultSlotProps.hour}
      />
    </div>
  );
}
