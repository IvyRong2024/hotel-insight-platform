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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Star, MapPin, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export function HotelView() {
  // 转换雷达图数据
  const dimensionData = hotelHealthData.dimensions.labels.map((label, idx) => ({
    dimension: label,
    酒店: hotelHealthData.dimensions.hotel[idx],
    城市均值: hotelHealthData.dimensions.cityAvg[idx],
    品牌均值: hotelHealthData.dimensions.brandAvg[idx],
  }));

  const pieColors = ['#0066FF', '#8b5cf6', '#f59e0b', '#6b7280'];

  return (
    <Layout title="Hotel View" subtitle="酒店视角 · 上海外滩旗舰店">
      {/* 酒店健康度 */}
      <section className="mb-8 animate-fade-in">
        <h2 className="text-lg font-semibold text-white mb-4">酒店健康度</h2>

        {/* 平台评分卡片 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {hotelHealthData.platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-dark-card/80 backdrop-blur-xl border border-dark-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{platform.icon}</span>
                <span className="text-xs text-zinc-500">{platform.name}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{platform.score}</div>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <MapPin size={12} />
                <span>
                  城市 #{platform.rank}/{platform.total}
                </span>
              </div>
            </div>
          ))}
          {/* 综合评分 */}
          <div className="bg-gradient-to-br from-brand-blue/20 to-brand-gold/10 border border-brand-blue/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Star size={18} className="text-brand-gold" />
              <span className="text-xs text-zinc-400">综合</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{hotelHealthData.overallScore}</div>
            <div className="flex items-center gap-1 text-xs text-brand-blue">
              <span>区域 #{hotelHealthData.overallRank}</span>
            </div>
          </div>
        </div>

        {/* 维度雷达图 */}
        <Card>
          <CardHeader title="维度评分对比" subtitle="酒店 vs 城市均值 vs 品牌均值" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionData}>
                <PolarGrid stroke="#1e1e2e" />
                <PolarAngleAxis dataKey="dimension" stroke="#71717a" fontSize={12} />
                <PolarRadiusAxis domain={[3.5, 5]} stroke="#1e1e2e" fontSize={10} />
                <Radar name="酒店" dataKey="酒店" stroke="#0066FF" fill="#0066FF" fillOpacity={0.3} />
                <Radar
                  name="城市均值"
                  dataKey="城市均值"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                />
                <Radar
                  name="品牌均值"
                  dataKey="品牌均值"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid #1e1e2e',
                    borderRadius: '8px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* 驱动因素 + 障碍因素 */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        {/* 驱动因素 */}
        <Card className="animate-fade-in-delay-1">
          <CardHeader title="驱动因素" subtitle="正向影响评分的因素" />
          <div className="space-y-4">
            {hotelDriversData.map((item) => (
              <div key={item.dimension} className="p-3 rounded-lg bg-dark-bg/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200">{item.dimension}</span>
                    {item.trend === 'up' && <TrendingUp size={14} className="text-emerald-400" />}
                    {item.trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
                    {item.trend === 'stable' && <Minus size={14} className="text-zinc-500" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-zinc-400">贡献 {item.contribution}%</span>
                    <span
                      className={clsx(
                        item.vsCity.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      vs城市 {item.vsCity}
                    </span>
                  </div>
                </div>
                <ProgressBar value={item.contribution} max={30} color="blue" size="sm" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 text-xs bg-brand-blue/10 text-brand-blue rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 障碍因素 - 链路视图 */}
        <Card className="animate-fade-in-delay-1">
          <CardHeader title="障碍因素 · 链路视图" subtitle="体验全链路风险分析" />

          {/* 链路流程 */}
          <div className="flex items-center justify-between mb-6">
            {hotelBarriersData.journeyRisks.map((stage, idx) => (
              <div key={stage.stage} className="flex items-center">
                <div
                  className={clsx(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border',
                    stage.risk === 'high'
                      ? 'bg-red-500/10 border-red-500/30'
                      : stage.risk === 'medium'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-dark-bg/50 border-dark-border'
                  )}
                >
                  <span className="text-xl">{stage.icon}</span>
                  <span className="text-xs text-zinc-400">{stage.stage}</span>
                  <Badge
                    variant={
                      stage.risk === 'high'
                        ? 'danger'
                        : stage.risk === 'medium'
                        ? 'warning'
                        : 'success'
                    }
                    size="sm"
                  >
                    {stage.count}
                  </Badge>
                </div>
                {idx < hotelBarriersData.journeyRisks.length - 1 && (
                  <div className="w-8 h-0.5 bg-dark-border mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* 问题聚类 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-xs text-zinc-500 mb-2">房型分布</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hotelBarriersData.clusters.roomType}
                      dataKey="percentage"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={45}
                    >
                      {hotelBarriersData.clusters.roomType.map((_, idx) => (
                        <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121a',
                        border: '1px solid #1e1e2e',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1">
                {hotelBarriersData.clusters.roomType.map((item, idx) => (
                  <div key={item.type} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: pieColors[idx] }}
                      />
                      <span className="text-zinc-400">{item.type}</span>
                    </div>
                    <span className="text-zinc-300">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-zinc-500 mb-2">楼层分布</h4>
              <div className="space-y-2 mt-4">
                {hotelBarriersData.clusters.floor.map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">{item.type}</span>
                      <span className="text-zinc-300">{item.percentage}%</span>
                    </div>
                    <ProgressBar value={item.percentage} color="red" size="sm" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-zinc-500 mb-2">时段分布</h4>
              <div className="space-y-2 mt-4">
                {hotelBarriersData.clusters.timing.map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">{item.type}</span>
                      <span className="text-zinc-300">{item.percentage}%</span>
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
      <section className="mb-8 animate-fade-in-delay-2">
        <Card>
          <CardHeader title="用户需求洞察" subtitle="基于评论的需求识别" />
          <div className="grid grid-cols-6 gap-4">
            {userNeedsData.map((need) => (
              <div
                key={need.category}
                className="p-4 rounded-lg bg-dark-bg/50 border border-dark-border hover:border-brand-blue/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{need.icon}</span>
                  <span
                    className={clsx(
                      'text-sm',
                      need.trend === '↑'
                        ? 'text-emerald-400'
                        : need.trend === '↓'
                        ? 'text-red-400'
                        : 'text-zinc-500'
                    )}
                  >
                    {need.trend}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-zinc-200 mb-2">{need.category}</h4>
                <ProgressBar value={need.intensity} color="gradient" size="sm" />
                <div className="mt-3 space-y-1">
                  {need.items.slice(0, 2).map((item) => (
                    <div key={item} className="text-xs text-zinc-500 truncate">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 新店评估 */}
      <section className="animate-fade-in-delay-3">
        <Card>
          <CardHeader
            title="新店开业评估"
            subtitle={`${newOpeningData.hotelName} · 开业 ${newOpeningData.daysOpen} 天`}
            action={
              <Badge variant="info">
                <Clock size={12} className="mr-1" />
                0-90天追踪
              </Badge>
            }
          />
          <div className="grid grid-cols-3 gap-6">
            {/* 稳定性曲线 */}
            <div className="col-span-2">
              <h4 className="text-sm text-zinc-400 mb-3">稳定性评分曲线</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={newOpeningData.trajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis
                      dataKey="day"
                      stroke="#71717a"
                      fontSize={12}
                      tickFormatter={(v) => `D${v}`}
                    />
                    <YAxis domain={[60, 80]} stroke="#71717a" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12121a',
                        border: '1px solid #1e1e2e',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(v) => `第 ${v} 天`}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0066FF"
                      strokeWidth={2}
                      dot={{ fill: '#0066FF', r: 4 }}
                    />
                    {/* 30/60/90 标记线 */}
                    {[30, 60, 90].map((day) => (
                      <line
                        key={day}
                        x1={day}
                        y1={60}
                        x2={day}
                        y2={80}
                        stroke="#FFB800"
                        strokeDasharray="3 3"
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 亮点与痛点 */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-zinc-400 mb-2 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-400" />
                  新店亮点
                </h4>
                <div className="space-y-2">
                  {newOpeningData.highlights.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 text-sm bg-emerald-500/10 text-emerald-400 rounded-lg"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-zinc-400 mb-2 flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-red-400" />
                  新店痛点
                </h4>
                <div className="space-y-2">
                  {newOpeningData.painPoints.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 text-sm bg-red-500/10 text-red-400 rounded-lg"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-dark-border">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">vs 老店均值</span>
                  <span className="text-red-400">{newOpeningData.vsOldHotels}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-zinc-500">vs 区域均值</span>
                  <span className="text-emerald-400">+{newOpeningData.vsRegionAvg}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </Layout>
  );
}

