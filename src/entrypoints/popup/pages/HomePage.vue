<script lang="ts" setup>
import { browser } from 'wxt/browser';
import { ref, onMounted, reactive, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// Define a type that extends the Browser.cookies.Cookie type
interface CookieWithDetailsState extends globalThis.Browser.cookies.Cookie {
  isDetailsOpen?: boolean; // Add optional isDetailsOpen property
  isValueMasked?: boolean; // Add optional isValueMasked property
  isValueExpanded?: boolean; // Add property to track if value is expanded
}

const cookies = ref<CookieWithDetailsState[]>([]);
const tab = ref<globalThis.Browser.tabs.Tab | null>(null);
const hasGranted = ref(false);

const router = useRouter();

onMounted(async () => {
  tab.value = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
  if (!tab.value || !tab.value.url) {
    throw new Error('无法获取当前标签页信息');
  }

  hasGranted.value = await browser.permissions.contains({ origins: [`${tab.value.url}/*`] });

  const _cookies = await browser.cookies.getAll({ url: tab.value.url });
  // Add isDetailsOpen and isValueMasked property to each cookie and make the array reactive
  cookies.value = _cookies.map(cookie => reactive({
    ...cookie, 
    isDetailsOpen: false, 
    isValueMasked: true,
    isValueExpanded: false
  }));
  
  // 添加全局点击事件监听器
  document.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  // 移除全局点击事件监听器
  document.removeEventListener('click', handleGlobalClick);
});

// 处理全局点击事件，点击其他区域时收起所有expanded的value
const handleGlobalClick = (event: MouseEvent) => {
  // 如果点击的不是value区域或它的子元素，收起所有展开的value
  const target = event.target as HTMLElement;
  if (!target.closest('.cookie-value-clickable')) {
    cookies.value.forEach(cookie => {
      cookie.isValueExpanded = false;
    });
  }
};

// 展开/收起value值
function toggleValueExpand(cookie: CookieWithDetailsState, event: Event) {
  // 阻止事件冒泡到document
  event.stopPropagation();
  
  // 如果已经展开，不做任何操作（不收缩）
  if (cookie.isValueExpanded) {
    return;
  }
  
  // 关闭其他所有展开的cookie value
  cookies.value.forEach(c => {
    if (c !== cookie) {
      c.isValueExpanded = false;
    }
  });
  
  // 仅当未展开时才设置为展开
  cookie.isValueExpanded = true;
}

async function handlePermission() {
  if (!tab.value || !tab.value.url) {
    throw new Error('无法获取当前标签页信息');
  }

  if (hasGranted.value) {
    const res = await browser.permissions.remove({ origins: [`${tab.value.url}/*`] });
    if (!res) {
      throw new Error('权限移除失败');
    }
    hasGranted.value = false;
  } else {
    const res = await browser.permissions.request({ origins: [`${tab.value.url}/*`] });
    if (!res) {
      throw new Error('权限请求失败');
    }
    hasGranted.value = true;
  }
}

function toggleDetails(cookie: CookieWithDetailsState) {
  cookie.isDetailsOpen = !cookie.isDetailsOpen;
}

function toggleValueMask(cookie: CookieWithDetailsState) {
  cookie.isValueMasked = !cookie.isValueMasked;
}

async function copyToClipboard(text: string, event: Event) {
  // 阻止事件冒泡，防止触发value展开
  event.stopPropagation();
  
  try {
    await navigator.clipboard.writeText(text);
    console.log('Cookie value copied to clipboard!');
    // Optionally, add a visual feedback here
  } catch (err) {
    console.error('Failed to copy cookie value: ', err);
    // Optionally, add error feedback here
  }
}

// 帮助选择全部文本内容
function selectAllText(event: Event) {
  const target = event.target as HTMLElement;
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(target);
  selection?.removeAllRanges();
  selection?.addRange(range);
}
</script>

<template>
  <div>
    <!-- 优化标题和 URL 信息部分的布局 -->
    <div class="flex flex-col space-y-2 mb-3">
      <h1 class="text-xl font-bold">Cookie List</h1>
      
      <!-- 紧凑化的 URL 和权限按钮 -->
      <div class="flex items-center justify-between text-xs">
        <div v-if="tab" class="text-gray-600 dark:text-gray-400 max-w-[70%] truncate">
          <span class="font-mono">{{ tab.url }}</span>
        </div>
        <button
          @click="handlePermission"
          class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {{ hasGranted ? '移除权限' : '请求权限' }}
        </button>
      </div>
    </div>

    <div v-if="hasGranted" class="space-y-3">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <span>Cookies</span>
        <span class="text-sm text-gray-600 dark:text-gray-400">({{ cookies.length }})</span>
      </h2>
      <div class="space-y-3">
        <div
          v-for="cookie in cookies"
          :key="cookie.name + cookie.domain + cookie.path"
          class="p-3 transition-colors duration-150 text-sm border rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <!-- Header: Icon, Name, Edit Icon -->
          <div class="flex items-center justify-between pb-2">
            <div class="flex items-center gap-2">
              <span>🍪</span>
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ cookie.name }}</span>
            </div>
            <span class="text-gray-500 dark:text-gray-400 cursor-pointer">✏️</span>
          </div>

          <!-- Separator 1 -->
          <div class="border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Value Row (Two-column layout with inline expand) -->
          <div class="my-2">
            <div
              class="cookie-value-clickable bg-gray-100 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 flex items-start w-full"
              :class="{
                'items-center': !cookie.isValueExpanded,
                'cursor-pointer': !cookie.isValueExpanded,
                'cursor-text': cookie.isValueExpanded
              }"
              @click="toggleValueExpand(cookie, $event)"
            >
              <!-- Value Content -->
              <div
                class="flex-grow text-gray-800 dark:text-gray-200"
                :class="{
                  'overflow-hidden text-ellipsis whitespace-nowrap': !cookie.isValueExpanded,
                  'break-all select-all': cookie.isValueExpanded
                }"
                @dblclick="selectAllText($event)"
              >
                {{ cookie.value }}
              </div>

              <!-- Copy Button -->
              <span class="flex-shrink-0 text-gray-500 dark:text-gray-400 cursor-pointer ml-2" @click="copyToClipboard(cookie.value, $event)">📋</span>
            </div>
          </div>

          <!-- Toggle Details -->
          <div class="flex items-center gap-1 cursor-pointer mt-2" @click="toggleDetails(cookie)">
            <span class="text-gray-500 dark:text-gray-400">{{ cookie.isDetailsOpen ? '⬆️' : '⬇️' }}</span>
            <span class="text-gray-600 dark:text-gray-400">{{ cookie.isDetailsOpen ? '收起详细' : '展开详细' }}</span>
          </div>

          <!-- Separator 2 -->
          <div v-if="cookie.isDetailsOpen" class="border-t border-gray-200 dark:border-gray-700 mt-2"></div>

          <!-- Detailed Info -->
          <div v-show="cookie.isDetailsOpen" class="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
            <div>域名: <span class="font-mono break-all">{{ cookie.domain }}</span></div>
            <div>路径: <span class="font-mono break-all">{{ cookie.path }}</span></div>
            <div>
              Secure: <span class="font-mono">{{ cookie.secure ? '✅' : '❌' }}</span>
            </div>
            <div>
              HttpOnly: <span class="font-mono">{{ cookie.httpOnly ? '✅' : '❌' }}</span>
            </div>
            <div>
              Session: <span class="font-mono">{{ cookie.session ? '✅' : '❌' }}</span>
            </div>
            <div v-if="cookie.sameSite !== undefined">
              SameSite: <span class="font-mono">{{ cookie.sameSite }}</span>
            </div>
            <div v-if="cookie.expirationDate !== undefined">
              Expires: <span class="font-mono">{{ new Date(cookie.expirationDate * 1000).toLocaleString() }}</span>
            </div>
            <div v-if="cookie.partitionKey !== undefined">
              Partitioned: <span class="font-mono">{{ !!cookie.partitionKey ? '✅' : '❌' }}</span>
            </div>
            <!-- 可以根据需要添加更多属性 -->
          </div>
        </div>
      </div>
    </div>
    <div v-else class="p-4 text-center text-gray-600 dark:text-gray-400 border rounded-md border-gray-300 dark:border-gray-700">
      <p>请授予权限以查看 Cookies。</p>
    </div>
  </div>
</template>

<style scoped>
/* 让文本可选择 */
.select-all {
  user-select: all;
}
</style> 