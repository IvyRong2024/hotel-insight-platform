import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { FilterBar } from './FilterBar';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showFilters?: boolean;
}

export function Layout({ children, title, subtitle, showFilters = true }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-52 min-h-screen">
        {showFilters && <FilterBar />}

        {/* Page Header */}
        <header className="px-5 py-4 border-b border-slate-200/50 bg-white/50">
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </header>

        {/* Page Content */}
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}
