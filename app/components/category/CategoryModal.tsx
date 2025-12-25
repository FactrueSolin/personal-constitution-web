'use client';

import { useState } from 'react';
import { Category } from '@/app/types';
import { Modal } from '../common/Modal';

interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  allCategories: Category[];
  onClose: () => void;
  onSubmit: (name: string, parentId?: string) => void;
}

export function CategoryModal({
  isOpen,
  category,
  allCategories,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [name, setName] = useState(category?.name || '');
  const [parentId, setParentId] = useState<string | undefined>(
    category?.parent_id || undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, parentId);
      setName('');
      setParentId(undefined);
    }
  };

  // 过滤出可以作为父分类的分类（不能选择自己或自己的子分类）
  const availableParents = allCategories.filter((cat) => {
    if (category && cat.id === category.id) return false;
    return true;
  });

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
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            父分类（可选）
          </label>
          <select
            value={parentId || ''}
            onChange={(e) => setParentId(e.target.value || undefined)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-slate-50/50"
          >
            <option value="">无（顶级分类）</option>
            {availableParents.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
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
