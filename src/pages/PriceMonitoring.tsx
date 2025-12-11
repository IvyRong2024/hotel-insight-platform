import { Layout } from '../components/Layout';
import { Card, CardHeader, Badge } from '../components/ui';
import { priceData, platformConfig } from '../data/mockData';
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
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Tag, Monitor } from 'lucide-react';
import clsx from 'clsx';

export function PriceMonitoring() {
  const brandPriceChartData = ['高端', '中端', '经济型'].map((type) => ({
    type,
    'IHG洲际': priceData.brandPricing[type as keyof typeof priceData.brandPricing][0],
    '万豪国际': priceData.brandPricing[type as keyof typeof priceData.brandPricing][1],
    '希尔顿': priceData.brandPricing[type as keyof typeof priceData.brandPricing][2],
    '雅高集团': priceData.brandPricing[type as keyof typeof priceData.brandPricing][3],
  }));

  return (
    <Layout title="Price Monitoring" subtitle="价格监测 · IHG vs 竞品定价分析">
      {/* 平台覆盖提示 */}
      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <Monitor size={14} />
        <span>数据来源：{platformConfig.price.platforms.join('、')} | 覆盖酒店 {platformConfig.price.coverage.hotels} 家</span>
      </div>

      {/* 区域价格概览 */}
      <section className="mb-5 animate-fade-in">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">区域价格概览</h2>
        <div className="grid grid-cols-5 gap-3">
          {priceData.regions.map((region) => (
            <Card key={region.name} hover padding="sm" className="cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{region.name}</span>
                <span className={clsx('text-[10px] font-medium flex items-center gap-0.5', region.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500')}>
                  {region.change.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {region.change}
                </span>
              </div>
              <div className="text-xl font-bold text-slate-800 mb-1">¥{region.avgPrice}</div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">促销占比</span>
                <span className="text-brand-gold">{region.promoRate}%</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 品牌价格对比 + 价格趋势 */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <Card padding="sm" className="animate-fade-in-delay-1">
          <CardHeader title="品牌价格对比" subtitle="按酒店类型分组" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandPriceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }} formatter={(value: number) => [`¥${value}`, '']} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="IHG洲际" fill="#0066FF" radius={[3, 3, 0, 0]} />
                <Bar dataKey="万豪国际" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="希尔顿" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="雅高集团" fill="#6b7280" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="sm" className="animate-fade-in-delay-1">
          <CardHeader title="价格趋势" subtitle="近30天均价变化（中端）" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[450, 750]} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }} formatter={(value: number) => [`¥${value}`, '']} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="IHG洲际" stroke="#0066FF" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="万豪国际" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="希尔顿" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="雅高集团" stroke="#6b7280" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Value Index + 多平台价差 */}
      <section className="grid grid-cols-2 gap-4 mb-5">
        <Card padding="sm" className="animate-fade-in-delay-2">
          <CardHeader title="体验-价格匹配度" subtitle="Value Index (体验分/价格指数)" />
          <div className="space-y-2">
            {priceData.valueIndex.map((item) => (
              <div key={item.brand} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className={clsx('w-2 h-2 rounded-full', item.brand === 'IHG洲际' ? 'bg-brand-blue' : 'bg-slate-400')} />
                  <span className="text-xs text-slate-700">{item.brand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx('text-sm font-bold', item.value_index >= 1.1 ? 'text-emerald-500' : item.value_index >= 1 ? 'text-slate-600' : 'text-amber-500')}>
                    {item.value_index.toFixed(2)}
                  </span>
                  <Badge variant={item.value_index >= 1.1 ? 'success' : item.value_index >= 1 ? 'neutral' : 'warning'} size="sm">
                    {item.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="sm" className="animate-fade-in-delay-2">
          <CardHeader title="多平台价差监测" subtitle={`${priceData.platformPrices.hotel} · ${priceData.platformPrices.roomType}`} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-slate-500 font-medium">平台</th>
                  <th className="text-right py-2 text-slate-500 font-medium">原价</th>
                  <th className="text-right py-2 text-slate-500 font-medium">券后</th>
                  <th className="text-right py-2 text-slate-500 font-medium">权益</th>
                </tr>
              </thead>
              <tbody>
                {priceData.platformPrices.platforms.map((platform) => {
                  const minPrice = Math.min(...priceData.platformPrices.platforms.map((p) => p.discounted));
                  const isLowest = platform.discounted === minPrice;
                  const priceDiff = platform.discounted - minPrice;

                  return (
                    <tr key={platform.name} className={clsx('border-b border-slate-100', isLowest && 'bg-emerald-50')}>
                      <td className="py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-700">{platform.name}</span>
                          {isLowest && <Badge variant="success" size="sm">最低</Badge>}
                        </div>
                      </td>
                      <td className="text-right text-slate-400">¥{platform.price}</td>
                      <td className="text-right">
                        <span className={isLowest ? 'text-emerald-600 font-medium' : 'text-slate-700'}>¥{platform.discounted}</span>
                        {priceDiff > 0 && priceDiff / minPrice > 0.1 && <AlertTriangle size={10} className="inline ml-1 text-amber-500" />}
                      </td>
                      <td className="text-right text-slate-400">{platform.benefit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 竞对促销监测 */}
      <section className="animate-fade-in-delay-3">
        <Card padding="sm">
          <CardHeader title="竞对促销监测" subtitle="近期促销活动追踪" />
          <div className="space-y-3">
            {priceData.competitorPromos.map((promo, idx) => (
              <div
                key={idx}
                className={clsx(
                  'p-3 rounded-lg border',
                  promo.threat === 'high' ? 'bg-red-50 border-red-200' : promo.threat === 'medium' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', promo.threat === 'high' ? 'bg-red-100' : promo.threat === 'medium' ? 'bg-amber-100' : 'bg-slate-200')}>
                      <Tag size={14} className={clsx(promo.threat === 'high' ? 'text-red-500' : promo.threat === 'medium' ? 'text-amber-500' : 'text-slate-500')} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-slate-700">{promo.competitor}</span>
                        <span className="text-brand-gold font-bold text-xs">{promo.discount}</span>
                        <Badge variant={promo.threat === 'high' ? 'danger' : promo.threat === 'medium' ? 'warning' : 'neutral'} size="sm">
                          {promo.threat === 'high' ? '高威胁' : promo.threat === 'medium' ? '中威胁' : '低威胁'}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-slate-500">{promo.campaign}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                      <Calendar size={10} />
                      <span>{promo.startDate} ~ {promo.endDate}</span>
                    </div>
                    <div className="flex gap-1">
                      {promo.channels.map((channel) => (
                        <span key={channel} className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 text-slate-500 rounded">{channel}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </Layout>
  );
}
