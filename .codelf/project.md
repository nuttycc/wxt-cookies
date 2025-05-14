## WXT Cookies Manager

> 一个基于 WXT 和 Vue 3 开发的 Chrome 扩展程序，用于管理和查看网站 Cookies

> 该项目旨在提供一个简洁直观的界面，让用户能够方便地查看、管理当前网站的 Cookie 信息

> 开发中

> 个人项目

> 框架/语言：Vue 3 + TypeScript + WXT + Tailwind CSS

## Dependencies

- **UI 框架**: vue (^3.5.13), vue-router (^4.5.1)
- **状态管理**: pinia (^3.0.2)
- **工具库**: @vueuse/core (^13.1.0), loglevel (^1.9.2), loglevel-plugin-prefix (^0.8.4)
- **样式**: tailwindcss (^4.1.6)
- **扩展开发**: wxt (^0.20.6), @webext-core/messaging (^2.2.0)

## Development Environment

- **环境要求**: Node.js, pnpm 10.10.0+, WXT CLI
- **开发命令**:
  - `pnpm dev` - 启动开发服务器 (Chrome)
  - `pnpm build` - 构建生产版本
  - `pnpm format` - 格式化代码
  - `pnpm lint` - 检查并修复代码问题

## Structure

```
root
├── .cursor                  # Cursor 编辑器配置目录
├── .env                     # 环境变量配置文件
├── .gitignore, .husky, .oxlintrc.json, .prettierrc  # 代码质量和版本控制配置
├── eslint.config.js         # ESLint 配置
├── package.json, pnpm-lock.yaml, pnpm-workspace.yaml  # 包管理配置
├── public                   # 静态资源目录
│   ├── icon                 # 扩展图标目录 (16/32/48/96/128.png)
│   └── wxt.svg              # WXT 框架图标
├── README.md                # 项目说明文档
├── src                      # 源代码目录
│   ├── assets               # 资源文件 (CSS, SVG)
│   ├── components           # 通用组件
│   │   ├── GlobalNavBar.vue # 全局导航栏
│   │   └── HelloWorld.vue   # 示例组件
│   ├── composables          # 可复用的组合函数
│   │   ├── useClipboard.ts  # 剪贴板操作
│   │   ├── useCookiePermission.ts # Cookie 权限管理
│   │   └── useCookies.ts    # Cookie 操作
│   ├── entrypoints          # 扩展入口点
│   │   ├── background.ts    # 后台脚本
│   │   ├── popup            # 弹出窗口
│   │   │   ├── App.vue, index.html, main.ts, style.css
│   │   │   ├── pages        # 弹出窗口页面
│   │   │   │   ├── AboutPage.vue
│   │   │   │   ├── ErrorPage.vue
│   │   │   │   └── HomePage.vue  # Cookie 列表主页
│   │   │   └── router       # 路由配置
│   │   └── welcome          # 欢迎页面
│   │       ├── App.vue, index.html, main.ts
│   │       ├── pages        # 欢迎页面子页面
│   │       │   ├── WelcomeAbout.vue
│   │       │   ├── WelcomeChangelog.vue
│   │       │   └── WelcomeHome.vue
│   │       └── router       # 路由配置
│   └── utils                # 工具函数
│       ├── logger.ts        # 日志工具
│       ├── settings.ts      # 设置管理
│       └── theme.ts         # 主题管理
├── tsconfig.json            # TypeScript 配置
└── wxt.config.ts            # WXT 框架配置
```
