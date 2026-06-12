<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FilterType } from '../types/font'

const props = defineProps<{
  modelValue: FilterType
  stats: {
    total: number
    installed: number
    recent: number
  }
  fontFamilyList: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterType): void
  (e: 'update:fontFamily', value: string): void
}>()

const selectedFamily = ref('')
const showDropdown = ref(false)

const filters: {
  value: FilterType
  label: string
  count: keyof { total: number; installed: number; recent: number }
}[] = [
  { value: 'all', label: '全部', count: 'total' },
  { value: 'installed', label: '已安装', count: 'installed' },
  { value: 'recent', label: '最近', count: 'recent' }
]

function setFilter(value: FilterType): void {
  emit('update:modelValue', value)
}

function selectFamily(family: string): void {
  selectedFamily.value = family
  emit('update:fontFamily', family)
  showDropdown.value = false
}

function clearFamily(): void {
  selectedFamily.value = ''
  emit('update:fontFamily', '')
  showDropdown.value = false
}

function toggleDropdown(): void {
  showDropdown.value = !showDropdown.value
}

watch(
  () => props.fontFamilyList,
  () => {
    selectedFamily.value = ''
  }
)
</script>

<template>
  <div class="filter-bar">
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

    <div class="family-filter">
      <button class="family-btn" :class="{ active: selectedFamily }" @click="toggleDropdown">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 4h12M2 8h8M2 12h10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        {{ selectedFamily || '字体族' }}
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          class="dropdown-icon"
          :class="{ open: showDropdown }"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>

      <div v-if="showDropdown" class="family-dropdown">
        <div class="dropdown-header">
          <span class="dropdown-title">选择字体族</span>
          <button v-if="selectedFamily" class="clear-btn" @click="clearFamily">清除</button>
        </div>
        <div class="dropdown-list">
          <button class="dropdown-item" :class="{ active: !selectedFamily }" @click="clearFamily">
            全部字体族
          </button>
          <button
            v-for="family in fontFamilyList"
            :key="family"
            class="dropdown-item"
            :class="{ active: selectedFamily === family }"
            @click="selectFamily(family)"
          >
            {{ family }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

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

.family-filter {
  position: relative;
}

.family-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  height: 40px;
  padding: 0 var(--spacing-md);
  font-size: var(--font-nav-link-size);
  font-weight: 500;
  color: var(--color-muted);
  background: transparent;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.family-btn:hover {
  color: var(--color-ink);
  background-color: var(--color-surface-soft);
}

.family-btn.active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.dropdown-icon {
  transition: transform var(--transition-fast);
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.family-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-xs));
  right: 0;
  min-width: 240px;
  max-height: 320px;
  background-color: var(--color-surface-card);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-hairline);
}

.dropdown-title {
  font-size: var(--font-caption-size);
  color: var(--color-muted);
}

.clear-btn {
  font-size: var(--font-caption-size);
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}

.clear-btn:hover {
  text-decoration: underline;
}

.dropdown-list {
  max-height: 280px;
  overflow-y: auto;
  padding: var(--spacing-xs);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-body-size-sm);
  color: var(--color-ink);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item:hover {
  background-color: var(--color-surface-soft);
}

.dropdown-item.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}
</style>
