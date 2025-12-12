import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { brandHealthData, actionsData, priceData, hotelHealthData, newOpeningData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, AlertTriangle, Star, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

export function Overview() {
  const { currentRole } = useAuth();
  
  if (!currentRole) return null;

  return (
    <Layout title="Overview" subtitle={currentRole.description} requiredModule="overview">
      
      {/* 欢迎区域 */}
      <section className="mb-8 animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 mb-1">欢迎回来</p>
              <h2 className="text-2xl font-bold">{currentRole.name}</h2>
              <p className="text-white/70 mt-1">{currentRole.level}</p>
            </div>
            <div className="text-right text-white/60 text-sm">
              <p>数据更新时间</p>
              <p className="text-white font-medium">2024-12-12 08:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* 根据角色渲染不同的北极星指标 */}
      {currentRole.id === 'brand_ops' && <BrandOpsOverview />}
      {currentRole.id === 'region_vp' && <RegionOverview level="区域" name="华东区" />}
      {currentRole.id === 'city_mgr' && <RegionOverview level="城市" name="上海市" />}
      {currentRole.id === 'hotel_mgr' && <HotelMgrOverview />}
      {currentRole.id === 'revenue_mgr' && <RevenueMgrOverview />}
      {currentRole.id === 'new_hotel' && <NewHotelOverview />}
    </Layout>
  );
}

// ========== 品牌运营视角 ==========
function BrandOpsOverview() {
  const isScoreUp = brandHealthData.trends.overallScore.startsWith('+');
  
  return (
    <>
      {/* 北极星指标 */}
      <section className="mb-8 animate-fade-in-up delay-100">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📊 北极星指标</h3>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard 
            label="品牌综合评分" 
            value={brandHealthData.overallScore.toString()} 
            suffix="/ 5.0"
            trend={brandHealthData.trends.overallScore}
            isUp={isScoreUp}
          />
          <MetricCard 
            label="情绪指数" 
            value={`${brandHealthData.sentimentIndex}%`}
            trend={brandHealthData.trends.sentimentIndex}
            isUp={true}
          />
          <MetricCard 
            label="品牌承诺达成率" 
            value="72%"
            trend="+3.2%"
            isUp={true}
          />
          <MetricCard 
            label="vs 竞对差距" 
            value="+0.14"
            subtext="领先万豪"
            isUp={true}
          />
        </div>
      </section>

      {/* 数据变化总结 */}
      <section className="animate-fade-in-up delay-200">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📝 本期变化总结</h3>
        <div className="grid grid-cols-2 gap-6">
          <SummaryCard 
            type="positive"
            title="正向变化"
            items={[
              '品牌综合评分连续3周上升，当前4.52分',
              '"服务态度"成为核心驱动因素，贡献+0.35',
              '英迪格品牌"邻里文化"差异化优势显现',
            ]}
          />
          <SummaryCard 
            type="negative"
            title="需要关注"
            items={[
              '"智能体验"承诺达成率仅45%，需重点改善',
              '智选假日隔音问题差评率连续上升',
              '万豪双12促销力度大，价格敏感用户流失风险',
            ]}
          />
        </div>
      </section>
    </>
  );
}

// ========== 区域/城市负责人视角 ==========
function RegionOverview({ level, name }: { level: string; name: string }) {
  const pendingActions = actionsData.filter(a => a.status === 'pending').length;
  
  return (
    <>
      {/* 北极星指标 */}
      <section className="mb-8 animate-fade-in-up delay-100">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📊 北极星指标</h3>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard 
            label={`${level}综合评分`}
            value="4.48"
            suffix="/ 5.0"
            trend="+2.1%"
            isUp={true}
          />
          <MetricCard 
            label={`${level}排名`}
            value={level === '区域' ? '#2' : '#5'}
            subtext={level === '区域' ? '全国5个区域' : '华东区12个城市'}
          />
          <MetricCard 
            label="管辖门店数"
            value={level === '区域' ? '156' : '28'}
            suffix="家"
          />
          <MetricCard 
            label="待处理行动"
            value={pendingActions.toString()}
            suffix="项"
            highlight={pendingActions > 0}
          />
        </div>
      </section>

      {/* 品牌表现汇总 */}
      <section className="mb-8 animate-fade-in-up delay-200">
        <h3 className="text-base font-semibold text-slate-800 mb-4">🏨 品牌表现汇总</h3>
        <Card>
          <div className="grid grid-cols-5 gap-4">
            {[
              { brand: '洲际酒店', score: 4.68, rank: 1, count: 8, trend: '+0.05' },
              { brand: '皇冠假日', score: 4.52, rank: 2, count: 15, trend: '+0.02' },
              { brand: '假日酒店', score: 4.35, rank: 3, count: 42, trend: '-0.03' },
              { brand: '智选假日', score: 4.21, rank: 4, count: 68, trend: '+0.01' },
              { brand: '英迪格', score: 4.58, rank: 2, count: 23, trend: '+0.08' },
            ].map((item) => (
              <div key={item.brand} className="p-4 rounded-xl bg-slate-50 text-center">
                <div className="text-sm font-medium text-slate-600 mb-2">{item.brand}</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{item.score}</div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="text-slate-400">#{item.rank}</span>
                  <span className={item.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}>
                    {item.trend}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{item.count}家门店</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 数据变化总结 */}
      <section className="animate-fade-in-up delay-300">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📝 本期变化总结</h3>
        <div className="grid grid-cols-2 gap-6">
          <SummaryCard 
            type="positive"
            title="正向变化"
            items={[
              `${name}综合评分环比上升2.1%`,
              '英迪格品牌表现突出，排名上升1位',
              '服务类投诉较上期减少18%',
            ]}
          />
          <SummaryCard 
            type="negative"
            title="需要关注"
            items={[
              '假日酒店评分下滑，需重点关注',
              `${pendingActions}项待处理行动建议`,
              '3家门店隔音问题集中爆发',
            ]}
          />
        </div>
      </section>
    </>
  );
}

// ========== 酒店店长视角 ==========
function HotelMgrOverview() {
  const pendingActions = actionsData.filter(a => a.status === 'pending').length;
  
  return (
    <>
      {/* 北极星指标 */}
      <section className="mb-8 animate-fade-in-up delay-100">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📊 北极星指标</h3>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard 
            label="酒店综合评分"
            value={hotelHealthData.overallScore.toString()}
            suffix="/ 5.0"
            trend="+1.8%"
            isUp={true}
          />
          <MetricCard 
            label="城市排名"
            value={`#${hotelHealthData.overallRank}`}
            subtext="上海市156家酒店"
          />
          <MetricCard 
            label="区域排名"
            value="#45"
            subtext="华东区892家酒店"
          />
          <MetricCard 
            label="全国品牌排名"
            value="#128"
            subtext="英迪格品牌全国"
          />
        </div>
      </section>

      {/* 各平台评分 */}
      <section className="mb-8 animate-fade-in-up delay-200">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📱 各平台评分</h3>
        <Card>
          <div className="grid grid-cols-5 gap-4">
            {hotelHealthData.platforms.map((platform) => (
              <div key={platform.name} className="text-center p-4 rounded-xl bg-slate-50">
                <div className="text-sm text-slate-500 mb-2">{platform.name}</div>
                <div className="text-2xl font-bold text-slate-800">{platform.score}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                  <MapPin size={10} />
                  城市 #{platform.rank}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 待处理行动 */}
      <section className="mb-8 animate-fade-in-up delay-300">
        <h3 className="text-base font-semibold text-slate-800 mb-4">⚡ 待处理行动</h3>
        <Card>
          <div className="space-y-3">
            {actionsData.filter(a => a.status !== 'completed').slice(0, 3).map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Badge variant={action.priority === 'urgent' ? 'danger' : action.priority === 'high' ? 'warning' : 'info'}>
                    {action.priority === 'urgent' ? '紧急' : action.priority === 'high' ? '高优' : '中等'}
                  </Badge>
                  <span className="text-sm font-medium text-slate-700">{action.title}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={12} />
                  {action.deadline}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 数据变化总结 */}
      <section className="animate-fade-in-up delay-400">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📝 本期变化总结</h3>
        <div className="grid grid-cols-2 gap-6">
          <SummaryCard 
            type="positive"
            title="正向变化"
            items={[
              '综合评分环比上升1.8%',
              '服务响应维度得分提升明显',
              '位置交通好评持续领先',
            ]}
          />
          <SummaryCard 
            type="negative"
            title="需要关注"
            items={[
              `${pendingActions}项待处理行动建议`,
              '3楼走廊隔音问题需优先解决',
              '早餐补餐速度投诉增加',
            ]}
          />
        </div>
      </section>
    </>
  );
}

// ========== 定价团队视角 ==========
function RevenueMgrOverview() {
  return (
    <>
      {/* 北极星指标 */}
      <section className="mb-8 animate-fade-in-up delay-100">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📊 北极星指标</h3>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard 
            label="全国均价"
            value={`¥${priceData.regions[0].avgPrice}`}
            trend={priceData.regions[0].change}
            isUp={priceData.regions[0].change.startsWith('+')}
          />
          <MetricCard 
            label="vs 竞对价差"
            value="+¥33"
            subtext="高于万豪均价"
          />
          <MetricCard 
            label="促销活动占比"
            value={`${priceData.regions[0].promoRate}%`}
            trend="-2.1%"
            isUp={false}
          />
          <MetricCard 
            label="性价比指数"
            value="1.12"
            subtext="高性价比"
            isUp={true}
          />
        </div>
      </section>

      {/* 竞对促销预警 */}
      <section className="mb-8 animate-fade-in-up delay-200">
        <h3 className="text-base font-semibold text-slate-800 mb-4">🎯 竞对促销预警</h3>
        <Card>
          <div className="space-y-3">
            {priceData.competitorPromos.map((promo, idx) => (
              <div key={idx} className={clsx(
                'flex items-center justify-between p-4 rounded-xl',
                promo.threat === 'high' ? 'bg-red-50' : promo.threat === 'medium' ? 'bg-amber-50' : 'bg-slate-50'
              )}>
                <div className="flex items-center gap-4">
                  <Badge variant={promo.threat === 'high' ? 'danger' : promo.threat === 'medium' ? 'warning' : 'info'}>
                    {promo.threat === 'high' ? '高威胁' : promo.threat === 'medium' ? '中威胁' : '低威胁'}
                  </Badge>
                  <div>
                    <span className="font-medium text-slate-800">{promo.competitor}</span>
                    <span className="text-ihg-gold font-bold ml-2">{promo.discount}</span>
                    <span className="text-sm text-slate-500 ml-2">{promo.campaign}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={12} />
                  {promo.startDate} ~ {promo.endDate}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 数据变化总结 */}
      <section className="animate-fade-in-up delay-300">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📝 本期变化总结</h3>
        <div className="grid grid-cols-2 gap-6">
          <SummaryCard 
            type="positive"
            title="正向变化"
            items={[
              '性价比指数维持高位，用户感知良好',
              '直客通渠道价格竞争力最强',
              '华东区均价稳步上升5.2%',
            ]}
          />
          <SummaryCard 
            type="negative"
            title="需要关注"
            items={[
              '万豪双12促销力度大，5折起',
              '抖音渠道价差超过10%需关注',
              '华北区均价下降1.2%',
            ]}
          />
        </div>
      </section>
    </>
  );
}

// ========== 新店运营视角 ==========
function NewHotelOverview() {
  return (
    <>
      {/* 北极星指标 */}
      <section className="mb-8 animate-fade-in-up delay-100">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📊 北极星指标</h3>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard 
            label="稳定性评分"
            value={newOpeningData.stabilityScore.toString()}
            suffix="/ 100"
            trend="+5.2%"
            isUp={true}
          />
          <MetricCard 
            label="开业天数"
            value={newOpeningData.daysOpen.toString()}
            suffix="天"
            subtext="0-90天关键期"
          />
          <MetricCard 
            label="风险问题"
            value="3"
            suffix="项"
            highlight={true}
          />
          <MetricCard 
            label="vs 老店均值"
            value={newOpeningData.vsOldHotels > 0 ? `+${newOpeningData.vsOldHotels}` : newOpeningData.vsOldHotels.toString()}
            isUp={newOpeningData.vsOldHotels > 0}
          />
        </div>
      </section>

      {/* 开业进展 */}
      <section className="mb-8 animate-fade-in-up delay-200">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📈 开业稳定化进展</h3>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">30天目标: 65分</span>
                <CheckCircle size={14} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-600">60天目标: 75分</span>
                <Clock size={14} className="text-amber-500" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-sm text-slate-600">90天目标: 85分</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-ihg-navy">{newOpeningData.stabilityScore}</span>
              <span className="text-sm text-slate-400 ml-1">当前得分</span>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-ihg-navy to-ihg-gold rounded-full transition-all"
              style={{ width: `${(newOpeningData.stabilityScore / 100) * 100}%` }}
            />
          </div>
        </Card>
      </section>

      {/* 亮点与痛点 */}
      <section className="animate-fade-in-up delay-300">
        <h3 className="text-base font-semibold text-slate-800 mb-4">📝 本期变化总结</h3>
        <div className="grid grid-cols-2 gap-6">
          <SummaryCard 
            type="positive"
            title="新店亮点"
            items={newOpeningData.highlights}
          />
          <SummaryCard 
            type="negative"
            title="待改进点"
            items={newOpeningData.painPoints}
          />
        </div>
      </section>
    </>
  );
}

// ========== 通用组件 ==========
interface MetricCardProps {
  label: string;
  value: string;
  suffix?: string;
  trend?: string;
  subtext?: string;
  isUp?: boolean;
  highlight?: boolean;
}

function MetricCard({ label, value, suffix, trend, subtext, isUp, highlight }: MetricCardProps) {
  return (
    <div className={clsx(
      'bg-white rounded-2xl p-5 border',
      highlight ? 'border-red-200 bg-red-50/50' : 'border-slate-100'
    )}>
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className="flex items-end gap-2">
        <span className={clsx('text-3xl font-bold', highlight ? 'text-red-600' : 'text-slate-800')}>
          {value}
        </span>
        {suffix && <span className="text-sm text-slate-400 mb-1">{suffix}</span>}
      </div>
      {trend && (
        <div className={clsx('flex items-center gap-1 mt-2 text-sm font-medium', isUp ? 'text-emerald-600' : 'text-red-600')}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
      )}
      {subtext && !trend && (
        <div className="text-xs text-slate-400 mt-2">{subtext}</div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  type: 'positive' | 'negative';
  title: string;
  items: string[];
}

function SummaryCard({ type, title, items }: SummaryCardProps) {
  const isPositive = type === 'positive';
  return (
    <Card className={isPositive ? 'bg-emerald-50/50' : 'bg-red-50/50'}>
      <div className={clsx('flex items-center gap-2 mb-4', isPositive ? 'text-emerald-600' : 'text-red-600')}>
        {isPositive ? <TrendingUp size={16} /> : <AlertTriangle size={16} />}
        <span className="font-semibold">{title}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Star size={12} className={clsx('mt-1 flex-shrink-0', isPositive ? 'text-emerald-400' : 'text-red-400')} />
            <span className="text-sm text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
