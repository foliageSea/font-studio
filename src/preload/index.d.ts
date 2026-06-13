import { ElectronAPI } from '@electron-toolkit/preload'

export interface FontInfo {
  name: string
  family: string
  filePath: string
  format: string
  size: number
  installed: boolean
  installedDate?: Date
}

export interface FontInstallResult {
  success: boolean
  message: string
  font?: FontInfo
}

export interface FontUninstallResult {
  success: boolean
  message: string
}

export interface FontFamilyUninstallResult {
  success: boolean
  message: string
  uninstalled: number
  failed: number
}

export interface OpenFileDialogResult {
  canceled: boolean
  files: string[]
}

export interface OpenFolderDialogResult {
  canceled: boolean
  folder: string
}

export interface Api {
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
  isMaximized: () => Promise<boolean>

  scanFonts: () => Promise<FontInfo[]>
  installFont: (filePath: string) => Promise<FontInstallResult>
  uninstallFont: (font: FontInfo) => Promise<FontUninstallResult>
  uninstallFontFamily: (familyName: string) => Promise<FontFamilyUninstallResult>
  getFontDetails: (filePath: string) => Promise<FontInfo | null>
  openFileDialog: () => Promise<OpenFileDialogResult>
  openFolderDialog: () => Promise<OpenFolderDialogResult>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
