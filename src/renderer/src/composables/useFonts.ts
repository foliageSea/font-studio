import { ref, computed } from 'vue'
import type { FontInfo, FilterType } from '../types/font'

const fonts = ref<FontInfo[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const filter = ref<FilterType>('all')
const selectedFont = ref<FontInfo | null>(null)
const previewText = ref('The quick brown fox jumps over the lazy dog')

export function useFonts() {
  const filteredFonts = computed(() => {
    let result = fonts.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (font) =>
          font.name.toLowerCase().includes(query) ||
          font.family.toLowerCase().includes(query)
      )
    }

    if (filter.value === 'installed') {
      result = result.filter((font) => font.installed)
    } else if (filter.value === 'recent') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      result = result.filter(
        (font) => font.installedDate && new Date(font.installedDate) > thirtyDaysAgo
      )
    }

    return result
  })

  const fontStats = computed(() => ({
    total: fonts.value.length,
    installed: fonts.value.filter((f) => f.installed).length,
    recent: fonts.value.filter((f) => {
      if (!f.installedDate) return false
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(f.installedDate) > thirtyDaysAgo
    }).length
  }))

  async function scanFonts() {
    loading.value = true
    error.value = null
    try {
      fonts.value = await window.api.scanFonts()
    } catch (err) {
      error.value = `扫描字体失败: ${err}`
    } finally {
      loading.value = false
    }
  }

  async function installFont(filePath: string) {
    loading.value = true
    error.value = null
    try {
      const result = await window.api.installFont(filePath)
      if (result.success && result.font) {
        fonts.value.push(result.font)
      }
      return result
    } catch (err) {
      error.value = `安装字体失败: ${err}`
      return { success: false, message: `安装失败: ${err}` }
    } finally {
      loading.value = false
    }
  }

  async function uninstallFont(font: FontInfo) {
    loading.value = true
    error.value = null
    try {
      const result = await window.api.uninstallFont(font)
      if (result.success) {
        fonts.value = fonts.value.filter((f) => f.filePath !== font.filePath)
        if (selectedFont.value?.filePath === font.filePath) {
          selectedFont.value = null
        }
      }
      return result
    } catch (err) {
      error.value = `卸载字体失败: ${err}`
      return { success: false, message: `卸载失败: ${err}` }
    } finally {
      loading.value = false
    }
  }

  async function importFonts() {
    const result = await window.api.openFileDialog()
    if (result.canceled) return

    const results: { success: boolean; message: string; font?: FontInfo }[] = []
    for (const filePath of result.files) {
      const installResult = await installFont(filePath)
      if (installResult) {
        results.push(installResult)
      }
    }
    return results
  }

  function selectFont(font: FontInfo | null) {
    selectedFont.value = font
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setFilter(newFilter: FilterType) {
    filter.value = newFilter
  }

  function setPreviewText(text: string) {
    previewText.value = text
  }

  return {
    fonts,
    loading,
    error,
    searchQuery,
    filter,
    selectedFont,
    previewText,
    filteredFonts,
    fontStats,
    scanFonts,
    installFont,
    uninstallFont,
    importFonts,
    selectFont,
    setSearchQuery,
    setFilter,
    setPreviewText
  }
}
