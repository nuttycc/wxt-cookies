import { defineConfig } from 'wxt';
import { browserslistToTargets } from 'lightningcss';
import tailwindcss from '@tailwindcss/vite'
import browserslist from 'browserslist';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: ['storage', 'cookies', 'activeTab'],
    host_permissions: ['*://*.chrome.com/*'],
    optional_host_permissions: ['*://*/*']
  },
  webExt: {
    disabled: true,
  },
  vite: () => ({
    plugins: [
      tailwindcss(),
    ],
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(browserslist('>= 0.25%'))
      }
    },
    build: {
      cssMinify: 'lightningcss'
    }
  })
});
