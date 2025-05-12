import { createRouter, createWebHashHistory } from 'vue-router';
import About from '../pages/About.vue';
import Changelog from '../pages/Changelog.vue';
import Home from '../pages/Home.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/changelog', component: Changelog },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
