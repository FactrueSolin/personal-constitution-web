use crate::models::{Category, Rule, CountRecord};
use std::fs;
use std::path::Path;
use chrono::Utc;
use uuid::Uuid;

const DATA_DIR: &str = "data";
const CATEGORIES_FILE: &str = "data/categories.json";
const RULES_FILE: &str = "data/rules.json";
const RECORDS_FILE: &str = "data/count-records.json";

pub fn ensure_data_dir() {
    if !Path::new(DATA_DIR).exists() {
        fs::create_dir_all(DATA_DIR).ok();
    }
}

pub fn load_categories() -> Vec<Category> {
    ensure_data_dir();
    if let Ok(content) = fs::read_to_string(CATEGORIES_FILE) {
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_categories(categories: &[Category]) {
    ensure_data_dir();
    let json = serde_json::to_string_pretty(categories).unwrap();
    fs::write(CATEGORIES_FILE, json).ok();
}

pub fn load_rules() -> Vec<Rule> {
    ensure_data_dir();
    if let Ok(content) = fs::read_to_string(RULES_FILE) {
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_rules(rules: &[Rule]) {
    ensure_data_dir();
    let json = serde_json::to_string_pretty(rules).unwrap();
    fs::write(RULES_FILE, json).ok();
}

pub fn load_records() -> Vec<CountRecord> {
    ensure_data_dir();
    if let Ok(content) = fs::read_to_string(RECORDS_FILE) {
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        Vec::new()
    }
}

pub fn save_records(records: &[CountRecord]) {
    ensure_data_dir();
    let json = serde_json::to_string_pretty(records).unwrap();
    fs::write(RECORDS_FILE, json).ok();
}

pub fn create_category(name: String) -> Category {
    let now = Utc::now().to_rfc3339();
    Category {
        id: Uuid::new_v4().to_string(),
        name,
        created_at: now.clone(),
        updated_at: now,
    }
}

pub fn create_rule(category_id: String, content: String) -> Rule {
    let now = Utc::now().to_rfc3339();
    Rule {
        id: Uuid::new_v4().to_string(),
        category_id,
        content,
        follow_count: 0,
        violate_count: 0,
        created_at: now.clone(),
        updated_at: now,
    }
}

pub fn create_record(rule_id: String, record_type: String, note: String) -> CountRecord {
    CountRecord {
        id: Uuid::new_v4().to_string(),
        rule_id,
        record_type,
        timestamp: Utc::now().to_rfc3339(),
        note,
    }
}
