---
name: design
description: 前端设计规范指南 - 基于在线简历和公司详情页提取的设计系统
---

# Frontend Design System

本设计规范基于 frontend-app-demo 项目中「在线简历」和「公司详情页」代码提取。

---

## 颜色体系

### 主题色 (Primary)

```
主题色:       rgba(0, 139, 104, 1)
主题色活跃:   rgba(2, 168, 126, 1)
主题色浅:     rgba(235, 250, 245, 1)
强调绿:       rgba(111, 205, 174, 1)
浅绿装饰:     rgba(143, 234, 204, 1)
```

### 背景色 (Background)

```
页面背景:     rgba(251, 251, 251, 1)
卡片背景:     rgba(255, 255, 255, 1)
输入框背景:   rgba(244, 244, 244, 1)
标签背景:     rgba(241, 242, 244, 1)
```

### 文字颜色 (Text)

```
主文本:       rgba(0, 0, 0, 1)
次级文本:     rgba(123, 131, 141, 1)
占位符:       rgba(187, 193, 201, 1)
禁用文本:     rgba(221, 226, 232, 1)
```

### 功能色 (Functional)

```
底部按钮背景: rgba(58, 60, 60, 1)
底部按钮文字: rgba(209, 255, 240, 1)
遮罩层:       rgba(0, 0, 0, 0.5)
分隔线:       rgba(244, 244, 244, 1)
边框灰:       rgba(221, 226, 232, 1)
```

---

## 字体规范

### 字号 (Font Size)

| 用途 | 大小 |
|-----|-----|
| 大标题 | 20px |
| 卡片标题 | 18px |
| 正文/字段值 | 16px |
| 标签文本 | 14px |
| 日期/链接 | 13px |
| 小标签 | 12px |
| 超小按钮 | 10px |

### 字重 (Font Weight)

```
extraLight:  200
light:       300
regular:     400  // 正文
medium:      500  // 强调
semibold:    600  // 标题
```

### 行高 (Line Height)

```
大标题:   28px  (fontSize: 18px)
标题:     24px  (fontSize: 16-20px)
正文:     21px  (fontSize: 14px)
小文本:   18px  (fontSize: 12px)
```

### 字母间距

```
默认: 0px
强调: 0.5px
```

---

## 间距系统

### 基础间距

```
4px   - 极小间距
8px   - 小间距 (标签间、列表项间)
12px  - 中等间距 (字段间、组件内)
16px  - 标准间距 (页面边距、卡片内)
20px  - 大间距
24px  - 超大间距 (section间)
28px  - 节点间距 (预览页)
```

### 页面布局

```
页面水平边距:     paddingHorizontal: 16px
内容垂直间距:     paddingVertical: 12-20px
卡片内边距:       padding: 16-24px
section 间隙:     gap: 24px
```

### Gap 使用

```
gap: 4px    // 紧凑元素 (logo与文字)
gap: 8px    // 标签间、列表项
gap: 10px   // 输入框内元素
gap: 12px   // 组件间、按钮与文字
gap: 16px   // 卡片间、福利项
gap: 24px   // section 间、主要区块
```

---

## 圆角规范

```
borderRadius: 999px  // 药丸形 (浮动按钮、导航按钮)
borderRadius: 16px   // 大圆角 (卡片、底部弹窗)
borderRadius: 12px   // 中圆角 (输入框、侧板)
borderRadius: 8px    // 小圆角 (logo、普通输入)
borderRadius: 6px    // 极小圆角 (图标容器)
borderRadius: 4px    // 标签圆角
borderRadius: 2px    // 指示符
```

---

## 阴影规范

### 卡片阴影

```javascript
shadowColor: 'rgba(0, 0, 0, 1)',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.07,
shadowRadius: 4,
elevation: 2  // Android
```

---

## 组件样式

### 卡片 (Card)

```javascript
{
  backgroundColor: 'rgba(255, 255, 255, 1)',
  borderRadius: 16,
  paddingHorizontal: 16,
  paddingVertical: 24,
  shadowColor: 'rgba(0, 0, 0, 1)',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 2
}
```

### 底部浮动按钮 (Float Button)

```javascript
{
  backgroundColor: 'rgba(58, 60, 60, 1)',
  borderRadius: 999,
  paddingHorizontal: 40,
  paddingVertical: 14
}
// 文字: color: 'rgba(209, 255, 240, 1)', fontSize: 16, fontWeight: 600
```

### 输入框 (Input)

```javascript
{
  backgroundColor: 'rgba(244, 244, 244, 1)',
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 10
}
// 占位符: color: 'rgba(187, 193, 201, 1)'
```

### 标签 (Tag)

```javascript
// 默认状态
{
  backgroundColor: 'rgba(241, 242, 244, 1)',
  borderRadius: 4,
  paddingHorizontal: 12,
  paddingVertical: 4
}
// 文字: color: 'rgba(0, 0, 0, 1)', fontSize: 12

// 选中状态
{
  backgroundColor: 'rgba(235, 250, 245, 1)',
  borderWidth: 1,
  borderColor: 'rgba(111, 205, 174, 1)'
}
// 文字: color: 'rgba(0, 139, 104, 1)', fontWeight: 500
```

### 导航按钮 (Navigation Button)

```javascript
{
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 99,
  borderWidth: 1,
  borderColor: 'rgba(111, 205, 174, 1)',
  flexDirection: 'row',
  gap: 12
}
// 文字: color: 'rgba(111, 205, 174, 1)', fontSize: 12
```

### 分隔线 (Divider)

```javascript
{
  borderBottomWidth: 1,
  borderColor: 'rgba(244, 244, 244, 1)'
}
// 或 0.5px 用于更细的线
```

### 左侧指示条 (Left Indicator)

```javascript
{
  position: 'absolute',
  left: 0,
  width: 3,
  backgroundColor: 'rgba(2, 168, 126, 1)'
}
```

### 底部弹窗 (Bottom Sheet)

```javascript
{
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 1)'
}
// 遮罩: backgroundColor: 'rgba(0, 0, 0, 0.5)'
```

---

## 使用指南

### 1. 创建新页面时

- 页面背景使用 `rgba(251, 251, 251, 1)`
- 内容区域使用 `paddingHorizontal: 16`
- 卡片间使用 `gap: 8` 或 `gap: 12`

### 2. 创建表单时

- 字段标题: fontSize 14, 次级文本色
- 字段值: fontSize 16, 主文本色
- 输入框: F4F4F4 背景, 12px 圆角
- 字段间距: marginBottom 12

### 3. 创建列表时

- 列表项高度约 56px
- 项间使用 gap: 8
- 分隔线使用 1px 或 0.5px

### 4. 颜色使用原则

- 主操作使用主题绿色
- 次级操作使用灰色系
- 成功/选中状态使用浅绿背景
- 警告/错误可使用红色（待定义）
