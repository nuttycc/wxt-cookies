// utils/settings.ts
import { storage } from '#imports';

// 定义一个布尔型设置项，带默认值
export const darkMode = storage.defineItem<boolean>('local:darkMode', {
  fallback: false,
  version: 1,
});

// 你可以继续定义更多设置项
export const showChangelogOnUpdate = storage.defineItem<boolean>('local:showChangelogOnUpdate', {
  fallback: true,
});
