import { defineConfig } from 'wxt';
import { browserslistToTargets } from 'lightningcss';
import tailwindcss from '@tailwindcss/vite'
import browserslist from 'browserslist';
import pkg from './package.json';

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
    define: {
      __APP_NAME__: JSON.stringify(pkg.name),
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
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
