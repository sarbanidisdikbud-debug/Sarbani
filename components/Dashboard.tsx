
import React, { useMemo } from 'react';
// Add missing Link import from react-router-dom
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Letter } from '../types';
import { 
  Inbox, 
  Send, 
  FileText, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

interface Props {
  letters: Letter[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard: React.FC<Props> = ({ letters }) => {
  const stats = useMemo(() => {
    const masuk = letters.filter(l => l.type === 'MASUK').length;
    const keluar = letters.filter(l => l.type === 'KELUAR').length;
    
    const categoryMap: Record<string, number> = {};
    letters.forEach(l => {
      categoryMap[l.category] = (categoryMap[l.category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    
    // Last 7 days chart data (simulation)
    const dailyData = [
      { name: 'Sen', masuk: 2, keluar: 1 },
      { name: 'Sel', masuk: 1, keluar: 3 },
      { name: 'Rab', masuk: 4, keluar: 2 },
      { name: 'Kam', masuk: 3, keluar: 5 },
      { name: 'Jum', masuk: 2, keluar: 1 },
      { name: 'Sab', masuk: 0, keluar: 0 },
      { name: 'Min', masuk: 1, keluar: 0 },
    ];

    return { masuk, keluar, total: letters.length, categoryData, dailyData };
  }, [letters]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Inbox className="text-blue-600" />} 
          title="Surat Masuk" 
          value={stats.masuk} 
          trend="+12%" 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<Send className="text-emerald-600" />} 
          title="Surat Keluar" 
          value={stats.keluar} 
          trend="+5%" 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<FileText className="text-indigo-600" />} 
          title="Total Arsip" 
          value={stats.total} 
          trend="+8%" 
          color="bg-indigo-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Aktivitas Surat 7 Hari Terakhir</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="masuk" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Masuk" />
                <Bar dataKey="keluar" fill="#10b981" radius={[4, 4, 0, 0]} name="Keluar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Distribusi Kategori</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Arsip Terbaru</h3>
          {/* Use Link component from react-router-dom */}
          <Link to="/list" className="text-indigo-600 text-sm font-medium hover:underline">Lihat Semua</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {letters.slice(0, 3).map(letter => (
            <div key={letter.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${letter.type === 'MASUK' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {letter.type === 'MASUK' ? <Inbox size={20} /> : <Send size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{letter.title}</p>
                  <p className="text-sm text-slate-500">{letter.number} • {letter.sender}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">{letter.date}</p>
                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{letter.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
          <ArrowUpRight size={12} /> {trend}
        </span>
      </div>
    </div>
  </div>
);

export default Dashboard;
