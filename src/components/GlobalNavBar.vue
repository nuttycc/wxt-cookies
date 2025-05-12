<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  navItems: {
    name: string;
    path: string;
  }[];
}>();

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
  <nav class="flex items-center justify-between py-4">
    <!-- 主页图标按钮，放在最左侧 -->
    <button
      @click="goHome"
      class="cursor-pointer text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
    >
      <!-- 使用应用图标 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-5 w-5"
      >
        <path
          d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"
        />
        <path
          d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"
        />
      </svg>
    </button>

    <!-- 导航项列表，放在右侧 -->
    <div class="flex flex-1 justify-end space-x-4">
      <!-- 非首页才显示返回按钮 -->
      <button
        v-if="!isHomePage"
        @click="goBack"
        class="text-sm text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
      >
        &lt; 返回
      </button>

      <!-- 导航项 -->
      <div class="flex space-x-4">
        <router-link
          v-for="item in props.navItems"
          :key="item.path"
          :to="item.path"
          active-class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
          exact-active-class="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          class="rounded px-3 py-1 text-sm text-gray-700 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Styles will be handled by Tailwind CSS */
</style>
