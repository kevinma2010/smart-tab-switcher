# Smart Tab Switcher - Technical Design Document

## 1. 项目概述

Smart Tab Switcher 是一个浏览器扩展，提供快速的标签页切换和管理功能。用户可以通过快捷键（Command+Shift+K）快速调出搜索界面，实时搜索并切换已打开的标签页或打开收藏的书签。

## 2. 核心功能

- 快捷键激活（Command+Shift+K）
- 实时搜索标签页和书签
- 支持模糊匹配搜索
- 键盘导航支持
- URL 智能识别
- Google 搜索集成

## 3. 技术栈

- Framework: React 18
- Language: TypeScript
- Build Tool: Webpack
- Styling: Tailwind CSS
- Search Library: Fuse.js
- Extension Framework: Firefox WebExtensions API (MV3)

## 4. 架构设计

### 4.1 目录结构
```
quick-tab-switcher/
├── src/
│   ├── background/
│   │   └── background.ts      # 后台脚本
│   ├── popup/
│   │   ├── components/        # React 组件
│   │   ├── hooks/            # 自定义 hooks
│   │   ├── utils/            # 工具函数
│   │   ├── popup.tsx         # 入口文件
│   │   └── popup.html        # HTML 模板
│   ├── icons/                # 图标资源
│   ├── manifest.chrome.json  # Chrome 配置文件
│   └── manifest.firefox.json # Firefox 配置文件
```

### 4.2 核心模块

#### 4.2.1 Background Script (background.ts)
- 处理快捷键事件
- 维护标签页缓存
- 管理扩展生命周期

#### 4.2.2 搜索逻辑 (hooks/useSearch.ts)
- 实时搜索功能
- 结果评分和排序
- 缓存管理

#### 4.2.3 键盘导航 (hooks/useKeyboard.ts)
- 处理方向键导航
- Enter 键选择
- Escape 键关闭

#### 4.2.4 标签页管理 (hooks/useTabs.ts)
- 标签页列表维护
- 标签页切换
- 新标签页创建

## 5. 数据结构

### 5.1 搜索结果类型
```typescript
interface SearchResult {
  id: string;
  type: 'tab' | 'bookmark' | 'google' | 'url';
  title: string;
  url: string;
  favicon?: string;
  score?: number;
}
```

### 5.2 标签页信息
```typescript
interface TabInfo {
  id: number;
  title: string;
  url: string;
  favicon?: string;
}
```

### 5.3 书签信息
```typescript
interface BookmarkInfo {
  id: string;
  title: string;
  url: string;
  dateAdded: number;
}
```

## 6. 关键流程

### 6.1 搜索流程
1. 用户输入触发搜索
2. 防抖处理（300ms）
3. 并行搜索标签页和书签
4. 结果评分和排序
5. 更新 UI 显示

### 6.2 标签页切换流程
1. 用户选择目标
2. 检查目标类型
3. 根据类型执行相应操作：
   - 标签页：切换到目标标签
   - 书签：新标签页打开
   - URL：新标签页打开
   - Google：搜索结果页面

## 7. 性能优化

### 7.1 搜索优化
- 使用 Fuse.js 进行模糊搜索
- 搜索结果缓存
- 输入防抖

### 7.2 渲染优化
- React.memo 组件缓存
- 虚拟列表渲染
- 图标懒加载

### 7.3 缓存策略
- 标签页信息缓存
- 书签数据缓存
- 搜索结果缓存

## 8. 配置说明

### 8.1 Firefox 特定配置
```json
{
  "browser_specific_settings": {
    "gecko": {
      "id": "smart-tab-switcher@kevinma2010.com",
      "strict_min_version": "109.0"
    }
  }
}
```

### 8.2 权限配置
- tabs: 标签页访问
- bookmarks: 书签访问
- scripting: 脚本执行

## 9. 开发指南

### 9.1 本地开发
```bash
pnpm install        # 安装依赖
pnpm dev           # 开发模式
pnpm build         # 生产构建
```

### 9.2 调试方法
1. about:debugging 页面加载
2. 查看 background 页面控制台
3. 检查 popup 页面元素

## 10. 待优化项目

1. 搜索算法优化
   - 添加历史记录权重
   - 优化匹配规则

2. UI 增强
   - 添加动画效果
   - 优化键盘导航体验

3. 性能提升
   - 优化缓存策略
   - 减少不必要的重渲染

4. 功能扩展
   - 支持标签页分组
   - 添加快捷命令功能

## 11. 注意事项

1. 权限使用
   - 最小权限原则
   - 按需申请权限

2. 性能考虑
   - 避免频繁 DOM 操作
   - 合理使用缓存

3. 兼容性
   - 支持 Firefox 109.0+
   - 遵循 MV3 规范

## 12. 分支与版本管理

### 12.1 分支策略
- `main`: 主分支，保持稳定可发布状态
- `develop`: 开发分支，用于功能集成
- `feature/*`: 功能分支，从 develop 分出
- `hotfix/*`: 紧急修复分支，从 main 分出

### 12.2 版本号规范
采用语义化版本: v主版本.次版本.修订号
- v1.0.0: 首个稳定版本
- v1.1.0: 新功能更新
- v1.1.1: 问题修复

### 12.3 发布流程
1. 在 develop 分支完成开发和测试
2. 更新版本号和 CHANGELOG.md
3. 合并到 main 分支并打标签
4. 发布新版本

### 12.4 提交规范
```bash
# 新功能
feat: 添加标签页分组功能

# 修复问题
fix: 修复搜索结果排序问题

# 文档更新
docs: 更新技术文档
```