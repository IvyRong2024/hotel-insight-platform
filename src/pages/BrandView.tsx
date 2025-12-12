import { Layout } from '../components/Layout';
import { Card, CardHeader, Badge, ProgressBar } from '../components/ui';
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
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowRight, Target, Users, Star } from 'lucide-react';
import clsx from 'clsx';

export function BrandView() {
  const isScoreUp = brandHealthData.trends.overallScore.startsWith('+');
  
  const competitorChartData = Object.entries(competitorData.metrics).map(([metric, values]) => ({
    metric,
    'IHG洲际': values[0],
    '万豪国际': values[1],
    '希尔顿': values[2],
    '雅高集团': values[3],
  }));

  return (
    <Layout title="Brand View" subtitle="IHG洲际酒店集团 · 品牌健康诊断" requiredModule="brand">
      
      {/* Step 1: 核心指标总览 */}
      <section className="mb-8 animate-fade-in-up">
        <div className="grid grid-cols-4 gap-5">
          {/* 主评分卡片 */}
          <div className="col-span-2 bg-gradient-to-br from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/60 text-sm mb-1">品牌综合评分</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold">{brandHealthData.overallScore}</span>
                  <span className="text-xl text-white/50 mb-1">/ 5.0</span>
                </div>
              </div>
              <div className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                isScoreUp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
              )}>
                {isScoreUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {brandHealthData.trends.overallScore}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-white/50 text-xs mb-1">情绪指数</p>
                <p className="text-xl font-semibold">{brandHealthData.sentimentIndex}%</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">体验指数</p>
                <p className="text-xl font-semibold">{brandHealthData.experienceIndex}</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">4.5+占比</p>
                <p className="text-xl font-semibold">{brandHealthData.above45Ratio}%</p>
              </div>
            </div>
          </div>

          {/* 趋势解读 */}
          <div className="col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ihg-navy/10 flex items-center justify-center">
                <Target size={16} className="text-ihg-navy" />
              </div>
              <h3 className="font-semibold text-slate-800">本期诊断结论</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              IHG品牌健康指数持续上升，<span className="text-emerald-600 font-medium">服务态度</span>是核心驱动力。
              但<span className="text-red-600 font-medium">隔音问题</span>成为最大障碍，智选假日品牌尤为突出。
              建议优先处理设施改善类行动项。
            </p>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">服务 +0.35</span>
              <span className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">隔音 -0.28</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs rounded-full">入住等待 ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: 趋势追踪 */}
      <section className="mb-8 animate-fade-in-up delay-100">
        <Card>
          <CardHeader title="📈 评分趋势追踪" subtitle="近30天品牌健康指数变化" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={brandHealthData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[4.3, 4.7]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#003B6F" strokeWidth={3} dot={{ fill: '#003B6F', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Step 3: 驱动 vs 障碍 */}
      <section className="mb-8 grid grid-cols-2 gap-6 animate-fade-in-up delay-200">
        {/* 驱动因素 */}
        <Card>
          <CardHeader 
            title="✅ 正向驱动因素" 
            subtitle="推动评分上升的关键因素"
            action={<Badge variant="success">TOP 5</Badge>}
          />
          <div className="space-y-4">
            {brandDriversData.map((item, idx) => (
              <div key={item.driver} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{item.driver}</span>
                    <span className="text-sm font-semibold text-emerald-600">{item.impact}</span>
                  </div>
                  <ProgressBar value={item.score} color="green" size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 障碍因素 */}
        <Card>
          <CardHeader 
            title="⚠️ 负向障碍因素" 
            subtitle="拖累评分下降的问题点"
            action={<Badge variant="danger">需关注</Badge>}
          />
          <div className="space-y-4">
            {brandBarriersData.map((item, idx) => (
              <div key={item.barrier} className="flex items-center gap-4">
                <div className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                  item.severity === 'high' ? 'bg-red-50 text-red-600' : 
                  item.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{item.barrier}</span>
                      <span className={clsx(
                        'text-xs',
                        item.trend === '↑' ? 'text-red-500' : item.trend === '↓' ? 'text-emerald-500' : 'text-slate-400'
                      )}>{item.trend}</span>
                    </div>
                    <span className="text-sm font-semibold text-red-600">{item.impact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={Math.abs(item.impact) * 100} max={30} color="red" size="sm" />
                    <span className="text-xs text-slate-400">{item.mentions}次</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Step 4: 品牌承诺验证 */}
      <section className="mb-8 animate-fade-in-up delay-300">
        <Card>
          <CardHeader 
            title="🎯 品牌承诺验证" 
            subtitle="用户是否真实感知到IHG的品牌承诺？"
          />
          <div className="grid grid-cols-5 gap-4">
            {promiseFulfillmentData.map((item) => (
              <div 
                key={item.promise}
                className={clsx(
                  'p-4 rounded-xl border-2 text-center transition-all',
                  item.status === 'fulfilled' ? 'border-emerald-200 bg-emerald-50/50' :
                  item.status === 'partial' ? 'border-amber-200 bg-amber-50/50' :
                  'border-red-200 bg-red-50/50'
                )}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium text-slate-700 mb-1">{item.promise}</div>
                <div className={clsx(
                  'text-2xl font-bold mb-2',
                  item.status === 'fulfilled' ? 'text-emerald-600' :
                  item.status === 'partial' ? 'text-amber-600' : 'text-red-600'
                )}>
                  {item.score}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs">
                  {item.status === 'fulfilled' ? (
                    <><CheckCircle size={12} className="text-emerald-500" /><span className="text-emerald-600">达成</span></>
                  ) : item.status === 'partial' ? (
                    <><AlertTriangle size={12} className="text-amber-500" /><span className="text-amber-600">部分达成</span></>
                  ) : (
                    <><AlertTriangle size={12} className="text-red-500" /><span className="text-red-600">未达成</span></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Step 5: 竞对对比 */}
      <section className="mb-8 animate-fade-in-up delay-400">
        <Card>
          <CardHeader 
            title="🏆 竞对表现对比" 
            subtitle="IHG vs 万豪 vs 希尔顿 vs 雅高"
            action={
              <div className="flex items-center gap-3">
                {competitorData.brands.map((brand, idx) => (
                  <div key={brand} className="flex items-center gap-1.5 text-xs">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: competitorData.colors[idx] }} />
                    <span className="text-slate-600">{brand}</span>
                  </div>
                ))}
              </div>
            }
          />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorChartData} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[3.8, 5]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="metric" type="category" width={70} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="IHG洲际" fill="#003B6F" radius={[0, 4, 4, 0]} />
                <Bar dataKey="万豪国际" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="希尔顿" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                <Bar dataKey="雅高集团" fill="#94a3b8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Step 6: 洞察与建议 */}
      <section className="grid grid-cols-2 gap-6 animate-fade-in-up delay-400">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} />
            <h3 className="font-semibold">机会点</h3>
          </div>
          <div className="space-y-3">
            {insightsData.opportunities.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Star size={14} className="text-emerald-200 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-50">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} />
            <h3 className="font-semibold">风险预警</h3>
          </div>
          <div className="space-y-3">
            {insightsData.risks.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <AlertTriangle size={14} className="text-red-200 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-50">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
