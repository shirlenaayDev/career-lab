import { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import './ProjectProgress.css';

const periodOptions = [3, 6, 12];

function ProjectProgress({ statusData, projectsCreatedAt }) {
  const [months, setMonths] = useState(6);
  const [showMenu, setShowMenu] = useState(false);

  const totalProjects = statusData.reduce((sum, s) => sum + s.value, 0);

  // Trend: jumlah project yang DIBUAT per bulan (bukan progress historis — itu nggak kita simpan)
  const now = new Date();
  const trendData = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString('id-ID', { month: 'short' });
    const count = projectsCreatedAt.filter((dateStr) => {
      const pd = new Date(dateStr);
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
    }).length;
    trendData.push({ month: label, total: count });
  }

  return (
    <div className="project-progress-card">
      <div className="project-progress-header">
        <h2 className="project-progress-title">Progress Proyek</h2>
        <div className="project-progress-period-wrap">
          <button className="project-progress-period-btn" onClick={() => setShowMenu((v) => !v)}>
            {months} Bulan Terakhir
            <ChevronDown size={14} />
          </button>
          {showMenu && (
            <div className="project-progress-period-menu">
              {periodOptions.map((m) => (
                <button key={m} onClick={() => { setMonths(m); setShowMenu(false); }}>
                  {m} Bulan Terakhir
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="project-progress-body">
        <div className="project-donut-wrap">
          <ResponsiveContainer width={110} height={110}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={32}
                outerRadius={52}
                paddingAngle={2}
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="project-donut-center">
            <p className="project-donut-total">{totalProjects}</p>
            <p className="project-donut-label">Total</p>
          </div>
        </div>

        <div className="project-legend">
          {statusData.map((item, index) => {
            const percentage = totalProjects ? Math.round((item.value / totalProjects) * 100) : 0;
            return (
              <div className="project-legend-item" key={index}>
                <span className="project-legend-dot" style={{ background: item.color }} />
                <span className="project-legend-label">{item.name}</span>
                <span className="project-legend-value">{item.value} ({percentage}%)</span>
              </div>
            );
          })}
        </div>

        <div className="project-chart-divider" />

        <div className="project-line-chart">
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <Line type="monotone" dataKey="total" stroke="#6C7CFB" strokeWidth={2} dot={{ r: 3, fill: '#6C7CFB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ProjectProgress;