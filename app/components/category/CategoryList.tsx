'use client';

import { Category } from "@/app/types";
import { CategoryItem } from "./CategoryItem";

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function CategoryList({
  categories,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
}: CategoryListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">分类列表</h2>
        <button
          onClick={onAdd}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="新建分类"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-1 overflow-y-auto flex-1 pr-2 -mr-2">
        {categories.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 text-sm">暂无分类</p>
            <button onClick={onAdd} className="mt-2 text-blue-600 text-sm font-medium hover:underline">
              创建第一个分类
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedId === category.id}
              onSelect={() => onSelect(category.id)}
              onEdit={() => onEdit(category)}
              onDelete={() => onDelete(category.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
