# TechBlog - 静态博客

一个基于 Markdown 的静态博客系统，使用 GitHub Pages 托管。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地预览

```bash
npm run serve
```

然后访问 http://localhost:3000

### 3. 一键部署

```bash
npm run deploy
```

## 目录结构

```
tech-blog/
├── content/
│   └── posts/          # Markdown 文章目录（支持子文件夹分类）
├── src/
│   ├── layouts/        # HTML 模板
│   └── assets/         # 静态资源（CSS、图片等）
├── build.js           # 构建脚本
├── deploy.sh          # 一键部署脚本
└── package.json
```

## 专栏与文章

### 添加新专栏

在 `content/posts/` 下创建文件夹，文件夹名即为专栏名：

```
content/posts/
├── Linux/           → Linux 专栏
│   ├── linux-file-commands.md
│   └── linux-network-commands.md
├── GPU/             → GPU 专栏
│   └── gpu-comparison-2025.md
└── 显示基础/        → 显示基础专栏
    └── DDIC-RAM.md
```

### 文章格式

每篇文章放在 `content/posts/` 目录下，以 `.md` 为扩展名。文件开头需要使用 YAML front matter 格式：

```markdown
---
title: "文章标题"
date: "2024-03-22"
author: "TechBlog"
category: "分类名称"
tags: ["标签1", "标签2"]
excerpt: "文章摘要，简短描述"
---

# 文章正文

这里是文章的正文内容...
```

### Front Matter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| title | 是 | 文章标题 |
| date | 是 | 发布日期，格式：YYYY-MM-DD |
| category | 否 | 分类名称（默认使用文件夹名） |
| tags | 否 | 标签数组 |
| excerpt | 否 | 文章摘要，显示在列表页 |
| author | 否 | 作者名称 |

## 添加/修改/删除文章

1. 在 `content/posts/` 目录下添加/修改/删除 `.md` 文件
2. 执行 `npm run deploy`

## 自定义样式

- 全局样式：`src/assets/css/style.css`
- 首页模板：`src/layouts/index.html`
- 文章模板：`src/layouts/post.html`
- 基础模板：`src/layouts/base.html`

## 注意事项

- 文章文件必须放在 `content/posts/` 目录下
- front matter 必须放在文件开头，使用 `---` 分隔
- 构建时会自动按日期排序，最新的文章显示在最前面
- 专栏自动根据子文件夹生成，无需手动配置