import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui';
import { priceData, brandTiers, BrandTier } from '../data/mockData';
import { ChevronDown, ChevronRight, Tag, MapPin, Building } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import clsx from 'clsx';

// 竞品价格数据（城市 × 品牌 × 单店）
const competitorPriceData = {
  cities: [
    {
      city: '上海',
      region: '华东',
      avgPrice: 698,
      change: '+3.2%',
      competitors: [
        { group: '万豪国际', avgPrice: 712, hotels: 45 },
        { group: '希尔顿集团', avgPrice: 688, hotels: 38 },
        { group: '雅高集团', avgPrice: 578, hotels: 52 },
        { group: '凯悦集团', avgPrice: 758, hotels: 28 },
      ],
    },
    {
      city: '北京',
      region: '华北',
      avgPrice: 668,
      change: '+2.5%',
      competitors: [
        { group: '万豪国际', avgPrice: 698, hotels: 42 },
        { group: '希尔顿集团', avgPrice: 658, hotels: 35 },
        { group: '雅高集团', avgPrice: 548, hotels: 48 },
        { group: '凯悦集团', avgPrice: 728, hotels: 25 },
      ],
    },
    {
      city: '广州',
      region: '华南',
      avgPrice: 618,
      change: '+1.8%',
      competitors: [
        { group: '万豪国际', avgPrice: 648, hotels: 32 },
        { group: '希尔顿集团', avgPrice: 608, hotels: 28 },
        { group: '雅高集团', avgPrice: 518, hotels: 42 },
        { group: '凯悦集团', avgPrice: 698, hotels: 18 },
      ],
    },
    {
      city: '深圳',
      region: '华南',
      avgPrice: 658,
      change: '+4.1%',
      competitors: [
        { group: '万豪国际', avgPrice: 688, hotels: 28 },
        { group: '希尔顿集团', avgPrice: 648, hotels: 25 },
        { group: '雅高集团', avgPrice: 558, hotels: 35 },
        { group: '凯悦集团', avgPrice: 738, hotels: 15 },
      ],
    },
    {
      city: '杭州',
      region: '华东',
      avgPrice: 588,
      change: '+2.2%',
      competitors: [
        { group: '万豪国际', avgPrice: 618, hotels: 22 },
        { group: '希尔顿集团', avgPrice: 578, hotels: 18 },
        { group: '雅高集团', avgPrice: 498, hotels: 28 },
        { group: '凯悦集团', avgPrice: 668, hotels: 12 },
      ],
    },
  ],
  byTier: {
    luxury_lifestyle: {
      avgPrice: 1580,
      change: '+2.8%',
      competitors: [
        { group: '万豪国际', brands: ['丽思卡尔顿', 'W酒店', 'JW万豪'], avgPrice: 1650 },
        { group: '希尔顿集团', brands: ['华尔道夫', '康莱德'], avgPrice: 1720 },
        { group: '雅高集团', brands: ['莱佛士', '索菲特'], avgPrice: 1480 },
        { group: '凯悦集团', brands: ['柏悦', '安达仕'], avgPrice: 1780 },
      ],
    },
    premium: {
      avgPrice: 658,
      change: '+3.5%',
      competitors: [
        { group: '万豪国际', brands: ['万豪酒店', '喜来登', '威斯汀'], avgPrice: 688 },
        { group: '希尔顿集团', brands: ['希尔顿酒店', '希尔顿逸林'], avgPrice: 648 },
        { group: '雅高集团', brands: ['铂尔曼', '诺富特'], avgPrice: 578 },
        { group: '凯悦集团', brands: ['君悦', '凯悦酒店'], avgPrice: 698 },
      ],
    },
    essentials: {
      avgPrice: 328,
      change: '+4.2%',
      competitors: [
        { group: '万豪国际', brands: ['万怡酒店', 'Fairfield'], avgPrice: 348 },
        { group: '希尔顿集团', brands: ['希尔顿花园', 'Hampton'], avgPrice: 318 },
        { group: '雅高集团', brands: ['美居酒店', '宜必思尚品'], avgPrice: 288 },
        { group: '凯悦集团', brands: ['凯悦嘉轩', '凯悦嘉寓'], avgPrice: 338 },
      ],
    },
    suites: {
      avgPrice: 498,
      change: '+1.5%',
      competitors: [
        { group: '万豪国际', brands: ['万豪行政公寓', 'Residence Inn'], avgPrice: 528 },
        { group: '希尔顿集团', brands: ['Homewood Suites'], avgPrice: 488 },
        { group: '雅高集团', brands: ['雅诗阁'], avgPrice: 468 },
      ],
    },
  } as Record<BrandTier, { avgPrice: number; change: string; competitors: { group: string; brands: string[]; avgPrice: number }[] }>,
  hotelSamples: [
    { name: '上海外滩W酒店', group: '万豪国际', city: '上海', tier: 'luxury_lifestyle' as BrandTier, price: 1880, channels: { ctrip: 1880, douyin: 1780, zhiketong: 1820 } },
    { name: '上海浦东丽思卡尔顿酒店', group: '万豪国际', city: '上海', tier: 'luxury_lifestyle' as BrandTier, price: 2180, channels: { ctrip: 2180, douyin: 2080, zhiketong: 2120 } },
    { name: '北京国贸大酒店', group: '香格里拉', city: '北京', tier: 'luxury_lifestyle' as BrandTier, price: 1680, channels: { ctrip: 1680, douyin: 1580, zhiketong: 1620 } },
    { name: '上海静安希尔顿酒店', group: '希尔顿集团', city: '上海', tier: 'premium' as BrandTier, price: 728, channels: { ctrip: 728, douyin: 668, zhiketong: 698 } },
    { name: '北京王府井希尔顿酒店', group: '希尔顿集团', city: '北京', tier: 'premium' as BrandTier, price: 698, channels: { ctrip: 698, douyin: 638, zhiketong: 668 } },
    { name: '上海虹桥万怡酒店', group: '万豪国际', city: '上海', tier: 'essentials' as BrandTier, price: 368, channels: { ctrip: 368, douyin: 328, zhiketong: 348 } },
  ],
};

// 竞品促销动态
const competitorVouchers = [
  { group: '万豪国际', product: '双人周末套餐', price: 828, platform: '抖音', status: '热销', includes: ['豪华大床房1晚', '双人自助早餐', '迷你吧饮品', '延迟退房'] },
  { group: '希尔顿集团', product: '商务住宿券', price: 568, platform: '携程', status: '在售', includes: ['行政大床房1晚', '单人早餐', '行政酒廊', '健身房'] },
  { group: '雅高集团', product: '圣诞特惠套餐', price: 698, platform: '飞猪', status: '促销中', includes: ['高级房1晚', '双人早餐', '圣诞礼盒', '下午茶'] },
  { group: '凯悦集团', product: '亲子度假券', price: 1188, platform: '抖音', status: '新上架', includes: ['家庭房1晚', '三人早餐', '儿童礼包', '儿童乐园门票'] },
];

type ViewLevel = 'overview' | 'city' | 'tier';

export function PriceMonitoring() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('overview');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<BrandTier | null>(null);
  const [expandedVoucher, setExpandedVoucher] = useState<number | null>(null);

  const cityData = selectedCity ? competitorPriceData.cities.find(c => c.city === selectedCity) : null;
  const tierData = selectedTier ? competitorPriceData.byTier[selectedTier] : null;

  // 全国概览
  const renderOverview = () => (
    <div className="space-y-6">
      {/* 监测说明 */}
      <section className="animate-fade-in-up">
        <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">竞品价格监测</h3>
              <p className="text-white/70 text-sm">监测竞品价格动态</p>
              <p className="text-white/50 text-xs mt-1">监测平台：携程、抖音、直客通</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/60 text-xs mb-1">监测竞品</p>
                <p className="text-2xl font-bold">5,000+</p>
                <p className="text-white/50 text-xs">家门店</p>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white/60 text-xs mb-1">覆盖城市</p>
                <p className="text-2xl font-bold">{competitorPriceData.cities.length}+</p>
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

      {/* 按城市查看 */}
      <section className="animate-fade-in-up delay-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">🏙️ 各城市竞品价格</h3>
          <span className="text-xs text-slate-500">点击查看详情</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {competitorPriceData.cities.map((city) => (
            <Card 
              key={city.city}
              className="cursor-pointer hover:ring-2 hover:ring-ihg-navy transition-all"
              onClick={() => {
                setSelectedCity(city.city);
                setViewLevel('city');
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-slate-400" />
                <span className="font-semibold text-slate-800">{city.city}</span>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">¥{city.avgPrice}</div>
              <div className="flex items-center justify-between">
                <span className={clsx(
                  'text-sm font-medium',
                  city.change.startsWith('+') ? 'text-red-600' : 'text-emerald-600'
                )}>
                  {city.change}
                </span>
                <span className="text-xs text-slate-400">{city.region}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 按档次查看 */}
      <section className="animate-fade-in-up delay-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📊 各档次竞品均价</h3>
          <span className="text-xs text-slate-500">基础房型 · 标准大床房</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {(Object.entries(competitorPriceData.byTier) as [BrandTier, typeof competitorPriceData.byTier.luxury_lifestyle][]).map(([tier, data]) => (
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
              <div className="text-2xl font-bold text-slate-800 mb-2">¥{data.avgPrice}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{data.competitors.length} 个竞品集团</span>
                <span className={clsx(
                  'font-medium',
                  data.change.startsWith('+') ? 'text-red-600' : 'text-emerald-600'
                )}>{data.change}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 竞品价格趋势 */}
      <section className="animate-fade-in-up delay-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📈 竞品价格趋势</h3>
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
              <Line type="monotone" dataKey="万豪" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              <Line type="monotone" dataKey="希尔顿" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              <Line type="monotone" dataKey="雅高" stroke="#6b7280" strokeWidth={2} dot={{ fill: '#6b7280' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* 竞品券类动态 */}
      <section className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Tag size={18} />
              竞品券类产品动态
            </h3>
            <p className="text-xs text-slate-500 mt-1">点击查看服务明细</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {competitorVouchers.map((voucher, idx) => (
            <Card 
              key={idx} 
              className={clsx(
                'bg-slate-50 cursor-pointer transition-all',
                expandedVoucher === idx && 'ring-2 ring-ihg-navy'
              )}
              onClick={() => setExpandedVoucher(expandedVoucher === idx ? null : idx)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">{voucher.group}</span>
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'text-xs px-1.5 py-0.5 rounded',
                    voucher.status === '热销' ? 'bg-red-100 text-red-600' :
                    voucher.status === '新上架' ? 'bg-blue-100 text-blue-600' :
                    voucher.status === '促销中' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-200 text-slate-600'
                  )}>{voucher.status}</span>
                  {expandedVoucher === idx ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-800 mb-2">{voucher.product}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-700">¥{voucher.price}</span>
                <span className="text-xs text-slate-400">{voucher.platform}</span>
              </div>
              
              {/* 服务明细展开 */}
              {expandedVoucher === idx && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">📦 套餐包含</p>
                  <div className="flex flex-wrap gap-1">
                    {voucher.includes.map((item, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white text-slate-600 rounded border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 竞品促销动态 */}
      <section className="animate-fade-in-up delay-250">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800">📰 竞品促销动态</h3>
        </div>
        <Card padding="none">
          <div className="divide-y divide-slate-100">
            {priceData.competitorPromos.map((promo, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {promo.competitor.slice(0, 1)}
                  </div>
                  <div>
                    <span className="font-medium text-slate-800">{promo.competitor}</span>
                    <span className="text-slate-600 ml-2">{promo.campaign}</span>
                    <span className="text-amber-600 font-bold ml-2">{promo.discount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-700">{promo.dates}</div>
                  <div className="text-xs text-slate-500">{promo.channels.join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );

  // 城市视图
  const renderCityView = () => {
    if (!cityData) return null;
    return (
      <div className="space-y-6">
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} />
                  <h3 className="text-xl font-semibold">{cityData.city}</h3>
                  <span className="text-white/60 text-sm">({cityData.region})</span>
                </div>
                <p className="text-white/70 text-sm">竞品价格监测</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">竞品均价</p>
                <p className="text-3xl font-bold">¥{cityData.avgPrice}</p>
                <p className={clsx(
                  'text-sm mt-1',
                  cityData.change.startsWith('+') ? 'text-red-300' : 'text-emerald-300'
                )}>{cityData.change} vs 上月</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="animate-fade-in-up delay-50">
          <h3 className="text-base font-semibold text-slate-800 mb-4">📊 各竞品集团价格</h3>
          <div className="grid grid-cols-4 gap-4">
            {cityData.competitors.map((comp) => (
              <Card key={comp.group}>
                <div className="text-sm font-medium text-slate-600 mb-2">{comp.group}</div>
                <div className="text-2xl font-bold text-slate-800 mb-2">¥{comp.avgPrice}</div>
                <div className="text-xs text-slate-500">{comp.hotels} 家门店</div>
              </Card>
            ))}
          </div>
        </section>

        <section className="animate-fade-in-up delay-100">
          <h3 className="text-base font-semibold text-slate-800 mb-4">🏨 样本酒店价格</h3>
          <Card padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left p-3 font-medium text-slate-500">酒店名称</th>
                  <th className="text-left p-3 font-medium text-slate-500">集团</th>
                  <th className="text-center p-3 font-medium text-slate-500">档次</th>
                  <th className="text-center p-3 font-medium text-slate-500">携程</th>
                  <th className="text-center p-3 font-medium text-slate-500">抖音</th>
                  <th className="text-center p-3 font-medium text-slate-500">直客通</th>
                </tr>
              </thead>
              <tbody>
                {competitorPriceData.hotelSamples.filter(h => h.city === cityData.city).map((hotel, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-slate-400" />
                        <span className="font-medium text-slate-800">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{hotel.group}</td>
                    <td className="p-3 text-center">
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: `${brandTiers[hotel.tier].color}20`,
                          color: brandTiers[hotel.tier].color 
                        }}
                      >
                        {brandTiers[hotel.tier].name}
                      </span>
                    </td>
                    <td className="text-center p-3 font-medium text-slate-800">¥{hotel.channels.ctrip}</td>
                    <td className="text-center p-3 text-slate-600">¥{hotel.channels.douyin}</td>
                    <td className="text-center p-3 text-slate-600">¥{hotel.channels.zhiketong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    );
  };

  // 档次视图
  const renderTierView = () => {
    if (!tierData || !selectedTier) return null;
    return (
      <div className="space-y-6">
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brandTiers[selectedTier].color }} />
                  <h3 className="text-xl font-semibold">{brandTiers[selectedTier].name}</h3>
                </div>
                <p className="text-white/70 text-sm">竞品价格监测</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">竞品均价</p>
                <p className="text-3xl font-bold">¥{tierData.avgPrice}</p>
                <p className={clsx(
                  'text-sm mt-1',
                  tierData.change.startsWith('+') ? 'text-red-300' : 'text-emerald-300'
                )}>{tierData.change} vs 上月</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="animate-fade-in-up delay-50">
          <h3 className="text-base font-semibold text-slate-800 mb-4">📊 各竞品集团价格</h3>
          <div className="grid grid-cols-2 gap-4">
            {tierData.competitors.map((comp) => (
              <Card key={comp.group}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-800">{comp.group}</span>
                  <span className="text-2xl font-bold text-slate-800">¥{comp.avgPrice}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {comp.brands.map(brand => (
                    <span key={brand} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      {brand}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="animate-fade-in-up delay-100">
          <h3 className="text-base font-semibold text-slate-800 mb-4">🏨 样本酒店价格</h3>
          <Card padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left p-3 font-medium text-slate-500">酒店名称</th>
                  <th className="text-left p-3 font-medium text-slate-500">集团</th>
                  <th className="text-left p-3 font-medium text-slate-500">城市</th>
                  <th className="text-center p-3 font-medium text-slate-500">携程</th>
                  <th className="text-center p-3 font-medium text-slate-500">抖音</th>
                  <th className="text-center p-3 font-medium text-slate-500">直客通</th>
                </tr>
              </thead>
              <tbody>
                {competitorPriceData.hotelSamples.filter(h => h.tier === selectedTier).map((hotel, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Building size={14} className="text-slate-400" />
                        <span className="font-medium text-slate-800">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{hotel.group}</td>
                    <td className="p-3 text-slate-500">{hotel.city}</td>
                    <td className="text-center p-3 font-medium text-slate-800">¥{hotel.channels.ctrip}</td>
                    <td className="text-center p-3 text-slate-600">¥{hotel.channels.douyin}</td>
                    <td className="text-center p-3 text-slate-600">¥{hotel.channels.zhiketong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    );
  };

  return (
    <Layout title="Price Monitoring" subtitle="竞品价格监测：城市 × 档次 × 单店" requiredModule="price">
      <div>
        {/* 返回按钮 */}
        {viewLevel !== 'overview' && (
          <button
            onClick={() => {
              setViewLevel('overview');
              setSelectedCity(null);
              setSelectedTier(null);
            }}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-ihg-navy mb-4"
          >
            <ChevronDown size={16} className="rotate-90" />
            返回概览
          </button>
        )}

        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button 
            onClick={() => { setViewLevel('overview'); setSelectedCity(null); setSelectedTier(null); }}
            className={clsx(viewLevel === 'overview' ? 'text-ihg-navy font-medium' : 'text-slate-500 hover:text-ihg-navy')}
          >
            竞品价格概览
          </button>
          {selectedCity && (
            <>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-ihg-navy font-medium">{selectedCity}</span>
            </>
          )}
          {selectedTier && (
            <>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-ihg-navy font-medium">{brandTiers[selectedTier].name}</span>
            </>
          )}
        </div>

        {viewLevel === 'overview' && renderOverview()}
        {viewLevel === 'city' && renderCityView()}
        {viewLevel === 'tier' && renderTierView()}
      </div>
    </Layout>
  );
}
