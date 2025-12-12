import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'brand_ops' | 'region_vp' | 'province_mgr' | 'city_mgr' | 'hotel_mgr' | 'revenue_mgr';

interface RoleConfig {
  id: UserRole;
  name: string;
  level: string;
  region?: string;
  accessModules: string[];
}

export const roleConfigs: RoleConfig[] = [
  { 
    id: 'brand_ops', 
    name: '品牌运营', 
    level: '全国',
    accessModules: ['brand', 'price', 'overview']
  },
  { 
    id: 'region_vp', 
    name: '区域VP', 
    level: '华东区',
    region: '华东',
    accessModules: ['brand', 'hotel', 'actions', 'overview']
  },
  { 
    id: 'province_mgr', 
    name: '省级经理', 
    level: '浙江省',
    region: '华东',
    accessModules: ['hotel', 'actions', 'overview']
  },
  { 
    id: 'city_mgr', 
    name: '城市经理', 
    level: '杭州市',
    region: '华东',
    accessModules: ['hotel', 'actions', 'overview']
  },
  { 
    id: 'hotel_mgr', 
    name: '酒店店长', 
    level: '杭州西湖假日酒店',
    region: '华东',
    accessModules: ['hotel', 'actions']
  },
  { 
    id: 'revenue_mgr', 
    name: '收益管理', 
    level: '全国',
    accessModules: ['price', 'overview']
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

