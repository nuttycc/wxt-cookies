<script setup lang='ts'>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

function goBack() {
  router.back();
}

function goHome() {
  router.push('/');
}

// 检查当前是否在首页
const isHomePage = computed(() => route.name === 'home');
</script>

<template>
  <nav class="flex justify-between items-center">
    <!-- 非首页才显示返回按钮 -->
    <button v-if="!isHomePage" @click="goBack" class="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 text-sm">
      &lt; 返回
    </button>
    <div v-else class="w-10"></div> <!-- 占位 -->
    
    <!-- 主页图标按钮，始终显示 -->
    <button @click="goHome" class="text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100">
      <!-- 使用应用图标 -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
    </button>
  </nav>
</template>

<style scoped>
/* Styles will be handled by Tailwind CSS */
</style> 