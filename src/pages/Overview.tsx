import { Layout } from '../components/Layout';
import { Card, MetricCard, Badge } from '../components/ui';
import { brandHealthData, hotelHealthData, actionsData, priceData, insightsData, brandConfig } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, Hotel, DollarSign, Zap, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Overview() {
  const urgentActions = actionsData.filter((a) => a.priority === 'urgent' || a.priority === 'high');

  return (
    <Layout title="Overview" subtitle={`${brandConfig.main.group} · 平台概览`}>
      {/* 核心指标卡片 */}
      <section className="mb-5 animate-fade-in">
        <div className="grid grid-cols-4 gap-3">
          <MetricCard label="品牌健康指数" value={brandHealthData.overallScore} suffix="/ 5.0" trend={brandHealthData.trends.overallScore} trendDirection="up" icon={<Building2 size={16} />} size="sm" />
          <MetricCard label="酒店综合评分" value={hotelHealthData.overallScore} suffix="/ 5.0" trend="+2.1%" trendDirection="up" icon={<Hotel size={16} />} size="sm" />
          <MetricCard label="区域均价" value={`¥${priceData.regions[0].avgPrice}`} trend={priceData.regions[0].change} trendDirection={priceData.regions[0].change.startsWith('+') ? 'up' : 'down'} icon={<DollarSign size={16} />} size="sm" />
          <MetricCard label="待处理行动" value={actionsData.filter((a) => a.status === 'pending').length} suffix="项" icon={<Zap size={16} />} size="sm" />
        </div>
      </section>

      {/* 趋势图 + 快捷入口 */}
      <section className="grid grid-cols-3 gap-4 mb-5">
        <Card padding="sm" className="col-span-2 animate-fade-in-delay-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">品牌健康趋势</h3>
              <p className="text-xs text-slate-500 mt-0.5">近30天评分变化</p>
            </div>
            <Link to="/brand" className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-blue/80 transition-colors">
              查看详情 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={brandHealthData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[4.3, 4.7]} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="score" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-2 animate-fade-in-delay-1">
          <QuickLink to="/brand" icon={<Building2 size={16} />} title="Brand View" subtitle="品牌视角分析" color="blue" />
          <QuickLink to="/hotel" icon={<Hotel size={16} />} title="Hotel View" subtitle="酒店运营洞察" color="purple" />
          <QuickLink to="/price" icon={<DollarSign size={16} />} title="Price Monitor" subtitle="价格竞争监测" color="gold" />
          <QuickLink to="/actions" icon={<Zap size={16} />} title="Action Center" subtitle="行动建议管理" color="green" />
        </div>
      </section>

      {/* 洞察 + 紧急行动 */}
      <section className="grid grid-cols-2 gap-4 animate-fade-in-delay-2">
        <Card padding="sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">关键洞察</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-emerald-500">
                <TrendingUp size={12} />
                <span className="text-xs font-medium">机会点</span>
              </div>
              <div className="space-y-1.5">
                {insightsData.opportunities.slice(0, 2).map((insight, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-slate-600">{insight}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-red-500">
                <AlertTriangle size={12} />
                <span className="text-xs font-medium">风险点</span>
              </div>
              <div className="space-y-1.5">
                {insightsData.risks.slice(0, 2).map((insight, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-red-50 border border-red-100 text-xs text-slate-600">{insight}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">紧急行动</h3>
            <Link to="/actions" className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-blue/80 transition-colors">
              查看全部 <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {urgentActions.map((action) => (
              <div key={action.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-brand-blue/30 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant={action.priority === 'urgent' ? 'danger' : 'warning'} size="sm" pulse={action.priority === 'urgent'}>
                        {action.priority === 'urgent' ? '紧急' : '高优'}
                      </Badge>
                      <span className="text-[10px] text-slate-400">{action.category}</span>
                    </div>
                    <h4 className="text-xs font-medium text-slate-700">{action.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{action.hotel}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{action.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </Layout>
  );
}

interface QuickLinkProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: 'blue' | 'purple' | 'gold' | 'green';
}

function QuickLink({ to, icon, title, subtitle, color }: QuickLinkProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100/50 border-blue-200 hover:border-blue-300',
    purple: 'from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-300',
    gold: 'from-amber-50 to-amber-100/50 border-amber-200 hover:border-amber-300',
    green: 'from-emerald-50 to-emerald-100/50 border-emerald-200 hover:border-emerald-300',
  };

  const iconColors = {
    blue: 'text-brand-blue',
    purple: 'text-purple-500',
    gold: 'text-amber-500',
    green: 'text-emerald-500',
  };

  return (
    <Link to={to} className={`block p-3 rounded-xl bg-gradient-to-br border transition-all ${colorClasses[color]}`}>
      <div className="flex items-center gap-2">
        <span className={iconColors[color]}>{icon}</span>
        <div>
          <h4 className="text-xs font-medium text-slate-800">{title}</h4>
          <p className="text-[10px] text-slate-500">{subtitle}</p>
        </div>
        <ArrowRight size={14} className="ml-auto text-slate-400" />
      </div>
    </Link>
  );
}
