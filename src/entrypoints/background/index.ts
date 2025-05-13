import { storage } from '#imports';
import { browser } from 'wxt/browser';
import log from '@/utils/logger';
import { onMessage } from '@/utils/message';

export default defineBackground({
  main() {

    // Executed when background is loaded, CANNOT BE ASYNC
    browser.tabs.onActivated.addListener(async ({ tabId }) => {
      // console.debug('onActivated', tabId);
      browser.action.setBadgeText({ text: 'O', tabId });

      const value = await storage.getItem<number>('local:installDate');
      // console.debug('value', value);

      if (!value) {
        await storage.setItem('local:installDate', Date.now());
      }

      // runtime
      const manifest = browser.runtime.getManifest();
      console.debug('manifest', manifest);
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        // console.debug('onUpdated', tabId, changeInfo);
        browser.action.setBadgeText({ text: 'OK', tabId });
      }
    });

    // lifetime
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason === browser.runtime.OnInstalledReason.INSTALL) {
        // 扩展安装
        // browser.tabs.create({ url: "welcome.html" });
      } else if (details.reason === browser.runtime.OnInstalledReason.UPDATE) {
        // 扩展更新
        // browser.tabs.create({ url: "welcome.html#/changelog" });
      }
    });


    // messages
    // browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   log.debug('onMessage', message, sender, sendResponse);
    //   sendResponse('Hello from background');
    // });


    onMessage('getStringLength', message => {
      log.debug('onMessage', message);
      return message.data.length;
    });

  },
});
