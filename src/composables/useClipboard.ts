import { ref } from 'vue';

export function useClipboard() {
  const isCopied = ref(false);
  const copyError = ref<Error | null>(null);

  // 复制到剪贴板并提供状态反馈
  const copyToClipboard = async (text: string, event?: Event) => {
    // 阻止事件冒泡（如果有事件）
    if (event) {
      event.stopPropagation();
    }

    try {
      await navigator.clipboard.writeText(text);
      isCopied.value = true;

      // 2秒后重置复制状态
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);

      return true;
    } catch (err) {
      copyError.value = err instanceof Error ? err : new Error(String(err));
      return false;
    }
  };

  // 帮助选择全部文本内容
  const selectAllText = (event: Event) => {
    const target = event.target as HTMLElement;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  return {
    isCopied,
    copyError,
    copyToClipboard,
    selectAllText,
  };
}
