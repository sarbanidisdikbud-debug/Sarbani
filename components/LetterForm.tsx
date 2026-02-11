
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  FileSearch,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Letter, LetterType } from '../types';
import { CATEGORIES } from '../constants';
import { summarizeLetter, extractMetadata } from '../services/geminiService';

interface Props {
  onAdd: (letter: Letter) => void;
  initialData?: Letter;
}

const LetterForm: React.FC<Props> = ({ onAdd, initialData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Letter, 'id' | 'aiSummary' | 'tags'>>(
    initialData || {
      number: '',
      title: '',
      sender: '',
      receiver: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Dinas',
      type: 'MASUK',
      description: '',
      content: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate minor delay
    setTimeout(() => {
      onAdd({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        tags: formData.category ? [formData.category.toLowerCase()] : []
      });
      setLoading(false);
      navigate('/list');
    }, 800);
  };

  const handleAiExtract = async () => {
    if (!formData.content || formData.content.length < 20) {
      alert("Masukkan konten surat minimal 20 karakter agar AI dapat menganalisa.");
      return;
    }

    setAiLoading(true);
    const metadata = await extractMetadata(formData.content);
    if (metadata) {
      setFormData(prev => ({
        ...prev,
        ...metadata,
        category: CATEGORIES.includes(metadata.category) ? metadata.category : prev.category
      }));
    }
    setAiLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {initialData ? 'Edit Arsip Surat' : 'Unggah Arsip Baru'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Jenis Surat</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'MASUK'})}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
                      formData.type === 'MASUK' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'KELUAR'})}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
                      formData.type === 'KELUAR' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    Keluar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nomor Surat</label>
                <input
                  required
                  type="text"
                  value={formData.number}
                  onChange={e => setFormData({...formData, number: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Contoh: 001/SK/2023"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Perihal / Judul</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Judul atau perihal surat"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Pengirim</label>
                <input
                  required
                  type="text"
                  value={formData.sender}
                  onChange={e => setFormData({...formData, sender: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nama Pengirim"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Penerima</label>
                <input
                  required
                  type="text"
                  value={formData.receiver}
                  onChange={e => setFormData({...formData, receiver: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nama Penerima"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tanggal</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={2}
                placeholder="Catatan kecil tentang surat ini"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {initialData ? 'Simpan Perubahan' : 'Arsipkan Surat'}
            </button>
          </form>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-amber-400" />
              <h3 className="font-bold text-lg">AI Assistant</h3>
            </div>
            <p className="text-indigo-200 text-sm mb-6">
              Tempelkan isi teks surat di bawah untuk otomatisasi pengisian data menggunakan Gemini AI.
            </p>
            
            <div className="space-y-4">
              <textarea
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 text-white placeholder-indigo-400 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                rows={10}
                placeholder="Tempel teks surat di sini..."
              />
              
              <button
                type="button"
                onClick={handleAiExtract}
                disabled={aiLoading || !formData.content}
                className="w-full py-2.5 bg-white text-indigo-900 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <FileSearch size={18} />}
                Extract Metadata
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" /> Tips Pengarsipan
            </h4>
            <ul className="text-xs text-slate-500 space-y-3">
              <li className="flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                Gunakan nomor surat yang konsisten agar mudah dicari.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                Sertakan lampiran teks agar AI dapat membantu meringkas di masa depan.
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                Pilih kategori yang paling sesuai untuk filter dashboard.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterForm;
