import { storage } from '#imports';
import { browser } from 'wxt/browser';

export default defineBackground({
  main() {
    // Executed when background is loaded, CANNOT BE ASYNC
    browser.tabs.onActivated.addListener(async ({ tabId }) => {
      browser.action.setBadgeText({ text: 'ON', tabId });

      const value = await storage.getItem<number>('local:installDate');

      if (!value) {
        await storage.setItem('local:installDate', Date.now());
      }
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        browser.action.setBadgeText({ text: 'UP', tabId });
      }
    });

    // lifetime
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason === browser.runtime.OnInstalledReason.INSTALL) {
        // browser.tabs.create({ url: "welcome.html" });
      } else if (details.reason === browser.runtime.OnInstalledReason.UPDATE) {
        // browser.tabs.create({ url: "welcome.html#/changelog" });
      }
    });
  },
});
