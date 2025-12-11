import { Layout } from '../components/Layout';
import { Card, CardHeader, MetricCard, Badge, ProgressBar } from '../components/ui';
import {
  brandHealthData,
  promiseFulfillmentData,
  brandDriversData,
  brandBarriersData,
  competitorData,
  insightsData,
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
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from 'lucide-react';

export function BrandView() {
  // 转换竞对对比数据为图表格式
  const competitorChartData = Object.entries(competitorData.metrics).map(([metric, values]) => ({
    metric,
    本品牌: values[0],
    竞对A: values[1],
    竞对B: values[2],
    竞对C: values[3],
  }));

  // 转换雷达图数据
  const radarData = promiseFulfillmentData.map((item) => ({
    promise: item.promise,
    score: item.score,
    fullMark: 100,
  }));

  return (
    <Layout title="Brand View" subtitle="品牌视角 · 全国整合数据">
      {/* 品牌健康指数 */}
      <section className="mb-8 animate-fade-in">
        <h2 className="text-lg font-semibold text-white mb-4">品牌健康指数</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard
            label="综合评分"
            value={brandHealthData.overallScore}
            suffix="/ 5.0"
            trend={brandHealthData.trends.overallScore}
            trendDirection="up"
          />
          <MetricCard
            label="情绪指数"
            value={`${brandHealthData.sentimentIndex}%`}
            trend={brandHealthData.trends.sentimentIndex}
            trendDirection="up"
          />
          <MetricCard
            label="体验指数"
            value={brandHealthData.experienceIndex}
            trend={brandHealthData.trends.experienceIndex}
            trendDirection="up"
          />
          <MetricCard
            label="4.5+占比"
            value={`${brandHealthData.above45Ratio}%`}
            trend={brandHealthData.trends.above45Ratio}
            trendDirection="up"
          />
        </div>

        {/* 趋势图 */}
        <Card>
          <CardHeader title="品牌健康趋势" subtitle="近30天评分变化" />
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
      </section>

      {/* 品牌承诺验证 + 驱动因素 */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        {/* 品牌承诺验证 */}
        <Card className="animate-fade-in-delay-1">
          <CardHeader title="品牌承诺验证" subtitle="用户真实感知评估" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e1e2e" />
                  <PolarAngleAxis dataKey="promise" stroke="#71717a" fontSize={12} />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#1e1e2e" fontSize={10} />
                  <Radar
                    name="得分"
                    dataKey="score"
                    stroke="#0066FF"
                    fill="#0066FF"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {promiseFulfillmentData.map((item) => (
                <div key={item.promise} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-zinc-300">{item.promise}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-400">{item.score}</span>
                    <Badge
                      variant={
                        item.status === 'fulfilled'
                          ? 'success'
                          : item.status === 'partial'
                          ? 'warning'
                          : 'danger'
                      }
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

        {/* 驱动因素 */}
        <Card className="animate-fade-in-delay-1">
          <CardHeader title="品牌驱动因素" subtitle="正向影响评分的因素" />
          <div className="space-y-4">
            {brandDriversData.map((item) => (
              <div key={item.driver}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-zinc-300">{item.driver}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-emerald-400">{item.impact}</span>
                    <span className="text-sm text-zinc-500">{item.score}分</span>
                  </div>
                </div>
                <ProgressBar value={item.score} color="green" size="sm" />
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {item.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 rounded"
                    >
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
      <section className="grid grid-cols-2 gap-6 mb-8">
        {/* 障碍因素 */}
        <Card className="animate-fade-in-delay-2">
          <CardHeader title="品牌障碍因素" subtitle="负向影响评分的因素" />
          <div className="space-y-4">
            {brandBarriersData.map((item) => (
              <div
                key={item.barrier}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      item.severity === 'high'
                        ? 'danger'
                        : item.severity === 'medium'
                        ? 'warning'
                        : 'neutral'
                    }
                    pulse={item.severity === 'high'}
                  >
                    {item.severity === 'high' ? '高' : item.severity === 'medium' ? '中' : '低'}
                  </Badge>
                  <div>
                    <div className="text-sm font-medium text-zinc-200">{item.barrier}</div>
                    <div className="text-xs text-zinc-500">{item.mentions} 次提及</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm ${
                      item.trend === '↑' ? 'text-red-400' : item.trend === '↓' ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  >
                    {item.trend}
                  </span>
                  <span className="text-sm text-red-400">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 洞察卡片 */}
        <div className="space-y-4 animate-fade-in-delay-2">
          <Card>
            <CardHeader
              title="机会点"
              action={<TrendingUp size={18} className="text-emerald-400" />}
            />
            <div className="space-y-3">
              {insightsData.opportunities.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Lightbulb size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{insight}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader
              title="风险点"
              action={<TrendingDown size={18} className="text-red-400" />}
            />
            <div className="space-y-3">
              {insightsData.risks.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{insight}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* 竞对对比 */}
      <section className="animate-fade-in-delay-3">
        <Card>
          <CardHeader title="品牌对比" subtitle="本品牌 vs 竞对表现" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competitorChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis type="number" domain={[3.8, 5]} stroke="#71717a" fontSize={12} />
                  <YAxis dataKey="metric" type="category" width={80} stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12121a',
                      border: '1px solid #1e1e2e',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="本品牌" fill="#0066FF" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="竞对A" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="竞对B" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="竞对C" fill="#6b7280" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-zinc-400">差异化优势</h4>
              {Object.entries(competitorData.advantages).map(([brand, tags]) => (
                <div key={brand}>
                  <div className="text-sm text-zinc-300 mb-1.5">{brand}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 text-xs rounded ${
                          brand === '本品牌'
                            ? 'bg-brand-blue/20 text-brand-blue'
                            : 'bg-zinc-700/50 text-zinc-400'
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

