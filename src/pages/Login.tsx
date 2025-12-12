import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, roleConfigs, UserRole } from '../context/AuthContext';
import { Building2, Users, MapPin, Hotel, DollarSign, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const roleIcons: Record<UserRole, React.ReactNode> = {
  brand_ops: <Building2 size={20} />,
  region_vp: <Users size={20} />,
  province_mgr: <MapPin size={20} />,
  city_mgr: <MapPin size={20} />,
  hotel_mgr: <Hotel size={20} />,
  revenue_mgr: <DollarSign size={20} />,
};

export function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      login(selectedRole);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ihg-navy via-ihg-navy-light to-ihg-navy flex">
      {/* Left: Branding */}
      <div className="flex-1 flex flex-col justify-center px-16">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">IHG Insight</h1>
          <p className="text-xl text-white/60">酒店品牌洞察分析平台</p>
        </div>
        
        <div className="space-y-4 text-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <div className="font-medium">Brand View</div>
              <div className="text-sm text-white/50">品牌健康监测与竞对分析</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Hotel size={20} />
            </div>
            <div>
              <div className="font-medium">Hotel View</div>
              <div className="text-sm text-white/50">酒店运营洞察与行动建议</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div>
              <div className="font-medium">Price Monitor</div>
              <div className="text-sm text-white/50">价格监测与竞对促销追踪</div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>覆盖平台</span>
            <span className="text-white/60">携程 · 美团 · 飞猪 · Booking · Expedia · Agoda</span>
          </div>
        </div>
      </div>

      {/* Right: Login */}
      <div className="w-[480px] bg-white flex flex-col justify-center px-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">选择您的角色</h2>
          <p className="text-slate-500">不同角色将看到对应权限范围内的数据</p>
        </div>

        <div className="space-y-3 mb-8">
          {roleConfigs.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={clsx(
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                selectedRole === role.id
                  ? 'border-ihg-navy bg-ihg-navy/5'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                selectedRole === role.id ? 'bg-ihg-navy text-white' : 'bg-slate-100 text-slate-500'
              )}>
                {roleIcons[role.id]}
              </div>
              <div className="flex-1">
                <div className={clsx(
                  'font-semibold',
                  selectedRole === role.id ? 'text-ihg-navy' : 'text-slate-700'
                )}>
                  {role.name}
                </div>
                <div className="text-sm text-slate-500">{role.level}</div>
              </div>
              <div className={clsx(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
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
      </div>
    </div>
  );
}

