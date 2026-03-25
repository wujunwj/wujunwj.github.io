---
title: "Linux文本处理命令详解"
date: "2024-03-22"
author: "TechBlog"
category: "Linux"
tags: ["Linux", "命令", "文本处理"]
excerpt: "详细介绍Linux中文本处理相关的命令，包括grep、sed、awk、cut、sort、uniq等命令的参数和使用方法。"
---

# Linux文本处理命令详解

文本处理是Linux最强大的功能之一，本文详细介绍常用的文本处理命令。

## 1. grep - 文本搜索

### 命令基本信息
- **缩写**: grep
- **全称**: global regular expression print
- **功能**: 在文件中搜索匹配的行

### 常用参数

| 参数 | 说明 |
|------|------|
| `-i` | 忽略大小写 |
| `-v` | 反向匹配（显示不包含关键词的行） |
| `-n` | 显示行号 |
| `-c` | 统计匹配行数 |
| `-r` | 递归搜索目录 |
| `-l` | 只显示文件名 |
| `-w` | 匹配整个单词 |
| `-o` | 只显示匹配的部分 |
| `-E` | 使用扩展正则表达式 |
| `-f` | 从文件读取模式 |
| `-A` | 匹配行后显示n行 |
| `-B` | 匹配行前显示n行 |

### 常用示例

```bash
# 基本搜索
grep "keyword" file.txt

# 忽略大小写搜索
grep -i "keyword" file.txt

# 显示行号
grep -n "keyword" file.txt

# 反向匹配（显示不包含keyword的行）
grep -v "keyword" file.txt

# 统计匹配行数
grep -c "keyword" file.txt

# 递归搜索目录
grep -r "keyword" /path/to/dir

# 只显示文件名
grep -l "keyword" *.txt

# 匹配整个单词
grep -w "keyword" file.txt

# 使用正则表达式
grep -E "pattern[0-9]+" file.txt

# 显示匹配行及其后3行
grep -A 3 "keyword" file.txt

# 显示匹配行及其前3行
grep -B 3 "keyword" file.txt

# 显示匹配行及其前后各2行
grep -C 2 "keyword" file.txt

# 从文件读取搜索模式
grep -f patterns.txt file.txt

# 多文件搜索
grep "keyword" file1.txt file2.txt

# 显示不包含keyword的文件
grep -L "keyword" *.txt

# 高亮显示（彩色输出）
grep --color=always "keyword" file.txt
```

### 正则表达式示例

```bash
# 匹配以word开头的行
grep "^word" file.txt

# 匹配以word结尾的行
grep "word$" file.txt

# 匹配空行
grep "^$" file.txt

# 匹配任意单个字符
grep "wo.d" file.txt

# 匹配数字
grep -E "[0-9]+" file.txt

# 匹配邮箱格式
grep -E "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" file.txt

# 匹配IP地址
grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" file.txt
```

## 2. sed - 流编辑器

### 命令基本信息
- **缩写**: sed
- **全称**: stream editor
- **功能**: 对文本进行替换、删除、插入等操作

### 常用参数

| 参数 | 说明 |
|------|------|
| `-i` | 直接修改文件 |
| `-e` | 指定编辑命令 |
| `-n` | 禁止自动输出 |
| `-r` | 使用扩展正则表达式 |
| `-f` | 从文件读取命令 |

### 常用示例

```bash
# 替换所有匹配的字符串
sed 's/old/new/g' file.txt

# 替换第n行的匹配
sed 'ns/old/new/' file.txt

# 替换每行第一个匹配
sed 's/old/new/' file.txt

# 删除包含keyword的行
sed '/keyword/d' file.txt

# 删除空行
sed '/^$/d' file.txt

# 删除指定行
sed '1d' file.txt       # 删除第1行
sed '1,5d' file.txt     # 删除1到5行

# 在第n行后插入内容
sed '1a\新内容' file.txt

# 在第n行前插入内容
sed '1i\新内容' file.txt

# 替换多行
sed '1,3c\新内容' file.txt

# 显示特定行
sed -n '5p' file.txt        # 显示第5行
sed -n '5,10p' file.txt     # 显示5到10行

# 替换并保存到文件
sed -i 's/old/new/g' file.txt

# 使用正则表达式替换
sed -E 's/[0-9]+/NUM/g' file.txt

# 多命令组合
sed -e 's/old1/new1/g' -e 's/old2/new2/g' file.txt

# 打印行号
sed -n '=' file.txt

# 替换指定位置的文本
sed 's/\bword\b/replacement/g' file.txt   # 替换整个单词

# 使用&代表匹配的内容
sed 's/word/[&]/g' file.txt   # 将word替换为[word]
```

### 高级用法

```bash
# 前后文替换
sed '/start/,/end/s/old/new/g' file.txt

# 条件替换（只在匹配某行时替换）
sed '/pattern1/s/old/new/g' file.txt

# 大小写转换
sed 's/[a-z]/\U&/g' file.txt   # 转大写
sed 's/[A-Z]/\L&/g' file.txt   # 转小写
```

## 3. awk - 文本处理工具

### 命令基本信息
- **缩写**: awk
- **全称**: Aho, Weinberger, Kernighan
- **功能**: 强大的文本分析和报告生成工具

### 常用参数

| 参数 | 说明 |
|------|------|
| `-F` | 指定字段分隔符 |
| `-v` | 定义变量 |
| `-f` | 从文件读取脚本 |

### 内置变量

| 变量 | 说明 |
|------|------|
| $0 | 整行 |
| $1-$n | 第n个字段 |
| NF | 字段总数 |
| NR | 行号 |
| FS | 字段分隔符 |
| RS | 行分隔符 |
| OFS | 输出字段分隔符 |
| ORS | 输出行分隔符 |

### 常用示例

```bash
# 打印第一列
awk '{print $1}' file.txt

# 打印多列
awk '{print $1, $3}' file.txt

# 指定分隔符
awk -F: '{print $1}' /etc/passwd

# 使用多个分隔符
awk -F'[:/]' '{print $1}' file.txt

# 显示行号和内容
awk '{print NR, $0}' file.txt

# 显示特定行
awk 'NR==5 {print}' file.txt

# 条件筛选
awk '$3 > 80 {print}' file.txt

# 统计计算
awk '{sum+=$1} END {print sum}' file.txt

# 求平均值
awk '{sum+=$1} END {print sum/NR}' file.txt

# 查找最大值
awk 'BEGIN{max=0} {if($1>max) max=$1} END{print max}' file.txt

# 字符串处理
awk '{print toupper($1)}' file.txt   # 转大写
awk '{print tolower($1)}' file.txt   # 转小写
awk '{print length($0)}' file.txt    # 长度

# 格式化输出
awk '{printf "%-10s %d\n", $1, $2}' file.txt

# 多条件
awk '/pattern1/ || /pattern2/ {print}' file.txt

# 区间选择
awk 'NR>=5 && NR<=10 {print}' file.txt

# 字段拼接
awk '{print $1 "-" $2}' file.txt
```

### 完整脚本示例

```bash
# 统计日志中每个IP的访问次数
awk '{print $1}' access.log | sort | uniq -c | sort -rn

# 计算文件总大小
ls -l | awk '{sum+=$5} END {print sum}'

# 格式化输出表格
awk -F: 'BEGIN{print "Name\tID"} {print $1"\t"$3} END{print "---"}' /etc/passwd
```

## 4. cut - 字段提取

### 命令基本信息
- **缩写**: cut
- **全称**: cut
- **功能**: 从文本中提取指定字段

### 常用参数

| 参数 | 说明 |
|------|------|
| `-d` | 指定分隔符 |
| `-f` | 指定要提取的字段 |
| `-c` | 按字符提取 |
| `-b` | 按字节提取 |
| `--complement` | 取反 |

### 常用示例

```bash
# 提取第一列（以Tab为分隔符）
cut -f1 file.txt

# 以冒号为分隔符提取第一列
cut -d':' -f1 /etc/passwd

# 提取多个字段
cut -d':' -f1,3,5 /etc/passwd

# 提取第1到5个字符
cut -c1-5 file.txt

# 提取前10个字符
cut -c-10 file.txt

# 从第5个字符开始提取
cut -c5- file.txt

# 提取特定字符
cut -c1,3,5 file.txt

# 不包含指定字段
cut -d':' --complement -f1 /etc/passwd   # 除了第一列

# 合并多个文件
cut -d',' -f1 file1.txt file2.txt
```

## 5. sort - 排序

### 命令基本信息
- **缩写**: sort
- **全称**: sort
- **功能**: 对文本进行排序

### 常用参数

| 参数 | 说明 |
|------|------|
| `-r` | 反向排序 |
| `-n` | 数字排序 |
| `-k` | 按指定字段排序 |
| `-t` | 指定字段分隔符 |
| `-u` | 去重 |
| `-f` | 忽略大小写 |
| `-b` | 忽略前导空白 |
| `-o` | 输出到文件 |

### 常用示例

```bash
# 按字母排序
sort file.txt

# 反向排序
sort -r file.txt

# 数字排序
sort -n numbers.txt

# 按第二列排序
sort -k2 file.txt

# 以冒号为分隔符按第三列排序
sort -t':' -k3 /etc/passwd

# 数字比较
sort -n -k2 file.txt

# 忽略大小写排序
sort -f file.txt

# 去重排序
sort -u file.txt

# 输出到文件
sort file.txt -o sorted.txt

# 组合：按数字第三列反向排序
sort -rn -k3 file.txt

# 检查是否已排序
sort -c file.txt

# 稳定排序（相同值保持原顺序）
sort -s file.txt
```

## 6. uniq - 去重

### 命令基本信息
- **缩写**: uniq
- **全称**: unique
- **功能**: 去除重复行（需配合sort使用）

### 常用参数

| 参数 | 说明 |
|------|------|
| `-c` | 显示每行出现次数 |
| `-d` | 只显示重复行 |
| `-u` | 只显示不重复的行 |
| `-i` | 忽略大小写 |
| `-n` | 跳过前n个字段比较 |
| `-s` | 跳过前n个字符比较 |

### 常用示例

```bash
# 去重（需先排序）
sort file.txt | uniq

# 统计每行出现次数
sort file.txt | uniq -c

# 只显示重复行
sort file.txt | uniq -d

# 只显示不重复的行
sort file.txt | uniq -u

# 忽略大小写
sort file.txt | uniq -i

# 跳过前2个字段比较
sort file.txt | uniq -f2
```

## 7. wc - 文本统计

### 命令基本信息
- **缩写**: wc
- **全称**: word count
- **功能**: 统计行数、单词数、字符数

### 常用参数

| 参数 | 说明 |
|------|------|
| `-l` | 统计行数 |
| `-w` | 统计单词数 |
| `-c` | 统计字符数 |
| `-m` | 统计字符数（不包括换行） |
| `-L` | 显示最长行的长度 |

### 常用示例

```bash
# 统计行数
wc -l file.txt

# 统计单词数
wc -w file.txt

# 统计字节数
wc -c file.txt

# 统计所有
wc file.txt

# 统计多个文件
wc -l *.txt

# 显示最长行长度
wc -L file.txt
```

## 8. tr - 字符转换

### 命令基本信息
- **缩写**: tr
- **全称**: translate
- **功能**: 字符转换、删除、压缩

### 常用示例

```bash
# 转换为小写
echo "HELLO" | tr 'A-Z' 'a-z'

# 转换为大写
echo "hello" | tr 'a-z' 'A-Z'

# 删除特定字符
echo "hello123" | tr -d '0-9'

# 压缩连续相同字符
echo "helloooo" | tr -s 'o'

# 删除换行符（合并为单行）
cat file.txt | tr '\n' ' '

# 替换特定字符
echo "hello" | tr 'l' 'L'

# 删除数字
cat file.txt | tr -d '[0-9]'
```

## 9. tee - 分输出

### 命令基本信息
- **缩写**: tee
- **全称**: tee
- **功能**: 同时输出到终端和文件

### 常用示例

```bash
# 同时显示和保存
command | tee output.txt

# 追加模式
command | tee -a output.txt

# 多重管道
command1 | tee file1.txt | command2

# 记录日志
echo $(date) " - Starting process" | tee -a log.txt
```

## 10. diff - 文件对比

### 命令基本信息
- **缩写**: diff
- **全称**: difference
- **功能**: 比较两个文件的差异

### 常用参数

| 参数 | 说明 |
|------|------|
| `-u` | 统一格式输出 |
| `-c` | 上下文格式 |
| `-i` | 忽略大小写 |
| `-r` | 递归比较目录 |
| `-q` | 只显示是否有差异 |

### 常用示例

```bash
# 比较两个文件
diff file1.txt file2.txt

# 统一格式输出
diff -u file1.txt file2.txt

# 上下文格式
diff -c file1.txt file2.txt

# 忽略大小写
diff -i file1.txt file2.txt

# 只显示差异摘要
diff -q file1.txt file2.txt

# 并排显示
diff -y file1.txt file2.txt
```

## 总结

这些命令可以组合使用，发挥更强大的功能：

```bash
# 统计日志中各IP访问量并排序
grep "pattern" access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn

# 查找并替换
grep -n "old" file.txt | sed 's/old/new/g'

# 批量处理
for f in *.txt; do sed -i 's/old/new/g' "$f"; done
```

| 命令 | 主要用途 |
|------|----------|
| grep | 文本搜索 |
| sed | 文本替换/编辑 |
| awk | 复杂文本处理 |
| cut | 字段提取 |
| sort | 排序 |
| uniq | 去重 |
| wc | 统计 |
| tr | 字符转换 |
| diff | 文件对比 |