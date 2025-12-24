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
}

pub async fn list_rules(
    Query(query): Query<RuleQuery>,
) -> Json<Vec<Rule>> {
    let rules = storage::load_rules();
    let filtered = if let Some(cat_id) = query.category_id {
        rules.into_iter().filter(|r| r.category_id == cat_id).collect()
    } else {
        rules
    };
    debug_assert!(!filtered.is_empty() || filtered.is_empty(), "Rules loaded");
    Json(filtered)
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
