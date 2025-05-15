<script setup lang="ts">
import type { CookieWithDetailsState } from '@/composables/useCookies';
import { computed, ref } from 'vue';

/**
 * @param cookie 要编辑的Cookie对象
 * @emits save 保存编辑的Cookie
 * @emits cancel 取消编辑
 */
const props = defineProps<{
  cookie: CookieWithDetailsState;
}>();

const emit = defineEmits<{
  (e: 'save', updatedData: Partial<globalThis.Browser.cookies.Cookie>): void;
  (e: 'cancel'): void;
}>();

// 创建可编辑的字段
// 注意：Cookie名称是不可编辑的
// 使用浅拷贝防止直接修改原始数据
const formData = ref({
  value: props.cookie.value,
  domain: props.cookie.domain,
  path: props.cookie.path,
  secure: props.cookie.secure,
  httpOnly: props.cookie.httpOnly,
  sameSite: props.cookie.sameSite,
  expirationDate: props.cookie.expirationDate,
});

// 当有到期时间时，转换为本地时间格式供编辑
const expirationDateFormatted = computed(() => {
  if (!formData.value.expirationDate) return '';
  const date = new Date(formData.value.expirationDate * 1000);
  // 将日期格式化为 HTML datetime-local 输入框可用的格式
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
});

// 当用户修改到期日期时转换为 Unix 时间戳
const updateExpirationDate = (dateTimeStr: string) => {
  if (!dateTimeStr) {
    formData.value.expirationDate = undefined;
    return;
  }

  const date = new Date(dateTimeStr);
  formData.value.expirationDate = Math.floor(date.getTime() / 1000);
};

// 保存编辑的 Cookie 数据
const handleSave = () => {
  emit('save', formData.value);
};

// 取消编辑
const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="space-y-3 text-sm">
    <!-- 只读的 Cookie 名称字段 -->
    <div class="flex items-center">
      <label class="w-24 font-medium text-gray-700 dark:text-gray-300">名称:</label>
      <span class="font-mono text-gray-700 dark:text-gray-300">{{ props.cookie.name }}</span>
    </div>

    <!-- Cookie 值 -->
    <div class="flex flex-col">
      <label class="mb-1 font-medium text-gray-700 dark:text-gray-300">值:</label>
      <textarea
        v-model="formData.value"
        rows="3"
        class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-blue-400"
      ></textarea>
    </div>

    <!-- 域名 -->
    <div class="flex flex-col">
      <label class="mb-1 font-medium text-gray-700 dark:text-gray-300">域名:</label>
      <input
        type="text"
        v-model="formData.domain"
        class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-blue-400"
      />
    </div>

    <!-- 路径 -->
    <div class="flex flex-col">
      <label class="mb-1 font-medium text-gray-700 dark:text-gray-300">路径:</label>
      <input
        type="text"
        v-model="formData.path"
        class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-blue-400"
      />
    </div>

    <!-- 到期时间 -->
    <div class="flex flex-col" v-if="formData.expirationDate !== undefined">
      <label class="mb-1 font-medium text-gray-700 dark:text-gray-300">到期时间:</label>
      <input
        type="datetime-local"
        :value="expirationDateFormatted"
        @input="(e) => updateExpirationDate((e.target as HTMLInputElement).value)"
        class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-blue-400"
      />
    </div>

    <!-- 复选框选项 -->
    <div class="space-y-2">
      <div class="flex items-center">
        <input
          type="checkbox"
          id="secure"
          v-model="formData.secure"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label for="secure" class="ml-2 text-gray-700 dark:text-gray-300">安全 (Secure)</label>
      </div>

      <div class="flex items-center">
        <input
          type="checkbox"
          id="httpOnly"
          v-model="formData.httpOnly"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label for="httpOnly" class="ml-2 text-gray-700 dark:text-gray-300">HttpOnly</label>
      </div>
    </div>

    <!-- SameSite 选项 -->
    <div class="flex flex-col" v-if="formData.sameSite !== undefined">
      <label class="mb-1 font-medium text-gray-700 dark:text-gray-300">SameSite:</label>
      <select
        v-model="formData.sameSite"
        class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-blue-400"
      >
        <option value="no_restriction">No Restriction</option>
        <option value="lax">Lax</option>
        <option value="strict">Strict</option>
      </select>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-4 flex justify-end space-x-3">
      <button
        @click="handleCancel"
        class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        取消
      </button>
      <button
        @click="handleSave"
        class="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        保存
      </button>
    </div>
  </div>
</template>
