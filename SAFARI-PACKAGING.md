# Safari 扩展打包指南

Safari Web 扩展与 Chrome 和 Firefox 扩展有所不同，它需要包含在一个原生 macOS/iOS 应用中。以下是将 Smart Tab Switcher 打包为 Safari 扩展的步骤。

## 前提条件

- macOS 11.0 或更高版本
- Xcode 12.0 或更高版本
- Apple 开发者账号（如果要在 App Store 上发布）

## 步骤 1: 构建 Web 扩展

首先，构建 Safari 版本的 Web 扩展：

```bash
npm run build:safari
```

这将在 `dist/safari` 目录中生成 Safari 兼容的扩展文件。

## 步骤 2: 创建 Xcode 项目

1. 打开 Xcode
2. 选择 "File" > "New" > "Project..."
3. 选择 "Safari Extension App" 模板
4. 填写项目信息：
   - Product Name: Smart Tab Switcher
   - Organization Identifier: 您的组织标识符（例如 com.yourcompany）
   - 确保选中 "Include Safari Extension"
5. 点击 "Next" 并选择保存位置

## 步骤 3: 配置 Safari Web 扩展

1. 在 Xcode 项目中，删除自动生成的扩展资源
2. 将 `dist/safari` 目录中的所有文件复制到 Xcode 项目的扩展目录中
3. 确保所有文件都已添加到 Xcode 项目中，并且包含在扩展的目标中

## 步骤 4: 配置应用图标和元数据

1. 在 Xcode 中，选择主应用目标
2. 配置应用图标（可以使用 `src/icons` 中的图标）
3. 更新应用信息，如版本号、描述等

## 步骤 5: 测试扩展

1. 在 Xcode 中选择 "Product" > "Run"
2. 这将构建并运行应用
3. 在 Safari 中，打开 "偏好设置" > "扩展"
4. 启用 Smart Tab Switcher 扩展

## 步骤 6: 打包和分发

### 通过 App Store 分发

1. 在 Xcode 中，选择 "Product" > "Archive"
2. 在 Organizer 窗口中，选择您的归档文件
3. 点击 "Distribute App"
4. 按照向导完成上传到 App Store Connect

### 开发者分发

1. 在 Xcode 中，选择 "Product" > "Archive"
2. 在 Organizer 窗口中，选择您的归档文件
3. 点击 "Distribute App"
4. 选择 "Developer ID" 分发选项
5. 按照向导完成创建签名的应用

## 注意事项

- Safari Web 扩展需要通过 App Store 或开发者签名分发，不能像 Chrome 或 Firefox 扩展那样直接安装
- 确保您的扩展符合 [Apple 的审核指南](https://developer.apple.com/app-store/review/guidelines/)
- 如果您的扩展使用了某些 API，可能需要在 Info.plist 中添加相应的权限说明

## 相关资源

- [Safari Web 扩展开发指南](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
- [Safari Web 扩展 JavaScript API](https://developer.apple.com/documentation/safariservices/safari_web_extensions/safari_web_extension_javascript_apis)
- [App Store 审核指南](https://developer.apple.com/app-store/review/guidelines/) 