<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isMaximized = ref(false)

onMounted(async () => {
  isMaximized.value = await window.api.isMaximized()
})

async function minimize() {
  await window.api.minimize()
}

async function maximize() {
  await window.api.maximize()
  isMaximized.value = await window.api.isMaximized()
}

async function close() {
  await window.api.close()
}
</script>

<template>
  <div class="titlebar">
    <div class="titlebar-title">Font Studio</div>
    <div class="titlebar-controls">
      <button class="titlebar-btn" @click="minimize" title="最小化">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
      <button class="titlebar-btn" @click="maximize" :title="isMaximized ? '还原' : '最大化'">
        <svg v-if="!isMaximized" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect
            x="3.5"
            y="1"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <rect
            x="1.5"
            y="3.5"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </button>
      <button class="titlebar-btn close" @click="close" title="关闭">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 2L10 10M10 2L2 10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
