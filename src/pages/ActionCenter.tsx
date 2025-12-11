import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader, Badge } from '../components/ui';
import { actionsData } from '../data/mockData';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Circle,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';
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
    urgent: { label: '紧急', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    high: { label: '高', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    medium: { label: '中', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    low: { label: '低', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/30' },
  };

  const statusConfig = {
    pending: { label: '待处理', icon: Circle, color: 'text-zinc-400' },
    in_progress: { label: '进行中', icon: Clock, color: 'text-brand-blue' },
    completed: { label: '已完成', icon: CheckCircle2, color: 'text-emerald-400' },
  };

  return (
    <Layout title="Action Center" subtitle="行动中心 · 可执行建议管理">
      {/* 状态统计 */}
      <section className="mb-8 animate-fade-in">
        <div className="grid grid-cols-4 gap-4">
          <Card
            className={clsx(
              'cursor-pointer transition-all',
              statusFilter === 'all' && 'ring-2 ring-brand-blue'
            )}
            hover
            onClick={() => setStatusFilter('all')}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">全部行动</span>
              <AlertCircle size={18} className="text-zinc-500" />
            </div>
            <div className="text-3xl font-bold text-white mt-2">{actionsData.length}</div>
          </Card>
          <Card
            className={clsx(
              'cursor-pointer transition-all',
              statusFilter === 'pending' && 'ring-2 ring-brand-blue'
            )}
            hover
            onClick={() => setStatusFilter('pending')}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">待处理</span>
              <Circle size={18} className="text-zinc-500" />
            </div>
            <div className="text-3xl font-bold text-zinc-300 mt-2">{statusCounts.pending}</div>
          </Card>
          <Card
            className={clsx(
              'cursor-pointer transition-all',
              statusFilter === 'in_progress' && 'ring-2 ring-brand-blue'
            )}
            hover
            onClick={() => setStatusFilter('in_progress')}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">进行中</span>
              <Clock size={18} className="text-brand-blue" />
            </div>
            <div className="text-3xl font-bold text-brand-blue mt-2">{statusCounts.in_progress}</div>
          </Card>
          <Card
            className={clsx(
              'cursor-pointer transition-all',
              statusFilter === 'completed' && 'ring-2 ring-brand-blue'
            )}
            hover
            onClick={() => setStatusFilter('completed')}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">已完成</span>
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 mt-2">{statusCounts.completed}</div>
          </Card>
        </div>
      </section>

      {/* 优先级筛选 */}
      <section className="mb-6 animate-fade-in-delay-1">
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-zinc-500" />
          <span className="text-sm text-zinc-400">优先级：</span>
          <div className="flex gap-2">
            {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => setPriorityFilter(priority)}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-lg transition-all',
                  priorityFilter === priority
                    ? 'bg-brand-blue text-white'
                    : 'bg-dark-card border border-dark-border text-zinc-400 hover:text-zinc-200'
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
          <div className="p-5 border-b border-dark-border">
            <CardHeader title="行动建议列表" subtitle={`共 ${filteredActions.length} 项`} />
          </div>
          <div className="divide-y divide-dark-border/50">
            {filteredActions.map((action) => {
              const priority = priorityConfig[action.priority as keyof typeof priorityConfig];
              const status = statusConfig[action.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;

              return (
                <div
                  key={action.id}
                  className={clsx(
                    'p-5 hover:bg-dark-hover/50 transition-all cursor-pointer',
                    action.priority === 'urgent' && 'border-l-2 border-red-500'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* 优先级标识 */}
                      <div
                        className={clsx(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          priority.bg,
                          priority.border,
                          'border'
                        )}
                      >
                        <span className={clsx('text-sm font-bold', priority.color)}>
                          {priority.label}
                        </span>
                      </div>

                      {/* 主要内容 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-zinc-500">{action.id}</span>
                          <Badge variant="info" size="sm">
                            {action.category}
                          </Badge>
                        </div>
                        <h4 className="text-base font-medium text-zinc-200 mb-2">{action.title}</h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-zinc-500">
                            来源：<span className="text-zinc-400">{action.source}</span>
                          </span>
                          <span className="text-zinc-500">
                            预期效果：<span className="text-emerald-400">{action.impact}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 右侧信息 */}
                    <div className="text-right">
                      <div className={clsx('flex items-center gap-1.5 mb-2', status.color)}>
                        <StatusIcon size={16} />
                        <span className="text-sm">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
                        <Clock size={12} />
                        <span>截止 {action.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <User size={12} />
                        <span>{action.assignee}</span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  {action.status !== 'completed' && (
                    <div className="mt-4 pt-4 border-t border-dark-border/30 flex justify-end">
                      <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-all text-sm">
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

