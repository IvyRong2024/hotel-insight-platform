import { createContext, useContext, useState, ReactNode } from 'react';
import { BrandTier } from '../data/mockData';

export type UserRole = 'platform_admin' | 'brand_ops' | 'brand_ops_luxury' | 'brand_ops_premium' | 'brand_ops_essentials' | 'brand_ops_suites' | 'region_vp' | 'city_mgr' | 'hotel_mgr' | 'hotel_mgr_new' | 'revenue_mgr';

interface RoleConfig {
  id: UserRole;
  name: string;
  level: string;
  description: string;
  region?: string;
  city?: string;
  hotel?: string;
  hotelId?: string;
  brandTier?: BrandTier | 'all'; // 品牌运营负责的品牌类型
  accessModules: string[];
}

export const roleConfigs: RoleConfig[] = [
  { 
    id: 'platform_admin', 
    name: '平台管理员', 
    level: '系统',
    description: '平台配置与监测管理：酒店列表、品牌对标、用户权限',
    accessModules: ['overview', 'config'],
  },
  { 
    id: 'brand_ops', 
    name: '品牌运营总监', 
    level: '全国 · 全品牌',
    description: '全品牌视角：洲际、丽晶、六善、金普顿、英迪格、皇冠假日、voco、假日、智选假日等',
    brandTier: 'all',
    accessModules: ['overview', 'brand'],
  },
  { 
    id: 'brand_ops_luxury', 
    name: '品牌运营 - Luxury & Lifestyle', 
    level: '全国 · 奢华及生活方式',
    description: '负责品牌：洲际酒店、丽晶、六善、金普顿、英迪格',
    brandTier: 'luxury_lifestyle',
    accessModules: ['overview', 'brand'],
  },
  { 
    id: 'brand_ops_premium', 
    name: '品牌运营 - Premium', 
    level: '全国 · 高端',
    description: '负责品牌：皇冠假日、voco、EVEN Hotels',
    brandTier: 'premium',
    accessModules: ['overview', 'brand'],
  },
  { 
    id: 'brand_ops_essentials', 
    name: '品牌运营 - Essentials', 
    level: '全国 · 精选服务',
    description: '负责品牌：假日酒店、智选假日',
    brandTier: 'essentials',
    accessModules: ['overview', 'brand'],
  },
  { 
    id: 'brand_ops_suites', 
    name: '品牌运营 - Suites', 
    level: '全国 · 长住',
    description: '负责品牌：馨乐庭、Atwell Suites',
    brandTier: 'suites',
    accessModules: ['overview', 'brand'],
  },
  { 
    id: 'region_vp', 
    name: '大区负责人', 
    level: '华东区',
    description: '为大区负责人提供区域级经营诊断，按城市×品牌类型矩阵分析',
    region: '华东',
    accessModules: ['overview', 'hotel', 'actions'],
  },
  { 
    id: 'city_mgr', 
    name: '城市负责人', 
    level: '上海市',
    description: '为城市负责人提供城市级经营诊断，按品牌类型分析门店表现',
    region: '华东',
    city: '上海市',
    accessModules: ['overview', 'hotel', 'actions'],
  },
  { 
    id: 'hotel_mgr', 
    name: '酒店店长（成熟门店）', 
    level: '上海虹桥皇冠假日酒店',
    description: '成熟门店店长：查看门店排名、用户反馈与待办事项',
    region: '华东',
    city: '上海市',
    hotel: '上海虹桥皇冠假日酒店',
    hotelId: 'h1',
    accessModules: ['overview', 'hotel', 'actions'],
  },
  { 
    id: 'hotel_mgr_new', 
    name: '酒店店长（新店）', 
    level: '杭州西湖假日酒店 · 开业58天',
    description: '新店店长：关注0-180天运营稳定性、体验成熟度与阶段行动',
    region: '华东',
    city: '杭州',
    hotel: '杭州西湖假日酒店',
    hotelId: 'new-1',
    accessModules: ['overview', 'hotel', 'actions'],
  },
  { 
    id: 'revenue_mgr', 
    name: '定价团队', 
    level: '全国',
    description: '为定价团队提供价格策略与竞对洞察，含渠道价差与券类产品分析',
    accessModules: ['overview', 'price'],
  },
];

interface AuthContextType {
  isLoggedIn: boolean;
  currentRole: RoleConfig | null;
  login: (roleId: UserRole) => void;
  logout: () => void;
  canAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleConfig | null>(null);

  const login = (roleId: UserRole) => {
    const role = roleConfigs.find(r => r.id === roleId);
    if (role) {
      setCurrentRole(role);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    setCurrentRole(null);
    setIsLoggedIn(false);
  };

  const canAccess = (module: string) => {
    if (!currentRole) return false;
    return currentRole.accessModules.includes(module);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentRole, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
