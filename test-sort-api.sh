#!/bin/bash

# 测试排序 API 脚本

BASE_URL="http://localhost:8080/api"

echo "=== 测试规则排序 API ==="
echo ""

# 测试1: 按遵守次数降序（默认）
echo "1. 按遵守次数降序（默认）:"
curl -s "${BASE_URL}/rules?sortBy=follow_count&sortOrder=desc" | jq '.' | head -30
echo ""

# 测试2: 按违反次数降序
echo "2. 按违反次数降序:"
curl -s "${BASE_URL}/rules?sortBy=violate_count&sortOrder=desc" | jq '.' | head -30
echo ""

# 测试3: 按遵守次数升序
echo "3. 按遵守次数升序:"
curl -s "${BASE_URL}/rules?sortBy=follow_count&sortOrder=asc" | jq '.' | head -30
echo ""

# 测试4: 按分类筛选并排序
echo "4. 按分类筛选并按遵守次数排序:"
# 先获取一个分类 ID
CATEGORY_ID=$(curl -s "${BASE_URL}/categories" | jq -r '.[0].id')
if [ ! -z "$CATEGORY_ID" ] && [ "$CATEGORY_ID" != "null" ]; then
  curl -s "${BASE_URL}/rules?categoryId=${CATEGORY_ID}&sortBy=follow_count&sortOrder=desc" | jq '.' | head -30
else
  echo "没有找到分类"
fi
echo ""

# 测试5: 获取全部规则（不传 categoryId）
echo "5. 获取全部规则（不传 categoryId）:"
curl -s "${BASE_URL}/rules?sort_by=follow_count&sort_order=desc" | jq '.' | head -30
echo ""

echo "=== 测试完成 ==="
