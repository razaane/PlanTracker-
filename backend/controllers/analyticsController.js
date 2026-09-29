import { store } from '../data/store.js';

// Helper to compute duration in hours between two time strings like '08:30' and '11:30'
function getDurationHours(startTime, endTime) {
  if (!startTime || !endTime) return 1;
  const [h1, m1] = startTime.split(':').map(Number);
  const [h2, m2] = endTime.split(':').map(Number);
  const minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
  return Math.max(0.5, Number((minutes / 60).toFixed(1)));
}

export const getDashboardMetrics = (req, res) => {
  try {
    const tasks = store.get('tasks');
    const slots = store.get('slots');
    const applications = store.get('applications');

    // 1. KPI Cards
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const avgProgress =
      totalTasks > 0
        ? Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / totalTasks)
        : 0;
    const totalApplications = applications.length;
    const totalInterviews = applications.filter(
      (a) => a.status === 'interview' || a.interviewDate
    ).length;
    const totalOffers = applications.filter((a) => a.status === 'offer').length;

    // 2. Time Allocation (Donut Chart - counterpart to Department Wise Attrition)
    const categoryLabels = {
      cours: 'Cours & Scolaire',
      veille: 'Veille Tech',
      candidatures: 'Candidatures LinkedIn',
      sport_trajets: 'Sport & Trajets',
      presentation: 'Présentations',
      entretiens: 'Entretiens',
      problem_solving: 'Problem Solving',
      documentation: 'Documentation'
    };

    const categoryColors = {
      cours: '#3F5B44',
      veille: '#B7C99A',
      candidatures: '#E7AEB4',
      sport_trajets: '#D99198',
      presentation: '#8C3B4C',
      entretiens: '#A44A5D',
      problem_solving: '#526D82',
      documentation: '#9CB17E'
    };

    const timeMap = {};
    slots.forEach((slot) => {
      const cat = slot.category || 'cours';
      const hours = getDurationHours(slot.startTime, slot.endTime);
      timeMap[cat] = (timeMap[cat] || 0) + hours;
    });

    const timeAllocation = Object.entries(timeMap).map(([category, hours]) => ({
      category,
      label: categoryLabels[category] || category,
      hours: Number(hours.toFixed(1)),
      color: categoryColors[category] || '#3F5B44'
    }));

    // 3. Weekly Hours by Category (Histogram - counterpart to Number of Employee by Age Group)
    // Planned hours vs Realized/Engaged hours
    const weeklyHours = [
      {
        category: 'Cours / Projets',
        planned: timeMap['cours'] || 6,
        realized: Math.max(0, (timeMap['cours'] || 6) * 0.9),
        color: '#3F5B44'
      },
      {
        category: 'Veille & Docs',
        planned: (timeMap['veille'] || 2) + (timeMap['documentation'] || 2),
        realized: ((timeMap['veille'] || 2) + (timeMap['documentation'] || 2)) * 0.85,
        color: '#B7C99A'
      },
      {
        category: 'Candidatures & Ent.',
        planned: (timeMap['candidatures'] || 2) + (timeMap['entretiens'] || 1.5),
        realized: (timeMap['candidatures'] || 2) + (timeMap['entretiens'] || 1.5),
        color: '#8C3B4C'
      },
      {
        category: 'Problem Solving',
        planned: timeMap['problem_solving'] || 2,
        realized: (timeMap['problem_solving'] || 2) * 0.7,
        color: '#526D82'
      },
      {
        category: 'Sport & Trajets',
        planned: timeMap['sport_trajets'] || 3,
        realized: (timeMap['sport_trajets'] || 3) * 1.0,
        color: '#E7AEB4'
      }
    ];

    // 4. Satisfaction / Difficulty Matrix (Cross-table Heatmap - counterpart to Job Satisfaction Rating)
    const satisfactionMatrix = [
      {
        subject: 'Architecture MERN',
        type: 'Académique',
        satisfaction: 5,
        difficulty: 4,
        status: 'Maîtrisé'
      },
      {
        subject: 'Entretien Capgemini',
        type: 'Emploi',
        satisfaction: 5,
        difficulty: 4,
        status: 'En cours'
      },
      {
        subject: 'Candidatures LinkedIn',
        type: 'Emploi',
        satisfaction: 4,
        difficulty: 3,
        status: 'Régulier'
      },
      {
        subject: 'Problem Solving LeetCode',
        type: 'Technique',
        satisfaction: 4,
        difficulty: 5,
        status: 'En progression'
      },
      {
        subject: 'Veille React 19 / RSC',
        type: 'Veille',
        satisfaction: 5,
        difficulty: 2,
        status: 'Assimilé'
      }
    ];

    // 5. Application Funnel / Pipeline Rings (Radial counterpart to Attrition Rate by Age/Gender)
    const applicationFunnel = [
      { name: 'Candidatures', value: totalApplications, max: totalApplications || 10, fill: '#E7AEB4' },
      { name: 'En cours', value: applications.filter(a => a.status === 'applied').length, max: totalApplications || 10, fill: '#B7C99A' },
      { name: 'Entretiens', value: totalInterviews, max: totalApplications || 10, fill: '#8C3B4C' },
      { name: 'Offres', value: totalOffers, max: totalApplications || 10, fill: '#3F5B44' }
    ];

    res.json({
      kpis: {
        totalTasks,
        completedTasks,
        avgProgress,
        totalApplications,
        totalInterviews,
        totalOffers,
        totalHoursPlanned: Number(
          Object.values(timeMap).reduce((a, b) => a + b, 0).toFixed(1)
        )
      },
      timeAllocation,
      weeklyHours,
      satisfactionMatrix,
      applicationFunnel
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
