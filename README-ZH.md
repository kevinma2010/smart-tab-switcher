# Smart Tab Switcher

Smart Tab Switcher 是一个强大的浏览器扩展，通过直观的界面和快捷的搜索功能，帮助用户高效管理和切换浏览器标签页。

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

你可以从浏览器的应用商店安装 Smart Tab Switcher：

<div align="center">

[![Chrome 应用商店](https://img.shields.io/chrome-web-store/v/smart-tab-switcher?label=Chrome&style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/jjjkdlhleiedpjijkfofahkjfoehamok)
[![Firefox 附加组件](https://img.shields.io/amo/v/smart-tab-switcher?label=Firefox&style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/firefox/addon/smart-tab-switcher)
[![Edge 外接程序](https://img.shields.io/badge/Edge-v1.0.0-blue?style=for-the-badge&logo=microsoft-edge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/smart-tab-switcher)

</div>

或手动安装：
1. 从 [GitHub Releases](https://github.com/kevinma2010/smart-tab-switcher/releases) 下载最新版本
2. 根据不同浏览器按以下步骤安装：
   - Chrome/Edge:
     * 打开扩展程序页面
     * 开启开发者模式
     * 点击"加载已解压的扩展程序"
     * 选择解压后的文件夹
   - Firefox:
     * 访问 `about:debugging`
     * 点击"此 Firefox"
     * 点击"临时载入附加组件"
     * 选择解压后文件夹中的 `manifest.json`

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

- Node.js (v18+)
- pnpm (v8+)
- 浏览器 (Chrome v88+ / Firefox v109.0+ / Edge v88+)

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/kevinma2010/smart-tab-switcher.git
   cd smart-tab-switcher
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **开发模式**
   ```bash
   pnpm dev
   ```

4. **在浏览器中加载**
   - Chrome/Edge:
     * 访问 `chrome://extensions` 或 `edge://extensions`
     * 开启"开发者模式"
     * 点击"加载已解压的扩展程序"
     * 选择 `dist/chrome` 目录
   - Firefox:
     * 访问 `about:debugging`
     * 点击 "This Firefox"
     * 点击 "Load Temporary Add-on"
     * 选择 `dist/firefox` 目录中的 `manifest.json`

### 构建发布版本

```bash
pnpm build
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

本项目采用 GNU 通用公共许可证 v3.0 授权 - 查看 [LICENSE](./LICENSE) 文件了解详情。

GPLv3 许可证意味着：
- ✅ 你可以查看和修改源代码
- ✅ 你可以重新分发代码
- ✅ 衍生作品必须使用相同的许可证
- ✅ 衍生作品必须开放源代码
- ❌ 不能在专有/闭源项目中使用
- ❌ 不能修改许可条款

详细信息请查看完整的[许可证文本](./LICENSE)。

## 📞 支持与反馈

- [GitHub Issues](https://github.com/kevinma2010/smart-tab-switcher/issues)

## 🔄 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。