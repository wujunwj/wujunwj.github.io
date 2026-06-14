---
title: "ArkUI 状态管理装饰器完全指南"
date: "2026-04-19"
author: "TechBlog"
category: "ohos"
tags: ["ohos", "arkUI"]
excerpt: "ArkUI 状态管理装饰器完全指南"
---

# ArkUI 状态管理装饰器完全指南

## 目录

1. [概述](#概述)
2. [V1 与 V2 的关系](#v1-与-v2-的关系)
3. [组件内部状态管理](#组件内部状态管理)
   - [@State (V1) 与 @Local (V2)](#state-v1-与-local-v2)
4. [父子组件通信](#父子组件通信)
   - [@Prop (V1) 与 @Param (V2)](#prop-v1-与-param-v2)
   - [@Link (V1) 与 @Param + @Event (V2)](#link-v1-与-param--event-v2)
5. [跨层级组件通信](#跨层级组件通信)
   - [@Provide 与 @Consume (V1) / @Provider 与 @Consumer (V2)](#provide-与-consume-v1--provider-与-consumer-v2)
6. [全局与页面级存储](#全局与页面级存储)
   - [AppStorage + @StorageLink / @StorageProp](#appstorage--storagelink--storageprop)
   - [LocalStorage + @LocalStorageLink / @LocalStorageProp](#localstorage--localstoragelink--localstorageprop)
7. [嵌套对象与数组观察](#嵌套对象与数组观察)
   - [@Observed 与 @ObjectLink (V1) / @ObservedV2 与 @Trace (V2)](#observed-与-objectlink-v1--observedv2-与-trace-v2)
8. [关于字符串别名与全局变量的疑问解答](#关于字符串别名与全局变量的疑问解答)
9. [注意事项与最佳实践](#注意事项与最佳实践)
10. [装饰器速查表](#装饰器速查表)

---

## 概述

ArkUI 的状态管理装饰器是构建响应式 UI 的核心工具，它们负责在数据变化时自动触发界面更新。装饰器主要分为 **V1 稳定版**（API 9+）和 **V2 新版**（API 12+）。本文将从实际场景出发，逐一介绍各装饰器的用途、差异及最佳实践。

---

## V1 与 V2 的关系

| 维度           | V1 状态管理                                       | V2 状态管理                                           |
| :------------- | :------------------------------------------------ | :---------------------------------------------------- |
| **状态**       | 成熟、稳定，自 API 9 起广泛使用，文档和生态完善。 | 新一代设计，API 12 引入，聚焦性能优化与精准依赖追踪。 |
| **核心设计**   | 通过装饰器组合（如 `@State` + `@Link`）实现同步。  | 引入 `@ObservedV2` 和 `@Trace` 实现属性级观察。       |
| **兼容性**     | 所有 API 版本均支持。                             | 需要 API 12 及以上设备。                              |
| **选择建议**   | 当前生产项目首选，心智负担小。                     | 新项目或对复杂列表性能有极致要求时使用。              |

> 💡 **注意**：V1 与 V2 并非互斥，你可以在 V1 组件中使用 V2 装饰的数据模型，两者可协同工作。

---

## 组件内部状态管理

### @State (V1) 与 @Local (V2)

- **作用**：声明组件的私有响应式变量。变量值变化时，依赖该变量的 UI 自动刷新。
- **适用场景**：组件内部的独立状态，如计数器、开关状态、输入框文本等。

#### 示例（V1 风格 `@State`）

```typescript
@Component
struct MyCounter {
  // 组件内部的计数状态，变化会触发 UI 更新
  @State count: number = 0;

  build() {
    Column() {
      Text(`Current Count: ${this.count}`)
        .fontSize(20)
      Button('Add')
        .onClick(() => {
          this.count++; // 直接修改状态，UI 自动刷新
        })
    }
  }
}
```

---

## 父子组件通信

### @Prop (V1) 与 @Param (V2)

- **作用**：实现父组件到子组件的 **单向数据同步**。父组件数据变化会传递给子组件，子组件内部修改不影响父组件。
- **适用场景**：子组件仅用于展示数据，不修改数据，如标题、状态文本、配置项等。

#### 示例（V1 风格 `@Prop`）

```typescript
// 子组件：只读展示
@Component
struct ChildTitle {
  @Prop title: string;

  build() {
    Text(this.title)
      .fontSize(24)
      .fontWeight(FontWeight.Bold)
  }
}

// 父组件
@Entry
@Component
struct ParentPage {
  @State parentTitle: string = 'Hello from Parent';

  build() {
    Column() {
      // 子组件接收父组件的状态
      ChildTitle({ title: this.parentTitle })

      Button('Update Title')
        .onClick(() => {
          // 只有父组件可以修改状态
          this.parentTitle = 'Title Updated by Parent';
        })
    }
  }
}
```

### @Link (V1) 与 @Param + @Event (V2)

- **作用**：建立父子组件之间的 **双向数据绑定**。任何一方的修改都会同步到另一方。
- **适用场景**：父子组件需要共同修改同一份数据，如表单输入、滑块值、开关状态等。

#### 示例（V1 风格 `@Link`）

```typescript
// 子组件：双向绑定
@Component
struct ChildSwitch {
  // @Link 实现双向绑定，使用 '$' 前缀传递
  @Link isOn: boolean;

  build() {
    Toggle({ type: ToggleType.Switch, isOn: this.isOn })
      .onChange((isOn: boolean) => {
        this.isOn = isOn; // 子组件修改，父组件同步
      })
  }
}

// 父组件
@Entry
@Component
struct ParentPage {
  @State switchStatus: boolean = false;

  build() {
    Column() {
      Text(`Switch is: ${this.switchStatus ? 'ON' : 'OFF'}`)
        .fontSize(18)
      // 传递时使用 '$' 前缀，建立双向绑定
      ChildSwitch({ isOn: $switchStatus })
    }
  }
}
```

---

## 跨层级组件通信

### @Provide 与 @Consume (V1) / @Provider 与 @Consumer (V2)

- **作用**：实现跨层级组件的 **双向数据同步**。祖先组件用 `@Provide` 提供数据，任意后代组件用 `@Consume` 消费数据，无需中间组件逐层传递。
- **适用场景**：深层嵌套组件共享状态，如主题配置、用户信息、全局设置等。

#### 示例（V1 风格 `@Provide` 与 `@Consume`）

```typescript
// 孙组件：消费者
@Component
struct GrandChild {
  // 通过别名 'sharedCount' 消费祖先组件提供的状态
  @Consume('sharedCount') count: number;

  build() {
    Button(`GrandChild: ${this.count}`)
      .onClick(() => {
        this.count++; // 修改会同步到祖先组件
      })
  }
}

// 子组件：中间层，无需处理状态
@Component
struct Child {
  build() {
    GrandChild()
  }
}

// 祖先组件：提供者
@Entry
@Component
struct Ancestor {
  // 通过别名 'sharedCount' 提供状态
  @Provide('sharedCount') count: number = 0;

  build() {
    Column() {
      Text(`Ancestor: ${this.count}`)
        .fontSize(24)
      Child() // 子组件内部包含孙组件
    }
  }
}
```

---

## 全局与页面级存储

### AppStorage + @StorageLink / @StorageProp

- **作用**：`AppStorage` 是应用级的全局状态容器。`@StorageLink` 建立双向绑定，`@StorageProp` 建立单向绑定。
- **适用场景**：全应用共享状态，如用户登录信息、主题模式、全局配置等。

#### 示例（使用 `@StorageLink`）

```typescript
// 在应用启动时初始化 AppStorage
// AppStorage.setOrCreate('appTheme', 'light');

@Entry
@Component
struct SettingsPage {
  // 双向绑定到 AppStorage 中的 'appTheme'
  @StorageLink('appTheme') theme: string = 'light';

  build() {
    Column() {
      Text(`Current Theme: ${this.theme}`)
      Button('Switch to Dark')
        .onClick(() => {
          this.theme = 'dark'; // 修改会同步到 AppStorage，并通知所有绑定该 key 的组件
        })
    }
  }
}
```

### LocalStorage + @LocalStorageLink / @LocalStorageProp

- **作用**：`LocalStorage` 是页面级的 UI 状态存储，用于 `UIAbility` 内或相邻页面间共享数据。绑定方式与 `AppStorage` 类似。
- **适用场景**：页面内多个组件或相邻页面间的状态共享。

#### 示例（使用 `@LocalStorageLink`）

```typescript
// 创建 LocalStorage 实例并初始化
let pageStorage = new LocalStorage({ 'userName': 'Guest' });

@Entry(pageStorage)
@Component
struct ProfilePage {
  // 双向绑定到 LocalStorage 中的 'userName'
  @LocalStorageLink('userName') userName: string = '';

  build() {
    Column() {
      Text(`Welcome, ${this.userName}!`)
      Button('Change Name')
        .onClick(() => {
          this.userName = 'NewName'; // 修改会同步回 LocalStorage
        })
    }
  }
}
```

---

## 嵌套对象与数组观察

### @Observed 与 @ObjectLink (V1) / @ObservedV2 与 @Trace (V2)

- **作用**：`@Observed` 标记一个类使其变得可观察，`@ObjectLink` 在子组件中接收该类的实例并建立双向数据绑定，用于观察和响应嵌套属性的变化。
- **适用场景**：需要观察和修改复杂对象内部属性的场景。

#### 示例（V1 风格 `@Observed` 与 `@ObjectLink`）

```typescript
// 使用 @Observed 标记类，使其内部属性变化可被观察
@Observed
class UserProfile {
  public name: string;
  public age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

// 子组件
@Component
struct UserInfoView {
  // 接收 @Observed 类的实例，建立双向绑定
  @ObjectLink user: UserProfile;

  build() {
    Column() {
      Text(`Name: ${this.user.name}`)
      Button('Change Name')
        .onClick(() => {
          this.user.name = 'New Name'; // 修改对象属性，UI 会刷新
        })
    }
  }
}

// 父组件
@Entry
@Component
struct MainPage {
  // 创建被 @Observed 修饰的类的实例
  @State userProfile: UserProfile = new UserProfile('John', 25);

  build() {
    UserInfoView({ user: this.userProfile })
  }
}
```

---

## 关于字符串别名与全局变量的疑问解答

### 为什么使用字符串（如 `'key'`）而非直接使用全局变量？

- **原因 1：响应式需求**  
  普通 JavaScript/TypeScript 变量（如 `export let count = 0`）变化时，ArkUI 框架无法感知，因此 **不会触发 UI 更新**。

- **原因 2：AppStorage 的本质**  
  `AppStorage` 内部维护了一个 **响应式哈希表**，字符串 `'key'` 是定位数据的唯一标识符。你可以把它理解为一个自带“脏检查通知机制”的全局 `Map`。

- **解决方案：使用常量或枚举管理 Key**  
  为避免魔法字符串带来的维护问题，建议使用常量或枚举统一管理。

```typescript
// 定义常量，作为唯一数据源
export class StorageKeys {
  static readonly USER_INFO = 'app_user_info_v1';
  static readonly THEME_MODE = 'app_theme_mode';
}

// 初始化
AppStorage.setOrCreate(StorageKeys.USER_INFO, { name: 'Guest' });

// 组件中使用常量
@Component
struct MyPage {
  @StorageLink(StorageKeys.USER_INFO) userInfo: UserType = { name: '' };
  // IDE 有智能提示，重构时改一处全项目生效
  build() { /* ... */ }
}
```

### 关于 `@Provide('alias')` 别名的意义

别名主要用于 **解耦组件层级与具体变量名**。例如，父组件内部变量名为 `name`，但子组件希望以 `userName` 来消费它：

```typescript
// 父组件
@Provide('userNameAlias') name: string = 'Alice';

// 子组件
@Consume('userNameAlias') displayName: string;
```

这在封装第三方组件库或不想暴露内部命名细节时非常有用。

---

## 注意事项与最佳实践

1. **版本选择**  
   - 新项目若需支持低版本设备（API 11 及以下），优先使用 V1。  
   - 仅针对 API 12+ 设备的项目，可全面采用 V2 以获得更好的性能。

2. **性能优化**  
   - 避免将未绑定 UI 的变量声明为状态变量，以减少不必要的刷新开销。  
   - 在列表渲染等高频场景中，V2 的 `@Trace` 可实现属性级精准更新，性能更优。

3. **对象传递**  
   - `@Prop` 会对传入的对象进行 **深拷贝**，开销较大；而 `@ObjectLink` 传递的是引用。若无需深拷贝，优先使用 `@ObjectLink`。

4. **正确初始化**  
   - `@Link` 和 `@ObjectLink` 装饰的变量必须在父组件中被正确初始化，否则运行时将报错。

5. **避免魔法字符串**  
   - 使用常量或枚举管理所有 `AppStorage` / `LocalStorage` 的 Key，提升代码可维护性。

---

## 装饰器速查表

| 装饰器组合 / 类型                  | 作用域         | 数据流向               | 典型场景                           |
| :-------------------------------- | :------------- | :--------------------- | :--------------------------------- |
| `@State`                          | 组件内部       | 数据 → UI              | 计数器、开关状态                   |
| `@State` + `@Link`                | 父子组件       | 双向 (父 ↔ 子)         | 表单输入、滑块值同步               |
| `@State` + `@Prop`                | 父子组件       | 单向 (父 → 子)         | 标题展示、状态文本                 |
| `@Provide` + `@Consume`           | 跨层级组件     | 双向 (祖先 ↔ 后代)     | 主题切换、全局设置                 |
| `@Observed` + `@ObjectLink`       | 组件间         | 双向 (对象属性 ↔ UI)   | 复杂对象内部属性修改               |
| `@StorageLink`                    | 全应用         | 双向 (组件 ↔ AppStorage) | 用户信息、全局开关                 |
| `@StorageProp`                    | 全应用         | 单向 (AppStorage → 组件) | 仅读取全局配置                     |
| `@LocalStorageLink`               | 当前页面       | 双向 (组件 ↔ LocalStorage) | 页面内共享状态                     |
| `@LocalStorageProp`               | 当前页面       | 单向 (LocalStorage → 组件) | 页面级只读配置                     |

---

> 本文档基于 ArkUI 状态管理 V1 与 V2 特性编写，适用于 HarmonyOS 应用开发入门学习。建议结合实际项目练习，逐步掌握各装饰器的使用场景。