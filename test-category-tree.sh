#!/bin/bash

API_BASE="http://localhost:8080/api"

echo "=== 创建顶级分类 ==="
PARENT_ID=$(curl -s -X POST "$API_BASE/categories" \
  -H "Content-Type: application/json" \
  -d '{"name": "人工智能宪法"}' | jq -r '.id')
echo "Created parent category: $PARENT_ID"

echo ""
echo "=== 创建子分类 ==="
CHILD_ID=$(curl -s -X POST "$API_BASE/categories" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"代码调试宪法\", \"parent_id\": \"$PARENT_ID\"}" | jq -r '.id')
echo "Created child category: $CHILD_ID"

echo ""
echo "=== 创建孙分类 ==="
GRANDCHILD_ID=$(curl -s -X POST "$API_BASE/categories" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"rust代码宪法\", \"parent_id\": \"$CHILD_ID\"}" | jq -r '.id')
echo "Created grandchild category: $GRANDCHILD_ID"

echo ""
echo "=== 获取所有分类（平铺） ==="
curl -s "$API_BASE/categories" | jq '.'

echo ""
echo "=== 获取分类树 ==="
curl -s "$API_BASE/categories/tree" | jq '.'

echo ""
echo "=== 获取子分类 ==="
curl -s "$API_BASE/categories/$PARENT_ID/children" | jq '.'

echo ""
echo "=== 移动分类 ==="
curl -s -X POST "$API_BASE/categories/$CHILD_ID/move" \
  -H "Content-Type: application/json" \
  -d '{"parent_id": null, "sort_order": 0}' | jq '.'

echo ""
echo "=== 获取更新后的分类树 ==="
curl -s "$API_BASE/categories/tree" | jq '.'

echo ""
echo "=== 删除分类（级联删除） ==="
curl -s -X DELETE "$API_BASE/categories/$PARENT_ID"
echo "Deleted parent category"

echo ""
echo "=== 验证级联删除 ==="
curl -s "$API_BASE/categories" | jq '.'
