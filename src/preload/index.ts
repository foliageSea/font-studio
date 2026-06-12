import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  scanFonts: () => ipcRenderer.invoke('fonts:scan'),
  installFont: (filePath: string) => ipcRenderer.invoke('fonts:install', filePath),
  uninstallFont: (font: any) => ipcRenderer.invoke('fonts:uninstall', font),
  getFontDetails: (filePath: string) => ipcRenderer.invoke('fonts:get-details', filePath),
  openFileDialog: () => ipcRenderer.invoke('fonts:open-file-dialog'),
  openFolderDialog: () => ipcRenderer.invoke('fonts:open-folder-dialog')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
