import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, HelpCircle, MessageSquareQuote, Link2, Lightbulb } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import StoryCard from '../components/interview-stories/StoryCard';
import NewStoryModal from '../components/interview-stories/NewStoryModal';
import StoryDetailModal from '../components/interview-stories/StoryDetailModal';
import HowItWorksModal from '../components/career-paths/HowItWorksModal';
import '../pages/CareerPaths.css';
import './InterviewStories.css';

const filterTabs = ['Semua', 'Draft', 'Complete'];

const storySteps = [
  {
    icon: MessageSquareQuote,
    title: 'Tulis Pakai Format STAR',
    description: 'Situation, Task, Action, Result — format standar buat jawab pertanyaan behavioral interview.',
  },
  {
    icon: Link2,
    title: 'Kaitkan ke Bukti Nyata',
    description: 'Hubungkan story ke project atau experience yang relevan, biar ceritamu didukung evidence konkret.',
  },
  {
    icon: Lightbulb,
    title: 'Catat Pelajarannya',
    description: 'Apa insight yang bisa diambil? Ini yang bikin story kamu keliatan reflektif, bukan cuma laporan.',
  },
];

function isStoryDraft(row) {
  return !(row.situation && row.task && row.action && row.result);
}

function mapStory(row, appLabelById, skillsByStory) {
  return {
    id: row.story_id,
    title: row.title,
    applicationId: row.application_id,
    companyPosition: appLabelById[row.application_id] || null,
    situation: row.situation,
    task: row.task,
    action: row.action,
    result: row.result,
    lessonLearned: row.lesson_learned,
    isDraft: isStoryDraft(row),
    skillNames: skillsByStory[row.story_id] || [],
  };
}

function InterviewStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  async function fetchStories() {
    setLoading(true);
    setLoadError(null);

    const [
      { data: apps },
      { data: storyProjects },
      { data: storyExperiences },
      { data: projectSkillRows },
      { data: experienceSkillRows },
    ] = await Promise.all([
      supabase.from('applications').select('application_id, company, position'),
      supabase.from('interview_project').select('story_id, project_id'),
      supabase.from('interview_experience').select('story_id, experience_id'),
      supabase.from('project_skills').select('project_id, skills(name)'),
      supabase.from('experience_skills').select('experience_id, skills(name)'),
    ]);

    const appLabelById = {};
    (apps || []).forEach((a) => { appLabelById[a.application_id] = `${a.company} - ${a.position}`; });

    const skillsByProject = {};
    (projectSkillRows || []).forEach((r) => {
      if (!skillsByProject[r.project_id]) skillsByProject[r.project_id] = [];
      if (r.skills?.name) skillsByProject[r.project_id].push(r.skills.name);
    });

    const skillsByExperience = {};
    (experienceSkillRows || []).forEach((r) => {
      if (!skillsByExperience[r.experience_id]) skillsByExperience[r.experience_id] = [];
      if (r.skills?.name) skillsByExperience[r.experience_id].push(r.skills.name);
    });

    const skillsByStory = {};
    (storyProjects || []).forEach((r) => {
      if (!skillsByStory[r.story_id]) skillsByStory[r.story_id] = [];
      skillsByStory[r.story_id].push(...(skillsByProject[r.project_id] || []));
    });
    (storyExperiences || []).forEach((r) => {
      if (!skillsByStory[r.story_id]) skillsByStory[r.story_id] = [];
      skillsByStory[r.story_id].push(...(skillsByExperience[r.experience_id] || []));
    });
    Object.keys(skillsByStory).forEach((id) => {
      skillsByStory[id] = [...new Set(skillsByStory[id])];
    });

    const { data, error } = await supabase
      .from('interview_story')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setLoadError('Gagal memuat data story.');
      setLoading(false);
      return;
    }

    setStories(data.map((row) => mapStory(row, appLabelById, skillsByStory)));
    setLoading(false);
  }

  useEffect(() => {
    fetchStories();
  }, []);

  function handleCreated() {
    fetchStories();
  }

  function handleUpdated() {
    fetchStories();
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus story ini? Tindakan ini nggak bisa dibatalkan.')) return;
    await supabase.from('interview_project').delete().eq('story_id', id);
    await supabase.from('interview_experience').delete().eq('story_id', id);
    await supabase.from('interview_evidence').delete().eq('story_id', id);
    const { error } = await supabase.from('interview_story').delete().eq('story_id', id);
    if (!error) setStories((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleDuplicate(id) {
    const original = stories.find((s) => s.id === id);
    if (!original) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('interview_story').insert({
      user_id: user.id,
      application_id: original.applicationId,
      title: `${original.title} (copy)`,
      situation: original.situation,
      task: original.task,
      action: original.action,
      result: original.result,
      lesson_learned: original.lessonLearned,
    });

    if (!error) fetchStories();
  }

  const displayedStories = useMemo(() => {
    let result = [...stories];

    if (activeFilter === 'Draft') {
      result = result.filter((s) => s.isDraft);
    } else if (activeFilter === 'Complete') {
      result = result.filter((s) => !s.isDraft);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((s) =>
        s.title?.toLowerCase().includes(term) || s.companyPosition?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [stories, activeFilter, searchTerm]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar
          userName="User1"
          actionButton={
            <button className="topbar-new-path-btn" onClick={() => setShowNewModal(true)}>
              <Plus size={16} />
              New Stories
            </button>
          }
        />

        <div className="stories-header">
          <div>
            <h1 className="stories-title">Interview Stories</h1>
            <p className="stories-subtitle">Kumpulkan pengalaman dan jawaban terbaikmu dari setiap proses interview.</p>
          </div>
          <button className="career-experiments-help-btn" onClick={() => setShowHelpModal(true)}>
            <HelpCircle size={14} />
            Bagaimana cara kerja?
          </button>
        </div>

        <div className="stories-toolbar">
          <div className="stories-search">
            <Search size={18} className="stories-search-icon" />
            <input
              type="text"
              placeholder="Cari interview story, atau posisi..."
              className="stories-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="stories-filters">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="stories-empty">Memuat story...</p>
        ) : loadError ? (
          <p className="stories-empty">{loadError}</p>
        ) : displayedStories.length === 0 ? (
          <p className="stories-empty">Belum ada story di kategori ini.</p>
        ) : (
          <div className="stories-grid">
            {displayedStories.map((s) => (
              <StoryCard
                key={s.id}
                {...s}
                onViewDetail={setSelectedStory}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}

        {showNewModal && (
          <NewStoryModal
            onClose={() => setShowNewModal(false)}
            onCreated={handleCreated}
          />
        )}

        {selectedStory && (
          <StoryDetailModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
            onUpdated={handleUpdated}
          />
        )}

        {showHelpModal && (
          <HowItWorksModal
            onClose={() => setShowHelpModal(false)}
            title="Bagaimana Cara Kerja Interview Stories?"
            subtitle="Story STAR yang siap jadi jawaban interview, didukung bukti nyata dari project & experience kamu."
            steps={storySteps}
          />
        )}
      </main>
    </div>
  );
}

export default InterviewStories;