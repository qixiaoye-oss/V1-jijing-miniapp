# 听写页面公共样式 (dictation-common.wxss)

听写页面的公共样式文件，适用于 spot_dictation、word_dictation、quick_answer 三个听写页面。

> **注意**：这是一个纯 CSS 样式库，通过 `@import` 在 app.wxss 中全局引入。

## 版本

**当前版本：** v1.1.0
**发布日期：** 2025-12-02

## 特性

- ✅ 统一三个听写页面的公共样式
- ✅ 页面布局采用 Flexbox 弹性盒模型
- ✅ 配合 button-group.wxss 使用
- ✅ 支持 100vh 全屏布局，无滚动

---

## 快速开始

### 1. 引入样式

已在 `app.wxss` 中全局引入：

```css
@import "style/dictation-common.wxss";
```

### 2. 页面结构

```xml
<view class="page">
  <!-- 顶部进度条 -->
  <view class="header_container">
    <view class="progress_bar_base">
      <view class="progress_bar_track">
        <view class="progress_bar_bg" style="width: {{progress}}%;"></view>
      </view>
      <view>{{current}}/{{total}}</view>
    </view>
  </view>

  <!-- 中间内容区域（自适应高度） -->
  <view class="middle_of_adaptive">
    <swiper class="swiper_container">
      <swiper-item class="swiper_item_container">
        <!-- 卡片内容 -->
      </swiper-item>
    </swiper>
  </view>

  <!-- 底部按钮组 -->
  <view class="btn-group-split">
    <!-- 按钮内容 -->
  </view>

  <!-- 设置弹窗 -->
  <play-setting></play-setting>
</view>
```

---

## 样式架构

### 1. 页面基础样式

| 选择器 | 说明 |
|--------|------|
| `.page` | 页面容器，100vh 高度，flex column 布局 |

> **重要**：`page` 样式需要在各听写页面的 wxss 中单独设置，避免影响其他页面的滚动。

### 2. 顶部进度条区域

| 类名 | 说明 |
|------|------|
| `.header_container` | 顶部容器，padding: 20px 20px 0 20px |
| `.progress_bar_base` | 进度条基础容器 |
| `.progress_bar_track` | 进度条轨道（灰色背景） |
| `.progress_bar_bg` | 进度条填充（蓝色） |

### 3. 中间内容区域

| 类名 | 说明 |
|------|------|
| `.middle_of_adaptive` | 中间自适应区域，flex: 1 |
| `.swiper_container` | Swiper 容器，100% 宽高 |
| `.swiper_item_container` | Swiper 项容器 |

### 4. 答案显示区域

| 类名 | 说明 |
|------|------|
| `.translation_text` | 翻译文字（灰色 14px） |
| `.close_open_cell` | 答案遮罩区域（灰色背景） |
| `.close_open_img` | 遮罩图标（30x30px） |

### 5. 按钮组覆盖

| 类名 | 说明 |
|------|------|
| `.btn-group-split` | margin: 15px 20px 20px 20px |
| `.btn-group-split__footer` | justify-content: flex-start |

---

## 页面布局示意

```
┌─────────────────────────────────┐
│  page (padding: 0)              │
│  ┌───────────────────────────┐  │
│  │  .page (height: 100vh)    │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  .header_container  │  │  │  ← padding: 20px 20px 0 20px
│  │  │  (进度条)            │  │  │
│  │  └─────────────────────┘  │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  .middle_of_adaptive│  │  │  ← flex: 1 (自适应高度)
│  │  │  (Swiper 内容区域)   │  │  │
│  │  └─────────────────────┘  │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  .btn-group-layout  │  │  │  ← margin: 15px 20px 20px 20px
│  │  │  (按钮组)            │  │  │
│  │  └─────────────────────┘  │  │
│  │  <play-setting>           │  │  ← 设置弹窗组件
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 与 button-group.wxss 配合

本样式文件覆盖了 `button-group.wxss` 中的部分样式：

```css
/* 覆盖按钮组的外边距和宽度 */
.btn-group-split {
  margin: 15px 20px 20px 20px;
  width: calc(100% - 40px);
  box-sizing: border-box;
}
```

---

## 页面特有样式（必须）

各听写页面**必须**在自己的 wxss 文件中设置 page 样式，以禁用滚动并覆盖全局 padding：

```css
/* 覆盖全局 page padding，禁用滚动 */
page {
  padding: 0;
  overflow: hidden;
  height: 100%;
}
```

> ⚠️ **为什么不在公共样式中设置？**
>
> 因为 `dictation-common.wxss` 在 `app.wxss` 中全局引入，如果在此设置 `page { overflow: hidden }`，会导致所有页面无法滚动（如首页、album-list 等）。

---

## 适用页面

- `/pages/dictation/spot_dictation/` - 填空听写
- `/pages/dictation/word_dictation/` - 单词听写
- `/pages/dictation/quick_answer/` - 快速作答

---

## 更新日志

### v1.1.0 (2025-12-02)
- **Breaking Change**: 移除全局 `page` 样式，避免影响其他页面滚动
- 各听写页面需在自己的 wxss 中设置 `page { overflow: hidden }`

### v1.0.0 (2025-12-02)
- 初始版本
- 从三个听写页面提取公共样式
- 配合 button-group.wxss 使用
