---
title: "Linux网络命令详解"
date: "2024-03-22"
author: "TechBlog"
category: "Linux"
tags: ["Linux", "命令", "网络"]
excerpt: "详细介绍Linux中网络相关的命令，包括ping、curl、wget、ssh、scp、netstat、ss等命令的参数和使用方法。"
---

# Linux网络命令详解

网络命令是Linux日常使用中不可或缺的工具，本文详细介绍常用的网络命令。

## 1. ping - 测试网络连通性

### 命令基本信息
- **缩写**: ping
- **全称**: packet internet groper
- **功能**: 测试主机之间的网络连通性

### 常用参数

| 参数 | 说明 |
|------|------|
| `-c` | 指定发送的包数量 |
| `-i` | 指定发送包的间隔（秒） |
| `-t` | 设置TTL值 |
| `-s` | 指定数据包大小 |
| `-W` | 等待响应的超时时间 |
| `-4` | 只使用IPv4 |
| `-6` | 只使用IPv6 |

### 常用示例

```bash
# 测试与目标主机的连通性（持续ping）
ping www.google.com

# 发送4个包后停止
ping -c 4 www.google.com

# 每2秒ping一次
ping -i 2 www.google.com

# 设置数据包大小
ping -s 1000 www.google.com

# 等待5秒超时
ping -W 5 www.google.com

# 持续ping直到中断
ping www.google.com

# 禁用停止
ping -w 10 www.google.com

# 使用IPv4
ping -4 www.google.com

# 使用IPv6
ping -6 www.google.com
```

### 输出说明

```
PING www.google.com (142.250.185.68): 56 data bytes
64 bytes from 142.250.185.68: icmp_seq=0 ttl=117 time=25.3 ms
64 bytes from 142.250.185.68: icmp_seq=1 ttl=117 time=24.8 ms

--- www.google.com ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 24.8/25.1/25.3/0.2 ms
```

## 2. curl - 数据传输工具

### 命令基本信息
- **缩写**: curl
- **全称**: client URL
- **功能**: 用于在终端中传输数据，支持多种协议

### 常用参数

| 参数 | 说明 |
|------|------|
| `-X` | 指定请求方法 |
| `-H` | 添加请求头 |
| `-d` | 发送POST数据 |
| `-o` | 保存到文件 |
| `-O` | 使用远程文件名保存 |
| `-s` | 静默模式 |
| `-v` | 显示详细信息 |
| `-L` | 跟随重定向 |
| `-k` | 跳过SSL验证 |
| `-u` | 指定用户名和密码 |

### 常用示例

```bash
# 获取网页内容
curl https://www.example.com

# 保存到文件
curl -o index.html https://www.example.com

# 使用远程文件名保存
curl -O https://www.example.com/file.tar.gz

# 显示详细信息
curl -v https://www.example.com

# 使用POST方法
curl -X POST https://api.example.com/data

# 发送JSON数据
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"test"}' https://api.example.com

# 发送表单数据
curl -d "username=admin&password=123456" https://example.com/login

# 跟随重定向
curl -L https://example.com

# 跳过SSL验证
curl -k https://example.com

# 使用代理
curl -x http://proxy:8080 https://example.com

# 使用Basic认证
curl -u username:password https://example.com

# 发送Cookie
curl -b "session=abc123" https://example.com

# 设置User-Agent
curl -A "Mozilla/5.0" https://example.com

# 下载多个文件
curl -O https://example.com/file1.txt -O https://example.com/file2.txt

# 静默模式（不显示进度）
curl -s https://example.com

# 只显示HTTP头部
curl -I https://example.com

# 断点续传
curl -C - -O https://example.com/largefile.zip
```

## 3. wget - 文件下载工具

### 命令基本信息
- **缩写**: wget
- **全称**: web get
- **功能**: 从网络下载文件

### 常用参数

| 参数 | 说明 |
|------|------|
| `-O` | 指定输出文件名 |
| `-c` | 断点续传 |
| `-r` | 递归下载 |
| `-np` | 不下载上级目录 |
| `-nH` | 不创建主机名目录 |
| `-q` | 静默模式 |
| `-v` | 显示详细信息 |
| `--no-check-certificate` | 跳过SSL验证 |
| `-P` | 指定下载目录 |
| `-U` | 设置User-Agent |
| `-limit-rate` | 限制下载速度 |

### 常用示例

```bash
# 下载文件
wget https://example.com/file.tar.gz

# 指定输出文件名
wget -O myfile.tar.gz https://example.com/file.tar.gz

# 断点续传
wget -c https://example.com/largefile.zip

# 后台下载
wget -b https://example.com/file.tar.gz

# 递归下载整个网站
wget -r https://example.com

# 限制下载速度
wget --limit-rate=1M https://example.com/file.tar.gz

# 下载并跳过SSL验证
wget --no-check-certificate https://example.com/file.tar.gz

# 指定下载目录
wget -P /home/user/downloads https://example.com/file.tar.gz

# 只下载特定类型的文件
wget -r -A "*.jpg,*.png" https://example.com

# 不创建远程目录结构
wget -nH https://example.com/file.tar.gz

# 设置重试次数
wget --tries=3 https://example.com/file.tar.gz

# 下载时显示详细进度
wget -v https://example.com/file.tar.gz
```

## 4. ssh - 远程登录

### 命令基本信息
- **缩写**: ssh
- **全称**: secure shell
- **功能**: 安全的远程登录协议

### 常用参数

| 参数 | 说明 |
|------|------|
| `-p` | 指定端口 |
| `-i` | 指定私钥文件 |
| `-l` | 指定登录用户名 |
| `-v` | 显示调试信息 |
| `-X` | 启用X11转发 |
| `-Y` | 启用可信的X11转发 |
| `-f` | 登录后进入后台 |
| `-N` | 不执行远程命令 |
| `-o` | 指定SSH选项 |

### 常用示例

```bash
# 登录远程主机
ssh user@hostname

# 指定端口
ssh -p 2222 user@hostname

# 使用特定私钥
ssh -i ~/.ssh/mykey user@hostname

# 执行单个命令
ssh user@hostname "ls -la"

# 端口转发（本地端口33389转发到远程22端口）
ssh -L 33389:localhost:22 user@hostname

# 远程端口转发
ssh -R 8080:localhost:80 user@hostname

# 动态端口转发（SOCKS代理）
ssh -D 1080 user@hostname

# X11转发
ssh -X user@hostname

# 跳板机登录
ssh -J user1@jump_host user2@target_host

# 不执行远程命令
ssh -N -D 1080 user@hostname

# 保持连接
ssh -o ServerAliveInterval=60 user@hostname
```

### SSH配置文件

```
~/.ssh/config:
Host myserver
    HostName 192.168.1.100
    User admin
    Port 22
    IdentityFile ~/.ssh/mykey
```

## 5. scp - 安全复制

### 命令基本信息
- **缩写**: scp
- **全称**: secure copy
- **功能**: 在本地和远程主机之间安全复制文件

### 常用参数

| 参数 | 说明 |
|------|------|
| `-P` | 指定端口 |
| `-r` | 递归复制目录 |
| `-p` | 保留文件属性 |
| `-i` | 指定私钥文件 |
| `-v` | 显示详细信息 |
| `-C` | 启用压缩 |

### 常用示例

```bash
# 复制本地文件到远程
scp file.txt user@hostname:/home/user/

# 复制远程文件到本地
scp user@hostname:/home/user/file.txt ./

# 复制目录
scp -r myfolder user@hostname:/home/user/

# 指定端口
scp -P 2222 file.txt user@hostname:/home/user/

# 保留文件属性
scp -p file.txt user@hostname:/home/user/

# 多个文件复制
scp file1.txt file2.txt user@hostname:/home/user/

# 从远程复制目录到本地
scp -r user@hostname:/home/user/folder ./
```

## 6. netstat - 网络状态

### 命令基本信息
- **缩写**: netstat
- **全称**: network statistics
- **功能**: 显示网络连接、路由表、接口统计等信息

### 常用参数

| 参数 | 说明 |
|------|------|
| `-t` | 显示TCP连接 |
| `-u` | 显示UDP连接 |
| `-l` | 显示监听状态的连接 |
| `-n` | 显示数字地址 |
| `-p` | 显示进程信息 |
| `-a` | 显示所有连接 |
| `-r` | 显示路由表 |

### 常用示例

```bash
# 显示所有网络连接
netstat -an

# 显示TCP连接
netstat -at

# 显示UDP连接
netstat -au

# 显示监听中的端口
netstat -ln

# 显示所有监听端口
netstat -lnp

# 显示路由表
netstat -rn

# 显示网络接口统计
netstat -i

# 显示程序和端口对应关系
netstat -lnp | grep 80

# 查看特定端口
netstat -an | grep 8080
```

### 输出字段说明

```
Proto  Recv-Q  Send-Q  Local Address    Foreign Address   State    PID/Program
tcp        0      0  0.0.0.0:22        0.0.0.0:*          LISTEN   1234/sshd
|          |       |   |               |                  |        |
|          |       |   本地地址         远程地址           状态      进程信息
协议        接收队列  发送队列
```

## 7. ss - 套接字统计

### 命令基本信息
- **缩写**: ss
- **全称**: socket statistics
- **功能**: 显示网络套接字信息，比netstat更现代

### 常用参数

| 参数 | 说明 |
|------|------|
| `-t` | 显示TCP连接 |
| `-u` | 显示UDP连接 |
| `-l` | 显示监听中的套接字 |
| `-n` | 显示数字地址 |
| `-p` | 显示进程信息 |
| `-o` | 显示定时器信息 |
| `-i` | 显示TCP信息 |

### 常用示例

```bash
# 显示所有连接
ss -tan

# 显示监听端口
ss -ln

# 显示TCP连接
ss -t

# 显示UDP连接
ss -u

# 显示进程信息
ss -tnp

# 显示摘要信息
ss -s

# 显示详细定时器信息
ss -to

# 显示TCP详细信息
ss -ti

# 过滤特定端口
ss -tn sport = :80

# 过滤特定地址
ss -tn state established '( dport = :443 or sport = :443 )'
```

## 8. ip - 网络配置

### 命令基本信息
- **缩写**: ip
- **全称**: internet protocol
- **功能**: 管理网络接口、路由等

### 常用示例

```bash
# 查看网络接口
ip addr

# 查看接口状态
ip link

# 查看路由表
ip route

# 添加IP地址
ip addr add 192.168.1.100/24 dev eth0

# 删除IP地址
ip addr del 192.168.1.100/24 dev eth0

# 启用网络接口
ip link set eth0 up

# 禁用网络接口
ip link set eth0 down

# 添加路由
ip route add 192.168.2.0/24 via 192.168.1.1

# 删除路由
ip route del 192.168.2.0/24 via 192.168.1.1

# 查看ARP表
ip neigh

# 添加ARP条目
ip neigh add 192.168.1.100 lladdr aa:bb:cc:dd:ee:ff dev eth0
```

## 9. ifconfig - 网络接口配置

### 命令基本信息
- **缩写**: ifconfig
- **全称**: interface configuration
- **功能**: 配置网络接口（较老，推荐使用ip命令）

### 常用示例

```bash
# 查看所有网络接口
ifconfig

# 查看特定接口
ifconfig eth0

# 启用网络接口
ifconfig eth0 up

# 禁用网络接口
ifconfig eth0 down

# 配置IP地址
ifconfig eth0 192.168.1.100 netmask 255.255.255.0

# 启用ARP
ifconfig eth0 arp

# 禁用ARP
ifconfig eth0 -arp
```

## 10. traceroute - 路由追踪

### 命令基本信息
- **缩写**: traceroute
- **全称**: traceroute
- **功能**: 追踪数据包经过的路由

### 常用示例

```bash
# 追踪路由
traceroute www.google.com

# 使用ICMP
traceroute -I www.google.com

# 指定最大跳数
traceroute -m 20 www.google.com

# 设置超时时间
traceroute -w 2 www.google.com
```

## 11. dig - DNS查询

### 命令基本信息
- **缩写**: dig
- **全称**: domain information groper
- **功能**: 查询DNS记录

### 常用示例

```bash
# 查询A记录
dig example.com

# 查询特定类型
dig example.com MX
dig example.com NS

# 显示详细信息
dig +short example.com

# 反向查询
dig -x 8.8.8.8

# 指定DNS服务器
dig @8.8.8.8 example.com
```

## 总结

这些网络命令是Linux日常使用的重要工具：

| 用途 | 命令 |
|------|------|
| 连通性测试 | ping |
| 文件下载 | wget, curl |
| 远程登录 | ssh |
| 文件传输 | scp |
| 网络诊断 | netstat, ss, traceroute |
| DNS查询 | dig, nslookup |
| 网络配置 | ip, ifconfig |

建议在实践中熟练掌握这些命令的使用方法和常用参数。