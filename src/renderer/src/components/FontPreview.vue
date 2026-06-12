<script setup lang="ts">
import type { FontInfo } from '../types/font'
import { useClipboard } from '../composables/useClipboard'

const props = defineProps<{
  font: FontInfo | null
  previewText: string
}>()

const emit = defineEmits<{
  (e: 'update:previewText', value: string): void
  (e: 'install', font: FontInfo): void
  (e: 'uninstall', font: FontInfo): void
  (e: 'close'): void
}>()

const { copied, copyFontName, copyFontFamily } = useClipboard()

const previewSizes = [12, 14, 16, 20, 24, 32, 48, 64]
const currentSize = defineModel<number>('size', { default: 24 })

function handleCopyName() {
  if (props.font) {
    copyFontName(props.font.name)
  }
}

function handleCopyFamily() {
  if (props.font) {
    copyFontFamily(props.font.family)
  }
}

function handleInstall() {
  if (props.font) {
    emit('install', props.font)
  }
}

function handleUninstall() {
  if (props.font) {
    emit('uninstall', props.font)
  }
}
</script>

<template>
  <div v-if="font" class="font-preview">
    <div class="preview-header">
      <div class="preview-title">
        <h3>{{ font.name }}</h3>
        <span class="badge">{{ font.format }}</span>
      </div>
      <button class="close-btn" @click="emit('close')" title="关闭">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div class="preview-content">
      <div class="preview-font-info">
        <div class="info-row">
          <span class="info-label">字体名称:</span>
          <span class="info-value">{{ font.name }}</span>
          <button class="copy-btn" @click="handleCopyName" :title="copied ? '已复制' : '复制名称'">
            <svg v-if="!copied" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="4"
                y="4"
                width="8"
                height="8"
                rx="1"
                stroke="currentColor"
                stroke-width="1.5"
              />
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
        </div>
        <div class="info-row">
          <span class="info-label">字体族:</span>
          <span class="info-value">{{ font.family }}</span>
          <button class="copy-btn" @click="handleCopyFamily" title="复制字体族">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect
                x="4"
                y="4"
                width="8"
                height="8"
                rx="1"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M10 4V3C10 2.44772 9.55228 2 9 2H3C2.44772 2 2 2.44772 2 3V9C2 9.55228 2.44772 10 3 10H4"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </button>
        </div>
        <div class="info-row">
          <span class="info-label">文件路径:</span>
          <span class="info-value path" :title="font.filePath">{{ font.filePath }}</span>
        </div>
      </div>

      <div class="preview-controls">
        <label class="control-label">预览文字:</label>
        <input
          type="text"
          class="input"
          :value="previewText"
          @input="emit('update:previewText', ($event.target as HTMLInputElement).value)"
          placeholder="输入预览文字..."
        />
      </div>

      <div class="preview-sizes">
        <label class="control-label">字号:</label>
        <div class="size-buttons">
          <button
            v-for="size in previewSizes"
            :key="size"
            class="size-btn"
            :class="{ active: currentSize === size }"
            @click="currentSize = size"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <div class="preview-display">
        <div
          class="preview-text"
          :style="{
            fontFamily: `'${font.family}'`,
            fontSize: currentSize + 'px'
          }"
        >
          {{ previewText || 'The quick brown fox jumps over the lazy dog' }}
        </div>
      </div>

      <div class="preview-actions">
        <button v-if="font.installed" class="btn btn-secondary" @click="handleUninstall">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          卸载字体
        </button>
        <button v-else class="btn btn-primary" @click="handleInstall">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          安装字体
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-preview {
  position: fixed;
  right: 0;
  top: 40px;
  bottom: 0;
  width: 400px;
  background-color: var(--color-canvas);
  border-left: 1px solid var(--color-hairline);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-hairline);
}

.preview-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.preview-title h3 {
  font-family: var(--font-title);
  font-size: var(--font-title-size-md);
  font-weight: 500;
  color: var(--color-ink);
  margin: 0;
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

.close-btn {
  width: 32px;
  height: 32px;
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

.close-btn:hover {
  color: var(--color-ink);
  background-color: var(--color-surface-soft);
}

.preview-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.preview-font-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.info-label {
  font-size: var(--font-caption-size);
  color: var(--color-muted);
  white-space: nowrap;
}

.info-value {
  font-size: var(--font-body-size-sm);
  color: var(--color-ink);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-value.path {
  font-family: var(--font-code);
  font-size: 12px;
  color: var(--color-muted);
}

.copy-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-soft);
}

.preview-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.control-label {
  font-size: var(--font-caption-size);
  font-weight: 500;
  color: var(--color-muted);
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 var(--spacing-sm);
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

.preview-sizes {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.size-buttons {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.size-btn {
  min-width: 36px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-caption-size);
  color: var(--color-muted);
  background: transparent;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.size-btn:hover {
  color: var(--color-ink);
  border-color: var(--color-muted-soft);
}

.size-btn.active {
  color: var(--color-primary);
  background-color: var(--color-surface-soft);
  border-color: var(--color-primary);
}

.preview-display {
  flex: 1;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-soft);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  overflow: auto;
}

.preview-text {
  color: var(--color-ink);
  text-align: center;
  word-break: break-word;
  line-height: 1.3;
  max-width: 100%;
}

.preview-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  height: 40px;
  padding: 0 var(--spacing-md);
  font-size: var(--font-button-size);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-active);
}

.btn-secondary {
  background-color: var(--color-canvas);
  color: var(--color-ink);
  border: 1px solid var(--color-hairline);
}

.btn-secondary:hover {
  background-color: var(--color-surface-soft);
}

@media (max-width: 768px) {
  .font-preview {
    width: 100%;
    top: auto;
    bottom: 0;
    height: 70vh;
    border-left: none;
    border-top: 1px solid var(--color-hairline);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
}
</style>
