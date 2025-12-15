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
      total: '5,000+',
      ihg: '—',
      competitors: '5,000+',
    },
    note: '仅监测竞品价格动态',
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

// ==================== 平台评分标准与高分占比 ====================
// 携程/飞猪：5分制，4.5分及以上为高分
// 美团：5星制，4星及以上为高分
// 境外渠道（Booking/Expedia/Agoda）：10分制，8分及以上为高分

export interface PlatformScoreData {
  name: string;
  scale: string;
  highScoreThreshold: number | string;
  totalReviews: number;
  highScoreReviews: number;
  highScoreRatio: number;
  trend: string;
  avgScore: number;
}

export interface PlatformScoreSummary {
  domestic: Record<string, PlatformScoreData>;
  overseas: Record<string, PlatformScoreData>;
  summary: {
    domesticHighScoreRatio: number;
    overseasHighScoreRatio: number;
    overallHighScoreRatio: number;
    trend: string;
    totalReviews: number;
    highScoreReviews: number;
  };
}

// 全国品牌级别数据
export const platformScoreStandards: PlatformScoreSummary = {
  domestic: {
    ctrip: {
      name: '携程',
      scale: '5分制',
      highScoreThreshold: 4.5,
      totalReviews: 125800,
      highScoreReviews: 101898,
      highScoreRatio: 81.0,
      trend: '+2.3%',
      avgScore: 4.52,
    },
    meituan: {
      name: '美团',
      scale: '5星制',
      highScoreThreshold: '4星',
      totalReviews: 89200,
      highScoreReviews: 74928,
      highScoreRatio: 84.0,
      trend: '+1.8%',
      avgScore: 4.48,
    },
    fliggy: {
      name: '飞猪',
      scale: '5分制',
      highScoreThreshold: 4.5,
      totalReviews: 56800,
      highScoreReviews: 45440,
      highScoreRatio: 80.0,
      trend: '+0.5%',
      avgScore: 4.45,
    },
  },
  overseas: {
    booking: {
      name: 'Booking',
      scale: '10分制',
      highScoreThreshold: 8.0,
      totalReviews: 32500,
      highScoreReviews: 27950,
      highScoreRatio: 86.0,
      trend: '+1.2%',
      avgScore: 8.6,
    },
    expedia: {
      name: 'Expedia',
      scale: '10分制',
      highScoreThreshold: 8.0,
      totalReviews: 18200,
      highScoreReviews: 14742,
      highScoreRatio: 81.0,
      trend: '-0.5%',
      avgScore: 8.2,
    },
    agoda: {
      name: 'Agoda',
      scale: '10分制',
      highScoreThreshold: 8.0,
      totalReviews: 21500,
      highScoreReviews: 18490,
      highScoreRatio: 86.0,
      trend: '+0.8%',
      avgScore: 8.5,
    },
  },
  summary: {
    domesticHighScoreRatio: 82.0,
    overseasHighScoreRatio: 85.0,
    overallHighScoreRatio: 83.0,
    trend: '+1.5%',
    totalReviews: 344000,
    highScoreReviews: 283448,
  },
};

// 区域级别数据（华东区示例）
export const regionPlatformScores: PlatformScoreSummary = {
  domestic: {
    ctrip: { name: '携程', scale: '5分制', highScoreThreshold: 4.5, totalReviews: 28500, highScoreReviews: 23655, highScoreRatio: 83.0, trend: '+2.8%', avgScore: 4.58 },
    meituan: { name: '美团', scale: '5星制', highScoreThreshold: '4星', totalReviews: 19800, highScoreReviews: 16830, highScoreRatio: 85.0, trend: '+2.1%', avgScore: 4.52 },
    fliggy: { name: '飞猪', scale: '5分制', highScoreThreshold: 4.5, totalReviews: 12600, highScoreReviews: 10332, highScoreRatio: 82.0, trend: '+1.2%', avgScore: 4.48 },
  },
  overseas: {
    booking: { name: 'Booking', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 8200, highScoreReviews: 7216, highScoreRatio: 88.0, trend: '+1.5%', avgScore: 8.7 },
    expedia: { name: 'Expedia', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 4500, highScoreReviews: 3780, highScoreRatio: 84.0, trend: '+0.3%', avgScore: 8.4 },
    agoda: { name: 'Agoda', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 5200, highScoreReviews: 4576, highScoreRatio: 88.0, trend: '+1.0%', avgScore: 8.6 },
  },
  summary: {
    domesticHighScoreRatio: 83.5,
    overseasHighScoreRatio: 87.0,
    overallHighScoreRatio: 84.5,
    trend: '+1.8%',
    totalReviews: 78800,
    highScoreReviews: 66389,
  },
};

// 城市级别数据（上海示例）
export const cityPlatformScores: PlatformScoreSummary = {
  domestic: {
    ctrip: { name: '携程', scale: '5分制', highScoreThreshold: 4.5, totalReviews: 8500, highScoreReviews: 7225, highScoreRatio: 85.0, trend: '+3.2%', avgScore: 4.62 },
    meituan: { name: '美团', scale: '5星制', highScoreThreshold: '4星', totalReviews: 5800, highScoreReviews: 5046, highScoreRatio: 87.0, trend: '+2.5%', avgScore: 4.55 },
    fliggy: { name: '飞猪', scale: '5分制', highScoreThreshold: 4.5, totalReviews: 3600, highScoreReviews: 3024, highScoreRatio: 84.0, trend: '+1.8%', avgScore: 4.52 },
  },
  overseas: {
    booking: { name: 'Booking', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 2800, highScoreReviews: 2520, highScoreRatio: 90.0, trend: '+2.0%', avgScore: 8.8 },
    expedia: { name: 'Expedia', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 1500, highScoreReviews: 1290, highScoreRatio: 86.0, trend: '+1.2%', avgScore: 8.5 },
    agoda: { name: 'Agoda', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 1800, highScoreReviews: 1620, highScoreRatio: 90.0, trend: '+1.5%', avgScore: 8.7 },
  },
  summary: {
    domesticHighScoreRatio: 85.5,
    overseasHighScoreRatio: 89.0,
    overallHighScoreRatio: 86.5,
    trend: '+2.2%',
    totalReviews: 24000,
    highScoreReviews: 20725,
  },
};

// 单店级别数据（上海外滩英迪格酒店示例）
export const hotelPlatformScores: PlatformScoreSummary = {
  domestic: {
    ctrip: { name: '携程', scale: '5分制', highScoreThreshold: 4.5, totalReviews: 856, highScoreReviews: 710, highScoreRatio: 83.0, trend: '+1.5%', avgScore: 4.55 },
    meituan: { name: '美团', scale: '5星制', highScoreThreshold: '4星', totalReviews: 423, highScoreReviews: 360, highScoreRatio: 85.0, trend: '+2.0%', avgScore: 4.52 },
    fliggy: { name: '飞猪', scale: '5分制', highScoreThreshold: 4.5, totalReviews: 289, highScoreReviews: 237, highScoreRatio: 82.0, trend: '+0.8%', avgScore: 4.48 },
  },
  overseas: {
    booking: { name: 'Booking', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 312, highScoreReviews: 281, highScoreRatio: 90.0, trend: '+1.8%', avgScore: 8.8 },
    expedia: { name: 'Expedia', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 156, highScoreReviews: 134, highScoreRatio: 86.0, trend: '+0.5%', avgScore: 8.4 },
    agoda: { name: 'Agoda', scale: '10分制', highScoreThreshold: 8.0, totalReviews: 198, highScoreReviews: 178, highScoreRatio: 90.0, trend: '+1.2%', avgScore: 8.7 },
  },
  summary: {
    domesticHighScoreRatio: 83.5,
    overseasHighScoreRatio: 89.0,
    overallHighScoreRatio: 85.0,
    trend: '+1.3%',
    totalReviews: 2234,
    highScoreReviews: 1900,
  },
};

// ==================== 品牌健康指数 ====================
export const brandHealthData = {
  overallScore: 4.52,
  sentimentIndex: 78.5,
  experienceIndex: 82.1,
  highScoreRatio: platformScoreStandards.summary.overallHighScoreRatio, // 高分占比
  trends: {
    overallScore: '+3.2%',
    sentimentIndex: '+2.1%',
    experienceIndex: '+1.8%',
    highScoreRatio: platformScoreStandards.summary.trend,
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
    { stage: '预订', risk: 'low', issues: ['节假日价格波动大'], count: 12, icon: '📅' },
    { stage: '入住', risk: 'medium', issues: ['周末高峰排队', '升房沟通'], count: 38, icon: '🚪' },
    { stage: '房间', risk: 'high', issues: ['临街房隔音', '空调出风位置'], count: 52, icon: '🛏️' },
    { stage: '服务', risk: 'low', issues: ['客房送物响应慢', '早餐高峰等位'], count: 28, icon: '🍳' },
    { stage: '退房', risk: 'low', issues: ['发票开具等待'], count: 8, icon: '✅' },
  ] as Array<{ stage: string; risk: 'low' | 'medium' | 'high'; issues: string[]; count: number; icon: string }>,
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
  userName: string;
  orderId?: string; // 可选的订单号，方便追溯
}

// ==================== 用户需求数据（含分平台评论 - 上海外滩英迪格酒店）====================
// 注：英迪格是精品生活方式酒店，强调邻里文化和个性化服务，采用人工办理入住以体现服务温度
export const userNeedsData = [
  { 
    category: '效率需求', 
    icon: '⚡', 
    items: ['入住等待', '退房结账', '行李寄存'], 
    intensity: 72, 
    trend: '↑',
    positive: ['"前台办理很快，5分钟搞定" - 携程', '"提前到店也给办了入住" - 美团'],
    negative: ['"下午3点排队等了25分钟" - 携程', '"退房结账等了好久" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '前台办理很快，礼宾还帮忙拿行李到房间', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: '携程用户_A8K***', orderId: 'CT20241210001' },
      { platform: '携程' as ReviewPlatform, content: '下午3点到的，前台只有一个人，排队等了25分钟', date: '2024-12-08', rating: 3, sentiment: 'negative' as const, userName: '商旅达人小王', orderId: 'CT20241208032' },
      { platform: '美团' as ReviewPlatform, content: '提前到店也给办了早入住，没有额外收费', date: '2024-12-09', rating: 5, sentiment: 'positive' as const, userName: 'M_136****8821', orderId: 'MT20241209015' },
      { platform: '美团' as ReviewPlatform, content: '周末入住高峰期等了很久，前台应该多安排人手', date: '2024-12-07', rating: 2, sentiment: 'negative' as const, userName: '上海吃喝玩乐', orderId: 'MT20241207088' },
      { platform: '飞猪' as ReviewPlatform, content: '行李寄存很方便，礼宾服务专业', date: '2024-12-11', rating: 4, sentiment: 'positive' as const, userName: '飞猪会员_杭州', orderId: 'FZ20241211002' },
      { platform: 'Booking' as ReviewPlatform, content: 'Smooth check-in, staff remembered my name from previous stay', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: 'Michael_Chen', orderId: 'BK20241210018' },
      { platform: 'Expedia' as ReviewPlatform, content: 'Check-in took 20 minutes during peak hours, needs improvement', date: '2024-12-06', rating: 3, sentiment: 'negative' as const, userName: 'TravellerJane', orderId: 'EX20241206005' },
      { platform: 'Agoda' as ReviewPlatform, content: 'Express check-out was convenient, no queue at all', date: '2024-12-09', rating: 4, sentiment: 'positive' as const, userName: 'SG_Traveller88', orderId: 'AG20241209011' },
    ],
  },
  { 
    category: '舒适需求', 
    icon: '🛏️', 
    items: ['隔音效果', '床品质量', '浴室体验'], 
    intensity: 78, 
    trend: '↑',
    positive: ['"床垫软硬适中，睡得很香" - 携程', '"雨淋花洒水压很足" - 美团'],
    negative: ['"靠马路的房间凌晨还能听到车声" - 携程', '"空调出风口正对床头" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '床垫软硬适中，枕头有多种选择，睡眠质量很好', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: '携程用户_睡眠挑剔', orderId: 'CT20241210045' },
      { platform: '携程' as ReviewPlatform, content: '房间靠马路，外滩游客多，凌晨还能听到嘈杂声，建议换内侧房', date: '2024-12-09', rating: 2, sentiment: 'negative' as const, userName: '出差狂人老李', orderId: 'CT20241209078' },
      { platform: '美团' as ReviewPlatform, content: '浴室设计很棒，雨淋花洒水压足，浴缸也很大', date: '2024-12-08', rating: 5, sentiment: 'positive' as const, userName: 'M_精致生活家', orderId: 'MT20241208023' },
      { platform: '美团' as ReviewPlatform, content: '空调出风口正对床头，晚上吹得头疼，希望能调整', date: '2024-12-07', rating: 2, sentiment: 'negative' as const, userName: '158****3392', orderId: 'MT20241207056' },
      { platform: '飞猪' as ReviewPlatform, content: '房间安静，床品是高支棉的，很舒服', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: '阿里员工出差', orderId: 'FZ20241210008' },
      { platform: 'Booking' as ReviewPlatform, content: 'Room was spacious with great Bund view, surprisingly quiet', date: '2024-12-09', rating: 5, sentiment: 'positive' as const, userName: 'David_HK', orderId: 'BK20241209022' },
      { platform: 'Expedia' as ReviewPlatform, content: 'Street noise was an issue even on high floor, request a river view room', date: '2024-12-08', rating: 3, sentiment: 'negative' as const, userName: 'BusinessTraveler_US', orderId: 'EX20241208014' },
      { platform: 'Agoda' as ReviewPlatform, content: 'Excellent bed quality, slept like a baby', date: '2024-12-07', rating: 5, sentiment: 'positive' as const, userName: 'Tokyo_Couple', orderId: 'AG20241207009' },
    ],
  },
  { 
    category: '服务需求', 
    icon: '🙋', 
    items: ['前台态度', '客房响应', '礼宾服务'], 
    intensity: 85, 
    trend: '→',
    positive: ['"前台小姐姐记得我是会员，主动升房" - 携程', '"管家服务很贴心" - 美团'],
    negative: ['"客房送水等了40分钟" - 携程', '"打电话问路线，前台说不清楚" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '前台小姐姐认出我是优悦会金卡，主动升了江景房，感动', date: '2024-12-11', rating: 5, sentiment: 'positive' as const, userName: 'IHG金卡会员', orderId: 'CT20241211003' },
      { platform: '携程' as ReviewPlatform, content: '晚上10点要加床矿泉水，等了40分钟才送来，效率太低', date: '2024-12-09', rating: 2, sentiment: 'negative' as const, userName: '携程用户_K9M***', orderId: 'CT20241209099' },
      { platform: '美团' as ReviewPlatform, content: '管家推荐了附近很棒的本地餐厅，还帮忙订了位，太贴心了', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: '美食探店达人', orderId: 'MT20241210018' },
      { platform: '美团' as ReviewPlatform, content: '问前台附近景点怎么走，回答很敷衍，说不太清楚让我自己导航', date: '2024-12-08', rating: 3, sentiment: 'negative' as const, userName: '外地游客小张', orderId: 'MT20241208067' },
      { platform: '飞猪' as ReviewPlatform, content: '礼宾帮忙订了外滩观光的好位置，很专业', date: '2024-12-09', rating: 5, sentiment: 'positive' as const, userName: '飞猪钻石会员', orderId: 'FZ20241209016' },
      { platform: 'Booking' as ReviewPlatform, content: 'Concierge gave great local dining recommendations, very knowledgeable', date: '2024-12-08', rating: 5, sentiment: 'positive' as const, userName: 'FoodieFromLondon', orderId: 'BK20241208030' },
      { platform: 'Expedia' as ReviewPlatform, content: 'Housekeeping forgot to replenish toiletries twice, had to call each time', date: '2024-12-07', rating: 3, sentiment: 'negative' as const, userName: 'FrequentFlyer_Amy', orderId: 'EX20241207021' },
      { platform: 'Agoda' as ReviewPlatform, content: 'Staff was warm and attentive throughout my 3-night stay', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: 'KL_Explorer', orderId: 'AG20241210007' },
    ],
  },
  { 
    category: '早餐需求', 
    icon: '🍳', 
    items: ['本地特色', '品类丰富', '用餐环境'], 
    intensity: 68, 
    trend: '→',
    positive: ['"早餐有上海本地小笼和生煎" - 携程', '"能看到外滩景色，氛围很好" - 美团'],
    negative: ['"周末人太多，要排队等位" - 携程', '"热菜补得慢" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '早餐融合了本地特色，有现做的小笼包和葱油拌面，赞', date: '2024-12-11', rating: 5, sentiment: 'positive' as const, userName: '携程美食家', orderId: 'CT20241211028' },
      { platform: '携程' as ReviewPlatform, content: '周末早餐人太多，等了15分钟才有位置，建议分时段', date: '2024-12-09', rating: 3, sentiment: 'negative' as const, userName: '周末度假党', orderId: 'CT20241209055' },
      { platform: '美团' as ReviewPlatform, content: '餐厅能看到外滩和黄浦江，边吃早餐边看风景太惬意了', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: 'M_拍照达人', orderId: 'MT20241210033' },
      { platform: '美团' as ReviewPlatform, content: '鸡蛋档口只有一个人，现做蛋卷等了10分钟', date: '2024-12-08', rating: 3, sentiment: 'negative' as const, userName: '139****2288', orderId: 'MT20241208041' },
      { platform: '飞猪' as ReviewPlatform, content: '咖啡是现磨的，果汁是鲜榨的，品质不错', date: '2024-12-09', rating: 4, sentiment: 'positive' as const, userName: '咖啡控_杭州', orderId: 'FZ20241209024' },
      { platform: 'Booking' as ReviewPlatform, content: 'Breakfast with Bund view was the highlight of my stay', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: 'ViewHunter_EU', orderId: 'BK20241210025' },
      { platform: 'Expedia' as ReviewPlatform, content: 'Breakfast area was crowded on weekends, arrive early', date: '2024-12-07', rating: 3, sentiment: 'neutral' as const, userName: 'WeekendGetaway', orderId: 'EX20241207033' },
      { platform: 'Agoda' as ReviewPlatform, content: 'Loved the local Shanghai dishes at breakfast, authentic taste', date: '2024-12-08', rating: 5, sentiment: 'positive' as const, userName: 'SG_FamilyTrip', orderId: 'AG20241208015' },
    ],
  },
  { 
    category: '性价比需求', 
    icon: '💰', 
    items: ['会员权益', '房价水平', '附加价值'], 
    intensity: 75, 
    trend: '↑',
    positive: ['"优悦会白金卡给升了套房" - 携程', '"含早价格比外面划算" - 美团'],
    negative: ['"外滩位置贵可以理解，但设施感觉配不上这个价" - 携程', '"迷你吧价格离谱" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '优悦会白金卡直接升了带阳台的套房，会员权益给力', date: '2024-12-11', rating: 5, sentiment: 'positive' as const, userName: 'IHG白金会员_老刘', orderId: 'CT20241211056' },
      { platform: '携程' as ReviewPlatform, content: '外滩地段贵理解，但2000多的房间设施有点老旧了', date: '2024-12-05', rating: 3, sentiment: 'negative' as const, userName: '性价比研究员', orderId: 'CT20241205082' },
      { platform: '美团' as ReviewPlatform, content: '含双早的套餐比单订房+早餐划算很多，推荐', date: '2024-12-10', rating: 4, sentiment: 'positive' as const, userName: 'M_省钱小能手', orderId: 'MT20241210066' },
      { platform: '美团' as ReviewPlatform, content: '迷你吧一瓶可乐50块，建议自带饮料', date: '2024-12-06', rating: 2, sentiment: 'negative' as const, userName: '132****7766', orderId: 'MT20241206029' },
      { platform: '飞猪' as ReviewPlatform, content: '双11活动价订的，比平时便宜500，性价比超高', date: '2024-12-09', rating: 5, sentiment: 'positive' as const, userName: '薅羊毛专家', orderId: 'FZ20241209038' },
      { platform: 'Booking' as ReviewPlatform, content: 'Worth every penny for the location and experience', date: '2024-12-08', rating: 4, sentiment: 'positive' as const, userName: 'LuxuryTraveller_UK', orderId: 'BK20241208042' },
      { platform: 'Expedia' as ReviewPlatform, content: 'A bit overpriced compared to similar hotels nearby, but location is unbeatable', date: '2024-12-07', rating: 3, sentiment: 'negative' as const, userName: 'BudgetWatcher', orderId: 'EX20241207048' },
      { platform: 'Agoda' as ReviewPlatform, content: 'Good deal with the member discount, will book again', date: '2024-12-10', rating: 4, sentiment: 'positive' as const, userName: 'Agoda_Gold_HK', orderId: 'AG20241210022' },
    ],
  },
  { 
    category: '邻里文化', 
    icon: '🎨', 
    items: ['在地设计', '文化活动', '社区连接'], 
    intensity: 88, 
    trend: '↑',
    positive: ['"大堂的老上海元素设计很惊艳" - 携程', '"酒店组织的弄堂探索活动太棒了" - Booking'],
    negative: ['"设计虽好但房间略小" - 携程', '"邻里活动时间不太合适" - 美团'],
    platformComments: [
      { platform: '携程' as ReviewPlatform, content: '大堂融合了老上海风情和现代设计，一进门就被惊艳到了', date: '2024-12-11', rating: 5, sentiment: 'positive' as const, userName: '设计师_Amy', orderId: 'CT20241211077' },
      { platform: '携程' as ReviewPlatform, content: '设计是好看，但为了设计感牺牲了房间空间，行李箱不好摊开', date: '2024-12-08', rating: 3, sentiment: 'negative' as const, userName: '带娃出行_麻麻', orderId: 'CT20241208094' },
      { platform: '美团' as ReviewPlatform, content: '电梯间的外滩老照片很有历史感，每层楼设计主题都不同', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: '摄影爱好者_小明', orderId: 'MT20241210078' },
      { platform: '美团' as ReviewPlatform, content: '想参加邻里文化活动但时间都在工作日白天，上班族参加不了', date: '2024-12-07', rating: 3, sentiment: 'negative' as const, userName: '周末游客_北京', orderId: 'MT20241207092' },
      { platform: '飞猪' as ReviewPlatform, content: '前台推荐的隐藏咖啡馆太惊喜了，真的很local，感谢', date: '2024-12-09', rating: 5, sentiment: 'positive' as const, userName: '探店博主_小红书', orderId: 'FZ20241209045' },
      { platform: 'Booking' as ReviewPlatform, content: 'The neighborhood walking tour was the best hotel activity I ever joined', date: '2024-12-08', rating: 5, sentiment: 'positive' as const, userName: 'CultureSeeker_Paris', orderId: 'BK20241208055' },
      { platform: 'Expedia' as ReviewPlatform, content: 'Beautiful design that captures the essence of old Shanghai', date: '2024-12-10', rating: 5, sentiment: 'positive' as const, userName: 'HistoryBuff_NYC', orderId: 'EX20241210008' },
      { platform: 'Agoda' as ReviewPlatform, content: 'Love how they incorporate local art and culture, very unique', date: '2024-12-09', rating: 5, sentiment: 'positive' as const, userName: 'ArtLover_Taiwan', orderId: 'AG20241209028' },
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
      includes: ['高级大床房1晚', '双人自助早餐', '双人下午茶', '延迟退房至14:00'],
    },
    {
      platform: '携程',
      name: '亲子欢乐住套餐',
      originalPrice: 1588,
      salePrice: 1088,
      validity: '2025-02-28',
      salesVolume: 856,
      includes: ['家庭房1晚', '三人自助早餐', '儿童欢迎礼包', '儿童乐园门票2张'],
    },
    {
      platform: '直客通',
      name: '商务尊享住宿券',
      originalPrice: 798,
      salePrice: 598,
      validity: '2025-06-30',
      salesVolume: 1256,
      includes: ['高级大床房1晚', '单人自助早餐', '行政酒廊使用'],
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

// ==================== 价格层级数据（城市 × 品牌档次 × 单店）====================
export interface HotelPriceData {
  id: string;
  name: string;
  brand: string;
  tier: BrandTier;
  basePrice: number; // 基础房型价格
  channels: {
    ctrip: number;
    douyin: number;
    zhiketong: number;
  };
  competitorAvg: number;
  diff: string;
}

export interface CityPriceData {
  city: string;
  region: string;
  avgPrice: number;
  change: string;
  byTier: Record<BrandTier, {
    ihgAvg: number;
    competitorAvg: number;
    diff: string;
    hotels: HotelPriceData[];
  }>;
}

export const cityPriceHierarchy: CityPriceData[] = [
  {
    city: '上海',
    region: '华东',
    avgPrice: 728,
    change: '+4.2%',
    byTier: {
      luxury_lifestyle: {
        ihgAvg: 1680,
        competitorAvg: 1750,
        diff: '-4%',
        hotels: [
          { id: 'sh-1', name: '上海外滩英迪格酒店', brand: '英迪格', tier: 'luxury_lifestyle', basePrice: 1580, channels: { ctrip: 1580, douyin: 1488, zhiketong: 1520 }, competitorAvg: 1650, diff: '-4%' },
          { id: 'sh-2', name: '上海浦东洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', basePrice: 1880, channels: { ctrip: 1880, douyin: 1780, zhiketong: 1820 }, competitorAvg: 1950, diff: '-4%' },
          { id: 'sh-3', name: '上海新天地朗廷酒店', brand: '丽晶', tier: 'luxury_lifestyle', basePrice: 2180, channels: { ctrip: 2180, douyin: 1980, zhiketong: 2080 }, competitorAvg: 2250, diff: '-3%' },
        ],
      },
      premium: {
        ihgAvg: 728,
        competitorAvg: 698,
        diff: '+4%',
        hotels: [
          { id: 'sh-4', name: '上海浦东皇冠假日酒店', brand: '皇冠假日', tier: 'premium', basePrice: 758, channels: { ctrip: 758, douyin: 698, zhiketong: 728 }, competitorAvg: 718, diff: '+6%' },
          { id: 'sh-5', name: '上海虹桥voco酒店', brand: 'voco', tier: 'premium', basePrice: 698, channels: { ctrip: 698, douyin: 658, zhiketong: 678 }, competitorAvg: 678, diff: '+3%' },
        ],
      },
      essentials: {
        ihgAvg: 358,
        competitorAvg: 328,
        diff: '+9%',
        hotels: [
          { id: 'sh-6', name: '上海浦东假日酒店', brand: '假日酒店', tier: 'essentials', basePrice: 398, channels: { ctrip: 398, douyin: 358, zhiketong: 378 }, competitorAvg: 358, diff: '+11%' },
          { id: 'sh-7', name: '上海虹桥智选假日酒店', brand: '智选假日', tier: 'essentials', basePrice: 318, channels: { ctrip: 318, douyin: 288, zhiketong: 298 }, competitorAvg: 298, diff: '+7%' },
        ],
      },
      suites: {
        ihgAvg: 528,
        competitorAvg: 558,
        diff: '-5%',
        hotels: [
          { id: 'sh-8', name: '上海古北馨乐庭酒店', brand: '馨乐庭', tier: 'suites', basePrice: 528, channels: { ctrip: 528, douyin: 488, zhiketong: 508 }, competitorAvg: 558, diff: '-5%' },
        ],
      },
    },
  },
  {
    city: '北京',
    region: '华北',
    avgPrice: 688,
    change: '+2.8%',
    byTier: {
      luxury_lifestyle: {
        ihgAvg: 1580,
        competitorAvg: 1620,
        diff: '-2%',
        hotels: [
          { id: 'bj-1', name: '北京三里屯洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', basePrice: 1680, channels: { ctrip: 1680, douyin: 1580, zhiketong: 1620 }, competitorAvg: 1720, diff: '-2%' },
          { id: 'bj-2', name: '北京王府井英迪格酒店', brand: '英迪格', tier: 'luxury_lifestyle', basePrice: 1480, channels: { ctrip: 1480, douyin: 1380, zhiketong: 1420 }, competitorAvg: 1520, diff: '-3%' },
        ],
      },
      premium: {
        ihgAvg: 688,
        competitorAvg: 658,
        diff: '+5%',
        hotels: [
          { id: 'bj-3', name: '北京国贸皇冠假日酒店', brand: '皇冠假日', tier: 'premium', basePrice: 728, channels: { ctrip: 728, douyin: 668, zhiketong: 698 }, competitorAvg: 688, diff: '+6%' },
          { id: 'bj-4', name: '北京望京voco酒店', brand: 'voco', tier: 'premium', basePrice: 648, channels: { ctrip: 648, douyin: 598, zhiketong: 618 }, competitorAvg: 628, diff: '+3%' },
        ],
      },
      essentials: {
        ihgAvg: 338,
        competitorAvg: 308,
        diff: '+10%',
        hotels: [
          { id: 'bj-5', name: '北京朝阳假日酒店', brand: '假日酒店', tier: 'essentials', basePrice: 368, channels: { ctrip: 368, douyin: 328, zhiketong: 348 }, competitorAvg: 338, diff: '+9%' },
          { id: 'bj-6', name: '北京中关村智选假日酒店', brand: '智选假日', tier: 'essentials', basePrice: 308, channels: { ctrip: 308, douyin: 278, zhiketong: 288 }, competitorAvg: 278, diff: '+11%' },
        ],
      },
      suites: {
        ihgAvg: 498,
        competitorAvg: 528,
        diff: '-6%',
        hotels: [
          { id: 'bj-7', name: '北京CBD馨乐庭酒店', brand: '馨乐庭', tier: 'suites', basePrice: 498, channels: { ctrip: 498, douyin: 458, zhiketong: 478 }, competitorAvg: 528, diff: '-6%' },
        ],
      },
    },
  },
  {
    city: '广州',
    region: '华南',
    avgPrice: 658,
    change: '+3.5%',
    byTier: {
      luxury_lifestyle: {
        ihgAvg: 1480,
        competitorAvg: 1520,
        diff: '-3%',
        hotels: [
          { id: 'gz-1', name: '广州珠江新城洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', basePrice: 1580, channels: { ctrip: 1580, douyin: 1480, zhiketong: 1520 }, competitorAvg: 1620, diff: '-2%' },
          { id: 'gz-2', name: '广州天河英迪格酒店', brand: '英迪格', tier: 'luxury_lifestyle', basePrice: 1380, channels: { ctrip: 1380, douyin: 1280, zhiketong: 1320 }, competitorAvg: 1420, diff: '-3%' },
        ],
      },
      premium: {
        ihgAvg: 658,
        competitorAvg: 628,
        diff: '+5%',
        hotels: [
          { id: 'gz-3', name: '广州花园皇冠假日酒店', brand: '皇冠假日', tier: 'premium', basePrice: 698, channels: { ctrip: 698, douyin: 638, zhiketong: 668 }, competitorAvg: 658, diff: '+6%' },
        ],
      },
      essentials: {
        ihgAvg: 318,
        competitorAvg: 288,
        diff: '+10%',
        hotels: [
          { id: 'gz-4', name: '广州天河假日酒店', brand: '假日酒店', tier: 'essentials', basePrice: 338, channels: { ctrip: 338, douyin: 298, zhiketong: 318 }, competitorAvg: 308, diff: '+10%' },
          { id: 'gz-5', name: '广州番禺智选假日酒店', brand: '智选假日', tier: 'essentials', basePrice: 298, channels: { ctrip: 298, douyin: 268, zhiketong: 278 }, competitorAvg: 268, diff: '+11%' },
        ],
      },
      suites: {
        ihgAvg: 468,
        competitorAvg: 498,
        diff: '-6%',
        hotels: [
          { id: 'gz-6', name: '广州珠江馨乐庭酒店', brand: '馨乐庭', tier: 'suites', basePrice: 468, channels: { ctrip: 468, douyin: 428, zhiketong: 448 }, competitorAvg: 498, diff: '-6%' },
        ],
      },
    },
  },
  {
    city: '杭州',
    region: '华东',
    avgPrice: 618,
    change: '+2.1%',
    byTier: {
      luxury_lifestyle: {
        ihgAvg: 1380,
        competitorAvg: 1420,
        diff: '-3%',
        hotels: [
          { id: 'hz-1', name: '杭州西湖洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', basePrice: 1480, channels: { ctrip: 1480, douyin: 1380, zhiketong: 1420 }, competitorAvg: 1520, diff: '-3%' },
          { id: 'hz-2', name: '杭州滨江英迪格酒店', brand: '英迪格', tier: 'luxury_lifestyle', basePrice: 1280, channels: { ctrip: 1280, douyin: 1180, zhiketong: 1220 }, competitorAvg: 1320, diff: '-3%' },
        ],
      },
      premium: {
        ihgAvg: 618,
        competitorAvg: 588,
        diff: '+5%',
        hotels: [
          { id: 'hz-3', name: '杭州黄龙皇冠假日酒店', brand: '皇冠假日', tier: 'premium', basePrice: 658, channels: { ctrip: 658, douyin: 598, zhiketong: 628 }, competitorAvg: 618, diff: '+6%' },
        ],
      },
      essentials: {
        ihgAvg: 298,
        competitorAvg: 268,
        diff: '+11%',
        hotels: [
          { id: 'hz-4', name: '杭州西湖假日酒店', brand: '假日酒店', tier: 'essentials', basePrice: 318, channels: { ctrip: 318, douyin: 278, zhiketong: 298 }, competitorAvg: 288, diff: '+10%' },
          { id: 'hz-5', name: '杭州城北智选假日酒店', brand: '智选假日', tier: 'essentials', basePrice: 278, channels: { ctrip: 278, douyin: 248, zhiketong: 258 }, competitorAvg: 248, diff: '+12%' },
        ],
      },
      suites: {
        ihgAvg: 458,
        competitorAvg: 488,
        diff: '-6%',
        hotels: [
          { id: 'hz-6', name: '杭州滨江馨乐庭酒店', brand: '馨乐庭', tier: 'suites', basePrice: 458, channels: { ctrip: 458, douyin: 418, zhiketong: 438 }, competitorAvg: 488, diff: '-6%' },
        ],
      },
    },
  },
  {
    city: '深圳',
    region: '华南',
    avgPrice: 698,
    change: '+4.8%',
    byTier: {
      luxury_lifestyle: {
        ihgAvg: 1580,
        competitorAvg: 1650,
        diff: '-4%',
        hotels: [
          { id: 'sz-1', name: '深圳福田洲际酒店', brand: '洲际酒店', tier: 'luxury_lifestyle', basePrice: 1680, channels: { ctrip: 1680, douyin: 1580, zhiketong: 1620 }, competitorAvg: 1750, diff: '-4%' },
          { id: 'sz-2', name: '深圳南山英迪格酒店', brand: '英迪格', tier: 'luxury_lifestyle', basePrice: 1480, channels: { ctrip: 1480, douyin: 1380, zhiketong: 1420 }, competitorAvg: 1550, diff: '-5%' },
        ],
      },
      premium: {
        ihgAvg: 698,
        competitorAvg: 668,
        diff: '+4%',
        hotels: [
          { id: 'sz-3', name: '深圳会展中心皇冠假日酒店', brand: '皇冠假日', tier: 'premium', basePrice: 738, channels: { ctrip: 738, douyin: 678, zhiketong: 708 }, competitorAvg: 698, diff: '+6%' },
        ],
      },
      essentials: {
        ihgAvg: 348,
        competitorAvg: 318,
        diff: '+9%',
        hotels: [
          { id: 'sz-4', name: '深圳宝安假日酒店', brand: '假日酒店', tier: 'essentials', basePrice: 368, channels: { ctrip: 368, douyin: 328, zhiketong: 348 }, competitorAvg: 338, diff: '+9%' },
          { id: 'sz-5', name: '深圳龙岗智选假日酒店', brand: '智选假日', tier: 'essentials', basePrice: 328, channels: { ctrip: 328, douyin: 298, zhiketong: 308 }, competitorAvg: 298, diff: '+10%' },
        ],
      },
      suites: {
        ihgAvg: 508,
        competitorAvg: 538,
        diff: '-6%',
        hotels: [
          { id: 'sz-6', name: '深圳福田馨乐庭酒店', brand: '馨乐庭', tier: 'suites', basePrice: 508, channels: { ctrip: 508, douyin: 468, zhiketong: 488 }, competitorAvg: 538, diff: '-6%' },
        ],
      },
    },
  },
];

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
