import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ReflectionForm from '../ReflectionForm';
import ApplicationForm from '../ApplicationForm';
import SkillForm from '../SkillForm';
import LearningForm from '../LearningForm';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatCards from '../components/dashboard/StatCards';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ProjectProgress from '../components/dashboard/ProjectProgress';
import UpcomingApplication from '../components/dashboard/UpcomingApplication';
import WeeklyReflectionSummary from '../components/dashboard/WeeklyReflectionSummary';
import SkillGrowth from '../components/dashboard/SkillGrowth';

function Dashboard({ session, handleLogout }) {
  const [projects, setProjects] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [learning, setLearning] = useState([]);

  function refreshReflections() {
    supabase.from('weekly_reflections').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error) setReflections(data);
    });
  }

  function refreshApplications() {
    supabase.from('applications').select('*').order('date_applied', { ascending: false }).then(({ data, error }) => {
      if (!error) setApplications(data);
    });
  }

  function refreshSkills() {
    supabase.from('skills').select('*').then(({ data, error }) => {
      if (!error) setSkills(data);
    });
  }

  function refreshLearning() {
    supabase.from('learning').select('*').then(({ data, error }) => {
      if (!error) setLearning(data);
    });
  }

  useEffect(() => {
    supabase.from('projects').select('*').then(({ data, error }) => {
      if (!error) setProjects(data);
    });
    supabase.from('career_experiments').select('*').then(({ data, error }) => {
      if (!error) setExperiments(data);
    });
    refreshReflections();
    refreshApplications();
    refreshSkills();
    refreshLearning();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar userName="User1" userRole="Student" profileVariant="full" />        
        <DashboardHeader
          userName="User1"
          careerFocus="Business Analyst"
          confidenceScore={72}
          confidenceChange={8}
          nextLearning="Fundamental of BA"
          chapter="Chapter 1"
          progress={65}
        />
        <StatCards />

        <div className="dashboard-grid">
          <div className="dashboard-col-left">
            <ActivityFeed />
            <ProjectProgress />
          </div>
          <div className="dashboard-col-right">
            <UpcomingApplication />
            <WeeklyReflectionSummary />
            <SkillGrowth />
          </div>
        </div>

        {/* ↓↓↓ Bagian sementara — CRUD lama, akan dipindah ke halaman masing-masing nanti ↓↓↓ */}
        <div style={{ padding: '20px', color: 'white' }}>
          <hr style={{ margin: '20px 0', opacity: 0.2 }} />
          <p>Logged in as: {session.user.email}</p>
          <button onClick={handleLogout}>Logout</button>

          <h2>My Projects</h2>
          {projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
            <ul>
              {projects.map((p) => (
                <li key={p.project_id}>{p.name} — {p.status}</li>
              ))}
            </ul>
          )}

          <h2>Career Experiments</h2>
          {experiments.length === 0 ? (
            <p>No experiments yet.</p>
          ) : (
            <ul>
              {experiments.map((e) => (
                <li key={e.career_experiment_id}>
                  {e.experiment_title} — Enjoyment: {e.enjoyment_score}/5, Difficulty: {e.difficulty}/5
                </li>
              ))}
            </ul>
          )}

          <h2>Weekly Reflections</h2>
          {reflections.length === 0 ? (
            <p>No reflections yet.</p>
          ) : (
            <ul>
              {reflections.map((r) => (
                <li key={r.reflection_id}>
                  <strong>{r.week}</strong> — Mood: {r.mood}, Score: {r.score}/10
                  <br />
                  {r.reflection}
                </li>
              ))}
            </ul>
          )}
          <ReflectionForm session={session} onSuccess={refreshReflections} />

          <h2>Applications</h2>
          {applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <ul>
              {applications.map((a) => (
                <li key={a.application_id}>
                  {a.company} — {a.position} ({a.application_status})
                </li>
              ))}
            </ul>
          )}
          <ApplicationForm session={session} onSuccess={refreshApplications} />

          <h2>Skills</h2>
          {skills.length === 0 ? (
            <p>No skills yet.</p>
          ) : (
            <ul>
              {skills.map((s) => (
                <li key={s.skill_id}>
                  {s.name} ({s.category}) — {s.proficiency_level}
                </li>
              ))}
            </ul>
          )}
          <SkillForm session={session} onSuccess={refreshSkills} />

          <h2>Learning</h2>
          {learning.length === 0 ? (
            <p>No learning records yet.</p>
          ) : (
            <ul>
              {learning.map((l) => (
                <li key={l.learning_id}>
                  {l.title} — {l.platform || 'N/A'} ({l.status}, {l.progress_percentage}%)
                </li>
              ))}
            </ul>
          )}
          <LearningForm session={session} onSuccess={refreshLearning} />
        </div>
        {/* ↑↑↑ Sampai sini ↑↑↑ */}
      </main>
    </div>
  );
}

export default Dashboard;