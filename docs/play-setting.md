# 播放设置组件 (play-setting)

听写页面的播放设置弹窗组件，提供播放次数、文章显示、自动播放等选项。

> **注意**：这是一个微信小程序自定义组件，需要在页面的 json 文件中注册。

## 版本

**当前版本：** v1.0.0
**发布日期：** 2025-12-02

## 特性

- ✅ 底部弹出式设置面板（page-container）
- ✅ 播放次数选择（1/2/3 次）
- ✅ 文章显示常开开关
- ✅ 自动播放开关（可选显示）
- ✅ 临时状态管理，取消不保存
- ✅ 确认后自动保存到本地存储

---

## 快速开始

### 1. 注册组件

在页面的 `json` 文件中注册组件：

```json
{
  "usingComponents": {
    "play-setting": "/components/play-setting/index"
  }
}
```

### 2. 使用组件

```xml
<play-setting
  show="{{numberSetWinShow}}"
  playNumber="{{playNumber}}"
  showArticle="{{baseShowArticle}}"
  showAutoPlay="{{false}}"
  autoPlay="{{autoPlayAudio}}"
  bind:cancel="onSettingCancel"
  bind:confirm="onSettingConfirm"
></play-setting>
```

### 3. 处理事件

```javascript
Page({
  data: {
    numberSetWinShow: false,
    playNumber: 2,
    baseShowArticle: false,
    autoPlayAudio: true
  },

  // 打开设置弹窗
  numberSet() {
    this.setData({ numberSetWinShow: true })
  },

  // 取消
  onSettingCancel() {
    this.setData({ numberSetWinShow: false })
  },

  // 确认
  onSettingConfirm(e) {
    const { playNumber, showArticle, autoPlay } = e.detail
    this.setData({
      numberSetWinShow: false,
      playNumber: playNumber,
      baseShowArticle: showArticle,
      autoPlayAudio: autoPlay
    })
  }
})
```

---

## 组件属性 (Properties)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | Boolean | false | 是否显示弹窗 |
| `playNumber` | Number | 2 | 当前播放次数 |
| `showArticle` | Boolean | false | 是否常开显示文章 |
| `showAutoPlay` | Boolean | false | 是否显示自动播放选项 |
| `autoPlay` | Boolean | true | 自动播放状态 |

---

## 组件事件 (Events)

### cancel

取消按钮点击时触发，不携带数据。

```javascript
onSettingCancel() {
  this.setData({ numberSetWinShow: false })
}
```

### confirm

确认按钮点击时触发，携带设置数据。

```javascript
onSettingConfirm(e) {
  const { playNumber, showArticle, autoPlay } = e.detail
  // playNumber: 播放次数 (1/2/3)
  // showArticle: 是否常开显示文章
  // autoPlay: 是否自动播放
}
```

---

## 界面结构

```
┌─────────────────────────────────┐
│  ○ 重复播放1次                   │
│  ● 重复播放2次                   │  ← 播放次数选择
│  ○ 重复播放3次                   │
├─────────────────────────────────┤
│  ○ 文章显示：常开                │  ← 文章显示开关
├─────────────────────────────────┤
│  [开关] 自动播放                 │  ← 自动播放（可选）
├─────────────────────────────────┤
│     取消     │     确认          │  ← 操作按钮
└─────────────────────────────────┘
```

---

## 本地存储

组件在确认时会自动保存播放次数到本地存储：

```javascript
wx.setStorageSync('AUDIO_PLAY_COUNT', playNumber)
```

可以在页面加载时读取：

```javascript
onLoad() {
  const playCount = wx.getStorageSync('AUDIO_PLAY_COUNT')
  if (playCount) {
    this.setData({ playNumber: playCount })
  }
}
```

---

## 样式说明

组件使用 BEM 命名规范：

| 类名 | 说明 |
|------|------|
| `.play-setting` | 组件根容器 |
| `.play-setting__group` | 选项分组 |
| `.play-setting__group--border` | 带上边框的分组 |
| `.play-setting__item` | 单个选项行 |
| `.play-setting__radio` | 单选框 |
| `.play-setting__switch` | 开关容器 |
| `.play-setting__buttons` | 按钮容器 |
| `.play-setting__btn` | 按钮基础样式 |
| `.play-setting__btn--cancel` | 取消按钮 |
| `.play-setting__btn--confirm` | 确认按钮 |
| `.play-setting__btn-divider` | 按钮分隔线 |

### :host 样式

组件设置了 `:host { display: contents; }` 确保组件节点不占用布局空间。

---

## 适用页面

- `/pages/dictation/spot_dictation/` - 填空听写
- `/pages/dictation/word_dictation/` - 单词听写
- `/pages/dictation/quick_answer/` - 快速作答（显示自动播放选项）

---

## 文件结构

```
components/play-setting/
├── index.js      # 组件逻辑
├── index.wxml    # 组件模板
├── index.wxss    # 组件样式
└── index.json    # 组件配置
```

---

## 注意事项

1. **临时状态**：弹窗打开时会初始化临时状态，取消不会保存修改
2. **page-container**：组件使用 `page-container` 实现底部弹出效果
3. **showAutoPlay**：仅 quick_answer 页面需要设置为 `true`

---

## 更新日志

### v1.0.0 (2025-12-02)
- 初始版本
- 从三个听写页面提取公共弹窗逻辑
- 支持播放次数、文章显示、自动播放设置
