import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { actionsData, brandTiers, BrandTier } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Zap, Clock, CheckCircle, Filter, ChevronDown, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export function ActionCenter() {
  const { currentRole } = useAuth();
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<BrandTier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!currentRole) return null;

  // 根据角色筛选行动
  const getActionsForRole = () => {
    let filtered = [...actionsData];

    // 酒店店长（成熟门店/新店）只看自己酒店的
    if ((currentRole.id === 'hotel_mgr' || currentRole.id === 'hotel_mgr_new') && currentRole.hotelId) {
      filtered = filtered.filter(a => a.hotelId === currentRole.hotelId);
    }
    // 城市负责人看自己城市的
    else if (currentRole.id === 'city_mgr' && currentRole.city) {
      filtered = filtered.filter(a => a.city === '上海'); // 模拟数据用上海
    }
    // 大区负责人看自己区域的
    else if (currentRole.id === 'region_vp' && currentRole.region) {
      filtered = filtered.filter(a => a.region === '华东'); // 模拟数据用华东
    }

    // 应用筛选器
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(a => a.priority === priorityFilter);
    }
    if (tierFilter !== 'all') {
      filtered = filtered.filter(a => a.tier === tierFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    return filtered;
  };

  const actions = getActionsForRole();
  const pendingCount = actions.filter(a => a.status === 'pending').length;
  const inProgressCount = actions.filter(a => a.status === 'in_progress').length;
  const completedCount = actions.filter(a => a.status === 'completed').length;

  const urgentActions = actions.filter(a => a.priority === 'urgent' && a.status !== 'completed');
  const highActions = actions.filter(a => a.priority === 'high' && a.status !== 'completed');
  const otherActions = actions.filter(a => (a.priority === 'medium' || a.priority === 'low') && a.status !== 'completed');
  const completedActions = actions.filter(a => a.status === 'completed');

  return (
    <Layout title="Action Center" subtitle="可执行行动管理与追踪" requiredModule="actions">
      <div className="space-y-6">
        {/* 统计概览 */}
        <section className="animate-fade-in-up">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-ihg-navy to-ihg-navy-light text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-white/60 text-sm">待处理</p>
                  <p className="text-3xl font-bold">{pendingCount + inProgressCount}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">紧急</p>
                  <p className="text-3xl font-bold text-red-600">{urgentActions.length}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">进行中</p>
                  <p className="text-3xl font-bold text-amber-600">{inProgressCount}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">已完成</p>
                  <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 筛选器 */}
        <section className="animate-fade-in-up delay-50">
          <Card padding="sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter size={16} />
                筛选：
              </div>
              
              {/* 优先级筛选 */}
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none bg-slate-100 border-0 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-ihg-navy"
                >
                  <option value="all">全部优先级</option>
                  <option value="urgent">紧急</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* 品牌类型筛选 */}
              <div className="relative">
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as BrandTier | 'all')}
                  className="appearance-none bg-slate-100 border-0 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-ihg-navy"
                >
                  <option value="all">全部类型</option>
                  {Object.entries(brandTiers).map(([key, tier]) => (
                    <option key={key} value={key}>{tier.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* 状态筛选 */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-slate-100 border-0 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-ihg-navy"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待处理</option>
                  <option value="in_progress">进行中</option>
                  <option value="completed">已完成</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {(priorityFilter !== 'all' || tierFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setPriorityFilter('all');
                    setTierFilter('all');
                    setStatusFilter('all');
                  }}
                  className="text-sm text-ihg-navy hover:underline"
                >
                  清除筛选
                </button>
              )}
            </div>
          </Card>
        </section>

        {/* 紧急行动 */}
        {urgentActions.length > 0 && (
          <section className="animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-slate-800">🔴 紧急</h3>
              <Badge variant="danger">{urgentActions.length}</Badge>
            </div>
            <div className="space-y-3">
              {urgentActions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </section>
        )}

        {/* 高优先级 */}
        {highActions.length > 0 && (
          <section className="animate-fade-in-up delay-150">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-slate-800">🟡 高优先级</h3>
              <Badge variant="warning">{highActions.length}</Badge>
            </div>
            <div className="space-y-3">
              {highActions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </section>
        )}

        {/* 中低优先级 */}
        {otherActions.length > 0 && (
          <section className="animate-fade-in-up delay-200">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-slate-800">🟢 中/低优先级</h3>
              <Badge variant="info">{otherActions.length}</Badge>
            </div>
            <div className="space-y-3">
              {otherActions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </section>
        )}

        {/* 已完成 */}
        {completedActions.length > 0 && (
          <section className="animate-fade-in-up delay-250">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-slate-800">✅ 已完成</h3>
              <Badge variant="success">{completedActions.length}</Badge>
            </div>
            <div className="space-y-3">
              {completedActions.map((action) => (
                <ActionCard key={action.id} action={action} completed />
              ))}
            </div>
          </section>
        )}

        {/* 空状态 */}
        {actions.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">暂无待办行动</h3>
            <p className="text-slate-500">所有行动已完成或不在当前筛选范围内</p>
          </Card>
        )}
      </div>
    </Layout>
  );
}

// 行动卡片组件
function ActionCard({ action, completed = false }: { action: typeof actionsData[0], completed?: boolean }) {
  return (
    <Card 
      className={clsx(
        'border-l-4 transition-all',
        completed ? 'border-l-emerald-500 bg-emerald-50/30 opacity-75' :
        action.priority === 'urgent' ? 'border-l-red-500 bg-red-50/30' : 
        action.priority === 'high' ? 'border-l-amber-500' : 'border-l-slate-300'
      )} 
      padding="sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            completed ? 'bg-emerald-100' :
            action.priority === 'urgent' ? 'bg-red-100' : 
            action.priority === 'high' ? 'bg-amber-100' : 'bg-slate-100'
          )}>
            {completed ? (
              <CheckCircle size={24} className="text-emerald-600" />
            ) : action.status === 'in_progress' ? (
              <Clock size={24} className="text-amber-600" />
            ) : (
              <Zap size={24} className={clsx(
                action.priority === 'urgent' ? 'text-red-600' : 
                action.priority === 'high' ? 'text-amber-600' : 'text-slate-600'
              )} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={clsx(
                'font-semibold',
                completed ? 'text-slate-500 line-through' : 'text-slate-800'
              )}>
                {action.title}
              </span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ 
                backgroundColor: brandTiers[action.tier].color + '20', 
                color: brandTiers[action.tier].color 
              }}>
                {brandTiers[action.tier].name}
              </span>
              {action.status === 'in_progress' && (
                <Badge variant="warning">进行中</Badge>
              )}
            </div>
            <div className="text-sm text-slate-500">
              {action.hotel} · {action.category}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {action.impact}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">截止日期</div>
            <div className={clsx(
              'text-sm font-medium',
              completed ? 'text-slate-400' : 'text-slate-700'
            )}>
              {action.deadline}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">负责人</div>
            <div className="text-sm font-medium text-slate-700">{action.assignee}</div>
          </div>
          {!completed && (
            <button className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium',
              action.priority === 'urgent' ? 'bg-red-600 text-white hover:bg-red-700' :
              action.priority === 'high' ? 'bg-amber-500 text-white hover:bg-amber-600' :
              'bg-ihg-navy text-white hover:bg-ihg-navy-light'
            )}>
              {action.status === 'in_progress' ? '查看进度' : '开始处理'}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
