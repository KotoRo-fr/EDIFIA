import { Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '@/lib/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import PageTransition from './animations/PageTransition';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      {showSidebar && !isMobile && <Sidebar />}
      {showSidebar && isMobile && <MobileNav />}
      <main
        className={`flex-1 pt-16 transition-all duration-300 ${
          showSidebar && !isMobile ? 'ml-56' : ''
        } ${showSidebar && isMobile ? 'pb-16' : ''}`}
      >
        <PageTransition>
          <div className="min-h-[calc(100vh-4rem)]">
            <Outlet />
          </div>
        </PageTransition>
        {(isPublicPage || !showSidebar) && <Footer />}
      </main>
    </div>
  );
}
