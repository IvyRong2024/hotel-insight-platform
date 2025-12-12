import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge, ProgressBar } from '../components/ui';
import { hotelHealthData, hotelDriversData, hotelBarriersData, userNeedsData, newOpeningData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, ChevronRight, ChevronDown, Star, AlertTriangle, Building, ArrowRight, Plus, X, Clock, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

// 模拟层级数据
const hierarchyData = {
  regions: [
    { name: '华东区', score: 4.48, hotels: 156, issues: 8, trend: '+0.05' },
    { name: '华南区', score: 4.52, hotels: 142, issues: 5, trend: '+0.03' },
    { name: '华北区', score: 4.41, hotels: 128, issues: 12, trend: '-0.02' },
  ],
  provinces: {
    '华东区': [
      { name: '上海', score: 4.58, hotels: 28, issues: 3, trend: '+0.05' },
      { name: '浙江', score: 4.52, hotels: 35, issues: 2, trend: '+0.02' },
      { name: '江苏', score: 4.45, hotels: 42, issues: 5, trend: '-0.03' },
      { name: '安徽', score: 4.38, hotels: 25, issues: 4, trend: '-0.01' },
      { name: '山东', score: 4.42, hotels: 26, issues: 3, trend: '+0.01' },
    ],
  },
  cities: {
    '上海': [
      { name: '浦东新区', score: 4.62, hotels: 12, issues: 1, trend: '+0.03' },
      { name: '静安区', score: 4.55, hotels: 8, issues: 1, trend: '+0.02' },
      { name: '黄浦区', score: 4.58, hotels: 5, issues: 0, trend: '+0.05' },
      { name: '徐汇区', score: 4.48, hotels: 3, issues: 1, trend: '-0.02' },
    ],
    '浙江': [
      { name: '杭州', score: 4.55, hotels: 15, issues: 1, trend: '+0.03' },
      { name: '宁波', score: 4.48, hotels: 8, issues: 1, trend: '+0.01' },
      { name: '温州', score: 4.42, hotels: 6, issues: 2, trend: '-0.01' },
    ],
  },
  hotels: {
    '浦东新区': [
      { name: '上海浦东丽晶酒店', brand: '丽晶', score: 4.72, trend: '+0.05', status: 'good', isNew: false },
      { name: '上海浦东文华东方', brand: '文华东方', score: 4.68, trend: '+0.03', status: 'good', isNew: false },
      { name: '上海外滩英迪格酒店', brand: '英迪格', score: 4.55, trend: '-0.02', status: 'warning', isNew: false },
      { name: '上海浦东假日酒店', brand: '假日', score: 4.28, trend: '-0.08', status: 'danger', isNew: false },
      { name: '上海陆家嘴智选假日', brand: '智选假日', score: 4.15, trend: '-0.12', status: 'danger', isNew: true, daysOpen: 45 },
    ],
    '杭州': [
      { name: '杭州西湖洲际酒店', brand: '洲际', score: 4.65, trend: '+0.04', status: 'good', isNew: false },
      { name: '杭州西湖假日酒店', brand: '假日', score: 4.42, trend: '-0.03', status: 'warning', isNew: true, daysOpen: 58 },
    ],
  },
};

// 模拟用户需求详情数据
const needsDetailData: Record<string, { positive: string[]; negative: string[] }> = {
  '效率需求': {
    positive: [
      '"自助入住机很方便，2分钟搞定" - 携程用户',
      '"前台效率很高，不用排队" - 美团用户',
      '"App预约入住时间，到店直接拿卡" - 飞猪用户',
    ],
    negative: [
      '"排队等了20分钟才办好入住" - 携程用户',
      '"自助机老是识别不了身份证" - 美团用户',
      '"高峰期前台只有一个人" - Booking用户',
    ],
  },
  '舒适需求': {
    positive: [
      '"床垫很舒服，睡眠质量很好" - 携程用户',
      '"枕头有多种选择，很贴心" - Agoda用户',
      '"房间隔音不错，很安静" - 美团用户',
    ],
    negative: [
      '"隔壁说话听得一清二楚" - 携程用户',
      '"空调声音太大，影响睡眠" - 美团用户',
      '"窗帘遮光不好，早上很早就被光照醒" - 飞猪用户',
    ],
  },
  '服务需求': {
    positive: [
      '"前台小姐姐很热情，主动帮忙拿行李" - 携程用户',
      '"客房服务响应很快" - 美团用户',
      '"有问题马上就解决了" - Booking用户',
    ],
    negative: [
      '"打了3次电话才送来毛巾" - 携程用户',
      '"服务态度一般，爱理不理" - 美团用户',
      '"问题反馈后没有后续跟进" - Agoda用户',
    ],
  },
  '早餐需求': {
    positive: [
      '"早餐品种很丰富，中西式都有" - 携程用户',
      '"水果很新鲜" - 美团用户',
      '"有本地特色美食" - 飞猪用户',
    ],
    negative: [
      '"热菜补餐太慢" - 携程用户',
      '"早餐品种太少" - 美团用户',
      '"人多的时候座位不够" - Booking用户',
    ],
  },
  '性价比需求': {
    positive: [
      '"会员价很划算" - 携程用户',
      '"活动价性价比超高" - 抖音用户',
      '"物有所值" - 美团用户',
    ],
    negative: [
      '"节假日涨价太狠" - 携程用户',
      '"和OTA价差太大" - 直客通用户',
      '"升房要额外加钱，不太划算" - 美团用户',
    ],
  },
  '文化共鸣': {
    positive: [
      '"酒店设计很有当地特色" - 携程用户',
      '"邻里文化活动很有趣" - Booking用户',
      '"能感受到品牌的用心" - Agoda用户',
    ],
    negative: [
      '"装修风格太普通，没什么特色" - 携程用户',
      '"感觉和其他连锁酒店没区别" - 美团用户',
    ],
  },
};

// 关注清单数据
const watchlistData = [
  { name: '上海浦东假日酒店', reason: '评分持续下滑', score: 4.28, trend: '-0.08' },
  { name: '南京新街口假日酒店', reason: '隔音投诉激增', score: 3.92, trend: '-0.15' },
  { name: '杭州西湖假日酒店', reason: '新店稳定化监控', score: 4.42, trend: '-0.03', isNew: true },
];

export function HotelView() {
  const { currentRole } = useAuth();
  
  if (!currentRole) return null;

  // 单店视角 - 酒店店长
  if (currentRole.id === 'hotel_mgr') {
    return <SingleHotelView />;
  }

  // 层级视角 - 大区/城市负责人
  return <HierarchyView />;
}

// ========== 层级视角（大区/城市负责人）==========
function HierarchyView() {
  const [currentLevel, setCurrentLevel] = useState<'region' | 'province' | 'city' | 'hotel'>('region');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [watchlist, setWatchlist] = useState(watchlistData);

  const breadcrumb = ['全国', ...selectedPath];

  const handleDrillDown = (name: string) => {
    const newPath = [...selectedPath, name];
    setSelectedPath(newPath);
    
    if (currentLevel === 'region') setCurrentLevel('province');
    else if (currentLevel === 'province') setCurrentLevel('city');
    else if (currentLevel === 'city') setCurrentLevel('hotel');
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setSelectedPath([]);
      setCurrentLevel('region');
      setSelectedHotel(null);
    } else {
      setSelectedPath(selectedPath.slice(0, index));
      if (index === 1) setCurrentLevel('province');
      else if (index === 2) setCurrentLevel('city');
      else if (index === 3) setCurrentLevel('hotel');
      setSelectedHotel(null);
    }
  };

  const handleSelectHotel = (hotel: string) => {
    setSelectedHotel(hotel);
  };

  const getCurrentData = () => {
    if (currentLevel === 'region') return hierarchyData.regions;
    if (currentLevel === 'province') return hierarchyData.provinces[selectedPath[0] as keyof typeof hierarchyData.provinces] || [];
    if (currentLevel === 'city') return hierarchyData.cities[selectedPath[1] as keyof typeof hierarchyData.cities] || [];
    if (currentLevel === 'hotel') return hierarchyData.hotels[selectedPath[2] as keyof typeof hierarchyData.hotels] || [];
    return [];
  };

  const removeFromWatchlist = (name: string) => {
    setWatchlist(watchlist.filter(h => h.name !== name));
  };

  return (
    <Layout title="Hotel View" subtitle="层级浏览：点击下钻查看详情" requiredModule="hotel_view">
      <div className="space-y-6">
        {/* 面包屑导航 + 关注清单入口 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {idx > 0 && <ChevronRight size={14} className="text-slate-400" />}
                <button
                  onClick={() => handleBreadcrumbClick(idx)}
                  className={clsx(
                    'hover:text-ihg-navy',
                    idx === breadcrumb.length - 1 ? 'text-ihg-navy font-semibold' : 'text-slate-500'
                  )}
                >
                  {item}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowWatchlist(!showWatchlist)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              showWatchlist ? 'bg-ihg-navy text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            <Star size={16} />
            关注清单 ({watchlist.length})
          </button>
        </div>

        {/* 关注清单弹出 */}
        {showWatchlist && (
          <Card className="border-2 border-ihg-gold animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Star size={18} className="text-ihg-gold" />
                我的关注清单
              </h3>
              <span className="text-xs text-slate-500">系统推荐 + 自行添加</span>
            </div>
            <div className="space-y-3">
              {watchlist.map((hotel) => (
                <div key={hotel.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      hotel.isNew ? 'bg-blue-100' : 'bg-red-100'
                    )}>
                      {hotel.isNew ? <Clock size={18} className="text-blue-600" /> : <AlertTriangle size={18} className="text-red-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{hotel.name}</div>
                      <div className="text-xs text-slate-500">{hotel.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">{hotel.score}</div>
                      <div className={clsx(
                        'text-xs',
                        hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      )}>
                        {hotel.trend}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectHotel(hotel.name)}
                      className="px-3 py-1.5 bg-ihg-navy text-white text-xs rounded-lg"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(hotel.name)}
                      className="p-1.5 text-slate-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm hover:border-ihg-navy hover:text-ihg-navy flex items-center justify-center gap-2">
              <Plus size={16} />
              添加门店到关注清单
            </button>
          </Card>
        )}

        {/* 如果选中了具体酒店，显示酒店详情 */}
        {selectedHotel ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedHotel(null)}
              className="text-sm text-ihg-navy hover:underline flex items-center gap-1"
            >
              ← 返回列表
            </button>
            <SingleHotelView hotelName={selectedHotel} />
          </div>
        ) : (
          /* 层级列表 */
          <Card padding="none">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                {currentLevel === 'region' && '区域列表'}
                {currentLevel === 'province' && `${selectedPath[0]} · 省份列表`}
                {currentLevel === 'city' && `${selectedPath[1]} · 城市/区列表`}
                {currentLevel === 'hotel' && `${selectedPath[2]} · 门店列表`}
              </h3>
              <span className="text-xs text-slate-500">点击行查看详情</span>
            </div>
            <div className="divide-y divide-slate-100">
              {getCurrentData().map((item: any, idx: number) => (
                <div
                  key={item.name}
                  onClick={() => currentLevel === 'hotel' ? handleSelectHotel(item.name) : handleDrillDown(item.name)}
                  className={clsx(
                    'flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-slate-50',
                    item.status === 'danger' && 'bg-red-50/50',
                    item.isNew && 'bg-blue-50/30'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      idx === 0 ? 'bg-ihg-gold text-white' : 'bg-slate-100 text-slate-600'
                    )}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{item.name}</span>
                        {item.brand && <span className="text-xs text-slate-400">{item.brand}</span>}
                        {item.isNew && (
                          <Badge variant="info">新店 {item.daysOpen}天</Badge>
                        )}
                      </div>
                      {item.hotels && (
                        <span className="text-xs text-slate-400">{item.hotels}家门店</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {item.issues > 0 && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {item.issues}个问题
                      </span>
                    )}
                    <span className={clsx(
                      'text-sm font-medium',
                      item.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {item.trend}
                    </span>
                    <span className="text-xl font-bold text-slate-800">{item.score}</span>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 新店监控模块 - 只在非酒店层级显示 */}
        {currentLevel !== 'hotel' && !selectedHotel && (
          <section className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                新店稳定化监控
              </h3>
              <span className="text-sm text-slate-500">开业90天内门店</span>
            </div>
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{newOpeningData.hotelName}</div>
                    <div className="text-sm text-slate-500">开业第 {newOpeningData.daysOpen} 天 · {newOpeningData.brand}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-800">{newOpeningData.stabilityScore}</div>
                    <div className="text-xs text-slate-500">稳定化得分</div>
                  </div>
                  <div className="flex gap-2">
                    {newOpeningData.painPoints.length > 0 && (
                      <Badge variant="danger">{newOpeningData.painPoints.length}个风险</Badge>
                    )}
                    {newOpeningData.highlights.length > 0 && (
                      <Badge variant="success">{newOpeningData.highlights.length}个亮点</Badge>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-ihg-navy text-white text-sm rounded-lg flex items-center gap-2">
                    查看详情 <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </Layout>
  );
}

// ========== 单店视角（酒店店长）==========
function SingleHotelView({ hotelName }: { hotelName?: string }) {
  const [expandedNeed, setExpandedNeed] = useState<string | null>(null);
  const [expandedBarrier, setExpandedBarrier] = useState<string | null>(null);

  const displayName = hotelName || hotelHealthData.hotelName;

  return (
    <Layout title={hotelName ? displayName : "我的酒店"} subtitle="单店详细数据" requiredModule="hotel_view">
      <div className="space-y-6">
        {/* 评分概览 */}
        <section className="animate-fade-in-up">
          <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">{displayName}</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-bold">{hotelHealthData.overallScore}</span>
                  <span className="text-white/50 text-xl mb-1">/ 5.0</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
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

        {/* 用户需求洞察 - 可展开 */}
        <section className="animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📊 用户需求洞察</h3>
            <span className="text-sm text-slate-500">点击卡片查看具体评论</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {userNeedsData.map((need) => (
              <div key={need.category}>
                <Card
                  className={clsx(
                    'cursor-pointer transition-all',
                    expandedNeed === need.category ? 'ring-2 ring-ihg-navy' : 'hover:shadow-md'
                  )}
                  padding="sm"
                  onClick={() => setExpandedNeed(expandedNeed === need.category ? null : need.category)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{need.icon}</span>
                      <span className="font-medium text-slate-800">{need.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        'text-sm',
                        need.trend === '↑' ? 'text-red-500' : need.trend === '↓' ? 'text-emerald-500' : 'text-slate-400'
                      )}>
                        {need.trend}
                      </span>
                      {expandedNeed === need.category ? (
                        <ChevronDown size={16} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-400" />
                      )}
                    </div>
                  </div>
                  <ProgressBar value={need.intensity} color="navy" size="sm" />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {need.items.slice(0, 2).map((item) => (
                      <span key={item} className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                        {item}
                      </span>
                    ))}
                    {need.items.length > 2 && (
                      <span className="text-xs text-slate-400">+{need.items.length - 2}</span>
                    )}
                  </div>
                </Card>

                {/* 展开的详情 */}
                {expandedNeed === need.category && needsDetailData[need.category] && (
                  <div className="mt-2 animate-fade-in-up">
                    <Card className="bg-slate-50" padding="sm">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-700">正面评价</span>
                          </div>
                          <div className="space-y-1">
                            {needsDetailData[need.category].positive.map((comment, idx) => (
                              <p key={idx} className="text-xs text-slate-600 pl-5">{comment}</p>
                            ))}
                          </div>
                        </div>
                        <div className="border-t border-slate-200 pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={14} className="text-red-500" />
                            <span className="text-xs font-medium text-red-700">负面评价</span>
                          </div>
                          <div className="space-y-1">
                            {needsDetailData[need.category].negative.map((comment, idx) => (
                              <p key={idx} className="text-xs text-slate-600 pl-5">{comment}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 用户旅程风险 - 可展开 */}
        <section className="animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🚨 用户旅程风险</h3>
            <span className="text-sm text-slate-500">点击阶段查看详情</span>
          </div>
          <Card>
            <div className="flex items-center justify-between">
              {hotelBarriersData.journeyRisks.map((stage, idx) => (
                <div key={stage.stage} className="flex items-center">
                  <div
                    onClick={() => setExpandedBarrier(expandedBarrier === stage.stage ? null : stage.stage)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className={clsx(
                      'w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 mb-2 transition-all group-hover:scale-105',
                      stage.risk === 'high' ? 'bg-red-50 border-red-300' : 
                      stage.risk === 'medium' ? 'bg-amber-50 border-amber-300' : 
                      'bg-emerald-50 border-emerald-300',
                      expandedBarrier === stage.stage && 'ring-2 ring-ihg-navy'
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

            {/* 展开的阶段详情 */}
            {expandedBarrier && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in-up">
                <h4 className="font-medium text-slate-800 mb-3">
                  {expandedBarrier}阶段问题详情
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {hotelBarriersData.journeyRisks
                    .find(s => s.stage === expandedBarrier)
                    ?.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 bg-red-50 rounded-lg flex items-center gap-2">
                        <AlertTriangle size={14} className="text-red-500" />
                        <span className="text-sm text-red-800">{issue}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* 驱动因素 */}
        <section className="animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">✅ 驱动因素（做得好的地方）</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {hotelDriversData.slice(0, 4).map((driver) => (
              <Card key={driver.dimension} padding="sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-800">{driver.dimension}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600">{driver.score}</span>
                    {driver.trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
                    {driver.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-slate-500">vs 城市</span>
                  <span className={clsx(
                    driver.vsCity.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {driver.vsCity}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">vs 品牌</span>
                  <span className={clsx(
                    driver.vsBrand.startsWith('+') ? 'text-emerald-600' : 
                    driver.vsBrand === '0' ? 'text-slate-400' : 'text-red-600'
                  )}>
                    {driver.vsBrand}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {driver.keywords.slice(0, 3).map((kw) => (
                    <span key={kw} className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
