<script setup lang="ts">
import GlobalNavBar from "@/components/GlobalNavBar.vue";
</script>

<template>
  <div class="p-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 w-[320px] min-h-[250px]">
    <GlobalNavBar />
    <div class="mt-2">
      <RouterView />
    </div>
  </div>
</template>
