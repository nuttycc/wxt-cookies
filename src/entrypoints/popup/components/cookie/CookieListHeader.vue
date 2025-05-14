<script setup lang="ts">
/**
 * @param currentTab 当前激活的标签页信息
 * @param hasPermission 是否已授权 Cookie 权限
 * @emits toggle-permission 用户点击权限按钮
 */
const props = defineProps<{
  currentTab: globalThis.Browser.tabs.Tab | null;
  hasPermission: boolean;
}>();
const emit = defineEmits<{
  (e: 'toggle-permission'): void;
}>();
</script>

<template>
  <div class="mb-3 flex flex-col space-y-2">
    <h1 class="text-xl font-bold">Cookie List</h1>
    <div v-if="props.currentTab" class="flex items-center text-xs">
      <div class="w-[65%] truncate text-gray-600 dark:text-gray-400">
        <span class="font-mono">{{ props.currentTab.url }}</span>
      </div>
      <button
        @click="() => emit('toggle-permission')"
        class="ml-auto rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        {{ props.hasPermission ? '移除权限' : '请求权限' }}
      </button>
    </div>
  </div>
</template>
