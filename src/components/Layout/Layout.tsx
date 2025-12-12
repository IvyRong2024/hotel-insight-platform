import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  requiredModule?: string;
}

export function Layout({ children, title, subtitle, requiredModule }: LayoutProps) {
  const { isLoggedIn, canAccess } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredModule && !canAccess(requiredModule)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-56 min-h-screen">
        {/* Page Header */}
        <header className="sticky top-0 z-30 bg-[#f5f7fa]/80 backdrop-blur-xl px-8 py-5 border-b border-slate-200/50">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
