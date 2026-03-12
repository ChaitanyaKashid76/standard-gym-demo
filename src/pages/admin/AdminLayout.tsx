import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { Dumbbell, LayoutDashboard, Users, Image as ImageIcon, MessageSquare, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!token && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <Link to="/" className="flex items-center gap-2 text-emerald-500">
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold text-lg tracking-tight text-white">FitZone Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link 
            to="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === '/admin' ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link 
            to="/admin?tab=memberships" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.search.includes('memberships') ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="font-medium">Memberships</span>
          </Link>
          <Link 
            to="/admin?tab=trainers" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.search.includes('trainers') ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Trainers</span>
          </Link>
          <Link 
            to="/admin?tab=gallery" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.search.includes('gallery') ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Gallery</span>
          </Link>
          <Link 
            to="/admin?tab=inquiries" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.search.includes('inquiries') ? 'bg-emerald-500/10 text-emerald-500' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Inquiries</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 md:hidden">
          <Link to="/" className="flex items-center gap-2 text-emerald-500">
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold text-lg tracking-tight text-white">FitZone</span>
          </Link>
          <button onClick={handleLogout} className="text-red-500 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
