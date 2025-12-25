'use client';

import { useEffect, useState } from 'react';
import { Category, Rule, CategoryTreeNode } from '@/app/types';
import { apiClient } from '@/app/lib/api-client';
import { CategoryList } from '@/app/components/category/CategoryList';
import { CategoryModal } from '@/app/components/category/CategoryModal';
import { RuleList } from '@/app/components/rule/RuleList';
import { RuleModal } from '@/app/components/rule/RuleModal';
import { SortSelector } from '@/app/components/common/SortSelector';

export default function Home() {
  const [treeNodes, setTreeNodes] = useState<CategoryTreeNode[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [sortBy, setSortBy] = useState<string>("follow_count");

  const loadCategories = async () => {
    try {
      const tree = await apiClient.fetchCategoryTree();
      setTreeNodes(tree.roots);
      
      // Flatten tree to get all categories
      const flatCategories: Category[] = [];
      const flatten = (nodes: CategoryTreeNode[]) => {
        nodes.forEach((node) => {
          flatCategories.push(node.category);
          if (node.children.length > 0) {
            flatten(node.children);
          }
        });
      };
      flatten(tree.roots);
      setAllCategories(flatCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadRules = async (categoryId: string | null, sortByParam: string = "follow_count") => {
    try {
      const data = await apiClient.getRules(categoryId || undefined, sortByParam, "desc");
      setRules(data);
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
  };

  // Load categories
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadCategories();
  }, []);

  // Load rules when category or sort changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadRules(selectedCategoryId, sortBy);
  }, [selectedCategoryId, sortBy]);

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string, parentId?: string) => {
    try {
      if (editingCategory) {
        await apiClient.updateCategory(editingCategory.id, name);
      } else {
        await apiClient.createCategory(name, parentId);
      }
      setCategoryModalOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('确定删除此分类吗？')) {
      try {
        await apiClient.deleteCategory(id);
        if (selectedCategoryId === id) {
          setSelectedCategoryId(null);
        }
        loadCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleMoveCategory = async (draggedId: string, targetId: string) => {
    try {
      await apiClient.moveCategory({
        categoryId: draggedId,
        newParentId: targetId,
        sortOrder: 0,
      });
      loadCategories();
    } catch (error) {
      console.error('Failed to move category:', error);
    }
  };

  // Rule handlers
  const handleAddRule = () => {
    setEditingRule(null);
    setRuleModalOpen(true);
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setRuleModalOpen(true);
  };

  const handleSaveRule = async (content: string) => {
    if (!selectedCategoryId) return;
    try {
      if (editingRule) {
        await apiClient.updateRule(editingRule.id, content);
      } else {
        await apiClient.createRule(selectedCategoryId, content);
      }
      setRuleModalOpen(false);
      loadRules(selectedCategoryId, sortBy);
    } catch (error) {
      console.error('Failed to save rule:', error);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (confirm('确定删除此规则吗？')) {
      try {
        await apiClient.deleteRule(id);
        loadRules(selectedCategoryId, sortBy);
      } catch (error) {
        console.error('Failed to delete rule:', error);
      }
    }
  };

  const handleFollowRule = async (id: string) => {
    try {
      await apiClient.followRule(id);
      loadRules(selectedCategoryId, sortBy);
    } catch (error) {
      console.error('Failed to follow rule:', error);
    }
  };

  const handleViolateRule = async (id: string) => {
    try {
      await apiClient.violateRule(id);
      loadRules(selectedCategoryId, sortBy);
    } catch (error) {
      console.error('Failed to violate rule:', error);
    }
  };

  const selectedCategory = allCategories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-2xl">⚖️</span> 个人宪法
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">用规则塑造稳定习惯</p>
        </div>

        <div className="flex-1 overflow-hidden p-4 flex flex-col">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`w-full text-left px-3 py-2 rounded-lg mb-2 font-medium transition-colors ${
              selectedCategoryId === null
                ? "bg-blue-100 text-blue-700"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            📋 全部规则
          </button>
          <div className="flex-1 overflow-hidden">
            <CategoryList
              treeNodes={treeNodes}
              selectedId={selectedCategoryId}
              expandedIds={expandedIds}
              onSelect={setSelectedCategoryId}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onAdd={handleAddCategory}
              onToggleExpand={handleToggleExpand}
              onMove={handleMoveCategory}
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-300">© 2025 Personal Constitution</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {selectedCategoryId !== null ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              <header className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    {selectedCategoryId ? selectedCategory?.name : "全部规则"}
                  </h2>
                  <div className="h-1 w-20 bg-blue-500 rounded-full mt-4"></div>
                </div>
                <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
              </header>

              <RuleList
                rules={rules}
                onEdit={handleEditRule}
                onDelete={handleDeleteRule}
                onFollow={handleFollowRule}
                onViolate={handleViolateRule}
                onAdd={handleAddRule}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              <header className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">全部规则</h2>
                  <div className="h-1 w-20 bg-blue-500 rounded-full mt-4"></div>
                </div>
                <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
              </header>

              {rules.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <div className="max-w-md text-center">
                    <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">开始你的自律之旅</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                      创建分类来组织你的行为准则，<br />让每一个好习惯都有迹可循。
                    </p>
                    <button
                      onClick={handleAddCategory}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all duration-200 font-semibold"
                    >
                      创建第一个分类
                    </button>
                  </div>
                </div>
              ) : (
                <RuleList
                  rules={rules}
                  onEdit={handleEditRule}
                  onDelete={handleDeleteRule}
                  onFollow={handleFollowRule}
                  onViolate={handleViolateRule}
                  onAdd={handleAddRule}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CategoryModal
        isOpen={categoryModalOpen}
        category={editingCategory}
        allCategories={allCategories}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleSaveCategory}
      />
      <RuleModal
        isOpen={ruleModalOpen}
        rule={editingRule}
        onClose={() => setRuleModalOpen(false)}
        onSubmit={handleSaveRule}
      />
    </div>
  );
}
