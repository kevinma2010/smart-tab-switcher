# Enter 键行为设计 - 用户告知计划

## 背景
根据 Issue #11，计划更改 Enter 键的默认行为：
- **当前行为**：Enter 在新标签页打开书签/搜索结果
- **新行为**：Enter 在当前标签页打开，Ctrl+Enter（Mac 上 Cmd+Enter）在新标签页打开

## 用户告知位置和实施计划

### 1. 搜索框底部提示（最高优先级）
**位置**：`src/popup/components/search-box.tsx:90-100`

**当前显示**：
```
↑↓ Navigate    Enter Select    Esc Close
```

**建议更新为**：
```
↑↓ Navigate    Enter Open    Ctrl+Enter New Tab    Esc Close
```

**实施细节**：
- 在较窄的窗口中可以简化为：`Enter Open · Ctrl+Enter New`
- 使用图标辅助：`⏎ Open · ⌘⏎ New Tab`（Mac）或 `⏎ Open · Ctrl+⏎ New Tab`（Windows/Linux）

### 2. 设置页面选项
**位置**：`src/popup/components/settings-view.tsx`

**新增设置项**：
```typescript
// 默认打开方式
□ 经典模式：Enter 键总是在新标签页打开
■ 标准模式：Enter 在当前标签页，Ctrl+Enter 在新标签页（推荐）
```

**实施细节**：
- 默认选中"标准模式"
- 添加说明文字解释两种模式的区别
- 设置会立即生效，无需重启

### 3. 新用户引导更新
**位置**：`src/popup/components/onboarding-view.tsx:115`

**当前文字**：
```
Use up and down arrow keys to select a tab, press Enter to switch to the selected tab
```

**更新为**：
```
快捷键使用：
• ↑↓ - 上下选择结果
• Enter - 在当前标签页打开
• Ctrl+Enter (Mac 上 Cmd+Enter) - 在新标签页打开
• Esc - 关闭搜索
```

### 4. 搜索无结果时的提示
**位置**：`src/popup/components/result-list.tsx:106`

**当前提示**：
```
Press Enter to search Google or open URL
```

**更新为**：
```
Press Enter to search in current tab
Press Ctrl+Enter to search in new tab
```

### 5. 版本更新通知
**实施方案**：
- 在扩展更新到包含此功能的版本时，显示一次性通知
- 使用 `browser.storage.local` 记录是否已显示过通知

**通知内容**：
```
🎉 新功能：更灵活的标签页控制！

现在你可以选择如何打开链接：
• Enter - 在当前标签页打开
• Ctrl+Enter - 在新标签页打开

可以在设置中切换回经典模式。
```

### 6. 视觉提示增强
**搜索结果项优化**：
- 鼠标悬停时，在结果项右侧显示快捷键提示
- 使用 tooltip 显示："Enter: 当前标签页 | Ctrl+Enter: 新标签页"

### 7. 文档更新清单
需要更新的文档：
- [ ] README.md - 更新快捷键说明部分
- [ ] Chrome Web Store 描述 - 在功能列表中说明
- [ ] Firefox Add-ons 描述 - 同步更新
- [ ] GitHub Release Notes - 详细说明行为变更

### 8. 迁移策略
为了平滑过渡：
1. **第一阶段**：添加 Ctrl+Enter 支持，保持 Enter 原有行为
2. **第二阶段**：在设置中提供切换选项，默认仍为旧行为
3. **第三阶段**：新安装用户默认使用新行为，老用户保持原设置
4. **第四阶段**：提示老用户尝试新行为（可选）

## 实施优先级

1. **立即实施**：
   - 搜索框底部提示更新
   - 添加 Ctrl+Enter 功能支持

2. **下一版本**：
   - 设置页面选项
   - 更新通知
   - 文档更新

3. **后续优化**：
   - 视觉提示增强
   - 新手引导优化

## 成功指标

- 用户反馈中关于"不知道如何在新标签页打开"的问题减少
- Issue #11 得到解决
- 没有大量用户抱怨行为变更

## 风险管理

- **风险**：老用户不适应新行为
- **缓解**：提供设置选项，允许切换回经典模式

- **风险**：快捷键提示占用过多空间
- **缓解**：响应式设计，在小窗口中简化提示

---

*创建日期：2025-01-23*
*相关 Issue：#11*