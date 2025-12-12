import { Layout } from '../components/Layout';
import { Card, CardHeader, Badge } from '../components/ui';
import { priceData } from '../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

export function PriceMonitoring() {
  const brandPriceChartData = ['高端', '中端', '经济型'].map((type) => ({
    type,
    'IHG洲际': priceData.brandPricing[type as keyof typeof priceData.brandPricing][0],
    '万豪国际': priceData.brandPricing[type as keyof typeof priceData.brandPricing][1],
    '希尔顿': priceData.brandPricing[type as keyof typeof priceData.brandPricing][2],
    '雅高集团': priceData.brandPricing[type as keyof typeof priceData.brandPricing][3],
  }));

  const minPlatformPrice = Math.min(...priceData.platformPrices.platforms.map(p => p.discounted));

  return (
    <Layout title="Price Monitor" subtitle="价格监测 · 携程 / 抖音 / 直客通" requiredModule="price">
      
      {/* 核心价格指标 */}
      <section className="mb-8 animate-fade-in-up">
        <div className="grid grid-cols-5 gap-4">
          {priceData.regions.map((region) => {
            const isUp = region.change.startsWith('+');
            return (
              <div 
                key={region.name}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:border-ihg-navy/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">{region.name}</span>
                  <div className={clsx(
                    'flex items-center gap-0.5 text-xs font-semibold',
                    isUp ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {region.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 group-hover:text-ihg-navy transition-colors">
                  ¥{region.avgPrice}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">促销活动占比</span>
                    <span className="font-medium text-ihg-gold">{region.promoRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 价格趋势 + 品牌对比 */}
      <section className="grid grid-cols-3 gap-6 mb-8">
        {/* 价格趋势 */}
        <div className="col-span-2 animate-fade-in-up delay-100">
          <Card>
            <CardHeader 
              title="📊 价格趋势追踪" 
              subtitle="近30天中端酒店均价变化"
            />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData.trendData}>
                  <defs>
                    <linearGradient id="colorIHG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#003B6F" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#003B6F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[450, 750]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} 
                    formatter={(value: number) => [`¥${value}`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="IHG洲际" stroke="#003B6F" strokeWidth={2} fillOpacity={1} fill="url(#colorIHG)" />
                  <Line type="monotone" dataKey="万豪国际" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="希尔顿" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="雅高集团" stroke="#94a3b8" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Value Index */}
        <div className="animate-fade-in-up delay-100">
          <Card className="h-full">
            <CardHeader 
              title="💎 性价比指数" 
              subtitle="体验分 / 价格指数"
            />
            <div className="space-y-4">
              {priceData.valueIndex.map((item) => {
                const isGood = item.value_index >= 1.1;
                const isNormal = item.value_index >= 1 && item.value_index < 1.1;
                return (
                  <div 
                    key={item.brand}
                    className={clsx(
                      'p-4 rounded-xl border-2 transition-all',
                      item.brand === 'IHG洲际' ? 'border-ihg-navy bg-ihg-navy/5' : 'border-slate-100'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={clsx(
                        'font-medium',
                        item.brand === 'IHG洲际' ? 'text-ihg-navy' : 'text-slate-700'
                      )}>{item.brand}</span>
                      <span className={clsx(
                        'text-2xl font-bold',
                        isGood ? 'text-emerald-600' : isNormal ? 'text-slate-600' : 'text-amber-600'
                      )}>
                        {item.value_index.toFixed(2)}
                      </span>
                    </div>
                    <Badge variant={isGood ? 'success' : isNormal ? 'info' : 'warning'}>
                      {item.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* 多平台价差 + 竞对促销 */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        {/* 多平台价差 */}
        <div className="animate-fade-in-up delay-200">
          <Card>
            <CardHeader 
              title="🔍 多平台价差监测" 
              subtitle={priceData.platformPrices.hotel}
              action={<Badge variant="info">{priceData.platformPrices.roomType}</Badge>}
            />
            <div className="space-y-3">
              {priceData.platformPrices.platforms.map((platform) => {
                const isLowest = platform.discounted === minPlatformPrice;
                const diff = platform.discounted - minPlatformPrice;
                const diffPercent = ((diff / minPlatformPrice) * 100).toFixed(1);
                
                return (
                  <div 
                    key={platform.name}
                    className={clsx(
                      'p-4 rounded-xl border-2 flex items-center justify-between transition-all',
                      isLowest ? 'border-emerald-300 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        'w-12 h-12 rounded-xl flex items-center justify-center font-bold',
                        isLowest ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                      )}>
                        {platform.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{platform.name}</div>
                        <div className="text-sm text-slate-500">{platform.benefit}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 line-through text-sm">¥{platform.price}</span>
                        <span className={clsx(
                          'text-xl font-bold',
                          isLowest ? 'text-emerald-600' : 'text-slate-800'
                        )}>¥{platform.discounted}</span>
                      </div>
                      {!isLowest && diff > 0 && (
                        <div className="text-xs text-amber-600 mt-1 flex items-center justify-end gap-1">
                          <AlertTriangle size={12} />
                          高于最低价 {diffPercent}%
                        </div>
                      )}
                      {isLowest && (
                        <div className="text-xs text-emerald-600 mt-1">
                          ✓ 当前最低价
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* 竞对促销 */}
        <div className="animate-fade-in-up delay-200">
          <Card>
            <CardHeader 
              title="🎯 竞对促销追踪" 
              subtitle="近期竞品促销活动"
              action={<Badge variant="danger">{priceData.competitorPromos.filter(p => p.threat === 'high').length} 个高威胁</Badge>}
            />
            <div className="space-y-4">
              {priceData.competitorPromos.map((promo, idx) => (
                <div 
                  key={idx}
                  className={clsx(
                    'p-4 rounded-xl border-l-4 bg-slate-50',
                    promo.threat === 'high' ? 'border-l-red-500' : 
                    promo.threat === 'medium' ? 'border-l-amber-500' : 'border-l-slate-300'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{promo.competitor}</span>
                        <span className="text-ihg-gold font-bold">{promo.discount}</span>
                      </div>
                      <div className="text-sm text-slate-500">{promo.campaign}</div>
                    </div>
                    <Badge 
                      variant={promo.threat === 'high' ? 'danger' : promo.threat === 'medium' ? 'warning' : 'info'}
                    >
                      {promo.threat === 'high' ? '高威胁' : promo.threat === 'medium' ? '中威胁' : '低威胁'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {promo.startDate} ~ {promo.endDate}
                    </div>
                    <div className="flex gap-1.5">
                      {promo.channels.map(ch => (
                        <span key={ch} className="px-2 py-0.5 bg-white rounded text-slate-600">{ch}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* 品牌价格定位 */}
      <section className="animate-fade-in-up delay-300">
        <Card>
          <CardHeader 
            title="📈 品牌价格定位" 
            subtitle="按酒店类型对比各集团定价策略"
          />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandPriceChartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `¥${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} 
                  formatter={(value: number) => [`¥${value}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="IHG洲际" fill="#003B6F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="万豪国际" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="希尔顿" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="雅高集团" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </Layout>
  );
}
