'use client';

import { Rule } from '@/app/types';
import { CountButtons } from './CountButtons';

interface RuleCardProps {
  rule: Rule;
  onEdit: () => void;
  onDelete: () => void;
  onFollow: () => void;
  onViolate: () => void;
}

export function RuleCard({
  rule,
  onEdit,
  onDelete,
  onFollow,
  onViolate,
}: RuleCardProps) {
  return (
    <div className="group relative rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="编辑"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="删除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="mb-6 pr-16">
        <p className="text-lg text-slate-800 font-medium leading-relaxed">{rule.content}</p>
      </div>

      <CountButtons
        followCount={rule.follow_count}
        violateCount={rule.violate_count}
        onFollow={onFollow}
        onViolate={onViolate}
      />
    </div>
  );
}
