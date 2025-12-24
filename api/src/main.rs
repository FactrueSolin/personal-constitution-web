use api::create_router;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let router = create_router();
    let listener = TcpListener::bind("127.0.0.1:8080")
        .await
        .expect("Failed to bind to port 8080");

    debug_assert!(true, "Server starting on 127.0.0.1:8080");

    axum::serve(listener, router)
        .await
        .expect("Server error");
}
