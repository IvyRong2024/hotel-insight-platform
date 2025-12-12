import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, Badge } from '../components/ui';
import { actionsData } from '../data/mockData';
import { AlertCircle, Clock, CheckCircle2, Circle, User, ArrowRight, Filter, Building2 } from 'lucide-react';
import clsx from 'clsx';

type ActionStatus = 'all' | 'pending' | 'in_progress' | 'completed';
type ActionPriority = 'all' | 'urgent' | 'high' | 'medium' | 'low';

export function ActionCenter() {
  const [statusFilter, setStatusFilter] = useState<ActionStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<ActionPriority>('all');

  const filteredActions = actionsData.filter((action) => {
    if (statusFilter !== 'all' && action.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && action.priority !== priorityFilter) return false;
    return true;
  });

  const statusCounts = {
    all: actionsData.length,
    pending: actionsData.filter((a) => a.status === 'pending').length,
    in_progress: actionsData.filter((a) => a.status === 'in_progress').length,
    completed: actionsData.filter((a) => a.status === 'completed').length,
  };

  const priorityConfig = {
    urgent: { label: '紧急', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    high: { label: '高优', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    medium: { label: '中等', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    low: { label: '低', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
  };

  const statusConfig = {
    pending: { label: '待处理', icon: Circle, color: 'text-slate-400', bg: 'bg-slate-100' },
    in_progress: { label: '进行中', icon: Clock, color: 'text-ihg-navy', bg: 'bg-ihg-navy/10' },
    completed: { label: '已完成', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  };

  return (
    <Layout title="Action Center" subtitle="行动中心 · IHG酒店运营改进建议" requiredModule="actions">
      
      {/* 状态统计 */}
      <section className="mb-6 animate-fade-in-up">
        <div className="grid grid-cols-4 gap-4">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => {
            const config = status === 'all' ? null : statusConfig[status];
            const Icon = config?.icon || AlertCircle;
            const isActive = statusFilter === status;
            
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={clsx(
                  'p-5 rounded-2xl border-2 text-left transition-all',
                  isActive ? 'border-ihg-navy bg-ihg-navy/5' : 'border-slate-100 bg-white hover:border-slate-200'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-500">
                    {status === 'all' ? '全部行动' : config?.label}
                  </span>
                  <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', config?.bg || 'bg-slate-100')}>
                    <Icon size={16} className={config?.color || 'text-slate-500'} />
                  </div>
                </div>
                <div className={clsx('text-3xl font-bold', isActive ? 'text-ihg-navy' : 'text-slate-800')}>
                  {statusCounts[status]}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 优先级筛选 */}
      <section className="mb-6 animate-fade-in-up delay-100">
        <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm text-slate-500">优先级筛选：</span>
          <div className="flex gap-2">
            {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                  priorityFilter === priority
                    ? 'bg-ihg-navy text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                )}
              >
                {priority === 'all' ? '全部' : priorityConfig[priority].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 行动列表 */}
      <section className="animate-fade-in-up delay-200">
        <Card padding="none">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">行动建议列表</h3>
            <p className="text-sm text-slate-500">共 {filteredActions.length} 项行动建议</p>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredActions.map((action) => {
              const priority = priorityConfig[action.priority as keyof typeof priorityConfig];
              const status = statusConfig[action.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <div 
                  key={action.id} 
                  className={clsx(
                    'p-5 hover:bg-slate-50 transition-all',
                    action.priority === 'urgent' && 'border-l-4 border-l-red-500'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* 优先级标识 */}
                    <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center border-2', priority.bg, priority.border)}>
                      <span className={clsx('text-sm font-bold', priority.color)}>{priority.label}</span>
                    </div>

                    {/* 主要内容 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400">{action.id}</span>
                        <Badge variant="info">{action.category}</Badge>
                      </div>
                      <h4 className="text-base font-semibold text-slate-800 mb-1">{action.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Building2 size={14} />
                        <span>{action.hotel}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">来源: {action.source}</span>
                        <span className="text-emerald-600">预期: {action.impact}</span>
                      </div>
                    </div>

                    {/* 右侧信息 */}
                    <div className="text-right">
                      <div className={clsx('flex items-center gap-1.5 mb-2', status.color)}>
                        <StatusIcon size={14} />
                        <span className="text-sm font-medium">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                        <Clock size={12} />
                        <span>截止 {action.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <User size={12} />
                        <span>{action.assignee}</span>
                      </div>
                    </div>
                  </div>

                  {action.status !== 'completed' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                      <button className="flex items-center gap-2 px-4 py-2 bg-ihg-navy text-white rounded-lg hover:bg-ihg-navy-light transition-all text-sm font-medium">
                        {action.status === 'pending' ? '开始处理' : '标记完成'}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </section>
    </Layout>
  );
}
