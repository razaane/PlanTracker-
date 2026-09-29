import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Sparkles,
  X,
  Send,
  Zap,
  AlertTriangle,
  FileSpreadsheet,
  Bell,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Bot,
  User
} from 'lucide-react';

export default function AIAssistantDrawer() {
  const {
    isAiOpen,
    setIsAiOpen,
    loadAllData,
    showToast,
    conflicts,
    reminders
  } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "Bonjour ! Je suis votre **Assistant IA PlanTracker**. Je peux optimiser votre emploi du temps, détecter vos conflits d'horaires, vous rappeler vos relances de candidatures, ou répondre à des requêtes comme : *« Libère-moi du temps jeudi pour une présentation »*."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  if (!isAiOpen) return null;

  const handleSendMessage = async (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query || isLoading) return;

    const userMsg = { id: `msg-u-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.chatAI(query);
      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply || "Action effectuée avec succès dans votre planning !"
      };
      setMessages((prev) => [...prev, aiMsg]);

      // If an action was taken, reload data
      if (response.action && response.action !== 'answered') {
        showToast('Planning mis à jour par l’IA !');
        loadAllData();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Erreur : ${err.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOptimize = async () => {
    setIsLoading(true);
    try {
      const res = await api.optimizeSchedule(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-opt-${Date.now()}`,
          sender: 'ai',
          text: `⚡ **Optimisation Réussie !** ${res.message}`
        }
      ]);
      showToast('Créneaux optimisés insérés dans le calendrier !');
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSummary = async () => {
    setIsLoading(true);
    try {
      const sum = await api.getWeeklySummary();
      setSummaryData(sum);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sum-${Date.now()}`,
          sender: 'ai',
          text: `📊 **${sum.headline}**\n\n${sum.highlights.join('\n- ')}\n\n*Volume total planifié : ${sum.totalScheduledHours} heures.*`
        }
      ]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#FCFAF6] border-l border-[#3F5B44]/20 shadow-2xl flex flex-col justify-between animate-slideLeft">
      {/* Header */}
      <div className="bg-[#3F5B44] text-[#F5F1E6] p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F5F1E6] text-forest flex items-center justify-center">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Assistant IA PlanTracker</h3>
            <span className="text-[10px] text-sage font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-ping" />
              Moteur Intelligent & Orchestrateur MERN
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsAiOpen(false)}
          className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-forest-light transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Badges */}
      <div className="p-3 bg-[#EAE3D2]/70 border-b border-[#3F5B44]/15 space-y-2">
        <div className="text-[10px] font-bold uppercase text-forest tracking-wider">
          Actions Rapides en 1 Clic
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleQuickOptimize}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#3F5B44]/20 hover:border-forest text-xs font-semibold text-forest shadow-2xs hover:shadow-xs transition"
          >
            <Zap className="w-3.5 h-3.5 text-forest" />
            <span className="truncate">Optimiser Semaine</span>
          </button>

          <button
            onClick={handleGetSummary}
            disabled={isLoading}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#3F5B44]/20 hover:border-forest text-xs font-semibold text-forest shadow-2xs hover:shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sage-dark" />
            <span className="truncate">Bilan Hebdo</span>
          </button>
        </div>

        {/* Conflicts Alert Card */}
        {conflicts.hasConflicts && (
          <div className="p-2.5 rounded-xl bg-wine/10 border border-wine/30 text-xs text-wine space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-wine" />
              <span>{conflicts.totalConflicts} Conflit(s) Détecté(s)</span>
            </div>
            {conflicts.conflicts.map((c, i) => (
              <p key={i} className="text-[11px] text-gray-700 leading-tight">
                • {c.dayName} : {c.recommendation}
              </p>
            ))}
          </div>
        )}

        {/* Reminders List */}
        {reminders.length > 0 && (
          <div className="p-2.5 rounded-xl bg-sage/20 border border-sage/40 text-xs text-forest space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Bell className="w-4 h-4 text-forest" />
              <span>{reminders.length} Rappel(s) en attente</span>
            </div>
            <p className="text-[11px] text-gray-700 line-clamp-2">
              {reminders[0].title} : {reminders[0].description}
            </p>
          </div>
        )}
      </div>

      {/* Messages Thread */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-6 h-6 rounded-lg bg-forest text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-forest text-white rounded-tr-xs'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-xs shadow-2xs whitespace-pre-line'
              }`}
            >
              {m.text}
            </div>

            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-[#EAE3D2] text-forest flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 text-xs italic">
            <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
            <span>L'Assistant analyse votre requête...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts Pill */}
      <div className="px-4 py-2 bg-[#FCFAF6] border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => handleSendMessage('Libère-moi du temps jeudi pour une présentation')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-[#EAE3D2] text-forest hover:bg-forest hover:text-white transition whitespace-nowrap"
        >
          💬 Libère du temps jeudi
        </button>
        <button
          onClick={() => handleSendMessage('Ajoute 2h de veille technologique mardi')}
          className="text-[11px] px-2.5 py-1 rounded-full bg-[#EAE3D2] text-forest hover:bg-forest hover:text-white transition whitespace-nowrap"
        >
          💬 2h de veille mardi
        </button>
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Posez une question ou donnez un ordre à l'IA..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#FCFAF6] text-xs focus:outline-none focus:ring-2 focus:ring-forest/40"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-forest hover:bg-forest-light text-white transition disabled:opacity-50 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
