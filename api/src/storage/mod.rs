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

pub fn create_category(name: String, parent_id: Option<String>, sort_order: i32) -> Category {
    let now = Utc::now().to_rfc3339();
    Category {
        id: Uuid::new_v4().to_string(),
        name,
        created_at: now.clone(),
        updated_at: now,
        parent_id,
        sort_order,
    }
}

pub fn build_category_tree(categories: &[Category]) -> Vec<crate::models::CategoryTreeNode> {
    use std::collections::HashMap;
    
    let mut map: HashMap<String, crate::models::CategoryTreeNode> = HashMap::new();
    let mut roots = Vec::new();
    
    for cat in categories {
        map.insert(cat.id.clone(), crate::models::CategoryTreeNode {
            category: cat.clone(),
            children: Vec::new(),
        });
    }
    
    for cat in categories {
        if let Some(parent_id) = &cat.parent_id {
            if let Some(node) = map.remove(&cat.id) {
                if let Some(parent_node) = map.get_mut(parent_id) {
                    parent_node.children.push(node);
                }
            }
        } else {
            if let Some(node) = map.remove(&cat.id) {
                roots.push(node);
            }
        }
    }
    
    roots.sort_by_key(|n| n.category.sort_order);
    for node in &mut roots {
        sort_children(node);
    }
    
    roots
}

fn sort_children(node: &mut crate::models::CategoryTreeNode) {
    node.children.sort_by_key(|n| n.category.sort_order);
    for child in &mut node.children {
        sort_children(child);
    }
}

pub fn has_cycle(categories: &[Category], category_id: &str, new_parent_id: Option<&str>) -> bool {
    if let Some(parent_id) = new_parent_id {
        if category_id == parent_id {
            return true;
        }
        
        let mut current = parent_id;
        loop {
            if let Some(cat) = categories.iter().find(|c| c.id == current) {
                if let Some(parent) = &cat.parent_id {
                    if parent == category_id {
                        return true;
                    }
                    current = parent;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }
    false
}

pub fn get_all_descendant_category_ids(categories: &[Category], category_id: &str) -> Vec<String> {
    let mut result = vec![category_id.to_string()];
    collect_descendant_ids(categories, category_id, &mut result);
    result
}

fn collect_descendant_ids(categories: &[Category], parent_id: &str, result: &mut Vec<String>) {
    for cat in categories {
        if cat.parent_id.as_deref() == Some(parent_id) {
            result.push(cat.id.clone());
            collect_descendant_ids(categories, &cat.id, result);
        }
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
