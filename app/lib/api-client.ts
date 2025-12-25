import { Category, Rule, CategoryTree, MoveCategoryRequest } from "@/app/types";

const API_BASE = "http://localhost:8080/api";

export const apiClient = {
  // Category APIs
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  async createCategory(name: string, parentId?: string): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, parent_id: parentId }),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  },

  async fetchCategoryTree(): Promise<CategoryTree> {
    const res = await fetch(`${API_BASE}/categories/tree`);
    if (!res.ok) throw new Error("Failed to fetch category tree");
    return res.json();
  },

  async fetchChildren(categoryId: string): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories/${categoryId}/children`);
    if (!res.ok) throw new Error("Failed to fetch children");
    return res.json();
  },

  async moveCategory(request: MoveCategoryRequest): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${request.categoryId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        new_parent_id: request.newParentId,
        sort_order: request.sortOrder,
      }),
    });
    if (!res.ok) throw new Error("Failed to move category");
    return res.json();
  },

  async updateCategory(id: string, name: string): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to update category");
    return res.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete category");
  },

  // Rule APIs
  async getRules(categoryId?: string, sortBy: string = "follow_count", sortOrder: string = "desc"): Promise<Rule[]> {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    const res = await fetch(`${API_BASE}/rules?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch rules");
    return res.json();
  },

  async createRule(categoryId: string, content: string): Promise<Rule> {
    const res = await fetch(`${API_BASE}/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_id: categoryId, content }),
    });
    if (!res.ok) throw new Error("Failed to create rule");
    return res.json();
  },

  async updateRule(id: string, content: string): Promise<Rule> {
    const res = await fetch(`${API_BASE}/rules/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to update rule");
    return res.json();
  },

  async deleteRule(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/rules/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete rule");
  },

  async followRule(id: string): Promise<Rule> {
    const res = await fetch(`${API_BASE}/rules/${id}/follow`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to follow rule");
    return res.json();
  },

  async violateRule(id: string): Promise<Rule> {
    const res = await fetch(`${API_BASE}/rules/${id}/violate`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to violate rule");
    return res.json();
  },
};
