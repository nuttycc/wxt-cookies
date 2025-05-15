# 请帮我重构 Vue 组件代码，严格按照以下顺序规则

请分析我的 Vue 3 组件代码（使用 Composition API 和 `<script setup>` 语法），并**仅重新排序代码**，不要修改任何实际功能或逻辑。请严格按照以下顺序规则重新组织代码：

## 代码组织顺序规则（从上到下）

1. **导入语句（Imports）**
   - 将所有导入语句放在最顶部
   - 按以下分组并在每组内按字母顺序排序：
     - Vue 核心 API（如 ref, computed, onMounted）
     - 第三方库
     - 项目内部模块（使用 @ 或相对路径）
   - 分组之间用空行分隔

2. **类型定义（Types/Interfaces）**
   - 所有 TypeScript 类型/接口定义
   - 每个类型添加 JSDoc 注释说明用途

3. **Props 和 Emits 定义**
   - defineProps（优先使用 withDefaults 设置默认值）
   - defineEmits
   - defineExpose（如果有）

4. **响应式变量（Refs/Reactive）**
   - 所有使用 ref/reactive/shallowRef 等创建的响应式变量
   - 按功能分组，添加注释说明用途

5. **计算属性（Computed）**
   - 所有 computed 属性
   - 按功能分组，核心计算逻辑优先

6. **普通变量和常量**
   - 非响应式的变量/常量（如 autoCloseTimer、iconMap）
   - 按功能分组

7. **函数/方法**
   - 所有函数定义
   - 按调用顺序或逻辑相关性组织，核心功能优先
   - 事件处理函数使用 handle 前缀

8. **侦听器（Watchers）**
   - 所有 watch/watchEffect
   - 按监听的变量顺序排列，添加注释说明触发场景

9. **生命周期钩子**
   - 按生命周期顺序：onBeforeMount、onMounted、onBeforeUpdate、onUpdated、onBeforeUnmount、onUnmounted 等
   - 每个钩子添加注释说明用途

10. **其他高级特性**
    - provide/inject
    - 自定义指令
    - 插槽处理逻辑

请保持代码的完整性和功能不变，仅调整代码顺序以符合上述规则。