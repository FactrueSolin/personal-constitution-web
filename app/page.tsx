'use client';

import { useEffect, useState } from 'react';
import { Category, Rule } from '@/app/types';
import { apiClient } from '@/app/lib/api-client';
import { CategoryList } from '@/app/components/category/CategoryList';
import { CategoryModal } from '@/app/components/category/CategoryModal';
import { RuleList } from '@/app/components/rule/RuleList';
import { RuleModal } from '@/app/components/rule/RuleModal';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load rules when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      loadRules(selectedCategoryId);
    } else {
      setRules([]);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadRules = async (categoryId: string) => {
    try {
      const data = await apiClient.getRules(categoryId);
      setRules(data);
    } catch (error) {
      console.error('Failed to load rules:', error);
    }
  };

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (name: string) => {
    try {
      if (editingCategory) {
        await apiClient.updateCategory(editingCategory.id, name);
      } else {
        await apiClient.createCategory(name);
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
      loadRules(selectedCategoryId);
    } catch (error) {
      console.error('Failed to save rule:', error);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (confirm('确定删除此规则吗？')) {
      try {
        await apiClient.deleteRule(id);
        if (selectedCategoryId) {
          loadRules(selectedCategoryId);
        }
      } catch (error) {
        console.error('Failed to delete rule:', error);
      }
    }
  };

  const handleFollowRule = async (id: string) => {
    try {
      await apiClient.followRule(id);
      if (selectedCategoryId) {
        loadRules(selectedCategoryId);
      }
    } catch (error) {
      console.error('Failed to follow rule:', error);
    }
  };

  const handleViolateRule = async (id: string) => {
    try {
      await apiClient.violateRule(id);
      if (selectedCategoryId) {
        loadRules(selectedCategoryId);
      }
    } catch (error) {
      console.error('Failed to violate rule:', error);
    }
  };

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

        <div className="flex-1 overflow-hidden p-4">
          <CategoryList
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onAdd={handleAddCategory}
          />
        </div>

        <div className="p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-300">© 2025 Personal Constitution</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {selectedCategoryId ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                  {categories.find((c) => c.id === selectedCategoryId)?.name}
                </h2>
                <div className="h-1 w-20 bg-blue-500 rounded-full mt-4"></div>
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
          <div className="flex-1 flex items-center justify-center p-8">
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
        )}
      </main>

      {/* Modals */}
      <CategoryModal
        isOpen={categoryModalOpen}
        category={editingCategory}
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
