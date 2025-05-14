## Development Guidelines

### Framework and Language

> 本项目基于 Vue 3、TypeScript 和 WXT 框架开发，针对 Chrome 扩展程序。

**Framework Considerations:**

- Version Compatibility: 所有依赖需兼容 Vue 3.5+ 和 WXT 0.20+ 的版本
- Feature Usage: 使用 Vue 3 Composition API 和 TypeScript 类型系统优化开发体验
- Performance Patterns: 遵循 Chrome 扩展最佳实践，避免不必要的后台任务和内存占用
- Upgrade Strategy: 定期更新 WXT 和其他依赖至最新稳定版本
- Importance Notes for Framework:
  - WXT 是一个专为浏览器扩展开发设计的框架，支持 Chrome、Firefox 等浏览器
  - 使用 Vue 3 Composition API 构建组件，确保代码更具可读性和可维护性
  - 严格使用 TypeScript 类型定义，避免运行时错误

**Language Best Practices:**

- Type Safety: 使用 TypeScript 强类型系统确保代码质量，包括为所有变量、函数参数和返回值定义类型
- Modern Features: 利用 ES6+ 特性和 Vue 3 的最新功能，同时保证兼容性
- Consistency: 在整个代码库中应用一致的编码模式和风格
- Documentation: 为复杂逻辑和关键功能添加清晰的注释和文档

### Code Abstraction and Reusability

> 项目遵循模块化设计原则，通过可复用的组件和组合函数（composables）提高代码质量和开发效率。

**Modular Design Principles:**

- Single Responsibility: 每个模块和组件只负责一个功能
- High Cohesion, Low Coupling: 相关功能集中在一起，减少模块间的依赖
- Stable Interfaces: 对外暴露稳定的接口，内部实现可以变化

**Reusable Component Library:**

```
src
├── components      // 可复用的 UI 组件
├── composables     // 可复用的组合函数
│   ├── useClipboard.ts      // 剪贴板功能
│   ├── useCookiePermission.ts // Cookie 权限管理
│   └── useCookies.ts        // Cookie 操作
└── utils           // 通用工具函数
    ├── logger.ts   // 日志工具
    ├── settings.ts // 设置管理
    └── theme.ts    // 主题管理
```

### Coding Standards and Tools

**Code Formatting Tools:**

- ESLint (v9.26.0) // JavaScript/TypeScript 代码检查
- Prettier (v3.5.3) // 代码格式化
- Oxlint (v0.16.10) // 快速 JavaScript/TypeScript 代码检查工具

**Naming and Structure Conventions:**

- Semantic Naming: 变量/函数名应清晰表达其用途，Boolean 标志使用 is/has 前缀
- Consistent Naming Style: 组件使用 PascalCase，函数和变量使用 camelCase
- 事件处理函数使用 handle 前缀（如 handleClick）
- 目录结构遵循功能职责划分

### Extension-specific Standards

**Chrome Extension Best Practices:**

- 权限最小化原则：仅请求必要的权限
- 性能优化：减少后台脚本的资源消耗
- 用户体验：提供简洁直观的界面和清晰的提示

**Data Flow:**

- 使用 Pinia 进行状态管理
- 使用 WXT 提供的 storage API 进行数据持久化
- 使用 Chrome cookies API 获取和管理 Cookie

### Performance and Security

**Performance Optimization Focus:**

- 按需加载：使用动态导入减小初始加载体积
- 组件懒加载：路由级别的代码分割
- 合理使用缓存：缓存不频繁变化的数据

**Security Measures:**

- 输入验证和过滤：验证用户输入并过滤数据
- 遵循内容安全策略 (CSP)：防止 XSS 攻击
- 权限控制：明确请求和使用权限的范围和时机
