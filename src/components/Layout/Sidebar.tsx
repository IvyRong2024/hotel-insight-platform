import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Hotel, 
  DollarSign, 
  Zap, 
  LogOut,
  User,
  Settings,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview', module: 'overview' },
  { path: '/brand', icon: Building2, label: 'Brand View', module: 'brand' },
  { path: '/hotel', icon: Hotel, label: 'Hotel View', module: 'hotel' },
  { path: '/price', icon: DollarSign, label: 'Price Monitor', module: 'price' },
  { path: '/actions', icon: Zap, label: 'Action Center', module: 'actions' },
  { path: '/config', icon: Settings, label: '监测管理', module: 'overview' },
];

// 管理层专属：新店管理汇总（仅城市经理及以上角色可见）
const managerOnlyItems = [
  { path: '/new-opening', icon: Sparkles, label: '新店管理', roles: ['city_mgr', 'region_vp', 'brand_ops'] },
];

export function Sidebar() {
  const { currentRole, logout, canAccess } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const accessibleItems = navItems.filter(item => canAccess(item.module));

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-ihg-navy flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">IHG</span>
          <span className="text-sm text-ihg-gold font-medium">Insight</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-lg bg-ihg-gold/20 flex items-center justify-center">
            <User size={16} className="text-ihg-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{currentRole?.name}</div>
            <div className="text-xs text-white/50 truncate">{currentRole?.level}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {accessibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'nav-item',
                isActive ? 'nav-item-active' : 'nav-item-inactive'
              )
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        {/* 管理层专属入口 */}
        {managerOnlyItems
          .filter(item => item.roles.includes(currentRole?.id || ''))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'nav-item',
                  isActive ? 'nav-item-active' : 'nav-item-inactive'
                )
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="nav-item nav-item-inactive w-full"
        >
          <LogOut size={18} />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
