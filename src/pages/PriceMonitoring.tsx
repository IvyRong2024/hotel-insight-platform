import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui';
import { priceData, brandTiers, BrandTier, cityPriceHierarchy, HotelPriceData } from '../data/mockData';
import { ChevronDown, ChevronRight, Tag, ArrowLeft, MapPin, Building } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import clsx from 'clsx';

type ViewLevel = 'overview' | 'city' | 'tier' | 'hotel';

export function PriceMonitoring() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('overview');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<BrandTier | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelPriceData | null>(null);
  const [expandedVoucher, setExpandedVoucher] = useState<number | null>(null);

  const cityData = selectedCity ? cityPriceHierarchy.find(c => c.city === selectedCity) : null;
  const tierData = cityData && selectedTier ? cityData.byTier[selectedTier] : null;

  // 面包屑导航
  const renderBreadcrumb = () => {
    const items = [{ label: '全国价格概览', level: 'overview' as ViewLevel }];
    if (selectedCity) items.push({ label: selectedCity, level: 'city' as ViewLevel });
    if (selectedTier) items.push({ label: brandTiers[selectedTier].name, level: 'tier' as ViewLevel });
    if (selectedHotel) items.push({ label: selectedHotel.name, level: 'hotel' as ViewLevel });

    return (
      <div className="flex items-center gap-2 text-sm mb-6">
        {items.map((item, idx) => (
          <div key={item.level} className="flex items-center gap-2">
            {idx > 0 && <ChevronRight size={14} className="text-slate-400" />}
            <button
              onClick={() => {
                setViewLevel(item.level);
                if (item.level === 'overview') {
                  setSelectedCity(null);
                  setSelectedTier(null);
                  setSelectedHotel(null);
                } else if (item.level === 'city') {
                  setSelectedTier(null);
                  setSelectedHotel(null);
                } else if (item.level === 'tier') {
                  setSelectedHotel(null);
                }
              }}
              className={clsx(
                'hover:text-ihg-navy transition-colors',
                idx === items.length - 1 ? 'text-ihg-navy font-medium' : 'text-slate-500'
              )}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>
    );
  };

  // 全国概览视图
  const renderOverview = () => (
    <div className="space-y-6">
        {/* 监测说明 */}
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">竞品价格监测</h3>
                <p className="text-white/70 text-sm">监测竞品价格动态，IHG 价格作为对比基准</p>
                <p className="text-white/50 text-xs mt-1">监测平台：携程、抖音、直客通</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">监测竞品</p>
                  <p className="text-2xl font-bold">10,200+</p>
                  <p className="text-white/50 text-xs">家门店</p>
                </div>
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">覆盖城市</p>
                  <p className="text-2xl font-bold">{cityPriceHierarchy.length}+</p>
                </div>
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">竞品集团</p>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-white/50 text-xs">万豪/希尔顿/雅高/凯悦</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

      {/* 城市价格列表 */}
      <section className="animate-fade-in-up delay-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🏙️ 选择城市查看价格</h3>
          <span className="text-xs text-slate-500">点击城市进入详情</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {cityPriceHierarchy.map((city) => (
            <Card 
              key={city.city} 
              className="cursor-pointer hover:ring-2 hover:ring-ihg-navy transition-all"
              onClick={() => {
                setSelectedCity(city.city);
                setViewLevel('city');
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-ihg-navy" />
                <span className="font-semibold text-slate-800">{city.city}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">¥{city.avgPrice}</div>
              <div className="flex items-center justify-between">
                <span className={clsx(
                  'text-sm font-medium',
                  city.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {city.change}
                </span>
                <span className="text-xs text-slate-400">{city.region}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 品牌档次均价 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📊 各品牌档次全国均价</h3>
          <span className="text-xs text-slate-500">基础房型 · 标准大床房</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {(Object.entries(priceData.tierPricing) as [BrandTier, typeof priceData.tierPricing.luxury_lifestyle][]).map(([tier, data]) => (
            <Card key={tier}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                <span className="font-medium text-slate-800">{brandTiers[tier].name}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-2">¥{data.ihg}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">同档竞品 ¥{data.competitor}</span>
                <span className="font-medium text-slate-700">{data.diff}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 价格趋势 */}
      <section className="animate-fade-in-up delay-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📈 价格趋势</h3>
          <span className="text-sm text-slate-500">近30天 · 中端品牌均价</span>
        </div>
        <Card>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={priceData.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[450, 750]} stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                formatter={(value: number) => [`¥${value}`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="IHG" stroke="#003B6F" strokeWidth={3} dot={{ fill: '#003B6F' }} />
              <Line type="monotone" dataKey="万豪" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              <Line type="monotone" dataKey="希尔顿" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              <Line type="monotone" dataKey="雅高" stroke="#6b7280" strokeWidth={2} dot={{ fill: '#6b7280' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>
    </div>
  );

  // 城市视图
  const renderCityView = () => {
    if (!cityData) return null;
    return (
      <div className="space-y-6">
        {/* 城市概览 */}
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} />
                  <h3 className="text-xl font-semibold">{cityData.city}</h3>
                  <span className="text-white/60 text-sm">({cityData.region})</span>
                </div>
                <p className="text-white/70 text-sm">选择品牌档次查看详细价格</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">城市均价</p>
                <p className="text-3xl font-bold">¥{cityData.avgPrice}</p>
                <p className={clsx(
                  'text-sm mt-1',
                  cityData.change.startsWith('+') ? 'text-emerald-300' : 'text-red-300'
                )}>{cityData.change} vs 上月</p>
              </div>
            </div>
          </Card>
        </section>

        {/* 各品牌档次 */}
        <section className="animate-fade-in-up delay-50">
          <h3 className="text-base font-semibold text-slate-800 mb-4">📦 选择品牌档次</h3>
          <div className="grid grid-cols-4 gap-4">
            {(Object.entries(cityData.byTier) as [BrandTier, typeof cityData.byTier.luxury_lifestyle][]).map(([tier, data]) => (
              <Card 
                key={tier}
                className="cursor-pointer hover:ring-2 hover:ring-ihg-navy transition-all"
                onClick={() => {
                  setSelectedTier(tier);
                  setViewLevel('tier');
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                  <span className="font-medium text-slate-800">{brandTiers[tier].name}</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-2">¥{data.ihgAvg}</div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-500">竞品 ¥{data.competitorAvg}</span>
                  <span className="font-medium text-slate-700">{data.diff}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{data.hotels.length} 家门店</span>
                  <ChevronRight size={14} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 渠道价差 */}
        <section className="animate-fade-in-up delay-100">
          <h3 className="text-base font-semibold text-slate-800 mb-4">📱 渠道价差监测</h3>
          <div className="grid grid-cols-3 gap-4">
            {['携程', '抖音', '直客通'].map((channel) => (
              <Card key={channel}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                    channel === '抖音' ? 'bg-pink-100 text-pink-700' :
                    channel === '携程' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>
                    {channel.slice(0, 2)}
                  </div>
                  <span className="font-medium text-slate-800">{channel}</span>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">IHG 均价</p>
                  <p className="text-xl font-bold text-slate-800">
                    ¥{Math.round(cityData.avgPrice * (channel === '抖音' ? 0.92 : channel === '携程' ? 1 : 0.96))}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  };

  // 品牌档次视图
  const renderTierView = () => {
    if (!cityData || !tierData || !selectedTier) return null;
    return (
      <div className="space-y-6">
        {/* 档次概览 */}
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: brandTiers[selectedTier].color }}
                  />
                  <h3 className="text-xl font-semibold">{brandTiers[selectedTier].name}</h3>
                  <span className="text-white/60 text-sm">· {cityData.city}</span>
                </div>
                <p className="text-white/70 text-sm">共 {tierData.hotels.length} 家门店</p>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">IHG 均价</p>
                  <p className="text-2xl font-bold">¥{tierData.ihgAvg}</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">同档竞品</p>
                  <p className="text-2xl font-bold">¥{tierData.competitorAvg}</p>
                  <p className="text-white/50 text-xs">{tierData.diff}</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 门店列表 */}
        <section className="animate-fade-in-up delay-50">
          <h3 className="text-base font-semibold text-slate-800 mb-4">🏨 门店价格详情</h3>
          <Card padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left p-4 font-medium text-slate-500">门店名称</th>
                  <th className="text-center p-4 font-medium text-slate-500">基础房价</th>
                  <th className="text-center p-4 font-medium text-slate-500">携程</th>
                  <th className="text-center p-4 font-medium text-slate-500">抖音</th>
                  <th className="text-center p-4 font-medium text-slate-500">直客通</th>
                  <th className="text-center p-4 font-medium text-slate-500">竞品均价</th>
                  <th className="text-center p-4 font-medium text-slate-500">价差</th>
                  <th className="text-center p-4 font-medium text-slate-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {tierData.hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-slate-400" />
                        <span className="font-medium text-slate-800">{hotel.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{hotel.brand}</span>
                    </td>
                    <td className="text-center p-4 font-bold text-ihg-navy">¥{hotel.basePrice}</td>
                    <td className="text-center p-4 text-slate-600">¥{hotel.channels.ctrip}</td>
                    <td className="text-center p-4 text-slate-600">¥{hotel.channels.douyin}</td>
                    <td className="text-center p-4 text-slate-600">¥{hotel.channels.zhiketong}</td>
                    <td className="text-center p-4 text-slate-500">¥{hotel.competitorAvg}</td>
                    <td className="text-center p-4 font-medium text-slate-700">{hotel.diff}</td>
                    <td className="text-center p-4">
                      <button 
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setViewLevel('hotel');
                        }}
                        className="text-xs text-ihg-navy hover:underline"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    );
  };

  // 单店视图
  const renderHotelView = () => {
    if (!selectedHotel) return null;
    return (
      <div className="space-y-6">
        {/* 门店概览 */}
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building size={20} />
                  <h3 className="text-xl font-semibold">{selectedHotel.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <span>{selectedHotel.brand}</span>
                  <span>·</span>
                  <span>{brandTiers[selectedHotel.tier].name}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">基础房价</p>
                <p className="text-3xl font-bold">¥{selectedHotel.basePrice}</p>
                <p className="text-sm mt-1">
                  vs 竞品 ¥{selectedHotel.competitorAvg} 
                  <span className="ml-2">{selectedHotel.diff}</span>
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* 渠道价格 */}
        <section className="animate-fade-in-up delay-50">
          <h3 className="text-base font-semibold text-slate-800 mb-4">📱 各渠道价格</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: '携程', price: selectedHotel.channels.ctrip, color: 'blue' },
              { name: '抖音', price: selectedHotel.channels.douyin, color: 'pink' },
              { name: '直客通', price: selectedHotel.channels.zhiketong, color: 'emerald' },
            ].map((channel) => (
              <Card key={channel.name}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
                    channel.color === 'pink' ? 'bg-pink-100 text-pink-700' :
                    channel.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>
                    {channel.name.slice(0, 2)}
                  </div>
                  <span className="font-semibold text-slate-800">{channel.name}</span>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-3xl font-bold text-slate-800">¥{channel.price}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    vs 基础价 {channel.price < selectedHotel.basePrice ? 
                      <span className="text-emerald-600">-{Math.round((1 - channel.price / selectedHotel.basePrice) * 100)}%</span> : 
                      <span className="text-slate-600">持平</span>
                    }
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 竞品对比 */}
        <section className="animate-fade-in-up delay-100">
          <h3 className="text-base font-semibold text-slate-800 mb-4">🏆 同档竞品价格</h3>
          <Card>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-ihg-navy/5 rounded-xl">
                <p className="text-sm font-medium text-ihg-navy mb-2">{selectedHotel.brand}</p>
                <p className="text-2xl font-bold text-ihg-navy">¥{selectedHotel.basePrice}</p>
              </div>
              {[
                { brand: '万豪', price: Math.round(selectedHotel.competitorAvg * 1.02) },
                { brand: '希尔顿', price: Math.round(selectedHotel.competitorAvg * 0.98) },
                { brand: '雅高', price: Math.round(selectedHotel.competitorAvg * 0.95) },
              ].map((comp) => (
                <div key={comp.brand} className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-medium text-slate-600 mb-2">{comp.brand}</p>
                  <p className="text-2xl font-bold text-slate-700">¥{comp.price}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    );
  };

  // 券类产品（始终显示在底部）
  const renderVoucherSection = () => (
    <section className="animate-fade-in-up delay-200 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Tag size={18} />
            券类产品动态
          </h3>
          <p className="text-xs text-slate-500 mt-1">仅做动态监测，不做跨品牌对比（服务内容差异大）</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {/* IHG 券类 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-ihg-navy" />
            <span className="text-sm font-medium text-slate-700">IHG 在售券类</span>
          </div>
          <div className="space-y-3">
            {priceData.voucherProducts.map((voucher, idx) => (
              <Card 
                key={idx}
                className={clsx(
                  'cursor-pointer transition-all',
                  expandedVoucher === idx && 'ring-2 ring-ihg-navy'
                )}
                padding="sm"
                onClick={() => setExpandedVoucher(expandedVoucher === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded',
                      voucher.platform === '抖音' ? 'bg-pink-100 text-pink-700' :
                      voucher.platform === '携程' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>{voucher.platform}</span>
                    <span className="text-sm font-medium text-slate-700">{voucher.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-ihg-navy">¥{voucher.salePrice}</span>
                    {expandedVoucher === idx ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </div>
                </div>
                {expandedVoucher === idx && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {voucher.includes.map((item, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* 竞品券类 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="text-sm font-medium text-slate-700">竞品券类动态</span>
          </div>
          <div className="space-y-3">
            {[
              { brand: '万豪', product: '双人周末套餐', price: 828, platform: '抖音' },
              { brand: '希尔顿', product: '商务住宿券', price: 568, platform: '携程' },
              { brand: '雅高', product: '圣诞特惠套餐', price: 698, platform: '飞猪' },
            ].map((item, idx) => (
              <Card key={idx} padding="sm" className="bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">{item.brand}</span>
                    <span className="text-sm text-slate-700">{item.product}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-700">¥{item.price}</span>
                    <span className="text-xs text-slate-400">{item.platform}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <Layout title="Price Monitoring" subtitle="价格层级分析：城市 × 品牌档次 × 单店" requiredModule="price">
      <div>
        {/* 返回按钮 */}
        {viewLevel !== 'overview' && (
          <button
            onClick={() => {
              if (viewLevel === 'hotel') {
                setSelectedHotel(null);
                setViewLevel('tier');
              } else if (viewLevel === 'tier') {
                setSelectedTier(null);
                setViewLevel('city');
              } else {
                setSelectedCity(null);
                setViewLevel('overview');
              }
            }}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-ihg-navy mb-4"
          >
            <ArrowLeft size={16} />
            返回上一级
          </button>
        )}

        {/* 面包屑 */}
        {renderBreadcrumb()}

        {/* 内容区域 */}
        {viewLevel === 'overview' && renderOverview()}
        {viewLevel === 'city' && renderCityView()}
        {viewLevel === 'tier' && renderTierView()}
        {viewLevel === 'hotel' && renderHotelView()}

        {/* 券类产品始终显示 */}
        {renderVoucherSection()}
      </div>
    </Layout>
  );
}
