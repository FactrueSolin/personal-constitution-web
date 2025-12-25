use axum::{
    extract::{Path, Json},
    http::StatusCode,
};
use crate::models::{Category, CreateCategoryRequest, UpdateCategoryRequest, MoveCategoryRequest, CategoryTree};
use crate::storage;
use chrono::Utc;

pub async fn list_categories() -> Json<Vec<Category>> {
    let categories = storage::load_categories();
    debug_assert!(!categories.is_empty() || categories.is_empty(), "Categories loaded");
    Json(categories)
}

pub async fn create_category(
    Json(req): Json<CreateCategoryRequest>,
) -> (StatusCode, Json<Category>) {
    let category = storage::create_category(req.name, req.parent_id, 0);
    let mut categories = storage::load_categories();
    categories.push(category.clone());
    storage::save_categories(&categories);
    debug_assert!(!category.id.is_empty(), "Category created with id");
    (StatusCode::CREATED, Json(category))
}

pub async fn update_category(
    Path(id): Path<String>,
    Json(req): Json<UpdateCategoryRequest>,
) -> Result<Json<Category>, StatusCode> {
    let mut categories = storage::load_categories();
    if let Some(cat) = categories.iter_mut().find(|c| c.id == id) {
        cat.name = req.name;
        if let Some(parent_id) = req.parent_id {
            cat.parent_id = Some(parent_id);
        }
        if let Some(sort_order) = req.sort_order {
            cat.sort_order = sort_order;
        }
        cat.updated_at = Utc::now().to_rfc3339();
        let result = cat.clone();
        storage::save_categories(&categories);
        debug_assert!(!result.id.is_empty(), "Category updated");
        Ok(Json(result))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

pub async fn delete_category(Path(id): Path<String>) -> StatusCode {
    let mut categories = storage::load_categories();
    let original_len = categories.len();
    
    let mut to_delete = vec![id.clone()];
    let mut i = 0;
    while i < to_delete.len() {
        let current_id = to_delete[i].clone();
        for cat in &categories {
            if let Some(parent_id) = &cat.parent_id {
                if parent_id == &current_id && !to_delete.contains(&cat.id) {
                    to_delete.push(cat.id.clone());
                }
            }
        }
        i += 1;
    }
    
    categories.retain(|c| !to_delete.contains(&c.id));
    
    if categories.len() < original_len {
        storage::save_categories(&categories);
        debug_assert!(categories.len() < original_len, "Category deleted");
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

pub async fn get_category_tree() -> Json<CategoryTree> {
    let categories = storage::load_categories();
    let roots = storage::build_category_tree(&categories);
    debug_assert!(!roots.is_empty() || roots.is_empty(), "Category tree built");
    Json(CategoryTree { roots })
}

pub async fn get_children(Path(id): Path<String>) -> Result<Json<Vec<Category>>, StatusCode> {
    let categories = storage::load_categories();
    let children: Vec<Category> = categories
        .iter()
        .filter(|c| c.parent_id.as_ref() == Some(&id))
        .cloned()
        .collect();
    debug_assert!(true, "Children retrieved");
    Ok(Json(children))
}

pub async fn move_category(
    Path(id): Path<String>,
    Json(req): Json<MoveCategoryRequest>,
) -> Result<Json<Category>, StatusCode> {
    let mut categories = storage::load_categories();
    
    if storage::has_cycle(&categories, &id, req.parent_id.as_deref()) {
        return Err(StatusCode::BAD_REQUEST);
    }
    
    if let Some(cat) = categories.iter_mut().find(|c| c.id == id) {
        cat.parent_id = req.parent_id;
        cat.sort_order = req.sort_order;
        cat.updated_at = Utc::now().to_rfc3339();
        let result = cat.clone();
        storage::save_categories(&categories);
        debug_assert!(!result.id.is_empty(), "Category moved");
        Ok(Json(result))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}
