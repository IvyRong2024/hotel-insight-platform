import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Hotel, 
  DollarSign, 
  Zap, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/brand', icon: Building2, label: 'Brand View' },
  { path: '/hotel', icon: Hotel, label: 'Hotel View' },
  { path: '/price', icon: DollarSign, label: 'Price Monitor' },
  { path: '/actions', icon: Zap, label: 'Action Center' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-dark-card border-r border-dark-border flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-dark-border">
        {collapsed ? (
          <span className="text-2xl font-bold text-brand-blue">H</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-blue">Hotel</span>
            <span className="text-sm text-zinc-400">Insight</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-hover'
              )
            }
          >
            <item.icon size={20} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Settings & Collapse */}
      <div className="p-2 border-t border-dark-border space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              isActive
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-dark-hover'
            )
          }
        >
          <Settings size={20} />
          {!collapsed && <span className="font-medium">Settings</span>}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-dark-hover transition-all"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="font-medium">收起</span>}
        </button>
      </div>
    </aside>
  );
}

