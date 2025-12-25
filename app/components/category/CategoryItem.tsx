'use client';

import { Category } from "@/app/types";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface CategoryItemProps {
  category: Category;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
}

export function CategoryItem({
  category,
  level,
  hasChildren,
  isExpanded,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleExpand,
}: CategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  // 添加 droppable 功能，使该分类可以接收拖拽
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${category.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const indentPx = level * 20;

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        setDroppableRef(el);
      }}
      style={{ ...style, marginLeft: `${indentPx}px` }}
      className={`group flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "bg-blue-600 text-white shadow-md border-blue-500"
          : isOver
          ? "bg-blue-50 border-blue-400 shadow-md"
          : "hover:bg-white hover:shadow-sm text-slate-700 border-transparent hover:border-slate-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div
          {...listeners}
          {...attributes}
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center cursor-grab active:cursor-grabbing ${
            isSelected ? "text-white" : "text-slate-400"
          }`}
          title="拖拽调整分类"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="9" cy="5" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="15" cy="5" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="15" cy="19" r="1.5" />
          </svg>
        </div>
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform ${
              isSelected ? "text-white" : "text-slate-400"
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-white" : "bg-slate-400 group-hover:bg-blue-500"}`} />
        <span className="font-medium truncate">{category.name}</span>
      </div>

      <div
        className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isSelected ? "opacity-100" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          className={`p-1.5 rounded-lg transition-colors ${
            isSelected
              ? "text-blue-100 hover:bg-blue-500 hover:text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-blue-600"
          }`}
          title="编辑"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className={`p-1.5 rounded-lg transition-colors ${
            isSelected
              ? "text-blue-100 hover:bg-blue-500 hover:text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-rose-600"
          }`}
          title="删除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
