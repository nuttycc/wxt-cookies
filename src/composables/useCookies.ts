import { useAsyncState } from '@vueuse/core';
import { reactive, ref, Ref, watchEffect } from 'vue';
import { browser } from 'wxt/browser';

// 扩展Cookie类型，添加UI状态
export interface CookieWithDetailsState extends globalThis.Browser.cookies.Cookie {
  isDetailsOpen: boolean;
  isValueMasked: boolean;
  isValueExpanded: boolean;
}

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

      if (!currentTab || !currentTab.url || !currentPermission) {
        return [];
      }

      try {
        const _cookies = await browser.cookies.getAll({ url: currentTab.url });
        return _cookies.map(
          (cookie) =>
            reactive({
              ...cookie,
              isDetailsOpen: false,
              isValueMasked: true,
              isValueExpanded: false,
            }) as CookieWithDetailsState,
        );
      } catch (err) {
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

    if (currentTab && currentTab.url && currentPermission) {
      refreshCookies();
    }
  });

  // 监听cookiesData变化并更新cookies ref
  watchEffect(() => {
    cookies.value = cookiesData.value;
  });

  // Cookie交互方法
  const toggleDetails = (cookie: CookieWithDetailsState) => {
    cookie.isDetailsOpen = !cookie.isDetailsOpen;
  };

  const toggleValueMask = (cookie: CookieWithDetailsState) => {
    cookie.isValueMasked = !cookie.isValueMasked;
  };

  const toggleValueExpand = (cookie: CookieWithDetailsState, event: Event) => {
    // 阻止事件冒泡到document
    event.stopPropagation();

    // 如果已经展开，不做任何操作（不收缩）
    if (cookie.isValueExpanded) {
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
  };

  return {
    cookies,
    error,
    refreshCookies,
    toggleDetails,
    toggleValueMask,
    toggleValueExpand,
  };
}
