'use client';

import { Category, CategoryTreeNode } from "@/app/types";
import { CategoryItem } from "./CategoryItem";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface CategoryListProps {
  treeNodes: CategoryTreeNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onToggleExpand: (id: string) => void;
  onMove: (draggedId: string, targetId: string) => void;
}

function renderTreeNode(
  node: CategoryTreeNode,
  level: number,
  selectedId: string | null,
  expandedIds: Set<string>,
  onSelect: (id: string) => void,
  onEdit: (category: Category) => void,
  onDelete: (id: string) => void,
  onToggleExpand: (id: string) => void
): React.ReactNode[] {
  const items: React.ReactNode[] = [];
  const { category, children } = node;
  const isExpanded = expandedIds.has(category.id);
  const hasChildren = children.length > 0;

  items.push(
    <CategoryItem
      key={category.id}
      category={category}
      level={level}
      hasChildren={hasChildren}
      isExpanded={isExpanded}
      isSelected={selectedId === category.id}
      onSelect={() => onSelect(category.id)}
      onEdit={() => onEdit(category)}
      onDelete={() => onDelete(category.id)}
      onToggleExpand={() => onToggleExpand(category.id)}
    />
  );

  if (isExpanded && hasChildren) {
    children.forEach((child) => {
      items.push(
        ...renderTreeNode(
          child,
          level + 1,
          selectedId,
          expandedIds,
          onSelect,
          onEdit,
          onDelete,
          onToggleExpand
        )
      );
    });
  }

  return items;
}

export function CategoryList({
  treeNodes,
  selectedId,
  expandedIds,
  onSelect,
  onEdit,
  onDelete,
  onAdd,
  onToggleExpand,
  onMove,
}: CategoryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    // 检查是否拖拽到了另一个分类（droppable 格式）
    if (overId.startsWith('droppable-')) {
      // 提取目标分类的真实 ID
      const targetId = overId.replace('droppable-', '');
      
      // 防止拖拽到自己
      if (draggedId !== targetId) {
        onMove(draggedId, targetId);
      }
    }
  };

  const allCategoryIds = getAllCategoryIds(treeNodes);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          分类列表
        </h2>
        <button
          onClick={onAdd}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="新建分类"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-1 overflow-y-auto flex-1 pr-2 -mr-2">
        {treeNodes.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 text-sm">暂无分类</p>
            <button
              onClick={onAdd}
              className="mt-2 text-blue-600 text-sm font-medium hover:underline"
            >
              创建第一个分类
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={allCategoryIds}
              strategy={verticalListSortingStrategy}
            >
              {treeNodes.map((node) =>
                renderTreeNode(
                  node,
                  0,
                  selectedId,
                  expandedIds,
                  onSelect,
                  onEdit,
                  onDelete,
                  onToggleExpand
                )
              )}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

function getAllCategoryIds(nodes: CategoryTreeNode[]): string[] {
  const ids: string[] = [];
  const traverse = (nodes: CategoryTreeNode[]) => {
    nodes.forEach((node) => {
      ids.push(node.category.id);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return ids;
}
