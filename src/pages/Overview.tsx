import { Layout } from '../components/Layout';
import { Card, MetricCard, Badge } from '../components/ui';
import {
  brandHealthData,
  hotelHealthData,
  actionsData,
  priceData,
  insightsData,
} from '../data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Building2,
  Hotel,
  DollarSign,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Overview() {
  const urgentActions = actionsData.filter((a) => a.priority === 'urgent' || a.priority === 'high');

  return (
    <Layout title="Overview" subtitle="平台概览 · 核心指标一览">
      {/* 核心指标卡片 */}
      <section className="mb-8 animate-fade-in">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="品牌健康指数"
            value={brandHealthData.overallScore}
            suffix="/ 5.0"
            trend={brandHealthData.trends.overallScore}
            trendDirection="up"
            icon={<Building2 size={18} />}
          />
          <MetricCard
            label="酒店综合评分"
            value={hotelHealthData.overallScore}
            suffix="/ 5.0"
            trend="+2.1%"
            trendDirection="up"
            icon={<Hotel size={18} />}
          />
          <MetricCard
            label="区域均价"
            value={`¥${priceData.regions[0].avgPrice}`}
            trend={priceData.regions[0].change}
            trendDirection={priceData.regions[0].change.startsWith('+') ? 'up' : 'down'}
            icon={<DollarSign size={18} />}
          />
          <MetricCard
            label="待处理行动"
            value={actionsData.filter((a) => a.status === 'pending').length}
            suffix="项"
            icon={<Zap size={18} />}
          />
        </div>
      </section>

      {/* 趋势图 + 快捷入口 */}
      <section className="grid grid-cols-3 gap-6 mb-8">
        {/* 趋势图 */}
        <Card className="col-span-2 animate-fade-in-delay-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">品牌健康趋势</h3>
              <p className="text-sm text-zinc-500 mt-0.5">近30天评分变化</p>
            </div>
            <Link
              to="/brand"
              className="flex items-center gap-1 text-sm text-brand-blue hover:text-brand-blue/80 transition-colors"
            >
              查看详情 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={brandHealthData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis domain={[4.3, 4.7]} stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid #1e1e2e',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0066FF"
                  strokeWidth={2}
                  dot={{ fill: '#0066FF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 快捷入口 */}
        <div className="space-y-4 animate-fade-in-delay-1">
          <QuickLink
            to="/brand"
            icon={<Building2 size={20} />}
            title="Brand View"
            subtitle="品牌视角分析"
            color="blue"
          />
          <QuickLink
            to="/hotel"
            icon={<Hotel size={20} />}
            title="Hotel View"
            subtitle="酒店运营洞察"
            color="purple"
          />
          <QuickLink
            to="/price"
            icon={<DollarSign size={20} />}
            title="Price Monitor"
            subtitle="价格竞争监测"
            color="gold"
          />
          <QuickLink
            to="/actions"
            icon={<Zap size={20} />}
            title="Action Center"
            subtitle="行动建议管理"
            color="green"
          />
        </div>
      </section>

      {/* 洞察 + 紧急行动 */}
      <section className="grid grid-cols-2 gap-6 animate-fade-in-delay-2">
        {/* 洞察 */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">关键洞察</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">机会点</span>
              </div>
              <div className="space-y-2">
                {insightsData.opportunities.slice(0, 2).map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-sm text-zinc-300"
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-red-400">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">风险点</span>
              </div>
              <div className="space-y-2">
                {insightsData.risks.slice(0, 2).map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm text-zinc-300"
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 紧急行动 */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">紧急行动</h3>
            <Link
              to="/actions"
              className="flex items-center gap-1 text-sm text-brand-blue hover:text-brand-blue/80 transition-colors"
            >
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {urgentActions.map((action) => (
              <div
                key={action.id}
                className="p-3 rounded-lg bg-dark-bg/50 border border-dark-border hover:border-brand-blue/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={action.priority === 'urgent' ? 'danger' : 'warning'}
                        size="sm"
                        pulse={action.priority === 'urgent'}
                      >
                        {action.priority === 'urgent' ? '紧急' : '高优'}
                      </Badge>
                      <span className="text-xs text-zinc-500">{action.category}</span>
                    </div>
                    <h4 className="text-sm font-medium text-zinc-200">{action.title}</h4>
                  </div>
                  <span className="text-xs text-zinc-500">{action.deadline}</span>
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
    blue: 'from-brand-blue/20 to-brand-blue/5 border-brand-blue/30 hover:border-brand-blue/50',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-500/50',
    gold: 'from-brand-gold/20 to-brand-gold/5 border-brand-gold/30 hover:border-brand-gold/50',
    green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50',
  };

  const iconColors = {
    blue: 'text-brand-blue',
    purple: 'text-purple-400',
    gold: 'text-brand-gold',
    green: 'text-emerald-400',
  };

  return (
    <Link
      to={to}
      className={`block p-4 rounded-xl bg-gradient-to-br border transition-all ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-3">
        <span className={iconColors[color]}>{icon}</span>
        <div>
          <h4 className="text-sm font-medium text-white">{title}</h4>
          <p className="text-xs text-zinc-500">{subtitle}</p>
        </div>
        <ArrowRight size={16} className="ml-auto text-zinc-600" />
      </div>
    </Link>
  );
}

