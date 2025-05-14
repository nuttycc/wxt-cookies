<script setup lang="ts">
import { useClipboard } from '@/composables/useClipboard';
import { ref, watch } from 'vue';

/**
 * @param value Cookie 值
 * @param isExpanded 是否展开
 * @emits expand 点击展开/收起
 */
const props = defineProps<{
  value: string;
  isExpanded: boolean;
}>();
const emit = defineEmits<{
  (e: 'expand', event: MouseEvent): void;
}>();

const { copyToClipboard, isCopied, selectAllText } = useClipboard();
const localCopied = ref(false);

// 监听全局复制状态，局部高亮
watch(isCopied, (val) => {
  if (val) {
    localCopied.value = true;
    setTimeout(() => (localCopied.value = false), 1500);
  }
});

function handleExpand(event: MouseEvent) {
  emit('expand', event);
}
function handleCopy(event: MouseEvent) {
  copyToClipboard(props.value, event);
}
function handleSelectAll(event: MouseEvent) {
  selectAllText(event);
}
</script>

<template>
  <div
    class="cookie-value-clickable flex w-full items-start rounded border border-gray-200 bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700"
    :class="{
      'items-center': !props.isExpanded,
      'cursor-pointer': !props.isExpanded,
      'cursor-text': props.isExpanded,
      'ring-2 ring-green-400': localCopied,
    }"
    @click="handleExpand"
  >
    <div
      class="flex-grow text-gray-800 dark:text-gray-200"
      :class="{
        'overflow-hidden text-ellipsis whitespace-nowrap': !props.isExpanded,
        'break-all select-all': props.isExpanded,
      }"
      @dblclick="handleSelectAll"
    >
      {{ props.value }}
    </div>
    <span
      class="ml-2 flex-shrink-0 cursor-pointer text-gray-500 dark:text-gray-400"
      @click.stop="handleCopy"
      :title="localCopied ? '已复制' : '复制'"
    >
      <span v-if="localCopied">✔️</span>
      <span v-else>📋</span>
    </span>
  </div>
</template>
