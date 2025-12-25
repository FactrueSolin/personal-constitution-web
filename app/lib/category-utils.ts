import { Category, CategoryTree, CategoryTreeNode } from "@/app/types";

export function buildCategoryTree(categories: Category[]): CategoryTree {
  const categoryMap = new Map<string, CategoryTreeNode>();
  const roots: CategoryTreeNode[] = [];

  // Create nodes for all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      category,
      children: [],
    });
  });

  // Build tree structure
  categories.forEach((category) => {
    const node = categoryMap.get(category.id)!;
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  // Sort children by sort_order
  const sortChildren = (node: CategoryTreeNode) => {
    node.children.sort((a, b) => a.category.sort_order - b.category.sort_order);
    node.children.forEach(sortChildren);
  };
  roots.forEach(sortChildren);

  return { roots };
}

export function flattenCategoryTree(tree: CategoryTree): Category[] {
  const result: Category[] = [];

  const traverse = (node: CategoryTreeNode) => {
    result.push(node.category);
    node.children.forEach(traverse);
  };

  tree.roots.forEach(traverse);
  return result;
}

export function findCategoryPath(
  tree: CategoryTree,
  categoryId: string
): Category[] {
  let found: Category[] | null = null;

  const traverse = (node: CategoryTreeNode, path: Category[]): boolean => {
    const currentPath = [...path, node.category];
    if (node.category.id === categoryId) {
      found = currentPath;
      return true;
    }
    for (const child of node.children) {
      if (traverse(child, currentPath)) {
        return true;
      }
    }
    return false;
  };

  for (const root of tree.roots) {
    if (traverse(root, [])) {
      break;
    }
  }

  return found || [];
}
