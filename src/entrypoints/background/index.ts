import { storage } from '#imports';
import { browser } from 'wxt/browser';

export default defineBackground({
  async main() {
    // Executed when background is loaded, CANNOT BE ASYNC
    browser.tabs.onActivated.addListener(async ({ tabId }) => {
      console.debug('onActivated', tabId);
      browser.action.setBadgeText({ text: 'O', tabId });

      const value = await storage.getItem<number>('local:installDate');
      console.debug('value', value);

      if (!value) {
        await storage.setItem('local:installDate', Date.now());
      }
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        console.debug('onUpdated', tabId, changeInfo);
        browser.action.setBadgeText({ text: 'OK', tabId });
      }
    });
  },
});
