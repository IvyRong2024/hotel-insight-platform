import { Layout } from '../components/Layout';
import { Card, CardHeader, MetricCard, Badge, ProgressBar } from '../components/ui';
import {
  brandHealthData,
  promiseFulfillmentData,
  brandDriversData,
  brandBarriersData,
  competitorData,
  insightsData,
  platformConfig,
} from '../data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Monitor } from 'lucide-react';

export function BrandView() {
  const competitorChartData = Object.entries(competitorData.metrics).map(([metric, values]) => ({
    metric,
    'IHG洲际': values[0],
    '万豪国际': values[1],
    '希尔顿': values[2],
    '雅高集团': values[3],
  }));

  const radarData = promiseFulfillmentData.map((item) => ({
    promise: item.promise,
    score: item.score,
    fullMark: 100,
  }));

  return (
    <Layout title="Brand View" subtitle="IHG洲际酒店集团 · 品牌视角分析">
      {/* 平台覆盖提示 */}
      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <Monitor size={14} />
        <span>数据来源：{platformConfig.review.platforms.join('、')} | 覆盖品牌 {platformConfig.review.coverage.brands} 家</span>
      </div>

      {/* 品牌健康指数 */}
      <section className="mb-5 animate-fade-in">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">品牌健康指数</h2>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <MetricCard
            label="综合评分"
            value={brandHealthData.overallScore}
            suffix="/ 5.0"
            trend={brandHealthData.trends.overallScore}
            trendDirection="up"
            size="sm"
          />
          <MetricCard
            label="情绪指数"
            value={`${brandHealthData.sentimentIndex}%`}
            trend={brandHealthData.trends.sentimentIndex}
            trendDirection="up"
            size="sm"
          />
          <MetricCard
            label="体验指数"
            value={brandHealthData.experienceIndex}
            trend={brandHealthData.trends.experienceIndex}
            trendDirection="up"
            size="sm"
          />
          <MetricCard
            label="4.5+占比"
            value={`${brandHealthData.above45Ratio}%`}
            trend={brandHealthData.trends.above45Ratio}
            trendDirection="up"
            size="sm"
          />
        </div>

        <Card padding="sm">
          <CardHeader title="品牌健康趋势" subtitle="近30天评分变化" />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={brandHealthData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[4.3, 4.7]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* 品牌承诺验证 + 驱动因素 */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <Card padding="sm" className="animate-fade-in-delay-1">
          <CardHeader title="品牌承诺验证" subtitle="用户真实感知评估" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="promise" stroke="#64748b" fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#e2e8f0" fontSize={9} />
                  <Radar name="得分" dataKey="score" stroke="#0066FF" fill="#0066FF" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {promiseFulfillmentData.map((item) => (
                <div key={item.promise} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span className="text-slate-600">{item.promise}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">{item.score}</span>
                    <Badge
                      variant={item.status === 'fulfilled' ? 'success' : item.status === 'partial' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {item.status === 'fulfilled' ? '达成' : item.status === 'partial' ? '部分' : '未达'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card padding="sm" className="animate-fade-in-delay-1">
          <CardHeader title="品牌驱动因素" subtitle="正向影响评分的因素" />
          <div className="space-y-3">
            {brandDriversData.map((item) => (
              <div key={item.driver}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{item.driver}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-500">{item.impact}</span>
                    <span className="text-xs text-slate-400">{item.score}分</span>
                  </div>
                </div>
                <ProgressBar value={item.score} color="green" size="sm" />
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {item.keywords.slice(0, 3).map((kw) => (
                    <span key={kw} className="px-1.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-600 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 障碍因素 + 洞察 */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <Card padding="sm" className="animate-fade-in-delay-2">
          <CardHeader title="品牌障碍因素" subtitle="负向影响评分的因素" />
          <div className="space-y-2">
            {brandBarriersData.map((item) => (
              <div key={item.barrier} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={item.severity === 'high' ? 'danger' : item.severity === 'medium' ? 'warning' : 'neutral'}
                    pulse={item.severity === 'high'}
                    size="sm"
                  >
                    {item.severity === 'high' ? '高' : item.severity === 'medium' ? '中' : '低'}
                  </Badge>
                  <div>
                    <div className="text-xs font-medium text-slate-700">{item.barrier}</div>
                    <div className="text-[10px] text-slate-400">{item.mentions} 次提及</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${item.trend === '↑' ? 'text-red-500' : item.trend === '↓' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {item.trend}
                  </span>
                  <span className="text-xs text-red-500">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3 animate-fade-in-delay-2">
          <Card padding="sm">
            <CardHeader title="机会点" action={<TrendingUp size={14} className="text-emerald-500" />} />
            <div className="space-y-2">
              {insightsData.opportunities.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <Lightbulb size={12} className="text-brand-gold mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{insight}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card padding="sm">
            <CardHeader title="风险点" action={<TrendingDown size={14} className="text-red-500" />} />
            <div className="space-y-2">
              {insightsData.risks.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <AlertTriangle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{insight}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* 竞对对比 */}
      <section className="animate-fade-in-delay-3">
        <Card padding="sm">
          <CardHeader title="品牌对比" subtitle="IHG vs 竞品集团" />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitorChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[3.8, 5]} stroke="#94a3b8" fontSize={10} />
                  <YAxis dataKey="metric" type="category" width={60} stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="IHG洲际" fill="#0066FF" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="万豪国际" fill="#8b5cf6" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="希尔顿" fill="#f59e0b" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="雅高集团" fill="#6b7280" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-slate-500">差异化优势</h4>
              {Object.entries(competitorData.advantages).map(([brand, tags]) => (
                <div key={brand}>
                  <div className="text-xs text-slate-600 mb-1">{brand}</div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1.5 py-0.5 text-[10px] rounded ${
                          brand === 'IHG洲际' ? 'bg-blue-50 text-brand-blue' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}
