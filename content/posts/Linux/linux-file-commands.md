---
title: "Linux文件操作命令详解"
date: "2024-03-22"
author: "TechBlog"
category: "Linux"
tags: ["Linux", "命令", "文件操作"]
excerpt: "详细介绍Linux中文件操作相关的命令，包括ls、cd、cp、mv、rm、mkdir等命令的参数和使用方法。"
---

# Linux文件操作命令详解

本文详细介绍Linux中最常用的文件操作命令，帮助你全面掌握文件管理技能。

## 1. ls - 列出目录内容

### 命令基本信息
- **缩写**: ls
- **全称**: list
- **功能**: 列出目录中的文件和子目录

### 常用参数

| 参数 | 说明 |
|------|------|
| `-l` | 使用长列表格式，显示详细信息 |
| `-a` | 显示所有文件，包括隐藏文件（以.开头） |
| `-h` | 以人类可读的格式显示文件大小 |
| `-t` | 按修改时间排序，最新的在前 |
| `-r` | 反向排序 |
| `-R` | 递归列出子目录 |
| `-S` | 按文件大小排序 |
| `-i` | 显示文件的inode号 |

### 常用示例

```bash
# 查看当前目录内容
ls

# 查看当前目录详细信息
ls -l

# 查看所有文件（包括隐藏文件）
ls -a

# 查看文件详细信息，大小以人类可读格式显示
ls -lh

# 按修改时间排序显示
ls -lt

# 按文件大小排序（从大到小）
ls -lS

# 递归显示子目录
ls -R

# 查看指定目录
ls /home/user/documents

# 组合使用：显示所有文件的详细信息
ls -lah

# 显示文件inode号
ls -li
```

### 输出格式说明

```
-rw-r--r--  1 user  staff  1024  Mar 22 10:30  file.txt
|权限       |链接数|所有者|组   |大小  |日期       |文件名
```

## 2. cd - 切换目录

### 命令基本信息
- **缩写**: cd
- **全称**: change directory
- **功能**: 改变当前工作目录

### 常用示例

```bash
# 切换到指定目录
cd /home/user/documents

# 切换到用户主目录
cd ~
cd

# 切换到上一级目录
cd ..

# 切换到上两级目录
cd ../..

# 切换到上一次所在的目录
cd -

# 切换到当前目录（刷新路径）
cd .
```

## 3. pwd - 显示当前目录

### 命令基本信息
- **缩写**: pwd
- **全称**: print working directory
- **功能**: 显示当前工作目录的完整路径

### 常用参数

| 参数 | 说明 |
|------|------|
| `-L` | 显示逻辑路径（默认） |
| `-P` | 显示物理路径（解析符号链接） |

### 常用示例

```bash
# 显示当前目录
pwd

# 显示物理路径（不跟随符号链接）
pwd -P
```

## 4. cp - 复制文件/目录

### 命令基本信息
- **缩写**: cp
- **全称**: copy
- **功能**: 复制文件或目录

### 常用参数

| 参数 | 说明 |
|------|------|
| `-r` | 递归复制目录及其内容 |
| `-i` | 覆盖前询问确认 |
| `-v` | 显示详细的复制过程 |
| `-p` | 保留文件属性（权限、时间戳等） |
| `-a` | 相当于 -dpr，保留所有属性 |
| `-f` | 强制覆盖，不询问 |
| `-u` | 只复制源文件更新或不存在时复制 |
| `-l` | 创建硬链接而非复制 |
| `-s` | 创建符号链接而非复制 |
| `-n` | 不覆盖已存在的文件 |

### 常用示例

```bash
# 复制单个文件
cp file.txt backup.txt

# 复制文件到指定目录
cp file.txt /home/user/documents/

# 复制目录（需要 -r 参数）
cp -r myfolder /home/user/documents/

# 复制时保留文件属性
cp -p file.txt backup.txt

# 复制时显示详细信息
cp -v file.txt backup.txt

# 覆盖前询问
cp -i file.txt backup.txt

# 强制覆盖
cp -f file.txt backup.txt

# 组合使用：递归复制并保留属性
cp -rp source_dir/ dest_dir/

# 复制多个文件到指定目录
cp file1.txt file2.txt /home/user/documents/

# 创建符号链接
cp -s original.txt link.txt
```

## 5. mv - 移动/重命名文件

### 命令基本信息
- **缩写**: mv
- **全称**: move
- **功能**: 移动文件或目录，也可用于重命名

### 常用参数

| 参数 | 说明 |
|------|------|
| `-i` | 覆盖前询问确认 |
| `-f` | 强制覆盖，不询问 |
| `-v` | 显示详细的移动过程 |
| `-n` | 不覆盖已存在的文件 |
| `-u` | 只移动源文件更新或不存在时移动 |

### 常用示例

```bash
# 重命名文件
mv oldname.txt newname.txt

# 移动文件到指定目录
mv file.txt /home/user/documents/

# 移动多个文件
mv file1.txt file2.txt /home/user/documents/

# 移动目录
mv myfolder /home/user/documents/

# 覆盖前询问
mv -i file.txt /home/user/documents/

# 强制覆盖
mv -f file.txt /home/user/documents/

# 显示详细信息
mv -v file.txt /home/user/documents/

# 重命名目录
mv oldfolder newfolder
```

## 6. rm - 删除文件/目录

### 命令基本信息
- **缩写**: rm
- **全称**: remove
- **功能**: 删除文件或目录

### 常用参数

| 参数 | 说明 |
|------|------|
| `-r` | 递归删除目录及其内容 |
| `-f` | 强制删除，不询问确认 |
| `-i` | 删除前询问确认 |
| `-v` | 显示详细的删除过程 |
| `-rf` | 强制递归删除（危险！） |

### 常用示例

```bash
# 删除单个文件
rm file.txt

# 删除多个文件
rm file1.txt file2.txt

# 删除前询问确认
rm -i file.txt

# 强制删除，不询问
rm -f file.txt

# 删除目录（需要 -r 参数）
rm -r myfolder/

# 强制删除目录
rm -rf myfolder/

# 删除所有以 .txt 结尾的文件
rm *.txt

# 显示删除过程
rm -v file.txt

# 删除空目录
rmdir empty_folder/

# 安全删除：删除前确认每个文件
rm -ri directory/
```

### ⚠️ 危险操作警告

```bash
# 绝对不要执行以下命令！会删除整个系统
rm -rf /
rm -rf /*
```

## 7. mkdir - 创建目录

### 命令基本信息
- **缩写**: mkdir
- **全称**: make directory
- **功能**: 创建新目录

### 常用参数

| 参数 | 说明 |
|------|------|
| `-p` | 递归创建父目录 |
| `-v` | 显示详细的创建过程 |
| `-m` | 指定新目录的权限 |

### 常用示例

```bash
# 创建单个目录
mkdir myfolder

# 在指定位置创建目录
mkdir /home/user/documents/newfolder

# 递归创建多级目录
mkdir -p /home/user/documents/level1/level2/level3

# 创建目录并设置权限
mkdir -m 755 myfolder

# 同时创建多个目录
mkdir folder1 folder2 folder3

# 递归创建并显示详细信息
mkdir -pv /home/user/documents/project/src
```

## 8. touch - 创建空文件/更新时间戳

### 命令基本信息
- **缩写**: touch
- **全称**: touch
- **功能**: 创建空文件或更新文件的时间戳

### 常用参数

| 参数 | 说明 |
|------|------|
| `-a` | 只更改访问时间 |
| `-m` | 只更改修改时间 |
| `-c` | 不创建新文件 |
| `-d` | 指定时间 |
| `-t` | 指定时间戳 |

### 常用示例

```bash
# 创建空文件
touch newfile.txt

# 同时创建多个文件
touch file1.txt file2.txt file3.txt

# 更新文件时间戳为当前时间
touch existingfile.txt

# 创建文件并指定时间
touch -d "2024-01-01 00:00:00" newfile.txt

# 只更新访问时间
touch -a file.txt

# 只更新修改时间
touch -m file.txt
```

## 9. cat - 查看文件内容

### 命令基本信息
- **缩写**: cat
- **全称**: concatenate
- **功能**: 连接并显示文件内容，也可用于创建文件

### 常用参数

| 参数 | 说明 |
|------|------|
| `-n` | 显示行号 |
| `-b` | 对非空行显示行号 |
| `-s` | 将多个空行合并为一行 |
| `-v` | 显示非打印字符 |

### 常用示例

```bash
# 查看文件内容
cat file.txt

# 显示行号
cat -n file.txt

# 对非空行显示行号
cat -b file.txt

# 合并多个空行
cat -s file.txt

# 显示非打印字符
cat -v file.txt

# 从标准输入创建文件
cat > newfile.txt
# 输入内容，然后按 Ctrl+D 保存

# 追加内容到文件
cat >> existingfile.txt
# 输入追加内容，然后按 Ctrl+D

# 合并多个文件
cat file1.txt file2.txt > combined.txt
```

## 10. more/less - 分页查看文件

### 命令基本信息
- **缩写**: more / less
- **全称**: more / less
- **功能**: 分页显示文件内容，支持前后翻页

### less 常用操作

```bash
# 查看文件
less file.txt

# 显示行号
less -N file.txt

# 向下翻一页
Space

# 向上翻一页
b

# 向下滚动一行
Enter

# 向上滚动一行
y

# 跳到文件开头
g

# 跳到文件结尾
G

# 搜索关键词
/keyword
n - 下一个匹配
N - 上一个匹配

# 退出
q
```

## 11. head/tail - 查看文件头部/尾部

### 命令基本信息
- **缩写**: head / tail
- **全称**: head / tail
- **功能**: 显示文件的头部或尾部内容

### 常用参数

| 参数 | 说明 |
|------|------|
| `-n` | 指定显示行数 |
| `-c` | 指定显示字节数 |
| `-f` | 实时追踪文件变化（tail） |

### 常用示例

```bash
# 查看文件前10行（默认）
head file.txt

# 指定显示前20行
head -n 20 file.txt

# 显示前100字节
head -c 100 file.txt

# 查看文件后10行（默认）
tail file.txt

# 指定显示后20行
tail -n 20 file.txt

# 实时查看日志（Ctrl+C 退出）
tail -f /var/log/syslog

# 查看最后100行
tail -n 100 /var/log/syslog
```

## 12. find - 文件查找

### 命令基本信息
- **缩写**: find
- **全称**: find
- **功能**: 在目录树中搜索文件

### 常用参数

| 参数 | 说明 |
|------|------|
| `-name` | 按文件名搜索 |
| `-type` | 按文件类型搜索（f/d/l） |
| `-mtime` | 按修改时间搜索 |
| `-size` | 按文件大小搜索 |
| `-perm` | 按权限搜索 |
| `-exec` | 对找到的文件执行命令 |

### 常用示例

```bash
# 按文件名搜索
find /home -name "*.txt"

# 不区分大小写的文件名搜索
find /home -iname "*.TXT"

# 搜索目录
find /home -type d

# 搜索符号链接
find /home -type l

# 搜索最近7天修改的文件
find /home -mtime -7

# 搜索刚好7天前修改的文件
find /home -mtime 7

# 搜索超过30天未访问的文件
find /home -atime +30

# 搜索大于100MB的文件
find /home -size +100M

# 搜索空文件
find /home -empty

# 搜索并删除
find /home -name "*.tmp" -delete

# 搜索并执行命令
find /home -name "*.log" -exec wc -l {} \;

# 搜索多个条件
find /home -name "*.txt" -o -name "*.doc"

# 限制搜索深度
find /home -maxdepth 2 -name "*.txt"
```

## 总结

掌握这些文件操作命令是Linux使用的基础。建议在日常工作中多加练习，形成肌肉记忆。这些命令可以组合使用，发挥更强大的功能。