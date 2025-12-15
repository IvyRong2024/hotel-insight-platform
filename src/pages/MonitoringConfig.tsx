import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { brandTiers, BrandTier, platformConfig } from '../data/mockData';
import { Building, Users, Eye, Search, Check, Settings } from 'lucide-react';
import clsx from 'clsx';

type TabType = 'hotels' | 'benchmark' | 'permissions';

// 模拟监测酒店列表
const monitoredHotels = {
  ihg: [
    { id: 'ihg-1', name: '上海外滩英迪格酒店', brand: '英迪格', tier: 'luxury_lifestyle' as BrandTier, city: '上海', status: 'active' },
    { id: 'ihg-2', name: '上海浦东洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle' as BrandTier, city: '上海', status: 'active' },
    { id: 'ihg-3', name: '北京三里屯洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle' as BrandTier, city: '北京', status: 'active' },
    { id: 'ihg-4', name: '上海浦东皇冠假日酒店', brand: '皇冠假日', tier: 'premium' as BrandTier, city: '上海', status: 'active' },
    { id: 'ihg-5', name: '北京国贸皇冠假日酒店', brand: '皇冠假日', tier: 'premium' as BrandTier, city: '北京', status: 'active' },
    { id: 'ihg-6', name: '上海浦东假日酒店', brand: '假日酒店', tier: 'essentials' as BrandTier, city: '上海', status: 'active' },
    { id: 'ihg-7', name: '北京朝阳假日酒店', brand: '假日酒店', tier: 'essentials' as BrandTier, city: '北京', status: 'active' },
    { id: 'ihg-8', name: '上海虹桥智选假日酒店', brand: '智选假日', tier: 'essentials' as BrandTier, city: '上海', status: 'active' },
  ],
  competitors: [
    { id: 'comp-1', name: '上海外滩W酒店', brand: 'W酒店', group: '万豪国际', tier: 'luxury_lifestyle' as BrandTier, city: '上海', status: 'active' as const },
    { id: 'comp-2', name: '上海浦东丽思卡尔顿酒店', brand: '丽思卡尔顿', group: '万豪国际', tier: 'luxury_lifestyle' as BrandTier, city: '上海', status: 'active' as const },
    { id: 'comp-3', name: '北京国贸大酒店', brand: '香格里拉', group: '香格里拉', tier: 'luxury_lifestyle' as BrandTier, city: '北京', status: 'active' as const },
    { id: 'comp-4', name: '上海静安希尔顿酒店', brand: '希尔顿酒店', group: '希尔顿集团', tier: 'premium' as BrandTier, city: '上海', status: 'active' as const },
    { id: 'comp-5', name: '北京王府井希尔顿酒店', brand: '希尔顿酒店', group: '希尔顿集团', tier: 'premium' as BrandTier, city: '北京', status: 'active' as const },
    { id: 'comp-6', name: '上海虹桥万怡酒店', brand: '万怡酒店', group: '万豪国际', tier: 'essentials' as BrandTier, city: '上海', status: 'active' as const },
    { id: 'comp-7', name: '北京望京Hampton酒店', brand: 'Hampton', group: '希尔顿集团', tier: 'essentials' as BrandTier, city: '北京', status: 'active' as const },
  ],
};

// 品牌对标关系
const brandBenchmarks: Record<BrandTier, {
  ihgBrands: string[];
  competitorBrands: { group: string; brands: string[] }[];
}> = {
  luxury_lifestyle: {
    ihgBrands: ['洲际酒店', '丽晶', '六善', '金普顿', '英迪格'],
    competitorBrands: [
      { group: '万豪国际', brands: ['丽思卡尔顿', 'W酒店', '瑞吉', 'JW万豪'] },
      { group: '希尔顿集团', brands: ['华尔道夫', '康莱德'] },
      { group: '雅高集团', brands: ['莱佛士', '索菲特'] },
      { group: '凯悦集团', brands: ['柏悦', '安达仕'] },
    ],
  },
  premium: {
    ihgBrands: ['皇冠假日', 'voco', 'EVEN Hotels'],
    competitorBrands: [
      { group: '万豪国际', brands: ['万豪酒店', '喜来登', '威斯汀'] },
      { group: '希尔顿集团', brands: ['希尔顿酒店', '希尔顿逸林'] },
      { group: '雅高集团', brands: ['铂尔曼', '诺富特'] },
      { group: '凯悦集团', brands: ['君悦', '凯悦酒店'] },
    ],
  },
  essentials: {
    ihgBrands: ['假日酒店', '智选假日'],
    competitorBrands: [
      { group: '万豪国际', brands: ['万怡酒店', 'Fairfield'] },
      { group: '希尔顿集团', brands: ['希尔顿花园', 'Hampton'] },
      { group: '雅高集团', brands: ['美居酒店', '宜必思尚品'] },
      { group: '凯悦集团', brands: ['凯悦嘉轩', '凯悦嘉寓'] },
    ],
  },
  suites: {
    ihgBrands: ['馨乐庭', 'Atwell Suites'],
    competitorBrands: [
      { group: '万豪国际', brands: ['万豪行政公寓', 'Residence Inn'] },
      { group: '希尔顿集团', brands: ['Homewood Suites', 'Home2 Suites'] },
      { group: '雅高集团', brands: ['雅诗阁'] },
    ],
  },
};

// 用户权限矩阵
const permissionMatrix = [
  {
    role: '品牌运营',
    roleId: 'brand_ops',
    scope: '全国',
    modules: ['Brand View', 'Price Monitoring', 'Action Center'],
    focusMetrics: ['品牌健康指数', '承诺达成率', '竞品对比'],
    dataAccess: '全品牌、全区域汇总数据',
  },
  {
    role: '大区负责人',
    roleId: 'region_vp',
    scope: '管辖区域',
    modules: ['Overview', 'Hotel View', 'Action Center'],
    focusMetrics: ['区域排名', '品牌类型表现', '关注清单'],
    dataAccess: '区域内所有省份、城市、门店数据',
  },
  {
    role: '城市负责人',
    roleId: 'city_mgr',
    scope: '管辖城市',
    modules: ['Overview', 'Hotel View', 'Action Center'],
    focusMetrics: ['城市排名', '门店健康度', '竞品动态'],
    dataAccess: '城市内所有门店及同城竞品数据',
  },
  {
    role: '酒店店长',
    roleId: 'hotel_mgr',
    scope: '本店',
    modules: ['Overview', 'Hotel View', 'Action Center'],
    focusMetrics: ['门店评分', '用户需求', '评论详情'],
    dataAccess: '本店数据及同城对标酒店',
  },
  {
    role: '定价团队',
    roleId: 'revenue_mgr',
    scope: '全国/区域',
    modules: ['Overview', 'Price Monitoring'],
    focusMetrics: ['价格动态', '渠道价差', '券类产品'],
    dataAccess: '全国价格数据，按城市/品牌/门店穿透',
  },
];

export function MonitoringConfig() {
  const [activeTab, setActiveTab] = useState<TabType>('hotels');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<BrandTier | 'all'>('all');

  const tabs = [
    { id: 'hotels' as TabType, label: '监测酒店列表', icon: Building },
    { id: 'benchmark' as TabType, label: '品牌对标清单', icon: Settings },
    { id: 'permissions' as TabType, label: '用户权限矩阵', icon: Users },
  ];

  // 筛选酒店
  const filterHotels = (hotels: typeof monitoredHotels.ihg) => {
    return hotels.filter(h => {
      const matchSearch = h.name.includes(searchTerm) || h.brand.includes(searchTerm) || h.city.includes(searchTerm);
      const matchTier = filterTier === 'all' || h.tier === filterTier;
      return matchSearch && matchTier;
    });
  };

  return (
    <Layout title="Monitoring Config" subtitle="监测管理中心：酒店列表、品牌对标、权限矩阵" requiredModule="overview">
      <div className="space-y-6">
        {/* 平台概览 */}
        <section className="animate-fade-in-up">
          <Card className="bg-gradient-to-r from-ihg-navy to-ihg-navy-light text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">监测平台覆盖</h3>
                <div className="flex gap-6 text-sm text-white/70">
                  <span>评论监测：{platformConfig.review.platforms.join('、')}</span>
                  <span>价格监测：{platformConfig.price.platforms.join('、')}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">📝 评论监测</p>
                  <p className="text-2xl font-bold">{platformConfig.review.coverage.total}</p>
                  <p className="text-white/50 text-xs">IHG + 竞品</p>
                </div>
                <div className="text-center px-4 py-2 bg-white/10 rounded-xl">
                  <p className="text-white/60 text-xs mb-1">💰 价格监测</p>
                  <p className="text-2xl font-bold">{platformConfig.price.coverage.competitors}</p>
                  <p className="text-white/50 text-xs">仅竞品</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Tab 导航 */}
        <div className="flex gap-2 border-b border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-ihg-navy text-ihg-navy'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 监测酒店列表 */}
        {activeTab === 'hotels' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* 筛选栏 */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索酒店名称、品牌、城市..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ihg-navy/20"
                />
              </div>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as BrandTier | 'all')}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ihg-navy/20"
              >
                <option value="all">全部档次</option>
                {Object.entries(brandTiers).map(([key, tier]) => (
                  <option key={key} value={key}>{tier.name}</option>
                ))}
              </select>
            </div>

            {/* IHG 门店 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-ihg-navy" />
                  IHG 监测门店
                </h3>
                <Badge>{filterHotels(monitoredHotels.ihg).length} 家</Badge>
              </div>
              <Card padding="none">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left p-3 font-medium text-slate-500">酒店名称</th>
                      <th className="text-left p-3 font-medium text-slate-500">品牌</th>
                      <th className="text-left p-3 font-medium text-slate-500">档次</th>
                      <th className="text-left p-3 font-medium text-slate-500">城市</th>
                      <th className="text-center p-3 font-medium text-slate-500">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterHotels(monitoredHotels.ihg).map(hotel => (
                      <tr key={hotel.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-800">{hotel.name}</td>
                        <td className="p-3 text-slate-600">{hotel.brand}</td>
                        <td className="p-3">
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
                        <td className="p-3 text-slate-600">{hotel.city}</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <Check size={12} />
                            监测中
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* 竞品门店 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  竞品监测门店
                </h3>
                <Badge variant="info">{filterHotels(monitoredHotels.competitors).length} 家</Badge>
              </div>
              <Card padding="none">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left p-3 font-medium text-slate-500">酒店名称</th>
                      <th className="text-left p-3 font-medium text-slate-500">品牌</th>
                      <th className="text-left p-3 font-medium text-slate-500">集团</th>
                      <th className="text-left p-3 font-medium text-slate-500">对标档次</th>
                      <th className="text-left p-3 font-medium text-slate-500">城市</th>
                      <th className="text-center p-3 font-medium text-slate-500">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterHotels(monitoredHotels.competitors).map(hotel => (
                      <tr key={hotel.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-800">{hotel.name}</td>
                        <td className="p-3 text-slate-600">{hotel.brand}</td>
                        <td className="p-3 text-slate-500">{hotel.group}</td>
                        <td className="p-3">
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
                        <td className="p-3 text-slate-600">{hotel.city}</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <Check size={12} />
                            监测中
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        )}

        {/* 品牌对标清单 */}
        {activeTab === 'benchmark' && (
          <div className="space-y-6 animate-fade-in-up">
            <p className="text-sm text-slate-500">
              定义各品牌档次的竞品对标关系，确保同档次酒店之间进行公平对比
            </p>
            
            {(Object.entries(brandBenchmarks) as [BrandTier, typeof brandBenchmarks.luxury_lifestyle][]).map(([tier, data]) => (
              <Card key={tier}>
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: brandTiers[tier].color }}
                  />
                  <h3 className="text-lg font-semibold text-slate-800">{brandTiers[tier].name}</h3>
                  <span className="text-sm text-slate-500">({brandTiers[tier].nameEn})</span>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* IHG 品牌 */}
                  <div>
                    <h4 className="text-sm font-medium text-ihg-navy mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-ihg-navy" />
                      IHG 品牌
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.ihgBrands.map(brand => (
                        <span 
                          key={brand}
                          className="px-3 py-1.5 bg-ihg-navy/10 text-ihg-navy text-sm rounded-lg"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 对标竞品 */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-600 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                      对标竞品
                    </h4>
                    <div className="space-y-3">
                      {data.competitorBrands.map(comp => (
                        <div key={comp.group}>
                          <span className="text-xs text-slate-400">{comp.group}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {comp.brands.map(brand => (
                              <span 
                                key={brand}
                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
                              >
                                {brand}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 用户权限矩阵 */}
        {activeTab === 'permissions' && (
          <div className="space-y-6 animate-fade-in-up">
            <p className="text-sm text-slate-500">
              定义各用户角色的数据访问范围和功能模块权限
            </p>
            
            <Card padding="none">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left p-4 font-medium text-slate-500">角色</th>
                    <th className="text-left p-4 font-medium text-slate-500">数据范围</th>
                    <th className="text-left p-4 font-medium text-slate-500">可访问模块</th>
                    <th className="text-left p-4 font-medium text-slate-500">核心指标</th>
                    <th className="text-left p-4 font-medium text-slate-500">数据权限说明</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map((perm) => (
                    <tr key={perm.roleId} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-4">
                        <span className="font-semibold text-ihg-navy">{perm.role}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant="info">{perm.scope}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {perm.modules.map(mod => (
                            <span key={mod} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                              {mod}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {perm.focusMetrics.map(metric => (
                            <span key={metric} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              {metric}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 text-xs">
                        {perm.dataAccess}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* 权限说明 */}
            <Card className="bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">数据可见性规则</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• 各角色只能看到其管辖范围内的数据</li>
                    <li>• 竞品数据仅展示同城、同档次的对标酒店</li>
                    <li>• 评论详情下钻仅对酒店店长开放</li>
                    <li>• 价格层级穿透对定价团队和品牌运营开放</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

