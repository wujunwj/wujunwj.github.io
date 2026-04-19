---
title: "Git 与 GitHub 入门指南"
date: "2026-04-19"
author: "TechBlog"
category: "工具"
tags: ["工具", "git"]
excerpt: "Git 与 GitHub 入门指南"
---

# Git 与 GitHub 入门指南（含分支与 Pull Request 详解）

> 本文档面向 Git 初学者，涵盖从安装配置、创建仓库、同步代码，到理解分支与 Pull Request 的完整流程。每一条命令都附有参数解释和目的说明。

---

## 一、准备工作：安装与配置

### 1. 安装 Git
- 访问 [Git 官网](https://git-scm.com/) 下载对应操作系统版本。
- Windows 用户安装时，在 “Select Components” 步骤建议勾选 “Git Bash Here” 和 “Git GUI Here”。

### 2. 配置用户信息
提交代码时会附带这些信息，用于标识作者。

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你注册GitHub的邮箱"
```

- `--global`：全局配置，对本机所有仓库生效。
- 去掉 `--global` 则为仅当前仓库配置。

---

## 二、创建本地仓库与首次提交

### 1. 初始化仓库
```bash
git init
```
- **目的**：在当前目录创建 `.git` 隐藏文件夹，该文件夹是版本控制的“数据库”，**切勿删除**。
- **常用参数**：
  - `git init <目录名>`：在指定目录创建仓库。
  - `--initial-branch=<分支名>`：指定初始分支名称（默认 `master`）。

### 2. 添加文件到暂存区
```bash
git add <文件名>
```
- **目的**：告诉 Git 哪些文件的改动需要被记录在下次提交中（类似“选中”）。
- **常用参数**：
  - `.`：添加当前目录下所有新文件和修改过的文件。
  - `-A` 或 `--all`：添加所有类型的改动（包括删除）。
  - `*.txt`：添加所有 `.txt` 文件。

### 3. 提交到本地仓库
```bash
git commit -m "提交信息"
```
- **目的**：将暂存区的内容生成一个永久快照，保存到本地仓库的历史中。
- **常用参数**：
  - `-m "信息"`：附带的提交说明（强烈建议写清楚改了什么）。
  - `-a`：自动把所有**已跟踪**的修改和删除文件加入暂存区（不包含新文件）。
  - `--amend`：修改最近一次提交的信息或内容。

### 4. 查看状态与历史
```bash
git status          # 查看工作区和暂存区的状态
git log --oneline   # 简洁地查看提交历史
```

---

## 三、连接远程仓库（GitHub）

### 1. 在 GitHub 上创建仓库
- 登录 GitHub，点击右上角 `+` → `New repository`。
- 填写仓库名，建议勾选 `Add a README file`（或稍后自己创建）。
- 创建后复制仓库地址（HTTPS 或 SSH）。

### 2. 关联本地仓库与远程仓库
```bash
git remote add origin <远程仓库地址>
```
- **目的**：给远程仓库起一个别名（默认叫 `origin`），避免每次都输入完整 URL。
- **常用参数**：
  - `git remote -v`：查看当前所有远程仓库别名及地址。
  - `git remote rm origin`：删除名为 `origin` 的远程仓库关联。
  - `git remote rename <旧名> <新名>`：重命名远程仓库别名。

### 3. 首次推送到 GitHub
```bash
git push -u origin main
```
- **目的**：将本地 `main` 分支的所有提交上传到远程仓库，并建立本地分支与远程分支的关联。
- **参数详解**：
  - `-u`（或 `--set-upstream`）：设置上游分支，之后只需 `git push` 即可自动推送到同一远程分支。
  - `origin`：远程仓库别名。
  - `main`：要推送的本地分支名（GitHub 新仓库默认主分支为 `main`；老仓库可能叫 `master`）。

### 4. 后续更新同步
修改文档后，重复三步：
```bash
git add .
git commit -m "更新说明"
git push          # 因为之前用了 -u，现在可以直接用 git push
```

### 5. 拉取远程更新
```bash
git pull origin main
```
- **目的**：从远程仓库拉取最新内容并自动合并到当前本地分支（相当于 `git fetch` + `git merge`）。

---

## 四、分支（Branch）详解

### 1. 什么是分支？
分支是一条**独立的开发时间线**。默认主分支通常叫 `main` 或 `master`。你可以从主分支分出多个分支，在不同分支上并行开发不同功能，互不干扰，最后再合并回来。

> 类比：写论文时，你想尝试新的章节结构，但不想破坏原稿。于是“复制”一份原稿（分支），在副本上修改。满意后把副本内容粘贴回原稿（合并）；不满意则直接丢弃副本。

### 2. 为什么要用分支？
- **隔离风险**：实验性代码不会破坏稳定版本。
- **并行协作**：多人可以在不同分支上同时开发。
- **代码审查**：配合 Pull Request，可以在合并前进行评审。
- **灵活回滚**：每个分支的历史独立，便于单独回退某个功能。

### 3. 常用分支操作命令

| 操作 | 命令 | 说明 |
|------|------|------|
| 查看本地分支 | `git branch` | 当前分支前会有 `*` 标记 |
| 创建分支 | `git branch <分支名>` | 仅创建，不切换 |
| 创建并切换 | `git checkout -b <分支名>` | 一步完成创建和切换 |
| 切换分支 | `git checkout <分支名>` | 切换到已有分支 |
| 合并分支 | `git merge <分支名>` | 将指定分支合并到当前分支 |
| 删除本地分支 | `git branch -d <分支名>` | 删除已合并的分支（安全删除） |
| 强制删除 | `git branch -D <分支名>` | 删除未合并的分支（谨慎使用） |
| 推送分支到远程 | `git push origin <分支名>` | 将本地分支推送到 GitHub |
| 删除远程分支 | `git push origin --delete <分支名>` | 删除远程仓库上的分支 |

### 4. 典型分支工作流示例

```bash
# 1. 从 main 分支创建新分支
git checkout -b feature-docs

# 2. 在新分支上工作（修改文件、添加内容）
echo "# 新文档" >> README.md
git add .
git commit -m "更新 README"

# 3. 切回 main 分支
git checkout main

# 4. 将 feature-docs 的改动合并到 main
git merge feature-docs

# 5. 删除本地分支（可选）
git branch -d feature-docs

# 6. 推送 main 到 GitHub
git push origin main
```

---

## 五、Pull Request（PR）详解

### 1. 什么是 Pull Request？
**Pull Request（简称 PR）不是 Git 的原生命令**，而是 GitHub、GitLab 等代码托管平台提供的协作功能。它的作用是：**请求项目维护者将你某个分支上的改动，拉取（pull）到主分支（如 `main`）**。

### 2. 为什么需要 PR？
- **代码审查**：团队成员可以在 PR 页面逐行评论、提出修改建议。
- **自动化检查**：可触发 CI（持续集成）运行测试、检查代码风格。
- **讨论记录**：所有讨论和决策过程都会保存在 PR 中。
- **权限控制**：主分支可设置为“禁止直接推送”，所有改动必须通过 PR 才能合并，防止误操作。

### 3. PR 的标准流程（以 GitHub 为例）
1. 将本地分支推送到远程仓库：  
   `git push origin feature-login`
2. 在 GitHub 仓库页面，点击 **Compare & pull request** 按钮。
3. 填写 PR 标题和描述，说明改动的目的和内容。
4. 团队成员审查代码，可在 PR 下留言、要求修改。
5. 你根据反馈继续在本地 `feature-login` 分支上修改，再次推送（PR 会自动更新）。
6. 审查通过后，点击 **Merge pull request** 合并到 `main` 分支。
7. 删除远程分支（GitHub 会提示）和本地分支：  
   `git branch -d feature-login`

### 4. 个人项目是否需要 PR？
- **不需要**：你可以在本地合并分支，然后直接推送 `main`。
- **推荐尝试**：即使是个人项目，使用 PR 也能让你熟悉团队协作的标准操作，并在 GitHub 上留下清晰的改动记录。

### 5. 结合分支与 PR 的完整协作示例

```bash
# 本地：创建并切换到新分支
git checkout -b feature-login

# 编写代码...
git add .
git commit -m "实现登录功能"

# 推送到远程（首次需要 -u）
git push -u origin feature-login

# 在 GitHub 上创建 PR，自己或团队成员审查后合并

# 合并后，在本地更新 main 并清理分支
git checkout main
git pull origin main          # 拉取远程合并后的 main
git branch -d feature-login   # 删除本地分支
```

---

## 六、常见问题与最佳实践

### 1. 写好提交信息
- 格式：`<类型>: <简短描述>`，例如 `feat: 添加用户注册`、`docs: 更新 README`、`fix: 修复空指针异常`。
- 描述尽量清晰，方便日后回顾。

### 2. 用好 `.gitignore`
在项目根目录创建 `.gitignore` 文件，把不需要 Git 跟踪的文件写进去（如 `node_modules/`、`.DS_Store`、`*.log` 等）。  
示例：
```
node_modules/
.env
*.log
```

### 3. 分支命名建议
- `feature/xxx`：新功能
- `bugfix/xxx`：修复 bug
- `docs/xxx`：文档更新
- `hotfix/xxx`：紧急修复（通常直接从 main 切出）

### 4. 保持分支与主分支同步
在功能分支开发时，定期将 `main` 的更新合并进来，避免最终合并时出现大量冲突：
```bash
git checkout feature-xxx
git merge main   # 将 main 的最新改动合并到当前分支
```

### 5. 撤销与回退（常用）
| 需求 | 命令 |
|------|------|
| 撤销工作区的修改（未 add） | `git checkout -- <文件>` |
| 撤销暂存区的修改（已 add） | `git reset HEAD <文件>` |
| 修改最近一次提交信息 | `git commit --amend -m "新信息"` |
| 回退到某个历史版本（保留修改） | `git reset --soft <commit-hash>` |
| 回退到某个历史版本（丢弃修改） | `git reset --hard <commit-hash>` |

---

## 七、速查表

| 命令 | 用途 |
|------|------|
| `git init` | 初始化仓库 |
| `git add .` | 添加所有改动到暂存区 |
| `git commit -m "msg"` | 提交到本地仓库 |
| `git status` | 查看状态 |
| `git log --oneline` | 查看提交历史 |
| `git remote add origin <url>` | 关联远程仓库 |
| `git push -u origin main` | 首次推送并建立关联 |
| `git push` | 后续推送 |
| `git pull` | 拉取并合并远程更新 |
| `git branch` | 列出分支 |
| `git checkout -b <branch>` | 创建并切换分支 |
| `git merge <branch>` | 合并分支 |
| `git branch -d <branch>` | 删除本地分支 |
| `git push origin <branch>` | 推送分支到远程 |

---

## 八、总结

- **Git 是本地版本控制工具**，GitHub 是远程代码托管平台。
- 基本流程：`修改 → add → commit → push`。
- **分支**让你安全地并行开发不同功能。
- **Pull Request** 是团队协作中代码审查和合并的标准方式。
- 即使是个人项目，也建议尝试分支与 PR 流程，为将来团队开发打好基础。

> 学习 Git 最好的方式是**动手实践**。创建一个测试仓库，反复执行上述命令，观察 `git status` 和 `git log` 的变化，你会很快掌握这些核心概念。

**祝你 Git 之旅顺利！**

