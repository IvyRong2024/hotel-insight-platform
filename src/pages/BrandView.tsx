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

// Brand-specific opportunities
const brandOpportunitiesMap: Record<string, string[]> = {
  '洲际酒店': [
    '商务客群对"行政酒廊"服务满意度上升15%',
    '"一站式管家服务"正向提及率增加12%',
    '高端客群忠诚度持续提升，复购率同比+8%'
  ],
  '英迪格': [
    '"邻里文化"提及率上升23%，差异化优势明显',
    '年轻客群（25-35岁）入住占比提升18%',
    '设计美学相关正向评价增长显著'
  ],
  '皇冠假日': [
    '新一线城市早餐满意度高于一线城市8%',
    '会议商务客群满意度稳步提升',
    '"服务温度"关键词正向提及增长15%'
  ],
  '假日酒店': [
    '家庭客群入住占比稳定增长',
    '性价比评价在中端品牌中领先',
    '早餐品类丰富度获好评率上升'
  ],
  '智选假日': [
    '商务差旅客群满意度持续领先',
    '"高效入住"体验评价优于竞品12%',
    '新开门店网络覆盖密度提升明显'
  ],
  'default': [
    '品牌认知度持续提升',
    '核心客群满意度稳定',
    '服务标准化程度提高'
  ]
};

// Brand-specific risks
const brandRisksMap: Record<string, string[]> = {
  '洲际酒店': [
    '部分城市设施老化问题开始显现',
    '竞品JW万豪在设施方面评价领先',
    '价格敏感型客户流失风险增加'
  ],
  '英迪格': [
    '"邻里文化"体验在部分门店未能落地',
    'W酒店在潮流设计方面评价领先',
    '部分门店设计感与品牌定位不符'
  ],
  '皇冠假日': [
    '节假日前台效率投诉增加20%',
    '万豪酒店会员体系吸引力增强',
    '部分门店早餐供应稳定性待提升'
  ],
  '假日酒店': [
    '节假日前台效率投诉激增35%',
    '隔音问题成为主要差评来源',
    '竞品促销力度加大，价格优势减弱'
  ],
  '智选假日': [
    '"隔音"差评率连续3月上升，需重点关注',
    '早餐品类单一问题频繁被提及',
    '部分门店卫生稳定性待改善'
  ],
  'default': [
    '竞品促销力度加大',
    '部分区域服务标准需提升',
    '客户期望值持续提高'
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
