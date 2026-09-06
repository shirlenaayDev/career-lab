import { useState } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import './SkillGrowth.css';

const periodOptions = [3, 6, 12];

function SkillGrowth({ skillsCreatedAt }) {
  const [months, setMonths] = useState(6);
  const [showMenu, setShowMenu] = useState(false);

  const now = new Date();
  const skillData = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString('id-ID', { month: 'short' });
    const count = skillsCreatedAt.filter((dateStr) => {
      const sd = new Date(dateStr);
      return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
    }).length;
    skillData.push({ month: label, skills: count });
  }

  return (
    <div className="skill-growth-card">
      <div className="skill-growth-header">
        <h2 className="skill-growth-title">Skill Growth</h2>
        <div className="skill-growth-period-wrap">
          <button className="skill-growth-period-btn" onClick={() => setShowMenu((v) => !v)}>
            {months} Bulan Terakhir
            <ChevronDown size={14} />
          </button>
          {showMenu && (
            <div className="skill-growth-period-menu">
              {periodOptions.map((m) => (
                <button key={m} onClick={() => { setMonths(m); setShowMenu(false); }}>
                  {m} Bulan Terakhir
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="skill-growth-chart">
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={skillData}>
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.5)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Bar dataKey="skills" fill="#4F5BD1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SkillGrowth;