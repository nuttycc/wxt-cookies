<script setup lang="ts">
import GlobalNavBar from '@/components/GlobalNavBar.vue';

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
</script>

<template>
  <div>
    <GlobalNavBar :navItems="navItems" />
    <div class="mt-2">
      <RouterView />
    </div>
  </div>
</template>
