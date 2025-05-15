<script setup lang="ts">
import GlobalNavBar from '@/components/GlobalNavBar.vue';
import { setToastManager } from '@/composables/useToast';
import { onMounted, ref } from 'vue';
import ToastManager from './components/common/ToastManager.vue';

const navItems = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'About',
    path: '/about',
  },
];

// 获取 Toast 管理器实例
const toastManagerRef = ref<InstanceType<typeof ToastManager> | null>(null);

// 在组件挂载后设置 Toast 管理器实例
onMounted(() => {
  if (toastManagerRef.value) {
    setToastManager(toastManagerRef.value);
  }
});
</script>

<template>
  <div>
    <GlobalNavBar :navItems="navItems" />
    <div class="mt-2">
      <RouterView />
    </div>
    <!-- Toast 管理器 -->
    <ToastManager ref="toastManagerRef" />
  </div>
</template>
