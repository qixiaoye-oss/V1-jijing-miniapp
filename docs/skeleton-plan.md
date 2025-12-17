# 骨架屏策划方案

## 1. 项目现状分析

### 1.1 当前加载机制
当前项目使用简单的进度条加载机制：
- 模板位置：`/templates/page-loading.wxml`
- 实现方式：顶部进度条动画
- 问题：加载期间页面空白，用户体验不佳

### 1.2 页面结构分类

| 页面类型 | 页面路径 | 布局特点 |
|---------|----------|---------|
| **首页** | `home/home_page` | 卡片网格 + 分组列表 |
| **专辑列表** | `home/album_list` | 带图标的条目列表 |
| **套题列表** | `home/set_list` | 带进度的条目列表 |
| **通知列表** | `notice/list` | 分组嵌套列表 |
| **通知详情** | `notice/detail` | 文章详情布局 |
| **句子列表** | `dictation/sentence_list` | 带操作按钮的内容列表 |
| **单词列表** | `dictation/word_list` | 带操作按钮的内容列表 |
| **句子详情** | `dictation/sentence_detail` | 分区块详情布局 |
| **错题列表** | `dictation/wrong_list` | 带标签的条目列表 |
| **错词页面** | `dictation/wrong_word` | 卡片列表布局 |
| **练习记录** | `dictation/exercise_record` | 开关+答案列表 |
| **结果列表** | `dictation/result_list` | 成绩卡片列表 |
| **用户页** | `user/user` | 头像信息 + 菜单列表 |

---

## 2. 骨架屏类型设计

基于页面布局分析，设计以下 **5 种骨架屏类型**：

### 2.1 `list` - 通用列表型
**适用页面**：album_list, set_list, wrong_list, notice/list
**布局结构**：
```
┌─────────────────────────────────┐
│ [■■■] ████████████████  [tag] │
├─────────────────────────────────┤
│ [■■■] ████████████████  [tag] │
├─────────────────────────────────┤
│ [■■■] ████████████████  [tag] │
└─────────────────────────────────┘
```
**属性配置**：
- `avatar: true` - 显示左侧图标占位
- `rows: 5` - 默认5行

### 2.2 `card` - 卡片网格型
**适用页面**：home_page
**布局结构**：
```
┌──────────┐  ┌──────────┐
│  ████    │  │  ████    │
│ ████████ │  │ ████████ │
│  [tag]   │  │  [tag]   │
└──────────┘  └──────────┘
┌──────────┐  ┌──────────┐
│  ████    │  │  ████    │
│ ████████ │  │ ████████ │
│  [tag]   │  │  [tag]   │
└──────────┘  └──────────┘
```
**属性配置**：
- `rows: 4` - 默认4个卡片

### 2.3 `detail` - 详情内容型
**适用页面**：sentence_detail, notice/detail, explain
**布局结构**：
```
┌─────────────────────────────────┐
│ ████ 标题区                     │
├─────────────────────────────────┤
│ ████████████████████████████    │
│ ██████████████████              │
│ ████████████████████████        │
├─────────────────────────────────┤
│ ████ 翻译区                     │
├─────────────────────────────────┤
│ ████████████████████████████    │
│ ██████████████████              │
└─────────────────────────────────┘
```
**属性配置**：
- `rows: 3` - 内容段落数

### 2.4 `sentence` - 句子列表型
**适用页面**：sentence_list, word_list, result_list
**布局结构**：
```
┌─────────────────────────────────┐
│ 1/10               [label]      │
│ ████████████████████████████    │
│ ████████████████                │
│ ██████████          [▶] [→]    │
├─────────────────────────────────┤
│ 2/10               [label]      │
│ ████████████████████████████    │
│ ██████████          [▶] [→]    │
└─────────────────────────────────┘
```
**属性配置**：
- `rows: 5` - 句子条目数
- `showActions: true` - 显示操作按钮占位

### 2.5 `user` - 用户信息型
**适用页面**：user/user
**布局结构**：
```
┌─────────────────────────────────┐
│   ┌─────┐                       │
│   │ ●●● │  ████████             │
│   │ ●●● │  ████                 │
│   └─────┘                       │
├─────────────────────────────────┤
│ ████████████████████████████    │
├─────────────────────────────────┤
│ ████████████████████████████    │
├─────────────────────────────────┤
│ ████████████████████████████    │
└─────────────────────────────────┘
```
**属性配置**：
- `avatarShape: 'circle'` - 圆形头像

---

## 3. 组件设计规范

### 3.1 文件结构
```
/components/skeleton/
├── skeleton.wxml      # 组件模板
├── skeleton.wxss      # 组件基础样式（仅容器）
├── skeleton.js        # 组件逻辑
└── skeleton.json      # 组件配置

/style/
└── skeleton.wxss      # 全局骨架屏样式（含动画）
```

### 3.2 组件属性定义

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `loading` | Boolean | `true` | 控制骨架屏显示/隐藏 |
| `type` | String | `'list'` | 骨架屏类型：list / card / detail / sentence / user |
| `rows` | Number | `5` | 骨架行数（1-10，推荐3-8） |
| `animate` | Boolean | `true` | 是否启用闪烁动画 |
| `avatar` | Boolean | `false` | 是否显示头像占位（list 类型） |
| `avatarShape` | String | `'square'` | 头像形状：square / circle |
| `showActions` | Boolean | `true` | 是否显示操作按钮占位（sentence 类型） |
| `title` | String | `''` | 骨架屏标题（可选，显示在骨架内容上方） |
| `customClass` | String | `''` | 自定义类名（用于外部样式覆盖） |

**外部样式类**：
| 类名 | 说明 |
|------|------|
| `custom-class` | 根节点外部样式类，用于页面级样式覆盖 |

### 3.3 CSS 变量支持

```css
/**
 * 可通过 CSS 变量自定义主题色
 * 在页面或全局样式中覆盖即可
 * 尺寸单位：px（与项目其他样式保持一致）
 */

/* 基础样式变量 */
--skeleton-bg: #f0f0f0;              /* 骨架块背景色 */
--skeleton-highlight: #e8e8e8;        /* 动画高亮色 */
--skeleton-radius: 6px;               /* 圆角大小 */

/* 容器样式变量 */
--skeleton-card-bg: #fff;             /* 卡片/容器背景色 */
--skeleton-border-color: #eee;        /* 边框颜色 */
--skeleton-item-gap: 15px;            /* 列表项间距 */
```

**自定义示例**：
```css
/* 在页面 wxss 中覆盖变量 */
page {
  --skeleton-bg: #e5e5e5;
  --skeleton-highlight: #d0d0d0;
  --skeleton-radius: 9px;
  --skeleton-card-bg: #fafafa;
  --skeleton-border-color: #ddd;
  --skeleton-item-gap: 10px;
}
```

### 3.4 动画效果

采用父级控制模式，通过 `.skeleton--animate` 类统一控制子元素动画：

```css
@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 父级控制子元素动画 */
.skeleton--animate .skeleton-list__avatar,
.skeleton--animate .skeleton-list__title,
.skeleton--animate .skeleton-list__desc,
/* ... 其他子元素 ... */ {
  background: linear-gradient(
    90deg,
    var(--skeleton-bg, #f0f0f0) 25%,
    var(--skeleton-highlight, #e8e8e8) 50%,
    var(--skeleton-bg, #f0f0f0) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
```

### 3.5 样式隔离配置

组件使用 `apply-shared` 样式隔离模式，以便应用全局样式：

```json
// skeleton.json
{
  "component": true,
  "styleIsolation": "apply-shared",
  "usingComponents": {}
}
```

---

## 4. 页面接入方案

### 4.1 全局注册

**app.json** 中注册组件：
```json
{
  "usingComponents": {
    "skeleton": "/components/skeleton/skeleton"
  }
}
```

**app.wxss** 中引入全局样式：
```css
@import "style/skeleton.wxss";
```

### 4.2 使用示例

**基础用法**：
```xml
<skeleton type="list" loading="{{loading}}" rows="{{5}}" />
<view wx:if="{{!loading}}">
  <!-- 实际内容 -->
</view>
```

**带头像的列表**：
```xml
<skeleton
  type="list"
  loading="{{loading}}"
  rows="{{6}}"
  avatar="{{true}}"
  avatarShape="circle"
/>
```

**带标题的骨架屏**：
```xml
<skeleton
  type="list"
  loading="{{loading}}"
  rows="{{5}}"
  title="正在加载..."
/>
```

**使用自定义样式类**：
```xml
<skeleton
  type="list"
  loading="{{loading}}"
  custom-class="my-skeleton"
/>
```

**禁用动画（大列表性能优化）**：
```xml
<skeleton
  type="list"
  loading="{{loading}}"
  rows="{{10}}"
  animate="{{false}}"
/>
```

### 4.3 各类型使用示例

**列表页面（album_list / set_list / wrong_list）**：
```xml
<skeleton type="list" loading="{{loading}}" rows="{{5}}" avatar="{{true}}" />
<view class="list" wx:if="{{!loading}}">
  <!-- 列表内容 -->
</view>
```

**首页（卡片网格）**：
```xml
<skeleton type="card" loading="{{loading}}" rows="{{4}}" />
<view class="home" wx:if="{{!loading}}">
  <!-- 卡片网格 -->
</view>
```

**详情页**：
```xml
<skeleton type="detail" loading="{{loading}}" rows="{{3}}" />
<view wx:if="{{!loading}}">
  <!-- 详情内容 -->
</view>
```

**句子/单词列表**：
```xml
<skeleton type="sentence" loading="{{loading}}" rows="{{5}}" showActions="{{true}}" />
<view wx:if="{{!loading}}">
  <!-- 句子列表 -->
</view>
```

**用户中心**：
```xml
<skeleton type="user" loading="{{loading}}" rows="{{4}}" />
<view wx:if="{{!loading}}">
  <!-- 用户信息 -->
</view>
```

### 4.4 与现有 progress-bar 配合

骨架屏应与现有进度条配合使用：

```xml
<!-- 推荐的加载流程 -->
<template is="pageLoading" data="{{loading, loadProgress}}" />
<skeleton type="list" loading="{{loading}}" rows="{{5}}" />
<view wx:if="{{!loading}}">
  <!-- 实际内容 -->
</view>
```

加载时序：
1. 页面打开 → 显示进度条 + 骨架屏
2. 数据加载中 → 进度条动画 + 骨架屏闪烁
3. 数据加载完成 → 隐藏进度条和骨架屏 → 显示真实内容

---

## 5. 已接入页面

### 5.1 接入状态

| 优先级 | 页面 | 骨架类型 | 状态 |
|-------|------|---------|------|
| P0 | home/home_page | card | ✅ 已接入 |
| P0 | home/album_list | list | ✅ 已接入 |
| P0 | dictation/sentence_list | sentence | ✅ 已接入 |
| P1 | dictation/word_list | sentence | ✅ 已接入 |
| P1 | dictation/wrong_list | list | ✅ 已接入 |
| P1 | notice/list | list | ✅ 已接入 |
| P1 | home/set_list | list | ✅ 已接入 |
| P2 | user/user | user | ✅ 已接入 |
| P2 | dictation/sentence_detail | detail | ✅ 已接入 |
| P2 | notice/detail | detail | ✅ 已接入 |

### 5.2 各页面配置参数

| 页面 | type | rows | avatar | avatarShape | showActions |
|------|------|------|--------|-------------|-------------|
| home_page | card | 4 | - | - | - |
| album_list | list | 5 | true | - | - |
| set_list | list | 5 | true | - | - |
| sentence_list | sentence | 5 | - | - | true |
| word_list | sentence | 5 | - | - | true |
| wrong_list | list | 5 | - | - | - |
| notice/list | list | 5 | - | - | - |
| user | user | 4 | - | - | - |
| sentence_detail | detail | 3 | - | - | - |
| notice/detail | detail | 3 | - | - | - |

---

## 6. 跨项目复用指南

### 6.1 快速接入清单

复制以下文件到新项目：

```
需要复制的文件：
├── /components/skeleton/
│   ├── skeleton.wxml
│   ├── skeleton.wxss
│   ├── skeleton.js
│   └── skeleton.json
└── /style/
    └── skeleton.wxss
```

### 6.2 最小化配置

**Step 1**: 复制组件文件夹 `/components/skeleton/` 到新项目

**Step 2**: 复制样式文件 `/style/skeleton.wxss` 到新项目

**Step 3**: 在 `app.json` 注册组件
```json
{
  "usingComponents": {
    "skeleton": "/components/skeleton/skeleton"
  }
}
```

**Step 4**: 在 `app.wxss` 引入全局样式
```css
@import "style/skeleton.wxss";
```

**Step 5**: 在页面中使用
```xml
<skeleton type="list" loading="{{loading}}" />
```

### 6.3 自定义主题

通过 CSS 变量覆盖默认样式，实现项目定制：

```css
/* 在 app.wxss 或页面样式中 */
page {
  /* 修改骨架块颜色 */
  --skeleton-bg: #e0e0e0;
  --skeleton-highlight: #f5f5f5;

  /* 修改圆角 */
  --skeleton-radius: 16rpx;

  /* 修改容器样式 */
  --skeleton-card-bg: #fafafa;
  --skeleton-border-color: #e0e0e0;
  --skeleton-item-gap: 24rpx;
}
```

### 6.4 扩展新类型

如需添加新的骨架类型：

1. 在 `skeleton.wxml` 添加新类型模板
2. 在 `style/skeleton.wxss` 添加对应样式
3. 在动画选择器中添加新元素类名

示例：添加 `grid` 类型
```xml
<!-- skeleton.wxml -->
<view class="skeleton-grid" wx:elif="{{type === 'grid'}}">
  <view class="skeleton-grid__item" wx:for="{{rowsArray}}" wx:key="*this">
    <view class="skeleton-grid__image"></view>
    <view class="skeleton-grid__text"></view>
  </view>
</view>
```

```css
/* style/skeleton.wxss */
.skeleton-grid { ... }
.skeleton-grid__item { ... }
.skeleton-grid__image { ... }
.skeleton-grid__text { ... }

/* 添加到动画选择器 */
.skeleton--animate .skeleton-grid__image,
.skeleton--animate .skeleton-grid__text { ... }
```

### 6.5 版本兼容

| 基础库版本 | 兼容性 |
|-----------|--------|
| >= 2.2.3 | 完全支持 |
| >= 1.6.3 | 支持（需移除 CSS 变量） |
| < 1.6.3 | 不支持组件样式隔离 |

**低版本降级方案**：
- 移除 CSS 变量，使用固定值
- 将 `styleIsolation` 改为 `isolated`

---

## 7. 注意事项

### 7.1 性能建议
- 大列表（rows > 8）建议禁用动画 `animate="{{false}}"`
- 骨架屏行数建议 3-8 行，过多会影响性能
- 动画使用 CSS 实现，避免 JS 动画

### 7.2 体验建议
- 骨架屏布局应尽量贴近真实内容布局
- 避免骨架屏到真实内容的布局跳动
- 加载时间短于 200ms 时可不显示骨架屏

### 7.3 兼容性
- CSS 变量使用降级方案：`var(--skeleton-bg, #f0f0f0)`
- 动画效果需测试各机型表现
- 组件使用 `styleIsolation: "apply-shared"` 确保全局样式生效

### 7.4 Flex/Grid 布局间距问题（重要）

**问题描述**：
当 skeleton 组件放置在使用 `gap` 属性的 flex/grid 容器中时，即使 `loading=false` 组件内容为空，组件的宿主节点仍然存在于 DOM 中，会与相邻元素产生额外的 gap 间距。

**典型场景**：
```css
.container {
  display: flex;
  flex-direction: column;
  gap: 15px;  /* 问题根源 */
}
```

```xml
<view class="container">
  <skeleton loading="{{loading}}" />  <!-- 即使为空也占用 gap -->
  <view class="content">...</view>
</view>
```

**解决方案**：
组件已启用 `virtualHost: true` 选项，彻底解决此问题：

```javascript
// skeleton.js
Component({
  options: {
    multipleSlots: true,
    virtualHost: true  // 组件不生成宿主节点
  }
})
```

**原理说明**：
| 配置 | 行为 | DOM 结构 |
|------|------|----------|
| 默认 | 生成 `<skeleton>` 宿主节点 | `<skeleton><view>...</view></skeleton>` |
| virtualHost | 不生成宿主节点，子节点直接挂载 | `<view>...</view>` |

**效果**：
- `loading=true` 时：skeleton 内容正常渲染
- `loading=false` 时：组件完全不占用任何 DOM 空间，不产生额外间距

**注意事项**：
1. 启用 virtualHost 后，`:host` 样式不再生效
2. 外部样式类 `custom-class` 应用于内部根节点而非宿主
3. 基础库版本 >= 2.19.2 完全支持 virtualHost

---

## 8. 验收标准

1. ✅ 骨架屏组件支持 5 种类型切换
2. ✅ 动画流畅无卡顿（shimmer 效果）
3. ✅ P0/P1/P2 页面全部接入骨架屏
4. ✅ 布局与真实内容一致，无跳动
5. ✅ 代码符合小程序组件规范
6. ✅ 支持 6 个 CSS 变量自定义主题
7. ✅ 支持 title 属性显示标题
8. ✅ 支持 customClass 和 custom-class 外部样式
9. ✅ 提供跨项目复用指南
10. ✅ 启用 virtualHost 解决 flex/grid gap 间距问题

---

## 9. 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v2.3.0 | 2025-12-16 | 尺寸单位从 rpx 改为 px，与项目样式保持一致，优化大屏显示 |
| v2.2.0 | 2025-12-16 | 启用 virtualHost 解决 flex/grid 布局间距问题 |
| v2.1.0 | 2025-12-16 | 增强组件复用性，支持 CSS 变量和外部样式类 |
| v2.0.0 | 2025-12-16 | 完成 5 种骨架屏类型，接入 10 个页面 |
| v1.0.0 | 2025-12-16 | 初始版本，基础骨架屏功能 |

---

*文档版本：v2.3.0*
*创建日期：2025-12-16*
*更新日期：2025-12-16*
