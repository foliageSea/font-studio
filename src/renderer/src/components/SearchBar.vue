<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="search-bar">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <input v-model="value" type="text" class="input" :placeholder="placeholder || '搜索字体...'" />
    <button v-if="value" class="clear-btn" @click="clear" title="清除">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 3L11 11M11 3L3 11"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  height: 40px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-muted-soft);
  pointer-events: none;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 36px 0 40px;
  background-color: var(--color-surface-soft);
  color: var(--color-ink);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-body-size-md);
  transition: all var(--transition-fast);
}

.input:focus {
  background-color: var(--color-canvas);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(204, 120, 92, 0.15);
}

.input::placeholder {
  color: var(--color-muted-soft);
}

.clear-btn {
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted-soft);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  color: var(--color-ink);
  background-color: var(--color-surface-card);
}
</style>
