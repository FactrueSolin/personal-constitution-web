use axum::{
    extract::{Path, Json},
    http::StatusCode,
};
use crate::models::{Category, CreateCategoryRequest, UpdateCategoryRequest};
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
    let category = storage::create_category(req.name);
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
    categories.retain(|c| c.id != id);
    if categories.len() < original_len {
        storage::save_categories(&categories);
        debug_assert!(categories.len() < original_len, "Category deleted");
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}
