---
title: "C++智能指针完全指南"
date: "2026-04-19"
author: "TechBlog"
category: "C++"
tags: ["智能指针"]
excerpt: "C++智能指针完全指南"
---

# C++智能指针完全指南

## 1. 智能指针概述

C++ 智能指针定义在 `<memory>` 头文件中，用于自动管理动态分配的对象，避免手动 `new`/`delete` 带来的内存泄漏、重复释放或悬垂指针问题。它们遵循 RAII（资源获取即初始化）原则，在智能指针对象销毁时自动释放所管理的资源。

三种主要的智能指针：`std::unique_ptr`、`std::shared_ptr`、`std::weak_ptr`。

## 2. 三种智能指针的区别

| 特性               | `std::unique_ptr`                      | `std::shared_ptr`                    | `std::weak_ptr`                                  |
|--------------------|----------------------------------------|--------------------------------------|--------------------------------------------------|
| **所有权**         | 独占所有权，不可共享                   | 共享所有权，引用计数                 | 无所有权（弱引用），不影响引用计数               |
| **拷贝语义**       | 禁止拷贝，只支持移动                    | 允许拷贝，拷贝时引用计数+1           | 可从 `shared_ptr` 或 `weak_ptr` 拷贝构造/赋值    |
| **性能开销**       | 极低，与裸指针相当                      | 较高，需要维护引用计数的原子操作     | 需要与 `shared_ptr` 配合使用，也有一定开销        |
| **使用场景**       | 独占资源，如工厂函数返回值、容器元素     | 多个对象共享同一资源，如缓存、图结构 | 观察者模式、打破循环引用、缓存（不影响生命周期） |
| **获取原始指针**   | `get()` 方法                            | `get()` 方法                         | 不能直接访问，需调用 `lock()` 获得 `shared_ptr`  |
| **是否可管理数组** | 支持（需指定 `T[]`，或自定义删除器）     | 支持（需自定义删除器）               | 通常不直接管理数组                                |

## 3. 基础示例

### 3.1 `std::unique_ptr` 示例（独占所有权）

````cpp
#include <iostream>
#include <memory>

class Test {
public:
    Test() { std::cout << "Test 构造函数\n"; }
    ~Test() { std::cout << "Test 析构函数\n"; }
    void hello() { std::cout << "Hello from Test\n"; }
};

int main() {
    std::unique_ptr<Test> p1(new Test());
    p1->hello();

    std::unique_ptr<Test> p2 = std::move(p1); // 转移所有权
    if (!p1) std::cout << "p1 现在为空\n";
    p2->hello();
    return 0;
}
````

### 3.2 `std::shared_ptr` 示例（共享所有权）

````cpp
#include <iostream>
#include <memory>

class Test {
public:
    Test() { std::cout << "Test 构造函数\n"; }
    ~Test() { std::cout << "Test 析构函数\n"; }
    void hello() { std::cout << "Hello from shared Test\n"; }
};

int main() {
    std::shared_ptr<Test> sp1 = std::make_shared<Test>();
    std::cout << "引用计数: " << sp1.use_count() << std::endl;

    {
        std::shared_ptr<Test> sp2 = sp1;
        std::cout << "引用计数: " << sp1.use_count() << std::endl;
        sp2->hello();
    }

    std::cout << "引用计数: " << sp1.use_count() << std::endl;
    return 0;
}
````

### 3.3 `std::weak_ptr` 示例（弱引用，打破循环引用）

````cpp
#include <iostream>
#include <memory>

class Node {
public:
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> weak_next; // 使用 weak_ptr 避免循环引用
    ~Node() { std::cout << "Node 析构\n"; }
};

int main() {
    std::shared_ptr<int> sp = std::make_shared<int>(42);
    std::weak_ptr<int> wp = sp;

    if (auto locked = wp.lock()) {
        std::cout << "值: " << *locked << std::endl;
    }

    sp.reset(); // 释放对象
    if (auto locked = wp.lock()) {
        std::cout << "值: " << *locked << std::endl;
    } else {
        std::cout << "对象已释放\n";
    }

    // 循环引用示例
    {
        std::shared_ptr<Node> n1 = std::make_shared<Node>();
        std::shared_ptr<Node> n2 = std::make_shared<Node>();
        n1->weak_next = n2;
        n2->weak_next = n1;
    }
    std::cout << "循环引用被 weak_ptr 打破，两个 Node 均被析构\n";
    return 0;
}
````

## 4. `std::unique_ptr` 详细使用场景

`std::unique_ptr` 适用于需要**独占所有权**的场景，即一个对象只能由一个指针拥有，当该指针被销毁或重置时，对象也随之释放。以下是典型的使用场景。

### 4.1 工厂函数返回动态对象

工厂函数创建对象并将所有权移交给调用者。

````cpp
#include <memory>
#include <iostream>

class Product {
public:
    virtual void use() = 0;
    virtual ~Product() = default;
};

class ConcreteProduct : public Product {
public:
    void use() override { std::cout << "Using concrete product\n"; }
};

std::unique_ptr<Product> createProduct() {
    return std::make_unique<ConcreteProduct>();
}

int main() {
    auto p = createProduct();
    p->use();
    return 0;
}
````

### 4.2 作为类的成员变量，表达独占包含关系（如链表节点）

````cpp
#include <memory>
#include <iostream>

class List {
    struct Node {
        int data;
        std::unique_ptr<Node> next;
        Node(int d) : data(d) {}
    };
    std::unique_ptr<Node> head;

public:
    void push_front(int value) {
        auto newNode = std::make_unique<Node>(value);
        newNode->next = std::move(head);
        head = std::move(newNode);
    }
    void print() const {
        Node* cur = head.get();
        while (cur) {
            std::cout << cur->data << " ";
            cur = cur->next.get();
        }
        std::cout << "\n";
    }
};

int main() {
    List lst;
    lst.push_front(3);
    lst.push_front(2);
    lst.push_front(1);
    lst.print(); // 输出 1 2 3
    return 0;
}
````

### 4.3 在多态容器中存储派生类对象

````cpp
#include <vector>
#include <memory>
#include <iostream>

class Shape {
public:
    virtual void draw() = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    void draw() override { std::cout << "Draw Circle\n"; }
};

class Square : public Shape {
public:
    void draw() override { std::cout << "Draw Square\n"; }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>());
    shapes.push_back(std::make_unique<Square>());

    for (auto& s : shapes) {
        s->draw();
    }
    return 0;
}
````

### 4.4 实现 PImpl 惯用法（隐藏实现细节）

**widget.h**

````cpp
#include <memory>

class Widget {
public:
    Widget();
    ~Widget();
    void doSomething();
private:
    struct Impl;
    std::unique_ptr<Impl> pImpl;
};
````

**widget.cpp**

````cpp
#include "widget.h"
#include <iostream>

struct Widget::Impl {
    int data = 42;
    void print() { std::cout << "Impl data: " << data << "\n"; }
};

Widget::Widget() : pImpl(std::make_unique<Impl>()) {}
Widget::~Widget() = default;
void Widget::doSomething() { pImpl->print(); }
````

### 4.5 自定义删除器处理特殊资源（如文件句柄）

````cpp
#include <memory>
#include <cstdio>
#include <iostream>

auto fileCloser = [](FILE* fp) {
    if (fp) fclose(fp);
    std::cout << "File closed\n";
};

int main() {
    std::unique_ptr<FILE, decltype(fileCloser)> fp(fopen("test.txt", "w"), fileCloser);
    if (fp) {
        fprintf(fp.get(), "Hello, unique_ptr!\n");
    }
    return 0;
}
````

### 4.6 作为函数参数传递所有权

````cpp
#include <memory>
#include <iostream>

void takeOwnership(std::unique_ptr<int> ptr) {
    std::cout << "Got value: " << *ptr << "\n";
}

int main() {
    auto p = std::make_unique<int>(100);
    takeOwnership(std::move(p));
    // 此时 p 为空
    return 0;
}
````

## 5. 总结

智能指针的核心用途是**自动化资源管理**，帮助开发者编写异常安全、无内存泄漏的 C++ 代码。在现代 C++ 中，应优先使用智能指针代替裸指针的 `new`/`delete` 操作。

- **`std::unique_ptr`**：独占所有权，零开销，适用于大部分单一所有权场景。
- **`std::shared_ptr`**：共享所有权，有引用计数开销，适用于多个对象需要共同管理同一资源的情况。
- **`std::weak_ptr`**：配合 `shared_ptr` 使用，打破循环引用，不影响生命周期。

凡是以前需要 `new`/`delete` 且对象仅被一处拥有的地方，都可以用 `unique_ptr` 替代。通过合理使用智能指针，可以极大提高 C++ 代码的安全性和可维护性。