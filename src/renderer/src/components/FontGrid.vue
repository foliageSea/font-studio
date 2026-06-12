<script setup lang="ts">
import type { FontInfo } from '../types/font'
import FontCard from './FontCard.vue'

defineProps<{
  fonts: FontInfo[]
  previewText: string
  selectedFont: FontInfo | null
}>()

const emit = defineEmits<{
  (e: 'select', font: FontInfo): void
  (e: 'install', font: FontInfo): void
  (e: 'uninstall', font: FontInfo): void
}>()
</script>

<template>
  <div class="font-grid">
    <FontCard
      v-for="font in fonts"
      :key="font.filePath"
      :font="font"
      :preview-text="previewText"
      :selected="selectedFont?.filePath === font.filePath"
      @select="emit('select', $event)"
      @install="emit('install', $event)"
      @uninstall="emit('uninstall', $event)"
    />
  </div>
</template>

<style scoped>
.font-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 1024px) {
  .font-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .font-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .font-grid {
    grid-template-columns: 1fr;
  }
}
</style>
