
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, 
  Send, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Calendar,
  User,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { Letter } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  letters: Letter[];
  onDelete: (id: string) => void;
}

const LetterList: React.FC<Props> = ({ letters, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MASUK' | 'KELUAR'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const filteredLetters = useMemo(() => {
    return letters.filter(letter => {
      const matchesSearch = 
        letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        letter.sender.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'ALL' || letter.type === typeFilter;
      const matchesCategory = categoryFilter === 'Semua' || letter.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [letters, searchTerm, typeFilter, categoryFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Cari perihal, nomor surat, atau pengirim..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['ALL', 'MASUK', 'KELUAR'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  typeFilter === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type === 'ALL' ? 'Semua' : type}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Surat</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pengirim/Penerima</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Kategori</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLetters.length > 0 ? (
              filteredLetters.map(letter => (
                <tr key={letter.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`shrink-0 p-2.5 rounded-xl ${
                        letter.type === 'MASUK' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {letter.type === 'MASUK' ? <Inbox size={20} /> : <Send size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 line-clamp-1">{letter.title}</p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">{letter.number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{letter.type === 'MASUK' ? letter.sender : letter.receiver}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                        {letter.type === 'MASUK' ? 'Diterima Dari' : 'Dikirim Ke'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {letter.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(letter.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/letter/${letter.id}`} 
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Detail"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button 
                        onClick={() => onDelete(letter.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-slate-100 rounded-full mb-4">
                      <Search size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Tidak ada surat yang ditemukan</p>
                    <p className="text-slate-400 text-sm mt-1">Coba sesuaikan kata kunci atau filter Anda</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LetterList;
