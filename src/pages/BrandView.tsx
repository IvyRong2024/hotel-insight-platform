import { Layout } from '../components/Layout';
import { Card, Badge, ProgressBar } from '../components/ui';
import { 
  brandHealthData, 
  promiseFulfillmentData, 
  brandDriversData, 
  brandBarriersData, 
  competitorData,
  brandTiers,
  BrandTier
} from '../data/mockData';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar } from 'recharts';
import clsx from 'clsx';
import { useState } from 'react';

export function BrandView() {
  const [expandedPromise, setExpandedPromise] = useState<string | null>(null);

  return (
    <Layout title="Brand View" subtitle="品牌深度分析：驱动因素、障碍因素、竞品对比" requiredModule="brand">
      <div className="space-y-6">
        {/* 品牌健康趋势 */}
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📈 品牌健康趋势</h3>
            <span className="text-sm text-slate-500">近30天</span>
          </div>
          <Card>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={brandHealthData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[4.4, 4.6]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#003B6F" 
                  strokeWidth={3}
                  dot={{ fill: '#003B6F', strokeWidth: 2 }}
                  name="综合评分"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* 品牌承诺验证详情 */}
        <section className="animate-fade-in-up delay-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🎯 品牌承诺验证详情</h3>
            <span className="text-sm text-slate-500">点击查看改善建议</span>
          </div>
          <div className="space-y-3">
            {promiseFulfillmentData.map((item) => (
              <Card 
                key={item.promise}
                className={clsx(
                  'cursor-pointer transition-all',
                  expandedPromise === item.promise && 'ring-2 ring-ihg-navy',
                  item.status === 'unfulfilled' && 'border-l-4 border-l-red-500'
                )}
                padding="sm"
                onClick={() => setExpandedPromise(expandedPromise === item.promise ? null : item.promise)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{item.promise}</span>
                        <Badge variant={
                          item.status === 'fulfilled' ? 'success' : 
                          item.status === 'partial' ? 'warning' : 'danger'
                        }>
                          {item.status === 'fulfilled' ? '已兑现' : 
                           item.status === 'partial' ? '部分兑现' : '未兑现'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{item.mentions.toLocaleString()} 次用户提及</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-32">
                      <ProgressBar 
                        value={item.score} 
                        color={item.status === 'fulfilled' ? 'green' : item.status === 'partial' ? 'yellow' : 'red'} 
                        size="md" 
                      />
                    </div>
                    <span className={clsx(
                      'text-2xl font-bold',
                      item.status === 'fulfilled' ? 'text-emerald-600' : 
                      item.status === 'partial' ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {item.score}%
                    </span>
                    {expandedPromise === item.promise ? (
                      <ChevronDown size={20} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={20} className="text-slate-400" />
                    )}
                  </div>
                </div>

                {/* 展开的改善建议 */}
                {expandedPromise === item.promise && item.action && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in-up">
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">建议行动</p>
                          <p className="text-sm text-amber-700">{item.action}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* 驱动因素 & 障碍因素 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 驱动因素 */}
          <section className="animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">✅ 品牌驱动因素</h3>
            </div>
            <Card>
              <div className="space-y-4">
                {brandDriversData.map((driver) => (
                  <div key={driver.driver} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-slate-700">{driver.driver}</div>
                    <div className="flex-1">
                      <ProgressBar value={driver.score} color="green" size="md" />
                    </div>
                    <div className="w-12 text-right font-bold text-emerald-600">{driver.score}</div>
                    <div className="w-16 text-right text-sm text-emerald-600">{driver.impact}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">热词云：</span>
                  {brandDriversData.flatMap(d => d.keywords).slice(0, 8).map((kw, i) => (
                    <span key={i} className="inline-block mx-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs">
                      {kw}
                    </span>
                  ))}
                </p>
              </div>
            </Card>
          </section>

          {/* 障碍因素 */}
          <section className="animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">🚨 品牌障碍因素</h3>
            </div>
            <Card>
              <div className="space-y-3">
                {brandBarriersData.map((barrier) => (
                  <div key={barrier.barrier} className={clsx(
                    'p-3 rounded-xl',
                    barrier.severity === 'high' ? 'bg-red-50' : 
                    barrier.severity === 'medium' ? 'bg-amber-50' : 'bg-slate-50'
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{barrier.barrier}</span>
                        <Badge variant={barrier.severity === 'high' ? 'danger' : barrier.severity === 'medium' ? 'warning' : 'info'}>
                          {barrier.severity === 'high' ? '高风险' : barrier.severity === 'medium' ? '中风险' : '低风险'}
                        </Badge>
                        <span className="text-xs px-2 py-0.5 rounded" style={{ 
                          backgroundColor: brandTiers[barrier.affectedTier as BrandTier].color + '20', 
                          color: brandTiers[barrier.affectedTier as BrandTier].color 
                        }}>
                          {brandTiers[barrier.affectedTier as BrandTier].name}
                        </span>
                      </div>
                      <span className={clsx(
                        'text-sm font-bold',
                        barrier.impact < -0.2 ? 'text-red-600' : 'text-amber-600'
                      )}>
                        {barrier.impact}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{barrier.mentions.toLocaleString()} 次提及</span>
                      <span>趋势 {barrier.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        {/* 品牌 vs 竞品对比 */}
        <section className="animate-fade-in-up delay-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📊 品牌 vs 竞品对比</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* 雷达图 */}
            <Card>
              <h4 className="font-medium text-slate-700 mb-4">多维度对比</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={[
                  { metric: '综合评分', IHG: 4.52, 万豪: 4.48, 希尔顿: 4.55, 雅高: 4.41 },
                  { metric: '服务评分', IHG: 4.65, 万豪: 4.52, 希尔顿: 4.58, 雅高: 4.45 },
                  { metric: '性价比', IHG: 4.21, 万豪: 4.15, 希尔顿: 4.12, 雅高: 4.38 },
                  { metric: '清洁度', IHG: 4.72, 万豪: 4.68, 希尔顿: 4.75, 雅高: 4.62 },
                  { metric: '设施', IHG: 4.35, 万豪: 4.42, 希尔顿: 4.52, 雅高: 4.28 },
                ]}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[4, 5]} tick={{ fontSize: 10 }} />
                  <Radar name="IHG" dataKey="IHG" stroke="#003B6F" fill="#003B6F" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="万豪" dataKey="万豪" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="希尔顿" dataKey="希尔顿" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* 柱状图 */}
            <Card>
              <h4 className="font-medium text-slate-700 mb-4">综合评分对比</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitorData.brands.map((brand, idx) => ({
                  brand,
                  score: competitorData.metrics.综合评分[idx],
                  fill: competitorData.colors[idx]
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="brand" tick={{ fontSize: 12 }} />
                  <YAxis domain={[4.3, 4.6]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" name="综合评分" radius={[4, 4, 0, 0]}>
                    {competitorData.brands.map((_, idx) => (
                      <rect key={idx} fill={competitorData.colors[idx]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </section>

        {/* 各品牌竞争优势 */}
        <section className="animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🎯 各品牌竞争优势</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(competitorData.advantages).map(([brand, advantages], idx) => (
              <Card key={brand} className={idx === 0 ? 'ring-2 ring-ihg-navy bg-ihg-navy/5' : ''}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: competitorData.colors[idx] }} />
                  <span className="font-semibold text-slate-800">{brand}</span>
                </div>
                <div className="space-y-2">
                  {advantages.map((adv, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-slate-600">{adv}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 品牌趋势洞察 */}
        <section className="animate-fade-in-up delay-250">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🔮 品牌趋势洞察</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-emerald-500">
              <h4 className="font-medium text-emerald-700 mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                机会点
              </h4>
              <ul className="space-y-2">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  英迪格品牌"邻里文化"提及率上升23%，差异化优势明显
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  商务客群对"智能入住"期待度持续攀升，IHG App使用率提升
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  皇冠假日新一线城市早餐满意度高于一线城市8%
                </li>
              </ul>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                <TrendingDown size={18} />
                风险点
              </h4>
              <ul className="space-y-2">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  智选假日"隔音"差评率连续3月上升，需重点关注
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  万豪双12促销力度大，价格敏感用户流失风险增加
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  假日酒店节假日前台效率投诉激增35%
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
