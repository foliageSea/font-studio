<script setup lang="ts">
import type { FilterType } from '../types/font'

const props = defineProps<{
  modelValue: FilterType
  stats: {
    total: number
    installed: number
    recent: number
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterType): void
}>()

const filters: { value: FilterType; label: string; count: keyof typeof props.stats }[] = [
  { value: 'all', label: '全部', count: 'total' },
  { value: 'installed', label: '已安装', count: 'installed' },
  { value: 'recent', label: '最近', count: 'recent' }
]

function setFilter(value: FilterType) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="filter-tabs">
    <button
      v-for="filterItem in filters"
      :key="filterItem.value"
      class="filter-tab"
      :class="{ active: modelValue === filterItem.value }"
      @click="setFilter(filterItem.value)"
    >
      {{ filterItem.label }}
      <span class="filter-count">{{ stats[filterItem.count] }}</span>
    </button>
  </div>
</template>

<style scoped>
.filter-tabs {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  height: 40px;
}

.filter-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  height: 100%;
  padding: 0 var(--spacing-md);
  font-size: var(--font-nav-link-size);
  font-weight: 500;
  color: var(--color-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.filter-tab:hover {
  color: var(--color-ink);
  background-color: var(--color-surface-soft);
}

.filter-tab.active {
  color: var(--color-ink);
  background-color: var(--color-surface-card);
}

.filter-count {
  font-size: var(--font-caption-size);
  color: var(--color-muted-soft);
}

.filter-tab.active .filter-count {
  color: var(--color-muted);
}
</style>
