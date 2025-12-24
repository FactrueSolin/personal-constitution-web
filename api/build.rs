fn main() {
    prost_build::compile_protos(
        &["../proto/category.proto", "../proto/rule.proto", "../proto/count_record.proto"],
        &["../proto"],
    )
    .unwrap();
}
