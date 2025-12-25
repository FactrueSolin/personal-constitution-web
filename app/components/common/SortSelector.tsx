"use client";

interface SortSelectorProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export function SortSelector({ sortBy, onSortChange }: SortSelectorProps) {
  return (
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
    >
      <option value="follow_count">按遵守次数排序</option>
      <option value="violate_count">按违反次数排序</option>
    </select>
  );
}
