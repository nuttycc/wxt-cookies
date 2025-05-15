<script setup lang="ts">
/**
 * @param visible 是否显示弹窗
 * @param cookieName 待编辑 Cookie 名称
 * @emits confirm 确认更新
 * @emits cancel 取消
 */
const props = defineProps<{
  visible: boolean;
  cookieName?: string;
}>();
const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <div
    v-if="props.visible"
    class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
  >
    <div class="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">确认更新</h3>
      <p class="mb-6 text-gray-700 dark:text-gray-300">
        您确定要更新这个 Cookie 吗?
        <span v-if="props.cookieName" class="font-semibold">{{ props.cookieName }}</span>
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="() => emit('cancel')"
          class="rounded bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          取消
        </button>
        <button
          @click="() => emit('confirm')"
          class="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          更新
        </button>
      </div>
    </div>
  </div>
</template>
