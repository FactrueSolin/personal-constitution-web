use axum::{
    routing::{get, post, put, delete},
    Router,
};
use tower_http::cors::CorsLayer;
use crate::handlers;

pub fn create_router() -> Router {
    let cors = CorsLayer::permissive();

    Router::new()
        .route("/api/categories", get(handlers::list_categories))
        .route("/api/categories", post(handlers::create_category))
        .route("/api/categories/tree", get(handlers::get_category_tree))
        .route("/api/categories/{id}", put(handlers::update_category))
        .route("/api/categories/{id}", delete(handlers::delete_category))
        .route("/api/categories/{id}/children", get(handlers::get_children))
        .route("/api/categories/{id}/move", post(handlers::move_category))
        .route("/api/rules", get(handlers::list_rules))
        .route("/api/rules", post(handlers::create_rule))
        .route("/api/rules/{id}", put(handlers::update_rule))
        .route("/api/rules/{id}", delete(handlers::delete_rule))
        .route("/api/rules/{id}/follow", post(handlers::follow_rule))
        .route("/api/rules/{id}/violate", post(handlers::violate_rule))
        .layer(cors)
}
