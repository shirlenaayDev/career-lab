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
      </main>
    </div>
  );
}

export default Dashboard;