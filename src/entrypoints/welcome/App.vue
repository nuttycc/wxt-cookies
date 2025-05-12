<template>
  <div class="min-h-screen bg-slate-50 p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
    <div class="mx-auto w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl dark:bg-slate-800">
      <nav class="mb-8">
        <router-link to="/" class="mr-4 text-sky-600 hover:underline dark:text-sky-400"
          >Home</router-link
        >
        <router-link to="/about" class="mr-4 text-sky-600 hover:underline dark:text-sky-400"
          >About</router-link
        >
        <router-link to="/changelog" class="text-sky-600 hover:underline dark:text-sky-400"
          >Changelog</router-link
        >
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
