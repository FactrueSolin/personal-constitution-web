export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
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
