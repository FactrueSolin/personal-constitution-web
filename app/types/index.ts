export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  parent_id?: string;
  sort_order: number;
}

export interface CategoryTreeNode {
  category: Category;
  children: CategoryTreeNode[];
}

export interface CategoryTree {
  roots: CategoryTreeNode[];
}

export interface MoveCategoryRequest {
  categoryId: string;
  newParentId?: string;
  sortOrder: number;
}

export interface Rule {
  id: string;
  category_id: string;
  content: string;
  follow_count: number;
  violate_count: number;
  created_at: string;
  updated_at: string;
}
