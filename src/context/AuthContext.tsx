import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'brand_ops' | 'region_vp' | 'city_mgr' | 'hotel_mgr' | 'revenue_mgr';

interface RoleConfig {
  id: UserRole;
  name: string;
  level: string;
  description: string;
  region?: string;
  city?: string;
  hotel?: string;
  hotelId?: string;
  accessModules: string[];
}

export const roleConfigs: RoleConfig[] = [
  { 
    id: 'brand_ops', 
    name: '品牌运营', 
    level: '全国',
    description: '为品牌团队提供全国视角的真实品牌感知，含各品牌类型表现与竞品对比',
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
    name: '酒店店长', 
    level: '上海外滩英迪格酒店',
    description: '为单店运营部门提供可执行的链路改善方案，含排名与用户洞察',
    region: '华东',
    city: '上海市',
    hotel: '上海外滩英迪格酒店',
    hotelId: 'h3',
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
