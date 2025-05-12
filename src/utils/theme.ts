import { theme } from './settings';

export const initTheme = async () => {
  const userPrefers = await theme.getValue();
  const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  if (userPrefers === 'dark' || (!userPrefers && systemPrefers === 'dark')) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  console.debug('Theme initialized', userPrefers, systemPrefers);
};
