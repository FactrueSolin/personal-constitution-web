'use client';

import { useState } from 'react';
import { Rule } from '@/app/types';
import { Modal } from '../common/Modal';

interface RuleModalProps {
  isOpen: boolean;
  rule: Rule | null;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

export function RuleModal({
  isOpen,
  rule,
  onClose,
  onSubmit,
}: RuleModalProps) {
  const [content, setContent] = useState(rule?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={rule ? '编辑规则' : '新增规则'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="规则内容"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-slate-50/50 resize-none"
          rows={4}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-blue-600 text-white px-4 py-2.5 hover:bg-blue-700 font-semibold transition-all duration-300"
          >
            确定
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 text-slate-600 px-4 py-2.5 hover:bg-slate-200 font-semibold transition-all duration-300"
          >
            取消
          </button>
        </div>
      </form>
    </Modal>
  );
}
