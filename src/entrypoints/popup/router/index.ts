import { createMemoryHistory, createRouter } from 'vue-router';

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
  {
    path: '/about',
    name: 'about',
    component: () => import('@/entrypoints/popup/pages/AboutPage.vue'),
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
