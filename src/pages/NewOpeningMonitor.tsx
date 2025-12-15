import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { BrandTier } from '../data/mockData';
import { 
  TrendingUp, AlertTriangle, CheckCircle, 
  Target, Clock, Activity,
  Zap, BarChart3
} from 'lucide-react';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import clsx from 'clsx';

// 新店生命周期阶段
type LifecyclePhase = 'launch' | 'adjustment' | 'stabilization';
const phases: Record<LifecyclePhase, { name: string; range: string; color: string }> = {
  launch: { name: '启动期', range: '0-30天', color: '#ef4444' },
  adjustment: { name: '磨合期', range: '31-90天', color: '#f59e0b' },
  stabilization: { name: '稳定期', range: '91-180天', color: '#22c55e' },
};

// 新店数据
const newOpeningData = {
  hotels: [
    {
      id: 'new-1',
      name: '杭州西湖假日酒店',
      brand: '假日酒店',
      tier: 'essentials' as BrandTier,
      city: '杭州',
      region: '华东',
      openDate: '2024-10-18',
      daysOpen: 58,
      phase: 'adjustment' as LifecyclePhase,
      currentScore: 4.42,
      targetScore: 4.5,
      stabilityIndex: 72,
      maturityScore: 68,
      brandFulfillment: 75,
      highScoreRatio: 78,
      negativeRatio: 8,
      riskLevel: 'medium' as const,
      scoreTrend: [
        { day: 7, score: 4.15 },
        { day: 14, score: 4.28 },
        { day: 21, score: 4.35 },
        { day: 28, score: 4.38 },
        { day: 35, score: 4.42 },
        { day: 42, score: 4.40 },
        { day: 49, score: 4.45 },
        { day: 56, score: 4.42 },
      ],
      experienceRadar: [
        { dimension: '房间舒适度', score: 72, benchmark: 85 },
        { dimension: '清洁卫生', score: 68, benchmark: 88 },
        { dimension: '入住流程', score: 65, benchmark: 82 },
        { dimension: '服务响应', score: 75, benchmark: 80 },
        { dimension: '早餐配套', score: 70, benchmark: 78 },
        { dimension: '环境安全', score: 80, benchmark: 85 },
      ],
      drivers: [
        { factor: '新装修设施', contribution: 28, mentions: 45 },
        { factor: '服务热情', contribution: 22, mentions: 38 },
        { factor: '地理位置', contribution: 18, mentions: 32 },
        { factor: '房型设计', contribution: 15, mentions: 25 },
      ],
      barriers: [
        { factor: '入住等待时间', severity: 'high', frequency: 15, trend: 'stable', description: '前台办理入住平均等待超10分钟' },
        { factor: '隔音问题', severity: 'medium', frequency: 12, trend: 'improving', description: '临街房型隔音反馈较多' },
        { factor: '早餐补给不及时', severity: 'medium', frequency: 8, trend: 'worsening', description: '周末高峰期补餐不及时' },
        { factor: '热水不稳定', severity: 'low', frequency: 5, trend: 'stable', description: '个别房型反馈热水忽冷忽热' },
      ],
      brandValidation: {
        score: 75,
        gaps: [
          { promise: '高效入住', fulfilled: false, feedback: '入住流程熟练度不足，等待时间较长' },
          { promise: '舒适睡眠', fulfilled: true, feedback: '床品质量获得认可' },
          { promise: '便捷位置', fulfilled: true, feedback: '地段便利性被频繁正向提及' },
        ],
      },
      actions: {
        launch: [
          { action: '前台话术培训', priority: 'high', owner: '店长', status: 'completed' },
          { action: '清洁质检流程建立', priority: 'high', owner: '店长', status: 'completed' },
        ],
        adjustment: [
          { action: '入住流程优化', priority: 'high', owner: '店长', status: 'in_progress' },
          { action: '早餐高峰预案', priority: 'medium', owner: '店长', status: 'pending' },
          { action: '隔音解决方案', priority: 'medium', owner: '城市经理', status: 'pending' },
        ],
        stabilization: [
          { action: '品牌体验强化', priority: 'medium', owner: '品牌运营', status: 'pending' },
          { action: '纳入常规评估', priority: 'low', owner: '区域VP', status: 'pending' },
        ],
      },
    },
    {
      id: 'new-2',
      name: '成都春熙voco酒店',
      brand: 'voco',
      tier: 'premium' as BrandTier,
      city: '成都',
      region: '西南',
      openDate: '2024-11-25',
      daysOpen: 20,
      phase: 'launch' as LifecyclePhase,
      currentScore: 4.28,
      targetScore: 4.6,
      stabilityIndex: 58,
      maturityScore: 52,
      brandFulfillment: 65,
      highScoreRatio: 68,
      negativeRatio: 15,
      riskLevel: 'high' as const,
      scoreTrend: [
        { day: 7, score: 4.05 },
        { day: 14, score: 4.18 },
        { day: 20, score: 4.28 },
      ],
      experienceRadar: [
        { dimension: '房间舒适度', score: 62, benchmark: 88 },
        { dimension: '清洁卫生', score: 55, benchmark: 90 },
        { dimension: '入住流程', score: 48, benchmark: 85 },
        { dimension: '服务响应', score: 58, benchmark: 85 },
        { dimension: '早餐配套', score: 52, benchmark: 82 },
        { dimension: '环境安全', score: 70, benchmark: 88 },
      ],
      drivers: [
        { factor: '设计风格', contribution: 32, mentions: 28 },
        { factor: '新设施体验', contribution: 25, mentions: 22 },
        { factor: '员工态度', contribution: 18, mentions: 15 },
      ],
      barriers: [
        { factor: '清洁不到位', severity: 'high', frequency: 22, trend: 'worsening', description: '翻房质量不稳定，多次反馈卫生问题' },
        { factor: '入住混乱', severity: 'high', frequency: 18, trend: 'stable', description: '系统不熟练，办理效率低' },
        { factor: '空调异响', severity: 'medium', frequency: 10, trend: 'stable', description: '设备调试期问题' },
        { factor: '早餐品种少', severity: 'medium', frequency: 8, trend: 'stable', description: '与品牌标准有差距' },
      ],
      brandValidation: {
        score: 65,
        gaps: [
          { promise: 'voco品牌调性', fulfilled: false, feedback: '品牌特色体验未充分展现' },
          { promise: '舒适体验', fulfilled: false, feedback: '清洁问题影响体验' },
          { promise: '个性化服务', fulfilled: true, feedback: '员工态度获得认可' },
        ],
      },
      actions: {
        launch: [
          { action: '清洁标准强化培训', priority: 'high', owner: '店长', status: 'in_progress' },
          { action: '入住流程演练', priority: 'high', owner: '店长', status: 'in_progress' },
          { action: '空调设备检修', priority: 'medium', owner: '工程部', status: 'pending' },
        ],
        adjustment: [],
        stabilization: [],
      },
    },
  ],
  benchmarks: {
    essentials: { avgScore: 4.52, stabilityIndex: 85, maturityScore: 88 },
    premium: { avgScore: 4.65, stabilityIndex: 88, maturityScore: 90 },
    luxury_lifestyle: { avgScore: 4.72, stabilityIndex: 90, maturityScore: 92 },
    suites: { avgScore: 4.58, stabilityIndex: 86, maturityScore: 87 },
  },
};

export function NewOpeningMonitor() {
  const [selectedHotel, setSelectedHotel] = useState(newOpeningData.hotels[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'drivers' | 'barriers' | 'brand' | 'actions'>('overview');

  const tabs = [
    { id: 'overview', label: '健康概览', icon: Activity },
    { id: 'experience', label: '体验成熟度', icon: BarChart3 },
    { id: 'drivers', label: '正向驱动', icon: TrendingUp },
    { id: 'barriers', label: '障碍与风险', icon: AlertTriangle },
    { id: 'brand', label: '品牌兑现', icon: Target },
    { id: 'actions', label: '行动建议', icon: Zap },
  ];

  const benchmark = newOpeningData.benchmarks[selectedHotel.tier];

  return (
    <Layout title="New Opening Monitor" subtitle="新店表现监测：0-180天运营稳定性与体验成熟度评估" requiredModule="hotel">
      <div className="space-y-6">
        {/* 新店选择 */}
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🏨 新店列表（开业≤180天）</h3>
            <Badge>{newOpeningData.hotels.length} 家新店</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {newOpeningData.hotels.map((hotel) => (
              <Card 
                key={hotel.id}
                className={clsx(
                  'cursor-pointer transition-all',
                  selectedHotel.id === hotel.id ? 'ring-2 ring-ihg-navy' : 'hover:ring-1 hover:ring-slate-200'
                )}
                onClick={() => setSelectedHotel(hotel)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800">{hotel.name}</span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: phases[hotel.phase].color + '20', color: phases[hotel.phase].color }}
                      >
                        {phases[hotel.phase].name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span>{hotel.brand}</span>
                      <span>·</span>
                      <span>{hotel.city}</span>
                      <span>·</span>
                      <span>开业 {hotel.daysOpen} 天</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{hotel.currentScore}</div>
                    <div className={clsx(
                      'text-xs',
                      hotel.riskLevel === 'high' ? 'text-red-600' : 
                      hotel.riskLevel === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                    )}>
                      {hotel.riskLevel === 'high' ? '⚠️ 高风险' : 
                       hotel.riskLevel === 'medium' ? '⚡ 中风险' : '✓ 低风险'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tab 导航 */}
        <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-ihg-navy text-ihg-navy'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 健康概览 */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* 核心指标 */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-ihg-navy to-ihg-navy-light text-white">
                <p className="text-white/60 text-sm mb-1">当前评分</p>
                <p className="text-3xl font-bold">{selectedHotel.currentScore}</p>
                <p className="text-white/50 text-xs mt-1">目标 {selectedHotel.targetScore}</p>
              </Card>
              <Card>
                <p className="text-slate-500 text-sm mb-1">稳定性指数</p>
                <p className="text-3xl font-bold text-slate-800">{selectedHotel.stabilityIndex}%</p>
                <p className="text-xs text-slate-400 mt-1">成熟店基准 {benchmark.stabilityIndex}%</p>
              </Card>
              <Card>
                <p className="text-slate-500 text-sm mb-1">成熟度评分</p>
                <p className="text-3xl font-bold text-slate-800">{selectedHotel.maturityScore}</p>
                <p className="text-xs text-slate-400 mt-1">成熟店基准 {benchmark.maturityScore}</p>
              </Card>
              <Card>
                <p className="text-slate-500 text-sm mb-1">高分占比</p>
                <p className="text-3xl font-bold text-emerald-600">{selectedHotel.highScoreRatio}%</p>
                <p className="text-xs text-slate-400 mt-1">4.5分以上</p>
              </Card>
              <Card>
                <p className="text-slate-500 text-sm mb-1">负面评论</p>
                <p className="text-3xl font-bold text-red-600">{selectedHotel.negativeRatio}%</p>
                <p className="text-xs text-slate-400 mt-1">1-2星占比</p>
              </Card>
            </div>

            {/* 评分趋势 */}
            <Card>
              <h4 className="font-semibold text-slate-800 mb-4">📈 评分趋势</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={selectedHotel.scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `第${v}天`} />
                  <YAxis domain={[3.8, 5]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip formatter={(value: number) => [value.toFixed(2), '评分']} />
                  <Line type="monotone" dataKey="score" stroke="#003B6F" strokeWidth={3} dot={{ fill: '#003B6F' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* 生命周期阶段 */}
            <Card>
              <h4 className="font-semibold text-slate-800 mb-4">🔄 新店生命周期</h4>
              <div className="flex items-center gap-2">
                {Object.entries(phases).map(([key, phase]) => (
                  <div key={key} className="flex-1">
                    <div className={clsx(
                      'h-3 rounded-full',
                      selectedHotel.phase === key ? 'opacity-100' : 'opacity-30'
                    )} style={{ backgroundColor: phase.color }} />
                    <div className="mt-2 text-center">
                      <p className={clsx(
                        'text-sm font-medium',
                        selectedHotel.phase === key ? 'text-slate-800' : 'text-slate-400'
                      )}>{phase.name}</p>
                      <p className="text-xs text-slate-400">{phase.range}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 体验成熟度 */}
        {activeTab === 'experience' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <h4 className="font-semibold text-slate-800 mb-4">🎯 体验雷达图</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={selectedHotel.experienceRadar}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="新店" dataKey="score" stroke="#003B6F" fill="#003B6F" fillOpacity={0.3} strokeWidth={2} />
                    <Radar name="成熟店基准" dataKey="benchmark" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <h4 className="font-semibold text-slate-800 mb-4">📊 vs 成熟店差距</h4>
                <div className="space-y-4">
                  {selectedHotel.experienceRadar.map((item) => (
                    <div key={item.dimension}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">{item.dimension}</span>
                        <span className={clsx(
                          'font-medium',
                          item.score >= item.benchmark ? 'text-emerald-600' : 'text-amber-600'
                        )}>
                          {item.score >= item.benchmark ? '+' : ''}{item.score - item.benchmark}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            'h-full rounded-full',
                            item.score >= item.benchmark ? 'bg-emerald-500' : 'bg-amber-500'
                          )}
                          style={{ width: `${(item.score / item.benchmark) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 正向驱动 */}
        {activeTab === 'drivers' && (
          <div className="space-y-6 animate-fade-in-up">
            <Card>
              <h4 className="font-semibold text-slate-800 mb-4">⭐ 新店 Top Drivers</h4>
              <p className="text-sm text-slate-500 mb-4">识别新店真实被用户认可的亮点</p>
              <div className="space-y-4">
                {selectedHotel.drivers.map((driver, idx) => (
                  <div key={driver.factor} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-800">{driver.factor}</span>
                        <span className="text-sm text-emerald-600">+{driver.contribution}% 贡献度</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${driver.contribution * 3}%` }} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{driver.mentions} 次正向提及</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 障碍与风险 */}
        {activeTab === 'barriers' && (
          <div className="space-y-6 animate-fade-in-up">
            <Card>
              <h4 className="font-semibold text-slate-800 mb-4">⚠️ 早期风险识别</h4>
              <p className="text-sm text-slate-500 mb-4">聚焦新店高发、可提前干预的问题</p>
              <div className="space-y-4">
                {selectedHotel.barriers.map((barrier) => (
                  <div key={barrier.factor} className={clsx(
                    'p-4 rounded-xl border',
                    barrier.severity === 'high' ? 'bg-red-50 border-red-200' :
                    barrier.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                    'bg-slate-50 border-slate-200'
                  )}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-800">{barrier.factor}</span>
                          <Badge variant={barrier.severity === 'high' ? 'danger' : barrier.severity === 'medium' ? 'warning' : 'info'}>
                            {barrier.severity === 'high' ? '高' : barrier.severity === 'medium' ? '中' : '低'}
                          </Badge>
                          <span className={clsx(
                            'text-xs px-2 py-0.5 rounded',
                            barrier.trend === 'worsening' ? 'bg-red-100 text-red-600' :
                            barrier.trend === 'improving' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-slate-100 text-slate-600'
                          )}>
                            {barrier.trend === 'worsening' ? '↑ 恶化' : barrier.trend === 'improving' ? '↓ 改善' : '— 稳定'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{barrier.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-800">{barrier.frequency}次</p>
                        <p className="text-xs text-slate-400">发生频率</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 品牌兑现 */}
        {activeTab === 'brand' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-ihg-navy to-ihg-navy-light text-white">
                <p className="text-white/60 text-sm mb-1">品牌兑现度</p>
                <p className="text-4xl font-bold">{selectedHotel.brandFulfillment}%</p>
                <p className="text-white/50 text-xs mt-2">用户是否感知到品牌核心主张</p>
              </Card>
            </div>
            <Card>
              <h4 className="font-semibold text-slate-800 mb-4">🎯 品牌承诺验证</h4>
              <div className="space-y-4">
                {selectedHotel.brandValidation.gaps.map((gap, idx) => (
                  <div key={idx} className={clsx(
                    'p-4 rounded-xl border',
                    gap.fulfilled ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                  )}>
                    <div className="flex items-center gap-3 mb-2">
                      {gap.fulfilled ? (
                        <CheckCircle className="text-emerald-600" size={20} />
                      ) : (
                        <AlertTriangle className="text-amber-600" size={20} />
                      )}
                      <span className="font-medium text-slate-800">{gap.promise}</span>
                      <Badge variant={gap.fulfilled ? 'success' : 'warning'}>
                        {gap.fulfilled ? '已兑现' : '待改进'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 ml-8">{gap.feedback}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 行动建议 */}
        {activeTab === 'actions' && (
          <div className="space-y-6 animate-fade-in-up">
            {Object.entries(phases).map(([key, phase]) => {
              const phaseActions = selectedHotel.actions[key as LifecyclePhase];
              if (phaseActions.length === 0) return null;
              return (
                <Card key={key}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: phase.color }} />
                    <h4 className="font-semibold text-slate-800">{phase.name}（{phase.range}）</h4>
                  </div>
                  <div className="space-y-3">
                    {phaseActions.map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          {action.status === 'completed' ? (
                            <CheckCircle className="text-emerald-600" size={18} />
                          ) : action.status === 'in_progress' ? (
                            <Clock className="text-amber-600" size={18} />
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />
                          )}
                          <div>
                            <span className="font-medium text-slate-800">{action.action}</span>
                            <span className="text-xs text-slate-400 ml-2">责任人：{action.owner}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={action.priority === 'high' ? 'danger' : action.priority === 'medium' ? 'warning' : 'info'}>
                            {action.priority === 'high' ? '高优' : action.priority === 'medium' ? '中优' : '低优'}
                          </Badge>
                          <span className={clsx(
                            'text-xs px-2 py-0.5 rounded',
                            action.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                            action.status === 'in_progress' ? 'bg-amber-100 text-amber-600' :
                            'bg-slate-100 text-slate-600'
                          )}>
                            {action.status === 'completed' ? '已完成' : action.status === 'in_progress' ? '进行中' : '待处理'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

