import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Home, FolderOpen, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-600 tracking-tight">EDIFIA</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && (<>
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors flex items-center gap-1.5"><Home size={16} /> Tableau de bord</Link>
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors flex items-center gap-1.5"><FolderOpen size={16} /> Projets</Link>
          </>)}
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:bg-slate-50 rounded-full px-2 py-1 transition-colors">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-semibold">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
                <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.first_name} {user?.last_name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button onClick={() => { navigate('/settings'); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><User size={14} /> Profil</button>
                  <button onClick={() => { navigate('/settings'); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Settings size={14} /> Paramètres</button>
                  <hr className="my-1" />
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut size={14} /> Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-slate-600">Connexion</Button>
              <Button size="sm" onClick={() => navigate('/register')} className="bg-orange-600 hover:bg-orange-700 text-white">Inscription</Button>
            </div>
          )}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      {mobileOpen && isAuthenticated && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Tableau de bord</Link>
          <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Projets</Link>
          <Link to="/settings" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-600 py-2">Paramètres</Link>
        </div>
      )}
    </nav>
  );
}
