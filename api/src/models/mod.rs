use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Rule {
    pub id: String,
    pub category_id: String,
    pub content: String,
    pub follow_count: u32,
    pub violate_count: u32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CountRecord {
    pub id: String,
    pub rule_id: String,
    pub record_type: String,
    pub timestamp: String,
    pub note: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateCategoryRequest {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCategoryRequest {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateRuleRequest {
    pub category_id: String,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRuleRequest {
    pub content: String,
}
