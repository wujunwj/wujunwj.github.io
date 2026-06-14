---
title: "C++ 多线程同步：互斥锁与原子变量入门"
date: "2026-04-19"
author: "TechBlog"
category: "C++"
tags: ["互斥锁", "原子变量"]
excerpt: "C++ 多线程同步：互斥锁与原子变量入门"
---

# C++ 多线程同步：互斥锁与原子变量入门

## 1.1 std::mutex 和 std::lock_guard 的基本用法

### 1.1.1 std::mutex（互斥锁）

`std::mutex` 是最基本的同步原语，用于保护共享资源，防止多个线程同时访问。

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex mtx;  // 创建互斥锁
int shared_data = 0;

void increment() {
    for (int i = 0; i < 10000; ++i) {
        mtx.lock();      // 加锁
        ++shared_data;   // 临界区代码
        mtx.unlock();    // 解锁
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);
    
    t1.join();
    t2.join();
    
    std::cout << "Result: " << shared_data << std::endl;  // 正确输出 20000
    return 0;
}
```

### 1.1.2 std::lock_guard（自动锁管理器）

`std::lock_guard` 是一个 RAII 包装器，构造时自动加锁，析构时自动解锁，避免手动管理。

```cpp
void safe_increment() {
    for (int i = 0; i < 10000; ++i) {
        std::lock_guard<std::mutex> lock(mtx);  // 构造时自动加锁
        ++shared_data;                          // 临界区
        // 析构时自动解锁，无需手动调用 unlock()
    }
}
```

### 1.1.3 使用建议

- **推荐优先使用 `lock_guard`**（或 C++17 的 `std::scoped_lock`），更安全、异常友好。
- 保持临界区尽量小，避免锁内执行耗时操作。
- 一个 `mutex` 保护一组相关的数据。

## 1.2 如果不使用锁会发生什么？

### 1.2.1 数据竞争（Data Race）

没有锁时，多个线程同时修改共享变量会导致未定义行为。

```cpp
#include <iostream>
#include <thread>
#include <vector>

int counter = 0;  // 共享变量

void increment(int n) {
    for (int i = 0; i < n; ++i) {
        counter++;  // 不是原子操作！
    }
}

int main() {
    std::thread t1(increment, 1000000);
    std::thread t2(increment, 1000000);
    
    t1.join();
    t2.join();
    
    // ❌ 可能输出不到 2000000
    std::cout << "Counter: " << counter << std::endl;
    return 0;
}
```

### 1.2.2 原因分析

`counter++` 在底层分为三步：
1. 从内存读取 counter 到寄存器
2. 寄存器中的值加 1
3. 写回内存

两个线程可能交错执行，导致丢失更新。

### 1.2.3 可能后果

- 数据不一致（计算结果错误）
- 程序崩溃（如访问已释放内存）
- 逻辑错误，状态异常
- 难以调试的间歇性 bug

## 1.3 unique_lock 与 lock_guard 的区别

| 特性 | lock_guard | unique_lock |
|------|------------|-------------|
| **灵活性** | 低（构造即锁定） | 高（可延迟、转移） |
| **手动控制** | 不支持 lock()/unlock() | 支持 |
| **性能开销** | 小（轻量级） | 稍大（维护状态） |
| **移动语义** | 不支持 | 支持 |
| **条件变量** | 不适用 | 必须使用 |

### 1.3.1 代码对比

```cpp
std::mutex mtx;

// lock_guard - 简单场景
{
    std::lock_guard<std::mutex> lock(mtx);
    // 自动锁定，离开作用域自动解锁
}

// unique_lock - 灵活控制
{
    // 延迟锁定
    std::unique_lock<std::mutex> lock(mtx, std::defer_lock);
    lock.lock();    // 手动锁定
    lock.unlock();  // 手动解锁
    
    // 尝试锁定
    std::unique_lock<std::mutex> lock2(mtx, std::try_to_lock);
    if (lock2.owns_lock()) { /* 成功 */ }
    
    // 所有权转移
    std::unique_lock<std::mutex> lock3 = std::move(lock2);
}
```

### 1.3.2 条件变量必须使用 unique_lock

```cpp
std::condition_variable cv;
bool ready = false;

void worker() {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, []{ return ready; });  // wait 需要解锁/重新锁定能力
}
```

### 1.3.3 选择指南

- **默认用 `lock_guard`**：简单、高效。
- **需要条件变量**：用 `unique_lock`。
- **需要手动解锁/延迟锁定**：用 `unique_lock`。
- **C++17 多锁**：用 `std::scoped_lock`。

## 1.4 原子变量（std::atomic）与互斥锁的区别

### 1.4.1 原子变量是什么？

原子变量利用 CPU 硬件指令保证对单个变量的操作是原子的，无需锁。

```cpp
#include <atomic>

std::atomic<int> atomic_counter(0);

void atomic_increment(int n) {
    for (int i = 0; i < n; ++i) {
        atomic_counter++;  // 原子操作，线程安全
    }
}
```

### 1.4.2 对比表格

| 维度 | std::atomic | std::mutex |
|------|-------------|------------|
| 原理 | 硬件原子指令 | 操作系统同步机制 |
| 粒度 | 单个变量 | 代码块（可保护多个变量） |
| 性能 | 极高（无系统调用） | 较低（可能涉及系统调用） |
| 适用场景 | 计数器、标志位、简单状态 | 复杂数据结构、临界区 |

### 1.4.3 代码示例对比

```cpp
// 场景1：简单计数器 - 原子变量更好
std::atomic<int> atom_counter{0};

void test_atomic() {
    for (int i = 0; i < 1000000; ++i)
        atom_counter.fetch_add(1, std::memory_order_relaxed);
}

// 场景2：复杂操作 - 只能用互斥锁
class BankAccount {
    double balance;
    std::mutex mtx;
public:
    void transfer(double amount) {
        std::lock_guard<std::mutex> lock(mtx);
        if (balance >= amount) {
            balance -= amount;
            // 多个操作需要原子性
        }
    }
};
```

### 1.4.4 原子变量的内存序（Memory Order）

```cpp
std::atomic<int> data{0};
bool ready = false;

// 1. 顺序一致性（默认，最安全，最慢）
data.store(42, std::memory_order_seq_cst);

// 2. 释放-获取语义（常用）
void producer() {
    data.store(42, std::memory_order_relaxed);
    ready.store(true, std::memory_order_release);  // 释放
}
void consumer() {
    while (!ready.load(std::memory_order_acquire)); // 获取
    std::cout << data.load(std::memory_order_relaxed);
}

// 3. 松散顺序（最快，仅保证原子性）
data.fetch_add(1, std::memory_order_relaxed);
```

### 1.4.5 性能基准参考

| 操作 | 大致耗时 | 适用场景 |
|------|---------|---------|
| 原子操作 | 10-100 纳秒 | 高频计数器、标志位 |
| 互斥锁（无竞争） | 20-50 纳秒 | 低频访问、复杂操作 |
| 互斥锁（有竞争） | 微秒到毫秒级 | 需要等待资源时 |

### 1.4.6 选择建议

- **能用原子变量解决就用原子变量**（单个变量、简单操作）。
- **需要保护多个变量或复杂逻辑时用互斥锁**。
- **需要线程等待条件时，必须用互斥锁+条件变量**。
- 两者可以组合使用。

## 1.5 总结：简单决策树

```
需要保护的数据是什么？
│
├─ 单个简单变量（计数器、标志位）
│   └─ 优先使用 std::atomic
│
├─ 多个变量或复杂操作
│   └─ 使用 std::mutex + std::lock_guard
│
├─ 需要线程协调（等待某个条件）
│   └─ 使用 std::mutex + std::condition_variable + std::unique_lock
│
└─ 性能极度敏感且仅单个变量
    └─ 尝试 std::atomic 并选择合适的 memory_order
```