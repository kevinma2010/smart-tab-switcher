# Quick Tab Switcher for Firefox

Quick Tab Switcher 是一个强大的 Firefox 扩展，通过直观的界面和快捷的搜索功能，帮助用户高效管理和切换浏览器标签页。

![Quick Tab Switcher Screenshot](./screenshots/demo.png)

## ✨ 主要特性

- 🚀 快速启动：使用快捷键 `Command+Shift+K` (Mac) 或 `Alt+T` (Windows/Linux) 快速调出
- 🔍 实时搜索：即时搜索已打开的标签页和书签
- ⌨️ 全键盘操作：完整的键盘导航支持
- 🎯 智能匹配：支持模糊搜索，快速定位目标页面
- 🔖 书签集成：搜索结果包含书签，一键打开常用网站
- 🌐 网址识别：智能识别并直接打开输入的 URL
- 🔄 Google 搜索：无匹配结果时可直接进行 Google 搜索

## 📖 用户指南

### 安装

1. 访问 Firefox Add-ons 商店
2. 搜索 "Quick Tab Switcher"
3. 点击 "添加到 Firefox"

### 使用方法

1. **启动搜索**
   - Mac: 按下 `Command+Shift+K`
   - Windows/Linux: 按下 `Alt+T`
   - 或点击工具栏中的扩展图标

2. **搜索和导航**
   - 输入关键词搜索标签页和书签
   - 使用 ↑↓ 键在结果中导航
   - 按 Enter 打开选中项
   - 按 Esc 关闭搜索界面

3. **搜索结果类型**
   - 📑 标签页：直接切换到对应标签
   - 🔖 书签：在新标签页中打开
   - 🌐 URL：识别到网址时直接打开
   - 🔍 Google：未找到匹配时可搜索

## 💻 开发者指南

### 环境要求

- Node.js (v14+)
- npm (v6+)
- Firefox 浏览器 (v109.0+)

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/quick-tab-switcher.git
   cd quick-tab-switcher
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **开发模式**
   ```bash
   npm run dev
   ```

4. **在 Firefox 中加载**
   - 访问 `about:debugging`
   - 点击 "This Firefox"
   - 点击 "Load Temporary Add-on"
   - 选择 `dist` 目录中的 `manifest.json`

### 构建发布版本

```bash
npm run build
```

构建后的文件将位于 `dist` 目录。

### 项目结构

```
src/
├── background/        # 后台脚本
├── popup/            # 弹出界面
│   ├── components/   # React 组件
│   ├── hooks/        # 自定义 Hooks
│   └── utils/        # 工具函数
├── icons/            # 图标资源
└── manifest.json     # 扩展配置
```

### 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Fuse.js
- Firefox WebExtensions API (MV3)

### 开发指南

详细的技术文档和开发指南请参考 [DEVELOPER.md](./DEVELOPER.md)

## 🤝 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码改进

请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何参与项目开发。

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 📞 支持与反馈

- 提交 Issue: [GitHub Issues](https://github.com/yourusername/quick-tab-switcher/issues)
- 联系邮箱: support@example.com

## 🔄 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。