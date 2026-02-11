
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  PlusCircle, 
  Search, 
  Settings, 
  FileText, 
  Menu, 
  X,
  Sparkles,
  ChevronRight,
  Filter,
  Trash2,
  Calendar
} from 'lucide-react';
import { Letter, LetterType } from './types';
import { INITIAL_LETTERS, CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import LetterForm from './components/LetterForm';
import LetterList from './components/LetterList';
import LetterDetail from './components/LetterDetail';

const App: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>(INITIAL_LETTERS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addLetter = (newLetter: Letter) => {
    setLetters(prev => [newLetter, ...prev]);
  };

  const deleteLetter = (id: string) => {
    setLetters(prev => prev.filter(l => l.id !== id));
  };

  const updateLetter = (updated: Letter) => {
    setLetters(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 text-white flex flex-col z-50`}>
          <div className="p-6 flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'justify-center'}`}>
              <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              {isSidebarOpen && <span className="font-bold text-xl tracking-tight">ArsipSurat</span>}
            </div>
          </div>

          <nav className="flex-1 mt-6 px-4 space-y-2">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
            <SidebarLink to="/list" icon={<Inbox size={20} />} label="Semua Arsip" isOpen={isSidebarOpen} />
            <SidebarLink to="/add" icon={<PlusCircle size={20} />} label="Tambah Surat" isOpen={isSidebarOpen} />
            <div className="border-t border-slate-800 my-4 pt-4">
              <span className={`text-xs font-semibold text-slate-500 uppercase px-2 mb-2 block ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Kategori Cepat' : '...'}
              </span>
              {isSidebarOpen && (
                <div className="space-y-1">
                  {CATEGORIES.slice(0, 4).map(cat => (
                    <Link key={cat} to={`/list?category=${cat}`} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <SidebarLink to="/settings" icon={<Settings size={20} />} label="Pengaturan" isOpen={isSidebarOpen} />
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mt-2 w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              {isSidebarOpen && <span>Tutup Menu</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-800">Sistem Arsip Digital</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Cari surat..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-full text-sm w-64 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                <Sparkles size={14} />
                AI Enhanced
              </div>
            </div>
          </header>

          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard letters={letters} />} />
              <Route path="/list" element={<LetterList letters={letters} onDelete={deleteLetter} />} />
              <Route path="/add" element={<LetterForm onAdd={addLetter} />} />
              <Route path="/letter/:id" element={<LetterDetail letters={letters} onUpdate={updateLetter} onDelete={deleteLetter} />} />
              <Route path="/settings" element={<div className="bg-white p-6 rounded-xl shadow-sm">Fitur Pengaturan Sedang Dikembangkan</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      } ${!isOpen && 'justify-center'}`}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && <span className="font-medium">{label}</span>}
    </Link>
  );
};

export default App;
