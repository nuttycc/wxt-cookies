import { createLogger } from '@/utils/logger';
import { getPermissionOrigins } from '@/utils/permissionOrigins';
import { computed } from 'vue';
import { useCurrentTab } from './useCurrentTab';
import { usePermissionStatus } from './usePermissionStatus';

const log = createLogger('useCookiePermission');

/**
 * 高阶组合：聚合当前标签页和权限状态
 */
export function useCookiePermission() {
  const { currentTab, isLoading, error: tabError, refresh: refreshTab } = useCurrentTab();
  const origins = computed(() =>
    currentTab.value?.url ? getPermissionOrigins(currentTab.value.url) : [],
  );
  const {
    hasPermission,
    togglePermission,
    error: permError,
    refresh: refreshPerm,
  } = usePermissionStatus(() => origins.value);

  // 日志：标签页和权限变化
  log.debug('useCookiePermission 初始化', { currentTab, origins });

  return {
    currentTab,
    hasPermission,
    togglePermission,
    error: computed(() => tabError.value || permError.value),
    isLoading,
    refreshTab,
    refreshPerm,
  };
}
