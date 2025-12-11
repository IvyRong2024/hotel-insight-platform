// ==================== 平台配置 ====================
export const platformConfig = {
  review: {
    name: '评论监测平台',
    platforms: ['携程', '美团', '飞猪', 'Booking', 'Expedia', 'Agoda'],
    coverage: { brands: '8k+', hotels: '5k+' },
  },
  price: {
    name: '价格监测平台',
    platforms: ['携程', '抖音', '直客通'],
    coverage: { hotels: '5k+' },
  },
};

// ==================== 品牌配置 (IHG 为主品牌) ====================
export const brandConfig = {
  main: {
    group: 'IHG洲际酒店集团',
    brands: [
      { name: '洲际酒店', tier: '高端', code: 'IC' },
      { name: '华邑酒店', tier: '高端', code: 'HUALUXE' },
      { name: '皇冠假日', tier: '中高端', code: 'CP' },
      { name: '假日酒店', tier: '中端', code: 'HI' },
      { name: '智选假日', tier: '经济型', code: 'HIX' },
      { name: '英迪格', tier: '精品', code: 'INDIGO' },
    ],
  },
  competitors: [
    { group: '万豪国际', brands: ['万豪酒店', '喜来登', '威斯汀', 'W酒店', '万怡酒店'] },
    { group: '希尔顿集团', brands: ['希尔顿酒店', '希尔顿花园', 'Hampton', '康莱德'] },
    { group: '雅高集团', brands: ['索菲特', '诺富特', '美居酒店', '宜必思'] },
    { group: '凯悦集团', brands: ['柏悦', '君悦', '凯悦酒店', '凯悦嘉轩'] },
  ],
};

// ==================== 品牌健康指数 ====================
export const brandHealthData = {
  overallScore: 4.52,
  sentimentIndex: 78.5,
  experienceIndex: 82.1,
  above45Ratio: 67.8,
  trends: {
    overallScore: '+3.2%',
    sentimentIndex: '+2.1%',
    experienceIndex: '+1.8%',
    above45Ratio: '+4.5%',
  },
  trendData: [
    { date: '11-11', score: 4.45, sentiment: 75 },
    { date: '11-18', score: 4.48, sentiment: 76 },
    { date: '11-25', score: 4.50, sentiment: 77 },
    { date: '12-02', score: 4.51, sentiment: 78 },
    { date: '12-09', score: 4.52, sentiment: 78.5 },
  ],
};

// ==================== 品牌承诺验证 ====================
export const promiseFulfillmentData = [
  { promise: '高效入住', score: 85, status: 'fulfilled', mentions: 2341, icon: '⚡' },
  { promise: '温暖服务', score: 72, status: 'partial', mentions: 1856, icon: '❤️' },
  { promise: '设计美学', score: 68, status: 'partial', mentions: 1203, icon: '🎨' },
  { promise: '智能体验', score: 45, status: 'unfulfilled', mentions: 892, icon: '🤖' },
  { promise: '安心卫生', score: 91, status: 'fulfilled', mentions: 3102, icon: '✨' },
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
  { barrier: '隔音问题', severity: 'high', mentions: 1245, trend: '↑', rooms: ['走廊房', '电梯旁'], impact: -0.28 },
  { barrier: '设施老化', severity: 'medium', mentions: 892, trend: '→', items: ['空调', '淋浴'], impact: -0.18 },
  { barrier: '入住等待', severity: 'medium', mentions: 756, trend: '↓', peak: '14:00-16:00', impact: -0.15 },
  { barrier: '早餐单一', severity: 'low', mentions: 534, trend: '→', category: '热食', impact: -0.08 },
  { barrier: '停车困难', severity: 'low', mentions: 423, trend: '→', type: '市区门店', impact: -0.05 },
];

// ==================== 竞对对比 (IHG vs 竞品) ====================
export const competitorData = {
  brands: ['IHG洲际', '万豪国际', '希尔顿', '雅高集团'],
  colors: ['#0066FF', '#8b5cf6', '#f59e0b', '#6b7280'],
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
};

// ==================== 酒店健康度 ====================
export const hotelHealthData = {
  hotelName: '上海外滩英迪格酒店',
  brand: '英迪格',
  platforms: [
    { name: '携程', score: 4.6, rank: 12, total: 156 },
    { name: '美团', score: 4.5, rank: 18, total: 156 },
    { name: '飞猪', score: 4.7, rank: 8, total: 156 },
    { name: 'Booking', score: 8.8, rank: 15, total: 156 },
    { name: 'Agoda', score: 8.6, rank: 22, total: 156 },
  ],
  overallScore: 4.55,
  overallRank: 45,
  dimensions: {
    labels: ['清洁', '服务', '早餐', '设施', '舒适度', '位置'],
    hotel: [4.8, 4.6, 4.3, 4.2, 4.5, 4.7],
    cityAvg: [4.5, 4.4, 4.2, 4.3, 4.4, 4.5],
    brandAvg: [4.6, 4.5, 4.4, 4.4, 4.5, 4.4],
  },
};

// ==================== 酒店驱动因素 ====================
export const hotelDriversData = [
  {
    dimension: '服务响应',
    score: 4.7,
    contribution: 28,
    vsCity: '+0.3',
    vsBrand: '+0.2',
    keywords: ['前台小姐姐很热情', '行李员主动帮忙', '问题响应快'],
    trend: 'stable',
  },
  {
    dimension: '房间舒适度',
    score: 4.5,
    contribution: 22,
    vsCity: '+0.1',
    vsBrand: '0',
    keywords: ['床很软', '枕头舒服', '安静'],
    trend: 'up',
  },
  {
    dimension: '位置交通',
    score: 4.8,
    contribution: 18,
    vsCity: '+0.4',
    vsBrand: '+0.3',
    keywords: ['地铁口', '商圈近', '出行方便'],
    trend: 'stable',
  },
  {
    dimension: '品牌信任',
    score: 4.4,
    contribution: 15,
    vsCity: '+0.2',
    vsBrand: '-0.1',
    keywords: ['IHG会员', '品质稳定', '优悦会积分'],
    trend: 'up',
  },
  {
    dimension: '价格合理',
    score: 4.2,
    contribution: 12,
    vsCity: '-0.1',
    vsBrand: '0',
    keywords: ['性价比', '会员折扣', '物有所值'],
    trend: 'down',
  },
];

// ==================== 酒店障碍因素 ====================
export const hotelBarriersData = {
  journeyRisks: [
    { stage: '预订', risk: 'low', issues: ['价格波动'], count: 12, icon: '📅' },
    { stage: '入住', risk: 'medium', issues: ['排队等待', '证件识别慢'], count: 45, icon: '🚪' },
    { stage: '房间', risk: 'high', issues: ['隔音差', '空调异响', '热水不稳'], count: 89, icon: '🛏️' },
    { stage: '服务', risk: 'low', issues: ['早餐补餐慢'], count: 23, icon: '🍳' },
    { stage: '退房', risk: 'low', issues: ['发票等待'], count: 8, icon: '✅' },
  ],
  clusters: {
    roomType: [
      { type: '大床房', percentage: 35 },
      { type: '双床房', percentage: 28 },
      { type: '套房', percentage: 12 },
      { type: '其他', percentage: 25 },
    ],
    floor: [
      { type: '低楼层', percentage: 42 },
      { type: '中楼层', percentage: 40 },
      { type: '高楼层', percentage: 18 },
    ],
    timing: [
      { type: '节假日', percentage: 55 },
      { type: '工作日', percentage: 45 },
    ],
  },
};

// ==================== 用户需求 ====================
export const userNeedsData = [
  { category: '效率需求', icon: '⚡', items: ['快速入住', '自助办理', '无接触服务'], intensity: 85, trend: '↑' },
  { category: '舒适需求', icon: '🛏️', items: ['隔音好', '床品升级', '遮光窗帘'], intensity: 78, trend: '↑' },
  { category: '服务需求', icon: '🙋', items: ['响应速度', '态度温度', '问题解决'], intensity: 72, trend: '→' },
  { category: '早餐需求', icon: '🍳', items: ['品种丰富', '补餐及时', '健康选项'], intensity: 68, trend: '→' },
  { category: '性价比需求', icon: '💰', items: ['价格透明', '优悦会权益', '升房体验'], intensity: 82, trend: '↑' },
  { category: '文化共鸣', icon: '🎨', items: ['在地设计', '品牌调性', '邻里文化'], intensity: 45, trend: '↑' },
];

// ==================== 新店评估 ====================
export const newOpeningData = {
  hotelName: '杭州西湖假日酒店',
  brand: '假日酒店',
  openDate: '2024-10-15',
  daysOpen: 58,
  stabilityScore: 72,
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

// ==================== 行动中心 ====================
export const actionsData = [
  {
    id: 'ACT-001',
    priority: 'urgent',
    category: '设施维护',
    title: '3楼走廊隔音板加装',
    hotel: '上海外滩英迪格酒店',
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
    hotel: '北京金融街洲际酒店',
    source: '入住体验风险',
    impact: '预计缩短等待时间50%',
    deadline: '2024-12-15',
    status: 'in_progress',
    assignee: '培训部',
  },
  {
    id: 'ACT-003',
    priority: 'medium',
    category: '早餐优化',
    title: '热食补餐流程优化',
    hotel: '广州天河皇冠假日酒店',
    source: '早餐服务风险',
    impact: '预计减少投诉30%',
    deadline: '2024-12-25',
    status: 'pending',
    assignee: '餐饮部',
  },
  {
    id: 'ACT-004',
    priority: 'low',
    category: '运营流程',
    title: '停车场引导标识更新',
    hotel: '深圳华强北智选假日酒店',
    source: '用户需求识别',
    impact: '提升到店体验',
    deadline: '2025-01-10',
    status: 'completed',
    assignee: '运营部',
  },
];

// ==================== 价格数据 ====================
export const priceData = {
  regions: [
    { name: '华东', avgPrice: 658, change: '+5.2%', promoRate: 32 },
    { name: '华南', avgPrice: 712, change: '+3.8%', promoRate: 28 },
    { name: '华北', avgPrice: 625, change: '-1.2%', promoRate: 45 },
    { name: '西南', avgPrice: 478, change: '+2.1%', promoRate: 38 },
    { name: '华中', avgPrice: 492, change: '+0.5%', promoRate: 35 },
  ],
  brandPricing: {
    brands: ['IHG洲际', '万豪国际', '希尔顿', '雅高集团'],
    高端: [1580, 1650, 1720, 1380],
    中端: [658, 625, 712, 498],
    经济型: [318, 298, 345, 268],
  },
  valueIndex: [
    { brand: 'IHG洲际', value_index: 1.12, label: '高性价比' },
    { brand: '万豪国际', value_index: 1.05, label: '匹配' },
    { brand: '希尔顿', value_index: 0.92, label: '溢价' },
    { brand: '雅高集团', value_index: 1.18, label: '高性价比' },
  ],
  platformPrices: {
    hotel: '上海外滩英迪格酒店',
    roomType: '高级大床房',
    platforms: [
      { name: '直客通', price: 658, discounted: 628, benefit: '优悦会积分' },
      { name: '携程', price: 698, discounted: 668, benefit: '双早' },
      { name: '抖音', price: 618, discounted: 568, benefit: '次卡', validity: '90天' },
    ],
  },
  competitorPromos: [
    {
      competitor: '万豪国际',
      campaign: '双12狂欢',
      discount: '5折起',
      startDate: '2024-12-10',
      endDate: '2024-12-15',
      channels: ['抖音', '携程'],
      threat: 'high',
    },
    {
      competitor: '希尔顿',
      campaign: '希尔顿荣誉客会员日',
      discount: '8折',
      startDate: '2024-12-12',
      endDate: '2024-12-12',
      channels: ['直客通'],
      threat: 'low',
    },
    {
      competitor: '雅高集团',
      campaign: '圣诞特惠',
      discount: '7折',
      startDate: '2024-12-20',
      endDate: '2024-12-26',
      channels: ['携程', '飞猪'],
      threat: 'medium',
    },
  ],
  trendData: [
    { date: '11-11', 'IHG洲际': 645, '万豪国际': 618, '希尔顿': 702, '雅高集团': 488 },
    { date: '11-18', 'IHG洲际': 652, '万豪国际': 622, '希尔顿': 708, '雅高集团': 492 },
    { date: '11-25', 'IHG洲际': 648, '万豪国际': 615, '希尔顿': 698, '雅高集团': 485 },
    { date: '12-02', 'IHG洲际': 655, '万豪国际': 620, '希尔顿': 705, '雅高集团': 495 },
    { date: '12-09', 'IHG洲际': 658, '万豪国际': 625, '希尔顿': 712, '雅高集团': 498 },
  ],
};

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
  brands: ['全部品牌', '洲际酒店', '华邑酒店', '皇冠假日', '假日酒店', '智选假日', '英迪格'],
  hotelTypes: ['全部', '高端', '中端', '经济型'],
  timeRanges: ['近7天', '近30天', '近90天', '自定义'],
  roles: [
    { id: 'brand_ops', name: '品牌运营', level: '全国' },
    { id: 'region_vp', name: '区域VP', level: '区域' },
    { id: 'province_mgr', name: '省级经理', level: '省' },
    { id: 'city_mgr', name: '城市经理', level: '城市' },
    { id: 'hotel_mgr', name: '酒店店长', level: '单店' },
  ],
};

// ==================== 洞察文案 ====================
export const insightsData = {
  opportunities: [
    '英迪格品牌"邻里文化"提及率上升23%，差异化优势明显',
    '商务客群对"智能入住"期待度持续攀升，IHG App使用率提升',
    '皇冠假日新一线城市早餐满意度高于一线城市8%',
  ],
  risks: [
    '智选假日"隔音"差评率连续3月上升，需重点关注',
    '万豪双12促销力度大，价格敏感用户流失风险增加',
    '假日酒店节假日前台效率投诉激增35%',
  ],
};
