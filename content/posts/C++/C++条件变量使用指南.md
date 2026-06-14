---
title: "C++条件变量使用指南"
date: "2026-04-19"
author: "TechBlog"
category: "C++"
tags: ["条件变量"]
excerpt: "C++条件变量使用指南"
---

# C++条件变量使用指南

条件变量（condition variable）是C++多线程编程中用于线程同步的重要工具，允许线程在特定条件成立前等待，直到其他线程通知条件变化。

## 主要使用场景分类

### 1. 等待-通知模式（Wait-Notify）

**场景**：一个线程等待某个条件成立，另一个线程在条件满足时通知等待的线程。

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>

class SimpleWaitNotify {
private:
    std::mutex mtx;
    std::condition_variable cv;
    bool ready = false;
    
public:
    void waitForSignal() {
        std::unique_lock<std::mutex> lock(mtx);
        // 使用while循环防止虚假唤醒
        while (!ready) {
            cv.wait(lock);  // 等待条件满足
        }
        std::cout << "收到通知，继续执行" << std::endl;
    }
    
    void sendSignal() {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        {
            std::lock_guard<std::mutex> lock(mtx);
            ready = true;
        }
        cv.notify_one();  // 通知一个等待线程
        std::cout << "已发送通知" << std::endl;
    }
};

// 使用示例
void simpleWaitNotifyExample() {
    SimpleWaitNotify example;
    
    std::thread t1(&SimpleWaitNotify::waitForSignal, &example);
    std::thread t2(&SimpleWaitNotify::sendSignal, &example);
    
    t1.join();
    t2.join();
}
```

### 2. 生产者-消费者模式

**场景**：生产者线程向缓冲区添加数据，消费者线程从缓冲区取出数据。当缓冲区为空时消费者等待，当缓冲区满时生产者等待。

```cpp
#include <queue>
#include <chrono>

class ProducerConsumer {
private:
    std::queue<int> dataQueue;
    std::mutex mtx;
    std::condition_variable cvProducer, cvConsumer;
    const size_t MAX_SIZE = 5;
    bool done = false;
    
public:
    // 生产者方法
    void produce(int value) {
        std::unique_lock<std::mutex> lock(mtx);
        
        // 如果队列已满，等待消费者消费
        cvProducer.wait(lock, [this]() {
            return dataQueue.size() < MAX_SIZE || done;
        });
        
        if (done) return;
        
        dataQueue.push(value);
        std::cout << "生产: " << value << ", 队列大小: " << dataQueue.size() << std::endl;
        
        // 通知消费者有新数据
        cvConsumer.notify_one();
    }
    
    // 消费者方法
    int consume() {
        std::unique_lock<std::mutex> lock(mtx);
        
        // 如果队列为空，等待生产者生产
        cvConsumer.wait(lock, [this]() {
            return !dataQueue.empty() || done;
        });
        
        if (done && dataQueue.empty()) return -1;
        
        int value = dataQueue.front();
        dataQueue.pop();
        std::cout << "消费: " << value << ", 队列大小: " << dataQueue.size() << std::endl;
        
        // 通知生产者有空位
        cvProducer.notify_one();
        
        return value;
    }
    
    void setDone() {
        {
            std::lock_guard<std::mutex> lock(mtx);
            done = true;
        }
        // 通知所有等待线程结束
        cvProducer.notify_all();
        cvConsumer.notify_all();
    }
};

// 使用示例
void producerConsumerExample() {
    ProducerConsumer pc;
    
    std::thread producer([&pc]() {
        for (int i = 1; i <= 10; ++i) {
            pc.produce(i);
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
        pc.setDone();
    });
    
    std::thread consumer([&pc]() {
        while (true) {
            int value = pc.consume();
            if (value == -1) break;
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
    });
    
    producer.join();
    consumer.join();
}
```

### 3. 等待超时模式

**场景**：线程等待条件成立，但最多等待一段时间，超时后无论条件是否满足都继续执行。

```cpp
class WaitTimeout {
private:
    std::mutex mtx;
    std::condition_variable cv;
    bool ready = false;
    
public:
    // 等待条件成立，最多等待指定时间
    bool waitForCondition(int timeoutMs) {
        std::unique_lock<std::mutex> lock(mtx);
        
        // 使用wait_for，设置超时时间
        auto status = cv.wait_for(lock, 
                                 std::chrono::milliseconds(timeoutMs),
                                 [this]() { return ready; });
        
        if (status) {
            std::cout << "条件已满足，继续执行" << std::endl;
            return true;
        } else {
            std::cout << "等待超时，继续执行" << std::endl;
            return false;
        }
    }
    
    // 设置条件为真（从另一个线程调用）
    void setReady() {
        {
            std::lock_guard<std::mutex> lock(mtx);
            ready = true;
        }
        cv.notify_one();
    }
    
    void reset() {
        std::lock_guard<std::mutex> lock(mtx);
        ready = false;
    }
};

// 使用示例
void waitTimeoutExample() {
    WaitTimeout example;
    
    std::thread waiter([&example]() {
        std::cout << "开始等待，最多等待2秒" << std::endl;
        bool satisfied = example.waitForCondition(2000);
        std::cout << "等待结果: " << (satisfied ? "条件满足" : "超时") << std::endl;
    });
    
    // 模拟3秒后才设置条件（将导致超时）
    std::this_thread::sleep_for(std::chrono::seconds(3));
    example.setReady();
    
    waiter.join();
    
    // 第二次测试：在超时前设置条件
    example.reset();
    std::thread waiter2([&example]() {
        std::cout << "\n第二次等待，最多等待3秒" << std::endl;
        bool satisfied = example.waitForCondition(3000);
        std::cout << "等待结果: " << (satisfied ? "条件满足" : "超时") << std::endl;
    });
    
    std::this_thread::sleep_for(std::chrono::seconds(1));
    example.setReady();
    
    waiter2.join();
}
```

### 4. 多线程屏障/集合点模式

**场景**：多个线程需要在某个点同步，所有线程都到达后才能继续执行。

```cpp
#include <vector>

class Barrier {
private:
    std::mutex mtx;
    std::condition_variable cv;
    int expectedCount;
    int currentCount;
    int generation;  // 用于区分不同的屏障周期
    
public:
    Barrier(int count) : expectedCount(count), currentCount(0), generation(0) {}
    
    void wait() {
        std::unique_lock<std::mutex> lock(mtx);
        int gen = generation;
        currentCount++;
        
        if (currentCount < expectedCount) {
            // 等待其他线程
            cv.wait(lock, [this, gen]() {
                return gen != generation;  // 只有当generation变化时才继续
            });
        } else {
            // 最后一个线程到达，唤醒所有等待线程
            currentCount = 0;
            generation++;  // 更新generation
            cv.notify_all();
            std::cout << "所有线程已到达屏障，继续执行" << std::endl;
        }
    }
};

// 使用示例
void barrierExample() {
    const int THREAD_COUNT = 5;
    Barrier barrier(THREAD_COUNT);
    
    std::vector<std::thread> threads;
    
    for (int i = 0; i < THREAD_COUNT; ++i) {
        threads.emplace_back([&barrier, i]() {
            std::cout << "线程" << i << "开始工作" << std::endl;
            std::this_thread::sleep_for(std::chrono::milliseconds(100 * (i + 1)));
            std::cout << "线程" << i << "到达屏障点" << std::endl;
            barrier.wait();
            std::cout << "线程" << i << "通过屏障，继续工作" << std::endl;
        });
    }
    
    for (auto& t : threads) {
        t.join();
    }
}
```

### 5. 读写锁模式（读多写少场景）

**场景**：多个读线程可以同时访问共享资源，但写线程需要独占访问。

```cpp
class ReadWriteLock {
private:
    std::mutex mtx;
    std::condition_variable cv;
    int readers = 0;
    bool writer = false;
    
public:
    // 读锁
    void readLock() {
        std::unique_lock<std::mutex> lock(mtx);
        // 等待没有写线程
        cv.wait(lock, [this]() { return !writer; });
        readers++;
    }
    
    // 解读锁
    void readUnlock() {
        std::unique_lock<std::mutex> lock(mtx);
        readers--;
        if (readers == 0) {
            cv.notify_all();  // 唤醒可能等待的写线程
        }
    }
    
    // 写锁
    void writeLock() {
        std::unique_lock<std::mutex> lock(mtx);
        // 等待没有读线程和写线程
        cv.wait(lock, [this]() { return readers == 0 && !writer; });
        writer = true;
    }
    
    // 解写锁
    void writeUnlock() {
        std::unique_lock<std::mutex> lock(mtx);
        writer = false;
        cv.notify_all();  // 唤醒等待的读线程和写线程
    }
};

// 使用示例
void readWriteLockExample() {
    ReadWriteLock rwLock;
    int sharedData = 0;
    
    // 读线程函数
    auto reader = [&](int id) {
        for (int i = 0; i < 3; ++i) {
            rwLock.readLock();
            std::cout << "读线程" << id << "读取数据: " << sharedData << std::endl;
            rwLock.readUnlock();
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
    };
    
    // 写线程函数
    auto writer = [&](int id) {
        for (int i = 0; i < 2; ++i) {
            rwLock.writeLock();
            sharedData++;
            std::cout << "写线程" << id << "写入数据: " << sharedData << std::endl;
            rwLock.writeUnlock();
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
    };
    
    std::vector<std::thread> threads;
    
    // 创建读线程
    for (int i = 0; i < 3; ++i) {
        threads.emplace_back(reader, i);
    }
    
    // 创建写线程
    for (int i = 0; i < 2; ++i) {
        threads.emplace_back(writer, i);
    }
    
    for (auto& t : threads) {
        t.join();
    }
}
```

## 重要注意事项

1. **虚假唤醒（Spurious Wakeup）**：条件变量可能在没有收到通知的情况下返回，因此必须使用谓词循环检查条件：
   ```cpp
   cv.wait(lock, [this]() { return condition; });
   // 等价于
   while (!condition) {
       cv.wait(lock);
   }
   ```

2. **通知时机**：
   - `notify_one()`：唤醒一个等待线程
   - `notify_all()`：唤醒所有等待线程
   - 通常应该在修改条件后释放锁之前调用通知

3. **死锁预防**：确保在等待条件变量前已获取锁，并且最终会释放锁。

4. **条件变量与互斥锁**：条件变量必须与互斥锁一起使用，以确保条件的检查和修改是原子的。

这些示例覆盖了条件变量的主要使用场景，可以根据具体需求进行调整和扩展。