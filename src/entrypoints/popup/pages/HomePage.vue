<script lang="ts" setup>
import { useClipboard } from '@/composables/useClipboard';
import { useCookiePermission } from '@/composables/useCookiePermission';
import { useCookies, type CookieWithDetailsState } from '@/composables/useCookies';
import { onBeforeMount, onUnmounted } from 'vue';

// 使用composables
const { currentTab, hasPermission, togglePermission } = useCookiePermission();

// 直接传递响应式引用
const { cookies, toggleDetails, toggleValueMask, toggleValueExpand } = useCookies(
  currentTab,
  hasPermission,
);

const { copyToClipboard, selectAllText } = useClipboard();

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
    <!-- 优化标题和 URL 信息部分的布局 -->
    <div class="mb-3 flex flex-col space-y-2">
      <h1 class="text-xl font-bold">Cookie List</h1>

      <!-- 紧凑化的 URL 和权限按钮 -->
      <div v-if="currentTab" class="flex items-center text-xs">
        <div class="w-[65%] truncate text-gray-600 dark:text-gray-400">
          <span class="font-mono">{{ currentTab.url }}</span>
        </div>
        <button
          @click="togglePermission"
          class="ml-auto rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {{ hasPermission ? '移除权限' : '请求权限' }}
        </button>
      </div>
    </div>

    <div v-if="currentTab && hasPermission" class="space-y-3">
      <h2 class="flex items-center gap-2 text-lg font-semibold">
        <span>Cookies</span>
        <span class="text-sm text-gray-600 dark:text-gray-400">({{ cookies.length }})</span>
      </h2>
      <div
        v-if="cookies.length === 0"
        class="rounded-md border border-gray-200 bg-white p-4 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        <p>该网站没有可用的 Cookie。</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="cookie in cookies"
          :key="cookie.name + cookie.domain + cookie.path"
          class="rounded-md border border-gray-200 bg-white p-3 text-sm transition-colors duration-150 dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Header: Icon, Name, Edit Icon -->
          <div class="flex items-center justify-between pb-2">
            <div class="flex items-center gap-2">
              <span>🍪</span>
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ cookie.name }}</span>
            </div>
            <span class="cursor-pointer text-gray-500 dark:text-gray-400">✏️</span>
          </div>

          <!-- Separator 1 -->
          <div class="border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Value Row (Two-column layout with inline expand) -->
          <div class="my-2">
            <div
              class="cookie-value-clickable flex w-full items-start rounded border border-gray-200 bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700"
              :class="{
                'items-center': !cookie.isValueExpanded,
                'cursor-pointer': !cookie.isValueExpanded,
                'cursor-text': cookie.isValueExpanded,
              }"
              @click="toggleValueExpand(cookie, $event)"
            >
              <!-- Value Content -->
              <div
                class="flex-grow text-gray-800 dark:text-gray-200"
                :class="{
                  'overflow-hidden text-ellipsis whitespace-nowrap': !cookie.isValueExpanded,
                  'break-all select-all': cookie.isValueExpanded,
                }"
                @dblclick="selectAllText($event)"
              >
                {{ cookie.value }}
              </div>

              <!-- Copy Button -->
              <span
                class="ml-2 flex-shrink-0 cursor-pointer text-gray-500 dark:text-gray-400"
                @click="copyToClipboard(cookie.value, $event)"
                >📋</span
              >
            </div>
          </div>

          <!-- Toggle Details -->
          <div class="mt-2 flex cursor-pointer items-center gap-1" @click="toggleDetails(cookie)">
            <span class="text-gray-500 dark:text-gray-400">{{
              cookie.isDetailsOpen ? '⬆️' : '⬇️'
            }}</span>
            <span class="text-gray-600 dark:text-gray-400">{{
              cookie.isDetailsOpen ? '收起详细' : '展开详细'
            }}</span>
          </div>

          <!-- Separator 2 -->
          <div
            v-if="cookie.isDetailsOpen"
            class="mt-2 border-t border-gray-200 dark:border-gray-700"
          ></div>

          <!-- Detailed Info -->
          <div
            v-show="cookie.isDetailsOpen"
            class="space-y-0.5 text-xs text-gray-600 dark:text-gray-400"
          >
            <div>
              域名: <span class="font-mono break-all">{{ cookie.domain }}</span>
            </div>
            <div>
              路径: <span class="font-mono break-all">{{ cookie.path }}</span>
            </div>
            <div>
              Secure: <span class="font-mono">{{ cookie.secure ? '✅' : '❌' }}</span>
            </div>
            <div>
              HttpOnly: <span class="font-mono">{{ cookie.httpOnly ? '✅' : '❌' }}</span>
            </div>
            <div>
              Session: <span class="font-mono">{{ cookie.session ? '✅' : '❌' }}</span>
            </div>
            <div v-if="cookie.sameSite !== undefined">
              SameSite: <span class="font-mono">{{ cookie.sameSite }}</span>
            </div>
            <div v-if="cookie.expirationDate !== undefined">
              Expires:
              <span class="font-mono">{{
                new Date(cookie.expirationDate * 1000).toLocaleString()
              }}</span>
            </div>
            <div v-if="cookie.partitionKey !== undefined">
              Partitioned: <span class="font-mono">{{ !!cookie.partitionKey ? '✅' : '❌' }}</span>
            </div>
            <!-- 可以根据需要添加更多属性 -->
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="currentTab && !hasPermission"
      class="rounded-md border border-gray-300 p-4 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400"
    >
      <p>请授予权限以查看 Cookies。</p>
    </div>
  </div>
</template>

<style scoped>
/* 让文本可选择 */
.select-all {
  user-select: all;
}
</style>
