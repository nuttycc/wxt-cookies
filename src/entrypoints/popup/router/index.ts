import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/entrypoints/popup/pages/HomePage.vue'),
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/entrypoints/popup/pages/ErrorPage.vue'), 
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router; 