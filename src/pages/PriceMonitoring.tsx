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
    <Layout title="Price Monitoring" subtitle="价格深度分析：区域定价、渠道价差、券类产品、竞对促销" requiredModule="price">
      <div className="space-y-6">
        {/* 区域价格洞察 */}
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📊 区域价格洞察</h3>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {priceData.regions.map((region, idx) => (
              <Card key={region.name} className={idx === 0 ? 'ring-2 ring-ihg-navy' : ''} padding="sm">
                <div className="text-sm text-slate-500 mb-1">{region.name}</div>
                <div className="text-2xl font-bold text-slate-800">¥{region.avgPrice}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={clsx(
                    'text-sm',
                    region.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  )}>
                    {region.change}
                  </span>
                  <span className="text-xs text-slate-400">促销率 {region.promoRate}%</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 品牌类型定价对比 */}
        <section className="animate-fade-in-up delay-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">💰 品牌类型定价 vs 竞品</h3>
          </div>
          <Card padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 font-medium text-slate-500">品牌类型</th>
                  <th className="text-center p-4 font-medium text-slate-500">IHG 均价</th>
                  <th className="text-center p-4 font-medium text-slate-500">竞品均价</th>
                  <th className="text-center p-4 font-medium text-slate-500">价差</th>
                  <th className="text-center p-4 font-medium text-slate-500">状态</th>
                </tr>
              </thead>
              <tbody>
                {(Object.entries(priceData.tierPricing) as [BrandTier, typeof priceData.tierPricing.luxury_lifestyle][]).map(([tier, data]) => (
                  <tr key={tier} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brandTiers[tier].color }} />
                        <span className="font-medium text-slate-800">{brandTiers[tier].name}</span>
                      </div>
                    </td>
                    <td className="text-center p-4 font-bold text-slate-800">¥{data.ihg}</td>
                    <td className="text-center p-4 text-slate-600">¥{data.competitor}</td>
                    <td className="text-center p-4">
                      <span className={clsx(
                        'font-medium',
                        data.status === 'good' ? 'text-emerald-600' : data.status === 'warning' ? 'text-amber-600' : 'text-slate-600'
                      )}>
                        {data.diff}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      {data.status === 'good' ? (
                        <Badge variant="success">有竞争力</Badge>
                      ) : data.status === 'warning' ? (
                        <Badge variant="warning">偏高</Badge>
                      ) : (
                        <Badge variant="info">持平</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        {/* 价格趋势对比 */}
        <section className="animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📈 价格趋势对比</h3>
            <span className="text-sm text-slate-500">近30天中端品牌均价</span>
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

        {/* 渠道价差分析 */}
        <section className="animate-fade-in-up delay-150">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">🚨 渠道价差预警</h3>
          </div>
          <div className="space-y-3">
            {priceData.channelAlerts.map((alert) => (
              <Card key={alert.channel} className="border-l-4 border-l-red-500" padding="sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      'w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg',
                      alert.urgency === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    )}>
                      {alert.channel.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{alert.channel}渠道</span>
                        <Badge variant={alert.urgency === 'high' ? 'danger' : 'warning'}>
                          {alert.urgency === 'high' ? '高优先' : '关注'}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-500">
                        IHG ¥{alert.ourPrice} vs {alert.competitor} ¥{alert.competitorPrice}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{alert.diff}</div>
                      <div className="text-xs text-slate-500">高于竞对</div>
                    </div>
                    <button className="px-6 py-2 bg-ihg-navy text-white rounded-lg hover:bg-ihg-navy-light">
                      调整价格
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 券类产品监测 */}
        <section className="animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Tag size={18} />
              券类产品监测
            </h3>
            <span className="text-sm text-slate-500">点击查看服务明细</span>
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
                  <div className="flex items-center gap-2">
                    <div className={clsx(
                      'px-2 py-1 rounded text-xs font-medium',
                      voucher.platform === '抖音' ? 'bg-pink-100 text-pink-700' :
                      voucher.platform === '携程' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      {voucher.platform}
                    </div>
                  </div>
                  {expandedVoucher === idx ? (
                    <ChevronDown size={16} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={16} className="text-slate-400" />
                  )}
                </div>
                
                <h4 className="font-semibold text-slate-800 mb-2">{voucher.name}</h4>
                
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold text-red-600">¥{voucher.salePrice}</span>
                  <span className="text-sm text-slate-400 line-through">¥{voucher.originalPrice}</span>
                  <span className="text-xs text-red-500 font-medium">
                    {Math.round((1 - voucher.salePrice / voucher.originalPrice) * 100)}% OFF
                  </span>
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
        </section>

        {/* 竞对促销追踪 */}
        <section className="animate-fade-in-up delay-250">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">⚠️ 竞对促销追踪</h3>
            <Badge variant="danger">
              {priceData.competitorPromos.filter(p => p.threat === 'high').length} 个高威胁
            </Badge>
          </div>
          <Card padding="none">
            <div className="divide-y divide-slate-100">
              {priceData.competitorPromos.map((promo, idx) => (
                <div key={idx} className={clsx(
                  'flex items-center justify-between p-4',
                  promo.threat === 'high' && 'bg-red-50/50'
                )}>
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      'w-12 h-12 rounded-xl flex items-center justify-center font-bold',
                      promo.threat === 'high' ? 'bg-red-100 text-red-600' :
                      promo.threat === 'medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-600'
                    )}>
                      {promo.competitor.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{promo.competitor}</span>
                        <Badge variant={promo.threat === 'high' ? 'danger' : promo.threat === 'medium' ? 'warning' : 'info'}>
                          {promo.threat === 'high' ? '高威胁' : promo.threat === 'medium' ? '中威胁' : '关注'}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        {promo.campaign} · <span className="text-ihg-gold font-bold">{promo.discount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-700">{promo.dates}</div>
                      <div className="text-xs text-slate-500">{promo.channels.join(' · ')}</div>
                    </div>
                    {promo.threat === 'high' && (
                      <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                        应对方案
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* 性价比分析 */}
        <section className="animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">📊 性价比指数</h3>
            <span className="text-sm text-slate-500">价值感知 / 价格 = 性价比指数</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { brand: 'IHG', index: 1.12, label: '高性价比', color: '#003B6F' },
              { brand: '万豪', index: 1.05, label: '匹配', color: '#8b5cf6' },
              { brand: '希尔顿', index: 0.92, label: '溢价', color: '#f59e0b' },
              { brand: '雅高', index: 1.18, label: '高性价比', color: '#6b7280' },
            ].map((item, idx) => (
              <Card key={item.brand} className={idx === 0 ? 'ring-2 ring-ihg-navy' : ''}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-slate-800">{item.brand}</span>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{item.index}</div>
                <div className={clsx(
                  'text-sm',
                  item.index >= 1.1 ? 'text-emerald-600' : item.index >= 1 ? 'text-slate-600' : 'text-amber-600'
                )}>
                  {item.label}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
