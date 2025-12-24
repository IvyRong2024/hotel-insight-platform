import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, roleConfigs, UserRole } from '../context/AuthContext';
import { Building2, Users, MapPin, Hotel, DollarSign, ChevronRight, Sparkles, TrendingUp, Settings } from 'lucide-react';
import clsx from 'clsx';

// 四大视角入口配置
const viewportGroups = [
  {
    id: 'brand',
    name: '品牌视角',
    icon: <Building2 size={24} />,
    color: 'from-violet-500 to-purple-600',
    description: '全国品牌健康监测、品牌特色感知分析、竞品对比分析',
    roles: ['brand_ops'],
  },
  {
    id: 'hotel',
    name: '酒店视角',
    icon: <Hotel size={24} />,
    color: 'from-ihg-navy to-blue-600',
    description: '区域/城市/单店运营诊断、用户洞察、行动建议',
    roles: ['region_vp', 'city_mgr', 'hotel_mgr', 'hotel_mgr_new'],
  },
  {
    id: 'price',
    name: '价格视角',
    icon: <DollarSign size={24} />,
    color: 'from-emerald-500 to-teal-600',
    description: '竞品价格监测、券类产品追踪、渠道价差分析',
    roles: ['revenue_mgr'],
  },
  {
    id: 'admin',
    name: '平台管理',
    icon: <Settings size={24} />,
    color: 'from-slate-500 to-slate-700',
    description: '监测酒店列表、品牌对标清单、用户权限矩阵',
    roles: ['platform_admin'],
  },
];

const roleIcons: Record<UserRole, React.ReactNode> = {
  platform_admin: <Settings size={18} />,
  brand_ops: <TrendingUp size={18} />,
  region_vp: <Users size={18} />,
  city_mgr: <MapPin size={18} />,
  hotel_mgr: <Hotel size={18} />,
  hotel_mgr_new: <Sparkles size={18} />,
  revenue_mgr: <DollarSign size={18} />,
};

export function Login() {
  const [selectedViewport, setSelectedViewport] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleViewportSelect = (viewportId: string) => {
    setSelectedViewport(viewportId);
    // 如果该视角只有一个角色，自动选中
    const viewport = viewportGroups.find(v => v.id === viewportId);
    if (viewport && viewport.roles.length === 1) {
      setSelectedRole(viewport.roles[0] as UserRole);
    } else {
      setSelectedRole(null);
    }
  };

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate('/');
    }
  };

  const currentViewport = viewportGroups.find(v => v.id === selectedViewport);
  const availableRoles = currentViewport 
    ? roleConfigs.filter(r => currentViewport.roles.includes(r.id))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ihg-navy via-ihg-navy-light to-ihg-navy flex">
      {/* Left: Branding - more compact */}
      <div className="w-[380px] flex flex-col justify-center px-10 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">IHG Insight</h1>
          <p className="text-lg text-white/60">酒店品牌洞察分析平台</p>
        </div>
        
        <div className="space-y-2.5 text-white/80">
          <FeatureItem icon="🎯" title="品牌视角" desc="全国品牌健康监测与竞对分析" />
          <FeatureItem icon="🏨" title="酒店视角" desc="区域/城市/单店运营诊断" />
          <FeatureItem icon="💰" title="价格监测" desc="竞品价格策略与促销追踪" />
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-white/40 text-xs space-y-1.5">
            <p><span className="text-white/60">监测规模：</span>13,000+ 家门店</p>
            <p className="text-white/30 pl-14">IHG 2,800+ / 竞品 10,200+</p>
            <p><span className="text-white/60">评论来源：</span>携程 · 美团 · 飞猪 · Booking · Expedia · Agoda</p>
            <p><span className="text-white/60">价格来源：</span>携程 · 抖音 · 直客通</p>
          </div>
        </div>
      </div>

      {/* Right: Login - expanded with two columns */}
      <div className="flex-1 bg-white flex flex-col justify-center px-12">
        {!selectedViewport ? (
          // 第一步：选择视角
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">选择您的视角</h2>
              <p className="text-slate-500">根据您的工作职责选择对应的数据视角</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {viewportGroups.map((viewport) => (
                <button
                  key={viewport.id}
                  onClick={() => handleViewportSelect(viewport.id)}
                  className="group"
                >
                  <div className={clsx(
                    'h-full p-4 rounded-xl border-2 transition-all text-left',
                    'hover:border-slate-300 hover:shadow-lg',
                    'border-slate-200 bg-white'
                  )}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={clsx(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br flex-shrink-0',
                        viewport.color
                      )}>
                        {viewport.icon}
                      </div>
                      <div>
                        <span className="text-base font-bold text-slate-800">{viewport.name}</span>
                        <ChevronRight size={16} className="inline-block ml-1 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{viewport.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {viewport.roles.map(roleId => {
                        const role = roleConfigs.find(r => r.id === roleId);
                        return role ? (
                          <span key={roleId} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {role.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-slate-400">
              Demo 版本 · 数据仅供演示
            </p>
          </>
        ) : (
          // 第二步：选择具体角色
          <>
            <div className="mb-6">
              <button 
                onClick={() => { setSelectedViewport(null); setSelectedRole(null); }}
                className="text-sm text-slate-500 hover:text-ihg-navy mb-3 flex items-center gap-1"
              >
                ← 返回选择视角
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br',
                  currentViewport?.color
                )}>
                  {currentViewport?.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{currentViewport?.name}</h2>
              </div>
              <p className="text-slate-500">
                {availableRoles.length > 1 ? '选择您的具体角色' : '确认进入'}
              </p>
            </div>

            <div className="space-y-2 mb-6 max-h-[320px] overflow-y-auto pr-2">
              {availableRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={clsx(
                    'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
                    selectedRole === role.id
                      ? 'border-ihg-navy bg-ihg-navy/5'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className={clsx(
                    'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                    selectedRole === role.id ? 'bg-ihg-navy text-white' : 'bg-slate-100 text-slate-500'
                  )}>
                    {roleIcons[role.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={clsx(
                        'font-semibold',
                        selectedRole === role.id ? 'text-ihg-navy' : 'text-slate-700'
                      )}>
                        {role.name}
                      </span>
                      <span className="text-xs text-slate-400">{role.level}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{role.description}</p>
                  </div>
                  <div className={clsx(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1',
                    selectedRole === role.id ? 'border-ihg-navy bg-ihg-navy' : 'border-slate-300'
                  )}>
                    {selectedRole === role.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleLogin}
              disabled={!selectedRole}
              className={clsx(
                'w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all',
                selectedRole
                  ? 'bg-ihg-navy hover:bg-ihg-navy-light cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed'
              )}
            >
              进入平台
              <ChevronRight size={18} />
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              Demo 版本 · 数据仅供演示
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-white/50">{desc}</div>
      </div>
    </div>
  );
}
