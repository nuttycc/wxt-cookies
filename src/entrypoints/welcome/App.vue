<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 p-6">
    <div class="max-w-2xl w-full bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 mx-auto">
      <nav class="mb-8">
        <router-link to="/" class="mr-4 text-sky-600 dark:text-sky-400 hover:underline">Home</router-link>
        <router-link to="/about" class="mr-4 text-sky-600 dark:text-sky-400 hover:underline">About</router-link>
        <router-link to="/changelog" class="text-sky-600 dark:text-sky-400 hover:underline">Changelog</router-link>
      </nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
// App component using Vue Router
</script>

<style scoped>
/* Component specific styles */
</style> 