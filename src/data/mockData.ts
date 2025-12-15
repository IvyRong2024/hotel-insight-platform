// ==================== 平台配置 ====================
export const platformConfig = {
  review: {
    name: '评论监测平台',
    platforms: ['携程', '美团', '飞猪', 'Booking', 'Expedia', 'Agoda'],
    coverage: { 
      total: '13,000+',
      ihg: '2,800+',
      competitors: '10,200+',
    },
  },
  price: {
    name: '价格监测平台',
    platforms: ['携程', '抖音', '直客通'],
    coverage: { 
      total: '13,000+',
      ihg: '2,800+',
      competitors: '10,200+',
    },
  },
};

// ==================== 品牌类型配置 ====================
export type BrandTier = 'luxury_lifestyle' | 'premium' | 'essentials' | 'suites';

export const brandTiers: Record<BrandTier, {
  name: string;
  nameEn: string;
  color: string;
  focusAreas: string[];
}> = {
  luxury_lifestyle: {
    name: 'Luxury & Lifestyle',
    nameEn: '奢华及生活方式',
    color: '#7c3aed', // purple
    focusAreas: ['设计美学', '服务温度', '邻里文化', '高端体验'],
  },
  premium: {
    name: 'Premium',
    nameEn: '高端',
    color: '#0ea5e9', // sky blue
    focusAreas: ['商务效率', '会议设施', '餐饮品质', '地段便利'],
  },
  essentials: {
    name: 'Essentials',
    nameEn: '精选服务',
    color: '#22c55e', // green
    focusAreas: ['入住效率', '性价比', '基础服务稳定性', '隔音'],
  },
  suites: {
    name: 'Suites',
    nameEn: '长住',
    color: '#f59e0b', // amber
    focusAreas: ['长住体验', '厨房设施', '社区感', '空间舒适'],
  },
};

// ==================== 品牌配置 (IHG 为主品牌) ====================
export const brandConfig = {
  main: {
    group: 'IHG洲际酒店集团',
    brands: [
      { name: '洲际酒店', code: 'IC', tier: 'luxury_lifestyle' as BrandTier },
      { name: '丽晶', code: 'REGENT', tier: 'luxury_lifestyle' as BrandTier },
      { name: '六善', code: 'SIXSENSES', tier: 'luxury_lifestyle' as BrandTier },
      { name: '金普顿', code: 'KIMPTON', tier: 'luxury_lifestyle' as BrandTier },
      { name: '英迪格', code: 'INDIGO', tier: 'luxury_lifestyle' as BrandTier },
      { name: '皇冠假日', code: 'CP', tier: 'premium' as BrandTier },
      { name: 'voco', code: 'VOCO', tier: 'premium' as BrandTier },
      { name: 'EVEN Hotels', code: 'EVEN', tier: 'premium' as BrandTier },
      { name: '假日酒店', code: 'HI', tier: 'essentials' as BrandTier },
      { name: '智选假日', code: 'HIX', tier: 'essentials' as BrandTier },
      { name: '馨乐庭', code: 'STAYBRIDGE', tier: 'suites' as BrandTier },
      { name: 'Atwell Suites', code: 'ATWELL', tier: 'suites' as BrandTier },
    ],
  },
  competitors: [
    { group: '万豪国际', brands: ['万豪酒店', '喜来登', '威斯汀', 'W酒店', '万怡酒店'] },
    { group: '希尔顿集团', brands: ['希尔顿酒店', '希尔顿花园', 'Hampton', '康莱德'] },
    { group: '雅高集团', brands: ['索菲特', '诺富特', '美居酒店', '宜必思'] },
    { group: '凯悦集团', brands: ['柏悦', '君悦', '凯悦酒店', '凯悦嘉轩'] },
  ],
};

// ==================== 层级数据结构 ====================
export interface HotelData {
  id: string;
  name: string;
  brand: string;
  tier: BrandTier;
  score: number;
  trend: string;
  status: 'good' | 'warning' | 'danger';
  isNew?: boolean;
  daysOpen?: number;
  issues?: string[];
}

export interface CityData {
  name: string;
  score: number;
  trend: string;
  hotelCount: number;
  issueCount: number;
  tierScores: Record<BrandTier, { score: number; count: number; trend: string }>;
  hotels: HotelData[];
}

export interface ProvinceData {
  name: string;
  score: number;
  trend: string;
  hotelCount: number;
  issueCount: number;
  cities: CityData[];
}

export interface RegionData {
  name: string;
  score: number;
  trend: string;
  rank: number;
  hotelCount: number;
  issueCount: number;
  tierScores: Record<BrandTier, { score: number; count: number; trend: string }>;
  provinces: ProvinceData[];
}

// ==================== 区域层级数据 ====================
export const regionHierarchy: RegionData[] = [
  {
    name: '华东区',
    score: 4.48,
    trend: '+0.03',
    rank: 2,
    hotelCount: 156,
    issueCount: 12,
    tierScores: {
      luxury_lifestyle: { score: 4.62, count: 18, trend: '+0.05' },
      premium: { score: 4.52, count: 35, trend: '+0.02' },
      essentials: { score: 4.22, count: 85, trend: '-0.08' },
      suites: { score: 4.45, count: 18, trend: '+0.01' },
    },
    provinces: [
      {
        name: '上海',
        score: 4.58,
        trend: '+0.05',
        hotelCount: 28,
        issueCount: 3,
        cities: [
          {
            name: '上海市',
            score: 4.58,
            trend: '+0.05',
            hotelCount: 28,
            issueCount: 3,
            tierScores: {
              luxury_lifestyle: { score: 4.65, count: 5, trend: '+0.06' },
              premium: { score: 4.52, count: 8, trend: '+0.02' },
              essentials: { score: 4.28, count: 12, trend: '-0.05' },
              suites: { score: 4.42, count: 3, trend: '+0.01' },
            },
            hotels: [
              { id: 'h1', name: '上海浦东丽晶酒店', brand: '丽晶', tier: 'luxury_lifestyle', score: 4.72, trend: '+0.05', status: 'good' },
              { id: 'h2', name: '上海外滩洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', score: 4.68, trend: '+0.03', status: 'good' },
              { id: 'h3', name: '上海外滩英迪格酒店', brand: '英迪格', tier: 'luxury_lifestyle', score: 4.55, trend: '-0.02', status: 'warning' },
              { id: 'h4', name: '上海静安金普顿酒店', brand: '金普顿', tier: 'luxury_lifestyle', score: 4.58, trend: '+0.01', status: 'good' },
              { id: 'h5', name: '上海新天地朗廷酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', score: 4.62, trend: '+0.02', status: 'good' },
              { id: 'h6', name: '上海虹桥皇冠假日酒店', brand: '皇冠假日', tier: 'premium', score: 4.48, trend: '-0.03', status: 'warning' },
              { id: 'h7', name: '上海浦东voco酒店', brand: 'voco', tier: 'premium', score: 4.58, trend: '+0.04', status: 'good' },
              { id: 'h8', name: '上海静安皇冠假日酒店', brand: '皇冠假日', tier: 'premium', score: 4.52, trend: '+0.01', status: 'good' },
              { id: 'h9', name: '上海浦东假日酒店', brand: '假日酒店', tier: 'essentials', score: 4.28, trend: '-0.08', status: 'danger', issues: ['隔音问题', '入住效率'] },
              { id: 'h10', name: '上海徐汇智选假日酒店', brand: '智选假日', tier: 'essentials', score: 4.08, trend: '-0.12', status: 'danger', issues: ['隔音严重', '设施老化'] },
              { id: 'h11', name: '上海陆家嘴智选假日酒店', brand: '智选假日', tier: 'essentials', score: 4.15, trend: '-0.05', status: 'warning', isNew: true, daysOpen: 45 },
              { id: 'h12', name: '上海古北馨乐庭酒店', brand: '馨乐庭', tier: 'suites', score: 4.42, trend: '+0.01', status: 'good' },
            ],
          },
        ],
      },
      {
        name: '浙江',
        score: 4.52,
        trend: '+0.02',
        hotelCount: 35,
        issueCount: 4,
        cities: [
          {
            name: '杭州市',
            score: 4.55,
            trend: '+0.03',
            hotelCount: 15,
            issueCount: 2,
            tierScores: {
              luxury_lifestyle: { score: 4.58, count: 3, trend: '+0.04' },
              premium: { score: 4.48, count: 4, trend: '+0.01' },
              essentials: { score: 4.32, count: 6, trend: '-0.02' },
              suites: { score: 4.38, count: 2, trend: '+0.02' },
            },
            hotels: [
              { id: 'h13', name: '杭州西湖洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', score: 4.65, trend: '+0.04', status: 'good' },
              { id: 'h14', name: '杭州西溪丽晶酒店', brand: '丽晶', tier: 'luxury_lifestyle', score: 4.58, trend: '+0.02', status: 'good', issues: ['服务响应延迟'] },
              { id: 'h15', name: '杭州滨江皇冠假日酒店', brand: '皇冠假日', tier: 'premium', score: 4.52, trend: '+0.03', status: 'good' },
              { id: 'h16', name: '杭州西湖假日酒店', brand: '假日酒店', tier: 'essentials', score: 4.42, trend: '-0.03', status: 'warning', isNew: true, daysOpen: 58 },
            ],
          },
          {
            name: '宁波市',
            score: 4.48,
            trend: '+0.01',
            hotelCount: 8,
            issueCount: 1,
            tierScores: {
              luxury_lifestyle: { score: 0, count: 0, trend: '' },
              premium: { score: 4.42, count: 3, trend: '+0.01' },
              essentials: { score: 4.28, count: 4, trend: '-0.02' },
              suites: { score: 0, count: 0, trend: '' },
            },
            hotels: [
              { id: 'h17', name: '宁波皇冠假日酒店', brand: '皇冠假日', tier: 'premium', score: 4.45, trend: '+0.02', status: 'good' },
              { id: 'h18', name: '宁波假日酒店', brand: '假日酒店', tier: 'essentials', score: 4.28, trend: '-0.03', status: 'warning' },
            ],
          },
        ],
      },
      {
        name: '江苏',
        score: 4.45,
        trend: '-0.08',
        hotelCount: 42,
        issueCount: 8,
        cities: [
          {
            name: '南京市',
            score: 4.45,
            trend: '-0.08',
            hotelCount: 12,
            issueCount: 5,
            tierScores: {
              luxury_lifestyle: { score: 4.52, count: 2, trend: '+0.01' },
              premium: { score: 4.45, count: 3, trend: '-0.02' },
              essentials: { score: 4.15, count: 6, trend: '-0.15' },
              suites: { score: 4.35, count: 1, trend: '+0.01' },
            },
            hotels: [
              { id: 'h19', name: '南京紫峰洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', score: 4.58, trend: '+0.02', status: 'good' },
              { id: 'h20', name: '南京河西皇冠假日酒店', brand: '皇冠假日', tier: 'premium', score: 4.48, trend: '-0.01', status: 'good' },
              { id: 'h21', name: '南京新街口假日酒店', brand: '假日酒店', tier: 'essentials', score: 3.92, trend: '-0.15', status: 'danger', issues: ['隔音问题集中爆发'] },
              { id: 'h22', name: '南京新街口智选假日酒店', brand: '智选假日', tier: 'essentials', score: 4.05, trend: '-0.10', status: 'danger', issues: ['入住等待过长'] },
              { id: 'h23', name: '南京江北假日酒店', brand: '假日酒店', tier: 'essentials', score: 4.18, trend: '-0.05', status: 'warning', isNew: true, daysOpen: 32 },
            ],
          },
          {
            name: '苏州市',
            score: 4.48,
            trend: '+0.01',
            hotelCount: 8,
            issueCount: 1,
            tierScores: {
              luxury_lifestyle: { score: 4.60, count: 1, trend: '+0.03' },
              premium: { score: 4.50, count: 2, trend: '+0.02' },
              essentials: { score: 4.25, count: 4, trend: '-0.03' },
              suites: { score: 4.40, count: 1, trend: '+0.01' },
            },
            hotels: [
              { id: 'h24', name: '苏州金鸡湖洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', score: 4.60, trend: '+0.03', status: 'good' },
              { id: 'h25', name: '苏州皇冠假日酒店', brand: '皇冠假日', tier: 'premium', score: 4.52, trend: '+0.02', status: 'good' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: '华南区',
    score: 4.52,
    trend: '+0.03',
    rank: 1,
    hotelCount: 142,
    issueCount: 5,
    tierScores: {
      luxury_lifestyle: { score: 4.68, count: 15, trend: '+0.04' },
      premium: { score: 4.55, count: 32, trend: '+0.03' },
      essentials: { score: 4.28, count: 78, trend: '-0.02' },
      suites: { score: 4.48, count: 17, trend: '+0.02' },
    },
    provinces: [],
  },
  {
    name: '华北区',
    score: 4.41,
    trend: '-0.02',
    rank: 4,
    hotelCount: 128,
    issueCount: 12,
    tierScores: {
      luxury_lifestyle: { score: 4.58, count: 12, trend: '+0.01' },
      premium: { score: 4.48, count: 28, trend: '-0.01' },
      essentials: { score: 4.18, count: 72, trend: '-0.05' },
      suites: { score: 4.42, count: 16, trend: '+0.01' },
    },
    provinces: [],
  },
];

// ==================== 品牌健康指数 ====================
export const brandHealthData = {
  overallScore: 4.52,
  sentimentIndex: 78.5,
  experienceIndex: 82.1,
  trends: {
    overallScore: '+3.2%',
    sentimentIndex: '+2.1%',
    experienceIndex: '+1.8%',
  },
  trendData: [
    { date: '11-11', score: 4.45, sentiment: 75 },
    { date: '11-18', score: 4.48, sentiment: 76 },
    { date: '11-25', score: 4.50, sentiment: 77 },
    { date: '12-02', score: 4.51, sentiment: 78 },
    { date: '12-09', score: 4.52, sentiment: 78.5 },
  ],
  tierPerformance: {
    luxury_lifestyle: { score: 4.65, trend: '+0.04', highlights: ['邻里文化差异化明显'], concerns: ['部分门店服务响应延迟'] },
    premium: { score: 4.52, trend: '+0.02', highlights: ['商务设施完善'], concerns: ['早餐高峰拥挤'] },
    essentials: { score: 4.22, trend: '-0.08', highlights: ['性价比认可'], concerns: ['隔音问题集中', '入住效率待提升'] },
    suites: { score: 4.45, trend: '+0.01', highlights: ['长住满意度高'], concerns: ['厨房设备维护'] },
  },
};

// ==================== 品牌承诺验证 ====================
export const promiseFulfillmentData = [
  { promise: '高效入住', score: 85, status: 'fulfilled', mentions: 2341, icon: '⚡', action: null },
  { promise: '温暖服务', score: 72, status: 'partial', mentions: 1856, icon: '❤️', action: '强化服务培训' },
  { promise: '设计美学', score: 68, status: 'partial', mentions: 1203, icon: '🎨', action: '加强品牌传播' },
  { promise: '智能体验', score: 45, status: 'unfulfilled', mentions: 892, icon: '🤖', action: 'App引导+自助机使用率提升' },
  { promise: '安心卫生', score: 91, status: 'fulfilled', mentions: 3102, icon: '✨', action: null },
];

// ==================== 品牌驱动因素 ====================
export const brandDriversData = [
  { driver: '服务态度', score: 92, impact: '+0.35', keywords: ['热情', '耐心', '主动', '微笑'], color: '#10b981' },
  { driver: '早餐品质', score: 88, impact: '+0.28', keywords: ['丰富', '新鲜', '美味', '品种多'], color: '#22c55e' },
  { driver: '位置便利', score: 85, impact: '+0.22', keywords: ['地铁', '商圈', '交通', '市中心'], color: '#34d399' },
  { driver: '房间清洁', score: 82, impact: '+0.18', keywords: ['干净', '整洁', '一尘不染'], color: '#6ee7b7' },
  { driver: '设计风格', score: 76, impact: '+0.12', keywords: ['现代', '时尚', '简约', '高级感'], color: '#a7f3d0' },
];

// ==================== 品牌障碍因素 ====================
export const brandBarriersData = [
  { barrier: '隔音问题', severity: 'high', mentions: 1245, trend: '↑', affectedTier: 'essentials', rooms: ['走廊房', '电梯旁'], impact: -0.28 },
  { barrier: '设施老化', severity: 'medium', mentions: 892, trend: '→', affectedTier: 'essentials', items: ['空调', '淋浴'], impact: -0.18 },
  { barrier: '入住等待', severity: 'medium', mentions: 756, trend: '↓', affectedTier: 'essentials', peak: '14:00-16:00', impact: -0.15 },
  { barrier: '早餐拥挤', severity: 'low', mentions: 534, trend: '→', affectedTier: 'premium', category: '高峰时段', impact: -0.08 },
  { barrier: '服务响应', severity: 'low', mentions: 423, trend: '→', affectedTier: 'luxury_lifestyle', type: '延迟', impact: -0.05 },
];

// ==================== 竞对对比 ====================
export const competitorData = {
  brands: ['IHG洲际', '万豪国际', '希尔顿', '雅高集团'],
  colors: ['#003B6F', '#8b5cf6', '#f59e0b', '#6b7280'],
  metrics: {
    综合评分: [4.52, 4.48, 4.55, 4.41],
    服务评分: [4.65, 4.52, 4.58, 4.45],
    性价比: [4.21, 4.15, 4.12, 4.38],
    清洁度: [4.72, 4.68, 4.75, 4.62],
    设施: [4.35, 4.42, 4.52, 4.28],
  },
  advantages: {
    'IHG洲际': ['会员体系', '服务温度', '早餐质量'],
    '万豪国际': ['品牌矩阵', '全球覆盖'],
    '希尔顿': ['设施新', '数字化体验'],
    '雅高集团': ['性价比', '本土化'],
  },
  promos: [
    { competitor: '万豪', campaign: '双12狂欢', discount: '5折起', dates: '12/10-15', channels: ['抖音', '携程'], threat: 'high' as const },
    { competitor: '希尔顿', campaign: '荣誉客会员日', discount: '8折', dates: '12/12', channels: ['直客通'], threat: 'low' as const },
    { competitor: '雅高', campaign: '圣诞特惠', discount: '7折', dates: '12/20-26', channels: ['携程', '飞猪'], threat: 'medium' as const },
  ],
};

// ==================== 单店详情数据 ====================
export const hotelDetailData = {
  hotelName: '上海外滩英迪格酒店',
  brand: '英迪格',
  tier: 'luxury_lifestyle' as BrandTier,
  score: 4.55,
  rankings: {
    city: { rank: 12, total: 28, name: '上海' },
    region: { rank: 45, total: 156, name: '华东区' },
    brand: { rank: 8, total: 42, name: '英迪格' },
    tier: { rank: 15, total: 68, name: 'L&L' },
  },
  comparisons: {
    vsCityTier: '+0.10',
    vsRegionTier: '+0.05',
    vsNationalTier: '-0.02',
  },
  platforms: [
    { name: '携程', score: 4.6, rank: 12, total: 156 },
    { name: '美团', score: 4.5, rank: 18, total: 156 },
    { name: '飞猪', score: 4.7, rank: 8, total: 156 },
    { name: 'Booking', score: 8.8, rank: 15, total: 156 },
    { name: 'Agoda', score: 8.6, rank: 22, total: 156 },
  ],
  journeyRisks: [
    { stage: '预订', risk: 'low' as const, issues: ['价格波动'], count: 12, icon: '📅' },
    { stage: '入住', risk: 'medium' as const, issues: ['排队等待', '证件识别慢'], count: 45, icon: '🚪' },
    { stage: '房间', risk: 'high' as const, issues: ['隔音差', '空调异响', '热水不稳'], count: 89, icon: '🛏️' },
    { stage: '服务', risk: 'low' as const, issues: ['早餐补餐慢'], count: 23, icon: '🍳' },
    { stage: '退房', risk: 'low' as const, issues: ['发票等待'], count: 8, icon: '✅' },
  ],
  drivers: [
    { dimension: '服务响应', score: 4.7, vsCity: '+0.3', vsBrand: '+0.2', keywords: ['前台热情', '行李员主动', '响应快'], trend: 'stable' },
    { dimension: '位置交通', score: 4.8, vsCity: '+0.4', vsBrand: '+0.3', keywords: ['地铁口', '商圈近', '出行方便'], trend: 'stable' },
    { dimension: '设计美学', score: 4.6, vsCity: '+0.2', vsBrand: '+0.1', keywords: ['现代', '时尚', '邻里文化'], trend: 'up' },
    { dimension: '房间舒适', score: 4.5, vsCity: '+0.1', vsBrand: '0', keywords: ['床软', '枕头舒服'], trend: 'up' },
  ] as Array<{ dimension: string; score: number; vsCity: string; vsBrand: string; keywords: string[]; trend: 'stable' | 'up' | 'down' }>,
};

// ==================== 评论平台配置 ====================
export type ReviewPlatform = '携程' | '美团' | '飞猪' | 'Booking' | 'Expedia' | 'Agoda';

export const reviewPlatforms: ReviewPlatform[] = ['携程', '美团', '飞猪', 'Booking', 'Expedia', 'Agoda'];

export interface PlatformComment {
  platform: ReviewPlatform;
  content: string;
  date: string;
  rating: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

// ==================== 用户需求数据（含分平台评论）====================
export const userNeedsData = [
  { 
    category: '效率需求', 
    icon: '⚡', 
    items: ['快速入住', '自助办理', '无接触服务'], 
    intensity: 85, 
    trend: '↑',
    positive: ['"自助入住机很方便，2分钟搞定" - 携程', '"前台效率很高，不用排队" - 美团'],
    negative: ['"排队等了20分钟才办好入住" - 携程', '"自助机老是识别不了身份证" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '自助入住机很方便，2分钟搞定', date: '2024-12-10', rating: 5, sentiment: 'positive' as const },
      { platform: '携程' as ReviewPlatform, content: '排队等了20分钟才办好入住', date: '2024-12-08', rating: 3, sentiment: 'negative' as const },
      { platform: '美团' as ReviewPlatform, content: '前台效率很高，不用排队', date: '2024-12-09', rating: 5, sentiment: 'positive' as const },
      { platform: '美团' as ReviewPlatform, content: '自助机老是识别不了身份证', date: '2024-12-07', rating: 2, sentiment: 'negative' as const },
      { platform: '飞猪' as ReviewPlatform, content: '入住办理速度很快', date: '2024-12-11', rating: 4, sentiment: 'positive' as const },
      { platform: 'Booking' as ReviewPlatform, content: 'Quick check-in process', date: '2024-12-10', rating: 5, sentiment: 'positive' as const },
      { platform: 'Expedia' as ReviewPlatform, content: 'Waited 15 min at front desk', date: '2024-12-06', rating: 3, sentiment: 'negative' as const },
      { platform: 'Agoda' as ReviewPlatform, content: 'Express check-in was efficient', date: '2024-12-09', rating: 4, sentiment: 'positive' as const },
    ],
  },
  { 
    category: '舒适需求', 
    icon: '🛏️', 
    items: ['隔音好', '床品升级', '遮光窗帘'], 
    intensity: 78, 
    trend: '↑',
    positive: ['"床垫很舒服，睡眠质量很好" - 携程', '"房间隔音不错，很安静" - 美团'],
    negative: ['"隔壁说话听得一清二楚" - 携程', '"空调声音太大" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '床垫很舒服，睡眠质量很好', date: '2024-12-10', rating: 5, sentiment: 'positive' as const },
      { platform: '携程' as ReviewPlatform, content: '隔壁说话听得一清二楚', date: '2024-12-09', rating: 2, sentiment: 'negative' as const },
      { platform: '美团' as ReviewPlatform, content: '房间隔音不错，很安静', date: '2024-12-08', rating: 4, sentiment: 'positive' as const },
      { platform: '美团' as ReviewPlatform, content: '空调声音太大', date: '2024-12-07', rating: 2, sentiment: 'negative' as const },
      { platform: '飞猪' as ReviewPlatform, content: '床品质量很好，很舒适', date: '2024-12-10', rating: 5, sentiment: 'positive' as const },
      { platform: 'Booking' as ReviewPlatform, content: 'Room was quiet and comfortable', date: '2024-12-09', rating: 5, sentiment: 'positive' as const },
      { platform: 'Expedia' as ReviewPlatform, content: 'Could hear noise from corridor', date: '2024-12-08', rating: 3, sentiment: 'negative' as const },
      { platform: 'Agoda' as ReviewPlatform, content: 'Very comfortable bed', date: '2024-12-07', rating: 5, sentiment: 'positive' as const },
    ],
  },
  { 
    category: '服务需求', 
    icon: '🙋', 
    items: ['响应速度', '态度温度', '问题解决'], 
    intensity: 72, 
    trend: '→',
    positive: ['"前台小姐姐很热情" - 携程', '"客房服务响应很快" - 美团'],
    negative: ['"打了3次电话才送来毛巾" - 携程', '"服务态度一般" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '前台小姐姐很热情', date: '2024-12-11', rating: 5, sentiment: 'positive' as const },
      { platform: '携程' as ReviewPlatform, content: '打了3次电话才送来毛巾', date: '2024-12-09', rating: 2, sentiment: 'negative' as const },
      { platform: '美团' as ReviewPlatform, content: '客房服务响应很快', date: '2024-12-10', rating: 5, sentiment: 'positive' as const },
      { platform: '美团' as ReviewPlatform, content: '服务态度一般', date: '2024-12-08', rating: 3, sentiment: 'negative' as const },
      { platform: '飞猪' as ReviewPlatform, content: '服务人员态度非常好', date: '2024-12-09', rating: 5, sentiment: 'positive' as const },
      { platform: 'Booking' as ReviewPlatform, content: 'Staff was friendly and helpful', date: '2024-12-08', rating: 5, sentiment: 'positive' as const },
      { platform: 'Expedia' as ReviewPlatform, content: 'Slow response to room service', date: '2024-12-07', rating: 3, sentiment: 'negative' as const },
      { platform: 'Agoda' as ReviewPlatform, content: 'Excellent concierge service', date: '2024-12-10', rating: 5, sentiment: 'positive' as const },
    ],
  },
  { 
    category: '早餐需求', 
    icon: '🍳', 
    items: ['品种丰富', '补餐及时', '健康选项'], 
    intensity: 68, 
    trend: '→',
    positive: ['"早餐品种很丰富" - 携程', '"水果很新鲜" - 美团'],
    negative: ['"热菜补餐太慢" - 携程', '"早餐品种太少" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '早餐品种很丰富', date: '2024-12-11', rating: 5, sentiment: 'positive' as const },
      { platform: '携程' as ReviewPlatform, content: '热菜补餐太慢', date: '2024-12-09', rating: 3, sentiment: 'negative' as const },
      { platform: '美团' as ReviewPlatform, content: '水果很新鲜', date: '2024-12-10', rating: 4, sentiment: 'positive' as const },
      { platform: '美团' as ReviewPlatform, content: '早餐品种太少', date: '2024-12-08', rating: 3, sentiment: 'negative' as const },
      { platform: '飞猪' as ReviewPlatform, content: '早餐选择多样', date: '2024-12-09', rating: 4, sentiment: 'positive' as const },
      { platform: 'Booking' as ReviewPlatform, content: 'Great breakfast selection', date: '2024-12-10', rating: 5, sentiment: 'positive' as const },
      { platform: 'Expedia' as ReviewPlatform, content: 'Breakfast was average', date: '2024-12-07', rating: 3, sentiment: 'neutral' as const },
      { platform: 'Agoda' as ReviewPlatform, content: 'Good variety at breakfast', date: '2024-12-08', rating: 4, sentiment: 'positive' as const },
    ],
  },
  { 
    category: '性价比需求', 
    icon: '💰', 
    items: ['价格透明', '优悦会权益', '升房体验'], 
    intensity: 82, 
    trend: '↑',
    positive: ['"会员价很划算" - 携程', '"活动价性价比超高" - 抖音'],
    negative: ['"节假日涨价太狠" - 携程', '"和OTA价差太大" - 直客通'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '会员价很划算', date: '2024-12-11', rating: 5, sentiment: 'positive' as const },
      { platform: '携程' as ReviewPlatform, content: '节假日涨价太狠', date: '2024-12-05', rating: 2, sentiment: 'negative' as const },
      { platform: '美团' as ReviewPlatform, content: '价格合理，物有所值', date: '2024-12-10', rating: 4, sentiment: 'positive' as const },
      { platform: '美团' as ReviewPlatform, content: '周末价格翻倍', date: '2024-12-06', rating: 2, sentiment: 'negative' as const },
      { platform: '飞猪' as ReviewPlatform, content: '性价比很高', date: '2024-12-09', rating: 5, sentiment: 'positive' as const },
      { platform: 'Booking' as ReviewPlatform, content: 'Good value for money', date: '2024-12-08', rating: 4, sentiment: 'positive' as const },
      { platform: 'Expedia' as ReviewPlatform, content: 'Overpriced for the area', date: '2024-12-07', rating: 2, sentiment: 'negative' as const },
      { platform: 'Agoda' as ReviewPlatform, content: 'Reasonable prices', date: '2024-12-10', rating: 4, sentiment: 'positive' as const },
    ],
  },
  { 
    category: '文化共鸣', 
    icon: '🎨', 
    items: ['在地设计', '品牌调性', '邻里文化'], 
    intensity: 45, 
    trend: '↑',
    positive: ['"酒店设计很有当地特色" - 携程', '"邻里文化活动很有趣" - Booking'],
    negative: ['"装修风格太普通" - 携程', '"感觉和其他连锁没区别" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '酒店设计很有当地特色', date: '2024-12-11', rating: 5, sentiment: 'positive' as const },
      { platform: '携程' as ReviewPlatform, content: '装修风格太普通', date: '2024-12-08', rating: 3, sentiment: 'negative' as const },
      { platform: '美团' as ReviewPlatform, content: '设计感很强', date: '2024-12-10', rating: 4, sentiment: 'positive' as const },
      { platform: '美团' as ReviewPlatform, content: '感觉和其他连锁没区别', date: '2024-12-07', rating: 3, sentiment: 'negative' as const },
      { platform: '飞猪' as ReviewPlatform, content: '装饰有当地文化元素', date: '2024-12-09', rating: 4, sentiment: 'positive' as const },
      { platform: 'Booking' as ReviewPlatform, content: '邻里文化活动很有趣', date: '2024-12-08', rating: 5, sentiment: 'positive' as const },
      { platform: 'Expedia' as ReviewPlatform, content: 'Nice local touches in design', date: '2024-12-10', rating: 4, sentiment: 'positive' as const },
      { platform: 'Agoda' as ReviewPlatform, content: 'Unique boutique style', date: '2024-12-09', rating: 5, sentiment: 'positive' as const },
    ],
  },
];

// ==================== 新店数据 ====================
export const newOpeningData = {
  hotelName: '杭州西湖假日酒店',
  brand: '假日酒店',
  tier: 'essentials' as BrandTier,
  openDate: '2024-10-15',
  daysOpen: 58,
  stabilityScore: 72,
  milestones: [
    { day: 30, target: 65, achieved: true },
    { day: 60, target: 75, achieved: false, current: true },
    { day: 90, target: 85, achieved: false },
  ],
  trajectory: [
    { day: 7, score: 65 },
    { day: 14, score: 68 },
    { day: 21, score: 71 },
    { day: 28, score: 74 },
    { day: 35, score: 72 },
    { day: 42, score: 75 },
    { day: 49, score: 73 },
    { day: 56, score: 72 },
  ],
  highlights: ['设计风格好评', '服务培训到位', '早餐惊喜'],
  painPoints: ['入住流程不熟练', '设施小问题多', '停车指引不清'],
  vsOldHotels: -0.15,
  vsRegionAvg: +0.08,
};

// ==================== 行动中心数据 ====================
type ActionStatus = 'pending' | 'in_progress' | 'completed';
type ActionPriority = 'urgent' | 'high' | 'medium' | 'low';

interface ActionItem {
  id: string;
  priority: ActionPriority;
  category: string;
  title: string;
  hotel: string;
  hotelId: string;
  tier: BrandTier;
  city: string;
  region: string;
  source: string;
  impact: string;
  deadline: string;
  status: ActionStatus;
  assignee: string;
}

export const actionsData: ActionItem[] = [
  {
    id: 'ACT-001',
    priority: 'urgent',
    category: '设施维护',
    title: '3楼走廊隔音板加装',
    hotel: '上海外滩英迪格酒店',
    hotelId: 'h3',
    tier: 'luxury_lifestyle',
    city: '上海',
    region: '华东',
    source: '房间体验风险',
    impact: '预计提升0.2分',
    deadline: '2024-12-20',
    status: 'pending',
    assignee: '工程部',
  },
  {
    id: 'ACT-002',
    priority: 'high',
    category: '服务培训',
    title: '前台入住效率提升培训',
    hotel: '上海浦东假日酒店',
    hotelId: 'h9',
    tier: 'essentials',
    city: '上海',
    region: '华东',
    source: '入住体验风险',
    impact: '预计缩短等待时间50%',
    deadline: '2024-12-15',
    status: 'in_progress',
    assignee: '培训部',
  },
  {
    id: 'ACT-003',
    priority: 'urgent',
    category: '设施维护',
    title: '全楼层隔音专项整改',
    hotel: '南京新街口假日酒店',
    hotelId: 'h21',
    tier: 'essentials',
    city: '南京',
    region: '华东',
    source: '隔音投诉激增',
    impact: '预计提升0.3分',
    deadline: '2024-12-25',
    status: 'pending',
    assignee: '工程部',
  },
  {
    id: 'ACT-004',
    priority: 'high',
    category: '运营流程',
    title: '高峰期前台增员',
    hotel: '南京新街口智选假日酒店',
    hotelId: 'h22',
    tier: 'essentials',
    city: '南京',
    region: '华东',
    source: '入住等待过长',
    impact: '预计等待时间-40%',
    deadline: '2024-12-18',
    status: 'pending',
    assignee: '运营部',
  },
  {
    id: 'ACT-005',
    priority: 'medium',
    category: '服务培训',
    title: '服务响应速度提升',
    hotel: '杭州西溪丽晶酒店',
    hotelId: 'h14',
    tier: 'luxury_lifestyle',
    city: '杭州',
    region: '华东',
    source: '服务延迟反馈',
    impact: '提升L&L服务标准',
    deadline: '2024-12-30',
    status: 'pending',
    assignee: '培训部',
  },
  {
    id: 'ACT-006',
    priority: 'low',
    category: '运营流程',
    title: '停车场引导标识更新',
    hotel: '上海外滩英迪格酒店',
    hotelId: 'h3',
    tier: 'luxury_lifestyle',
    city: '上海',
    region: '华东',
    source: '用户需求识别',
    impact: '提升到店体验',
    deadline: '2025-01-10',
    status: 'completed',
    assignee: '运营部',
  },
];

// ==================== 价格数据 ====================
export const priceData = {
  overview: {
    avgPrice: 658,
    change: '+5.2%',
    valueIndex: 1.12,
    valueLabel: '高性价比',
  },
  vsCompetitors: [
    { competitor: '万豪', priceDiff: '+¥33', percentage: '+5%', status: 'warning' as const },
    { competitor: '希尔顿', priceDiff: '-¥54', percentage: '-8%', status: 'good' as const },
    { competitor: '雅高', priceDiff: '+¥160', percentage: '+32%', status: 'neutral' as const },
  ],
  tierPricing: {
    luxury_lifestyle: { ihg: 1580, competitor: 1650, diff: '-4%', status: 'good' },
    premium: { ihg: 658, competitor: 625, diff: '+5%', status: 'warning' },
    essentials: { ihg: 318, competitor: 298, diff: '+7%', status: 'warning' },
    suites: { ihg: 488, competitor: 520, diff: '-6%', status: 'good' },
  } as Record<BrandTier, { ihg: number; competitor: number; diff: string; status: 'good' | 'warning' | 'neutral' }>,
  regions: [
    { name: '华东', avgPrice: 658, change: '+5.2%', promoRate: 32 },
    { name: '华南', avgPrice: 712, change: '+3.8%', promoRate: 28 },
    { name: '华北', avgPrice: 625, change: '-1.2%', promoRate: 45 },
    { name: '西南', avgPrice: 478, change: '+2.1%', promoRate: 38 },
    { name: '华中', avgPrice: 492, change: '+0.5%', promoRate: 35 },
  ],
  channelAlerts: [
    { channel: '抖音', ourPrice: 568, competitorPrice: 498, competitor: '万豪', diff: '+14%', urgency: 'high' as const },
    { channel: '携程', ourPrice: 668, competitorPrice: 625, competitor: '希尔顿', diff: '+7%', urgency: 'medium' as const },
  ],
  voucherProducts: [
    {
      platform: '抖音',
      name: '周末双人度假套餐',
      originalPrice: 1288,
      salePrice: 888,
      validity: '2025-03-31',
      salesVolume: 2341,
      includes: [
        { item: '高级大床房1晚', value: '¥658' },
        { item: '双人自助早餐', value: '¥196' },
        { item: '双人下午茶', value: '¥168' },
        { item: '延迟退房至14:00', value: '赠送' },
      ],
    },
    {
      platform: '携程',
      name: '亲子欢乐住套餐',
      originalPrice: 1588,
      salePrice: 1088,
      validity: '2025-02-28',
      salesVolume: 856,
      includes: [
        { item: '家庭房1晚', value: '¥858' },
        { item: '三人自助早餐', value: '¥294' },
        { item: '儿童欢迎礼包', value: '¥128' },
        { item: '儿童乐园门票2张', value: '¥200' },
      ],
    },
    {
      platform: '直客通',
      name: '商务尊享住宿券',
      originalPrice: 798,
      salePrice: 598,
      validity: '2025-06-30',
      salesVolume: 1256,
      includes: [
        { item: '高级大床房1晚', value: '¥658' },
        { item: '单人自助早餐', value: '¥98' },
        { item: '行政酒廊使用', value: '赠送' },
      ],
    },
  ],
  trendData: [
    { date: '11-11', 'IHG': 645, '万豪': 618, '希尔顿': 702, '雅高': 488 },
    { date: '11-18', 'IHG': 652, '万豪': 622, '希尔顿': 708, '雅高': 492 },
    { date: '11-25', 'IHG': 648, '万豪': 615, '希尔顿': 698, '雅高': 485 },
    { date: '12-02', 'IHG': 655, '万豪': 620, '希尔顿': 705, '雅高': 495 },
    { date: '12-09', 'IHG': 658, '万豪': 625, '希尔顿': 712, '雅高': 498 },
  ],
  competitorPromos: competitorData.promos,
};

// ==================== 关注清单 ====================
export const watchlistData = [
  { hotelId: 'h9', name: '上海浦东假日酒店', reason: '评分持续下滑', score: 4.28, trend: '-0.08', tier: 'essentials' as BrandTier },
  { hotelId: 'h21', name: '南京新街口假日酒店', reason: '隔音投诉激增', score: 3.92, trend: '-0.15', tier: 'essentials' as BrandTier },
  { hotelId: 'h16', name: '杭州西湖假日酒店', reason: '新店稳定化监控', score: 4.42, trend: '-0.03', tier: 'essentials' as BrandTier, isNew: true, daysOpen: 58 },
];

// ==================== 筛选器选项 ====================
export const filterOptions = {
  regions: ['全国', '华东', '华南', '华北', '西南', '华中'],
  provinces: {
    华东: ['上海', '江苏', '浙江', '安徽', '山东'],
    华南: ['广东', '广西', '海南', '福建'],
    华北: ['北京', '天津', '河北', '山西', '内蒙古'],
    西南: ['四川', '重庆', '云南', '贵州', '西藏'],
    华中: ['湖北', '湖南', '河南', '江西'],
  },
  brands: ['全部品牌', '洲际酒店', '丽晶', '皇冠假日', '假日酒店', '智选假日', '英迪格', 'voco', '馨乐庭'],
  hotelTypes: ['全部', 'L&L', 'Premium', 'Essentials', 'Suites'],
  tiers: Object.entries(brandTiers).map(([key, value]) => ({ id: key, name: value.name })),
  timeRanges: ['近7天', '近30天', '近90天', '自定义'],
  roles: [
    { id: 'brand_ops', name: '品牌运营' },
    { id: 'region_vp', name: '大区负责人' },
    { id: 'city_mgr', name: '城市负责人' },
    { id: 'hotel_mgr', name: '酒店店长' },
    { id: 'revenue_mgr', name: '定价团队' },
  ],
};
