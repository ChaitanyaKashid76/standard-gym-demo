import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  
  const [stats, setStats] = useState({ memberships: 0, trainers: 0, gallery: 0, inquiries: 0 });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async (endpoint: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'dashboard') {
      Promise.all([
        fetch('/api/memberships').then(res => res.json()),
        fetch('/api/trainers').then(res => res.json()),
        fetch('/api/gallery').then(res => res.json()),
        fetch('/api/inquiries').then(res => res.json())
      ]).then(([m, t, g, i]) => {
        setStats({ memberships: m.length, trainers: t.length, gallery: g.length, inquiries: i.length });
        setLoading(false);
      });
    } else {
      fetchData(tab);
    }
  }, [tab]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`/api/${tab}/${id}`, { method: 'DELETE' });
      fetchData(tab);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      const method = isAdding ? 'POST' : 'PUT';
      const url = isAdding ? `/api/${tab}` : `/api/${tab}/${editingId}`;
      
      // Handle features array for memberships
      const payload = { ...formData };
      if (tab === 'memberships' && typeof payload.features === 'string') {
        payload.features = payload.features.split(',').map((f: string) => f.trim());
      }

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
      fetchData(tab);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    if (tab === 'memberships') setFormData({ name: '', price: '', duration: '', features: '' });
    if (tab === 'trainers') setFormData({ name: '', experience: '', specialization: '', photoUrl: '' });
    if (tab === 'gallery') setFormData({ imageUrl: '', title: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (tab === 'dashboard') {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-zinc-400 font-medium mb-2">Total Memberships</h3>
            <p className="text-4xl font-bold text-emerald-500">{stats.memberships}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-zinc-400 font-medium mb-2">Total Trainers</h3>
            <p className="text-4xl font-bold text-emerald-500">{stats.trainers}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-zinc-400 font-medium mb-2">Gallery Images</h3>
            <p className="text-4xl font-bold text-emerald-500">{stats.gallery}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-zinc-400 font-medium mb-2">New Inquiries</h3>
            <p className="text-4xl font-bold text-emerald-500">{stats.inquiries}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white capitalize">Manage {tab}</h1>
        {tab !== 'inquiries' && !isAdding && !editingId && (
          <button 
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        )}
      </div>

      {(isAdding || editingId) && tab !== 'inquiries' ? (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{isAdding ? 'Add New' : 'Edit'} {tab.slice(0, -1)}</h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            {tab === 'memberships' && (
              <>
                <input type="text" placeholder="Plan Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                <input type="text" placeholder="Price (e.g. $29)" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                <input type="text" placeholder="Duration (e.g. 1 Month)" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                <textarea placeholder="Features (comma separated)" value={Array.isArray(formData.features) ? formData.features.join(', ') : (formData.features || '')} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" rows={3} />
              </>
            )}
            
            {tab === 'trainers' && (
              <>
                <input type="text" placeholder="Trainer Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                <input type="text" placeholder="Experience (e.g. 5 Years)" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                <input type="text" placeholder="Specialization" value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                <input type="text" placeholder="Photo URL" value={formData.photoUrl || ''} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
              </>
            )}

            {tab === 'gallery' && (
              <>
                <input type="text" placeholder="Image URL" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
                <input type="text" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:outline-none" />
              </>
            )}

            <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
              <Save className="w-5 h-5" /> Save
            </button>
          </div>
        </div>
      ) : null}

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs text-zinc-300 uppercase bg-zinc-950 border-b border-zinc-800">
              <tr>
                {tab === 'memberships' && <><th className="px-6 py-4">Name</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Duration</th></>}
                {tab === 'trainers' && <><th className="px-6 py-4">Name</th><th className="px-6 py-4">Specialization</th><th className="px-6 py-4">Experience</th></>}
                {tab === 'gallery' && <><th className="px-6 py-4">Image</th><th className="px-6 py-4">Title</th></>}
                {tab === 'inquiries' && <><th className="px-6 py-4">Date</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Phone</th><th className="px-6 py-4">Message</th></>}
                {tab !== 'inquiries' && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  {tab === 'memberships' && (
                    <><td className="px-6 py-4 font-medium text-white">{item.name}</td><td className="px-6 py-4">{item.price}</td><td className="px-6 py-4">{item.duration}</td></>
                  )}
                  {tab === 'trainers' && (
                    <><td className="px-6 py-4 font-medium text-white">{item.name}</td><td className="px-6 py-4">{item.specialization}</td><td className="px-6 py-4">{item.experience}</td></>
                  )}
                  {tab === 'gallery' && (
                    <><td className="px-6 py-4"><img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg" /></td><td className="px-6 py-4 font-medium text-white">{item.title}</td></>
                  )}
                  {tab === 'inquiries' && (
                    <><td className="px-6 py-4 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td><td className="px-6 py-4 font-medium text-white">{item.name}</td><td className="px-6 py-4">{item.phone}</td><td className="px-6 py-4">{item.message}</td></>
                  )}
                  
                  {tab !== 'inquiries' && (
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-400 p-2"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  )}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
