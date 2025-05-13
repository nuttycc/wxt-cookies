<script setup lang="ts">
import { browser } from 'wxt/browser';
import GlobalNavBar from '@/components/GlobalNavBar.vue';
import { sendMessage } from '@/utils/message';

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


async function sendMessageTest() {
  // const response = await browser.runtime.sendMessage({
  //   message: 'Hello from popup',
  // });

  const response = await sendMessage('getStringLength', 'Hello from popup');
  console.log(response);
}

</script>

<template>
  <div>
    <GlobalNavBar :navItems="navItems" />
    <button @click="sendMessageTest"> Send Message Test</button>
    <div class="mt-2">
      <RouterView />
    </div>
  </div>
</template>
