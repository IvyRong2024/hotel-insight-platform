import { Layout } from '../components/Layout';
import { Card, CardHeader, Badge, ProgressBar } from '../components/ui';
import {
  hotelHealthData,
  hotelDriversData,
  hotelBarriersData,
  userNeedsData,
  newOpeningData,
  platformConfig,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Star, MapPin, Clock, AlertCircle, Monitor } from 'lucide-react';
import clsx from 'clsx';

export function HotelView() {
  const dimensionData = hotelHealthData.dimensions.labels.map((label, idx) => ({
    dimension: label,
    酒店: hotelHealthData.dimensions.hotel[idx],
    城市均值: hotelHealthData.dimensions.cityAvg[idx],
    品牌均值: hotelHealthData.dimensions.brandAvg[idx],
  }));

  const pieColors = ['#0066FF', '#8b5cf6', '#f59e0b', '#94a3b8'];

  return (
    <Layout title="Hotel View" subtitle={`${hotelHealthData.hotelName} · ${hotelHealthData.brand}`}>
      {/* 平台覆盖提示 */}
      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <Monitor size={14} />
        <span>评论来源：{platformConfig.review.platforms.join('、')}</span>
      </div>

      {/* 酒店健康度 */}
      <section className="mb-5 animate-fade-in">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">酒店健康度</h2>

        <div className="grid grid-cols-6 gap-3 mb-4">
          {hotelHealthData.platforms.map((platform) => (
            <div key={platform.name} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{platform.name}</span>
              </div>
              <div className="text-xl font-bold text-slate-800 mb-1">{platform.score}</div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <MapPin size={10} />
                <span>#{platform.rank}/{platform.total}</span>
              </div>
            </div>
          ))}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <Star size={14} className="text-brand-gold" />
              <span className="text-xs text-slate-500">综合</span>
            </div>
            <div className="text-xl font-bold text-slate-800 mb-1">{hotelHealthData.overallScore}</div>
            <div className="text-[10px] text-brand-blue">区域 #{hotelHealthData.overallRank}</div>
          </div>
        </div>

        <Card padding="sm">
          <CardHeader title="维度评分对比" subtitle="酒店 vs 城市均值 vs 品牌均值" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dimension" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis domain={[3.5, 5]} stroke="#e2e8f0" fontSize={9} />
                <Radar name="酒店" dataKey="酒店" stroke="#0066FF" fill="#0066FF" fillOpacity={0.2} />
                <Radar name="城市均值" dataKey="城市均值" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                <Radar name="品牌均值" dataKey="品牌均值" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* 驱动因素 + 障碍因素 */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <Card padding="sm" className="animate-fade-in-delay-1">
          <CardHeader title="驱动因素" subtitle="正向影响评分的因素" />
          <div className="space-y-3">
            {hotelDriversData.map((item) => (
              <div key={item.dimension} className="p-2 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-700">{item.dimension}</span>
                    {item.trend === 'up' && <TrendingUp size={12} className="text-emerald-500" />}
                    {item.trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
                    {item.trend === 'stable' && <Minus size={12} className="text-slate-400" />}
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-400">贡献 {item.contribution}%</span>
                    <span className={clsx(item.vsCity.startsWith('+') ? 'text-emerald-500' : 'text-red-500')}>
                      vs城市 {item.vsCity}
                    </span>
                  </div>
                </div>
                <ProgressBar value={item.contribution} max={30} color="blue" size="sm" />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.keywords.slice(0, 2).map((kw) => (
                    <span key={kw} className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-brand-blue rounded">{kw}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="sm" className="animate-fade-in-delay-1">
          <CardHeader title="障碍因素 · 链路视图" subtitle="体验全链路风险分析" />
          <div className="flex items-center justify-between mb-4">
            {hotelBarriersData.journeyRisks.map((stage, idx) => (
              <div key={stage.stage} className="flex items-center">
                <div
                  className={clsx(
                    'flex flex-col items-center gap-1 p-2 rounded-lg border',
                    stage.risk === 'high' ? 'bg-red-50 border-red-200' : stage.risk === 'medium' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <span className="text-base">{stage.icon}</span>
                  <span className="text-[10px] text-slate-500">{stage.stage}</span>
                  <Badge variant={stage.risk === 'high' ? 'danger' : stage.risk === 'medium' ? 'warning' : 'success'} size="sm">
                    {stage.count}
                  </Badge>
                </div>
                {idx < hotelBarriersData.journeyRisks.length - 1 && <div className="w-4 h-0.5 bg-slate-200 mx-0.5" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <h4 className="text-[10px] text-slate-400 mb-1.5">房型分布</h4>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={hotelBarriersData.clusters.roomType} dataKey="percentage" nameKey="type" cx="50%" cy="50%" innerRadius={18} outerRadius={35}>
                      {hotelBarriersData.clusters.roomType.map((_, idx) => (
                        <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] text-slate-400 mb-1.5">楼层分布</h4>
              <div className="space-y-1.5 mt-2">
                {hotelBarriersData.clusters.floor.map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-slate-500">{item.type}</span>
                      <span className="text-slate-600">{item.percentage}%</span>
                    </div>
                    <ProgressBar value={item.percentage} color="red" size="sm" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] text-slate-400 mb-1.5">时段分布</h4>
              <div className="space-y-1.5 mt-2">
                {hotelBarriersData.clusters.timing.map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-slate-500">{item.type}</span>
                      <span className="text-slate-600">{item.percentage}%</span>
                    </div>
                    <ProgressBar value={item.percentage} color="yellow" size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 用户需求 */}
      <section className="mb-5 animate-fade-in-delay-2">
        <Card padding="sm">
          <CardHeader title="用户需求洞察" subtitle="基于评论的需求识别" />
          <div className="grid grid-cols-6 gap-3">
            {userNeedsData.map((need) => (
              <div key={need.category} className="p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-brand-blue/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{need.icon}</span>
                  <span className={clsx('text-xs', need.trend === '↑' ? 'text-emerald-500' : need.trend === '↓' ? 'text-red-500' : 'text-slate-400')}>
                    {need.trend}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-slate-700 mb-1.5">{need.category}</h4>
                <ProgressBar value={need.intensity} color="gradient" size="sm" />
                <div className="mt-2 space-y-0.5">
                  {need.items.slice(0, 2).map((item) => (
                    <div key={item} className="text-[10px] text-slate-500 truncate">• {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 新店评估 */}
      <section className="animate-fade-in-delay-3">
        <Card padding="sm">
          <CardHeader
            title="新店开业评估"
            subtitle={`${newOpeningData.hotelName} · 开业 ${newOpeningData.daysOpen} 天`}
            action={<Badge variant="info"><Clock size={10} className="mr-1" />0-90天追踪</Badge>}
          />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <h4 className="text-xs text-slate-500 mb-2">稳定性评分曲线</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={newOpeningData.trajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `D${v}`} />
                    <YAxis domain={[60, 80]} stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }} labelFormatter={(v) => `第 ${v} 天`} />
                    <Line type="monotone" dataKey="score" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-500" />新店亮点
                </h4>
                <div className="space-y-1">
                  {newOpeningData.highlights.map((item) => (
                    <div key={item} className="px-2 py-1 text-xs bg-emerald-50 text-emerald-600 rounded">{item}</div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
                  <AlertCircle size={12} className="text-red-500" />新店痛点
                </h4>
                <div className="space-y-1">
                  {newOpeningData.painPoints.map((item) => (
                    <div key={item} className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded">{item}</div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">vs 老店均值</span>
                  <span className="text-red-500">{newOpeningData.vsOldHotels}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">vs 区域均值</span>
                  <span className="text-emerald-500">+{newOpeningData.vsRegionAvg}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}
