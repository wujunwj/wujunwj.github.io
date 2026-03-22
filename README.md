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

修改文章后，执行以下命令即可自动构建并推送到 GitHub：

```bash
npm run deploy
```

## 目录结构

```
tech-blog/
├── content/
│   └── posts/          # Markdown 文章目录
├── src/
│   ├── layouts/        # HTML 模板
│   └── assets/         # 静态资源（CSS、图片等）
├── public/            # 构建输出目录（自动生成）
├── build.js           # 构建脚本
└── deploy.sh          # 一键部署脚本
```

## 文章格式

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
| category | 是 | 分类名称（用于生成分类页面） |
| tags | 否 | 标签数组 |
| excerpt | 否 | 文章摘要，显示在列表页 |
| author | 否 | 作者名称 |

### 支持的分类

当前模板支持以下分类，请使用英文名称：

- `Linux` - Linux 相关文章
- `Cpp` - C++ 相关文章
- `Graphics` - 图形学相关文章

如需添加新分类，请同时更新 `src/layouts/index.html` 中的导航链接。

## 添加新文章

1. 在 `content/posts/` 目录下创建新的 `.md` 文件
2. 按照上述格式编写 front matter 和正文
3. 执行 `npm run deploy` 部署

## 修改文章

1. 打开 `content/posts/` 目录下对应的 `.md` 文件
2. 修改内容
3. 执行 `npm run deploy` 部署

## 删除文章

1. 删除 `content/posts/` 目录下对应的 `.md` 文件
2. 执行 `npm run deploy` 部署

## 自定义样式

- 全局样式：`src/assets/css/style.css`
- 首页模板：`src/layouts/index.html`
- 文章模板：`src/layouts/post.html`
- 基础模板：`src/layouts/base.html`

## 部署流程（手动）

如果一键部署脚本出现问题，可以手动执行以下步骤：

```bash
# 1. 安装依赖
npm install

# 2. 构建网站
npm run build

# 3. 复制构建结果到根目录
cp -r public/* .

# 4. 提交并推送
git add .
git commit -m "Update blog"
git push origin main
```

## 注意事项

- 文章文件必须放在 `content/posts/` 目录下
- front matter 必须放在文件开头，使用 `---` 分隔
- category 名称会自动转换（小写、特殊字符替换为 `-`）生成分类页面 URL
- 构建时会自动按日期排序，最新的文章显示在最前面
