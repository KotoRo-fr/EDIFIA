import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  ShieldCheck,
  FileText,
  MapPin,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Projets', icon: FolderOpen, path: '/dashboard' },
  { label: 'Conformité', icon: ShieldCheck, path: '/compliance' },
  { label: 'Livrables', icon: FileText, path: '/deliverables' },
  { label: 'Paramètres', icon: Settings, path: '/settings' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-orange-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
