import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatCards from '../components/dashboard/StatCards';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ProjectProgress from '../components/dashboard/ProjectProgress';
import UpcomingApplication from '../components/dashboard/UpcomingApplication';
import WeeklyReflectionSummary from '../components/dashboard/WeeklyReflectionSummary';
import SkillGrowth from '../components/dashboard/SkillGrowth';

const moodScale = { Buruk: 1, Kurang: 2, Biasa: 3, Baik: 4, Semangat: 5 };

function daysAgo(dateStr) {
  return (Date.now() - new Date(dateStr).getTime()) / 86400000;
}

function Dashboard({ session, handleLogout }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      const [
        { data: careerPaths },
        { data: projects },
        { data: skills },
        { data: experiments },
        { data: applications },
        { data: reflections },
        { data: learningItems },
      ] = await Promise.all([
        supabase.from('career_paths').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('skills').select('*'),
        supabase.from('career_experiments').select('*'),
        supabase.from('applications').select('*'),
        supabase.from('weekly_reflections').select('*'),
        supabase.from('learning').select('*'),
      ]);

      setData({
        careerPaths: careerPaths || [],
        projects: projects || [],
        skills: skills || [],
        experiments: experiments || [],
        applications: applications || [],
        reflections: reflections || [],
        learningItems: learningItems || [],
      });
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading || !data) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p style={{ color: 'rgba(255,255,255,0.5)', padding: '40px 0', textAlign: 'center' }}>
            Memuat dashboard...
          </p>
        </main>
      </div>
    );
  }

  const { careerPaths, projects, skills, experiments, applications, reflections, learningItems } = data;

  // ===== DashboardHeader =====
  const focusPath = careerPaths.find((p) => p.status === 'Focus');
  const decidedExperiments = experiments.filter((e) => e.continue_decision !== null && e.continue_decision !== undefined);
  const successRate = decidedExperiments.length
    ? Math.round((decidedExperiments.filter((e) => e.continue_decision === true).length / decidedExperiments.length) * 100)
    : null;
  const activeLearning = learningItems
    .filter((l) => l.status === 'In Progress')
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

  // ===== StatCards =====
  const activeCareerPaths = careerPaths.filter((p) => p.status !== 'Achieved').length;
  const recentCompletedProjects = projects.filter((p) => p.status === 'Completed' && daysAgo(p.updated_at) <= 7).length;
  const recentSkills = skills.filter((s) => daysAgo(s.created_at) <= 30).length;
  const recentExperiments = experiments.filter((e) => daysAgo(e.created_at) <= 7).length;
  const inProcessApplications = applications.filter((a) => a.application_status === 'Interview').length;

  const stats = {
    activeCareerPaths,
    careerPathCaption: `${careerPaths.length} total`,
    totalProjects: projects.length,
    projectCaption: `${recentCompletedProjects} selesai minggu ini`,
    totalSkills: skills.length,
    skillCaption: `${recentSkills} skill baru`,
    totalExperiments: experiments.length,
    experimentCaption: `${recentExperiments} eksperimen baru`,
    totalApplications: applications.length,
    applicationCaption: `${inProcessApplications} dalam proses`,
  };

  // ===== ActivityFeed =====
  const activityItems = [
    ...reflections.map((r) => ({
      title: `Menambahkan refleksi: ${r.week}`,
      subtitle: 'Bagaimana minggu ini berjalan?',
      tag: 'Reflection',
      createdAt: r.created_at,
    })),
    ...projects.filter((p) => p.status === 'Completed').map((p) => ({
      title: `Project selesai: ${p.name}`,
      subtitle: p.role || '',
      tag: 'Project',
      createdAt: p.updated_at,
    })),
    ...experiments.map((e) => ({
      title: 'Memulai eksperimen karier baru',
      subtitle: e.experiment_title,
      tag: 'Experiment',
      createdAt: e.created_at,
    })),
    ...skills.map((s) => ({
      title: `Menambah skill baru: ${s.name}`,
      subtitle: s.category || '',
      tag: 'Skill',
      createdAt: s.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((item) => ({ ...item, time: formatRelativeTime(item.createdAt) }));

  // ===== ProjectProgress =====
  const projectStatusData = [
    { name: 'Completed', value: projects.filter((p) => p.status === 'Completed').length, color: '#4CD8C4' },
    { name: 'In Progress', value: projects.filter((p) => p.status === 'In Progress').length, color: '#6C7CFB' },
    { name: 'Planned', value: projects.filter((p) => p.status === 'Planned').length, color: '#F4C066' },
  ];
  const projectsCreatedAt = projects.map((p) => p.created_at);

  // ===== UpcomingApplication =====
  const upcomingApps = applications
    .filter((a) => a.application_status === 'Applied' || a.application_status === 'Interview')
    .sort((a, b) => {
      const da = a.interview_date || a.date_applied || a.created_at;
      const db = b.interview_date || b.date_applied || b.created_at;
      return new Date(da) - new Date(db);
    })
    .slice(0, 4)
    .map((a) => ({ position: a.position, company: a.company, status: a.application_status }));

  // ===== WeeklyReflectionSummary =====
  const recentReflections30 = reflections.filter((r) => daysAgo(r.created_at) <= 30 && r.mood);
  const moodAverage = recentReflections30.length
    ? (recentReflections30.reduce((sum, r) => sum + (moodScale[r.mood] || 3), 0) / recentReflections30.length).toFixed(1)
    : null;
  const weeklyCount = reflections.filter((r) => daysAgo(r.created_at) <= 7).length;
  const insightCount = reflections.filter((r) => daysAgo(r.created_at) <= 7 && r.improvement && r.improvement.trim()).length;

  // ===== SkillGrowth =====
  const skillsCreatedAt = skills.map((s) => s.created_at);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar userName="User1" userRole="Student" profileVariant="full" />
        <DashboardHeader
          userName="User1"
          careerFocus={focusPath?.name}
          successRate={successRate}
          nextLearningTitle={activeLearning?.title}
          nextLearningProgress={activeLearning?.progress_percentage}
        />
        <StatCards stats={stats} />

        <div className="dashboard-grid">
          <div className="dashboard-col-left">
            <ActivityFeed activities={activityItems} />
            <ProjectProgress statusData={projectStatusData} projectsCreatedAt={projectsCreatedAt} />
          </div>
          <div className="dashboard-col-right">
            <UpcomingApplication applications={upcomingApps} />
            <WeeklyReflectionSummary
              moodAverage={moodAverage}
              weeklyCount={weeklyCount}
              insightCount={insightCount}
            />
            <SkillGrowth skillsCreatedAt={skillsCreatedAt} />
          </div>
        </div>
      </main>
    </div>
  );
}

function formatRelativeTime(dateStr) {
  const days = daysAgo(dateStr);
  if (days < 1) return `${Math.max(1, Math.round(days * 24))} jam lalu`;
  if (days < 2) return 'Kemarin';
  return `${Math.round(days)} hari lalu`;
}

export default Dashboard;