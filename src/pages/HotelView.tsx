import { Layout } from '../components/Layout';
import { Card, CardHeader, Badge, ProgressBar } from '../components/ui';
import {
  hotelHealthData,
  hotelDriversData,
  hotelBarriersData,
  userNeedsData,
  newOpeningData,
} from '../data/mockData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Star, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export function HotelView() {
  const dimensionData = hotelHealthData.dimensions.labels.map((label, idx) => ({
    dimension: label,
    酒店: hotelHealthData.dimensions.hotel[idx],
    城市均值: hotelHealthData.dimensions.cityAvg[idx],
    品牌均值: hotelHealthData.dimensions.brandAvg[idx],
  }));

  return (
    <Layout title="Hotel View" subtitle={`${hotelHealthData.hotelName}`} requiredModule="hotel">
      
      {/* 酒店核心指标 */}
      <section className="mb-8 animate-fade-in-up">
        <div className="grid grid-cols-6 gap-4">
          {hotelHealthData.platforms.map((platform) => (
            <div key={platform.name} className="bg-white rounded-2xl p-4 border border-slate-100">
              <div className="text-sm text-slate-500 mb-2">{platform.name}</div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{platform.score}</div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <MapPin size={12} />
                <span>城市 #{platform.rank}</span>
              </div>
            </div>
          ))}
          <div className="bg-gradient-to-br from-ihg-navy to-ihg-navy-light rounded-2xl p-4 text-white">
            <div className="flex items-center gap-1 text-white/60 text-sm mb-2">
              <Star size={14} className="text-ihg-gold" />
              综合评分
            </div>
            <div className="text-2xl font-bold mb-1">{hotelHealthData.overallScore}</div>
            <div className="text-xs text-white/60">区域排名 #{hotelHealthData.overallRank}</div>
          </div>
        </div>
      </section>

      {/* 维度雷达图 + 驱动因素 */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        <Card className="animate-fade-in-up delay-100">
          <CardHeader title="📊 维度评分对比" subtitle="酒店 vs 城市均值 vs 品牌均值" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" stroke="#64748b" fontSize={11} />
                <PolarRadiusAxis domain={[3.5, 5]} stroke="#e2e8f0" fontSize={10} />
                <Radar name="酒店" dataKey="酒店" stroke="#003B6F" fill="#003B6F" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="城市均值" dataKey="城市均值" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                <Radar name="品牌均值" dataKey="品牌均值" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="animate-fade-in-up delay-100">
          <CardHeader title="✅ 正向驱动因素" subtitle="推动评分上升的关键因素" />
          <div className="space-y-4">
            {hotelDriversData.map((item) => (
              <div key={item.dimension} className="p-3 rounded-xl bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{item.dimension}</span>
                    {item.trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
                    {item.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                    {item.trend === 'stable' && <Minus size={14} className="text-slate-400" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">贡献 {item.contribution}%</span>
                    <span className={clsx(item.vsCity.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                      vs城市 {item.vsCity}
                    </span>
                  </div>
                </div>
                <ProgressBar value={item.contribution} max={30} color="navy" size="sm" />
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 链路风险分析 */}
      <section className="mb-8 animate-fade-in-up delay-200">
        <Card>
          <CardHeader title="⚠️ 体验链路风险分析" subtitle="从预订到退房的全流程问题追踪" />
          <div className="flex items-center justify-between px-8 py-6">
            {hotelBarriersData.journeyRisks.map((stage, idx) => (
              <div key={stage.stage} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={clsx(
                    'w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 mb-2',
                    stage.risk === 'high' ? 'bg-red-50 border-red-300' : 
                    stage.risk === 'medium' ? 'bg-amber-50 border-amber-300' : 
                    'bg-emerald-50 border-emerald-300'
                  )}>
                    {stage.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                  <Badge variant={stage.risk === 'high' ? 'danger' : stage.risk === 'medium' ? 'warning' : 'success'}>
                    {stage.count} 个问题
                  </Badge>
                </div>
                {idx < hotelBarriersData.journeyRisks.length - 1 && (
                  <div className="w-16 h-0.5 bg-slate-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 用户需求 */}
      <section className="mb-8 animate-fade-in-up delay-300">
        <Card>
          <CardHeader title="💡 用户需求洞察" subtitle="基于评论的需求识别" />
          <div className="grid grid-cols-6 gap-4">
            {userNeedsData.map((need) => (
              <div key={need.category} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-ihg-navy/20 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{need.icon}</span>
                  <span className={clsx(
                    'text-sm font-medium',
                    need.trend === '↑' ? 'text-emerald-600' : need.trend === '↓' ? 'text-red-600' : 'text-slate-400'
                  )}>{need.trend}</span>
                </div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">{need.category}</h4>
                <ProgressBar value={need.intensity} color="navy" size="sm" />
                <div className="mt-3 space-y-1">
                  {need.items.slice(0, 2).map((item) => (
                    <div key={item} className="text-xs text-slate-500">• {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 新店评估 */}
      <section className="animate-fade-in-up delay-400">
        <Card>
          <CardHeader
            title="🏨 新店开业评估"
            subtitle={`${newOpeningData.hotelName} · 开业 ${newOpeningData.daysOpen} 天`}
            action={<Badge variant="info"><Clock size={12} className="mr-1" />0-90天追踪</Badge>}
          />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={newOpeningData.trajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `D${v}`} />
                    <YAxis domain={[60, 80]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} labelFormatter={(v) => `第 ${v} 天`} />
                    <Line type="monotone" dataKey="score" stroke="#003B6F" strokeWidth={3} dot={{ fill: '#003B6F', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <CheckCircle size={14} />
                  <span className="text-sm font-medium">新店亮点</span>
                </div>
                <div className="space-y-1.5">
                  {newOpeningData.highlights.map((item) => (
                    <div key={item} className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg">{item}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-red-600">
                  <AlertCircle size={14} />
                  <span className="text-sm font-medium">待改进点</span>
                </div>
                <div className="space-y-1.5">
                  {newOpeningData.painPoints.map((item) => (
                    <div key={item} className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}
