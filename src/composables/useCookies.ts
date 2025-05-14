import { createLogger } from '@/utils/logger';
import { useAsyncState } from '@vueuse/core';

import { reactive, ref, Ref, watchEffect } from 'vue';
import { browser } from 'wxt/browser';

// 扩展Cookie类型，添加UI状态
export interface CookieWithDetailsState extends globalThis.Browser.cookies.Cookie {
  isDetailsOpen: boolean;
  isValueMasked: boolean;
  isValueExpanded: boolean;
  /**
   * Cookie 名称是否展开显示
   */
  isNameExpanded: boolean;
}

const log = createLogger('useCookies');

/**
 * 获取并管理当前标签页 Cookie 列表，带 UI 状态和权限依赖
 */
export function useCookies(
  tab: globalThis.Browser.tabs.Tab | null | Ref<globalThis.Browser.tabs.Tab | null>,
  hasPermission: boolean | Ref<boolean>,
) {
  const cookies = ref<CookieWithDetailsState[]>([]);
  const error = ref<Error | null>(null);

  // 获取原始值，无论是否为ref
  const getTabValue = () => (tab && 'value' in tab ? tab.value : tab);
  const getPermissionValue = () =>
    hasPermission && typeof hasPermission === 'object' && 'value' in hasPermission
      ? hasPermission.value
      : hasPermission;

  // 异步获取Cookies
  const {
    state: cookiesData,
    isReady: isCookiesReady,
    execute: refreshCookies,
  } = useAsyncState(
    async () => {
      const currentTab = getTabValue();
      const currentPermission = getPermissionValue();
      log.debug('准备获取Cookies', { currentTab, currentPermission });

      if (!currentTab || !currentTab.url || !currentPermission) {
        log.warn('缺少tab或权限，无法获取Cookies', { currentTab, currentPermission });
        return [];
      }

      try {
        log.debug('调用 browser.cookies.getAll', { url: currentTab.url });
        const _cookies = await browser.cookies.getAll({ url: currentTab.url });
        log.info('获取Cookies成功', { count: _cookies.length });
        return _cookies.map(
          (cookie) =>
            reactive({
              ...cookie,
              isDetailsOpen: false,
              isValueMasked: true,
              isValueExpanded: false,
              isNameExpanded: false,
            }) as CookieWithDetailsState,
        );
      } catch (err) {
        log.error('获取Cookies失败', err);
        error.value = err instanceof Error ? err : new Error(String(err));
        return [];
      }
    },
    [],
    { immediate: false },
  );

  // 处理依赖更新并触发刷新
  watchEffect(() => {
    const currentTab = getTabValue();
    const currentPermission = getPermissionValue();
    log.debug('watchEffect: tab/permission 变化', { currentTab, currentPermission });
    if (currentTab && currentTab.url && currentPermission) {
      log.debug('依赖满足，刷新Cookies');
      refreshCookies();
    }
  });

  // 监听cookiesData变化并更新cookies ref
  watchEffect(() => {
    log.debug('cookiesData 变化', { cookiesData: cookiesData.value });
    cookies.value = cookiesData.value;
  });

  // Cookie交互方法
  const toggleDetails = (cookie: CookieWithDetailsState) => {
    log.debug('切换详情展开', { name: cookie.name, isDetailsOpen: !cookie.isDetailsOpen });
    cookie.isDetailsOpen = !cookie.isDetailsOpen;
  };

  const toggleValueMask = (cookie: CookieWithDetailsState) => {
    log.debug('切换值掩码', { name: cookie.name, isValueMasked: !cookie.isValueMasked });
    cookie.isValueMasked = !cookie.isValueMasked;
  };

  const toggleValueExpand = (cookie: CookieWithDetailsState, event: Event) => {
    log.debug('切换值展开', { name: cookie.name, isValueExpanded: !cookie.isValueExpanded });
    // 阻止事件冒泡到document
    event.stopPropagation();

    // 如果已经展开，不做任何操作（不收缩）
    if (cookie.isValueExpanded) {
      log.debug('已展开，无需处理', { name: cookie.name });
      return;
    }

    // 关闭其他所有展开的cookie value
    cookies.value.forEach((c) => {
      if (c !== cookie) {
        c.isValueExpanded = false;
      }
    });

    // 仅当未展开时才设置为展开
    cookie.isValueExpanded = true;
    log.debug('已设置为展开', { name: cookie.name });
  };

  // 删除Cookie的方法
  const deleteCookie = async (cookie: CookieWithDetailsState) => {
    const currentTab = getTabValue();
    if (!currentTab || !currentTab.url) return false;

    try {
      await browser.cookies.remove({
        url: currentTab.url,
        name: cookie.name,
        storeId: cookie.storeId,
      });
      // 删除成功后刷新Cookie列表
      await refreshCookies();
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      return false;
    }
  };

  return {
    cookies,
    error,
    refreshCookies,
    toggleDetails,
    toggleValueMask,
    toggleValueExpand,
    deleteCookie,
  };
}
