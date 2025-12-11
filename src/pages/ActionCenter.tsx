import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader, Badge } from '../components/ui';
import { actionsData } from '../data/mockData';
import { AlertCircle, Clock, CheckCircle2, Circle, User, ArrowRight, Filter } from 'lucide-react';
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
    pending: actionsData.filter((a) => a.status === 'pending').length,
    in_progress: actionsData.filter((a) => a.status === 'in_progress').length,
    completed: actionsData.filter((a) => a.status === 'completed').length,
  };

  const priorityConfig = {
    urgent: { label: '紧急', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    high: { label: '高', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    medium: { label: '中', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    low: { label: '低', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
  };

  const statusConfig = {
    pending: { label: '待处理', icon: Circle, color: 'text-slate-400' },
    in_progress: { label: '进行中', icon: Clock, color: 'text-brand-blue' },
    completed: { label: '已完成', icon: CheckCircle2, color: 'text-emerald-500' },
  };

  return (
    <Layout title="Action Center" subtitle="行动中心 · IHG酒店运营改进建议">
      {/* 状态统计 */}
      <section className="mb-5 animate-fade-in">
        <div className="grid grid-cols-4 gap-3">
          <Card className={clsx('cursor-pointer transition-all', statusFilter === 'all' && 'ring-2 ring-brand-blue')} hover onClick={() => setStatusFilter('all')} padding="sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">全部行动</span>
              <AlertCircle size={14} className="text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{actionsData.length}</div>
          </Card>
          <Card className={clsx('cursor-pointer transition-all', statusFilter === 'pending' && 'ring-2 ring-brand-blue')} hover onClick={() => setStatusFilter('pending')} padding="sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">待处理</span>
              <Circle size={14} className="text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-600 mt-1">{statusCounts.pending}</div>
          </Card>
          <Card className={clsx('cursor-pointer transition-all', statusFilter === 'in_progress' && 'ring-2 ring-brand-blue')} hover onClick={() => setStatusFilter('in_progress')} padding="sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">进行中</span>
              <Clock size={14} className="text-brand-blue" />
            </div>
            <div className="text-2xl font-bold text-brand-blue mt-1">{statusCounts.in_progress}</div>
          </Card>
          <Card className={clsx('cursor-pointer transition-all', statusFilter === 'completed' && 'ring-2 ring-brand-blue')} hover onClick={() => setStatusFilter('completed')} padding="sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">已完成</span>
              <CheckCircle2 size={14} className="text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-500 mt-1">{statusCounts.completed}</div>
          </Card>
        </div>
      </section>

      {/* 优先级筛选 */}
      <section className="mb-4 animate-fade-in-delay-1">
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-slate-400" />
          <span className="text-xs text-slate-500">优先级：</span>
          <div className="flex gap-1.5">
            {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority)}
                className={clsx(
                  'px-2.5 py-1 text-xs rounded-lg transition-all',
                  priorityFilter === priority ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {priority === 'all' ? '全部' : priorityConfig[priority].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 行动列表 */}
      <section className="animate-fade-in-delay-2">
        <Card padding="none">
          <div className="p-4 border-b border-slate-200">
            <CardHeader title="行动建议列表" subtitle={`共 ${filteredActions.length} 项`} />
          </div>
          <div className="divide-y divide-slate-100">
            {filteredActions.map((action) => {
              const priority = priorityConfig[action.priority as keyof typeof priorityConfig];
              const status = statusConfig[action.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <div key={action.id} className={clsx('p-4 hover:bg-slate-50 transition-all cursor-pointer', action.priority === 'urgent' && 'border-l-2 border-red-500')}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center border', priority.bg, priority.border)}>
                        <span className={clsx('text-[10px] font-bold', priority.color)}>{priority.label}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-slate-400">{action.id}</span>
                          <Badge variant="info" size="sm">{action.category}</Badge>
                        </div>
                        <h4 className="text-sm font-medium text-slate-800 mb-1">{action.title}</h4>
                        <div className="text-[10px] text-slate-400 mb-1">{action.hotel}</div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-400">来源：<span className="text-slate-500">{action.source}</span></span>
                          <span className="text-slate-400">预期：<span className="text-emerald-500">{action.impact}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={clsx('flex items-center gap-1 mb-1', status.color)}>
                        <StatusIcon size={12} />
                        <span className="text-xs">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                        <Clock size={10} />
                        <span>截止 {action.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <User size={10} />
                        <span>{action.assignee}</span>
                      </div>
                    </div>
                  </div>
                  {action.status !== 'completed' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-all text-xs">
                        {action.status === 'pending' ? '开始处理' : '标记完成'}
                        <ArrowRight size={12} />
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
