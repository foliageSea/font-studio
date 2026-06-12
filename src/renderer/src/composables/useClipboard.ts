import { ref } from 'vue'

const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

export function useClipboard() {
  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true

      if (copyTimeout) {
        clearTimeout(copyTimeout)
      }
      copyTimeout = setTimeout(() => {
        copied.value = false
      }, 2000)

      return true
    } catch (err) {
      console.error('复制到剪贴板失败:', err)
      return false
    }
  }

  function copyFontName(fontName: string) {
    return copyToClipboard(fontName)
  }

  function copyFontFamily(fontFamily: string) {
    return copyToClipboard(fontFamily)
  }

  function copyFontQuoted(fontName: string) {
    return copyToClipboard(`'${fontName}'`)
  }

  return {
    copied,
    copyToClipboard,
    copyFontName,
    copyFontFamily,
    copyFontQuoted
  }
}
