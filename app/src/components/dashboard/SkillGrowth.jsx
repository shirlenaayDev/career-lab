import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import './SkillGrowth.css';

const skillData = [
  { month: 'Jan', skills: 4 },
  { month: 'Feb', skills: 6 },
  { month: 'Mar', skills: 9 },
  { month: 'Apr', skills: 12 },
  { month: 'Mei', skills: 15 },
  { month: 'Jun', skills: 18 },
];

function SkillGrowth() {
  return (
    <div className="skill-growth-card">
      <div className="skill-growth-header">
        <h2 className="skill-growth-title">Skill Growth</h2>
        <button className="skill-growth-period-btn">6 Bulan Terakhir</button>
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
            <Bar dataKey="skills" fill="#6C7CFB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SkillGrowth;