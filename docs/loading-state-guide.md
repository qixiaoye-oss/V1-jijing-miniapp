# 加载状态管理指南

微信小程序加载状态管理的统一方案，包含加载动效、错误处理策略、页面安全守卫和复用指南。

> **本文档目标**：确保其他项目通过阅读本文档，可以**完整、正确地复用**整套加载状态管理系统。

**版本：** v4.2.0
**更新日期：** 2025-12-13

---

## 目录

1. [概述](#一概述)
2. [文件结构与依赖](#二文件结构与依赖)
3. [完整源码](#三完整源码)
4. [使用方法](#四使用方法)
5. [错误处理策略](#五错误处理策略)
6. [迁移到其他项目](#六迁移到其他项目)
7. [常见问题](#七常见问题)
8. [迁移检查清单](#八迁移检查清单)
9. [变更日志](#九变更日志)

---

## 一、概述

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           加载状态管理体系                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 第1层：加载动效（视觉反馈）                                           │   │
│  │   ├─ pageLoading     页面顶部进度条，模拟加载进度 0→90→100           │   │
│  │   ├─ audioLoading    全屏圆饼进度，显示实际音频下载进度               │   │
│  │   └─ audioPageLoading 组合上述两者，用于音频页面                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 第2层：全局 API 兜底                                                  │   │
│  │   └─ api.js 请求超过1秒自动显示原生 loading                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 第3层：页面守卫 + 错误处理（pageGuard）                               │   │
│  │   ├─ 定时器安全管理    页面隐藏/卸载时自动清理，防止内存泄漏          │   │
│  │   ├─ 导航锁            防止快速点击导致多次跳转                       │   │
│  │   ├─ 数据就绪状态      确保数据加载完成后才响应操作                   │   │
│  │   └─ 错误处理策略      goBack / showRetry / finishProgress          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 第4层：加载失败 UI（loadError）                                       │   │
│  │   └─ 显示"加载失败"文案 + 重试按钮                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 模块关系图

```
                    ┌──────────────────┐
                    │    pageGuard     │ ← 页面守卫（必须）
                    │   .behavior      │
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ pageLoading  │ │ audioLoading │ │  loadError   │
    │  页面进度条   │ │  音频进度    │ │  失败重试    │
    └──────────────┘ └──────────────┘ └──────────────┘
            │                │
            └────────┬───────┘
                     ▼
            ┌──────────────────┐
            │ audioPageLoading │ ← 组合 Behavior
            │  音频页面专用     │
            └──────────────────┘
```

### 1.3 文件清单

| 类型 | 文件路径 | 说明 |
|------|----------|------|
| **Behavior** | `behaviors/pageGuard.js` | 页面守卫（核心） |
| **Behavior** | `behaviors/pageLoading.js` | 页面进度条 |
| **Behavior** | `behaviors/audioLoading.js` | 音频加载进度 |
| **Behavior** | `behaviors/audioPageLoading.js` | 组合 Behavior |
| **Behavior** | `behaviors/loadError.js` | 加载失败状态 |
| **模板** | `templates/page-loading.wxml` | 进度条模板 |
| **模板** | `templates/audio-loading.wxml` | 音频加载模板 |
| **模板** | `templates/load-error.wxml` | 失败重试模板 |
| **样式** | `style/page-loading.wxss` | 进度条样式 |
| **样式** | `style/audio-loading.wxss` | 音频加载样式 |
| **样式** | `style/load-error.wxss` | 失败重试样式 |

---

## 二、文件结构与依赖

### 2.1 目录结构

```
project/
├── app.js                      # 全局注册 pageGuard
├── app.wxss                    # 引入所有样式
├── behaviors/
│   ├── pageGuard.js            # 【核心】页面守卫
│   ├── pageLoading.js          # 页面进度条
│   ├── audioLoading.js         # 音频加载进度
│   ├── audioPageLoading.js     # 组合 Behavior
│   └── loadError.js            # 加载失败状态
├── templates/
│   ├── page-loading.wxml       # 进度条模板
│   ├── audio-loading.wxml      # 音频加载模板
│   └── load-error.wxml         # 失败重试模板
├── style/
│   ├── page-loading.wxss       # 进度条样式
│   ├── audio-loading.wxss      # 音频加载样式
│   └── load-error.wxss         # 失败重试样式
└── pages/
    └── xxx/
        ├── index.js            # 引入 behaviors
        └── index.wxml          # 引入 templates
```

### 2.2 依赖关系

```
app.wxss
  └── @import "style/page-loading.wxss"
  └── @import "style/audio-loading.wxss"
  └── @import "style/load-error.wxss"

页面.js
  └── require('behaviors/pageGuard')      → 导出 { behavior, goBack, showRetry, finishProgress }
  └── require('behaviors/pageLoading')    → 导出 Behavior
  └── require('behaviors/loadError')      → 导出 Behavior

页面.wxml
  └── <import src="/templates/page-loading.wxml" />
  └── <import src="/templates/load-error.wxml" />
```

---

## 三、完整源码

### 3.1 behaviors/pageGuard.js

> **说明**：页面守卫是整套系统的核心，提供定时器管理、导航锁、错误处理策略。

```js
/**
 * 页面守卫 Behavior
 *
 * 功能：
 * 1. 定时器安全管理（页面切换时自动清理）
 * 2. 页面状态追踪（活跃、数据就绪）
 * 3. 错误处理策略（goBack、showRetry、finishProgress）
 * 4. 防重复点击/导航
 *
 * 使用方式：
 * const pageGuard = require('../../behaviors/pageGuard')
 *
 * Page({
 *   behaviors: [pageGuard.behavior],
 *
 *   loadData() {
 *     api.request(...).then(() => {
 *       this.setDataReady()
 *     }).catch(() => {
 *       pageGuard.goBack(this)
 *     })
 *   },
 *
 *   onButtonTap() {
 *     this.navigateTo('/pages/xxx/index')
 *   }
 * })
 */

module.exports = {
  behavior: behavior,
  goBack: goBack,
  showRetry: showRetry,
  finishProgress: finishProgress,
  isNavigating: checkIsNavigating
}
```

### 3.2 behaviors/pageLoading.js

```js
/**
 * 页面加载进度条 Behavior
 * 用于在页面数据加载时显示顶部进度条动画
 */
module.exports = Behavior({
  data: {
    loading: false,
    loadProgress: 0
  },

  methods: {
    startLoading() { /* 开始显示进度条 */ },
    simulateProgress() { /* 模拟进度增长 */ },
    finishLoading() { /* 完成加载 */ }
  }
})
```

### 3.3 behaviors/audioLoading.js

```js
/**
 * 音频加载进度 Behavior
 * 用于显示音频下载的圆饼进度
 */
module.exports = Behavior({
  data: {
    audioDownProgress: 100
  },

  methods: {
    startAudioLoading() { /* 开始音频加载 */ },
    updateAudioProgress(progress) { /* 更新进度 */ },
    finishAudioLoading() { /* 完成加载 */ }
  }
})
```

### 3.4 behaviors/audioPageLoading.js

```js
/**
 * 音频页面加载 Behavior（组合）
 * 整合 pageLoading 和 audioLoading
 */
const pageLoading = require('./pageLoading')
const audioLoading = require('./audioLoading')

module.exports = Behavior({
  behaviors: [pageLoading, audioLoading],

  methods: {
    startAudioPageLoading() {
      this.startLoading()
      this.startAudioLoading()
    },
    finishAudioPageLoading() {
      this.finishAudioLoading()
      this.finishLoading()
    }
  }
})
```

### 3.5 behaviors/loadError.js

```js
/**
 * 加载失败重试 Behavior
 * 用于策略B：显示重试按钮
 */
module.exports = Behavior({
  data: {
    loadError: false
  },

  methods: {
    showLoadError() { this.setData({ loadError: true }) },
    hideLoadError() { this.setData({ loadError: false }) }
  }
})
```

---

## 四、使用方法

### 4.1 引入方式总览

**重要：** `pageGuard` 导出的是一个对象，使用时需要用 `pageGuard.behavior`：

```js
const pageGuard = require('../../behaviors/pageGuard')   // 导出 { behavior, goBack, showRetry, ... }
const pageLoading = require('../../behaviors/pageLoading') // 导出 Behavior
const loadError = require('../../behaviors/loadError')     // 导出 Behavior

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],  // 注意是 pageGuard.behavior
  // ...
})
```

### 4.2 四种页面类型模板

#### 类型1：详情页（策略A - 失败退回）

```js
// pages/detail/index.js
const api = getApp().api
const pageGuard = require('../../behaviors/pageGuard')
const pageLoading = require('../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],
  data: {},

  onLoad(options) {
    this.startLoading()
    this.loadDetail(options.id)
  },

  loadDetail(id) {
    api.request(this, `/api/detail/${id}`, {}, true).then(res => {
      this.setData({ detail: res })
      this.setDataReady()
      this.finishLoading()
    }).catch(() => {
      pageGuard.goBack(this)  // 失败后1.5秒自动退回
    })
  },

  // 使用安全导航
  toSubPage(e) {
    this.navigateTo('/pages/sub/index?id=' + e.currentTarget.dataset.id)
  }
})
```

#### 类型2：列表页（策略B - 失败重试）

```js
// pages/list/index.js
const api = getApp().api
const pageGuard = require('../../behaviors/pageGuard')
const pageLoading = require('../../behaviors/pageLoading')
const loadError = require('../../behaviors/loadError')

Page({
  behaviors: [pageGuard.behavior, pageLoading, loadError],
  data: {
    list: []
  },

  onShow() {
    this.startLoading()
    this.listData()
  },

  listData() {
    this.hideLoadError()  // 重试时先隐藏错误
    api.request(this, '/api/list', {}, true).then(res => {
      this.setData({ list: res })
      this.setDataReady()
      this.finishLoading()
    }).catch(() => {
      pageGuard.showRetry(this)  // 显示重试按钮
    })
  },

  // 必须实现此方法，供模板调用
  retryLoad() {
    this.startLoading()
    this.listData()
  },

  toDetail(e) {
    this.navigateTo('/pages/detail/index?id=' + e.currentTarget.dataset.id)
  }
})
```

#### 类型3：音频页面（使用组合 Behavior）

```js
// pages/audio/index.js
const api = getApp().api
const pageGuard = require('../../behaviors/pageGuard')
const audioPageLoading = require('../../behaviors/audioPageLoading')

Page({
  behaviors: [pageGuard.behavior, audioPageLoading],
  data: {},

  onLoad(options) {
    this.startAudioPageLoading()  // 同时启动进度条和音频遮罩
    this.loadData(options)
  },

  loadData(options) {
    api.request(this, '/api/audio', options, true).then(res => {
      this.setData({ detail: res })
      // 下载音频并更新进度
      const downloadTask = wx.downloadFile({
        url: res.audioUrl,
        success: () => {
          this.setDataReady()
          this.finishAudioPageLoading()
        }
      })
      downloadTask.onProgressUpdate((res) => {
        this.updateAudioProgress(res.progress)
      })
    }).catch(() => {
      pageGuard.goBack(this)
    })
  }
})
```

#### 类型4：简单表单页（无初始化加载）

```js
// pages/form/index.js
const api = getApp().api

Page({
  data: {},

  // 策略C：用户操作，失败仅提示
  submit(e) {
    const data = e.detail.value
    api.request(this, '/api/save', data, true, 'POST').then(() => {
      api.toast('保存成功')
      wx.navigateBack()
    }).catch(() => {
      // 错误已在 api.js 中 toast，无需额外处理
    })
  }
})
```

### 4.3 API 方法速查表

#### pageGuard 实例方法（通过 this 调用）

| 方法 | 说明 | 示例 |
|------|------|------|
| `this.registerTimer(name, fn, delay)` | 注册安全定时器 | `this.registerTimer('auto', () => {}, 3000)` |
| `this.cancelTimer(name)` | 取消定时器 | `this.cancelTimer('auto')` |
| `this.setDataReady()` | 标记数据就绪 | 数据加载完成后调用 |
| `this.isDataReady()` | 检查数据是否就绪 | `if (this.isDataReady()) {...}` |
| `this.navigateTo(url, options)` | 安全跳转 | `this.navigateTo('/pages/x/index')` |
| `this.redirectTo(url)` | 安全重定向 | `this.redirectTo('/pages/x/index')` |
| `this.navigateBack(delta)` | 安全返回 | `this.navigateBack()` |
| `this.switchTab(url)` | 安全切换 Tab | `this.switchTab('/pages/home/index')` |
| `this.throttleAction(name, fn, delay)` | 节流操作 | `this.throttleAction('submit', () => {})` |

#### pageGuard 静态方法（通过模块调用）

| 方法 | 说明 | 适用场景 |
|------|------|----------|
| `pageGuard.goBack(this)` | 结束加载 → 1.5秒后退回 | 详情页加载失败 |
| `pageGuard.showRetry(this)` | 结束加载 → 显示重试按钮 | 列表页加载失败 |
| `pageGuard.finishProgress(this)` | 仅结束加载状态 | 非关键数据失败 |

#### pageLoading 方法

| 方法 | 说明 |
|------|------|
| `this.startLoading()` | 开始显示进度条 |
| `this.finishLoading()` | 结束进度条（100% 后隐藏） |

#### audioLoading 方法

| 方法 | 说明 |
|------|------|
| `this.startAudioLoading()` | 开始显示音频遮罩（进度归零） |
| `this.updateAudioProgress(progress)` | 更新进度 (0-100) |
| `this.finishAudioLoading()` | 结束音频遮罩（进度设为100） |

#### loadError 方法

| 方法 | 说明 |
|------|------|
| `this.showLoadError()` | 显示加载失败状态 |
| `this.hideLoadError()` | 隐藏加载失败状态 |

---

## 五、错误处理策略

### 5.1 五种策略对照表

| 策略 | 名称 | 代码 | 适用场景 |
|------|------|------|----------|
| **A** | 退回 | `pageGuard.goBack(this)` | 详情页、子页面加载失败 |
| **B** | 重试 | `pageGuard.showRetry(this)` | 首页、列表页加载失败 |
| **C** | 提示 | `.catch(() => {})` | 用户操作失败（api.js 自动 toast） |
| **D** | 静默 | `.catch(() => {})` | 自动保存、埋点、后台操作 |
| **E** | 结束 | `pageGuard.finishProgress(this)` | 非关键辅助数据加载失败 |

### 5.2 按页面类型选择

| 页面类型 | 初始化加载 | 用户操作 | 后台操作 |
|----------|:----------:|:--------:|:--------:|
| 首页 | B 重试 | C 提示 | D 静默 |
| 列表页 | B 重试 | C 提示 | D 静默 |
| 详情页 | A 退回 | C 提示 | D 静默 |
| 设置页 | A 退回 | C 提示+恢复 | D 静默 |
| 训练页 | A 退回 | D 静默 | D 静默 |
| 表单页 | - | C 提示 | - |

### 5.3 策略实现代码

```js
// 策略A：退回
.catch(() => {
  pageGuard.goBack(this)
})

// 策略B：重试（需配合 loadError behavior）
listData() {
  this.hideLoadError()
  api.request(...).then(() => {
    this.finishLoading()
  }).catch(() => {
    pageGuard.showRetry(this)
  })
},
retryLoad() {
  this.startLoading()
  this.listData()
}

// 策略C：仅提示（错误已在 api.js toast）
.catch(() => {
  // 无需处理
})

// 策略D：静默失败
.catch(() => {
  // 静默
})

// 策略E：仅结束进度
.catch(() => {
  pageGuard.finishProgress(this)
})
```

---

## 六、迁移到其他项目

### 6.1 Step 1：复制文件

将以下文件复制到目标项目：

```
behaviors/
├── pageGuard.js           # 必须
├── pageLoading.js         # 必须
├── audioLoading.js        # 可选（有音频页面才需要）
├── audioPageLoading.js    # 可选（有音频页面才需要）
└── loadError.js           # 可选（有重试功能才需要）

templates/
├── page-loading.wxml      # 必须
├── audio-loading.wxml     # 可选
└── load-error.wxml        # 可选

style/
├── page-loading.wxss      # 必须
├── audio-loading.wxss     # 可选
└── load-error.wxss        # 可选
```

### 6.2 Step 2：配置 app.wxss

```css
/* app.wxss */
@import "style/page-loading.wxss";
@import "style/audio-loading.wxss";   /* 可选 */
@import "style/load-error.wxss";      /* 可选 */

/* 可自定义主题色 */
page {
  --theme-color: #007bff;
}
```

### 6.3 Step 3：逐页面接入

1. **引入 behaviors**
```js
const pageGuard = require('../../behaviors/pageGuard')
const pageLoading = require('../../behaviors/pageLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading],
  // ...
})
```

2. **引入 templates**
```xml
<import src="/templates/page-loading.wxml" />
<template is="pageLoading" data="{{loading, loadProgress}}" />
```

3. **添加生命周期调用**
```js
onLoad() {
  this.startLoading()
  this.loadData()
}
```

4. **选择错误处理策略**
```js
loadData() {
  api.request(this, '/api/xxx', {}, true).then(res => {
    this.setDataReady()
    this.finishLoading()
  }).catch(() => {
    pageGuard.goBack(this)  // 或 showRetry / finishProgress
  })
}
```

---

## 七、常见问题

### Q1：进度条卡在 90% 不动

**原因**：`.catch()` 中没有调用 `finishLoading()`

**解决**：
```js
.catch(() => {
  this.finishLoading()  // 必须调用
  // 或使用 pageGuard 方法，它们内部会自动调用
  pageGuard.goBack(this)
})
```

### Q2：控制台报 "Uncaught (in promise)" 错误

**原因**：`api.request()` 没有 `.catch()` 处理

**解决**：每个 `api.request()` 都必须有 `.catch()`，即使是空的：
```js
api.request(...).catch(() => {
  // 静默失败也要写 catch
})
```

### Q3：页面跳转时定时器仍在执行

**原因**：使用了原生 `setTimeout` 而非 `registerTimer`

**解决**：
```js
// 错误 ❌
setTimeout(() => { /* ... */ }, 1000)

// 正确 ✅
this.registerTimer('myTimer', () => { /* ... */ }, 1000)
```

### Q4：快速点击导致多次跳转

**原因**：使用了原生 `wx.navigateTo`

**解决**：
```js
// 错误 ❌
wx.navigateTo({ url: '/pages/xxx' })

// 正确 ✅
this.navigateTo('/pages/xxx')
```

### Q5：pageGuard is not a Behavior

**原因**：直接使用 `pageGuard` 而非 `pageGuard.behavior`

**解决**：
```js
// 错误 ❌
behaviors: [pageGuard, pageLoading]

// 正确 ✅
behaviors: [pageGuard.behavior, pageLoading]
```

### Q6：重试按钮点击无反应

**原因**：页面没有实现 `retryLoad` 方法

**解决**：
```js
// 必须实现此方法
retryLoad() {
  this.startLoading()
  this.loadData()  // 重新加载数据
}
```

---

## 八、迁移检查清单

### 8.1 文件检查

- [x] `behaviors/pageGuard.js` 已存在
- [x] `behaviors/pageLoading.js` 已存在
- [x] `behaviors/loadError.js` 已存在
- [x] `behaviors/audioLoading.js` 已存在
- [x] `behaviors/audioPageLoading.js` 已存在
- [x] `templates/page-loading.wxml` 已存在
- [x] `templates/load-error.wxml` 已存在
- [x] `templates/audio-loading.wxml` 已存在
- [x] `style/page-loading.wxss` 已存在
- [x] `style/load-error.wxss` 已存在
- [x] `style/audio-loading.wxss` 已存在

### 8.2 页面检查（每个页面）

- [ ] 使用 `pageGuard.behavior` 而非 `pageGuard`
- [ ] WXML 中引入了对应的模板
- [ ] `onLoad/onShow` 中调用了 `startLoading()`
- [ ] 成功时调用了 `finishLoading()` 和 `setDataReady()`
- [ ] 失败时有 `.catch()` 处理
- [ ] 使用策略B时实现了 `retryLoad()` 方法
- [ ] 导航使用 `this.navigateTo()` 而非 `wx.navigateTo()`

### 8.3 代码规范检查

- [ ] 每个 `api.request()` 都有 `.catch()` 处理
- [ ] 定时器使用 `registerTimer()` 而非 `setTimeout()`
- [ ] 错误处理策略选择正确（参考 5.2 表格）

---

## 九、变更日志

### v4.2.0 (2025-12-13)

**本项目适配：**
- 修复 `exercise_record.js` 缺少 pageLoading
- 修复 `user/user.js` 缺少 pageLoading 和错误处理
- 修复 `user/login.js` 缺少 pageLoading 和错误处理
- 修复 `teacher/widget.js` 缺少 pageGuard
- 修复 `teacher/user_role.js` 使用原生 setTimeout
- 修复 `teacher/privilege.js` 使用原生 setTimeout
- 添加本文档

### v4.1.0 (2025-12-10)

**参考项目完成迁移：**
- 所有页面已从 `errorHandler` 迁移到 `pageGuard.behavior`
- 不再使用 `getApp().errorHandler`

### v4.0.0 (2025-12-10)

**重大变更：**
- 将 `utils/errorHandler.js` 合并到 `behaviors/pageGuard.js`
- `pageGuard` 现在导出一个对象：`{ behavior, goBack, showRetry, finishProgress }`

**新增功能：**
- 定时器安全管理：`registerTimer()` / `cancelTimer()`
- 导航锁：`navigateTo()` / `redirectTo()` / `navigateBack()` / `switchTab()`
- 节流方法：`throttleAction()`
- 数据就绪状态：`setDataReady()` / `isDataReady()`

---

**文档版本：** v4.2.0
**最后更新：** 2025-12-13
**维护者：** 开发团队
