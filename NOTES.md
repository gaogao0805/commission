# 开发注意事项

## 间距原则
- 用父容器的 `gap` 统一控制子元素间距，不要在子元素上额外加 `marginTop` / `marginBottom`
- 分割线（expDivider）本身不加 margin，间距由父容器 gap 控制
- 不要给同一个方向同时加 padding 和 margin（如 paddingTop + marginTop 叠加）

## 新简历状态逻辑
- 点击卡片 → 只标记 `newResumeRead: true`（红点消失），**不改** `hasNewResume`
- 切换 tab 或退出候选人管理页面 → 调用 `flushReadResumes()`，把 `hasNewResume: false`，tag 才变成"有简历"
- CandidateCard 里用 `if (c.hasNewResume)` 决定显示"新简历"，不是 `!newResumeRead`
- CandidateScreen / DecisionScreen 里不要在进入或离开详情页时自动清除 `hasNewResume`

## overflow: hidden 与阴影
- iOS 上 `overflow: 'hidden'` 会裁掉 `shadowColor` 投影，web 不受影响
- 需要投影的卡片不能加 `overflow: 'hidden'`
- 需要裁剪内容同时保留投影：把 padding 移到 ScrollView 的 `contentContainerStyle`，而不是放在卡片上

## 滑动手势
- 待处理滑动卡片只保留左右滑动（通过/拒绝）
- 下滑到待定的手势已移除，待定只能通过底部按钮触发

## 颜色规范
| 状态 | 底色 | 文字色 |
|------|------|--------|
| 新简历 | `#F2FAFF` | `#1690E1` |
| 有简历 | `#EBFAF5` | `#008B68` |
| 已请求简历 | `#FFFBF2` | `#E19D16` |
| 双方均已通过 | `#EBFAF5` | `#008B68` |
| 等待候选人确认 | `#FFFBF2` | `#E19D16` |
| 对方暂无意向 | `#DDE2E8` | `#7B838D` |
| 待定 | — | `#E19D16` |

## Push 规范
- 未经明确说明不要自动 push
- 用户说 "push" 才执行 git push
