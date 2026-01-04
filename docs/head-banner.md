# 头部横幅组件 (head-banner)

首页顶部横幅组件，带渐变背景，支持自定义标题、副标题和主题色，可通过插槽插入内容。

> **注意**：这是一个微信小程序自定义组件，需要在页面的 json 文件中注册。

## 版本

**当前版本：** v1.0.0
**发布日期：** 2026-01-04

## 特性

- ✅ 渐变背景（从主题色到透明）
- ✅ 主标题 + 副标题文字区域
- ✅ 支持自定义主题色
- ✅ 支持插槽插入任意内容
- ✅ 自动处理页面边距（负 margin 突破 padding）

---

## 快速开始

### 1. 注册组件

在页面的 `json` 文件中注册组件：

```json
{
  "usingComponents": {
    "head-banner": "/components/head-banner/index"
  }
}
```

### 2. 使用组件

```xml
<head-banner
  title="考雅Open机经题库"
  subtitle="九分学长出品"
>
  <!-- 插槽内容 -->
  <view class="your-content">
    这里放置任意内容，如卡片列表
  </view>
</head-banner>
```

### 3. 自定义主题色

```xml
<head-banner
  title="我的应用"
  subtitle="副标题"
  color="#FF6B6B"
>
  <view>内容区域</view>
</head-banner>
```

---

## 组件属性 (Properties)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | String | '' | 主标题（22px 加粗白色居中） |
| `subtitle` | String | '' | 副标题（12px 白色居中，距主标题 5px） |
| `color` | String | '#00A6ED' | 主题色（渐变起始色，CSS 颜色值） |

---

## 插槽 (Slots)

组件支持默认插槽，用于放置横幅下方的内容：

```xml
<head-banner title="标题">
  <!-- 默认插槽 -->
  <view class="card-list">
    <view class="card">卡片1</view>
    <view class="card">卡片2</view>
  </view>
</head-banner>
```

---

## 视觉效果

```
┌─────────────────────────────────┐
│        顶部导航栏               │
├─────────────────────────────────┤ ← 渐变开始 (100% 主题色)
│                                 │
│     考雅Open机经题库            │ ← 主标题 (22px 加粗白色)
│       九分学长出品              │ ← 副标题 (12px 白色)
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │    插槽内容区域          │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │ ← 渐变结束 (0% 透明)
└─────────────────────────────────┘
```

---

## 样式规格

| 元素 | 样式 |
|------|------|
| 渐变背景 | `linear-gradient(180deg, {color} 0%, transparent 100%)` |
| 容器边距 | `margin: -20px -20px 0 -20px`（突破页面 padding） |
| 容器内边距 | `padding: 20px 20px 0 20px` |
| 主标题 | 22px，加粗，白色，居中 |
| 副标题 | 12px，常规，白色，居中，margin-top: 5px |
| 标题区域底部间距 | padding-bottom: 15px |

---

## 使用示例

### 示例 1：首页（本项目）

```xml
<head-banner title="考雅Open机经题库" subtitle="九分学长出品">
  <view class="home-main-item home-main-item--science">
    <view class="home-main-item__title">科普</view>
    <!-- 科普卡片列表 -->
  </view>
</head-banner>
```

### 示例 2：自定义颜色

```xml
<head-banner
  title="学习记录"
  subtitle="每天进步一点点"
  color="#00D26A"
>
  <view class="stats-panel">
    <!-- 统计面板 -->
  </view>
</head-banner>
```

### 示例 3：仅标题无副标题

```xml
<head-banner title="我的应用">
  <view>内容区域</view>
</head-banner>
```

---

## 跨项目复用

### 复制文件

将以下目录复制到目标项目：

```
components/head-banner/
├── index.js      # 组件逻辑
├── index.wxml    # 组件模板
├── index.wxss    # 组件样式
└── index.json    # 组件配置
```

### 依赖说明

- 无外部依赖
- 默认主题色 `#00A6ED` 可通过 `color` 属性覆盖
- 组件使用 `styleIsolation: "apply-shared"`，可继承页面样式

### 适配不同页面 padding

如果目标项目的页面 padding 不是 20px，需要修改组件样式：

```css
/* index.wxss */
.head-banner-wrapper {
  /* 修改为目标项目的页面 padding 值 */
  margin: -{padding}px -{padding}px 0 -{padding}px;
  padding: {padding}px {padding}px 0 {padding}px;
}
```

---

## 文件结构

```
components/head-banner/
├── index.js      # 组件逻辑（properties 定义）
├── index.wxml    # 组件模板（标题 + 插槽）
├── index.wxss    # 组件样式（渐变背景 + 文字样式）
└── index.json    # 组件配置
```

---

## 注意事项

1. **页面 padding**：组件通过负 margin 突破页面 padding，确保渐变背景贴边
2. **插槽内容**：插槽内容会继承渐变背景，适合放置带背景色的卡片
3. **颜色格式**：`color` 属性支持任意 CSS 颜色值（hex、rgb、rgba 等）
4. **空标题**：如果 `title` 为空，标题区域不显示

---

## 更新日志

### v1.0.0 (2026-01-04)
- 初始版本
- 支持 title、subtitle、color 属性
- 支持默认插槽
- 从 home_page 提取为独立组件
