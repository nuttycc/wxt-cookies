<script lang="ts" setup>
import { useClipboard } from '@/composables/useClipboard';
import { useCookiePermission } from '@/composables/useCookiePermission';
import { useCookies, type CookieWithDetailsState } from '@/composables/useCookies';
import { useToast } from '@/composables/useToast';
import { onMounted, onUnmounted, ref } from 'vue';
import CookieList from '../components/cookie/CookieList.vue';
import CookieListHeader from '../components/cookie/CookieListHeader.vue';
import DeleteConfirmDialog from '../components/cookie/DeleteConfirmDialog.vue';
import EditConfirmDialog from '../components/cookie/EditConfirmDialog.vue';

// 使用composables
const { currentTab, hasPermission, togglePermission } = useCookiePermission();

// 直接传递响应式引用
const {
  cookies,
  error,
  toggleDetails,
  toggleValueMask,
  toggleValueExpand,
  deleteCookie,
  updateCookie,
  refreshCookies,
} = useCookies(currentTab, hasPermission);

const { copyToClipboard, selectAllText } = useClipboard();
const toast = useToast();

// 删除和编辑确认相关状态
const showDeleteConfirm = ref(false);
const showEditConfirm = ref(false);
const cookieToDelete = ref<CookieWithDetailsState | null>(null);
const cookieToEdit = ref<CookieWithDetailsState | null>(null);
const editedCookieData = ref<Partial<globalThis.Browser.cookies.Cookie> | null>(null);

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
    const cookieName = cookieToDelete.value.name;
    const success = await deleteCookie(cookieToDelete.value);

    if (success) {
      // 显示成功消息
      toast.success(`Cookie '${cookieName}' 已成功删除`);
    } else {
      // 显示错误消息
      const errorMsg = error.value ? error.value.message : '未知错误';
      toast.error(`删除 Cookie '${cookieName}' 失败：${errorMsg}`);
    }

    closeDeleteConfirm();
  }
};

// 打开编辑确认对话框
const openEditConfirm = (
  cookie: CookieWithDetailsState,
  updatedData: Partial<globalThis.Browser.cookies.Cookie>,
) => {
  cookieToEdit.value = cookie;
  editedCookieData.value = updatedData;
  showEditConfirm.value = true;
};

// 关闭编辑确认对话框
const closeEditConfirm = () => {
  showEditConfirm.value = false;
  cookieToEdit.value = null;
  editedCookieData.value = null;
};

// 确认编辑Cookie
const confirmEdit = async () => {
  if (cookieToEdit.value && editedCookieData.value) {
    const cookieName = cookieToEdit.value.name;
    // 使用组件顶部已初始化的 updateCookie 方法
    const success = await updateCookie(cookieToEdit.value, editedCookieData.value);

    if (success) {
      // 显示成功消息
      toast.success(`Cookie '${cookieName}' 已成功更新`);
    } else {
      // 显示错误消息
      const errorMsg = error.value ? error.value.message : '未知错误';
      toast.error(`更新 Cookie '${cookieName}' 失败：${errorMsg}`);
    }

    closeEditConfirm();
  }
};

// 全局点击处理
const handleGlobalClick = (event: MouseEvent) => {
  // 如果点击的不是value区域或它的子元素，收起所有展开的value
  const target = event.target as HTMLElement;
  if (!target.closest('.cookie-value-clickable')) {
    if (cookies.value.some((c) => c.isValueExpanded)) {
      cookies.value.forEach((c) => (c.isValueExpanded = false));
    }
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
onMounted(() => {
  document.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
});
</script>

<template>
  <div>
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
        @edit="openEditConfirm"
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
    <EditConfirmDialog
      :visible="showEditConfirm"
      :cookie-name="cookieToEdit?.name"
      @confirm="confirmEdit"
      @cancel="closeEditConfirm"
    />
  </div>
</template>

<style scoped>
/* 让文本可选择 */
.select-all {
  user-select: all;
}
</style>
