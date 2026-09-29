import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'kanban', 'dashboard', 'jobs', 'docs', 'ai'
  const [tasks, setTasks] = useState([]);
  const [slots, setSlots] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [conflicts, setConflicts] = useState({ hasConflicts: false, conflicts: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        tasksData,
        slotsData,
        appsData,
        notesData,
        projectsData,
        metricsData,
        remindersData,
        conflictsData
      ] = await Promise.all([
        api.getTasks().catch(() => []),
        api.getSlots().catch(() => []),
        api.getApplications().catch(() => []),
        api.getNotes().catch(() => []),
        api.getProjects().catch(() => []),
        api.getDashboardMetrics().catch(() => null),
        api.getReminders().catch(() => []),
        api.detectConflicts().catch(() => ({ hasConflicts: false, conflicts: [] }))
      ]);

      setTasks(tasksData);
      setSlots(slotsData);
      setApplications(appsData);
      setNotes(notesData);
      setProjects(projectsData);
      setMetrics(metricsData);
      setReminders(remindersData);
      setConflicts(conflictsData);
    } catch (err) {
      console.error('Failed to load application data:', err);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Tasks actions
  const addTask = async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      showToast('Tâche créée avec succès');
      loadAllData();
      return newTask;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const updated = await api.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast('Tâche mise à jour');
      loadAllData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Tâche supprimée');
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      const updated = await api.toggleSubtask(taskId, subtaskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Slots actions
  const addSlot = async (slotData) => {
    try {
      const newSlot = await api.createSlot(slotData);
      setSlots((prev) => [...prev, newSlot]);
      showToast('Créneau ajouté au calendrier');
      loadAllData();
      return newSlot;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateSlot = async (id, updates) => {
    try {
      const updated = await api.updateSlot(id, updates);
      setSlots((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('Créneau mis à jour');
      loadAllData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteSlot = async (id) => {
    try {
      await api.deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
      showToast('Créneau supprimé');
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const assignTaskToCalendar = async (taskId, day, startTime, endTime, category) => {
    try {
      const result = await api.assignTaskToSlot({ taskId, day, startTime, endTime, category });
      showToast('Tâche planifiée avec succès dans l’agenda !');
      loadAllData();
      return result;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Applications & Interviews actions
  const addApplication = async (data) => {
    try {
      const newApp = await api.createApplication(data);
      setApplications((prev) => [newApp, ...prev]);
      showToast('Candidature enregistrée');
      loadAllData();
      return newApp;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateApplication = async (id, data) => {
    try {
      const updated = await api.updateApplication(id, data);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('Candidature mise à jour');
      loadAllData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const scheduleInterview = async (interviewData) => {
    try {
      const result = await api.addInterview(interviewData);
      showToast('Entretien programmé et synchronisé dans le planning !');
      loadAllData();
      return result;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Notes actions
  const addNote = async (data) => {
    try {
      const newNote = await api.createNote(data);
      setNotes((prev) => [newNote, ...prev]);
      showToast('Note créée avec succès');
      loadAllData();
      return newNote;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateNote = async (id, data) => {
    try {
      const updated = await api.updateNote(id, data);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      showToast('Note mise à jour');
      loadAllData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      showToast('Note supprimée');
      loadAllData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tasks,
        slots,
        applications,
        notes,
        projects,
        metrics,
        reminders,
        conflicts,
        loading,
        toast,
        showToast,
        isAiOpen,
        setIsAiOpen,
        loadAllData,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        addSlot,
        updateSlot,
        deleteSlot,
        assignTaskToCalendar,
        addApplication,
        updateApplication,
        scheduleInterview,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
