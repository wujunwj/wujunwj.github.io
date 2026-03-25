#!/bin/bash

set -e

echo "=========================================="
echo "  TechBlog 一键部署脚本"
echo "=========================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 tech-blog 目录下运行此脚本"
    exit 1
fi

# 检查 git 状态
if [ ! -d ".git" ]; then
    echo "❌ 错误: 未找到 .git 目录，请先初始化 git"
    exit 1
fi

echo "📦 步骤 1/4: 安装依赖..."
npm install
echo ""

echo "🔨 步骤 2/4: 构建网站..."
npm run build
echo ""

echo "📁 步骤 3/4: 复制构建结果到根目录..."
if [ -d "public" ]; then
    cp -r public/* .
    echo "✅ 构建结果已复制到根目录"
else
    echo "❌ 错误: public 目录不存在，构建可能失败"
    exit 1
fi
echo ""

echo "📤 步骤 4/4: 提交并推送到 GitHub..."
git add .
git commit -m "Update blog - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main
echo ""

echo "=========================================="
echo "  ✅ 部署完成!"
echo "  访问 https://wujunwj.github.io 查看"
echo "=========================================="