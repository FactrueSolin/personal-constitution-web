'use client';

import { useState } from 'react';
import { Category } from '@/app/types';
import { Modal } from '../common/Modal';

interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function CategoryModal({
  isOpen,
  category,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [name, setName] = useState(category?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={category ? '编辑分类' : '新增分类'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="分类名称"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-slate-50/50"
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
