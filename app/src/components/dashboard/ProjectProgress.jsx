import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import './ProjectProgress.css';

const statusData = [
  { name: 'Completed', value: 3, color: '#4CD8C4' },
  { name: 'In Progress', value: 6, color: '#6C7CFB' },
  { name: 'Planning', value: 2, color: '#F4C066' },
  { name: 'On Hold', value: 1, color: '#5EC3D6' },
];

const trendData = [
  { month: 'Jan', total: 3 },
  { month: 'Feb', total: 5 },
  { month: 'Mar', total: 6 },
  { month: 'Apr', total: 8 },
  { month: 'Mei', total: 10 },
  { month: 'Jun', total: 12 },
];

const totalProjects = statusData.reduce((sum, s) => sum + s.value, 0);

function ProjectProgress() {
  return (
    <div className="project-progress-card">
      <div className="project-progress-header">
        <h2 className="project-progress-title">Progress Proyek</h2>
        <button className="project-progress-period-btn">
          6 Bulan Terakhir
          <ChevronDown size={14} />
        </button>
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
            const percentage = Math.round((item.value / totalProjects) * 100);
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
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} width={32} />
            <Line type="monotone" dataKey="total" stroke="#6C7CFB" strokeWidth={2} dot={{ r: 3, fill: '#6C7CFB' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ProjectProgress;