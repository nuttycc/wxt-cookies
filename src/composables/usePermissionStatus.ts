import { createLogger } from '@/utils/logger';
import { ref, watch } from 'vue';
import { browser } from 'wxt/browser';

const log = createLogger('usePermissionStatus');

/**
 * 管理指定 origins 的权限状态
 * @param origins 权限 origin 列表
 * @returns { hasPermission, togglePermission, error, refresh }
 */
export function usePermissionStatus(origins: () => string[]) {
  const hasPermission = ref(false);
  const error = ref<Error | null>(null);

  async function checkPermission() {
    try {
      if (!origins() || origins().length === 0) {
        hasPermission.value = false;
        return;
      }
      log.debug('检查权限', { origins: origins() });
      hasPermission.value = await browser.permissions.contains({ origins: origins() });
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      hasPermission.value = false;
    }
  }

  async function togglePermission() {
    try {
      if (!origins() || origins().length === 0) {
        throw new Error('无效的权限 origins');
      }
      if (hasPermission.value) {
        log.info('尝试移除权限', { origins: origins() });
        const res = await browser.permissions.remove({ origins: origins() });
        if (!res) throw new Error('权限移除失败');
        hasPermission.value = false;
      } else {
        log.info('尝试请求权限', { origins: origins() });
        const res = await browser.permissions.request({ origins: origins() });
        if (!res) throw new Error('权限请求失败');
        hasPermission.value = true;
      }
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    }
  }

  // origins 变化时自动检查权限
  watch(origins, checkPermission, { immediate: true });

  return {
    hasPermission,
    togglePermission,
    error,
    refresh: checkPermission,
  };
}
