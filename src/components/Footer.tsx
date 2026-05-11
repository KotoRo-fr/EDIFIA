import { Link } from 'react-router';
import { HardHat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3"><HardHat size={20} className="text-orange-500" /><span className="text-lg font-bold text-white">EDIFIA</span></div>
          <p className="text-sm">Prompt-to-Building. 15 minutes au lieu de 12 semaines.</p>
        </div>
        <div><h4 className="text-white font-semibold mb-3 text-sm">Produit</h4><ul className="space-y-2 text-sm"><li><Link to="/" className="hover:text-orange-500 transition-colors">Accueil</Link></li><li><Link to="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link></li></ul></div>
        <div><h4 className="text-white font-semibold mb-3 text-sm">Légal</h4><ul className="space-y-2 text-sm"><li><span className="hover:text-orange-500 cursor-pointer">CGU</span></li><li><span className="hover:text-orange-500 cursor-pointer">Confidentialité</span></li></ul></div>
        <div><h4 className="text-white font-semibold mb-3 text-sm">Contact</h4><p className="text-sm">contact@edifia.fr</p></div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-slate-800 text-center text-xs">&copy; 2026 EDIFIA. Tous droits réservés.</div>
    </footer>
  );
}
