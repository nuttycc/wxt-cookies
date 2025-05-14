<script setup lang="ts">
import type { CookieWithDetailsState } from '@/composables/useCookies';
import CookieItem from './CookieItem.vue';

/**
 * @param cookies Cookie 列表
 * @emits delete 删除 Cookie
 * @emits toggle-details 展开/收起详细
 * @emits toggle-value-expand 展开/收起值
 * @emits toggle-name-expand 展开/收起名称
 */
const props = defineProps<{
  cookies: CookieWithDetailsState[];
}>();
const emit = defineEmits<{
  (e: 'delete', cookie: CookieWithDetailsState, event: MouseEvent): void;
  (e: 'toggle-details', cookie: CookieWithDetailsState): void;
  (e: 'toggle-value-expand', cookie: CookieWithDetailsState, event: MouseEvent): void;
  (e: 'toggle-name-expand', cookie: CookieWithDetailsState, event: MouseEvent): void;
}>();
</script>

<template>
  <div>
    <div
      v-if="props.cookies.length === 0"
      class="rounded-md border border-gray-200 bg-white p-4 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
    >
      <p>该网站没有可用的 Cookie。</p>
    </div>
    <div v-else class="space-y-3">
      <CookieItem
        v-for="cookie in props.cookies"
        :key="cookie.name + cookie.domain + cookie.path"
        :cookie="cookie"
        @delete="(cookie, event) => emit('delete', cookie, event)"
        @toggle-details="(cookie) => emit('toggle-details', cookie)"
        @toggle-value-expand="(cookie, event) => emit('toggle-value-expand', cookie, event)"
        @toggle-name-expand="(cookie, event) => emit('toggle-name-expand', cookie, event)"
      />
    </div>
  </div>
</template>
