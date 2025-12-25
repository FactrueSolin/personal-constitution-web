use axum::{
    extract::{Path, Query, Json},
    http::StatusCode,
};
use serde::Deserialize;
use crate::models::{Rule, CreateRuleRequest, UpdateRuleRequest};
use crate::storage;
use chrono::Utc;

#[derive(Deserialize)]
pub struct RuleQuery {
    #[serde(rename = "categoryId")]
    category_id: Option<String>,
    #[serde(rename = "sortBy", default = "default_sort_by")]
    sort_by: String,
    #[serde(rename = "sortOrder", default = "default_sort_order")]
    sort_order: String,
}

fn default_sort_by() -> String {
    "follow_count".to_string()
}

fn default_sort_order() -> String {
    "desc".to_string()
}

pub async fn list_rules(
    Query(query): Query<RuleQuery>,
) -> Json<Vec<Rule>> {
    let rules = storage::load_rules();
    let filtered = if let Some(cat_id) = query.category_id {
        let categories = storage::load_categories();
        let category_ids = storage::get_all_descendant_category_ids(&categories, &cat_id);
        rules.into_iter().filter(|r| category_ids.contains(&r.category_id)).collect()
    } else {
        rules
    };
    
    let mut sorted = filtered;
    sorted.sort_by(|a, b| {
        let cmp = match query.sort_by.as_str() {
            "violate_count" => {
                if query.sort_order == "desc" {
                    b.violate_count.cmp(&a.violate_count)
                } else {
                    a.violate_count.cmp(&b.violate_count)
                }
            }
            _ => {
                if query.sort_order == "desc" {
                    b.follow_count.cmp(&a.follow_count)
                } else {
                    a.follow_count.cmp(&b.follow_count)
                }
            }
        };
        
        if cmp == std::cmp::Ordering::Equal {
            b.created_at.cmp(&a.created_at)
        } else {
            cmp
        }
    });
    
    debug_assert!(!sorted.is_empty() || sorted.is_empty(), "Rules loaded and sorted");
    Json(sorted)
}

pub async fn create_rule(
    Json(req): Json<CreateRuleRequest>,
) -> (StatusCode, Json<Rule>) {
    let rule = storage::create_rule(req.category_id, req.content);
    let mut rules = storage::load_rules();
    rules.push(rule.clone());
    storage::save_rules(&rules);
    debug_assert!(!rule.id.is_empty(), "Rule created with id");
    (StatusCode::CREATED, Json(rule))
}

pub async fn update_rule(
    Path(id): Path<String>,
    Json(req): Json<UpdateRuleRequest>,
) -> Result<Json<Rule>, StatusCode> {
    let mut rules = storage::load_rules();
    if let Some(rule) = rules.iter_mut().find(|r| r.id == id) {
        rule.content = req.content;
        rule.updated_at = Utc::now().to_rfc3339();
        let result = rule.clone();
        storage::save_rules(&rules);
        debug_assert!(!result.id.is_empty(), "Rule updated");
        Ok(Json(result))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

pub async fn delete_rule(Path(id): Path<String>) -> StatusCode {
    let mut rules = storage::load_rules();
    let original_len = rules.len();
    rules.retain(|r| r.id != id);
    if rules.len() < original_len {
        storage::save_rules(&rules);
        debug_assert!(rules.len() < original_len, "Rule deleted");
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

pub async fn follow_rule(Path(id): Path<String>) -> Result<Json<Rule>, StatusCode> {
    let mut rules = storage::load_rules();
    if let Some(rule) = rules.iter_mut().find(|r| r.id == id) {
        rule.follow_count += 1;
        rule.updated_at = Utc::now().to_rfc3339();
        let result = rule.clone();
        storage::save_rules(&rules);
        
        let record = storage::create_record(id, "follow".to_string(), String::new());
        let mut records = storage::load_records();
        records.push(record);
        storage::save_records(&records);
        
        debug_assert!(result.follow_count > 0, "Follow count incremented");
        Ok(Json(result))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

pub async fn violate_rule(Path(id): Path<String>) -> Result<Json<Rule>, StatusCode> {
    let mut rules = storage::load_rules();
    if let Some(rule) = rules.iter_mut().find(|r| r.id == id) {
        rule.violate_count += 1;
        rule.updated_at = Utc::now().to_rfc3339();
        let result = rule.clone();
        storage::save_rules(&rules);
        
        let record = storage::create_record(id, "violate".to_string(), String::new());
        let mut records = storage::load_records();
        records.push(record);
        storage::save_records(&records);
        
        debug_assert!(result.violate_count > 0, "Violate count incremented");
        Ok(Json(result))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}
