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
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Tag } from 'lucide-react';
import clsx from 'clsx';

export function PriceMonitoring() {
  // 转换品牌价格数据为图表格式
  const brandPriceChartData = ['高端', '中端', '经济型'].map((type) => ({
    type,
    本品牌: priceData.brandPricing[type as keyof typeof priceData.brandPricing][0],
    竞对A: priceData.brandPricing[type as keyof typeof priceData.brandPricing][1],
    竞对B: priceData.brandPricing[type as keyof typeof priceData.brandPricing][2],
    竞对C: priceData.brandPricing[type as keyof typeof priceData.brandPricing][3],
  }));

  return (
    <Layout title="Price Monitoring" subtitle="价格监测 · 区域 × 品牌 × 竞对洞察">
      {/* 区域价格概览 */}
      <section className="mb-8 animate-fade-in">
        <h2 className="text-lg font-semibold text-white mb-4">区域价格概览</h2>
        <div className="grid grid-cols-5 gap-4">
          {priceData.regions.map((region) => (
            <Card key={region.name} hover className="cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-400">{region.name}</span>
                <span
                  className={clsx(
                    'text-xs font-medium',
                    region.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {region.change.startsWith('+') ? (
                    <TrendingUp size={12} className="inline mr-1" />
                  ) : (
                    <TrendingDown size={12} className="inline mr-1" />
                  )}
                  {region.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">¥{region.avgPrice}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">促销占比</span>
                <span className="text-brand-gold">{region.promoRate}%</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 品牌价格对比 + 价格趋势 */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        {/* 品牌价格对比 */}
        <Card className="animate-fade-in-delay-1">
          <CardHeader title="品牌价格对比" subtitle="按酒店类型分组" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandPriceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="type" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid #1e1e2e',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`¥${value}`, '']}
                />
                <Legend />
                <Bar dataKey="本品牌" fill="#0066FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="竞对A" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="竞对B" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="竞对C" fill="#6b7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 价格趋势 */}
        <Card className="animate-fade-in-delay-1">
          <CardHeader title="价格趋势" subtitle="近30天均价变化" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis domain={[350, 550]} stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12121a',
                    border: '1px solid #1e1e2e',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`¥${value}`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="本品牌" stroke="#0066FF" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="竞对A" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="竞对B" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="竞对C" stroke="#6b7280" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Value Index + 多平台价差 */}
      <section className="grid grid-cols-2 gap-6 mb-8">
        {/* Value Index */}
        <Card className="animate-fade-in-delay-2">
          <CardHeader title="体验-价格匹配度" subtitle="Value Index (体验分/价格指数)" />
          <div className="space-y-4">
            {priceData.valueIndex.map((item) => (
              <div
                key={item.brand}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-bg/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'w-3 h-3 rounded-full',
                      item.brand === '本品牌' ? 'bg-brand-blue' : 'bg-zinc-600'
                    )}
                  />
                  <span className="text-sm text-zinc-200">{item.brand}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      'text-lg font-bold',
                      item.value_index >= 1.1
                        ? 'text-emerald-400'
                        : item.value_index >= 1
                        ? 'text-zinc-300'
                        : 'text-amber-400'
                    )}
                  >
                    {item.value_index.toFixed(2)}
                  </span>
                  <Badge
                    variant={
                      item.value_index >= 1.1
                        ? 'success'
                        : item.value_index >= 1
                        ? 'neutral'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {item.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 多平台价差 */}
        <Card className="animate-fade-in-delay-2">
          <CardHeader
            title="多平台价差监测"
            subtitle={`${priceData.platformPrices.hotel} · ${priceData.platformPrices.roomType}`}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-2 text-zinc-500 font-medium">平台</th>
                  <th className="text-right py-2 text-zinc-500 font-medium">原价</th>
                  <th className="text-right py-2 text-zinc-500 font-medium">券后</th>
                  <th className="text-right py-2 text-zinc-500 font-medium">权益</th>
                </tr>
              </thead>
              <tbody>
                {priceData.platformPrices.platforms.map((platform) => {
                  const minPrice = Math.min(
                    ...priceData.platformPrices.platforms.map((p) => p.discounted)
                  );
                  const isLowest = platform.discounted === minPrice;
                  const priceDiff = platform.discounted - minPrice;

                  return (
                    <tr
                      key={platform.name}
                      className={clsx(
                        'border-b border-dark-border/50',
                        isLowest && 'bg-emerald-500/5'
                      )}
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-200">{platform.name}</span>
                          {isLowest && (
                            <Badge variant="success" size="sm">
                              最低
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-right text-zinc-400">¥{platform.price}</td>
                      <td className="text-right">
                        <span className={isLowest ? 'text-emerald-400 font-medium' : 'text-zinc-200'}>
                          ¥{platform.discounted}
                        </span>
                        {priceDiff > 0 && priceDiff / minPrice > 0.1 && (
                          <AlertTriangle size={12} className="inline ml-1 text-amber-400" />
                        )}
                      </td>
                      <td className="text-right text-xs text-zinc-500">{platform.benefit}</td>
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
        <Card>
          <CardHeader title="竞对促销监测" subtitle="近期促销活动追踪" />
          <div className="space-y-4">
            {priceData.competitorPromos.map((promo, idx) => (
              <div
                key={idx}
                className={clsx(
                  'p-4 rounded-lg border',
                  promo.threat === 'high'
                    ? 'bg-red-500/5 border-red-500/20'
                    : promo.threat === 'medium'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-dark-bg/50 border-dark-border'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        promo.threat === 'high'
                          ? 'bg-red-500/20'
                          : promo.threat === 'medium'
                          ? 'bg-amber-500/20'
                          : 'bg-zinc-700/50'
                      )}
                    >
                      <Tag
                        size={18}
                        className={clsx(
                          promo.threat === 'high'
                            ? 'text-red-400'
                            : promo.threat === 'medium'
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-zinc-200">{promo.competitor}</span>
                        <span className="text-brand-gold font-bold">{promo.discount}</span>
                        <Badge
                          variant={
                            promo.threat === 'high'
                              ? 'danger'
                              : promo.threat === 'medium'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {promo.threat === 'high' ? '高威胁' : promo.threat === 'medium' ? '中威胁' : '低威胁'}
                        </Badge>
                      </div>
                      <div className="text-sm text-zinc-400">{promo.campaign}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
                      <Calendar size={12} />
                      <span>
                        {promo.startDate} ~ {promo.endDate}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {promo.channels.map((channel) => (
                        <span
                          key={channel}
                          className="px-2 py-0.5 text-xs bg-dark-border text-zinc-400 rounded"
                        >
                          {channel}
                        </span>
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

