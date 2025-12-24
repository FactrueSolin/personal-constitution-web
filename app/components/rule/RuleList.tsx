'use client';

import { Rule } from '@/app/types';
import { RuleCard } from './RuleCard';

interface RuleListProps {
  rules: Rule[];
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
  onFollow: (id: string) => void;
  onViolate: (id: string) => void;
  onAdd: () => void;
}

export function RuleList({
  rules,
  onEdit,
  onDelete,
  onFollow,
  onViolate,
  onAdd,
}: RuleListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-500">共 {rules.length} 条规则</p>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">新增规则</span>
        </button>
      </div>
      
      <div className="grid gap-4">
        {rules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">暂无规则</p>
            <p className="text-slate-400 text-sm mt-1">点击上方按钮添加第一条规则</p>
          </div>
        ) : (
          rules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onEdit={() => onEdit(rule)}
              onDelete={() => onDelete(rule.id)}
              onFollow={() => onFollow(rule.id)}
              onViolate={() => onViolate(rule.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
