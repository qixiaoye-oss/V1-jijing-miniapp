# 用户页面复用指南

本文档说明如何将用户中心页面样式复用到其他微信小程序项目。

## 概述

用户中心页面提供了一套标准化的用户信息展示和菜单布局，包含：

| 组成部分 | 说明 |
|---------|------|
| 用户信息卡片 | 头像 + 昵称 + 用户编号的标准展示 |
| 菜单列表 | 统一风格的功能入口 |
| 信息编辑页 | 头像选择 + 昵称输入的表单 |
| 权限弹窗组件 | 展示用户权限有效期 |

---

## 文件清单

复用时需要复制以下文件：

```
目标项目/
├── pages/
│   └── user/
│       ├── user/                    # 用户中心页面
│       │   ├── user.js
│       │   ├── user.json
│       │   ├── user.wxml
│       │   └── user.wxss
│       └── login/                   # 用户信息编辑页
│           ├── login.js
│           ├── login.json
│           ├── login.wxml
│           └── login.wxss
├── components/
│   └── role-info-popup/             # 权限弹窗组件（可选）
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── index.wxss
└── image/
    └── wechat.png                   # 默认头像图片
```

---

## 安装步骤

### 步骤 1：复制文件

将上述文件复制到目标项目的对应目录。

### 步骤 2：配置主题变量

在目标项目的 `app.wxss` 中添加主题变量：

```css
page {
  /* 用户页主题色 - 修改这里即可适配不同品牌色 */
  --theme-color: rgba(0, 166, 237, 1);
  --theme-background-color: rgba(0, 166, 237, 0.15);

  /* 兼容旧拼写（如不修改源文件） */
  --theme-bcakground-color: rgba(0, 166, 237, 0.15);
}
```

### 步骤 3：注册组件（可选）

如需使用权限弹窗，在页面的 `json` 中注册：

```json
{
  "usingComponents": {
    "role-info-popup": "/components/role-info-popup/index"
  }
}
```

### 步骤 4：配置页面路由

在 `app.json` 中添加页面路径：

```json
{
  "pages": [
    "pages/user/user/user",
    "pages/user/login/login"
  ]
}
```

---

## 页面结构

### 1. user 页面 - 用户中心

用于展示用户信息和菜单列表。

#### WXML 结构

```xml
<view class="user-page">
  <!-- 用户信息卡片 -->
  <view class="user-info">
    <image class="user__avatar" src="{{user.headUrl || '/image/wechat.png'}}" mode="cover" />
    <view class="user__nickname">
      <view>{{user.nickName || '微信用户'}}</view>
      <view class="user__no">（{{user.no}}）</view>
    </view>
  </view>

  <!-- 菜单项 -->
  <view class="menu-item" bind:tap="toUpdateUserInfo">修改用户信息</view>
  <view class="menu-item" bind:tap="showRole">查看权限有效期</view>

  <!-- 管理员可见菜单 -->
  <block wx:if="{{user.isManager == 1}}">
    <view class="menu-item" bind:tap="toUpdateAuth">用户权限管理</view>
    <view class="menu-item" bind:tap="checkUser">用户切换</view>
  </block>

  <view class="menu-item">版本 {{version || '1.0.0'}}</view>
</view>

<!-- 权限弹窗组件 -->
<role-info-popup show="{{showPopup}}" roles="{{role}}" tags="{{tags}}"></role-info-popup>
```

#### 视觉层次

```
┌─────────────────────────────────────┐
│  .user-page (主题背景色容器)          │
│  ┌─────────────────────────────────┐│
│  │  .user-info (用户信息卡片)        ││
│  │     ┌─────┐                     ││
│  │     │ 头像 │  80×80 圆形          ││
│  │     └─────┘                     ││
│  │     昵称                         ││
│  │     (用户编号)                   ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  .menu-item (菜单项)              ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  .menu-item                      ││
│  └─────────────────────────────────┘│
│  ...                                │
└─────────────────────────────────────┘
```

---

### 2. login 页面 - 用户信息编辑

用于编辑用户头像和昵称。

#### WXML 结构

```xml
<form bindsubmit="formSubmit">
  <view class="user-page">
    <view class="user-info">
      <!-- 可点击的头像按钮 -->
      <button class="user__avatar-button" open-type="chooseAvatar" bindchooseavatar="onChooseAvatar">
        <image class="user__avatar" src="{{avatarUrl}}" mode="cover" />
      </button>

      <!-- 昵称输入框 -->
      <input class="user__nickname" name="nickName" type="nickname"
             value="{{nickName}}" placeholder="请输入昵称" />

      <!-- 提示文字 -->
      <view class="remind">点击头像或昵称进行设置或修改</view>
    </view>
  </view>

  <!-- 底部保存按钮 -->
  <view class="btn-page-bottom">
    <button class="btn-action btn--correct" form-type="submit">
      <text>保存</text>
    </button>
  </view>
</form>
```

---

## 样式规范

### 核心样式类

| 类名 | 说明 | 关键样式 |
|------|------|----------|
| `.user-page` | 页面容器 | 主题背景色，圆角 9px，flex 纵向，gap 15px |
| `.user-info` | 用户信息卡片 | 白色背景，主题色边框 1px，圆角 6px，flex 纵向居中 |
| `.user__avatar` | 头像图片 | 80×80px，圆形（border-radius: 50%） |
| `.user__avatar-button` | 头像按钮容器 | 80×80px，圆形，flex 居中 |
| `.user__nickname` | 昵称区域 | 16px 字号，黑色文字，行高 1.4 |
| `.user__no` | 用户编号 | 继承父级样式 |
| `.menu-item` | 菜单项 | 白色背景，主题色边框 1px，圆角 6px，15px 内边距 |
| `.remind` | 提示文字 | 12px 字号，40% 透明度黑色 |

### 完整 WXSS 代码

#### user.wxss

```css
.user-page {
  background: var(--theme-background-color);
  border-radius: 9px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  box-sizing: border-box;
}

.user-info {
  background-color: #ffffff;
  border: 1px solid var(--theme-color);
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-sizing: border-box;
}

.user__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.user__nickname {
  font-size: 16px;
  color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.4;
}

.menu-item {
  background-color: #ffffff;
  border: 1px solid var(--theme-color);
  border-radius: 6px;
  padding: 15px;
  line-height: 1.4;
  font-size: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

#### login.wxss 扩展样式

```css
.user__avatar-button {
  width: 80px;
  height: 80px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: transparent;
}

/* 移除按钮默认边框 */
.user__avatar-button::after {
  border: none;
}

.user__nickname {
  width: 130px;
  padding: 10px 20px;
  margin-top: 5px;
  border: 1px solid var(--theme-color);
  border-radius: 6px;
  text-align: center;
}

.remind {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 5px;
}
```

---

## 主题配色方案

### 预设主题色

可根据不同小程序品牌，修改主题变量：

| 主题 | --theme-color | --theme-background-color |
|------|---------------|--------------------------|
| 蓝色（默认） | rgba(0, 166, 237, 1) | rgba(0, 166, 237, 0.15) |
| 绿色 | rgba(0, 210, 106, 1) | rgba(0, 210, 106, 0.15) |
| 橙色 | rgba(255, 176, 46, 1) | rgba(255, 176, 46, 0.15) |
| 紫色 | rgba(139, 92, 246, 1) | rgba(139, 92, 246, 0.15) |
| 红色 | rgba(249, 47, 96, 1) | rgba(249, 47, 96, 0.15) |

### 自定义主题示例

```css
/* 绿色主题 */
page {
  --theme-color: rgba(0, 210, 106, 1);
  --theme-background-color: rgba(0, 210, 106, 0.15);
}

/* 橙色主题 */
page {
  --theme-color: rgba(255, 176, 46, 1);
  --theme-background-color: rgba(255, 176, 46, 0.15);
}
```

---

## 组件说明

### role-info-popup 权限弹窗

用于展示用户权限有效期信息的模态弹窗。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | Boolean | false | 控制弹窗显示/隐藏 |
| `roles` | Array | [] | 角色权限列表 |
| `tags` | Array | [] | 标签权限列表 |
| `title` | String | '' | 弹窗标题 |
| `confirmText` | String | '确定' | 确认按钮文字 |
| `confirmColor` | String | '' | 确认按钮颜色 |
| `showCancel` | Boolean | false | 是否显示取消按钮 |
| `cancelText` | String | '取消' | 取消按钮文字 |
| `cancelColor` | String | '' | 取消按钮颜色 |

#### 数据格式

```javascript
// roles / tags 数组项格式
{
  name: '权限名称',
  effectiveDate: '2024-01-01',
  expiryDate: '2024-12-31'
}
```

#### 使用示例

```xml
<role-info-popup
  show="{{showPopup}}"
  roles="{{roleList}}"
  tags="{{tagList}}"
  title="权限有效期"
  confirmText="我知道了"
></role-info-popup>
```

```javascript
Page({
  data: {
    showPopup: false,
    roleList: [],
    tagList: []
  },

  showRole() {
    this.setData({ showPopup: true })
  }
})
```

---

## 通用设计规范

### 尺寸规范

| 属性 | 值 | 说明 |
|------|-----|------|
| 页面内边距 | 15px | `.user-page` padding |
| 卡片内边距 | 15px | `.user-info` / `.menu-item` padding |
| 元素间距 | 15px | `.user-page` gap |
| 卡片内元素间距 | 10px | `.user-info` gap |
| 页面容器圆角 | 9px | `.user-page` border-radius |
| 卡片圆角 | 6px | `.user-info` / `.menu-item` border-radius |
| 头像尺寸 | 80×80px | `.user__avatar` |

### 字体规范

| 元素 | 字号 | 颜色 | 行高 |
|------|------|------|------|
| 昵称 | 16px | #000000 | 1.4 |
| 菜单文字 | 16px | 继承 | 1.4 |
| 提示文字 | 12px | rgba(0,0,0,0.4) | 继承 |

### 边框规范

| 元素 | 边框 |
|------|------|
| 用户信息卡片 | 1px solid var(--theme-color) |
| 菜单项 | 1px solid var(--theme-color) |
| 昵称输入框 | 1px solid var(--theme-color) |

---

## 页面逻辑

### user.js 核心方法

```javascript
var api = require('../../../utils/api')

Page({
  data: {
    version: '1.0.0',
    showPopup: false
  },

  onShow: function () {
    // 获取用户信息
    api.getUser(this)
    // 获取权限数据
    this.listData(false)
    // 获取小程序版本号
    const miniProgram = wx.getAccountInfoSync()
    this.setData({
      version: miniProgram.miniProgram.version,
    })
  },

  // 跳转到用户信息编辑页
  toUpdateUserInfo() {
    wx.navigateTo({
      url: '/pages/user/login/login',
    })
  },

  // 显示权限弹窗
  showRole() {
    this.setData({ showPopup: true })
  },
})
```

### login.js 核心方法

```javascript
Page({
  data: {
    avatarUrl: '/image/wechat.png',
    nickName: ''
  },

  // 选择头像回调
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({ avatarUrl })
  },

  // 表单提交
  formSubmit(e) {
    const { nickName } = e.detail.value
    // 处理保存逻辑
  }
})
```

---

## 注意事项

1. **主题变量拼写**：源代码中 `--theme-bcakground-color` 存在拼写错误，建议：
   - 修正为 `--theme-background-color`
   - 或同时定义两个变量保持兼容

2. **头像按钮样式**：
   - 需设置 `padding: 0` 移除按钮默认内边距
   - 需设置 `::after { border: none }` 移除按钮默认边框
   - 使用 flex 居中确保图片在圆形区域内居中

3. **昵称输入框间距**：
   - `margin-top: 5px` 配合容器 `gap: 10px`
   - 实际与头像间距为 15px

4. **API 依赖**：
   - 需要实现 `utils/api.js` 中的 `getUser`、`request`、`getUserId` 等方法
   - 或替换为目标项目的 API 调用方式

5. **权限控制**：
   - 管理员菜单通过 `user.isManager == 1` 判断
   - 需根据实际业务调整权限字段

6. **默认头像**：
   - 需要在 `/image/wechat.png` 放置默认头像图片
   - 或修改为目标项目的默认头像路径

---

## 相关文档

- [按钮与点击动效复用指南](./button-effects-reuse.md)
- [加载动效复用指南](./loading-effects-reuse.md)
- [按钮样式库](./button-group.md)
