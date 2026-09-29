import { store } from '../data/store.js';
import { CATEGORY_COLORS } from './slotController.js';

export const getApplications = (req, res) => {
  try {
    const { status } = req.query;
    let apps = store.get('applications');
    if (status) {
      apps = apps.filter((a) => a.status === status);
    }
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createApplication = (req, res) => {
  try {
    const { company, role, location, url, status, appliedDate, satisfactionRating, difficultyRating, notes } = req.body;
    if (!company || !role) {
      return res.status(400).json({ error: 'Entreprise et Poste sont obligatoires' });
    }

    const newApp = store.insert('applications', {
      company,
      role,
      location: location || '',
      url: url || '',
      status: status || 'applied',
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      interviewDate: null,
      satisfactionRating: satisfactionRating ? Number(satisfactionRating) : 4,
      difficultyRating: difficultyRating ? Number(difficultyRating) : 3,
      notes: notes || ''
    });

    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateApplication = (req, res) => {
  try {
    const app = store.findById('applications', req.params.id);
    if (!app) return res.status(404).json({ error: 'Candidature non trouvée' });

    const updated = store.update('applications', req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteApplication = (req, res) => {
  try {
    const deleted = store.delete('applications', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Candidature non trouvée' });
    res.json({ message: 'Candidature supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Section 4.6: Dynamic Interview Management -> Auto-sync to Calendar without double entry!
export const addInterview = (req, res) => {
  try {
    const { applicationId, interviewDate, day, startTime, endTime, location, notes } = req.body;
    const app = store.findById('applications', applicationId);
    if (!app) return res.status(404).json({ error: 'Candidature non trouvée' });

    // 1. Update application status to 'interview'
    const updatedApp = store.update('applications', applicationId, {
      status: 'interview',
      interviewDate: interviewDate || new Date().toISOString()
    });

    // 2. Automatically create a Bordeaux slot in the calendar
    const slotTitle = `Entretien : ${app.company} (${app.role})`;
    const slotDay = day !== undefined ? parseInt(day, 10) : 3; // default Jeudi if not specified
    const slotStartTime = startTime || '14:30';
    const slotEndTime = endTime || '16:00';

    const newSlot = store.insert('slots', {
      title: slotTitle,
      day: slotDay,
      startTime: slotStartTime,
      endTime: slotEndTime,
      category: 'entretiens',
      color: CATEGORY_COLORS.entretiens, // #8C3B4C Bordeaux
      location: location || 'Visioconférence / Siège',
      notes: notes || `Entretien pour le poste de ${app.role} chez ${app.company}. Notes: ${app.notes}`,
      taskId: null
    });

    // 3. Log event
    store.insert('activityLogs', {
      taskId: app.id,
      taskTitle: slotTitle,
      action: 'scheduled',
      details: `Entretien synchronisé automatiquement dans le planning (Jour ${slotDay}, ${slotStartTime}-${slotEndTime}).`
    });

    res.status(201).json({
      message: 'Entretien programmé et synchronisé dans le planning avec succès',
      application: updatedApp,
      slot: newSlot
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
