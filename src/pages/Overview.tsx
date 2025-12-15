import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { 
  brandHealthData, 
  promiseFulfillmentData, 
  competitorData, 
  regionHierarchy, 
  brandTiers, 
  hotelDetailData, 
  actionsData, 
  priceData,
  watchlistData,
  platformScoreStandards,
  regionPlatformScores,
  cityPlatformScores,
  hotelPlatformScores,
  PlatformScoreSummary,
  BrandTier 
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, AlertCircle, ArrowRight, Zap, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export function Overview() {
  const { currentRole } = useAuth();
  
  if (!currentRole) return null;

  return (
    <Layout title="Overview" subtitle={currentRole.description} requiredModule="overview">
      {currentRole.id === 'brand_ops' && <BrandOpsOverview />}
      {currentRole.id === 'region_vp' && <RegionVPOverview />}
      {currentRole.id === 'city_mgr' && <CityMgrOverview />}
      {currentRole.id === 'hotel_mgr' && <HotelMgrOverview />}
      {currentRole.id === 'hotel_mgr_new' && <NewHotelMgrOverview />}
      {currentRole.id === 'revenue_mgr' && <RevenueMgrOverview />}
    </Layout>
  );
}

// ========== 可复用：平台高分占比组件 ==========
function PlatformScoreRatioCard({ 
  data, 
  title, 
  compact = false 
}: { 
  data: PlatformScoreSummary; 
  title: string;
  compact?: boolean;
}) {
  if (compact) {
    // 紧凑版本：只显示综合数据和主要平台
    return (
      <Card padding="sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">📊 {title}</span>
            <span className="text-xs text-slate-400">携程/飞猪 4.5+ | 美团 4星+ | 境外 8+</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-ihg-navy">{data.summary.overallHighScoreRatio}%</span>
            <span className={clsx(
              'text-xs flex items-center gap-0.5',
              data.summary.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
            )}>
              {data.summary.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {data.summary.trend}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {Object.values(data.domestic).map((platform) => (
            <div key={platform.name} className="text-center">
              <div className={clsx(
                'text-xs font-medium px-1.5 py-0.5 rounded mb-1',
                platform.name === '携程' ? 'bg-blue-100 text-blue-700' :
                platform.name === '美团' ? 'bg-yellow-100 text-yellow-700' :
                'bg-orange-100 text-orange-700'
              )}>
                {platform.name}
              </div>
              <div className="text-sm font-bold text-slate-700">{platform.highScoreRatio}%</div>
            </div>
          ))}
          {Object.values(data.overseas).map((platform) => (
            <div key={platform.name} className="text-center">
              <div className={clsx(
                'text-xs font-medium px-1.5 py-0.5 rounded mb-1',
                platform.name === 'Booking' ? 'bg-indigo-100 text-indigo-700' :
                platform.name === 'Expedia' ? 'bg-purple-100 text-purple-700' :
                'bg-pink-100 text-pink-700'
              )}>
                {platform.name}
              </div>
              <div className="text-sm font-bold text-slate-700">{platform.highScoreRatio}%</div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // 完整版本
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">📊 {title}</h3>
          <p className="text-xs text-slate-500 mt-1">携程/飞猪 4.5分+ | 美团 4星+ | 境外渠道 8分+ 作为高分标准</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-ihg-navy">{data.summary.overallHighScoreRatio}%</span>
          <span className={clsx(
            'text-sm flex items-center gap-1',
            data.summary.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
          )}>
            {data.summary.trend.startsWith('+') ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {data.summary.trend}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* 国内渠道 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-slate-700">🇨🇳 国内渠道</span>
            <span className="text-sm text-emerald-600 font-medium">{data.summary.domesticHighScoreRatio}%</span>
          </div>
          <div className="space-y-3">
            {Object.values(data.domestic).map((platform) => (
              <div key={platform.name} className="flex items-center gap-3">
                <div className={clsx(
                  'w-12 h-8 rounded flex items-center justify-center text-xs font-medium',
                  platform.name === '携程' ? 'bg-blue-100 text-blue-700' :
                  platform.name === '美团' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-orange-100 text-orange-700'
                )}>
                  {platform.name}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">{platform.scale} · {typeof platform.highScoreThreshold === 'number' ? `${platform.highScoreThreshold}分+` : `${platform.highScoreThreshold}+`}</span>
                    <span className="font-medium text-slate-700">{platform.highScoreRatio}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-ihg-navy rounded-full transition-all"
                      style={{ width: `${platform.highScoreRatio}%` }}
                    />
                  </div>
                </div>
                <span className={clsx(
                  'text-xs',
                  platform.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {platform.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 境外渠道 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-slate-700">🌍 境外渠道</span>
            <span className="text-sm text-emerald-600 font-medium">{data.summary.overseasHighScoreRatio}%</span>
          </div>
          <div className="space-y-3">
            {Object.values(data.overseas).map((platform) => (
              <div key={platform.name} className="flex items-center gap-3">
                <div className={clsx(
                  'w-16 h-8 rounded flex items-center justify-center text-xs font-medium',
                  platform.name === 'Booking' ? 'bg-indigo-100 text-indigo-700' :
                  platform.name === 'Expedia' ? 'bg-purple-100 text-purple-700' :
                  'bg-pink-100 text-pink-700'
                )}>
                  {platform.name}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">{platform.scale} · {platform.highScoreThreshold}分+</span>
                    <span className="font-medium text-slate-700">{platform.highScoreRatio}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-ihg-gold rounded-full transition-all"
                      style={{ width: `${platform.highScoreRatio}%` }}
                    />
                  </div>
                </div>
                <span className={clsx(
                  'text-xs',
                  platform.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {platform.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 评论数统计 */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>总评论数：{data.summary.totalReviews.toLocaleString()} 条</span>
        <span>高分评论：{data.summary.highScoreReviews.toLocaleString()} 条</span>
      </div>
    </Card>
  );
}

// ========== 品牌运营 Overview ==========
function BrandOpsOverview() {
  const gap = (brandHealthData.overallScore - competitorData.metrics.综合评分[1]).toFixed(2);
  const isLeading = parseFloat(gap) > 0;
  const vsHilton = (brandHealthData.overallScore - competitorData.metrics.综合评分[2]).toFixed(2);

  return (
    <div className="space-y-6">
      {/* 品牌综合评分 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">IHG 品牌综合评分</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{brandHealthData.overallScore}</span>
                <div className="flex gap-2 mb-1">
                  <span className={clsx(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-sm',
                    isLeading ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  )}>
                    {isLeading ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    vs万豪 {gap}
                  </span>
                  <span className={clsx(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-sm',
                    parseFloat(vsHilton) >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  )}>
                    vs希尔顿 {vsHilton}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {competitorData.brands.map((brand, idx) => (
                <div key={brand} className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/50 text-xs mb-1">{brand}</p>
                  <p className="text-xl font-bold">{competitorData.metrics.综合评分[idx]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 各平台高分占比 - 总分依据 */}
      <section className="animate-fade-in-up delay-50">
        <PlatformScoreRatioCard data={platformScoreStandards} title="全国各平台高分评论占比" />
      </section>

      {/* 品牌故事 Narrative */}
      <section className="animate-fade-in-up delay-100">
        <Card className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-l-ihg-navy">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-ihg-navy/10 rounded-xl flex items-center justify-center text-xl">📊</div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">品牌洞察摘要</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                IHG整体表现稳健，综合评分<span className="text-emerald-600 font-medium">领先万豪</span>但
                <span className="text-red-600 font-medium">略落后希尔顿</span>。
                各平台高分占比达<span className="text-ihg-navy font-medium">{platformScoreStandards.summary.overallHighScoreRatio}%</span>，
                其中境外渠道表现更优（{platformScoreStandards.summary.overseasHighScoreRatio}%）。
                「<span className="text-red-600 font-medium">智能体验</span>」承诺感知度仅45%，是当前最大短板。
                <span className="text-amber-600 font-medium">万豪双12促销力度大（5折起）</span>，注意价格敏感用户流失风险。
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 品牌承诺兑现 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🎯 品牌承诺兑现率</h3>
          <Link to="/brand" className="text-sm text-ihg-navy hover:underline flex items-center gap-1">
            查看详情 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {promiseFulfillmentData.map((item) => (
            <Card 
              key={item.promise}
              className={clsx(
                'text-center',
                item.status === 'unfulfilled' && 'ring-2 ring-red-300 bg-red-50/50'
              )}
              padding="sm"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium text-slate-700 mb-1">{item.promise}</div>
              <div className={clsx(
                'text-2xl font-bold mb-1',
                item.status === 'fulfilled' ? 'text-emerald-600' :
                item.status === 'partial' ? 'text-amber-600' : 'text-red-600'
              )}>
                {item.score}%
              </div>
              {item.status === 'unfulfilled' && (
                <div className="flex items-center justify-center gap-1 text-xs text-red-600">
                  <AlertCircle size={12} />
                  需行动
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 各品牌类型表现 */}
      <section className="animate-fade-in-up delay-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📊 各品牌类型全国表现</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {(Object.entries(brandHealthData.tierPerformance) as [BrandTier, typeof brandHealthData.tierPerformance.luxury_lifestyle][]).map(([tier, data]) => (
            <Card key={tier} padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                <span className="font-medium text-slate-800">{brandTiers[tier].name}</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-slate-800">{data.score}</span>
                <span className={clsx(
                  'text-sm',
                  data.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {data.trend}
                </span>
              </div>
              <div className="space-y-1">
                {data.highlights.map((h, i) => (
                  <p key={i} className="text-xs text-emerald-600">✓ {h}</p>
                ))}
                {data.concerns.map((c, i) => (
                  <p key={i} className="text-xs text-amber-600">⚠ {c}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 竞对动态预警 */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">⚠️ 竞对动态预警</h3>
        </div>
        <Card>
          <div className="space-y-3">
            {competitorData.promos.map((promo, idx) => (
              <div key={idx} className={clsx(
                'p-3 rounded-xl flex items-center justify-between',
                promo.threat === 'high' ? 'bg-red-50' : promo.threat === 'medium' ? 'bg-amber-50' : 'bg-slate-50'
              )}>
                <div className="flex items-center gap-3">
                  <Badge variant={promo.threat === 'high' ? 'danger' : promo.threat === 'medium' ? 'warning' : 'info'}>
                    {promo.threat === 'high' ? '高威胁' : promo.threat === 'medium' ? '中威胁' : '关注'}
                  </Badge>
                  <span className="text-sm">
                    <b>{promo.competitor}</b> {promo.campaign} <span className="text-ihg-gold font-bold">{promo.discount}</span>
                  </span>
                </div>
                <span className="text-xs text-slate-500">{promo.dates} · {promo.channels.join('/')}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

// ========== 大区负责人 Overview ==========
function RegionVPOverview() {
  const region = regionHierarchy[0]; // 华东区
  const cities = region.provinces.flatMap(p => p.cities);
  const problemHotels = cities.flatMap(c => c.hotels.filter(h => h.status === 'danger'));

  return (
    <div className="space-y-6">
      {/* 区域整体状态 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">{region.name}整体评分</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{region.score}</span>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm mb-1 bg-emerald-500/20 text-emerald-300">
                  <TrendingUp size={14} />
                  全国排名 #{region.rank}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 text-center">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">管辖门店</p>
                <p className="text-2xl font-bold">{region.hotelCount}</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">问题门店</p>
                <p className="text-2xl font-bold text-amber-300">{problemHotels.length}</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">待处理行动</p>
                <p className="text-2xl font-bold text-red-300">
                  {actionsData.filter(a => a.region === '华东' && a.status !== 'completed').length}
                </p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">新店监控</p>
                <p className="text-2xl font-bold text-blue-300">
                  {cities.flatMap(c => c.hotels.filter(h => h.isNew)).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 区域平台高分占比 */}
      <section className="animate-fade-in-up delay-50">
        <PlatformScoreRatioCard data={regionPlatformScores} title={`${region.name}各平台高分评论占比`} />
      </section>

      {/* 区域故事 */}
      <section className="animate-fade-in-up delay-75">
        <Card className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-l-ihg-navy">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-ihg-navy/10 rounded-xl flex items-center justify-center text-xl">📊</div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">区域洞察摘要</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {region.name}整体稳定，排名全国第{region.rank}，高分占比<span className="text-ihg-navy font-medium">{regionPlatformScores.summary.overallHighScoreRatio}%</span>。但 
                <span className="text-red-600 font-medium">Essentials 类品牌</span>在江苏省（尤其南京、无锡）
                <span className="text-red-600 font-medium">隔音问题集中爆发</span>（评分{region.tierScores.essentials.score}，{region.tierScores.essentials.trend}）。
                建议本月优先督导南京3家智选假日/假日门店。
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 品牌类型 × 城市 热力图 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📊 品牌类型 × 城市 热力图</h3>
          <Link to="/hotel" className="text-sm text-ihg-navy hover:underline flex items-center gap-1">
            进入层级浏览 <ArrowRight size={14} />
          </Link>
        </div>
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 font-medium text-slate-500">城市</th>
                  {Object.values(brandTiers).map(tier => (
                    <th key={tier.name} className="text-center p-4 font-medium text-slate-500">{tier.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cities.slice(0, 5).map(city => (
                  <tr key={city.name} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800">{city.name}</td>
                    {(Object.keys(brandTiers) as BrandTier[]).map(tier => {
                      const tierData = city.tierScores[tier];
                      if (tierData.count === 0) return <td key={tier} className="text-center p-4 text-slate-300">-</td>;
                      const isLow = tierData.score < 4.2;
                      const isHigh = tierData.score >= 4.5;
                      return (
                        <td key={tier} className="text-center p-4">
                          <span className={clsx(
                            'inline-flex items-center gap-1 px-2 py-1 rounded-lg font-medium',
                            isLow ? 'bg-red-100 text-red-700' : isHigh ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          )}>
                            {tierData.score}
                            {isLow && '🚨'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-amber-50 border-t border-amber-100">
            <p className="text-sm text-amber-800">💡 南京 Essentials 类评分最低（4.15），需重点关注</p>
          </div>
        </Card>
      </section>

      {/* 关注清单 + 问题门店 */}
      <div className="grid grid-cols-2 gap-6">
        <section className="animate-fade-in-up delay-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Star size={18} className="text-ihg-gold" />
              关注清单
            </h3>
          </div>
          <Card>
            <div className="space-y-3">
              {watchlistData.map(hotel => (
                <div key={hotel.hotelId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-medium text-slate-800">{hotel.name}</div>
                    <div className="text-xs text-slate-500">{hotel.reason}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-slate-800">{hotel.score}</div>
                      <div className={clsx('text-xs', hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                        {hotel.trend}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="animate-fade-in-up delay-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🚨 需督导门店</h3>
            <Badge variant="danger">{problemHotels.length} 家</Badge>
          </div>
          <Card>
            <div className="space-y-3">
              {problemHotels.slice(0, 3).map(hotel => (
                <div key={hotel.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{hotel.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '20', color: brandTiers[hotel.tier].color }}>
                        {brandTiers[hotel.tier].name}
                      </span>
                    </div>
                    <div className="text-xs text-red-600 mt-1">{hotel.issues?.join(' · ')}</div>
                  </div>
                  <div className="text-xl font-bold text-red-600">{hotel.score}</div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

// ========== 城市负责人 Overview ==========
function CityMgrOverview() {
  const city = regionHierarchy[0].provinces[0].cities[0]; // 上海市
  const problemHotels = city.hotels.filter(h => h.status === 'danger' || h.status === 'warning');

  return (
    <div className="space-y-6">
      {/* 城市整体状态 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">{city.name}整体评分</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{city.score}</span>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm mb-1 bg-emerald-500/20 text-emerald-300">
                  <TrendingUp size={14} />
                  华东区 #1
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 text-center">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">管辖门店</p>
                <p className="text-2xl font-bold">{city.hotelCount}</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">需关注</p>
                <p className="text-2xl font-bold text-amber-300">{problemHotels.length}</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">待处理</p>
                <p className="text-2xl font-bold text-red-300">
                  {actionsData.filter(a => a.city === '上海' && a.status !== 'completed').length}
                </p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">新店</p>
                <p className="text-2xl font-bold text-blue-300">
                  {city.hotels.filter(h => h.isNew).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 城市平台高分占比 */}
      <section className="animate-fade-in-up delay-50">
        <PlatformScoreRatioCard data={cityPlatformScores} title={`${city.name}各平台高分评论占比`} />
      </section>

      {/* 城市故事 */}
      <section className="animate-fade-in-up delay-75">
        <Card className="bg-gradient-to-r from-slate-50 to-white border-l-4 border-l-ihg-navy">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-ihg-navy/10 rounded-xl flex items-center justify-center text-xl">📊</div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">城市洞察摘要</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                上海整体表现优异，华东区排名第一，高分占比<span className="text-ihg-navy font-medium">{cityPlatformScores.summary.overallHighScoreRatio}%</span>。
                <span className="text-emerald-600 font-medium">Luxury & Lifestyle 类表现亮眼</span>（4.65）。
                但 <span className="text-red-600 font-medium">Essentials 类</span>（假日/智选假日）
                隔音问题需关注，影响12家中的{city.hotels.filter(h => h.tier === 'essentials' && h.issues?.length).length}家。
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 各品牌类型表现 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📊 各品牌类型在{city.name}表现</h3>
          <Link to="/hotel" className="text-sm text-ihg-navy hover:underline flex items-center gap-1">
            查看门店详情 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {(Object.keys(brandTiers) as BrandTier[]).map(tier => {
            const tierData = city.tierScores[tier];
            const tierHotels = city.hotels.filter(h => h.tier === tier);
            const tierBrands = [...new Set(tierHotels.map(h => h.brand))];
            if (tierData.count === 0) return null;
            return (
              <Card key={tier} className={clsx(tierData.score < 4.3 && 'ring-2 ring-red-200')}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                  <span className="font-semibold text-slate-800">{brandTiers[tier].name}</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-slate-800">{tierData.score}</span>
                  <span className={clsx(
                    'text-sm mb-1',
                    tierData.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {tierData.trend}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{tierData.count}家门店</p>
                <div className="text-xs text-slate-600">
                  {tierBrands.slice(0, 3).join(' · ')}
                </div>
                {tierData.score < 4.3 && (
                  <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-600">
                    🚨 需重点关注
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 门店排行榜 */}
      <section className="animate-fade-in-up delay-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🏨 门店排行</h3>
        </div>
        <Card padding="none">
          <div className="divide-y divide-slate-100">
            {city.hotels.slice(0, 6).map((hotel, idx) => (
              <div key={hotel.id} className={clsx(
                'flex items-center justify-between p-4 hover:bg-slate-50',
                hotel.status === 'danger' && 'bg-red-50/50'
              )}>
                <div className="flex items-center gap-4">
                  <span className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                    idx === 0 ? 'bg-ihg-gold text-white' : 'bg-slate-100 text-slate-600'
                  )}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{hotel.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '20', color: brandTiers[hotel.tier].color }}>
                        {brandTiers[hotel.tier].name}
                      </span>
                      {hotel.isNew && <Badge variant="info">新店 {hotel.daysOpen}天</Badge>}
                    </div>
                    <span className="text-xs text-slate-400">{hotel.brand}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {hotel.issues && hotel.issues.length > 0 && (
                    <span className="text-xs text-red-500">{hotel.issues[0]}</span>
                  )}
                  <span className={clsx(
                    'text-sm font-medium',
                    hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {hotel.trend}
                  </span>
                  <span className="text-xl font-bold text-slate-800">{hotel.score}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

// ========== 酒店店长（成熟门店）Overview ==========
function HotelMgrOverview() {
  const hotel = hotelDetailData;
  const myActions = actionsData.filter(a => a.hotelId === 'h1' && a.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* 我的酒店状态 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/60 text-sm">{hotel.hotelName}</p>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '40' }}>
                  {brandTiers[hotel.tier].name}
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{hotel.score}</span>
                <span className="text-white/50 text-xl mb-1">/ 5.0</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">城市排名</p>
                <p className="text-xl font-bold">#{hotel.rankings.city.rank}</p>
                <p className="text-white/40 text-xs">{hotel.rankings.city.name} {hotel.rankings.city.total}家</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">区域排名</p>
                <p className="text-xl font-bold">#{hotel.rankings.region.rank}</p>
                <p className="text-white/40 text-xs">{hotel.rankings.region.name} {hotel.rankings.region.total}家</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">品牌排名</p>
                <p className="text-xl font-bold">#{hotel.rankings.brand.rank}</p>
                <p className="text-white/40 text-xs">{hotel.rankings.brand.name}全国</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">类型排名</p>
                <p className="text-xl font-bold">#{hotel.rankings.tier.rank}</p>
                <p className="text-white/40 text-xs">{hotel.rankings.tier.name}全国{hotel.rankings.tier.total}家</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 单店平台高分占比 */}
      <section className="animate-fade-in-up delay-50">
        <PlatformScoreRatioCard data={hotelPlatformScores} title="本店各平台高分评论占比" compact />
      </section>

      {/* 与同类型对比 */}
      <section className="animate-fade-in-up delay-75">
        <Card>
          <h3 className="font-semibold text-slate-800 mb-3">📊 与同类型（{brandTiers[hotel.tier].name}）门店对比</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <p className="text-sm text-slate-500 mb-1">vs 城市同类型</p>
              <p className={clsx(
                'text-2xl font-bold',
                hotel.comparisons.vsCityTier.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              )}>
                {hotel.comparisons.vsCityTier}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <p className="text-sm text-slate-500 mb-1">vs 区域同类型</p>
              <p className={clsx(
                'text-2xl font-bold',
                hotel.comparisons.vsRegionTier.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              )}>
                {hotel.comparisons.vsRegionTier}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center">
              <p className="text-sm text-slate-500 mb-1">vs 全国同类型</p>
              <p className={clsx(
                'text-2xl font-bold',
                hotel.comparisons.vsNationalTier.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              )}>
                {hotel.comparisons.vsNationalTier}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 用户旅程风险 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">😤 用户在抱怨什么？</h3>
          <Link to="/hotel" className="text-sm text-ihg-navy hover:underline flex items-center gap-1">
            查看详情 <ArrowRight size={14} />
          </Link>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            {hotel.journeyRisks.map((stage, idx) => (
              <div key={stage.stage} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={clsx(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 mb-2',
                    stage.risk === 'high' ? 'bg-red-50 border-red-300' : 
                    stage.risk === 'medium' ? 'bg-amber-50 border-amber-300' : 
                    'bg-emerald-50 border-emerald-300'
                  )}>
                    {stage.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                  <span className={clsx(
                    'text-lg font-bold',
                    stage.risk === 'high' ? 'text-red-600' : 
                    stage.risk === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                  )}>
                    {stage.count}
                  </span>
                </div>
                {idx < hotel.journeyRisks.length - 1 && (
                  <div className="w-12 h-0.5 bg-slate-200 mx-2" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-50 rounded-xl">
            <p className="text-sm text-red-800">
              <b>🚨 房间阶段</b>问题最多（89次）：{hotel.journeyRisks.find(s => s.stage === '房间')?.issues.join('、')}
            </p>
          </div>
        </Card>
      </section>

      {/* 我的待办 */}
      <section className="animate-fade-in-up delay-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">⚡ 我的待办</h3>
          <Badge variant="danger">{myActions.length} 项待处理</Badge>
        </div>
        <div className="space-y-3">
          {myActions.map((action) => (
            <Card key={action.id} className={clsx(
              'border-l-4',
              action.priority === 'urgent' ? 'border-l-red-500 bg-red-50/30' : 
              action.priority === 'high' ? 'border-l-amber-500' : 'border-l-slate-300'
            )} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    action.priority === 'urgent' ? 'bg-red-100' : 
                    action.priority === 'high' ? 'bg-amber-100' : 'bg-slate-100'
                  )}>
                    <Zap size={18} className={clsx(
                      action.priority === 'urgent' ? 'text-red-600' : 
                      action.priority === 'high' ? 'text-amber-600' : 'text-slate-600'
                    )} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{action.title}</div>
                    <div className="text-xs text-slate-500">{action.impact}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">截止</div>
                    <div className="text-sm font-medium text-slate-700">{action.deadline}</div>
                  </div>
                  <Link to="/actions" className="px-4 py-2 bg-ihg-navy text-white text-sm rounded-lg hover:bg-ihg-navy-light">
                    去处理
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// ========== 新店店长 Overview ==========
function NewHotelMgrOverview() {
  // 新店数据
  const newHotel = {
    name: '杭州西湖假日酒店',
    brand: '假日酒店',
    tier: 'essentials' as BrandTier,
    daysOpen: 58,
    phase: { name: '磨合期', range: '31-90天', color: '#f59e0b' },
    score: 4.42,
    targetScore: 4.5,
    stabilityIndex: 72,
    maturityScore: 68,
    brandFulfillment: 75,
    negativeRatio: 8,
    rankings: {
      city: { rank: 8, total: 15, name: '杭州' },
      region: { rank: 35, total: 120, name: '华东区' },
      brand: { rank: 12, total: 85, name: '假日' },
    },
    barriers: [
      { factor: '入住等待时间', severity: 'high' as const, frequency: 15, description: '前台办理入住平均等待超10分钟' },
      { factor: '早餐补给不及时', severity: 'medium' as const, frequency: 8, description: '周末高峰期补餐不及时' },
      { factor: '空调温控不稳定', severity: 'medium' as const, frequency: 6, description: '部分房间温控需要调试' },
    ],
    drivers: [
      { factor: '新装修好评', contribution: 28, trend: 'up' as const },
      { factor: '员工服务热情', contribution: 22, trend: 'up' as const },
      { factor: '位置便利', contribution: 18, trend: 'stable' as const },
    ],
    phaseActions: [
      { action: '前台入住流程优化', priority: 'high' as const, status: 'in_progress' as const, deadline: '12月20日' },
      { action: '早餐高峰预案制定', priority: 'high' as const, status: 'pending' as const, deadline: '12月25日' },
      { action: '空调系统全面调试', priority: 'medium' as const, status: 'pending' as const, deadline: '12月28日' },
    ],
  };

  const matureStoreBenchmark = {
    stabilityIndex: 85,
    maturityScore: 88,
    brandFulfillment: 82,
    negativeRatio: 4,
  };

  return (
    <div className="space-y-6">
      {/* 新店状态头部 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/80 text-sm">{newHotel.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/20">
                  ✨ 新店 · {newHotel.phase.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/20">
                  开业 {newHotel.daysOpen} 天
                </span>
              </div>
              <div className="flex items-end gap-3 mt-2">
                <span className="text-5xl font-bold">{newHotel.score}</span>
                <span className="text-white/50 text-xl mb-1">/ 5.0</span>
                <span className="text-sm text-white/60 mb-1">目标 {newHotel.targetScore}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">城市排名</p>
                <p className="text-xl font-bold">#{newHotel.rankings.city.rank}</p>
                <p className="text-white/40 text-xs">{newHotel.rankings.city.name} {newHotel.rankings.city.total}家</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">区域排名</p>
                <p className="text-xl font-bold">#{newHotel.rankings.region.rank}</p>
                <p className="text-white/40 text-xs">{newHotel.rankings.region.name} {newHotel.rankings.region.total}家</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">品牌排名</p>
                <p className="text-xl font-bold">#{newHotel.rankings.brand.rank}</p>
                <p className="text-white/40 text-xs">{newHotel.rankings.brand.name}全国</p>
              </div>
            </div>
          </div>
          {/* 生命周期进度 */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>启动期 0-30天</span>
                  <span>磨合期 31-90天</span>
                  <span>稳定期 91-180天</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${(newHotel.daysOpen / 180) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-white/80">{180 - newHotel.daysOpen}天后切换标准视角</span>
            </div>
          </div>
        </div>
      </section>

      {/* 核心监测指标 */}
      <section className="animate-fade-in-up delay-50">
        <h3 className="text-base font-semibold text-slate-800 mb-3">📊 新店核心指标（vs 同品牌成熟店）</h3>
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <p className="text-slate-500 text-sm mb-1">稳定性指数</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-slate-800">{newHotel.stabilityIndex}%</p>
              <p className={clsx(
                'text-sm mb-1',
                newHotel.stabilityIndex < matureStoreBenchmark.stabilityIndex ? 'text-red-500' : 'text-emerald-500'
              )}>
                vs {matureStoreBenchmark.stabilityIndex}%
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">评分波动率</p>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm mb-1">成熟度评分</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-slate-800">{newHotel.maturityScore}</p>
              <p className={clsx(
                'text-sm mb-1',
                newHotel.maturityScore < matureStoreBenchmark.maturityScore ? 'text-red-500' : 'text-emerald-500'
              )}>
                vs {matureStoreBenchmark.maturityScore}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">体验完整性</p>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm mb-1">品牌兑现度</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-ihg-navy">{newHotel.brandFulfillment}%</p>
              <p className={clsx(
                'text-sm mb-1',
                newHotel.brandFulfillment < matureStoreBenchmark.brandFulfillment ? 'text-red-500' : 'text-emerald-500'
              )}>
                vs {matureStoreBenchmark.brandFulfillment}%
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">用户感知品牌主张</p>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm mb-1">负面评论占比</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-red-600">{newHotel.negativeRatio}%</p>
              <p className={clsx(
                'text-sm mb-1',
                newHotel.negativeRatio > matureStoreBenchmark.negativeRatio ? 'text-red-500' : 'text-emerald-500'
              )}>
                vs {matureStoreBenchmark.negativeRatio}%
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">1-2星评论</p>
          </Card>
        </div>
      </section>

      {/* 新店正向驱动 */}
      <section className="animate-fade-in-up delay-75">
        <h3 className="text-base font-semibold text-slate-800 mb-3">✅ 新店亮点（正向驱动）</h3>
        <div className="grid grid-cols-3 gap-4">
          {newHotel.drivers.map((driver) => (
            <Card key={driver.factor} className="bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800">{driver.factor}</span>
                {driver.trend === 'up' && <TrendingUp size={16} className="text-emerald-500" />}
              </div>
              <p className="text-2xl font-bold text-emerald-600">{driver.contribution}%</p>
              <p className="text-xs text-slate-500 mt-1">贡献度</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 新店早期风险 */}
      <section className="animate-fade-in-up delay-100">
        <h3 className="text-base font-semibold text-slate-800 mb-3">⚠️ 早期风险（需关注）</h3>
        <div className="space-y-3">
          {newHotel.barriers.map((barrier) => (
            <Card key={barrier.factor} className={clsx(
              'border-l-4',
              barrier.severity === 'high' ? 'border-l-red-500 bg-red-50/30' : 'border-l-amber-500 bg-amber-50/30'
            )} padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-800">{barrier.factor}</span>
                    <Badge variant={barrier.severity === 'high' ? 'danger' : 'warning'}>
                      {barrier.severity === 'high' ? '高风险' : '中风险'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{barrier.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">{barrier.frequency}次</p>
                  <p className="text-xs text-slate-400">发生频率</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 阶段行动建议 */}
      <section className="animate-fade-in-up delay-125">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: newHotel.phase.color }} />
          <h3 className="text-base font-semibold text-slate-800">{newHotel.phase.name}行动建议</h3>
          <span className="text-xs text-slate-400">（{newHotel.phase.range}）</span>
        </div>
        <div className="space-y-2">
          {newHotel.phaseActions.map((action) => (
            <Card key={action.action} padding="sm" className="bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {action.status === 'in_progress' ? (
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                  )}
                  <div>
                    <span className="font-medium text-slate-800">{action.action}</span>
                    <p className="text-xs text-slate-400">截止：{action.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={action.priority === 'high' ? 'danger' : 'warning'}>
                    {action.priority === 'high' ? '高优' : '中优'}
                  </Badge>
                  <span className={clsx(
                    'text-xs px-2 py-0.5 rounded',
                    action.status === 'in_progress' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                  )}>
                    {action.status === 'in_progress' ? '进行中' : '待处理'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 提示信息 */}
      <section className="animate-fade-in-up delay-150">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <b>💡 新店监测模式：</b>您的酒店处于开业 {newHotel.daysOpen} 天的{newHotel.phase.name}阶段，
            系统将持续关注运营稳定性与体验成熟度。{180 - newHotel.daysOpen} 天后将自动切换为标准门店视角。
          </p>
        </div>
      </section>
    </div>
  );
}

// ========== 定价团队 Overview ==========
function RevenueMgrOverview() {
  // 竞品价格数据
  const competitorPrices = {
    byTier: {
      luxury_lifestyle: { avgPrice: 1650, change: '+2.8%' },
      premium: { avgPrice: 658, change: '+3.5%' },
      essentials: { avgPrice: 318, change: '+4.2%' },
      suites: { avgPrice: 498, change: '+1.5%' },
    } as Record<BrandTier, { avgPrice: number; change: string }>,
    byGroup: [
      { group: '万豪国际', avgPrice: 688, hotels: 1250 },
      { group: '希尔顿集团', avgPrice: 648, hotels: 980 },
      { group: '雅高集团', avgPrice: 548, hotels: 1450 },
      { group: '凯悦集团', avgPrice: 728, hotels: 520 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* 监测范围说明 */}
      <section className="animate-fade-in-up">
        <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">竞品价格监测</h3>
              <p className="text-white/70 text-sm">监测平台：携程、抖音、直客通</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="px-6 py-3 bg-white/10 rounded-xl">
                <p className="text-white/60 text-xs mb-1">📦 竞品门店</p>
                <p className="text-2xl font-bold">5,000+</p>
                <p className="text-white/50 text-xs">基础房型监测</p>
              </div>
              <div className="px-6 py-3 bg-white/10 rounded-xl">
                <p className="text-white/60 text-xs mb-1">🎫 券类产品</p>
                <p className="text-2xl font-bold">动态</p>
                <p className="text-white/50 text-xs">竞品在售产品</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 各档次竞品均价 */}
      <section className="animate-fade-in-up delay-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800">📊 各档次竞品均价</h3>
            <p className="text-xs text-slate-500 mt-1">基础房型 · 标准大床房</p>
          </div>
          <Link to="/price" className="text-sm text-ihg-navy hover:underline flex items-center gap-1">
            查看详情 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {(Object.entries(competitorPrices.byTier) as [BrandTier, { avgPrice: number; change: string }][]).map(([tier, data]) => (
            <Card key={tier}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                <span className="font-medium text-slate-800">{brandTiers[tier].name}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-2">¥{data.avgPrice}</div>
              <div className="text-sm">
                <span className={clsx(
                  'font-medium',
                  data.change.startsWith('+') ? 'text-red-600' : 'text-emerald-600'
                )}>{data.change}</span>
                <span className="text-slate-400 ml-1">vs 上月</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 各集团竞品价格 */}
      <section className="animate-fade-in-up delay-75">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🏢 各竞品集团均价</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {competitorPrices.byGroup.map((comp) => (
            <Card key={comp.group}>
              <div className="text-sm font-medium text-slate-600 mb-2">{comp.group}</div>
              <div className="text-2xl font-bold text-slate-800 mb-2">¥{comp.avgPrice}</div>
              <div className="text-xs text-slate-500">{comp.hotels} 家门店</div>
            </Card>
          ))}
        </div>
      </section>

      {/* 竞品券类动态 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🎫 竞品券类动态</h3>
        </div>
        <Card>
          <div className="grid grid-cols-4 gap-4">
            {[
              { brand: '万豪', product: '双人周末套餐', price: 828, platform: '抖音' },
              { brand: '希尔顿', product: '商务住宿券', price: 568, platform: '携程' },
              { brand: '雅高', product: '圣诞特惠套餐', price: 698, platform: '飞猪' },
              { brand: '凯悦', product: '亲子度假券', price: 1188, platform: '抖音' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">{item.brand}</span>
                  <span className="text-xs text-slate-400">{item.platform}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 mb-1">{item.product}</p>
                <span className="text-lg font-bold text-slate-700">¥{item.price}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 竞对促销 */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📰 竞品促销动态</h3>
        </div>
        <Card>
          <div className="space-y-3">
            {priceData.competitorPromos.map((promo, idx) => (
              <div key={idx} className="p-3 rounded-xl flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">{promo.competitor}</span>
                  <span className="text-sm text-slate-700">
                    {promo.campaign} <span className="font-bold text-slate-800">{promo.discount}</span>
                  </span>
                </div>
                <span className="text-xs text-slate-500">{promo.dates} · {promo.channels.join('/')}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
