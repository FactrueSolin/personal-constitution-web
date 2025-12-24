#!/bin/bash

# API 调试脚本
# 用法: ./test-api.sh

BASE_URL="http://localhost:8080"

echo "=== 个人宪法 API 测试脚本 ==="
echo ""

# 测试创建分类
echo "1. 创建分类..."
CATEGORY=$(curl -s -X POST "$BASE_URL/api/categories" \
  -H "Content-Type: application/json" \
  -d '{"name":"健身"}')
echo "响应: $CATEGORY"
CATEGORY_ID=$(echo $CATEGORY | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "分类 ID: $CATEGORY_ID"
echo ""

# 测试获取所有分类
echo "2. 获取所有分类..."
curl -s -X GET "$BASE_URL/api/categories" | jq .
echo ""

# 测试创建规则
echo "3. 创建规则..."
RULE=$(curl -s -X POST "$BASE_URL/api/rules" \
  -H "Content-Type: application/json" \
  -d "{\"category_id\":\"$CATEGORY_ID\",\"content\":\"每天跑步30分钟\"}")
echo "响应: $RULE"
RULE_ID=$(echo $RULE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "规则 ID: $RULE_ID"
echo ""

# 测试获取规则
echo "4. 获取规则..."
curl -s -X GET "$BASE_URL/api/rules" | jq .
echo ""

# 测试按分类筛选规则
echo "5. 按分类筛选规则..."
curl -s -X GET "$BASE_URL/api/rules?categoryId=$CATEGORY_ID" | jq .
echo ""

# 测试增加遵守计数
echo "6. 增加遵守计数..."
curl -s -X POST "$BASE_URL/api/rules/$RULE_ID/follow" | jq .
echo ""

# 测试增加违反计数
echo "7. 增加违反计数..."
curl -s -X POST "$BASE_URL/api/rules/$RULE_ID/violate" | jq .
echo ""

# 测试更新规则
echo "8. 更新规则..."
curl -s -X PUT "$BASE_URL/api/rules/$RULE_ID" \
  -H "Content-Type: application/json" \
  -d '{"content":"每天跑步45分钟"}' | jq .
echo ""

# 测试更新分类
echo "9. 更新分类..."
curl -s -X PUT "$BASE_URL/api/categories/$CATEGORY_ID" \
  -H "Content-Type: application/json" \
  -d '{"name":"运动"}' | jq .
echo ""

# 测试删除规则
echo "10. 删除规则..."
curl -s -X DELETE "$BASE_URL/api/rules/$RULE_ID" -w "\nStatus: %{http_code}\n"
echo ""

# 测试删除分类
echo "11. 删除分类..."
curl -s -X DELETE "$BASE_URL/api/categories/$CATEGORY_ID" -w "\nStatus: %{http_code}\n"
echo ""

echo "=== 测试完成 ==="
