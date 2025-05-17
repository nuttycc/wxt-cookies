import { createLogger } from '@/utils/logger';
import { shallowRef } from 'vue';
import type { ToastType } from '../entrypoints/popup/components/common/CustomToast.vue';
const log = createLogger('useToast');

const TOAST_MANAGER_NOT_INITIALIZED = 'Toast manager not initialized';

interface ToastManager {
  success: (message: string, duration?: number) => number;
  error: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
  warning: (message: string, duration?: number) => number;
  addToast: (message: string, type?: ToastType, duration?: number, closable?: boolean) => number;
  removeToast: (id: number) => void;
}

// 单例模式，确保全局只有一个 Toast 管理器
const toastManagerRef = shallowRef<ToastManager | null>(null);

/**
 * 设置 Toast 管理器实例
 * 在应用初始化时调用一次
 */
export function setToastManager(manager: ToastManager): void {
  toastManagerRef.value = manager;
}

/**
 * Toast 服务组合函数
 * 在应用的任何地方使用 Toast 通知
 */
export function useToast() {
  /**
   * 显示通知的通用方法
   * @param type 通知类型
   * @param message 消息内容
   * @param duration 显示时长（毫秒）
   * @returns Toast ID
   */
  const showToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration: number,
  ): number => {
    if (toastManagerRef.value) {
      return toastManagerRef.value[type](message, duration);
    }
    log.warn(TOAST_MANAGER_NOT_INITIALIZED);
    return -1;
  };

  /**
   * 显示成功通知
   * @param message 消息内容
   * @param duration 显示时长（毫秒），默认 3000ms
   * @returns Toast ID
   */
  const success = (message: string, duration: number = 3000): number => {
    return showToast('success', message, duration);
  };

  /**
   * 显示错误通知
   * @param message 消息内容
   * @param duration 显示时长（毫秒），默认 5000ms
   * @returns Toast ID
   */
  const error = (message: string, duration: number = 5000): number => {
    return showToast('error', message, duration);
  };

  /**
   * 显示信息通知
   * @param message 消息内容
   * @param duration 显示时长（毫秒），默认 3000ms
   * @returns Toast ID
   */
  const info = (message: string, duration: number = 3000): number => {
    return showToast('info', message, duration);
  };

  /**
   * 显示警告通知
   * @param message 消息内容
   * @param duration 显示时长（毫秒），默认 4000ms
   * @returns Toast ID
   */
  const warning = (message: string, duration: number = 4000): number => {
    return showToast('warning', message, duration);
  };

  /**
   * 关闭指定 ID 的通知
   * @param id Toast ID
   */
  const close = (id: number): void => {
    if (toastManagerRef.value) {
      toastManagerRef.value.removeToast(id);
    }
  };

  return {
    success,
    error,
    info,
    warning,
    close,
  };
}
