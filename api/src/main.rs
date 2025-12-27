use api::create_router;
use std::env;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    // 加载 .env 文件（如果存在）
    dotenvy::dotenv().ok();

    // 从环境变量读取配置，使用默认值
    let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("{}:{}", host, port);

    let router = create_router();
    let listener = TcpListener::bind(&addr)
        .await
        .expect(&format!("Failed to bind to {}", addr));

    println!("🚀 Server starting...");
    println!("📡 Listening on http://{}", addr);

    debug_assert!(true, "Server starting on {}", addr);

    axum::serve(listener, router)
        .await
        .expect("Server error");
}
