<script setup lang="ts">
import { onMounted } from 'vue'
import TitleBar from './components/TitleBar.vue'
import SearchBar from './components/SearchBar.vue'
import FilterBar from './components/FilterBar.vue'
import FontGrid from './components/FontGrid.vue'
import FontPreview from './components/FontPreview.vue'
import EmptyState from './components/EmptyState.vue'
import { useFonts } from './composables/useFonts'
import type { FontInfo } from './types/font'

const {
  loading,
  error,
  searchQuery,
  filter,
  selectedFont,
  previewText,
  filteredFonts,
  fontFamilyList,
  fontStats,
  scanFonts,
  installFont,
  uninstallFont,
  importFonts,
  selectFont,
  setFontFamily,
  setPreviewText
} = useFonts()

onMounted(() => {
  scanFonts()
})

function handleSelect(font: FontInfo): void {
  selectFont(font)
}

async function handleInstall(font: FontInfo): Promise<void> {
  await installFont(font.filePath)
}

async function handleUninstall(font: FontInfo): Promise<void> {
  await uninstallFont(font)
}

function handleClosePreview(): void {
  selectFont(null)
}

async function handleImport(): Promise<void> {
  await importFonts()
}
</script>

<template>
  <div class="app-layout">
    <TitleBar />

    <main class="main-content">
      <header class="content-header">
        <div class="header-left">
          <h1>Font Studio</h1>
          <p class="subtitle">管理您的字体收藏</p>
        </div>
        <div class="header-right">
          <SearchBar v-model="searchQuery" />
          <FilterBar
            v-model="filter"
            :stats="fontStats"
            :font-family-list="fontFamilyList"
            @update:font-family="setFontFamily"
          />
          <button class="btn btn-primary" @click="handleImport">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            导入字体
          </button>
        </div>
      </header>

      <div class="content-body">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>正在加载字体...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button class="btn btn-secondary" @click="scanFonts">重试</button>
        </div>

        <EmptyState
          v-else-if="filteredFonts.length === 0"
          :title="searchQuery ? '没有找到匹配的字体' : '暂无字体'"
          :description="searchQuery ? '尝试使用不同的搜索词' : '点击上方按钮导入字体'"
          @action="handleImport"
        />

        <FontGrid
          v-else
          :fonts="filteredFonts"
          :preview-text="previewText"
          :selected-font="selectedFont"
          @select="handleSelect"
          @install="handleInstall"
          @uninstall="handleUninstall"
        />
      </div>
    </main>

    <FontPreview
      v-if="selectedFont"
      :font="selectedFont"
      :preview-text="previewText"
      @update:preview-text="setPreviewText"
      @install="handleInstall"
      @uninstall="handleUninstall"
      @close="handleClosePreview"
    />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  background-color: var(--color-canvas);
  border-bottom: 1px solid var(--color-hairline);
  gap: var(--spacing-lg);
}

.header-left h1 {
  font-family: var(--font-display);
  font-size: var(--font-display-size-md);
  font-weight: 400;
  letter-spacing: -0.5px;
  color: var(--color-ink);
  margin: 0;
}

.subtitle {
  font-size: var(--font-body-size-sm);
  color: var(--color-muted);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: nowrap;
}

.content-body {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  gap: var(--spacing-md);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-surface-card);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: var(--font-body-size-md);
  color: var(--color-muted);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  gap: var(--spacing-md);
}

.error-state p {
  font-size: var(--font-body-size-md);
  color: var(--color-error);
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
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
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

@media (max-width: 1024px) {
  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .content-header {
    padding: var(--spacing-md);
  }

  .content-body {
    padding: var(--spacing-md);
  }
}
</style>
