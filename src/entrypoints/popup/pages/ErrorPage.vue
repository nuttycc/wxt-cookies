<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const errorMessage = route.query.message || '未知错误';
</script>

<template>
  <div
    class="rounded-md border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
  >
    <h1 class="mb-2 text-lg font-semibold">发生错误</h1>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
/* 可以根据需要添加更多样式 */
</style>
