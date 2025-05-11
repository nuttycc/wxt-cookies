import { defineConfig } from 'wxt';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite'
import browserslist from 'browserslist';
import {browserslistToTargets} from 'lightningcss';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: ['storage'],
  },
  webExt: {
    disabled: true,
    chromiumProfile: resolve('.wxt/chrome-data'),
    keepProfileChanges: true,
    startUrls: ['https://duckduckgo.com/'],
    openConsole: true,
    openDevtools: true
  },
  vite: () =>( {
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
