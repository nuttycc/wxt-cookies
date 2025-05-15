<script setup lang="ts">
import type { CookieWithDetailsState } from '@/composables/useCookies';
import CookieItem from './CookieItem.vue';

/**
 * @param cookies Cookie u5217u8868
 * @emits delete u5220u9664 Cookie
 * @emits toggle-details u5c55u5f00/u6536u8d77u8be6u7ec6
 * @emits toggle-value-expand u5c55u5f00/u6536u8d77u503c
 * @emits toggle-name-expand u5c55u5f00/u6536u8d77u540du79f0
 * @emits edit u7f16u8f91 Cookie
 */
const props = defineProps<{
  cookies: CookieWithDetailsState[];
}>();
const emit = defineEmits<{
  (e: 'delete', cookie: CookieWithDetailsState, event: MouseEvent): void;
  (e: 'toggle-details', cookie: CookieWithDetailsState): void;
  (e: 'toggle-value-expand', cookie: CookieWithDetailsState, event: MouseEvent): void;
  (e: 'toggle-name-expand', cookie: CookieWithDetailsState, event: MouseEvent): void;
  (
    e: 'edit',
    cookie: CookieWithDetailsState,
    updatedData: Partial<globalThis.Browser.cookies.Cookie>,
  ): void;
}>();
</script>

<template>
  <div>
    <div
      v-if="props.cookies.length === 0"
      class="rounded-md border border-gray-200 bg-white p-4 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
    >
      <p>u8be5u7f51u7ad9u6ca1u6709u53efu7528u7684 Cookieu3002</p>
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
        @edit="(cookie, updatedData) => emit('edit', cookie, updatedData)"
      />
    </div>
  </div>
</template>
