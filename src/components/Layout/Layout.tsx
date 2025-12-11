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
    <div className="min-h-screen bg-dark-bg">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-56 min-h-screen">
        {showFilters && <FilterBar />}

        {/* Page Header */}
        <header className="px-8 py-6 border-b border-dark-border/50">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

