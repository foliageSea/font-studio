<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()

const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2" />
        <path d="M20 28H44" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M20 36H36" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M20 44H28" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>
    <h3 class="empty-state-title">{{ title || '没有找到字体' }}</h3>
    <p class="empty-state-description">{{ description || '尝试调整搜索条件或导入新字体' }}</p>
    <button class="btn btn-primary" @click="emit('action')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      导入字体
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  text-align: center;
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-lg);
  color: var(--color-muted-soft);
}

.empty-state-title {
  font-family: var(--font-display);
  font-size: var(--font-display-size-sm);
  color: var(--color-ink);
  margin-bottom: var(--spacing-xs);
}

.empty-state-description {
  font-size: var(--font-body-size-md);
  color: var(--color-muted);
  margin-bottom: var(--spacing-lg);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  height: 40px;
  padding: 0 var(--spacing-md);
  font-size: var(--font-button-size);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-active);
}
</style>
