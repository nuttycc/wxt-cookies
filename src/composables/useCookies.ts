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
    if (!currentTab || !currentTab.url) {
      error.value = new Error('无法获取当前标签页信息');
      return false;
    }

    try {
      log.debug('删除Cookie', { name: cookie.name, url: currentTab.url });
      await browser.cookies.remove({
        url: currentTab.url,
        name: cookie.name,
        storeId: cookie.storeId,
      });
      // 删除成功后刷新Cookie列表
      await refreshCookies();
      log.info('Cookie删除成功', { name: cookie.name });
      return true;
    } catch (err) {
      log.error('删除Cookie失败', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return false;
    }
  };

  // 更新Cookie的方法
  const updateCookie = async (
    cookie: CookieWithDetailsState,
    updatedData: Partial<globalThis.Browser.cookies.Cookie>,
  ) => {
    const currentTab = getTabValue();
    if (!currentTab || !currentTab.url) {
      error.value = new Error('无法获取当前标签页信息');
      return false;
    }

    try {
      log.debug('更新Cookie - 先删除旧Cookie', { name: cookie.name, url: currentTab.url });
      // 先删除旧的Cookie
      await browser.cookies.remove({
        url: currentTab.url,
        name: cookie.name,
        storeId: cookie.storeId,
      });

      /**
       * 创建带有更新值的新Cookie
       * 注意：虽然UI中允许编辑 domain 和 path，但在实际设置 cookie 时，
       * 我们不直接使用这些参数，而是仅使用 url 参数。
       * 这样可以避免浏览器自动在域名前添加点，导致创建重复的 cookie。
       *
       * 用户在UI中编辑的 domain 和 path 值会被保存在 updatedData 中，
       * 但在此处不传递给 browser.cookies.set() 方法。
       */
      log.debug('更新Cookie - 设置新Cookie', {
        name: cookie.name,
        value: updatedData.value ?? cookie.value,
        secure: updatedData.secure ?? cookie.secure,
        httpOnly: updatedData.httpOnly ?? cookie.httpOnly,
        sameSite: updatedData.sameSite ?? cookie.sameSite,
        expirationDate: updatedData.expirationDate ?? cookie.expirationDate,
      });

      await browser.cookies.set({
        url: currentTab.url,
        name: cookie.name,
        value: updatedData.value ?? cookie.value,
        // 不传递 domain 和 path 参数，让浏览器从 url 中提取这些信息
        secure: updatedData.secure ?? cookie.secure,
        httpOnly: updatedData.httpOnly ?? cookie.httpOnly,
        sameSite: updatedData.sameSite ?? cookie.sameSite,
        expirationDate: updatedData.expirationDate ?? cookie.expirationDate,
        storeId: cookie.storeId,
      });

      // 更新成功后刷新Cookie列表
      await refreshCookies();
      log.info('Cookie更新成功', { name: cookie.name });
      return true;
    } catch (err) {
      log.error('更新Cookie失败', err);
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
    updateCookie,
  };
}
