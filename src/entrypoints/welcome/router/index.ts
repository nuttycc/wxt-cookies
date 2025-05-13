import { createRouter, createWebHashHistory } from 'vue-router';
import WelcomeAbout from '../pages/WelcomeAbout.vue';
import WelcomeChangelog from '../pages/WelcomeChangelog.vue';
import WelcomeHome from '../pages/WelcomeHome.vue';

const routes = [
  { path: '/', component: WelcomeHome },
  { path: '/about', component: WelcomeAbout },
  { path: '/changelog', component: WelcomeChangelog },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
