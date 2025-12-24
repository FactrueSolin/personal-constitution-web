'use client';

import { Category } from "@/app/types";

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryItem({
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  return (
    <div
      className={`group flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all duration-200 border ${isSelected
          ? "bg-blue-600 text-white shadow-md border-blue-500"
          : "hover:bg-white hover:shadow-sm text-slate-700 border-transparent hover:border-slate-200"
        }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-slate-400 group-hover:bg-blue-500'}`} />
        <span className="font-medium truncate">{category.name}</span>
      </div>

      <div className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isSelected ? 'opacity-100' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onEdit}
          className={`p-1.5 rounded-lg transition-colors ${isSelected
              ? "text-blue-100 hover:bg-blue-500 hover:text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-blue-600"
            }`}
          title="编辑"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className={`p-1.5 rounded-lg transition-colors ${isSelected
              ? "text-blue-100 hover:bg-blue-500 hover:text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-rose-600"
            }`}
          title="删除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
