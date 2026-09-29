import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Briefcase,
  CalendarCheck,
  Clock,
  Filter,
  Star,
  Award
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { metrics, loading } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-forest border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-medium">Chargement des indicateurs analytiques...</p>
        </div>
      </div>
    );
  }

  const { kpis, timeAllocation, weeklyHours, satisfactionMatrix, applicationFunnel } = metrics;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 lg:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest/10 text-forest">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-forest">Tableau de Bord Analytique</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Indicateurs de performance, répartition du temps et suivi de progression (Inspiré du Modèle RH Tableau)
          </p>
        </div>

        {/* Global Filter */}
        <div className="flex items-center gap-2 bg-[#EAE3D2] px-3 py-1.5 rounded-xl border border-[#3F5B44]/10 self-end md:self-auto">
          <Filter className="w-4 h-4 text-forest" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes les catégories</option>
            <option value="academic">Académique / École</option>
            <option value="jobs">Recherche d'emploi</option>
            <option value="personal">Vie perso / Sport</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Band (Section 4.4) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Tasks */}
        <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Total Tâches</span>
            <ListTodo className="w-4 h-4 text-forest" />
          </div>
          <div className="text-2xl font-bold text-forest">{kpis.totalTasks}</div>
          <div className="text-[10px] text-gray-400 mt-1">Jira backlog & sprints</div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Tâches Finies</span>
            <CheckCircle2 className="w-4 h-4 text-forest" />
          </div>
          <div className="text-2xl font-bold text-forest">{kpis.completedTasks}</div>
          <div className="text-[10px] text-forest font-semibold mt-1">
            {kpis.totalTasks > 0
              ? `${Math.round((kpis.completedTasks / kpis.totalTasks) * 100)}% d'achèvement`
              : '0%'}
          </div>
        </div>

        {/* Average Progress */}
        <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Avancement Moyen</span>
            <TrendingUp className="w-4 h-4 text-sage-dark" />
          </div>
          <div className="text-2xl font-bold text-forest">{kpis.avgProgress}%</div>
          <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5 overflow-hidden">
            <div
              className="bg-forest h-1 rounded-full"
              style={{ width: `${kpis.avgProgress}%` }}
            />
          </div>
        </div>

        {/* Applications Sent */}
        <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Candidatures</span>
            <Briefcase className="w-4 h-4 text-wine" />
          </div>
          <div className="text-2xl font-bold text-forest">{kpis.totalApplications}</div>
          <div className="text-[10px] text-gray-400 mt-1">LinkedIn & Réseau</div>
        </div>

        {/* Interviews Obtained */}
        <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Entretiens</span>
            <CalendarCheck className="w-4 h-4 text-wine" />
          </div>
          <div className="text-2xl font-bold text-wine">{kpis.totalInterviews}</div>
          <div className="text-[10px] text-wine font-semibold mt-1">
            {kpis.totalApplications > 0
              ? `${Math.round((kpis.totalInterviews / kpis.totalApplications) * 100)}% de conversion`
              : '0%'}
          </div>
        </div>

        {/* Total Hours Planned */}
        <div className="bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span>Volume Hebdo</span>
            <Clock className="w-4 h-4 text-forest" />
          </div>
          <div className="text-2xl font-bold text-forest">{kpis.totalHoursPlanned}h</div>
          <div className="text-[10px] text-gray-400 mt-1">Heures planifiées</div>
        </div>
      </div>

      {/* Row 2: Charts Grid (Donut Chart & Weekly Hours Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Time Allocation (Counterpart to Department Wise Attrition) */}
        <div className="lg:col-span-6 bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-forest">
                Répartition du Temps par Type d'Activité
              </h3>
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Department-Wise Eq.
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Distribution des heures de travail, recherche d'emploi et vie personnelle
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeAllocation}
                  dataKey="hours"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {timeAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} heures`, name]}
                  contentStyle={{
                    backgroundColor: '#FCFAF6',
                    borderColor: '#3F5B44',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs">
            {timeAllocation.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 truncate">{item.label}</span>
                <span className="font-bold text-forest ml-auto">{item.hours}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Weekly Hours by Category (Counterpart to Number of Employee by Age Group) */}
        <div className="lg:col-span-6 bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-forest">
                Volume d'Heures : Prévu vs Réalisé
              </h3>
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Age Group Histogram Eq.
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Comparaison des volumes horaires par grande catégorie d'activité
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#4A5568' }} />
                <YAxis tick={{ fontSize: 10, fill: '#4A5568' }} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FCFAF6',
                    borderColor: '#3F5B44',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="planned" name="Heures Prévisibles" fill="#B7C99A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realized" name="Heures Consacrées" fill="#3F5B44" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Engagement moyen : 92% du volume prévu</span>
            <span className="text-forest font-semibold">Rythme soutenu</span>
          </div>
        </div>
      </div>

      {/* Row 3: Satisfaction / Difficulty Matrix Heatmap + Application Conversion Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Satisfaction / Difficulty Matrix (Counterpart to Job Satisfaction Rating) */}
        <div className="lg:col-span-7 bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm text-forest">
              Matrice de Satisfaction & Niveau de Difficulté
            </h3>
            <span className="text-[10px] uppercase font-bold text-gray-400">
              Job Satisfaction Rating Eq.
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Évaluation subjective de satisfaction et défi ressenti par sujet d'apprentissage
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#EAE3D2]/70 text-forest border-b border-[#3F5B44]/10">
                  <th className="py-2.5 px-3 font-bold rounded-l-xl">Matière / Projet</th>
                  <th className="py-2.5 px-3 font-bold">Domaine</th>
                  <th className="py-2.5 px-3 font-bold text-center">Satisfaction (1-5)</th>
                  <th className="py-2.5 px-3 font-bold text-center">Difficulté (1-5)</th>
                  <th className="py-2.5 px-3 font-bold text-right rounded-r-xl">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {satisfactionMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-cream-dark/30 transition">
                    <td className="py-3 px-3 font-semibold text-gray-800">{item.subject}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#EAE3D2] text-forest font-medium text-[10px]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{item.satisfaction}/5</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          item.difficulty >= 4
                            ? 'bg-wine/15 text-wine'
                            : item.difficulty === 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sage/40 text-forest'
                        }`}
                      >
                        Niveau {item.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] font-semibold text-forest">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Pipeline Rings (Counterpart to Attrition Rate by Gender/Age) */}
        <div className="lg:col-span-5 bg-[#FCFAF6] border border-[#3F5B44]/15 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-forest">
                Pipeline de Candidatures (Anneaux)
              </h3>
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Radial Conversion Eq.
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Étapes de conversion des opportunités professionnelles
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={12}
                data={applicationFunnel}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FCFAF6',
                    borderColor: '#3F5B44',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          {/* Details list */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
            {applicationFunnel.map((stage, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.fill }}
                  />
                  <span className="text-gray-700">{stage.name}</span>
                </div>
                <span className="font-bold text-gray-900">{stage.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
