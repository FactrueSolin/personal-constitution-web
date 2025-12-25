use axum::{
    routing::{get, post, put, delete},
    Router,
};
use tower_http::cors::CorsLayer;
use tower_http::services::{ServeDir, ServeFile};
use crate::handlers;

pub fn create_router() -> Router {
    let cors = CorsLayer::permissive();

    let api_routes = Router::new()
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
        .layer(cors);

    let static_files = ServeDir::new("../out")
        .not_found_service(ServeFile::new("../out/index.html"));

    Router::new()
        .merge(api_routes)
        .fallback_service(static_files)
}
