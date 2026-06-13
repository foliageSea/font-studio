import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { FontInfo, FilterType } from '../types/font'

const fonts = ref<FontInfo[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const filter = ref<FilterType>('all')
const fontFamily = ref('')
const selectedFont = ref<FontInfo | null>(null)
const previewText = ref('The quick brown fox jumps over the lazy dog')

export function useFonts(): {
  fonts: Ref<FontInfo[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  searchQuery: Ref<string>
  filter: Ref<FilterType>
  fontFamily: Ref<string>
  selectedFont: Ref<FontInfo | null>
  previewText: Ref<string>
  filteredFonts: ComputedRef<FontInfo[]>
  fontFamilyList: ComputedRef<string[]>
  fontStats: ComputedRef<{
    total: number
    installed: number
    recent: number
  }>
  scanFonts: () => Promise<void>
  installFont: (filePath: string) => Promise<{ success: boolean; message: string; font?: FontInfo }>
  uninstallFont: (font: FontInfo) => Promise<{ success: boolean; message: string }>
  uninstallFontFamily: (
    family: string
  ) => Promise<{ success: boolean; message: string; uninstalled: number; failed: number }>
  importFonts: () => Promise<{ success: boolean; message: string; font?: FontInfo }[]>
  selectFont: (font: FontInfo | null) => void
  setSearchQuery: (query: string) => void
  setFilter: (newFilter: FilterType) => void
  setFontFamily: (family: string) => void
  setPreviewText: (text: string) => void
} {
  const filteredFonts = computed(() => {
    let result = fonts.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (font) =>
          font.name.toLowerCase().includes(query) || font.family.toLowerCase().includes(query)
      )
    }

    if (fontFamily.value) {
      result = result.filter((font) => font.family === fontFamily.value)
    }

    if (filter.value === 'installed') {
      result = result.filter((font) => font.installed)
    } else if (filter.value === 'recent') {
      const thirtyDaysAago = new Date()
      thirtyDaysAago.setDate(thirtyDaysAago.getDate() - 30)
      result = result.filter(
        (font) => font.installedDate && new Date(font.installedDate) > thirtyDaysAago
      )
    }

    return result
  })

  const fontFamilyList = computed(() => {
    const families = new Set<string>()
    fonts.value.forEach((font) => {
      families.add(font.family)
    })
    return Array.from(families).sort()
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

  async function scanFonts(): Promise<void> {
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

  async function installFont(
    filePath: string
  ): Promise<{ success: boolean; message: string; font?: import('../types/font').FontInfo }> {
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

  async function uninstallFont(font: FontInfo): Promise<{ success: boolean; message: string }> {
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

  async function uninstallFontFamily(
    family: string
  ): Promise<{ success: boolean; message: string; uninstalled: number; failed: number }> {
    loading.value = true
    error.value = null
    try {
      const result = await window.api.uninstallFontFamily(family)
      if (result.success || result.uninstalled > 0) {
        fonts.value = fonts.value.filter((f) => f.family !== family)
        if (selectedFont.value?.family === family) {
          selectedFont.value = null
        }
      }
      return result
    } catch (err) {
      error.value = `卸载字体族失败: ${err}`
      return { success: false, message: `卸载失败: ${err}`, uninstalled: 0, failed: 0 }
    } finally {
      loading.value = false
    }
  }

  async function importFonts(): Promise<{ success: boolean; message: string; font?: FontInfo }[]> {
    const result = await window.api.openFileDialog()
    if (result.canceled) return []

    const results: { success: boolean; message: string; font?: FontInfo }[] = []
    for (const filePath of result.files) {
      const installResult = await installFont(filePath)
      if (installResult) {
        results.push(installResult)
      }
    }
    return results
  }

  function selectFont(font: FontInfo | null): void {
    selectedFont.value = font
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function setFilter(newFilter: FilterType): void {
    filter.value = newFilter
  }

  function setFontFamily(family: string): void {
    fontFamily.value = family
  }

  function setPreviewText(text: string): void {
    previewText.value = text
  }

  return {
    fonts,
    loading,
    error,
    searchQuery,
    filter,
    fontFamily,
    selectedFont,
    previewText,
    filteredFonts,
    fontFamilyList,
    fontStats,
    scanFonts,
    installFont,
    uninstallFont,
    uninstallFontFamily,
    importFonts,
    selectFont,
    setSearchQuery,
    setFilter,
    setFontFamily,
    setPreviewText
  }
}
