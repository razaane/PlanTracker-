import React, { useState, useEffect } from 'react';
import { X, History, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function ActivityLogModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .getActivityLogs()
        .then((data) => setLogs(data || []))
        .catch(() => setLogs([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/20 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-[#EAE3D2] px-6 py-4 flex items-center justify-between border-b border-[#3F5B44]/15">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-forest" />
            <h3 className="font-bold text-forest text-lg">
              Journal d'Activité & Changements Jira
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-[#F5F1E6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">Chargement du journal...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">Aucun événement enregistré.</div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-white border border-gray-200/80 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-forest truncate">
                    {log.taskTitle}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString('fr-FR', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-700">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      log.action === 'completed'
                        ? 'bg-forest/15 text-forest'
                        : log.action === 'status_change'
                        ? 'bg-sage/40 text-forest'
                        : log.action === 'scheduled'
                        ? 'bg-rose/40 text-wine'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span>{log.details}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EAE3D2]/50 border-t border-[#3F5B44]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
