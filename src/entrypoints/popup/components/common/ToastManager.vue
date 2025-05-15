<script setup lang="ts">
import { ref } from 'vue';
import CustomToast, { type ToastType } from './CustomToast.vue';

/**
 * Toast 通知项
 */
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  closable: boolean;
}

// 通知列表
const toasts = ref<ToastItem[]>([]);
let nextId = 1;

/**
 * 添加一个通知
 */
const addToast = (
  message: string,
  type: ToastType = 'success',
  duration: number = 3000,
  closable: boolean = true,
) => {
  const id = nextId++;
  toasts.value.push({
    id,
    message,
    type,
    duration,
    closable,
  });
  return id;
};

/**
 * 移除指定 ID 的通知
 */
const removeToast = (id: number) => {
  const index = toasts.value.findIndex((toast) => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

/**
 * 快捷方法：添加成功通知
 */
const success = (message: string, duration: number = 3000) => {
  return addToast(message, 'success', duration);
};

/**
 * 快捷方法：添加错误通知
 */
const error = (message: string, duration: number = 5000) => {
  return addToast(message, 'error', duration);
};

/**
 * 快捷方法：添加信息通知
 */
const info = (message: string, duration: number = 3000) => {
  return addToast(message, 'info', duration);
};

/**
 * 快捷方法：添加警告通知
 */
const warning = (message: string, duration: number = 4000) => {
  return addToast(message, 'warning', duration);
};

// 暴露方法给父组件
defineExpose({
  addToast,
  removeToast,
  success,
  error,
  info,
  warning,
});
</script>

<template>
  <div class="toast-container">
    <CustomToast
      v-for="toast in toasts"
      :key="toast.id"
      :visible="true"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      :closable="toast.closable"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.toast-container > :deep(*) {
  pointer-events: auto;
  margin-top: 0.5rem;
}
</style>
