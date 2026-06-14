---
title: "ArkUI 自定义节点完全指南"
date: "2026-04-19"
author: "TechBlog"
category: "ohos"
tags: ["ohos", "arkUI"]
excerpt: "ArkUI 自定义节点完全指南"
---

# ArkUI 自定义节点完全指南

## 什么是自定义节点？

在 ArkUI 中，自定义节点是一套**命令式**的底层接口，用于直接创建和控制 UI 实体节点。它与常规的声明式开发（使用 `@Component` 和系统组件）不同，主要解决以下问题：

- **性能瓶颈**：高频动态增删 UI 时，声明式响应式更新会导致大量 diff 计算和节点重建。
- **交互卡顿**：拖拽、动画等需要极致流畅的场景，声明式链路较长。
- **底层控制不足**：需要自定义测量/布局、无侵入监听组件树、节点复用等能力。

> 简单理解：声明式 UI 覆盖 99% 的日常需求，而自定义节点是那 1% 高性能、高灵活性场景的“后门”。

## 自定义节点与声明式组件的对比

| 特性维度 | 自定义组件 (`@Component`) | 自定义节点 (`FrameNode`/`RenderNode`/`BuilderNode`) |
| :--- | :--- | :--- |
| **编程范式** | 声明式（描述 UI，框架驱动更新） | 命令式（直接创建、修改节点） |
| **节点管理** | 由框架自动管理 | 开发者持有引用并手动操作 |
| **性能开销** | 依赖 diff 算法，大量动态项时较高 | 直接操作，无 diff 开销，节点可复用 |
| **适用场景** | 表单、列表、静态页面 | 画板、游戏、图表、高性能动态布局 |
| **控制粒度** | 组件级别 | 底层节点级别 |

## 三种核心自定义节点

ArkUI 提供了三种定位不同的自定义节点，分别应对不同需求。

### 1. FrameNode – 全能架构师

**定位**：管理节点结构、自定义布局、系统组件代理。  
**能力**：创建节点、增删子节点、自定义测量/布局、代理系统组件。

#### 使用场景
- **完全自定义布局**：如圆形菜单、瀑布流，重写 `onMeasure` 和 `onLayout`。
- **动态节点操作**：画图应用中命令式添加/删除图形。
- **系统组件代理**：无侵入监听组件树，实现全埋点或性能监控。

#### 示例：动态添加/删除文本节点

```typescript
import { NodeController, FrameNode, UIContext } from '@kit.ArkUI';

class FrameNodeController extends NodeController {
  private rootNode: FrameNode | null = null;

  makeNode(uiContext: UIContext): FrameNode | null {
    if (this.rootNode === null) {
      this.rootNode = new FrameNode(uiContext);
      
      // 动态创建子节点
      const textNode = new FrameNode(uiContext);
      textNode.label = "Text";
      textNode.props = { text: "Hello, FrameNode!" };
      
      this.rootNode.appendChild(textNode);
      
      // 后续可通过 this.rootNode.removeChild(textNode) 删除
    }
    return this.rootNode;
  }
}
```

### 2. RenderNode – 专注的画师

**定位**：高性能自定义绘制，不关心布局。  
**能力**：重写 `draw()` 方法，直接调用底层绘制 API。

#### 使用场景
- K线图、实时曲线、画板等需要大量独立绘制的场景。
- 避免创建大量 UI 组件，减少内存和渲染开销。

#### 示例：绘制红色矩形

```typescript
import { RenderNode, FrameNode, NodeController, UIContext, DrawContext } from '@kit.ArkUI';

class MyRenderNode extends RenderNode {
  draw(context: DrawContext) {
    const canvas = context.canvas;
    canvas.drawRect({ x: 0, y: 0, width: 100, height: 100 });
  }
}

class RenderNodeController extends NodeController {
  private rootNode: FrameNode | null = null;

  makeNode(uiContext: UIContext): FrameNode | null {
    this.rootNode = new FrameNode(uiContext);
    const rootRenderNode = this.rootNode.getRenderNode();
    if (rootRenderNode) {
      const renderNode = new MyRenderNode();
      renderNode.frame = { x: 0, y: 0, width: 100, height: 100 };
      renderNode.backgroundColor = 0xFFFF0000; // 红色背景
      rootRenderNode.appendChild(renderNode);
    }
    return this.rootNode;
  }
}
```

### 3. BuilderNode – 高效的预制构件工厂

**定位**：将声明式 `@Builder` 函数包装成可复用的命令式节点。  
**能力**：预创建节点模板，快速实例化并挂载到不同位置。

#### 使用场景
- **跨页面组件复用**：如视频流卡片、通用弹窗、可拖拽浮动按钮。
- **节点复用池**：提前渲染复杂 UI，避免重复创建开销。

#### 示例：复用 @Builder 定义的文本组件

```typescript
import { NodeController, BuilderNode, FrameNode, UIContext } from '@kit.ArkUI';

@Builder
function MyTextBuilder(text: string) {
  Column() {
    Text(text)
      .fontSize(20)
      .fontWeight(FontWeight.Bold)
      .margin(10)
  }
}

class BuilderNodeController extends NodeController {
  private builderNode: BuilderNode<[string]> | null = null;
  private wrapBuilder = wrapBuilder(MyTextBuilder);

  makeNode(uiContext: UIContext): FrameNode | null {
    if (this.builderNode === null) {
      this.builderNode = new BuilderNode(uiContext);
      this.builderNode.build(this.wrapBuilder, "Hello from BuilderNode!");
    }
    return this.builderNode.getFrameNode();
  }
}
```

## 如何将自定义节点接入声明式页面？

自定义节点无法直接插入声明式组件树，需要借助**占位节点**和**控制器**。

### 核心组件
- **`NodeController`**：抽象类，实现 `makeNode()` 方法，在其中创建并返回自定义节点的根节点（通常是 `FrameNode`）。
- **`NodeContainer`**：声明式组件，接收 `NodeController` 实例，作为自定义节点的挂载容器。

### 完整接入流程

1. 定义控制器，在 `makeNode()` 中构建自定义节点。
2. 在页面中使用 `NodeContainer` 并绑定控制器实例。

### 骨架示例

```typescript
import { NodeController, FrameNode, UIContext, NodeContainer } from '@kit.ArkUI';

// 1. 定义控制器
class MyNodeController extends NodeController {
  makeNode(uiContext: UIContext): FrameNode | null {
    // 创建并返回自定义节点（可以是 FrameNode / BuilderNode 的根节点）
    const root = new FrameNode(uiContext);
    // ... 构建节点树
    return root;
  }
}

// 2. 在页面中使用
@Entry
@Component
struct Index {
  private myController: MyNodeController = new MyNodeController();

  build() {
    Column() {
      // 声明式组件...
      NodeContainer(this.myController) // 占位容器
        .width('100%')
        .height('100%')
    }
  }
}
```

## 实际案例：高性能动态画板

假设需要开发一个交互式画板，用户可以从工具栏拖拽出图形（圆形、矩形），并在画布上自由移动、缩放。使用纯声明式会导致性能问题，而自定义节点可以完美解决。

### 使用 BuilderNode + FrameNode 的实现思路

```typescript
// 1. 使用 BuilderNode 缓存图形模板
let cachedShapeNode: BuilderNode<[ShapeType]> | null = null;

function getShapeTemplate(type: ShapeType): BuilderNode<[ShapeType]> {
  if (!cachedShapeNode) {
    cachedShapeNode = new BuilderNode();
    cachedShapeNode.build(wrapBuilder(shapeBuilder), type);
  }
  return cachedShapeNode;
}

@Builder
function shapeBuilder(type: ShapeType) {
  // 定义图形的声明式 UI
  Shape(type === 'circle' ? ShapeType.Circle : ShapeType.Rect)
    .width(50).height(50)
    .fill(Color.Blue)
    .onTouch((event) => { /* 处理拖拽逻辑，直接操作 FrameNode 位置 */ })
}

// 2. 在画布控制器中动态添加图形
class CanvasController extends NodeController {
  private canvasNode: FrameNode | null = null;

  makeNode(uiContext: UIContext): FrameNode | null {
    this.canvasNode = new FrameNode(uiContext);
    return this.canvasNode;
  }

  addShape(type: ShapeType, x: number, y: number) {
    const template = getShapeTemplate(type);
    const shapeNode = template.createFrameNode(); // 快速实例化
    shapeNode.position = { x, y };
    this.canvasNode?.appendChild(shapeNode);
  }
}
```

**优势**：
- 新增图形无需触发整个画布的 diff 更新，直接命令式挂载。
- 拖拽时直接修改 `shapeNode.position`，无状态开销，流畅度极高。
- 节点复用池减少重复创建成本。

## 总结：如何选择？

| 需求 | 推荐节点 |
| :--- | :--- |
| 动态增删节点、自定义布局、代理系统组件 | **FrameNode** |
| 高性能自定义绘制（图表、画板） | **RenderNode** |
| 复用声明式组件、预创建模板 | **BuilderNode** |
| 以上需求组合使用 | 同时使用 `FrameNode` + `RenderNode` 或 `BuilderNode` |

> 注意：三种节点并非互斥。例如，可以用 `BuilderNode` 预定义复杂 UI，再将其根 `FrameNode` 挂载到 `NodeContainer`；也可以在 `FrameNode` 中添加 `RenderNode` 进行自定义绘制。

## 学习建议

- 先从常规声明式开发入手，理解 ArkUI 的响应式机制。
- 当遇到性能瓶颈或需要突破框架限制时，再考虑使用自定义节点。
- 实际开发中，优先尝试 `BuilderNode`（因为它兼容声明式写法），其次是 `FrameNode`，最后才是 `RenderNode`。

自定义节点是 ArkUI 进阶必备能力，掌握它可以让你的应用在性能和灵活性上达到新的高度。