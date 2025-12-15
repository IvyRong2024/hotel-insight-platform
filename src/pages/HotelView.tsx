import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge, ProgressBar } from '../components/ui';
import { 
  regionHierarchy, 
  brandTiers, 
  hotelDetailData, 
  userNeedsData, 
  watchlistData,
  newOpeningData,
  reviewPlatforms,
  BrandTier,
  HotelData,
  CityData,
  ReviewPlatform
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  X, 
  Clock, 
  CheckCircle,
  Building,
  Filter
} from 'lucide-react';
import clsx from 'clsx';

export function HotelView() {
  const { currentRole } = useAuth();
  
  if (!currentRole) return null;

  // 酒店店长看单店详情
  if (currentRole.id === 'hotel_mgr') {
    return (
      <Layout title="我的酒店" subtitle="单店详细数据与用户洞察" requiredModule="hotel">
        <SingleHotelView />
      </Layout>
    );
  }

  // 大区/城市负责人看层级浏览
  return (
    <Layout title="Hotel View" subtitle="层级浏览：点击下钻查看详情" requiredModule="hotel">
      <HierarchyView roleId={currentRole.id} />
    </Layout>
  );
}

// ========== 层级视角（大区/城市负责人）==========
function HierarchyView({ roleId }: { roleId: string }) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [tierFilter, setTierFilter] = useState<BrandTier | 'all'>('all');

  const region = regionHierarchy[0]; // 华东区

  // 城市负责人直接从城市开始
  const startFromCity = roleId === 'city_mgr';
  const defaultCity = startFromCity ? region.provinces[0].cities[0] : null;

  // 获取当前显示的数据
  const getCurrentData = () => {
    if (selectedHotel) return null; // 显示单店详情

    if (startFromCity && !selectedCity) {
      // 城市负责人：直接显示城市数据
      return { type: 'city' as const, data: defaultCity! };
    }

    if (!selectedProvince) {
      // 大区负责人：显示省份列表
      return { type: 'provinces' as const, data: region.provinces };
    }

    const province = region.provinces.find(p => p.name === selectedProvince);
    if (!province) return null;

    if (!selectedCity) {
      // 显示城市列表
      return { type: 'cities' as const, data: province.cities };
    }

    const city = province.cities.find(c => c.name === selectedCity);
    if (!city) return null;

    // 显示门店列表
    return { type: 'hotels' as const, data: city };
  };

  const currentData = getCurrentData();

  // 面包屑
  const breadcrumb = [region.name];
  if (selectedProvince) breadcrumb.push(selectedProvince);
  if (selectedCity) breadcrumb.push(selectedCity);
  if (selectedHotel) breadcrumb.push(selectedHotel.name);

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setSelectedProvince(null);
      setSelectedCity(null);
      setSelectedHotel(null);
    } else if (index === 1) {
      setSelectedCity(null);
      setSelectedHotel(null);
    } else if (index === 2) {
      setSelectedHotel(null);
    }
  };

  // 筛选门店
  const filterHotels = (hotels: HotelData[]) => {
    if (tierFilter === 'all') return hotels;
    return hotels.filter(h => h.tier === tierFilter);
  };

  // 如果选中了具体酒店，显示单店详情
  if (selectedHotel) {
    return (
      <div className="space-y-4">
        {/* 面包屑 */}
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
        <SingleHotelView hotelData={selectedHotel} onBack={() => setSelectedHotel(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 面包屑 + 关注清单 */}
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
          关注清单 ({watchlistData.length})
        </button>
      </div>

      {/* 关注清单 */}
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
            {watchlistData.map((hotel) => (
              <div key={hotel.hotelId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    hotel.isNew ? 'bg-blue-100' : 'bg-red-100'
                  )}>
                    {hotel.isNew ? <Clock size={18} className="text-blue-600" /> : <AlertTriangle size={18} className="text-red-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{hotel.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '20', color: brandTiers[hotel.tier].color }}>
                        {brandTiers[hotel.tier].name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{hotel.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-800">{hotel.score}</div>
                    <div className={clsx('text-xs', hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                      {hotel.trend}
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-ihg-navy text-white text-xs rounded-lg">
                    查看
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-500">
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

      {/* 主内容区 */}
      {currentData?.type === 'provinces' && (
        <ProvinceList 
          provinces={currentData.data} 
          onSelect={(name) => setSelectedProvince(name)} 
        />
      )}

      {currentData?.type === 'cities' && (
        <CityList 
          cities={currentData.data} 
          onSelect={(name) => setSelectedCity(name)} 
        />
      )}

      {(currentData?.type === 'hotels' || currentData?.type === 'city') && (
        <HotelList 
          city={currentData.type === 'city' ? currentData.data : currentData.data}
          tierFilter={tierFilter}
          onTierFilterChange={setTierFilter}
          onSelectHotel={setSelectedHotel}
          filterHotels={filterHotels}
        />
      )}

      {/* 新店监控模块 */}
      {!selectedHotel && (
        <NewHotelMonitor />
      )}
    </div>
  );
}

// 省份列表
function ProvinceList({ provinces, onSelect }: { provinces: typeof regionHierarchy[0]['provinces'], onSelect: (name: string) => void }) {
  return (
    <Card padding="none">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">省份/直辖市列表</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {provinces.map((province, idx) => (
          <div
            key={province.name}
            onClick={() => onSelect(province.name)}
            className="flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <span className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                idx === 0 ? 'bg-ihg-gold text-white' : 'bg-slate-100 text-slate-600'
              )}>
                {idx + 1}
              </span>
              <div>
                <span className="font-medium text-slate-800">{province.name}</span>
                <span className="text-xs text-slate-400 ml-2">{province.hotelCount}家门店</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {province.issueCount > 0 && (
                <span className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {province.issueCount}个问题
                </span>
              )}
              <span className={clsx(
                'text-sm font-medium',
                province.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              )}>
                {province.trend}
              </span>
              <span className="text-xl font-bold text-slate-800">{province.score}</span>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// 城市列表
function CityList({ cities, onSelect }: { cities: CityData[], onSelect: (name: string) => void }) {
  return (
    <Card padding="none">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">城市列表</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {cities.map((city, idx) => (
          <div
            key={city.name}
            onClick={() => onSelect(city.name)}
            className="flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <span className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                idx === 0 ? 'bg-ihg-gold text-white' : 'bg-slate-100 text-slate-600'
              )}>
                {idx + 1}
              </span>
              <div>
                <span className="font-medium text-slate-800">{city.name}</span>
                <span className="text-xs text-slate-400 ml-2">{city.hotelCount}家门店</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {city.issueCount > 0 && (
                <span className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {city.issueCount}个问题
                </span>
              )}
              <span className={clsx(
                'text-sm font-medium',
                city.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              )}>
                {city.trend}
              </span>
              <span className="text-xl font-bold text-slate-800">{city.score}</span>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// 门店列表（含品牌类型筛选和类型分布）
function HotelList({ 
  city, 
  tierFilter, 
  onTierFilterChange, 
  onSelectHotel,
  filterHotels 
}: { 
  city: CityData, 
  tierFilter: BrandTier | 'all',
  onTierFilterChange: (tier: BrandTier | 'all') => void,
  onSelectHotel: (hotel: HotelData) => void,
  filterHotels: (hotels: HotelData[]) => HotelData[]
}) {
  const filteredHotels = filterHotels(city.hotels);

  return (
    <div className="space-y-6">
      {/* 品牌类型分布 */}
      <div className="grid grid-cols-4 gap-4">
        {(Object.keys(brandTiers) as BrandTier[]).map(tier => {
          const tierData = city.tierScores[tier];
          if (tierData.count === 0) return (
            <Card key={tier} className="opacity-50" padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                <span className="font-medium text-slate-500">{brandTiers[tier].name}</span>
              </div>
              <p className="text-xs text-slate-400">暂无门店</p>
            </Card>
          );
          const isLow = tierData.score < 4.3;
          return (
            <Card 
              key={tier} 
              className={clsx(
                'cursor-pointer transition-all',
                tierFilter === tier && 'ring-2 ring-ihg-navy',
                isLow && 'ring-2 ring-red-200'
              )}
              padding="sm"
              onClick={() => onTierFilterChange(tierFilter === tier ? 'all' : tier)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                <span className="font-medium text-slate-800">{brandTiers[tier].name}</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-2xl font-bold text-slate-800">{tierData.score}</span>
                <span className={clsx(
                  'text-sm',
                  tierData.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {tierData.trend}
                </span>
              </div>
              <p className="text-xs text-slate-500">{tierData.count}家门店</p>
              {isLow && <p className="text-xs text-red-600 mt-1">🚨 需关注</p>}
            </Card>
          );
        })}
      </div>

      {/* 门店列表 */}
      <Card padding="none">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">门店列表</h3>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-sm text-slate-500">
              {tierFilter === 'all' ? '全部类型' : brandTiers[tierFilter].name}
            </span>
            {tierFilter !== 'all' && (
              <button onClick={() => onTierFilterChange('all')} className="text-xs text-ihg-navy hover:underline">
                清除筛选
              </button>
            )}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredHotels.map((hotel, idx) => (
            <div
              key={hotel.id}
              onClick={() => onSelectHotel(hotel)}
              className={clsx(
                'flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-slate-50',
                hotel.status === 'danger' && 'bg-red-50/50'
              )}
            >
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
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// 新店监控模块
function NewHotelMonitor() {
  return (
    <section>
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
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{newOpeningData.hotelName}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[newOpeningData.tier].color + '20', color: brandTiers[newOpeningData.tier].color }}>
                  {brandTiers[newOpeningData.tier].name}
                </span>
              </div>
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
        {/* 里程碑进度 */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            {newOpeningData.milestones.map((m, idx) => (
              <div key={m.day} className="flex items-center">
                <div className={clsx(
                  'flex flex-col items-center',
                )}>
                  <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                    m.achieved ? 'bg-emerald-100 text-emerald-600' : m.current ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                  )}>
                    {m.achieved ? <CheckCircle size={18} /> : m.target}
                  </div>
                  <span className="text-xs text-slate-500 mt-1">{m.day}天目标</span>
                </div>
                {idx < newOpeningData.milestones.length - 1 && (
                  <div className={clsx(
                    'w-24 h-1 mx-2 rounded',
                    m.achieved ? 'bg-emerald-200' : 'bg-slate-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

// ========== 单店视角（酒店店长）==========
function SingleHotelView({ hotelData, onBack }: { hotelData?: HotelData, onBack?: () => void }) {
  const [expandedNeed, setExpandedNeed] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<ReviewPlatform | 'all'>('all');

  const hotel = hotelDetailData;

  return (
    <div className="space-y-6">
      {onBack && (
        <button onClick={onBack} className="text-sm text-ihg-navy hover:underline flex items-center gap-1">
          ← 返回列表
        </button>
      )}

      {/* 评分概览 */}
      <section className="animate-fade-in-up">
        <div className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/60 text-sm">{hotelData?.name || hotel.hotelName}</p>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '40' }}>
                  {brandTiers[hotel.tier].name}
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{hotelData?.score || hotel.score}</span>
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
                <p className="text-white/40 text-xs">{hotel.rankings.region.name}</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">品牌排名</p>
                <p className="text-xl font-bold">#{hotel.rankings.brand.rank}</p>
                <p className="text-white/40 text-xs">{hotel.rankings.brand.name}</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/50 text-xs mb-1">类型排名</p>
                <p className="text-xl font-bold">#{hotel.rankings.tier.rank}</p>
                <p className="text-white/40 text-xs">{hotel.rankings.tier.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 用户需求洞察 - 可展开 + 分平台下钻 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📊 用户需求洞察</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">按平台筛选:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={clsx(
                  'px-2 py-1 text-xs rounded-lg transition-all',
                  selectedPlatform === 'all' ? 'bg-ihg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                全部
              </button>
              {reviewPlatforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={clsx(
                    'px-2 py-1 text-xs rounded-lg transition-all',
                    selectedPlatform === platform ? 'bg-ihg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {userNeedsData.map((need) => {
            // 根据选中平台筛选评论
            const filteredComments = selectedPlatform === 'all' 
              ? need.platformComments 
              : need.platformComments?.filter(c => c.platform === selectedPlatform) || [];
            const positiveComments = filteredComments.filter(c => c.sentiment === 'positive');
            const negativeComments = filteredComments.filter(c => c.sentiment === 'negative');

            return (
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
                  </div>
                </Card>

                {/* 展开的详情 - 分平台评论 */}
                {expandedNeed === need.category && (
                  <div className="mt-2 animate-fade-in-up">
                    <Card className="bg-slate-50" padding="sm">
                      {selectedPlatform !== 'all' && (
                        <div className="mb-3 pb-2 border-b border-slate-200">
                          <span className="text-xs text-ihg-navy font-medium">
                            📍 {selectedPlatform} 平台评论 ({filteredComments.length}条)
                          </span>
                        </div>
                      )}
                      <div className="space-y-3">
                        {/* 正面评价 */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span className="text-xs font-medium text-emerald-700">
                              正面评价 ({positiveComments.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {positiveComments.length > 0 ? positiveComments.map((comment, idx) => (
                              <div key={idx} className="flex items-start gap-2 pl-5">
                                <span className={clsx(
                                  'text-xs px-1.5 py-0.5 rounded shrink-0',
                                  comment.platform === '携程' ? 'bg-blue-100 text-blue-700' :
                                  comment.platform === '美团' ? 'bg-yellow-100 text-yellow-700' :
                                  comment.platform === '飞猪' ? 'bg-orange-100 text-orange-700' :
                                  comment.platform === 'Booking' ? 'bg-indigo-100 text-indigo-700' :
                                  comment.platform === 'Expedia' ? 'bg-purple-100 text-purple-700' :
                                  'bg-pink-100 text-pink-700'
                                )}>
                                  {comment.platform}
                                </span>
                                <div className="flex-1">
                                  <p className="text-xs text-slate-600">"{comment.content}"</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{comment.date} · ⭐{comment.rating}</p>
                                </div>
                              </div>
                            )) : (
                              <p className="text-xs text-slate-400 pl-5">暂无正面评价</p>
                            )}
                          </div>
                        </div>
                        {/* 负面评价 */}
                        <div className="border-t border-slate-200 pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={14} className="text-red-500" />
                            <span className="text-xs font-medium text-red-700">
                              负面评价 ({negativeComments.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {negativeComments.length > 0 ? negativeComments.map((comment, idx) => (
                              <div key={idx} className="flex items-start gap-2 pl-5">
                                <span className={clsx(
                                  'text-xs px-1.5 py-0.5 rounded shrink-0',
                                  comment.platform === '携程' ? 'bg-blue-100 text-blue-700' :
                                  comment.platform === '美团' ? 'bg-yellow-100 text-yellow-700' :
                                  comment.platform === '飞猪' ? 'bg-orange-100 text-orange-700' :
                                  comment.platform === 'Booking' ? 'bg-indigo-100 text-indigo-700' :
                                  comment.platform === 'Expedia' ? 'bg-purple-100 text-purple-700' :
                                  'bg-pink-100 text-pink-700'
                                )}>
                                  {comment.platform}
                                </span>
                                <div className="flex-1">
                                  <p className="text-xs text-slate-600">"{comment.content}"</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{comment.date} · ⭐{comment.rating}</p>
                                </div>
                              </div>
                            )) : (
                              <p className="text-xs text-slate-400 pl-5">暂无负面评价</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 用户旅程风险 - 可展开 */}
      <section className="animate-fade-in-up delay-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🚨 用户旅程风险</h3>
          <span className="text-sm text-slate-500">点击阶段查看详情</span>
        </div>
        <Card>
          <div className="flex items-center justify-between">
            {hotel.journeyRisks.map((stage, idx) => (
              <div key={stage.stage} className="flex items-center">
                <div
                  onClick={() => setExpandedStage(expandedStage === stage.stage ? null : stage.stage)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className={clsx(
                    'w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 mb-2 transition-all group-hover:scale-105',
                    stage.risk === 'high' ? 'bg-red-50 border-red-300' : 
                    stage.risk === 'medium' ? 'bg-amber-50 border-amber-300' : 
                    'bg-emerald-50 border-emerald-300',
                    expandedStage === stage.stage && 'ring-2 ring-ihg-navy'
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

          {/* 展开的阶段详情 */}
          {expandedStage && (
            <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in-up">
              <h4 className="font-medium text-slate-800 mb-3">{expandedStage}阶段问题详情</h4>
              <div className="flex flex-wrap gap-2">
                {hotel.journeyRisks.find(s => s.stage === expandedStage)?.issues.map((issue, idx) => (
                  <div key={idx} className="px-3 py-2 bg-red-50 rounded-lg flex items-center gap-2">
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
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">✅ 做得好的地方</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {hotel.drivers.map((driver) => (
            <Card key={driver.dimension} padding="sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-800">{driver.dimension}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-600">{driver.score}</span>
                  {driver.trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
                  {driver.trend === 'down' && <TrendingDown size={14} className="text-red-500" />}
                </div>
              </div>
              <div className="flex gap-2 text-xs mb-2">
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
              <div className="flex flex-wrap gap-1">
                {driver.keywords.map((kw) => (
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
  );
}
