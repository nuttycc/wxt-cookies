<script setup lang="ts">
import type { CookieWithDetailsState } from '@/composables/useCookies';
import CookieDetails from './CookieDetails.vue';
import CookieValue from './CookieValue.vue';

/**
 * @param cookie 单个 Cookie 信息
 * @emits delete 删除 Cookie
 * @emits toggle-details 展开/收起详细
 * @emits toggle-value-expand 展开/收起值
 * @emits toggle-name-expand 展开/收起名称
 */
const props = defineProps<{
  cookie: CookieWithDetailsState;
}>();
const emit = defineEmits<{
  (e: 'delete', cookie: CookieWithDetailsState, event: MouseEvent): void;
  (e: 'toggle-details', cookie: CookieWithDetailsState): void;
  (e: 'toggle-value-expand', cookie: CookieWithDetailsState, event: MouseEvent): void;
  (e: 'toggle-name-expand', cookie: CookieWithDetailsState, event: MouseEvent): void;
}>();

function handleToggleNameExpand(event: MouseEvent) {
  emit('toggle-name-expand', props.cookie, event);
}
</script>

<template>
  <div
    class="rounded-md border border-gray-200 bg-white p-3 text-sm transition-colors duration-150 dark:border-gray-700 dark:bg-gray-800"
  >
    <!-- Header: Icon, Name, Edit Icon, Delete Icon -->
    <div class="flex items-center justify-between pb-2">
      <div class="flex items-center gap-2">
        <iconify-icon
          icon="la:cookie"
          class="h-6 w-6 cursor-pointer align-middle transition-all duration-200"
          :class="[
            props.cookie.isNameExpanded
              ? 'scale-110 -scale-x-100 text-yellow-500 drop-shadow-md dark:text-yellow-300'
              : 'text-gray-400 dark:text-yellow-100',
            !props.cookie.isNameExpanded &&
              'hover:scale-110 hover:text-yellow-500 dark:hover:text-yellow-300',
          ]"
          @click.stop="handleToggleNameExpand"
          title="展开/收起名称"
        />
        <span
          :class="[
            'font-semibold text-gray-800 dark:text-gray-200',
            props.cookie.isNameExpanded ? 'break-all select-all' : 'max-w-40 truncate',
          ]"
          >{{ props.cookie.name }}</span
        >
      </div>
      <div class="flex items-center gap-2">
        <span
          class="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >✏️</span
        >
        <span
          class="cursor-pointer text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          @click="(event) => emit('delete', props.cookie, event)"
          title="删除Cookie"
          >🗑️</span
        >
      </div>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-700"></div>
    <!-- Value Row -->
    <div class="my-2">
      <CookieValue
        :value="props.cookie.value"
        :is-expanded="props.cookie.isValueExpanded"
        @expand="(event) => emit('toggle-value-expand', props.cookie, event)"
      />
    </div>
    <!-- Toggle Details -->
    <div
      class="mt-2 flex cursor-pointer items-center gap-1"
      @click="() => emit('toggle-details', props.cookie)"
    >
      <span class="text-gray-500 dark:text-gray-400">{{
        props.cookie.isDetailsOpen ? '⬆️' : '⬇️'
      }}</span>
      <span class="text-gray-600 dark:text-gray-400">{{
        props.cookie.isDetailsOpen ? '收起详细' : '展开详细'
      }}</span>
    </div>
    <div
      v-if="props.cookie.isDetailsOpen"
      class="mt-2 border-t border-gray-200 dark:border-gray-700"
    ></div>
    <CookieDetails v-if="props.cookie.isDetailsOpen" :cookie="props.cookie" />
  </div>
</template>
