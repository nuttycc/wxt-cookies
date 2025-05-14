## 2024-08-10 20:30:15

### 1. Cookie 管理功能实现

**Change Type**: feature

> **Purpose**: 实现基本的 Cookie 查看和管理功能
> **Detailed Description**: 添加了弹出窗口中的 Cookie 列表界面，支持查看当前网站的所有 Cookie 信息，包括名称、值、域名、路径等详细信息，并支持展开/收起详细信息和复制 Cookie 值
> **Reason for Change**: 作为扩展的核心功能，需要提供直观的 Cookie 查看和管理界面
> **Impact Scope**: 主要影响弹出窗口和相关组合函数
> **API Changes**: 添加了一系列 Cookie 相关的组合函数和组件
> **Configuration Changes**: 添加了 cookies 权限到 manifest 配置
> **Performance Impact**: 每次弹出窗口打开时会查询当前活动标签页的 Cookie 数据，对性能影响较小

```
root
- src    // - 源代码目录
  - composables // - 可复用的组合函数目录
   - useClipboard.ts // add 剪贴板功能组合函数
   - useCookiePermission.ts // add Cookie 权限管理组合函数
   - useCookies.ts // add Cookie 数据处理组合函数
  - entrypoints
   - popup
    - pages
     - HomePage.vue // refact 实现 Cookie 列表界面
```

### 2. 主题切换功能实现

**Change Type**: feature

> **Purpose**: 支持亮色和暗色主题切换
> **Detailed Description**: 通过 Tailwind CSS 的暗色模式支持，实现了根据系统主题自动切换的功能，同时在界面中添加了主题切换按钮，允许用户手动切换
> **Reason for Change**: 提升用户体验，满足不同光线环境下的使用需求
> **Impact Scope**: 全局样式和主题相关组件
> **API Changes**: 添加了主题管理相关工具函数
> **Configuration Changes**: 无
> **Performance Impact**: 几乎无性能影响

```
root
- src    // - 源代码目录
  - utils // - 工具函数目录
   - theme.ts // add 主题管理工具
  - components
   - GlobalNavBar.vue // refact 添加主题切换按钮
```

## 2024-08-11

### 1. 权限管理相关组合函数重构

**Change Type**: refactor

> **Purpose**: 提高 Cookie 权限相关代码的可维护性、可测试性和复用性
> **Detailed Description**:
>
> - 将原 `useCookiePermission.ts` 中的标签页获取、权限状态管理、origin 生成等逻辑，分别拆分为 `useCurrentTab.ts`、`usePermissionStatus.ts`、`permissionOrigins.ts` 等独立模块。
> - `useCookiePermission.ts` 仅作为高阶组合，聚合上述模块，统一对外暴露 API。
> - 每个模块职责单一，便于单元测试和后续扩展。
>   **Reason for Change**: 原文件职责过于集中，难以维护和扩展。
>   **Impact Scope**: 影响所有依赖 Cookie 权限管理的功能和页面。
>   **API Changes**: 组合式函数 API 更加清晰，便于调用和测试。
>   **Configuration Changes**: 无
>   **Performance Impact**: 无明显性能影响

```
root
- src
  - composables
   - useCurrentTab.ts // add 当前标签页信息获取
   - usePermissionStatus.ts // add 权限状态管理
   - useCookiePermission.ts // refact 高阶组合
  - utils
   - permissionOrigins.ts // add 权限 origin 生成工具
```

...
