import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import { initTheme } from '@/utils/theme';

const app = createApp(App);

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error caught:', error);
  router.push({
    path: '/error',
    query: { message: error instanceof Error ? error.message : 'An unknown error occurred' },
  });
};


app.use(router);


initTheme().then(() => {
  app.mount('#app');
})


