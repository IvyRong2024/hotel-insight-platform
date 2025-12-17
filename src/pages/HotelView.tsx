import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge, ProgressBar } from '../components/ui';
import { 
  regionHierarchy, 
  brandTiers, 
  hotelDetailData, 
  getHotelDetailById,
  userNeedsData, 
  watchlistData,
  newOpeningData,
  reviewPlatforms,
  cityCompetitorHotels,
  brandCompetitorData,
  reviewAppealsData,
  BrandTier,
  HotelData,
  CityData,
  ReviewPlatform,
  ReviewAppeal
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronRight, 
  Star, 
  AlertTriangle, 
  ArrowRight, 
  Plus, 
  X, 
  Clock, 
  CheckCircle,
  Building,
  Filter,
  FileText,
  Upload,
  MessageSquare,
  XCircle
} from 'lucide-react';
import clsx from 'clsx';

export function HotelView() {
  const { currentRole } = useAuth();
  
  if (!currentRole) return null;

  // 酒店店长（成熟门店）看单店详情
  if (currentRole.id === 'hotel_mgr') {
    return (
      <Layout title="我的酒店" subtitle="单店详细数据与用户洞察" requiredModule="hotel">
        <SingleHotelView hotelId={currentRole.hotelId || 'h1'} />
      </Layout>
    );
  }

  // 酒店店长（新店）看单店详情（与成熟门店相同，新店监测在 Overview 展示）
  if (currentRole.id === 'hotel_mgr_new') {
    return (
      <Layout title="我的酒店" subtitle="单店详细数据与用户洞察" requiredModule="hotel">
        <SingleHotelView hotelId={currentRole.hotelId || 'new-1'} />
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
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localWatchlist, setLocalWatchlist] = useState(watchlistData);
  const [addedHotels, setAddedHotels] = useState<string[]>([]);

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
            {localWatchlist.map((hotel) => (
              <div key={hotel.hotelId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    hotel.isNew ? 'bg-blue-100' : addedHotels.includes(hotel.hotelId) ? 'bg-ihg-navy/10' : 'bg-red-100'
                  )}>
                    {hotel.isNew ? <Clock size={18} className="text-blue-600" /> : 
                     addedHotels.includes(hotel.hotelId) ? <Star size={18} className="text-ihg-navy" /> :
                     <AlertTriangle size={18} className="text-red-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{hotel.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '20', color: brandTiers[hotel.tier].color }}>
                        {brandTiers[hotel.tier].name}
                      </span>
                      {addedHotels.includes(hotel.hotelId) && (
                        <span className="text-xs px-2 py-0.5 rounded bg-ihg-navy/10 text-ihg-navy">自行添加</span>
                      )}
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
                  <button 
                    onClick={() => {
                      setLocalWatchlist(prev => prev.filter(h => h.hotelId !== hotel.hotelId));
                      setAddedHotels(prev => prev.filter(id => id !== hotel.hotelId));
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAddToWatchlist(true)}
            className="mt-4 w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm hover:border-ihg-navy hover:text-ihg-navy flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={16} />
            添加门店到关注清单
          </button>
        </Card>
      )}

      {/* 添加门店弹窗 */}
      {showAddToWatchlist && (
        <AddToWatchlistModal
          onClose={() => {
            setShowAddToWatchlist(false);
            setSearchQuery('');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          existingIds={localWatchlist.map(h => h.hotelId)}
          onAdd={(hotel) => {
            setLocalWatchlist(prev => [...prev, {
              hotelId: hotel.id,
              name: hotel.name,
              reason: '自行添加关注',
              score: hotel.score,
              trend: hotel.trend,
              tier: hotel.tier,
            }]);
            setAddedHotels(prev => [...prev, hotel.id]);
          }}
        />
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

      {/* 同城竞品对比 */}
      {!selectedHotel && currentData && (currentData.type === 'hotels' || currentData.type === 'city') && (
        <CityCompetitorSection cityName={currentData.type === 'city' ? currentData.data.name : currentData.data.name} />
      )}

      {/* 品牌级别竞品对比（区域视角） */}
      {!selectedHotel && !selectedCity && !startFromCity && (
        <BrandCompetitorSection />
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

// ========== 同城竞品对比 ==========
function CityCompetitorSection({ cityName }: { cityName: string }) {
  const competitors = cityCompetitorHotels[cityName] || [];
  
  if (competitors.length === 0) return null;

  // 按档次分组
  const byTier = competitors.reduce((acc, hotel) => {
    if (!acc[hotel.tier]) acc[hotel.tier] = [];
    acc[hotel.tier].push(hotel);
    return acc;
  }, {} as Record<BrandTier, typeof competitors>);

  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Building size={18} className="text-purple-500" />
            {cityName}竞品酒店动态
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">监测同城主要竞品酒店的表现，便于对标分析</p>
        </div>
        <span className="text-sm text-slate-500">{competitors.length}家竞品</span>
      </div>
      
      <div className="space-y-4">
        {(Object.entries(byTier) as [BrandTier, typeof competitors][]).map(([tier, hotels]) => (
          <Card key={tier} padding="sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
              <span className="font-medium text-slate-700">{brandTiers[tier].name}</span>
              <span className="text-xs text-slate-400">{hotels.length}家</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-slate-800 text-sm">{hotel.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{hotel.brand}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">{hotel.group}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-800">{hotel.score}</span>
                      <span className={clsx(
                        'text-xs ml-1',
                        hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      )}>
                        {hotel.trend}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hotel.highlights.map((h, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">{h}</span>
                    ))}
                    {hotel.concerns.map((c, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ========== 品牌级别竞品对比（区域视角） ==========
function BrandCompetitorSection() {
  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Star size={18} className="text-ihg-gold" />
            品牌级别竞品对比
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">按品牌档次对标同类竞品品牌表现</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {brandCompetitorData.slice(0, 3).map((item) => (
          <Card key={item.ihgBrand} padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-28 flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandTiers[item.tier].color }} />
                  <span className="font-semibold text-ihg-navy text-sm">{item.ihgBrand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-800">{item.ihgScore}</span>
                  <span className={clsx(
                    'text-xs',
                    item.ihgTrend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {item.ihgTrend}
                  </span>
                </div>
              </div>
              <div className="flex-1 flex gap-2 overflow-x-auto">
                {item.competitors.slice(0, 3).map((comp) => (
                  <div key={comp.brand} className={clsx(
                    'px-3 py-2 rounded-lg min-w-[120px] text-center flex-shrink-0',
                    comp.diff.startsWith('+') ? 'bg-emerald-50' : 'bg-red-50'
                  )}>
                    <div className="text-xs font-medium text-slate-700 mb-1">{comp.brand}</div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-bold text-slate-800">{comp.score}</span>
                      <span className={clsx(
                        'text-xs',
                        comp.diff.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      )}>
                        {comp.diff}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ========== 单店视角（酒店店长）==========
function SingleHotelView({ hotelData, onBack, isNewOpening = false, hotelId }: { hotelData?: HotelData, onBack?: () => void, isNewOpening?: boolean, hotelId?: string }) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [showCommentDeepDive, setShowCommentDeepDive] = useState<string | null>(null); // 评论深度查看的需求类别

  // 根据 hotelId 获取对应的酒店详情数据
  const hotel = hotelId ? getHotelDetailById(hotelId) : hotelDetailData;
  
  // 新店监测数据（仅新店店长可见）
  const newOpeningMonitorData = {
    daysOpen: 58,
    phase: { name: '磨合期', range: '31-90天', color: '#f59e0b' },
    stabilityIndex: 72,
    maturityScore: 68,
    brandPerception: 75,
    negativeRatio: 8,
    matureBenchmark: { stabilityIndex: 85, maturityScore: 88, brandPerception: 82, negativeRatio: 4 },
    barriers: [
      { factor: '入住等待时间', severity: 'high' as const, frequency: 15, description: '前台办理入住平均等待超10分钟' },
      { factor: '早餐补给不及时', severity: 'medium' as const, frequency: 8, description: '周末高峰期补餐不及时' },
      { factor: '空调温控不稳定', severity: 'medium' as const, frequency: 6, description: '部分房间温控需要调试' },
    ],
    phaseActions: [
      { action: '前台入住流程优化', priority: 'high' as const, status: 'in_progress' as const, deadline: '12月20日' },
      { action: '早餐高峰预案制定', priority: 'high' as const, status: 'pending' as const, deadline: '12月25日' },
      { action: '空调系统全面调试', priority: 'medium' as const, status: 'pending' as const, deadline: '12月28日' },
    ],
  };

  // 如果正在查看评论详情，显示评论深度查看页面
  if (showCommentDeepDive) {
    const selectedNeed = userNeedsData.find(n => n.category === showCommentDeepDive);
    if (selectedNeed) {
      return (
        <CommentDeepDive 
          need={selectedNeed} 
          hotelName={hotelData?.name || hotel.hotelName}
          onBack={() => setShowCommentDeepDive(null)} 
        />
      );
    }
  }

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

      {/* 用户需求洞察 - 点击跳转到评论深度分析 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📊 用户需求洞察</h3>
          <span className="text-sm text-slate-500">点击"查看评论"深度分析各平台反馈</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {userNeedsData.map((need) => {
            const totalComments = need.platformComments?.length || 0;
            const positiveCount = need.platformComments?.filter(c => c.sentiment === 'positive').length || 0;
            const negativeCount = need.platformComments?.filter(c => c.sentiment === 'negative').length || 0;

            return (
              <Card key={need.category} padding="sm" className="hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{need.icon}</span>
                    <span className="font-medium text-slate-800">{need.category}</span>
                  </div>
                  <span className={clsx(
                    'text-sm font-medium',
                    need.trend === '↑' ? 'text-red-500' : need.trend === '↓' ? 'text-emerald-500' : 'text-slate-400'
                  )}>
                    {need.trend} 声量{need.trend === '↑' ? '上升' : need.trend === '↓' ? '下降' : '稳定'}
                  </span>
                </div>
                <ProgressBar value={need.intensity} color="navy" size="sm" />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-2 text-xs">
                    <span className="text-emerald-600">👍 {positiveCount}</span>
                    <span className="text-red-600">👎 {negativeCount}</span>
                    <span className="text-slate-400">共 {totalComments} 条</span>
                  </div>
                  <button 
                    onClick={() => setShowCommentDeepDive(need.category)}
                    className="px-3 py-1.5 bg-ihg-navy text-white text-xs rounded-lg hover:bg-ihg-navy-light flex items-center gap-1 transition-all"
                  >
                    查看评论 <ArrowRight size={12} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {need.items.slice(0, 3).map((item) => (
                    <span key={item} className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
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

      {/* ===== 差评申诉管理 ===== */}
      <ReviewAppealSection hotelId={hotelId || 'h1'} />

      {/* ===== 新店监测模块（仅新店店长可见）===== */}
      {isNewOpening && (
        <>
          {/* 新店监测标题 */}
          <section className="animate-fade-in-up delay-250">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h3 className="font-bold text-lg">新店监测专区</h3>
                    <p className="text-white/80 text-sm">
                      开业 {newOpeningMonitorData.daysOpen} 天 · {newOpeningMonitorData.phase.name}（{newOpeningMonitorData.phase.range}）
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">距离切换标准视角</p>
                  <p className="text-xl font-bold">{180 - newOpeningMonitorData.daysOpen} 天</p>
                </div>
              </div>
              {/* 生命周期进度条 */}
              <div className="mt-3">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${(newOpeningMonitorData.daysOpen / 180) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>启动期 0-30天</span>
                  <span>磨合期 31-90天</span>
                  <span>稳定期 91-180天</span>
                </div>
              </div>
            </div>
          </section>

          {/* 新店核心指标 */}
          <section className="animate-fade-in-up delay-300">
            <h3 className="text-base font-semibold text-slate-800 mb-3">📊 新店核心指标（vs 同品牌成熟店）</h3>
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-slate-500 text-sm">稳定性指数</p>
                  <span className="text-xs text-slate-400 cursor-help" title="近7天评分标准差越小，稳定性越高">ⓘ</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-slate-800">{newOpeningMonitorData.stabilityIndex}%</p>
                  <p className={clsx(
                    'text-sm mb-1',
                    newOpeningMonitorData.stabilityIndex < newOpeningMonitorData.matureBenchmark.stabilityIndex ? 'text-red-500' : 'text-emerald-500'
                  )}>
                    vs {newOpeningMonitorData.matureBenchmark.stabilityIndex}%
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-1">7日评分波动率倒数</p>
              </Card>
              <Card>
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-slate-500 text-sm">体验成熟度</p>
                  <span className="text-xs text-slate-400 cursor-help" title="6大体验维度被正向提及的覆盖率 + 服务一致性">ⓘ</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-slate-800">{newOpeningMonitorData.maturityScore}</p>
                  <p className={clsx(
                    'text-sm mb-1',
                    newOpeningMonitorData.maturityScore < newOpeningMonitorData.matureBenchmark.maturityScore ? 'text-red-500' : 'text-emerald-500'
                  )}>
                    vs {newOpeningMonitorData.matureBenchmark.maturityScore}
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-1">体验维度覆盖 × 一致性</p>
              </Card>
              <Card>
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-slate-500 text-sm">品牌特色感知</p>
                  <span className="text-xs text-slate-400 cursor-help" title="用户主动提及品牌特色关键词的比例">ⓘ</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-ihg-navy">{newOpeningMonitorData.brandPerception}%</p>
                  <p className={clsx(
                    'text-sm mb-1',
                    newOpeningMonitorData.brandPerception < newOpeningMonitorData.matureBenchmark.brandPerception ? 'text-red-500' : 'text-emerald-500'
                  )}>
                    vs {newOpeningMonitorData.matureBenchmark.brandPerception}%
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-1">用户主动提及品牌特色词</p>
              </Card>
              <Card>
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-slate-500 text-sm">负面评论占比</p>
                  <span className="text-xs text-slate-400 cursor-help" title="1-2分/星评论占总评论的比例">ⓘ</span>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-red-600">{newOpeningMonitorData.negativeRatio}%</p>
                  <p className={clsx(
                    'text-sm mb-1',
                    newOpeningMonitorData.negativeRatio > newOpeningMonitorData.matureBenchmark.negativeRatio ? 'text-red-500' : 'text-emerald-500'
                  )}>
                    vs {newOpeningMonitorData.matureBenchmark.negativeRatio}%
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-1">低分评论（1-2分/星）</p>
              </Card>
            </div>
          </section>

          {/* 新店早期风险 */}
          <section className="animate-fade-in-up delay-350">
            <h3 className="text-base font-semibold text-slate-800 mb-3">⚠️ 新店早期风险</h3>
            <div className="space-y-3">
              {newOpeningMonitorData.barriers.map((barrier) => (
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
          <section className="animate-fade-in-up delay-400">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: newOpeningMonitorData.phase.color }} />
              <h3 className="text-base font-semibold text-slate-800">{newOpeningMonitorData.phase.name}行动建议</h3>
            </div>
            <div className="space-y-2">
              {newOpeningMonitorData.phaseActions.map((action) => (
                <Card key={action.action} padding="sm" className="bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {action.status === 'in_progress' ? (
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                          <Clock size={12} className="text-amber-600" />
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
          <section className="animate-fade-in-up delay-450">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <b>💡 新店监测模式：</b>您的酒店处于开业 {newOpeningMonitorData.daysOpen} 天的{newOpeningMonitorData.phase.name}阶段，
                系统将持续关注运营稳定性与体验成熟度。{180 - newOpeningMonitorData.daysOpen} 天后将自动切换为标准门店视角。
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

// ========== 评论深度分析页面 ==========
function CommentDeepDive({ 
  need, 
  hotelName,
  onBack 
}: { 
  need: typeof userNeedsData[0], 
  hotelName: string,
  onBack: () => void 
}) {
  const [selectedPlatform, setSelectedPlatform] = useState<ReviewPlatform | 'all'>('all');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  // 筛选和排序评论
  const filteredComments = (need.platformComments || [])
    .filter(c => selectedPlatform === 'all' || c.platform === selectedPlatform)
    .filter(c => sentimentFilter === 'all' || c.sentiment === sentimentFilter)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.rating - a.rating;
    });

  // 各平台统计
  const platformStats = reviewPlatforms.map(platform => {
    const comments = (need.platformComments || []).filter(c => c.platform === platform);
    return {
      platform,
      total: comments.length,
      positive: comments.filter(c => c.sentiment === 'positive').length,
      negative: comments.filter(c => c.sentiment === 'negative').length,
      avgRating: comments.length > 0 
        ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
        : '-'
    };
  });

  const totalPositive = (need.platformComments || []).filter(c => c.sentiment === 'positive').length;
  const totalNegative = (need.platformComments || []).filter(c => c.sentiment === 'negative').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-ihg-navy hover:underline"
          >
            ← 返回需求洞察
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-3xl">{need.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{need.category} · 评论深度分析</h2>
              <p className="text-sm text-slate-500">{hotelName}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">👍 {totalPositive}</Badge>
          <Badge variant="danger">👎 {totalNegative}</Badge>
        </div>
      </div>

      {/* 平台分布概览 */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">📊 各平台评论分布</h3>
        <div className="grid grid-cols-6 gap-4">
          {platformStats.map(stat => (
            <div 
              key={stat.platform}
              onClick={() => setSelectedPlatform(selectedPlatform === stat.platform ? 'all' : stat.platform)}
              className={clsx(
                'p-3 rounded-xl cursor-pointer transition-all border-2',
                selectedPlatform === stat.platform 
                  ? 'border-ihg-navy bg-ihg-navy/5' 
                  : 'border-transparent bg-slate-50 hover:border-slate-200'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(
                  'text-xs font-medium px-2 py-0.5 rounded',
                  stat.platform === '携程' ? 'bg-blue-100 text-blue-700' :
                  stat.platform === '美团' ? 'bg-yellow-100 text-yellow-700' :
                  stat.platform === '飞猪' ? 'bg-orange-100 text-orange-700' :
                  stat.platform === 'Booking' ? 'bg-indigo-100 text-indigo-700' :
                  stat.platform === 'Expedia' ? 'bg-purple-100 text-purple-700' :
                  'bg-pink-100 text-pink-700'
                )}>
                  {stat.platform}
                </span>
                <span className="text-lg font-bold text-slate-800">{stat.avgRating}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-600">+{stat.positive}</span>
                <span className="text-red-600">-{stat.negative}</span>
                <span className="text-slate-400">共{stat.total}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 筛选器 */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">情感筛选:</span>
              <div className="flex gap-1">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'positive', label: '👍 好评' },
                  { value: 'negative', label: '👎 差评' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSentimentFilter(opt.value as 'all' | 'positive' | 'negative')}
                    className={clsx(
                      'px-3 py-1.5 text-xs rounded-lg transition-all',
                      sentimentFilter === opt.value 
                        ? 'bg-ihg-navy text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">排序:</span>
              <div className="flex gap-1">
                {[
                  { value: 'date', label: '最新' },
                  { value: 'rating', label: '评分' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value as 'date' | 'rating')}
                    className={clsx(
                      'px-3 py-1.5 text-xs rounded-lg transition-all',
                      sortBy === opt.value 
                        ? 'bg-ihg-navy text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            共 <span className="font-bold text-ihg-navy">{filteredComments.length}</span> 条评论
            {selectedPlatform !== 'all' && (
              <button 
                onClick={() => setSelectedPlatform('all')}
                className="ml-2 text-ihg-navy hover:underline"
              >
                清除平台筛选
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* 评论列表 */}
      <Card padding="none">
        <div className="divide-y divide-slate-100">
          {filteredComments.length > 0 ? filteredComments.map((comment, idx) => (
            <div key={idx} className={clsx(
              'p-4 transition-all hover:bg-slate-50',
              comment.sentiment === 'negative' && 'bg-red-50/30'
            )}>
              <div className="flex items-start gap-4">
                <div className={clsx(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0',
                  comment.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                  comment.sentiment === 'negative' ? 'bg-red-100 text-red-600' :
                  'bg-slate-100 text-slate-600'
                )}>
                  {comment.sentiment === 'positive' ? '👍' : comment.sentiment === 'negative' ? '👎' : '💬'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={clsx(
                        'text-xs font-medium px-2 py-1 rounded',
                        comment.platform === '携程' ? 'bg-blue-100 text-blue-700' :
                        comment.platform === '美团' ? 'bg-yellow-100 text-yellow-700' :
                        comment.platform === '飞猪' ? 'bg-orange-100 text-orange-700' :
                        comment.platform === 'Booking' ? 'bg-indigo-100 text-indigo-700' :
                        comment.platform === 'Expedia' ? 'bg-purple-100 text-purple-700' :
                        'bg-pink-100 text-pink-700'
                      )}>
                        {comment.platform}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{comment.userName}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < comment.rating ? 'text-ihg-gold fill-ihg-gold' : 'text-slate-200'} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{comment.date}</span>
                    </div>
                    {comment.orderId && (
                      <span className="text-xs text-slate-400 font-mono">订单号: {comment.orderId}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">"{comment.content}"</p>
                  {comment.sentiment === 'negative' && (
                    <div className="mt-2 flex gap-2">
                      <button className="text-xs px-3 py-1 bg-ihg-navy text-white rounded hover:bg-ihg-navy-light transition-colors">
                        回复评论
                      </button>
                      <button className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">
                        查看订单
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center">
              <p className="text-slate-400">没有符合条件的评论</p>
            </div>
          )}
        </div>
      </Card>

      {/* 关键词云 */}
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">🏷️ 关键词聚类</h3>
        <div className="flex flex-wrap gap-2">
          {need.items.map((item, idx) => (
            <span 
              key={item} 
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium',
                idx % 3 === 0 ? 'bg-ihg-navy/10 text-ihg-navy' :
                idx % 3 === 1 ? 'bg-emerald-100 text-emerald-700' :
                'bg-amber-100 text-amber-700'
              )}
            >
              {item}
            </span>
          ))}
          {/* 额外添加一些从评论中提取的关键词 */}
          {['效率', '体验', '改进空间', '推荐', '性价比'].map((kw) => (
            <span 
              key={kw}
              className="px-3 py-1.5 rounded-full text-xs bg-slate-100 text-slate-600"
            >
              {kw}
            </span>
          ))}
        </div>
      </Card>

      {/* 行动建议 */}
      <Card className="border-l-4 border-l-ihg-navy">
        <h3 className="font-semibold text-slate-800 mb-3">💡 基于评论的行动建议</h3>
        <div className="space-y-2">
          {need.category === '效率需求' && (
            <>
              <p className="text-sm text-slate-600">• 优化自助入住机身份证识别准确率</p>
              <p className="text-sm text-slate-600">• 高峰时段（14:00-16:00）增加前台人员</p>
              <p className="text-sm text-slate-600">• 推广 App 预办入住功能，减少现场等待</p>
            </>
          )}
          {need.category === '舒适需求' && (
            <>
              <p className="text-sm text-slate-600">• 重点排查走廊房和电梯旁房间隔音问题</p>
              <p className="text-sm text-slate-600">• 定期检查空调设备，减少异响</p>
              <p className="text-sm text-slate-600">• 升级高楼层窗户密封性</p>
            </>
          )}
          {need.category === '服务需求' && (
            <>
              <p className="text-sm text-slate-600">• 客房服务响应目标控制在10分钟内</p>
              <p className="text-sm text-slate-600">• 加强服务话术培训，提升服务温度</p>
              <p className="text-sm text-slate-600">• 建立服务满意度即时反馈机制</p>
            </>
          )}
          {!['效率需求', '舒适需求', '服务需求'].includes(need.category) && (
            <>
              <p className="text-sm text-slate-600">• 根据负面评论关键词制定改进计划</p>
              <p className="text-sm text-slate-600">• 将正面反馈作为服务标杆进行推广</p>
              <p className="text-sm text-slate-600">• 持续监控该维度的用户满意度变化</p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

// ========== 添加门店到关注清单弹窗 ==========
function AddToWatchlistModal({
  onClose,
  searchQuery,
  onSearchChange,
  existingIds,
  onAdd
}: {
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  existingIds: string[];
  onAdd: (hotel: HotelData) => void;
}) {
  // 获取所有可添加的门店
  const allHotels: HotelData[] = [];
  regionHierarchy.forEach(region => {
    region.provinces.forEach(province => {
      province.cities.forEach(city => {
        city.hotels.forEach(hotel => {
          if (!existingIds.includes(hotel.id)) {
            allHotels.push(hotel);
          }
        });
      });
    });
  });

  // 根据搜索词筛选
  const filteredHotels = searchQuery
    ? allHotels.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allHotels;

  // 推荐关注（评分下降或有问题的门店）
  const recommendedHotels = allHotels
    .filter(h => h.status === 'warning' || h.status === 'danger' || h.trend.startsWith('-'))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
      <Card className="w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">添加门店到关注清单</h3>
            <p className="text-sm text-slate-500">搜索或从推荐中选择需要重点关注的门店</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="py-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="输入门店名称或品牌搜索..."
              className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:border-ihg-navy text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* 系统推荐 */}
          {!searchQuery && recommendedHotels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-slate-700">系统推荐关注</span>
                <span className="text-xs text-slate-400">根据评分趋势和问题预警</span>
              </div>
              <div className="space-y-2">
                {recommendedHotels.map(hotel => (
                  <div 
                    key={hotel.id}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        hotel.status === 'danger' ? 'bg-red-100' : 'bg-amber-100'
                      )}>
                        <AlertTriangle size={18} className={hotel.status === 'danger' ? 'text-red-600' : 'text-amber-600'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{hotel.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '20', color: brandTiers[hotel.tier].color }}>
                            {brandTiers[hotel.tier].name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {hotel.issues?.[0] || `评分趋势 ${hotel.trend}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">{hotel.score}</div>
                        <div className={clsx('text-xs', hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                          {hotel.trend}
                        </div>
                      </div>
                      <button 
                        onClick={() => onAdd(hotel)}
                        className="px-4 py-2 bg-ihg-navy text-white text-xs rounded-lg hover:bg-ihg-navy-light transition-colors flex items-center gap-1"
                      >
                        <Plus size={14} /> 添加
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 搜索结果 / 全部门店 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                {searchQuery ? `搜索结果 (${filteredHotels.length})` : `全部可添加门店 (${allHotels.length})`}
              </span>
            </div>
            {filteredHotels.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredHotels.map(hotel => (
                  <div 
                    key={hotel.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Building size={18} className="text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{hotel.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: brandTiers[hotel.tier].color + '20', color: brandTiers[hotel.tier].color }}>
                            {brandTiers[hotel.tier].name}
                          </span>
                          {hotel.isNew && <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">新店</span>}
                        </div>
                        <div className="text-xs text-slate-500">{hotel.brand}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">{hotel.score}</div>
                        <div className={clsx('text-xs', hotel.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                          {hotel.trend}
                        </div>
                      </div>
                      <button 
                        onClick={() => onAdd(hotel)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 text-xs rounded-lg hover:bg-ihg-navy hover:text-white transition-colors flex items-center gap-1"
                      >
                        <Plus size={14} /> 添加
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p>没有找到匹配的门店</p>
                <p className="text-xs mt-1">试试其他关键词</p>
              </div>
            )}
          </div>
        </div>

        {/* 底部 */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            完成
          </button>
        </div>
      </Card>
    </div>
  );
}

// ========== 差评申诉管理 ==========
function ReviewAppealSection({ hotelId }: { hotelId: string }) {
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appeals, setAppeals] = useState<ReviewAppeal[]>(
    reviewAppealsData.filter(a => a.hotelId === hotelId)
  );
  const [formData, setFormData] = useState({
    reviewId: '',
    platform: '携程' as ReviewPlatform,
    reviewContent: '',
    reviewerName: '',
    reviewDate: '',
    reviewScore: 1,
    appealReason: '',
    proofUrl: '',
  });

  const handleSubmit = () => {
    const newAppeal: ReviewAppeal = {
      id: `appeal-${Date.now()}`,
      ...formData,
      appealDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      hotelId,
    };
    setAppeals([newAppeal, ...appeals]);
    setShowAppealForm(false);
    setFormData({
      reviewId: '',
      platform: '携程',
      reviewContent: '',
      reviewerName: '',
      reviewDate: '',
      reviewScore: 1,
      appealReason: '',
      proofUrl: '',
    });
  };

  const getStatusBadge = (status: ReviewAppeal['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">已通过</Badge>;
      case 'rejected':
        return <Badge variant="danger">已驳回</Badge>;
      default:
        return <Badge variant="warning">审核中</Badge>;
    }
  };

  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-800">📝 差评申诉管理</h3>
          <span className="text-xs text-slate-500">申诉通过后，负面评价将从洞察分析中剔除，次日刷新评分</span>
        </div>
        <button
          onClick={() => setShowAppealForm(true)}
          className="px-4 py-2 bg-ihg-navy text-white text-sm rounded-lg hover:bg-ihg-navy-light transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          提交新申诉
        </button>
      </div>

      {/* 申诉表单弹窗 */}
      {showAppealForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">提交差评申诉</h3>
              <button onClick={() => setShowAppealForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* 评论ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  评论ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reviewId}
                  onChange={(e) => setFormData({ ...formData, reviewId: e.target.value })}
                  placeholder="请输入平台评论ID，如 REV-2024121501"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy"
                />
              </div>

              {/* 平台选择 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  评论平台 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as ReviewPlatform })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy"
                >
                  {reviewPlatforms.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* 评论日期和评分 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    评论日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    评论评分 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.reviewScore}
                    onChange={(e) => setFormData({ ...formData, reviewScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy"
                  >
                    <option value={1}>1分</option>
                    <option value={2}>2分</option>
                    <option value={3}>3分</option>
                  </select>
                </div>
              </div>

              {/* 发帖人名称 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  发帖人名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                  placeholder="请输入评论发帖人名称"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy"
                />
              </div>

              {/* 评论内容 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  评论内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reviewContent}
                  onChange={(e) => setFormData({ ...formData, reviewContent: e.target.value })}
                  placeholder="请粘贴完整的差评内容"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy resize-none"
                />
              </div>

              {/* 申诉理由 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  申诉理由 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.appealReason}
                  onChange={(e) => setFormData({ ...formData, appealReason: e.target.value })}
                  placeholder="请说明申诉理由，如：已与客人沟通达成一致，平台已删除/折叠该评论"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy resize-none"
                />
              </div>

              {/* 平台处理证明 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  平台处理证明
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.proofUrl}
                    onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                    placeholder="请输入证明截图链接或上传"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-ihg-navy"
                  />
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                    <Upload size={14} />
                    上传
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">请提供平台处理完成的截图或链接作为证明</p>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAppealForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.reviewId || !formData.reviewContent || !formData.reviewerName || !formData.appealReason}
                className="px-6 py-2 bg-ihg-navy text-white rounded-lg text-sm hover:bg-ihg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交申诉
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* 申诉列表 */}
      <Card>
        {appeals.length > 0 ? (
          <div className="space-y-4">
            {appeals.map((appeal) => (
              <div key={appeal.id} className={clsx(
                'p-4 rounded-xl border',
                appeal.status === 'approved' ? 'border-emerald-200 bg-emerald-50/50' :
                appeal.status === 'rejected' ? 'border-red-200 bg-red-50/50' :
                'border-amber-200 bg-amber-50/50'
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      appeal.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                      appeal.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-amber-100 text-amber-600'
                    )}>
                      {appeal.status === 'approved' ? <CheckCircle size={20} /> :
                       appeal.status === 'rejected' ? <XCircle size={20} /> :
                       <Clock size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{appeal.platform}</span>
                        <span className="text-xs text-slate-400">评论ID: {appeal.reviewId}</span>
                        {getStatusBadge(appeal.status)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        评论日期: {appeal.reviewDate} · 申诉日期: {appeal.appealDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < appeal.reviewScore ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>

                {/* 评论内容 */}
                <div className="mb-3 p-3 bg-white rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className="text-slate-400" />
                    <span className="text-xs text-slate-500">评论者: {appeal.reviewerName}</span>
                  </div>
                  <p className="text-sm text-slate-700">{appeal.reviewContent}</p>
                </div>

                {/* 申诉理由 */}
                <div className="flex items-start gap-2 mb-2">
                  <FileText size={14} className="text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500">申诉理由: </span>
                    <span className="text-sm text-slate-700">{appeal.appealReason}</span>
                  </div>
                </div>

                {/* 审核结果 */}
                {appeal.statusNote && (
                  <div className={clsx(
                    'text-xs p-2 rounded-lg mt-2',
                    appeal.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    appeal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  )}>
                    <strong>审核意见: </strong>{appeal.statusNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500">暂无申诉记录</p>
            <p className="text-xs text-slate-400 mt-1">当您完成平台差评申诉后，可在此提交剔除申请</p>
          </div>
        )}
      </Card>
    </section>
  );
}
