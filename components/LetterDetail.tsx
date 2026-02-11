
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Sparkles,
  Loader2,
  Copy,
  Printer,
  ChevronRight,
  Send,
  Inbox
} from 'lucide-react';
import { Letter } from '../types';
import { summarizeLetter } from '../services/geminiService';

interface Props {
  letters: Letter[];
  onUpdate: (letter: Letter) => void;
  onDelete: (id: string) => void;
}

const LetterDetail: React.FC<Props> = ({ letters, onUpdate, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const letter = letters.find(l => l.id === id);
  const [isSummarizing, setIsSummarizing] = useState(false);

  if (!letter) return <div className="text-center py-20">Surat tidak ditemukan.</div>;

  const handleSummarize = async () => {
    if (!letter.content) return;
    setIsSummarizing(true);
    const summary = await summarizeLetter(letter.content);
    onUpdate({ ...letter, aiSummary: summary });
    setIsSummarizing(false);
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus arsip ini?')) {
      onDelete(letter.id);
      navigate('/list');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft size={20} /> Kembali ke Daftar
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
            <Printer size={20} />
          </button>
          <button onClick={handleDelete} className="p-2.5 bg-white border border-rose-100 text-rose-600 rounded-xl hover:bg-rose-50 transition-colors">
            <Trash2 size={20} />
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Edit3 size={18} /> Edit Arsip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                  letter.type === 'MASUK' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {letter.type === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar'}
                </span>
                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  {letter.category}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{letter.title}</h1>
              <p className="text-slate-500 font-mono mt-4 text-lg">{letter.number}</p>
            </div>

            <div className="p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <FileText size={16} /> Isi Dokumen
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {letter.content || "Konten surat tidak tersedia dalam format digital."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-amber-800">
                <Sparkles size={20} />
                <h3 className="font-bold">Ringkasan Cerdas (AI)</h3>
              </div>
              {!letter.aiSummary && (
                <button
                  disabled={isSummarizing}
                  onClick={handleSummarize}
                  className="px-4 py-1.5 bg-amber-200 text-amber-900 rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors flex items-center gap-2"
                >
                  {isSummarizing ? <Loader2 className="animate-spin w-3 h-3" /> : <Sparkles size={14} />}
                  Buat Ringkasan
                </button>
              )}
            </div>
            <div className="text-amber-900/80 italic text-sm leading-relaxed">
              {letter.aiSummary || "Gunakan AI untuk membuat ringkasan singkat dari isi surat ini agar Anda dapat memahaminya lebih cepat."}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4">Metadata Arsip</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-slate-400 mt-1 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Tanggal Surat</p>
                  <p className="text-sm font-medium text-slate-700">{letter.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="text-slate-400 mt-1 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Pengirim</p>
                  <p className="text-sm font-medium text-slate-700">{letter.sender}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ChevronRight className="text-slate-400 mt-1 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Penerima</p>
                  <p className="text-sm font-medium text-slate-700">{letter.receiver}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="text-slate-400 mt-1 shrink-0" size={18} />
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Label / Tags</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {letter.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="font-bold mb-4">Butuh Bantuan AI?</h4>
              <p className="text-slate-400 text-xs mb-4">AI dapat membantu Anda merancang draf balasan untuk surat ini dalam hitungan detik.</p>
              <button className="w-full py-2 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
                Buat Draf Balasan
              </button>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 text-slate-800 w-32 h-32 opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterDetail;
