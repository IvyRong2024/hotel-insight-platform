import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { brandHealthData, actionsData, priceData, insightsData, brandConfig } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Hotel, DollarSign, Zap, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export function Overview() {
  const { currentRole, canAccess } = useAuth();
  const urgentActions = actionsData.filter((a) => a.priority === 'urgent' || a.priority === 'high');
  const isScoreUp = brandHealthData.trends.overallScore.startsWith('+');

  return (
    <Layout title="Overview" subtitle={`${currentRole?.level} · ${brandConfig.main.group}`} requiredModule="overview">
      
      {/* 欢迎信息 + 核心指标 */}
      <section className="mb-8 animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 mb-1">欢迎回来</p>
              <h2 className="text-2xl font-bold">{currentRole?.name}</h2>
              <p className="text-white/70 mt-1">{currentRole?.level}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm mb-1">品牌综合评分</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">{brandHealthData.overallScore}</span>
                <div className={clsx(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-sm mb-1',
                  isScoreUp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                )}>
                  {isScoreUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {brandHealthData.trends.overallScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="情绪指数"
            value={`${brandHealthData.sentimentIndex}%`}
            trend={brandHealthData.trends.sentimentIndex}
            icon={<Star size={18} />}
            color="emerald"
          />
          <MetricCard
            label="体验指数"
            value={brandHealthData.experienceIndex.toString()}
            trend={brandHealthData.trends.experienceIndex}
            icon={<Hotel size={18} />}
            color="blue"
          />
          <MetricCard
            label="华东区均价"
            value={`¥${priceData.regions[0].avgPrice}`}
            trend={priceData.regions[0].change}
            icon={<DollarSign size={18} />}
            color="gold"
          />
          <MetricCard
            label="待处理行动"
            value={actionsData.filter((a) => a.status === 'pending').length.toString()}
            suffix="项"
            icon={<Zap size={18} />}
            color="red"
          />
        </div>
      </section>

      {/* 趋势图 + 快捷入口 */}
      <section className="grid grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">品牌健康趋势</h3>
              <p className="text-sm text-slate-500">近30天评分变化</p>
            </div>
            {canAccess('brand') && (
              <Link to="/brand" className="flex items-center gap-1 text-sm text-ihg-navy hover:underline">
                查看详情 <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={brandHealthData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[4.3, 4.7]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="#003B6F" strokeWidth={3} dot={{ fill: '#003B6F', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-3 animate-fade-in-up delay-100">
          {canAccess('brand') && (
            <QuickLink to="/brand" icon={<Building2 size={18} />} title="Brand View" subtitle="品牌健康诊断" />
          )}
          {canAccess('hotel') && (
            <QuickLink to="/hotel" icon={<Hotel size={18} />} title="Hotel View" subtitle="酒店运营洞察" />
          )}
          {canAccess('price') && (
            <QuickLink to="/price" icon={<DollarSign size={18} />} title="Price Monitor" subtitle="价格竞争监测" />
          )}
          {canAccess('actions') && (
            <QuickLink to="/actions" icon={<Zap size={18} />} title="Action Center" subtitle="行动建议管理" />
          )}
        </div>
      </section>

      {/* 洞察 + 紧急行动 */}
      <section className="grid grid-cols-2 gap-6 animate-fade-in-up delay-200">
        <Card>
          <h3 className="text-base font-semibold text-slate-800 mb-4">关键洞察</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-600">
                <TrendingUp size={14} />
                <span className="text-sm font-medium">机会点</span>
              </div>
              <div className="space-y-2">
                {insightsData.opportunities.slice(0, 2).map((insight, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50 text-sm text-slate-700">{insight}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-red-600">
                <AlertTriangle size={14} />
                <span className="text-sm font-medium">风险点</span>
              </div>
              <div className="space-y-2">
                {insightsData.risks.slice(0, 2).map((insight, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-red-50 text-sm text-slate-700">{insight}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {canAccess('actions') && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">紧急行动</h3>
              <Link to="/actions" className="flex items-center gap-1 text-sm text-ihg-navy hover:underline">
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {urgentActions.map((action) => (
                <div key={action.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={action.priority === 'urgent' ? 'danger' : 'warning'}>
                          {action.priority === 'urgent' ? '紧急' : '高优'}
                        </Badge>
                        <span className="text-xs text-slate-400">{action.category}</span>
                      </div>
                      <h4 className="text-sm font-medium text-slate-700">{action.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{action.hotel}</p>
                    </div>
                    <span className="text-xs text-slate-400">{action.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>
    </Layout>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  suffix?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'gold' | 'red';
}

function MetricCard({ label, value, trend, suffix, icon, color }: MetricCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    gold: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };
  const isUp = trend?.startsWith('+');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses[color])}>
          {icon}
        </div>
        {trend && (
          <div className={clsx('flex items-center gap-1 text-xs font-medium', isUp ? 'text-emerald-600' : 'text-red-600')}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800">
        {value}{suffix && <span className="text-sm text-slate-400 ml-1">{suffix}</span>}
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

interface QuickLinkProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function QuickLink({ to, icon, title, subtitle }: QuickLinkProps) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-ihg-navy/30 hover:shadow-md transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-ihg-navy/10 flex items-center justify-center text-ihg-navy group-hover:bg-ihg-navy group-hover:text-white transition-all">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <ArrowRight size={18} className="text-slate-400 group-hover:text-ihg-navy transition-colors" />
    </Link>
  );
}
