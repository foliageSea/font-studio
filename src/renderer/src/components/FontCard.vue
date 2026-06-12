<script setup lang="ts">
import { computed } from 'vue'
import type { FontInfo } from '../types/font'
import { useClipboard } from '../composables/useClipboard'

const props = defineProps<{
  font: FontInfo
  previewText: string
  selected?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', font: FontInfo): void
  (e: 'install', font: FontInfo): void
  (e: 'uninstall', font: FontInfo): void
}>()

const { copied, copyFontQuoted } = useClipboard()

const formattedSize = computed(() => {
  const bytes = props.font.size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

const formattedDate = computed(() => {
  if (!props.font.installedDate) return ''
  const date = new Date(props.font.installedDate)
  return date.toLocaleDateString('zh-CN')
})

function handleCopyQuoted(e: Event) {
  e.stopPropagation()
  copyFontQuoted(props.font.name)
}

function handleUninstall(e: Event) {
  e.stopPropagation()
  emit('uninstall', props.font)
}

function handleSelect() {
  emit('select', props.font)
}
</script>

<template>
  <div class="font-card" :class="{ selected }" @click="handleSelect">
    <div class="font-card-preview">
      <span class="preview-text" :style="{ fontFamily: `'${font.family}'` }">
        {{ previewText }}
      </span>
    </div>

    <div class="font-card-info">
      <div class="font-card-name" :title="font.name">
        {{ font.name }}
      </div>
      <div class="font-card-meta">
        <span class="badge">{{ font.format }}</span>
        <span>{{ formattedSize }}</span>
        <span v-if="formattedDate">{{ formattedDate }}</span>
      </div>
    </div>

    <div class="font-card-actions">
      <button
        class="btn-icon small"
        @click="handleCopyQuoted"
        :title="copied ? '已复制' : '复制字体引用名称'"
      >
        <svg v-if="!copied" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5" />
          <path
            d="M10 4V3C10 2.44772 9.55228 2 9 2H3C2.44772 2 2 2.44772 2 3V9C2 9.55228 2.44772 10 3 10H4"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7L6 10L11 4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        v-if="font.installed"
        class="btn-icon small"
        @click="handleUninstall"
        title="卸载字体"
      >
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
  </div>
</template>

<style scoped>
.font-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  background-color: var(--color-canvas);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.font-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card);
}

.font-card.selected {
  border-color: var(--color-primary);
  background-color: var(--color-surface-soft);
}

.font-card-preview {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-soft);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  overflow: hidden;
}

.preview-text {
  font-size: 24px;
  color: var(--color-ink);
  text-align: center;
  word-break: break-word;
  line-height: 1.3;
}

.font-card-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
}

.font-card-name {
  font-family: var(--font-title);
  font-size: var(--font-title-size-sm);
  font-weight: 500;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.font-card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-caption-size);
  color: var(--color-muted);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--spacing-xs);
  font-size: 11px;
  font-weight: 500;
  border-radius: var(--radius-pill);
  background-color: var(--color-surface-card);
  color: var(--color-muted);
}

.font-card-actions {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.font-card:hover .font-card-actions {
  opacity: 1;
}

.btn-icon.small {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon.small:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-card);
}

@media (max-width: 768px) {
  .font-card-actions {
    opacity: 1;
  }
}
</style>
