<script setup lang="ts">
// 1. Imports
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

// 2. Types/Interfaces
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// 3. Props and Emits Definition
/**
 * @param visible 是否显示通知
 * @param message 通知消息内容
 * @param type 通知类型：success, error, info, warning
 * @param duration 自动关闭时间（毫秒），默认 3000ms
 * @param closable 是否显示关闭按钮，默认 true
 * @emits close 关闭通知
 */
const props = withDefaults(
  defineProps<{
    visible: boolean;
    message: string;
    type?: ToastType;
    duration?: number;
    closable?: boolean;
  }>(),
  {
    type: 'success',
    duration: 3000,
    closable: true,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 4. Reactive Variables (Refs/Reactive)
const isVisible = ref(props.visible);

// 5. Computed Properties
// 根据类型计算样式
const toastClasses = computed(() => {
  const baseClasses =
    'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-md shadow-lg p-4 flex items-center justify-between min-w-[300px] max-w-[90%] transition-all duration-300';

  const typeClasses = {
    success:
      'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800',
    error:
      'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800',
    info: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800',
    warning:
      'bg-yellow-100 text-yellow-800 border text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800',
  };

  return `${baseClasses} ${typeClasses[props.type]}`;
});

// 6. Ordinary Variables and Constants
// 自动关闭计时器
let autoCloseTimer: number | null = null;

// 图标
const iconMap = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

// 7. Functions/Methods
// 开始自动关闭计时器
const startAutoCloseTimer = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
  }

  if (props.duration > 0) {
    autoCloseTimer = window.setTimeout(() => {
      handleClose();
    }, props.duration);
  }
};

// 处理关闭事件
const handleClose = () => {
  isVisible.value = false;
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
  emit('close');
};

// 8. Watchers
// 监听 visible 属性变化，控制通知显示和启动计时器
watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
    if (newValue && props.duration > 0) {
      startAutoCloseTimer();
    }
  },
);

// 9. Lifecycle Hooks
// 组件挂载时，如果默认显示，则启动自动关闭计时器
onMounted(() => {
  if (props.visible && props.duration > 0) {
    startAutoCloseTimer();
  }
});

// 组件卸载时，清除自动关闭计时器
onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
});
</script>

<template>
  <Transition name="toast">
    <div v-if="isVisible" :class="toastClasses">
      <div class="flex items-center">
        <span class="mr-2">{{ iconMap[props.type] }}</span>
        <span>{{ props.message }}</span>
      </div>
      <button
        v-if="props.closable"
        @click="handleClose"
        class="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="关闭"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
