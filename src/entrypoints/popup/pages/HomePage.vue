<script lang="ts" setup>
import { useClipboard } from '@/composables/useClipboard';
import { useCookiePermission } from '@/composables/useCookiePermission';
import { useCookies, type CookieWithDetailsState } from '@/composables/useCookies';
import { onBeforeMount, onUnmounted, ref } from 'vue';
import CookieList from '../components/cookie/CookieList.vue';
import CookieListHeader from '../components/cookie/CookieListHeader.vue';
import DeleteConfirmDialog from '../components/cookie/DeleteConfirmDialog.vue';
import SuccessMessage from '../components/cookie/SuccessMessage.vue';

// 使用composables
const { currentTab, hasPermission, togglePermission } = useCookiePermission();

// 直接传递响应式引用
const { cookies, toggleDetails, toggleValueMask, toggleValueExpand, deleteCookie } = useCookies(
  currentTab,
  hasPermission,
);

const { copyToClipboard, selectAllText } = useClipboard();

// 删除确认相关状态
const showDeleteConfirm = ref(false);
const cookieToDelete = ref<CookieWithDetailsState | null>(null);
const showSuccessMessage = ref(false);

// 打开删除确认对话框
const openDeleteConfirm = (cookie: CookieWithDetailsState, event: MouseEvent) => {
  event.stopPropagation();
  cookieToDelete.value = cookie;
  showDeleteConfirm.value = true;
};

// 关闭删除确认对话框
const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  cookieToDelete.value = null;
};

// 确认删除Cookie
const confirmDelete = async () => {
  if (cookieToDelete.value) {
    const success = await deleteCookie(cookieToDelete.value);
    if (success) {
      showSuccessMessage.value = true;
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000); // 3秒后自动隐藏成功提示
    }
    closeDeleteConfirm();
  }
};

// 全局点击处理
const handleGlobalClick = (event: MouseEvent) => {
  // 如果点击的不是value区域或它的子元素，收起所有展开的value
  const target = event.target as HTMLElement;
  if (!target.closest('.cookie-value-clickable')) {
    cookies.value.forEach((cookie: CookieWithDetailsState) => {
      cookie.isValueExpanded = false;
    });
  }
};

// 名称展开/收起逻辑
function toggleNameExpand(cookie: CookieWithDetailsState, event: MouseEvent) {
  event.stopPropagation();
  // 如果已展开则收起
  if (cookie.isNameExpanded) {
    cookie.isNameExpanded = false;
    return;
  }
  // 关闭其他所有展开的 name
  cookies.value.forEach((c) => {
    if (c !== cookie) {
      c.isNameExpanded = false;
    }
  });
  cookie.isNameExpanded = true;
}

// 生命周期钩子
onBeforeMount(() => {
  document.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
});
</script>

<template>
  <div>
    ----
    <iconify-icon icon="mdi:home"></iconify-icon>
    ----
    <CookieListHeader
      :current-tab="currentTab"
      :has-permission="hasPermission"
      @toggle-permission="togglePermission"
    />
    <div v-if="currentTab && hasPermission" class="space-y-3">
      <h2 class="flex items-center gap-2 text-lg font-semibold">
        <span>Cookies</span>
        <span class="text-sm text-gray-600 dark:text-gray-400">({{ cookies.length }})</span>
      </h2>
      <CookieList
        :cookies="cookies"
        @delete="openDeleteConfirm"
        @toggle-details="toggleDetails"
        @toggle-value-expand="toggleValueExpand"
        @toggle-name-expand="toggleNameExpand"
      />
    </div>
    <div
      v-else-if="currentTab && !hasPermission"
      class="rounded-md border border-gray-300 p-4 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400"
    >
      <p>请授予权限以查看 Cookies。</p>
    </div>
    <DeleteConfirmDialog
      :visible="showDeleteConfirm"
      :cookie-name="cookieToDelete?.name"
      @confirm="confirmDelete"
      @cancel="closeDeleteConfirm"
    />
    <SuccessMessage :visible="showSuccessMessage" message="Cookie 删除成功" />
  </div>
</template>

<style scoped>
/* 让文本可选择 */
.select-all {
  user-select: all;
}
</style>
