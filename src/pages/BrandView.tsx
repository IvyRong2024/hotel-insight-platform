import { Layout } from '../components/Layout';
import { Card, Badge, ProgressBar } from '../components/ui';
import { 
  brandHealthData, 
  promiseFulfillmentData, 
  brandDriversData, 
  brandBarriersData, 
  brandCompetitorData,
  brandTiers,
  BrandTier,
  ihgBrands,
  IHGBrand
} from '../data/mockData';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar } from 'recharts';
import clsx from 'clsx';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Brand-specific opportunities - 基于评论关键词和趋势的简单洞察
const brandOpportunitiesMap: Record<string, string[]> = {
  '洲际酒店': [
    '"服务周到"关键词提及率上升18%',
    '"早餐丰富"正向评价占比提升12%',
    '整体好评率较上月提升0.8个百分点'
  ],
  '英迪格': [
    '"设计独特"关键词正向提及增长23%',
    '"位置便利"好评率持续领先同类品牌',
    '"入住体验"相关正向评价增长显著'
  ],
  '皇冠假日': [
    '"早餐品质"好评率环比提升8%',
    '"服务态度"正向关键词提及增长15%',
    '4.5分以上评论占比稳步上升'
  ],
  '假日酒店': [
    '"性价比高"关键词提及率领先竞品',
    '"早餐丰富"正向评价持续增长',
    '整体评分稳定，波动率低于行业均值'
  ],
  '智选假日': [
    '"入住快速"好评率优于竞品12%',
    '"房间整洁"正向评价占比提升',
    '新开门店首月评分表现良好'
  ],
  'default': [
    '整体评分保持稳定',
    '正向评价占比持续提升',
    '服务相关好评增长'
  ]
};

// Brand-specific risks - 基于评论差评关键词的简单洞察
const brandRisksMap: Record<string, string[]> = {
  '洲际酒店': [
    '部分城市"设施老化"差评开始显现',
    '竞品JW万豪在"设施新"方面评价领先',
    '"价格偏高"负向提及率上升'
  ],
  '英迪格': [
    '部分门店"设计风格"未获认可',
    'W酒店在"潮流感"方面评价领先',
    '"隔音效果"差评在部分门店集中'
  ],
  '皇冠假日': [
    '"入住等待"差评率环比增加20%',
    '竞品万豪酒店整体评分略有领先',
    '部分门店"早餐补给"问题被提及'
  ],
  '假日酒店': [
    '"入住效率"差评率上升35%',
    '"隔音差"成为主要差评关键词',
    '竞品促销期间评论量下降'
  ],
  '智选假日': [
    '"隔音问题"差评连续3月上升趋势',
    '"早餐单一"负向提及频繁',
    '部分门店"卫生"评价波动较大'
  ],
  'default': [
    '竞品促销期间关注度分流',
    '部分门店服务评价波动',
    '差评集中在特定维度'
  ]
};

function getBrandOpportunities(brandName: string): string[] {
  return brandOpportunitiesMap[brandName] || brandOpportunitiesMap['default'];
}

function getBrandRisks(brandName: string): string[] {
  return brandRisksMap[brandName] || brandRisksMap['default'];
}

export function BrandView() {
  const { currentRole } = useAuth();
  const [expandedPromise, setExpandedPromise] = useState<string | null>(null);
  
  // Get selected brand from auth context or default to first brand
  const selectedBrandId = currentRole?.brand || 'holiday_inn';
  const selectedBrandInfo: IHGBrand = ihgBrands.find((b: IHGBrand) => b.id === selectedBrandId) || ihgBrands[0];
  const selectedBrandName = selectedBrandInfo.name;
  
  // Get brand-specific competitor data
  const brandCompetitor = brandCompetitorData.find(b => 
    b.ihgBrand === selectedBrandName || 
    b.ihgBrand.includes(selectedBrandName.replace('酒店', '').replace('假日', '')) ||
    selectedBrandName.includes(b.ihgBrand.replace('酒店', ''))
  ) || brandCompetitorData[0];

  return (
    <Layout title={`${brandCompetitor.ihgBrand} - Brand View`} subtitle={`${brandCompetitor.ihgBrand}品牌深度分析：驱动因素、障碍因素、同类竞品对比`} requiredModule="brand">
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

        {/* 品牌特色用户感知度 */}
        <section className="animate-fade-in-up delay-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🎯 品牌特色用户感知</h3>
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
                          {item.status === 'fulfilled' ? '高感知' : 
                           item.status === 'partial' ? '中感知' : '低感知'}
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
            <Card className="h-full">
              <div className="space-y-4">
                {brandDriversData.map((driver, idx) => (
                  <div key={driver.driver} className={clsx(
                    'flex items-center gap-4 pb-4',
                    idx !== brandDriversData.length - 1 && 'border-b border-slate-100'
                  )}>
                    <div className="w-20 text-sm font-medium text-slate-700 shrink-0">{driver.driver}</div>
                    <div className="flex-1 min-w-0">
                      <ProgressBar value={driver.score} color="green" size="md" />
                    </div>
                    <div className="w-10 text-right font-bold text-emerald-600 text-lg shrink-0">{driver.score}</div>
                    <div className="w-14 text-right text-sm text-emerald-500 shrink-0">{driver.impact}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-slate-600 shrink-0">热词云：</span>
                  <div className="flex flex-wrap gap-1.5">
                    {brandDriversData.flatMap(d => d.keywords).slice(0, 8).map((kw, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* 障碍因素 */}
          <section className="animate-fade-in-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">🚨 品牌障碍因素</h3>
            </div>
            <Card className="h-full">
              <div className="space-y-3">
                {brandBarriersData.map((barrier, idx) => (
                  <div key={barrier.barrier} className={clsx(
                    'flex items-center gap-3 pb-3',
                    idx !== brandBarriersData.length - 1 && 'border-b border-slate-100'
                  )}>
                    {/* 左侧风险指示条 */}
                    <div className={clsx(
                      'w-1 h-12 rounded-full shrink-0',
                      barrier.severity === 'high' ? 'bg-red-500' : 
                      barrier.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-300'
                    )} />
                    
                    {/* 中间信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{barrier.barrier}</span>
                        <Badge variant={barrier.severity === 'high' ? 'danger' : barrier.severity === 'medium' ? 'warning' : 'info'}>
                          {barrier.severity === 'high' ? '高风险' : barrier.severity === 'medium' ? '中风险' : '低风险'}
                        </Badge>
                        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ 
                          backgroundColor: brandTiers[barrier.affectedTier as BrandTier].color + '15', 
                          color: brandTiers[barrier.affectedTier as BrandTier].color 
                        }}>
                          {brandTiers[barrier.affectedTier as BrandTier].name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{barrier.mentions.toLocaleString()} 次提及</span>
                        <span className="flex items-center gap-1">
                          趋势 
                          <span className={clsx(
                            barrier.trend === '↑' ? 'text-red-500' : 
                            barrier.trend === '↓' ? 'text-emerald-500' : 'text-slate-400'
                          )}>
                            {barrier.trend}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    {/* 右侧影响分数 */}
                    <div className={clsx(
                      'text-lg font-bold shrink-0 w-14 text-right',
                      barrier.impact < -0.2 ? 'text-red-600' : 'text-amber-600'
                    )}>
                      {barrier.impact}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>

        {/* 品牌 vs 竞品对比 - 品牌级别 */}
        <section className="animate-fade-in-up delay-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📊 {brandCompetitor.ihgBrand} vs 同类竞品对比</h3>
            <Badge variant="info">{brandTiers[brandCompetitor.tier as BrandTier]?.name || brandCompetitor.tier}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* 雷达图 - 品牌级别 */}
            <Card>
              <h4 className="font-medium text-slate-700 mb-4">多维度对比</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={[
                  { metric: '综合评分', [brandCompetitor.ihgBrand]: brandCompetitor.ihgScore, ...Object.fromEntries(brandCompetitor.competitors.slice(0, 3).map(c => [c.brand, c.score])) },
                  { metric: '服务评分', [brandCompetitor.ihgBrand]: brandCompetitor.ihgScore + 0.08, ...Object.fromEntries(brandCompetitor.competitors.slice(0, 3).map(c => [c.brand, c.score + Math.random() * 0.1])) },
                  { metric: '性价比', [brandCompetitor.ihgBrand]: brandCompetitor.ihgScore - 0.2, ...Object.fromEntries(brandCompetitor.competitors.slice(0, 3).map(c => [c.brand, c.score - 0.15 - Math.random() * 0.1])) },
                  { metric: '清洁度', [brandCompetitor.ihgBrand]: brandCompetitor.ihgScore + 0.12, ...Object.fromEntries(brandCompetitor.competitors.slice(0, 3).map(c => [c.brand, c.score + 0.1 + Math.random() * 0.05])) },
                  { metric: '设施', [brandCompetitor.ihgBrand]: brandCompetitor.ihgScore - 0.05, ...Object.fromEntries(brandCompetitor.competitors.slice(0, 3).map(c => [c.brand, c.score + Math.random() * 0.1 - 0.05])) },
                ]}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis domain={[4, 5]} tick={{ fontSize: 10 }} />
                  <Radar name={brandCompetitor.ihgBrand} dataKey={brandCompetitor.ihgBrand} stroke="#003B6F" fill="#003B6F" fillOpacity={0.3} strokeWidth={2} />
                  {brandCompetitor.competitors.slice(0, 3).map((comp, idx) => (
                    <Radar 
                      key={comp.brand}
                      name={comp.brand} 
                      dataKey={comp.brand} 
                      stroke={['#8b5cf6', '#f59e0b', '#10b981'][idx]} 
                      fill={['#8b5cf6', '#f59e0b', '#10b981'][idx]} 
                      fillOpacity={0.1} 
                      strokeWidth={2} 
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* 柱状图 - 品牌级别 */}
            <Card>
              <h4 className="font-medium text-slate-700 mb-4">综合评分对比</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { brand: brandCompetitor.ihgBrand, score: brandCompetitor.ihgScore, fill: '#003B6F' },
                  ...brandCompetitor.competitors.map((comp, idx) => ({
                    brand: comp.brand,
                    score: comp.score,
                    fill: ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][idx]
                  }))
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="brand" tick={{ fontSize: 11 }} />
                  <YAxis domain={[4.3, 4.9]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" name="综合评分" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </section>

        {/* 竞品详细对比 - 品牌级别 */}
        <section className="animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🎯 {brandCompetitor.ihgBrand} vs 竞品优势分析</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {/* 当前品牌 */}
            <Card className="ring-2 ring-ihg-navy bg-ihg-navy/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-ihg-navy" />
                <span className="font-semibold text-slate-800">{brandCompetitor.ihgBrand}</span>
                <Badge variant="success">IHG</Badge>
              </div>
              <div className="mb-3">
                <span className="text-2xl font-bold text-ihg-navy">{brandCompetitor.ihgScore}</span>
                <span className={clsx('ml-2 text-sm', brandCompetitor.ihgTrend.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                  {brandCompetitor.ihgTrend}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-600">会员忠诚度</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-600">服务温度</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-slate-600">早餐品质</span>
                </div>
              </div>
            </Card>
            
            {/* 竞品品牌 */}
            {brandCompetitor.competitors.slice(0, 3).map((comp, idx) => (
              <Card key={comp.brand}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#8b5cf6', '#f59e0b', '#10b981'][idx] }} />
                  <span className="font-semibold text-slate-800">{comp.brand}</span>
                  <span className="text-xs text-slate-400">{comp.group}</span>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-bold text-slate-700">{comp.score}</span>
                  <span className={clsx('ml-2 text-sm', comp.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                    {comp.trend}
                  </span>
                  <span className={clsx('ml-2 text-xs px-1.5 py-0.5 rounded', 
                    comp.diff.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  )}>
                    vs我方 {comp.diff}
                  </span>
                </div>
                <div className="space-y-2">
                  {comp.advantages.map((adv, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-amber-500">★</span>
                      <span className="text-slate-600">{adv}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 品牌趋势洞察 - 品牌级别 */}
        <section className="animate-fade-in-up delay-250">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🔮 {brandCompetitor.ihgBrand} 趋势洞察</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-emerald-500">
              <h4 className="font-medium text-emerald-700 mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                机会点
              </h4>
              <ul className="space-y-2">
                {getBrandOpportunities(brandCompetitor.ihgBrand).map((opp, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                <TrendingDown size={18} />
                风险点
              </h4>
              <ul className="space-y-2">
                {getBrandRisks(brandCompetitor.ihgBrand).map((risk, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
