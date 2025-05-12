import log from '@/utils/logger';
import { initTheme } from '@/utils/theme';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  log.error('Global error caught:', error);
  router.push({
    path: '/error',
    query: { message: error instanceof Error ? error.message : 'An unknown error occurred' },
  });
};

app.use(router);

initTheme().then(() => {
  app.mount('#app');
});

log.debug('import.meta.env', import.meta.env);
