import { useAsyncState } from '@vueuse/core';
import { ref, watchEffect } from 'vue';
import { browser } from 'wxt/browser';

export function useCookiePermission() {
  const currentTab = ref<globalThis.Browser.tabs.Tab | null>(null);
  const permissionStatus = ref<boolean>(false);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  // 获取当前活动标签页信息
  const { state: tabState, isReady: isTabReady } = useAsyncState(
    async () => {
      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tabs || tabs.length === 0 || !tabs[0].url) {
          throw new Error('无法获取当前标签页信息');
        }
        return tabs[0];
      } catch (err) {
        error.value = err instanceof Error ? err : new Error(String(err));
        return null;
      }
    },
    null,
    { immediate: true },
  );

  // 当标签页信息就绪后，检查权限状态
  const {
    state: hasPermission,
    isReady: isPermissionReady,
    execute: refreshPermissionStatus,
  } = useAsyncState(
    async () => {
      if (!tabState.value || !tabState.value.url) {
        return false;
      }
      try {
        return await browser.permissions.contains({ origins: [`${tabState.value.url}/*`] });
      } catch (err) {
        error.value = err instanceof Error ? err : new Error(String(err));
        return false;
      }
    },
    false,
    { immediate: false },
  );

  // 使用watchEffect监听tabState变化，触发权限检查
  watchEffect(() => {
    currentTab.value = tabState.value;
    if (isTabReady.value && tabState.value) {
      refreshPermissionStatus();
    }
  });

  // 使用watchEffect监听权限状态变化，更新permissionStatus
  watchEffect(() => {
    permissionStatus.value = hasPermission.value;
  });

  // 权限请求和移除函数
  const togglePermission = async () => {
    if (!currentTab.value || !currentTab.value.url) {
      throw new Error('无法获取当前标签页信息');
    }

    try {
      if (permissionStatus.value) {
        const res = await browser.permissions.remove({ origins: [`${currentTab.value.url}/*`] });
        if (!res) {
          throw new Error('权限移除失败');
        }
        permissionStatus.value = false;
      } else {
        const res = await browser.permissions.request({ origins: [`${currentTab.value.url}/*`] });
        if (!res) {
          throw new Error('权限请求失败');
        }
        permissionStatus.value = true;
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    }
  };

  return {
    currentTab,
    hasPermission: permissionStatus,
    error,
    togglePermission,
  };
}
