<script setup lang="ts">
import type { CookieWithDetailsState } from '@/composables/useCookies';

/**
 * @param cookie Cookie 详情对象
 */
const props = defineProps<{
  cookie: CookieWithDetailsState;
}>();
</script>

<template>
  <div class="space-y-0.5 text-xs text-gray-600 dark:text-gray-400">
    <div>
      域名: <span class="font-mono break-all">{{ props.cookie.domain }}</span>
    </div>
    <div>
      路径: <span class="font-mono break-all">{{ props.cookie.path }}</span>
    </div>
    <div>
      Secure: <span class="font-mono">{{ props.cookie.secure ? '✅' : '❌' }}</span>
    </div>
    <div>
      HttpOnly: <span class="font-mono">{{ props.cookie.httpOnly ? '✅' : '❌' }}</span>
    </div>
    <div>
      Session: <span class="font-mono">{{ props.cookie.session ? '✅' : '❌' }}</span>
    </div>
    <div v-if="props.cookie.sameSite !== undefined">
      SameSite: <span class="font-mono">{{ props.cookie.sameSite }}</span>
    </div>
    <div v-if="props.cookie.expirationDate !== undefined">
      Expires:
      <span class="font-mono">{{
        new Date(props.cookie.expirationDate * 1000).toLocaleString()
      }}</span>
    </div>
    <div v-if="props.cookie.partitionKey !== undefined">
      Partitioned: <span class="font-mono">{{ !!props.cookie.partitionKey ? '✅' : '❌' }}</span>
    </div>
  </div>
</template>
