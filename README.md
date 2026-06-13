# Font Studio

一款基于 Electron、Vue 3 和 TypeScript 构建的 Windows 字体管理应用程序。

## 功能特性

- **字体扫描** - 自动扫描并列出 Windows 用户字体目录中已安装的字体
- **字体安装** - 通过文件对话框导入并安装 TTF、OTF、WOFF、WOFF2、TTC 格式的字体
- **字体卸载** - 单个卸载或按字体族批量卸载非系统字体
- **字体搜索** - 按名称或字体族快速搜索字体
- **字体筛选** - 按全部/已安装/最近安装进行筛选
- **字体预览** - 预览字体显示效果，支持自定义预览文本
- **字体统计** - 显示字体总数、已安装数量和近期安装数量

## 技术栈

- **Electron** - 桌面应用框架
- **Vue 3** - 前端 UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **electron-vite** - 构建工具
- **opentype.js** - 字体文件解析

## 开发环境

### IDE 推荐

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### 安装依赖

```bash
pnpm install
```

### 开发运行

```bash
pnpm dev
```

### 构建应用

```bash
# Windows
pnpm build:win

# macOS
pnpm build:mac

# Linux
pnpm build:linux
```

### 代码检查

```bash
# ESLint 检查
pnpm lint

# TypeScript 类型检查
pnpm typecheck

# 代码格式化
pnpm format
```

## 项目结构

```
font-studio/
├── src/
│   ├── main/           # Electron 主进程
│   │   ├── index.ts    # 主进程入口
│   │   └── fontManager.ts  # 字体管理核心逻辑
│   ├── preload/        # 预加载脚本
│   └── renderer/       # Vue 3 渲染进程
│       └── src/
│           ├── components/  # Vue 组件
│           ├── composables/ # 组合式函数
│           └── types/       # TypeScript 类型定义
```

## 系统要求

- Windows 10/11
- Node.js 18+
- pnpm

## 许可证

MIT
