<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const errorMessage = route.query.message || '未知错误';
</script>

<template>
  <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-700 dark:text-red-300">
    <h1 class="text-lg font-semibold mb-2">发生错误</h1>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
/* 可以根据需要添加更多样式 */
</style> 