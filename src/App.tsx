import { Routes, Route, Navigate, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import ToastProvider from '@/components/ui/toast-provider';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import CompliancePage from '@/pages/CompliancePage';
import SiteIntelPage from '@/pages/SiteIntelPage';
import SettingsPage from '@/pages/SettingsPage';
import ProgrammingPage from '@/pages/ProgrammingPage';
import DesignPage from '@/pages/DesignPage';
import DeliverablesPage from '@/pages/DeliverablesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
          <Route path="/compliance/:projectId" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
          <Route path="/site-intel/:projectId" element={<ProtectedRoute><SiteIntelPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/programming/:projectId" element={<ProtectedRoute><ProgrammingPage /></ProtectedRoute>} />
          <Route path="/design/:projectId" element={<ProtectedRoute><DesignPage /></ProtectedRoute>} />
          <Route path="/deliverables/:projectId" element={<ProtectedRoute><DeliverablesPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <>
      <ToastProvider />
      <AnimatedRoutes />
    </>
  );
}
