import { createLogger } from '@/utils/logger';
import { ref } from 'vue';
import { browser } from 'wxt/browser';

const log = createLogger('useCurrentTab');

/**
 * 获取当前活动标签页信息
 * @returns { currentTab, isLoading, error }
 */
export function useCurrentTab() {
  const currentTab = ref<globalThis.Browser.tabs.Tab | null>(null);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  async function fetchCurrentTab() {
    isLoading.value = true;
    try {
      log.debug('开始获取当前活动标签页信息');
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      log.debug('获取标签页信息结果', { tabs });
      if (!tabs || tabs.length === 0 || !tabs[0].url) {
        log.warn('未获取到活动标签页或URL，tabs:', tabs);
        throw new Error('无法获取当前标签页信息');
      }
      currentTab.value = tabs[0];
      error.value = null;
    } catch (err) {
      log.error('获取当前活动标签页信息失败', { error: err });
      error.value = err instanceof Error ? err : new Error(String(err));
      currentTab.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  // 初始化时立即获取
  fetchCurrentTab();

  return {
    currentTab,
    isLoading,
    error,
    refresh: fetchCurrentTab,
  };
}
