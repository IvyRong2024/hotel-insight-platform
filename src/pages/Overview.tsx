import { Layout } from '../components/Layout';
import { Card, Badge, ProgressBar } from '../components/ui';
import { brandHealthData, actionsData, priceData, hotelHealthData, competitorData, promiseFulfillmentData, hotelBarriersData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, AlertTriangle, Star, MapPin, Clock, CheckCircle, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import clsx from 'clsx';

export function Overview() {
  const { currentRole } = useAuth();
  
  if (!currentRole) return null;

  return (
    <Layout title="Overview" subtitle={currentRole.description} requiredModule="overview">
      {/* 根据角色渲染完全不同的界面 */}
      {currentRole.id === 'brand_ops' && <BrandOpsView />}
      {currentRole.id === 'region_vp' && <RegionVPView />}
      {currentRole.id === 'city_mgr' && <CityMgrView />}
      {currentRole.id === 'hotel_mgr' && <HotelMgrView />}
      {currentRole.id === 'revenue_mgr' && <RevenueMgrView />}
    </Layout>
  );
}

// ========== 品牌运营视角 ==========
// 核心问题：品牌健康吗？用户感知到我们的承诺了吗？
function BrandOpsView() {
  const gap = (brandHealthData.overallScore - competitorData.metrics.综合评分[1]).toFixed(2);
  const isLeading = parseFloat(gap) > 0;

  return (
    <div className="space-y-6">
      {/* 核心问题：我们 vs 竞品 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">IHG 品牌综合评分</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{brandHealthData.overallScore}</span>
                <div className={clsx(
                  'flex items-center gap-1 px-3 py-1 rounded-full text-sm mb-1',
                  isLeading ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                )}>
                  {isLeading ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {isLeading ? `领先万豪 ${gap}` : `落后万豪 ${Math.abs(parseFloat(gap))}`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-3 gap-6">
                {competitorData.brands.slice(1).map((brand, idx) => (
                  <div key={brand} className="text-center">
                    <p className="text-white/50 text-xs mb-1">{brand}</p>
                    <p className="text-xl font-semibold">{competitorData.metrics.综合评分[idx + 1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 品牌承诺兑现情况 - 可执行 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🎯 品牌承诺兑现情况</h3>
          <span className="text-sm text-slate-500">用户是否真的感知到了？</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {promiseFulfillmentData.map((item) => (
            <Card 
              key={item.promise}
              className={clsx(
                'text-center cursor-pointer transition-all hover:shadow-md',
                item.status === 'unfulfilled' && 'ring-2 ring-red-300 bg-red-50/50'
              )}
              padding="sm"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium text-slate-700 mb-1">{item.promise}</div>
              <div className={clsx(
                'text-2xl font-bold mb-2',
                item.status === 'fulfilled' ? 'text-emerald-600' :
                item.status === 'partial' ? 'text-amber-600' : 'text-red-600'
              )}>
                {item.score}%
              </div>
              {item.status === 'unfulfilled' && (
                <div className="flex items-center justify-center gap-1 text-xs text-red-600">
                  <AlertCircle size={12} />
                  需要行动
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-red-800">⚡ 建议行动：强化"智能体验"承诺感知</p>
              <p className="text-xs text-red-600 mt-1">当前仅45%用户感知到智能体验，建议在App引导、自助入住机使用率、智能客房介绍方面加强</p>
            </div>
          </div>
        </div>
      </section>

      {/* 竞对动态预警 */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">⚠️ 竞对动态预警</h3>
        </div>
        <Card>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="danger">高威胁</Badge>
                <span className="text-sm"><b>万豪</b> 双12促销 <span className="text-ihg-gold font-bold">5折起</span></span>
              </div>
              <span className="text-xs text-slate-500">12/10-12/15 · 抖音/携程</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="warning">关注</Badge>
                <span className="text-sm"><b>希尔顿</b> 数字化体验评分 <span className="text-emerald-600">+0.15</span>，逐步追近</span>
              </div>
              <span className="text-xs text-slate-500">近30天趋势</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

// ========== 大区负责人视角 ==========
// 核心问题：哪个城市需要我关注？哪家店拖后腿？
function RegionVPView() {
  const cities = [
    { name: '上海', score: 4.58, trend: '+0.05', hotels: 28, issues: 3 },
    { name: '杭州', score: 4.52, trend: '+0.02', hotels: 15, issues: 2 },
    { name: '南京', score: 4.45, trend: '-0.08', hotels: 12, issues: 5 },
    { name: '苏州', score: 4.48, trend: '+0.01', hotels: 8, issues: 1 },
    { name: '宁波', score: 4.41, trend: '-0.03', hotels: 6, issues: 2 },
  ];

  const problemHotels = [
    { name: '南京新街口假日酒店', score: 3.92, issue: '隔音问题集中爆发', urgency: 'high' },
    { name: '南京禄口智选假日', score: 4.05, issue: '早餐投诉增加45%', urgency: 'high' },
    { name: '杭州萧山皇冠假日', score: 4.12, issue: '入住等待时间过长', urgency: 'medium' },
  ];

  return (
    <div className="space-y-6">
      {/* 区域整体状态 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">华东区整体评分</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">4.48</span>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm mb-1 bg-emerald-500/20 text-emerald-300">
                  <TrendingUp size={14} />
                  全国排名 #2
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-white/50 text-xs mb-1">管辖门店</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">问题门店</p>
                <p className="text-2xl font-bold text-amber-300">8</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">待处理行动</p>
                <p className="text-2xl font-bold text-red-300">12</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 城市排行榜 - 快速定位问题城市 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🏙️ 城市表现排行</h3>
          <span className="text-sm text-slate-500">点击城市查看详情</span>
        </div>
        <Card padding="none">
          <div className="divide-y divide-slate-100">
            {cities.map((city, idx) => (
              <div key={city.name} className={clsx(
                'flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-all',
                city.trend.startsWith('-') && 'bg-red-50/50'
              )}>
                <div className="flex items-center gap-4">
                  <span className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    idx === 0 ? 'bg-ihg-gold text-white' : 'bg-slate-100 text-slate-600'
                  )}>
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-medium text-slate-800">{city.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{city.hotels}家门店</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {city.issues > 0 && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {city.issues}个问题
                    </span>
                  )}
                  <span className={clsx(
                    'text-sm font-medium',
                    city.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {city.trend}
                  </span>
                  <span className="text-xl font-bold text-slate-800">{city.score}</span>
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 问题门店预警 - 需要立即关注 */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🚨 需要关注的门店</h3>
          <Badge variant="danger">{problemHotels.length} 家需督导</Badge>
        </div>
        <div className="space-y-3">
          {problemHotels.map((hotel) => (
            <Card key={hotel.name} className="border-l-4 border-l-red-500" padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-800">{hotel.name}</span>
                    <Badge variant={hotel.urgency === 'high' ? 'danger' : 'warning'}>
                      {hotel.urgency === 'high' ? '紧急' : '关注'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{hotel.issue}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{hotel.score}</div>
                  <button className="text-xs text-ihg-navy hover:underline flex items-center gap-1 mt-1">
                    查看详情 <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// ========== 城市负责人视角 ==========
// 核心问题：哪家门店需要帮助？什么问题最突出？
function CityMgrView() {
  const hotels = [
    { name: '上海外滩英迪格', brand: '英迪格', score: 4.68, trend: '+0.05', status: 'good' },
    { name: '上海静安洲际', brand: '洲际', score: 4.62, trend: '+0.02', status: 'good' },
    { name: '上海虹桥皇冠假日', brand: '皇冠假日', score: 4.45, trend: '-0.03', status: 'warning' },
    { name: '上海浦东假日', brand: '假日', score: 4.28, trend: '-0.08', status: 'danger' },
    { name: '上海徐汇智选假日', brand: '智选假日', score: 4.15, trend: '-0.12', status: 'danger' },
  ];

  const issueTypes = [
    { type: '隔音问题', count: 45, percentage: 32 },
    { type: '入住等待', count: 28, percentage: 20 },
    { type: '早餐投诉', count: 25, percentage: 18 },
    { type: '设施故障', count: 22, percentage: 16 },
    { type: '其他', count: 20, percentage: 14 },
  ];

  return (
    <div className="space-y-6">
      {/* 城市整体状态 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">上海市整体评分</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">4.48</span>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm mb-1 bg-emerald-500/20 text-emerald-300">
                  <MapPin size={14} />
                  华东区 #1
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-white/50 text-xs mb-1">管辖门店</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">表现下滑</p>
                <p className="text-2xl font-bold text-amber-300">3</p>
              </div>
              <div>
                <p className="text-white/50 text-xs mb-1">待处理</p>
                <p className="text-2xl font-bold text-red-300">5</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-6">
        {/* 门店排行榜 */}
        <div className="col-span-2 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🏨 门店表现排行</h3>
          </div>
          <Card padding="none">
            <div className="divide-y divide-slate-100">
              {hotels.map((hotel, idx) => (
                <div key={hotel.name} className={clsx(
                  'flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer',
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
                      <span className="font-medium text-slate-800">{hotel.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{hotel.brand}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={clsx(
                      'text-sm font-medium',
                      hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {hotel.trend}
                    </span>
                    <span className="text-lg font-bold text-slate-800">{hotel.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 问题类型分布 */}
        <div className="animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📊 问题分布</h3>
          </div>
          <Card>
            <div className="space-y-3">
              {issueTypes.map((issue) => (
                <div key={issue.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{issue.type}</span>
                    <span className="text-slate-500">{issue.count}次</span>
                  </div>
                  <ProgressBar value={issue.percentage} color="navy" size="sm" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">💡 隔音问题占比最高，建议重点关注智选假日品牌</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ========== 酒店店长视角 ==========
// 核心问题：用户在抱怨什么？我该先做什么？
function HotelMgrView() {
  const myActions = actionsData.filter(a => a.status !== 'completed').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 我的酒店状态 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">{hotelHealthData.hotelName}</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{hotelHealthData.overallScore}</span>
                <div className="text-white/60 text-sm mb-1">/ 5.0</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">城市排名</p>
                <p className="text-xl font-bold">#{hotelHealthData.overallRank}</p>
                <p className="text-white/40 text-xs">上海156家</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">区域排名</p>
                <p className="text-xl font-bold">#89</p>
                <p className="text-white/40 text-xs">华东892家</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">品牌排名</p>
                <p className="text-xl font-bold">#12</p>
                <p className="text-white/40 text-xs">英迪格全国</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 用户在抱怨什么 - 链路视图 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">😤 用户在抱怨什么？</h3>
          <span className="text-sm text-slate-500">近30天差评分布</span>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            {hotelBarriersData.journeyRisks.map((stage, idx) => (
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
                {idx < hotelBarriersData.journeyRisks.length - 1 && (
                  <div className="w-12 h-0.5 bg-slate-200 mx-2" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-50 rounded-xl">
            <p className="text-sm text-red-800">
              <b>🚨 房间阶段</b>问题最多（89次），主要集中在：隔音差、空调异响、热水不稳
            </p>
          </div>
        </Card>
      </section>

      {/* 我该先做什么 - 待办行动 */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">⚡ 我该先做什么？</h3>
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
                    <div className="text-xs text-slate-400">截止日期</div>
                    <div className="text-sm font-medium text-slate-700">{action.deadline}</div>
                  </div>
                  <button className="px-4 py-2 bg-ihg-navy text-white text-sm rounded-lg hover:bg-ihg-navy-light">
                    去处理
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// ========== 定价团队视角 ==========
// 核心问题：价格有竞争力吗？竞对在搞什么促销？
function RevenueMgrView() {
  const priceAlerts = [
    { platform: '抖音', ourPrice: 568, competitorPrice: 498, competitor: '万豪', diff: '+14%', urgency: 'high' },
    { platform: '携程', ourPrice: 668, competitorPrice: 625, competitor: '希尔顿', diff: '+7%', urgency: 'medium' },
  ];

  return (
    <div className="space-y-6">
      {/* 价格竞争力概览 */}
      <section className="animate-fade-in-up">
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-ihg-navy to-ihg-navy-light text-white">
            <p className="text-white/60 text-sm mb-1">IHG 全国均价</p>
            <p className="text-3xl font-bold">¥{priceData.regions[0].avgPrice}</p>
            <p className="text-emerald-300 text-sm mt-1">+5.2% vs 上期</p>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm mb-1">vs 万豪价差</p>
            <p className="text-3xl font-bold text-slate-800">+¥33</p>
            <p className="text-amber-600 text-sm mt-1">高于竞对 5%</p>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm mb-1">性价比指数</p>
            <p className="text-3xl font-bold text-emerald-600">1.12</p>
            <p className="text-slate-500 text-sm mt-1">高性价比区间</p>
          </Card>
          <Card>
            <p className="text-slate-500 text-sm mb-1">价格预警</p>
            <p className="text-3xl font-bold text-red-600">{priceAlerts.length}</p>
            <p className="text-red-500 text-sm mt-1">个渠道需关注</p>
          </Card>
        </div>
      </section>

      {/* 价格预警 - 需要立即行动 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🚨 价格预警</h3>
          <span className="text-sm text-slate-500">我们的价格可能失去竞争力</span>
        </div>
        <div className="space-y-3">
          {priceAlerts.map((alert) => (
            <Card key={alert.platform} className="border-l-4 border-l-red-500 bg-red-50/30" padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center font-bold text-red-600">
                    {alert.platform.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{alert.platform}渠道价格偏高</div>
                    <div className="text-sm text-slate-500">
                      我们 ¥{alert.ourPrice} vs {alert.competitor} ¥{alert.competitorPrice}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-600">{alert.diff}</div>
                    <div className="text-xs text-slate-500">高于竞对</div>
                  </div>
                  <button className="px-4 py-2 bg-ihg-navy text-white text-sm rounded-lg">
                    调整价格
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 竞对促销追踪 */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🎯 竞对促销动态</h3>
          <Badge variant="danger">{priceData.competitorPromos.filter(p => p.threat === 'high').length} 个高威胁</Badge>
        </div>
        <Card>
          <div className="space-y-3">
            {priceData.competitorPromos.map((promo, idx) => (
              <div key={idx} className={clsx(
                'p-4 rounded-xl flex items-center justify-between',
                promo.threat === 'high' ? 'bg-red-50' : promo.threat === 'medium' ? 'bg-amber-50' : 'bg-slate-50'
              )}>
                <div className="flex items-center gap-4">
                  <Badge variant={promo.threat === 'high' ? 'danger' : promo.threat === 'medium' ? 'warning' : 'info'}>
                    {promo.threat === 'high' ? '高威胁' : promo.threat === 'medium' ? '中威胁' : '关注'}
                  </Badge>
                  <div>
                    <span className="font-semibold text-slate-800">{promo.competitor}</span>
                    <span className="text-ihg-gold font-bold ml-2">{promo.discount}</span>
                    <span className="text-sm text-slate-500 ml-2">{promo.campaign}</span>
                  </div>
                </div>
                <div className="text-sm text-slate-500">
                  {promo.startDate} ~ {promo.endDate}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

