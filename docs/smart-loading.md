# 智能加载优化方案

> 版本：v1.0.0
> 目标：优化页面加载体验，减少闪烁，缩短首次加载时间

## 核心机制

### 1. 三种刷新策略

| 场景 | 处理方式 | 用户感知 |
|------|---------|---------|
| 首次加载 | 显示 loading 和骨架屏 | 正常加载体验 |
| 子页面返回 | 后台静默刷新（无 loading） | 无感知更新 |
| 后台返回 | 完全不刷新 | 立即可用 |

### 2. 核心组件

#### behaviors/smartLoading.js

智能加载 Behavior，提供以下方法：

- `shouldLoad(options)` - 判断是否需要加载数据
- `shouldSilentRefresh()` - 判断是否应该静默刷新
- `markLoaded()` - 标记数据加载完成
- `markNeedRefresh()` - 标记需要刷新
- `notifyParentRefresh(levels)` - 通知父页面需要刷新
- `diffSetData(newData, callback)` - 使用 diff 算法更新数据
- `isFromBackground()` - 判断是否从后台返回
- `resetLoadState()` - 重置加载状态

#### utils/diff.js

数据差分更新工具：

- `isEqual(a, b)` - 深度比较两个值
- `diff(oldData, newData)` - 返回变化的字段
- `diffSetData(page, newData, callback)` - 只更新变化的数据

#### app.js 扩展

- `_fromBackground` - 后台返回标记
- `_hideTime` - 后台隐藏时间
- `globalData.homeDataCache` - 首页数据预加载缓存
- `_preloadHomeData()` - 预加载首页数据
- `getPreloadCache(type, maxAge)` - 获取预加载缓存

## 使用方式

### 基础用法

```javascript
const smartLoading = require('../../behaviors/smartLoading')

Page({
  behaviors: [pageGuard.behavior, pageLoading, smartLoading],

  onShowLogin() {
    // 判断是否需要加载
    if (!this.shouldLoad()) {
      return
    }

    const isSilent = this.shouldSilentRefresh()

    // 首次加载显示 loading
    if (!isSilent) {
      this.startLoading()
    }

    this.loadData(isSilent)
  },

  loadData(isSilent) {
    api.request(this, '/api/list', {}).then(res => {
      if (isSilent) {
        // 静默刷新使用 diff 更新
        this.diffSetData({ list: res.list })
      } else {
        this.setData({ list: res.list })
      }
      this.markLoaded()
      this.finishLoading()
    })
  }
})
```

### 子页面通知父页面刷新

```javascript
// 在子页面操作完成后
Page({
  onSaveSuccess() {
    // 通知上一级页面需要刷新
    this.notifyParentRefresh()
    // 或通知多级
    this.notifyParentRefresh(2)

    wx.navigateBack()
  }
})
```

### 使用预加载缓存（仅首页）

```javascript
const app = getApp()

Page({
  onShowLogin() {
    // 尝试使用预加载缓存
    const cachedData = app.getPreloadCache('home')

    if (cachedData) {
      this._handleData(cachedData, false)
    } else {
      this.loadData()
    }
  }
})
```

## 已优化页面

| 页面 | 状态 | 说明 |
|------|------|------|
| home_page | ✅ | 预加载 + smartLoading + diff 更新 |
| album_list | ⏳ | 待优化 |
| set_list | ⏳ | 待优化 |
| notice/list | ⏳ | 待优化 |
| 其他页面 | ⏳ | 按需优化 |

## 注意事项

1. **缓存过期时间**：默认 5 分钟，可通过 `shouldLoad({ cacheTime: 10000 })` 自定义
2. **预加载缓存**：默认 30 秒有效，使用一次后自动清除
3. **diff 更新**：适用于列表数据，可避免返回时的闪烁
4. **后台返回**：超过一定时间后台返回会触发刷新（可配置）

## 更新日志

### v1.0.0 (2025-01-02)
- 初始版本
- 实现 smartLoading behavior
- 实现 diff.js 数据差分工具
- 改造 app.js 支持预加载和后台状态追踪
- 首页 home_page 应用优化
