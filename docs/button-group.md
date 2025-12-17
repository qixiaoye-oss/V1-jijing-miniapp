# 按钮组样式规范文档

微信小程序通用按钮组 **CSS 样式工具类库**，提供固定底部容器、多种布局模式和蒙版功能。

> **注意**：这是一个纯 CSS 样式库，不是微信小程序自定义组件。
> 通过 `@import` 引入样式后，直接在 wxml 中使用 CSS 类名即可。
> 推荐配合 `tap-action` 组件使用，自动封装点击动效。

**版本：** v3.3.2
**更新日期：** 2025-12-17
**样式文件：** `style/button-group.wxss`
**点击组件：** `components/tap-action`

---

## 快速引入

```css
/* app.wxss */
@import "style/button-group.wxss";
```

```json
/* app.json 或页面 json */
{
  "usingComponents": {
    "tap-action": "/components/tap-action/index"
  }
}
```

---

## 一、tap-action 组件

### 1.1 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | String | `button` | 模式：`button`（按钮）/ `card`（卡片） |
| `icon` | String | `''` | icon 名称，用于颜色映射（仅 button 模式） |
| `disabled` | Boolean | `false` | 是否禁用 |

### 1.2 按钮模式（默认）

```xml
<!-- 文字+图标按钮 -->
<tap-action icon="save" bind:tap="onSave">
  <view>保存</view>
  <image src="/images/v2/save_bt.png"></image>
</tap-action>

<!-- 纯图标按钮 -->
<tap-action icon="play" bind:tap="onPlay">
  <image src="/images/v2/play_bt.png"></image>
</tap-action>
```

### 1.3 卡片模式

卡片模式仅提供点击动效，不应用按钮样式：

```xml
<tap-action type="card" bind:tap="onCardTap">
  <view class="my-card">
    <!-- 卡片内容 -->
  </view>
</tap-action>
```

---

## 二、icon 颜色映射

### 2.1 映射机制

通过 `icon` 属性（或 `data-icon`）指定 icon 名称，自动应用对应的文字颜色和背景色。

**颜色映射表**：

| icon | 主色 | 背景色 | 用途 |
|------|------|--------|------|
| `save` | #00A6ED | rgba(0,166,237,0.15) | 保存 |
| `play` | #00A6ED | rgba(0,166,237,0.15) | 播放 |
| `pause` | #00A6ED | rgba(0,166,237,0.15) | 暂停 |
| `replay` | #00A6ED | rgba(0,166,237,0.15) | 重播 |
| `restart` | #00A6ED | rgba(0,166,237,0.15) | 重新开始 |
| `submit` | #00A6ED | rgba(0,166,237,0.15) | 提交 |
| `next` | #00A6ED | rgba(0,166,237,0.15) | 下一个 |
| `goto` | #00A6ED | rgba(0,166,237,0.15) | 跳转 |
| `updown` | #00A6ED | rgba(0,166,237,0.15) | 上下切换 |
| `go` | #00A6ED | rgba(0,166,237,0.15) | 前往 |
| `stop` | #00A6ED | rgba(0,166,237,0.15) | 停止 |
| `down` | #00A6ED | rgba(0,166,237,0.15) | 下载 |
| `correct` | #00D26A | rgba(0,210,106,0.15) | 正确答案 |
| `flag` | #F8312F | rgba(248,49,47,0.15) | 标记 |
| `medal` | #F8312F | rgba(248,49,47,0.15) | 勋章 |
| `visible` | #7D4533 | rgba(125,69,51,0.15) | 显示 |
| `hidden` | #7D4533 | rgba(125,69,51,0.15) | 隐藏 |
| `list` | #FFB02E | rgba(255,176,46,0.15) | 列表 |
| `setting` | #998EA4 | rgba(153,142,164,0.15) | 设置 |
| `me` | #533566 | rgba(83,53,102,0.15) | 个人中心 |
| `controller` | #433B6B | rgba(67,59,107,0.15) | 练习/打卡 |
| `desktop_mic` | #212121 | rgba(33,33,33,0.15) | 录音 |

### 2.2 维护流程

新增 icon 时需同步更新两处：
1. `images/v2/icon_color_mapping.json` - 添加 icon → 颜色映射
2. `style/button-group.wxss` - 添加对应的 `[data-icon="xxx"]` 选择器

---

## 三、Hint Banner 提示横幅

hint_banner 是位于按钮组顶端的提示区域，用于显示状态信息或操作提示。

### 3.1 基本规范

| 属性 | 值 | 说明 |
|------|-----|------|
| `font-size` | 14px | 文字字体大小 |
| `line-height` | 1.4 | 行高 |
| `padding` | 10px 40px | 上下内边距10px，左右内边距40px |
| `text-align` | center | 文字居中显示 |

### 3.2 颜色机制

通过 `data-icon` 属性指定颜色主题，颜色来源与按钮相同，但**图标不显示**：
- 使用 icon 的主色作为文字颜色
- 使用 icon 的背景色（透明度 0.15）作为背景色

### 3.3 结构位置

**重要**：hint_banner 必须放在 `btn-page-bottom` 内部、按钮组布局容器**外部（上方）**。

支持两种布局：
- 两层结构：`btn-group-split`
- 单层结构：`btn-group-single`

**两层结构示例：**

```xml
<view class="btn-page-bottom">
  <!-- ✅ hint_banner 在按钮组外部上方 -->
  <view class="btn-group-hint-banner" data-icon="list">
    录音已经播放完毕，点击去答题填写答案
  </view>
  <!-- 按钮组主体（两层） -->
  <view class="btn-group-split">
    <view class="btn-group-split__header btn-pos-center">
      <tap-action icon="replay">重播</tap-action>
      <tap-action icon="play">播放</tap-action>
    </view>
    <view class="btn-group-split__divider"></view>
    <view class="btn-group-split__footer">...</view>
  </view>
</view>
```

**单层结构示例：**

```xml
<view class="btn-page-bottom">
  <!-- ✅ hint_banner 在按钮组外部上方 -->
  <view class="btn-group-hint-banner" data-icon="go">
    点击提交完成本次练习
  </view>
  <!-- 按钮组主体（单层） -->
  <view class="btn-group-single">
    <tap-action icon="correct" bind:tap="submit">
      <view>提交</view>
      <image src="/images/v2/correct_bt.png"></image>
    </tap-action>
  </view>
</view>
```

### 3.4 高度计算

**hint_banner 高度：**

```
单行高度 = font-size × line-height + padding-y × 2
        = 14px × 1.4 + 10px × 2 = 39.6px

双行高度 = font-size × line-height × 2 + padding-y × 2
        = 14px × 1.4 × 2 + 10px × 2 = 59.2px
```

**按钮组总高度（含 hint_banner）：**

| 布局 | 无 hint | 单行 hint | 双行 hint |
|------|---------|-----------|-----------|
| 两层结构 | 168px | 207.6px | 227.2px |
| 单层结构 | 102px | 141.6px | 161.2px |

**CSS 变量：**
- `--hint-banner-height-single: 39.6px`
- `--hint-banner-height-double: 59.2px`
- `--button-group-total-height: 168px` （两层）
- `--button-group-total-height-single: 102px` （单层）
- `--button-group-total-height-with-hint: 227.2px` （两层 + 双行 hint）
- `--button-group-total-height-single-with-hint: 141.6px` （单层 + 单行 hint）

### 3.5 颜色对照表

| data-icon | 文字颜色 | 背景色 | 用途示例 |
|-----------|----------|--------|----------|
| `list` | #FFB02E | rgba(255,176,46,0.15) | 列表相关提示 |
| `play` / `replay` / `go` | #00A6ED | rgba(0,166,237,0.15) | 播放相关提示 |
| `correct` | #00D26A | rgba(0,210,106,0.15) | 正确/成功提示 |
| `flag` | #F8312F | rgba(248,49,47,0.15) | 标记/警告提示 |
| `setting` | #998EA4 | rgba(153,142,164,0.15) | 设置相关提示 |

### 3.6 蒙版联动

当按钮组包含 hint_banner 时：
- 蒙版A（实色）的上边缘自动与 hint_banner 上边缘持平
- 蒙版B（渐变）的下边缘自动与 hint_banner 上边缘持平
- 无需额外配置，hint_banner 作为 `btn-page-bottom` 的一部分，蒙版自动覆盖

### 3.7 动态高度计算

当页面内容区域需要根据按钮组高度动态调整时，使用 `button-group-height` behavior。

详细说明请参考 [七、页面布局与高度计算](#七页面布局与高度计算v32-重构)。

### 3.8 完整示例

```xml
<view class="btn-page-bottom">
  <!-- hint_banner 在按钮组外部上方 -->
  <view class="btn-group-hint-banner" data-icon="list">
    录音已经播放完毕，点击去答题填写答案
  </view>
  <!-- 按钮组主体 -->
  <view class="btn-group-split">
    <!-- 主按钮区域 -->
    <view class="btn-group-split__header btn-pos-center">
      <tap-action icon="replay" bind:tap="replay">
        <view>重播</view>
        <image src="/images/v2/replay_bt.png"></image>
      </tap-action>
      <tap-action icon="play" bind:tap="play">
        <view>播放</view>
        <image src="/images/v2/play_bt.png"></image>
      </tap-action>
      <tap-action icon="correct" bind:tap="markCorrect">
        <view>听懂</view>
        <image src="/images/v2/correct_bt.png"></image>
      </tap-action>
    </view>
    <!-- 分割线 -->
    <view class="btn-group-split__divider"></view>
    <!-- 底部按钮区域 -->
    <view class="btn-group-split__footer">
      <view class="btn-pos-left">
        <tap-action icon="setting">
          <image src="/images/v2/setting_bt.png"></image>
        </tap-action>
      </view>
      <view class="btn-pos-right">
        <tap-action icon="list" bind:tap="toList">
          <view>句子列表</view>
          <image src="/images/v2/list_bt.png"></image>
        </tap-action>
      </view>
    </view>
  </view>
</view>
```

---

## 四、按钮角标 (Corner Mark)

按钮角标用于显示数量提示（如录音数量、倍速等）。

### 4.1 尺寸与间距规范

| 属性 | 值 | 说明 |
|------|-----|------|
| `padding` | 2px | 文字与边框四周间距 |
| `font-size` | 10px | 字体大小 |
| `border-radius` | 3px | 圆角 |

**注意：** 角标尺寸由文字内容自适应，仅通过 `padding: 2px` 控制文字与边框的间距。

### 4.2 基础用法

```xml
<tap-action icon="controller" bind:tap="handleTap">
  <view>打卡/录音</view>
  <image src="/images/v2/controller_bt.png"></image>
  <view class="btn-corner-mark" wx:if="{{count > 0}}">{{count}}</view>
</tap-action>
```

### 4.3 颜色自动继承

角标颜色会**自动继承**父元素 `data-icon` 的主色，无需手动指定颜色类或 inline style。

**CSS 规则：**

```css
/* 角标颜色 - 自动继承 data-icon 主色 */
[data-icon="controller"] .btn-corner-mark {
  color: #433B6B;
  border-color: #433B6B;
}

[data-icon="desktop_mic"] .btn-corner-mark {
  color: #212121;
  border-color: #212121;
}

[data-icon="save"] .btn-corner-mark,
[data-icon="play"] .btn-corner-mark,
[data-icon="pause"] .btn-corner-mark,
[data-icon="replay"] .btn-corner-mark,
[data-icon="go"] .btn-corner-mark {
  color: #00A6ED;
  border-color: #00A6ED;
}
```

### 4.4 角标颜色对照表

| 父元素 icon | 角标颜色 | 色值 |
|-------------|----------|------|
| `controller` | 紫色 | #433B6B |
| `desktop_mic` | 黑色 | #212121 |
| `save` / `play` / `pause` / `replay` / `go` | 蓝色 | #00A6ED |

### 4.5 兼容旧版（不推荐）

旧版通过添加颜色类实现，现已不推荐使用：

```xml
<!-- 旧版写法 - 不推荐 -->
<view class="btn-corner-mark btn--recording-corner-mark">{{count}}</view>
<view class="btn-corner-mark btn--practice-corner-mark">{{count}}</view>
```

---

## 五、按钮位置类

### 5.1 位置类说明

| 类名 | 用途 | 特性 |
|------|------|------|
| `.btn-pos-left` | 左侧按钮组 | 支持多个按钮，自动 15px 间距，整体靠左 |
| `.btn-pos-right` | 右侧按钮组 | 支持多个按钮，自动 15px 间距，整体靠右 |
| `.btn-pos-center` | 居中按钮组 | 支持多个按钮，自动 15px 间距，整体居中 |

### 5.2 使用场景

**场景1：全部按钮居中**

```xml
<view class="btn-group-split__header btn-pos-center">
  <tap-action icon="replay">重播</tap-action>
  <tap-action icon="play">播放</tap-action>
  <tap-action icon="next">下句</tap-action>
</view>
```

**场景2：左右分布**

```xml
<view class="btn-group-split__footer">
  <view class="btn-pos-left">
    <tap-action icon="setting">
      <image src="/images/v2/setting_bt.png"></image>
    </tap-action>
    <tap-action icon="visible">
      <image src="/images/v2/visible_bt.png"></image>
    </tap-action>
  </view>
  <view class="btn-pos-right">
    <tap-action icon="list">
      <view>句子列表</view>
      <image src="/images/v2/list_bt.png"></image>
    </tap-action>
  </view>
</view>
```

**场景3：仅右侧（卡片内按钮）**

```xml
<view class="btn-pos-right">
  <tap-action icon="play" bind:tap="playAudio">
    <image src="/images/v2/play_bt.png"></image>
  </tap-action>
  <tap-action icon="goto" bind:tap="toDetail">
    <image src="/images/v2/goto_bt.png"></image>
  </tap-action>
</view>
```

### 5.3 灵活组合

位置类支持任意组合，左右各可放置单个或多个按钮：

```
┌─────────────────────────────────────────────────────────────┐
│  [左1] [左2]                              [右1] [右2] [右3]  │
│  └─ btn-pos-left ─┘                      └─ btn-pos-right ─┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 六、标准数值

### 6.1 按钮内部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| icon 尺寸 | **25px** | 所有按钮图标统一尺寸 |
| 文字大小 | **15px** | 按钮文本字体大小 |
| 按钮内边距 | **5px** | 文字/图标与按钮边缘的距离 |
| 文字与图标间距 | **5px** | 同一按钮内文字和图标的间距 |
| 按钮高度 | **35px** | 5px(上) + 25px(icon) + 5px(下) |

### 6.2 按钮组容器数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 容器内边距 | **15px** | 按钮组容器与灰框边缘的距离 |
| 按钮间距 | **15px** | 相邻按钮之间的间距（gap） |
| 边框 | **1px solid** | 按钮组外边框 |
| 边框颜色 | **rgba(0,0,0,0.3)** | 灰色边框 |
| 容器圆角 | **9px** | 按钮组容器圆角半径 |

### 6.3 固定底部数值

| 属性 | 数值 | 说明 |
|------|------|------|
| 距视窗底部 | **20px** | 按钮组距视窗底边缘 |
| 距视窗左右 | **20px** | 按钮组距视窗左右边缘 |
| 蒙版B高度 | **15px** | 渐变蒙版高度 |

---

## 七、按钮组布局

### 7.1 一层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-single">
    <tap-action icon="correct" bind:tap="submit">
      <view>提交</view>
      <image src="/images/v2/correct_bt.png"></image>
    </tap-action>
  </view>
</view>
```

### 7.2 两层结构

```xml
<view class="btn-page-bottom">
  <view class="btn-group-split">
    <!-- 上层 -->
    <view class="btn-group-split__header btn-pos-center">
      <tap-action icon="replay">重播</tap-action>
      <tap-action icon="play">播放</tap-action>
      <tap-action icon="next">下句</tap-action>
    </view>
    <!-- 分割线 -->
    <view class="btn-group-split__divider"></view>
    <!-- 下层 -->
    <view class="btn-group-split__footer">
      <view class="btn-pos-left">
        <tap-action icon="setting">
          <image src="/images/v2/setting_bt.png"></image>
        </tap-action>
      </view>
      <view class="btn-pos-right">
        <tap-action icon="list">
          <view>句子列表</view>
          <image src="/images/v2/list_bt.png"></image>
        </tap-action>
      </view>
    </view>
  </view>
</view>
```

### 7.3 纯文字层

```xml
<view class="btn-group-split__header btn-text-content">
  保持精听，越来越好
</view>
```

---

## 七点五、页面布局与高度计算（v3.2 重构）

按钮组固定在页面底部时，页面内容区域需要正确计算高度以避免被遮挡。本节介绍两种页面组织方式及其与 `buttonGroupHeight` Behavior 的配合使用。

### 7.5.1 蒙版结构说明

按钮组使用双层蒙版实现视觉效果：

```
┌─────────────────────────────┐
│                             │
│      页面内容区域            │
│                             │
├─────────────────────────────┤ ← 蒙版 A/B 交界处
│░░░░░ 蒙版B (15px) ░░░░░░░░░│ ← 渐变（白→透明）
├─────────────────────────────┤
│     .btn-page-bottom        │ ← 蒙版A（纯白背景）
│     按钮组内容               │
├─────────────────────────────┤
│  bottom-distance (20px)     │
└─────────────────────────────┘
```

- **蒙版A (::before)**: 纯白背景，覆盖按钮组到屏幕底部
- **蒙版B (::after)**: 白到透明渐变，高度 15px，位于按钮组上方
- **bottom-distance**: 按钮组距离屏幕底部的安全距离 20px

### 7.5.2 Behavior 引入方式

```javascript
// behaviors/button-group-height.js
const buttonGroupHeight = require('../../behaviors/button-group-height')

Page({
  behaviors: [buttonGroupHeight],

  getData() {
    api.request(this, '/api/data', params)
      .then(() => {
        // 数据就绪后重新计算按钮组高度（此时 hint_banner 已渲染）
        this.updateButtonGroupHeight()
      })
  }
})
```

### 7.5.2.1 加载场景与手动调用

根据页面加载方式不同，`updateButtonGroupHeight()` 的调用时机有所区别：

**场景对比：**

| 场景 | 加载遮挡方式 | 按钮组渲染 | behavior ready() | 是否需要手动调用 |
|------|-------------|-----------|------------------|----------------|
| audio 加载 | 全屏蒙版完全遮挡 | 始终渲染（无 wx:if） | 有效 | 否 |
| skeleton 加载 | 骨架屏局部显示 | wx:if 延迟渲染 | 失效 | 是 |

**因果关系：**

1. **audio 加载页面**（如 intensive）：
   - 有 audio 下载蒙版完全遮挡页面
   - 按钮组无需隐藏，始终渲染
   - behavior 的 `ready()` 执行时按钮组已存在
   - 自动计算高度有效

2. **skeleton 加载页面**（如 article、notice/detail、report-card）：
   - 使用骨架屏局部显示
   - 按钮组使用 `wx:if="{{_isDataReady}}"` 延迟渲染
   - behavior 的 `ready()` 执行时按钮组尚未渲染
   - 必须在数据就绪后手动调用

**skeleton 页面正确写法：**

```javascript
getDetail(isPull) {
  api.request(this, '/api/detail', params, isPull).then(() => {
    this.setDataReady()
    this.finishLoading()
    // 延迟计算，确保按钮组渲染完成
    wx.nextTick(() => {
      this.updateButtonGroupHeight()
    })
  })
}
```

**Behavior 提供的数据：**

| 数据字段 | 类型 | 说明 |
|----------|------|------|
| `buttonGroupHeight` | Number | 按钮组总高度（元素高度 + bottom-distance 20px + gap 15px） |
| `contentAreaHeight` | Number | 内容区域可用高度（视口高度 - buttonGroupHeight） |

> **注意**：本项目的 Behavior 计算包含 15px gap，与参考项目略有差异。

---

### 7.5.3 方式一：页面级滚动（推荐）

适用于内容可滚动的详情页面，如精听详情页、题目详情页。

**特点：**
- 使用普通 `<view>` 作为内容容器
- 通过 `padding-bottom` 为按钮组留出空间
- 页面本身滚动（page-level scrolling）
- 滚动到底时，内容自然过渡到按钮组

**WXML 结构：**

```xml
<view class="page-content">
  <!-- padding-bottom = buttonGroupHeight，确保内容底边距离按钮组顶边 15px -->
  <view class="content-area" style="padding-bottom: {{buttonGroupHeight ? buttonGroupHeight + 'px' : ''}}">
    <!-- 页面内容，可自由滚动 -->
    <view class="unit-detail">...</view>
    <answer-cell>...</answer-cell>
  </view>
</view>

<view class="btn-page-bottom">
  <view class="btn-group-single">
    <tap-action icon="save">保存</tap-action>
  </view>
</view>
```

**重要：padding-bottom 计算公式**

```
buttonGroupHeight = element.height + bottomDistance(20) + gap(15)

对于滚动布局（page padding-bottom: 0）：
- padding-bottom 决定内容底边到视口底部的距离
- 内容底边需距离按钮组顶边 15px (gap)
- 按钮组顶边距离视口底部 = element.height + 20
- 内容底边距离视口底部 = 15 + element.height + 20 = buttonGroupHeight
- 正确公式：padding-bottom = buttonGroupHeight
```

**图示说明：**

```
                                    ┌─────────────────────────┐
                                    │      页面内容           │
                                    │         ...            │
                                    │  最后内容行             │
 padding-bottom             ────────├─────────────────────────┤ ← 内容底边
 = buttonGroupHeight                │    15px (gap)          │
 = element + 20 + 15                ├─────────────────────────┤ ← 按钮组顶边
                                    │   .btn-page-bottom     │
                                    │      按钮组内容         │ ← element.height
                                    ├─────────────────────────┤
                                    │  20px (bottom-distance) │ ← CSS bottom:20px
                                    └─────────────────────────┘ ← 视口底部
```

**WXSS 样式：**

```css
/* 覆盖全局 page 的 padding-bottom，避免与内容 padding-bottom 叠加 */
page {
  padding-bottom: 0;
}

/* 页面内容区域 */
.content-area {
  box-sizing: border-box;
}
```

**计算说明：**
- `buttonGroupHeight`: Behavior 计算值 = 元素高度 + bottomDistance(20) + gap(15)
- 滚动布局直接使用 buttonGroupHeight 作为 padding-bottom
- 同时需覆盖 page 的 padding-bottom 为 0，避免间距叠加

**实施检查清单：**

在实施滚动布局前，必须逐项确认以下内容，确保最终间距为 15px：

| 步骤 | 检查项 | 期望值 | 处理方式 |
|------|--------|--------|----------|
| 1 | app.wxss 中 page 的 padding-bottom | 需覆盖为 0 | 页面 wxss 添加 `page { padding-bottom: 0; }` |
| 2 | 内容容器是否有固定 padding/margin-bottom | 无 | 移除或改用动态值 |
| 3 | 最后一个内容元素的 margin-bottom | 0 | 添加 `.element:last-child { margin-bottom: 0; }` |
| 4 | 加载方式是否为 skeleton | 确认 | 决定是否需要手动调用 |
| 5 | 按钮组是否 wx:if 延迟渲染 | 确认 | 需要 wx.nextTick 调用 |

**间距叠加排查公式：**

```
实际间距 = padding-bottom 中的 gap(15)
         + 全局 page padding-bottom（应为 0）
         + 最后元素 margin-bottom（应为 0）

如果实际间距 ≠ 15px，检查上述叠加项
```

**底线原则：** 所有调整在页面级别完成，禁止修改公用样式文件：
- `behaviors/button-group-height.js` ✗
- `style/button-group.wxss` ✗

---

### 7.5.4 方式二：固定内容区域

适用于内容区域固定、不随页面滚动的场景，如精听训练页。

**特点：**
- 使用 `.page-wrapper` 容器固定内容区域高度
- 内容区域内部可使用 `scroll-view` 实现局部滚动
- 整体布局固定，适合需要键盘输入的场景

**WXML 结构：**

```xml
<view class="page-wrapper" style="height: {{contentAreaHeight ? contentAreaHeight + 'px' : 'calc(100vh - var(--button-group-total-height-with-hint))'}}">
  <!-- 固定高度的内容区域 -->
  <view class="header">...</view>
  <scroll-view scroll-y class="body">
    <!-- 可滚动内容 -->
  </scroll-view>
</view>

<view class="btn-page-bottom">
  <view class="btn-group-hint-banner" data-icon="list">
    提示信息内容
  </view>
  <view class="btn-group-split">
    <!-- 双层按钮组 -->
  </view>
</view>
```

**WXSS 样式：**

```css
.page-wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.body {
  flex: 1;
  overflow: hidden;
}
```

**计算说明：**
- `contentAreaHeight`: Behavior 计算的内容区域可用高度
- CSS 变量 `--button-group-total-height-with-hint` 作为默认值

---

### 7.5.5 两种方式对比

| 特性 | 页面级滚动 | 固定内容区域 |
|------|------------|--------------|
| 滚动方式 | 整页滚动 | 内部 scroll-view |
| 布局属性 | padding-bottom | height |
| Behavior 数据 | buttonGroupHeight | contentAreaHeight |
| 适用场景 | 详情页、列表页 | 输入页、工具页 |
| 键盘弹起 | 可能遮挡内容 | 自动调整高度 |

---

### 7.5.6 高度预设值（CSS 变量）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `--button-group-total-height` | 168px | 两层结构（133px + 20px + 15px） |
| `--button-group-total-height-single` | 102px | 单层结构（67px + 20px + 15px） |
| `--button-group-total-height-with-hint` | 227.2px | 两层 + hint双行 |
| `--button-group-total-height-single-with-hint` | 141.6px | 单层 + hint单行 |

> **注意：** 本项目高度计算包含 15px gap（蒙版B区域），与参考项目不同。

---

### 7.5.7 手动更新高度

当 hint_banner 动态显示/隐藏或文字内容变化时，需手动调用更新：

```javascript
// 切换 hint_banner 显示状态后
this.setData({ showHint: true })
this.updateButtonGroupHeight()

// 或使用 Promise
this.updateButtonGroupHeight().then(result => {
  console.log('新高度:', result.buttonGroupHeight)
})
```

---

### 7.5.8 调试高度明细

```javascript
// 获取按钮组各部分高度
this.getButtonGroupHeightDetail().then(detail => {
  console.log('hint_banner:', detail.hintBanner)
  console.log('split布局:', detail.splitLayout)
  console.log('single布局:', detail.inlineLayout)
})
```

---

## 八、完整示例

### 示例1：精听页面按钮组（带 hint_banner）

```xml
<view class="btn-page-bottom">
  <!-- hint_banner 根据状态切换 -->
  <view class="btn-group-hint-banner" data-icon="list" wx:if="{{!isLastSentence}}">
    听写框输入内容，句子则自动被标注为"听不懂的句子"并保存
  </view>
  <view class="btn-group-hint-banner" data-icon="go" wx:if="{{isLastSentence}}">
    结束后，点击"保存"并进入订正环节
  </view>
  <!-- 按钮组主体 -->
  <view class="btn-group-split">
    <view class="btn-group-split__header btn-pos-center">
      <tap-action icon="replay" bind:tap="listenAgain">
        <view>重播</view>
        <image src="/images/v2/replay_bt.png"></image>
      </tap-action>
      <tap-action icon="play" bind:tap="playAudio">
        <view>播放</view>
        <image src="/images/v2/play_bt.png"></image>
      </tap-action>
      <tap-action icon="next" bind:tap="nextSentence">
        <view>下句</view>
        <image src="/images/v2/next_bt.png"></image>
      </tap-action>
      <tap-action icon="correct" bind:tap="markCorrect">
        <view>听懂</view>
        <image src="/images/v2/correct_bt.png"></image>
      </tap-action>
    </view>
    <view class="btn-group-split__divider"></view>
    <view class="btn-group-split__footer">
      <view class="btn-pos-left">
        <tap-action icon="setting" bind:tap="playSet">
          <image src="/images/v2/setting_bt.png"></image>
        </tap-action>
        <tap-action icon="visible" bind:tap="toggleVisible">
          <image src="/images/v2/visible_bt.png"></image>
        </tap-action>
      </view>
      <view class="btn-pos-right">
        <tap-action icon="list" bind:tap="toList">
          <view>句子列表</view>
          <image src="/images/v2/list_bt.png"></image>
        </tap-action>
      </view>
    </view>
  </view>
</view>
```

### 示例2：卡片内按钮（居右）

```xml
<view class="card">
  <view class="card-content">...</view>
  <view class="btn-pos-right">
    <tap-action icon="play" bind:tap="playAudio">
      <image src="/images/v2/play_bt.png"></image>
    </tap-action>
    <tap-action icon="goto" bind:tap="toDetail">
      <image src="/images/v2/goto_bt.png"></image>
    </tap-action>
  </view>
</view>
```

### 示例3：卡片点击效果

```xml
<tap-action type="card" bind:tap="onCardTap">
  <view class="home-card">
    <view class="home-card__content">
      <view class="home-card__title">卡片标题</view>
      <view class="home-card__desc">卡片描述</view>
    </view>
  </view>
</tap-action>
```

### 示例4：带角标的按钮

```xml
<tap-action icon="controller" bind:tap="handleTap">
  <view>打卡/录音</view>
  <image src="/images/v2/controller_bt.png"></image>
  <view class="btn-corner-mark" wx:if="{{recordCount > 0}}">{{recordCount}}</view>
</tap-action>
```

---

## 九、设计决策

### 9.1 高度计算方式

**决策**：数据加载后手动调用 `updateButtonGroupHeight()`

**原因**：
- 微信小程序不支持 MutationObserver，无法监听 DOM 变化
- 手动调用更可控，避免不必要的计算
- 当前调用场景明确：数据加载后、hint_banner 内容切换时

### 9.2 CSS 变量数值

**决策**：使用硬编码精确值，而非 `calc()` 动态计算

**原因**：
- 小程序对 CSS 变量嵌套 `calc()` 支持不稳定
- 硬编码更直观，便于调试
- 基础变量（font-size、line-height、padding）基本不会修改

### 9.3 Behavior 防抖

**决策**：暂不添加防抖机制

**原因**：
- 已有 50ms setTimeout 延迟等待 DOM 渲染
- 当前调用频率低（数据加载后、句子切换时）
- 无明显性能问题，避免过度优化

---

## 十、更新记录

### v3.3.2 (2025-12-17)
- **新增实施检查清单**：滚动布局页面实施前的必查项目
  - 全局 page padding-bottom 检查与覆盖
  - 内容容器固定间距检查
  - 最后元素 margin-bottom 检查（如 `.element:last-child { margin-bottom: 0 }`）
  - 加载方式与 Behavior 调用时机确认
- **新增间距叠加排查公式**：快速定位间距异常原因
- **明确底线原则**：禁止修改公用样式文件，所有调整在页面级别完成

### v3.3.1 (2025-12-17)
- **修正滚动布局公式**：padding-bottom = buttonGroupHeight（不需要减去 20）
  - 之前的公式 `buttonGroupHeight - 20` 是错误的
  - padding-bottom 决定内容底边到视口底部的距离
  - 内容底边需距离视口底部 = gap(15) + element.height + bottomDistance(20) = buttonGroupHeight
  - 同时需覆盖 page 的 padding-bottom 为 0，避免与全局 padding 叠加
- **更新图示说明**：修正各层高度关系图

### v3.3.0 (2025-12-16)
- **新增加载场景说明**：区分 audio 加载与 skeleton 加载的不同处理方式
  - audio 加载页面（如 intensive）：按钮组始终渲染，behavior ready() 自动计算
  - skeleton 加载页面（如 article）：按钮组 wx:if 延迟渲染，需手动调用 updateButtonGroupHeight()
  - 添加 wx.nextTick() 调用示例，确保按钮组渲染完成后再计算
- **完善文档结构**：新增 7.5.2.1 章节详细说明加载场景与手动调用时机

### v3.2.0 (2025-12-16)
- **重构页面布局文档**：新增"七点五、页面布局与高度计算"章节
  - 新增蒙版结构图，明确蒙版A/B区域与按钮组关系
  - 明确两种页面布局方式：页面级滚动（padding-bottom）与固定内容区域（height）
  - 添加 Behavior 引入方式与提供的数据字段说明
  - 添加两种方式的对比表格
  - 添加高度预设值 CSS 变量完整列表
  - 添加手动更新高度和调试明细的方法说明
- **文档同步**：与参考项目 1204-ielts-speaking-miniapp v3.2.0 保持一致
- **注意**：本项目 Behavior 计算包含 15px gap，高度值与参考项目略有差异

### v3.1.1 (2025-12-15)
- **优化角标定位**：使用 `transform: translate(50%, -50%)` 定位代替硬编码偏移量
  - 旧版：`top: -10px; right: -14px; transform: scale(0.9);`
  - 新版：`top: 0; right: 0; transform: translate(50%, -50%) scale(0.9);`
  - 角标中心精确对齐按钮右上角，适配不同按钮尺寸

### v3.1.0 (2025-12-14)
- **简化布局类名**：提升代码可读性
  - `btn-group-layout-inline-center` → `btn-group-single`
  - `btn-group-layout-split` → `btn-group-split`
  - 子类相应简化：`btn-group-split__header`、`btn-group-split__divider`、`btn-group-split__footer`

### v3.0.0 (2025-12-14)
- **新增 Hint Banner**：按钮组顶部提示横幅功能
  - 通过 `data-icon` 指定颜色主题
  - 自动继承 icon 主色和背景色
  - 蒙版自动联动，无需额外配置
  - 支持单层和两层按钮组结构
- **新增高度变量**：精确计算的高度 CSS 变量
  - `--hint-banner-height-single: 39.6px`
  - `--hint-banner-height-double: 59.2px`
  - `--button-group-total-height-single: 102px`
  - `--button-group-total-height-single-with-hint: 141.6px`
- **新增动态高度 Behavior**：`button-group-height.js`
  - 自动计算按钮组实际高度
  - 提供 `contentAreaHeight` 供页面布局使用
  - 支持 hint_banner 动态变化时重新计算

### v2.1.0 (2025-12-11)
- **新增角标颜色继承**：角标颜色自动继承父元素 `data-icon` 主色
- **新增 icon 映射**：`go`、`stop`、`down`（蓝色）、`medal`（红色）、`controller`（紫色）、`desktop_mic`（黑色）

### v2.0.0 (2025-12-09)
- **重构位置类**：使用 `.btn-pos-left`、`.btn-pos-right`、`.btn-pos-center` 包裹类
- **支持多按钮**：每个位置类支持包含任意数量按钮，自动 15px 间距
- **修复独立使用**：`.btn-pos-right` 添加 `justify-content: flex-end`，支持非 flex 父容器
- **移除旧类名**：废弃 `.btn-pos-left-1`、`.btn-pos-right-1` 等单按钮类名

### v1.9.0 (2025-12-09)
- **全局迁移**：所有页面迁移到 `<tap-action>` 组件方式
- **移除废弃类**：删除 `.btn-action-icon` 类（已无使用）
- **简化架构**：统一使用组件封装点击效果

### v1.8.0 (2025-12-09)
- **组件重命名**：`btn-action` 组件更名为 `tap-action`
- **新增卡片模式**：`tap-action` 组件新增 `type="card"` 模式
- **职责分离**：点击动效由 `tap-action` 组件管理，样式库专注布局

### v1.7.0 (2025-12-07)
- **实现 icon 颜色映射机制**：通过 `data-icon` 属性自动映射颜色
- **全局迁移**：将所有页面的 `.btn--xxx` 迁移为 `data-icon` 方式

---

**文档版本：** v3.3.2
**最后更新：** 2025-12-17
**维护者：** 开发团队
