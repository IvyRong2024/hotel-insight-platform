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
        'fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50 shadow-sm',
        collapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-slate-100">
        {collapsed ? (
          <span className="text-xl font-bold text-brand-blue">I</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-brand-blue">IHG</span>
            <span className="text-xs text-slate-400">Insight</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm',
                isActive
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )
            }
          >
            <item.icon size={18} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Settings & Collapse */}
      <div className="p-2 border-t border-slate-100 space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm',
              isActive
                ? 'bg-brand-blue text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            )
          }
        >
          <Settings size={18} />
          {!collapsed && <span className="font-medium">Settings</span>}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all text-sm"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="font-medium">收起</span>}
        </button>
      </div>
    </aside>
  );
}
