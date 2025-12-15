import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { priceData, brandTiers, BrandTier } from '../data/mockData';
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import clsx from 'clsx';

export function PriceMonitoring() {
  const [expandedVoucher, setExpandedVoucher] = useState<number | null>(null);

  return (
    <Layout title="Price Monitoring" subtitle="价格动态监测：基础房型、渠道价差、券类产品" requiredModule="price">
      <div className="space-y-6">
        
        {/* 监测说明 */}
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">价格监测覆盖</h3>
                <p className="text-white/70 text-sm">监测平台：携程、抖音、直客通</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center px-6 py-3 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">📦 基础房型</p>
                  <p className="text-2xl font-bold">13,000+</p>
                  <p className="text-white/50 text-xs">IHG + 竞品门店</p>
                </div>
                <div className="text-center px-6 py-3 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">🎫 券类产品</p>
                  <p className="text-2xl font-bold">动态监测</p>
                  <p className="text-white/50 text-xs">各渠道在售产品</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 区域价格动态 */}
        <section className="animate-fade-in-up delay-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📊 区域价格动态</h3>
            <span className="text-xs text-slate-500">基础房型 · 标准大床房</span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {priceData.regions.map((region) => (
              <Card key={region.name} padding="sm">
                <div className="text-sm text-slate-500 mb-1">{region.name}</div>
                <div className="text-2xl font-bold text-slate-800">¥{region.avgPrice}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={clsx(
                    'text-sm font-medium',
                    region.change.startsWith('+') ? 'text-emerald-600' : 
                    region.change.startsWith('-') ? 'text-red-600' : 'text-slate-500'
                  )}>
                    {region.change}
                  </span>
                  <span className="text-xs text-slate-400">促销率 {region.promoRate}%</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 基础房型同档次竞品对比 */}
        <section className="animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">💰 基础房型价格</h3>
              <p className="text-xs text-slate-500 mt-1">同档次竞品对比（标准大床房）</p>
            </div>
          </div>
          <Card padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left p-4 font-medium text-slate-500">品牌档次</th>
                  <th className="text-center p-4 font-medium text-slate-500">IHG 均价</th>
                  <th className="text-center p-4 font-medium text-slate-500">同档竞品均价</th>
                  <th className="text-center p-4 font-medium text-slate-500">价差</th>
                  <th className="text-left p-4 font-medium text-slate-500">对标竞品</th>
                </tr>
              </thead>
              <tbody>
                {(Object.entries(priceData.tierPricing) as [BrandTier, typeof priceData.tierPricing.luxury_lifestyle][]).map(([tier, data]) => {
                  const competitorBrands: Record<BrandTier, string> = {
                    luxury_lifestyle: '万豪酒店、柏悦、康莱德',
                    premium: '万怡酒店、希尔顿花园',
                    essentials: 'Hampton、宜必思',
                    suites: '万豪行政公寓'
                  };
                  return (
                    <tr key={tier} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                          <span className="font-medium text-slate-800">{brandTiers[tier].name}</span>
                        </div>
                      </td>
                      <td className="text-center p-4 font-bold text-slate-800">¥{data.ihg}</td>
                      <td className="text-center p-4 text-slate-600">¥{data.competitor}</td>
                      <td className="text-center p-4 font-medium text-slate-700">{data.diff}</td>
                      <td className="p-4 text-xs text-slate-500">{competitorBrands[tier]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </section>

        {/* 价格趋势 */}
        <section className="animate-fade-in-up delay-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📈 价格趋势</h3>
            <span className="text-sm text-slate-500">近30天 · 中端品牌均价</span>
          </div>
          <Card>
            <ResponsiveContainer width="100%" height={300}>
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

        {/* 渠道价差 */}
        <section className="animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📱 渠道价差</h3>
            <span className="text-xs text-slate-500">基础房型 · 同档竞品</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {priceData.channelAlerts.map((alert) => (
              <Card key={alert.channel}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg',
                    alert.channel === '抖音' ? 'bg-pink-100 text-pink-700' :
                    alert.channel === '携程' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>
                    {alert.channel.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{alert.channel}</div>
                    <div className="text-xs text-slate-500">vs {alert.competitor}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-2 bg-ihg-navy/5 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">IHG</div>
                    <div className="text-lg font-bold text-ihg-navy">¥{alert.ourPrice}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-100 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">{alert.competitor}</div>
                    <div className="text-lg font-bold text-slate-700">¥{alert.competitorPrice}</div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-slate-600">价差</span>
                  <span className="text-lg font-bold text-slate-800 ml-2">{alert.diff}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 券类产品动态监测 */}
        <section className="animate-fade-in-up delay-250">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Tag size={18} />
                券类产品动态
              </h3>
              <p className="text-xs text-slate-500 mt-1">仅做动态监测，不做跨品牌对比（服务内容差异大）</p>
            </div>
          </div>
          
          {/* IHG 券类产品 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-ihg-navy" />
              <span className="text-sm font-medium text-slate-700">IHG 在售券类</span>
              <Badge>{priceData.voucherProducts.length} 个产品</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
            {priceData.voucherProducts.map((voucher, idx) => (
              <Card 
                key={idx} 
                className={clsx(
                  'cursor-pointer transition-all',
                  expandedVoucher === idx && 'ring-2 ring-ihg-navy'
                )}
                onClick={() => setExpandedVoucher(expandedVoucher === idx ? null : idx)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={clsx(
                    'px-2 py-1 rounded text-xs font-medium',
                    voucher.platform === '抖音' ? 'bg-pink-100 text-pink-700' :
                    voucher.platform === '携程' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  )}>
                    {voucher.platform}
                  </div>
                  {expandedVoucher === idx ? (
                    <ChevronDown size={16} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={16} className="text-slate-400" />
                  )}
                </div>
                
                <h4 className="font-semibold text-slate-800 mb-2">{voucher.name}</h4>
                
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold text-ihg-navy">¥{voucher.salePrice}</span>
                  <span className="text-sm text-slate-400 line-through">¥{voucher.originalPrice}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>有效期至 {voucher.validity}</span>
                  <span>已售 {voucher.salesVolume.toLocaleString()}</span>
                </div>

                {/* 展开的服务明细 */}
                {expandedVoucher === idx && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in-up">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">📦 套餐包含</h5>
                    <div className="space-y-2">
                      {voucher.includes.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{item.item}</span>
                          <span className="text-slate-500">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
            </div>
          </div>

          {/* 竞品券类动态监测 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
              <span className="text-sm font-medium text-slate-700">竞品券类动态</span>
            </div>
            <Card className="bg-slate-50" padding="sm">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { brand: '万豪', product: '双人周末套餐', price: 828, platform: '抖音', status: '在售' },
                  { brand: '希尔顿', product: '商务住宿券', price: 568, platform: '携程', status: '在售' },
                  { brand: '雅高', product: '圣诞特惠套餐', price: 698, platform: '飞猪', status: '在售' },
                  { brand: '凯悦', product: '亲子度假券', price: 1188, platform: '抖音', status: '新上架' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600">{item.brand}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 mb-1">{item.product}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-slate-700">¥{item.price}</span>
                      <span className="text-xs text-slate-400">{item.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* 竞品促销动态 */}
        <section className="animate-fade-in-up delay-300">
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
                      <span className="text-ihg-gold font-bold ml-2">{promo.discount}</span>
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
    </Layout>
  );
}
