import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  MapPin,
} from 'lucide-react';

const menuItems = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Mes Projets', icon: FolderOpen, path: '/dashboard' },
  { label: 'Conformité', icon: ShieldCheck, path: '/compliance' },
  { label: 'Livrables', icon: FileText, path: '/deliverables' },
  { label: 'Paramètres', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-slate-900 text-white transition-all duration-300 z-40 hidden md:flex flex-col ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <nav className="flex-1 py-4 space-y-1">
        {menuItems.map((item, index) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');
          return (
            <motion.div
              key={item.path + item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-400 rounded-r-full"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
                <item.icon size={20} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 mx-2 mb-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight size={18} />
        ) : (
          <>
            <ChevronLeft size={18} />{' '}
            <span className="ml-2 text-xs">Réduire</span>
          </>
        )}
      </button>
    </aside>
  );
}
