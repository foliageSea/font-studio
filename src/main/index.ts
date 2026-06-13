import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  scanUserFonts,
  installFont,
  uninstallFont,
  uninstallFontFamily,
  getFontDetails,
  FontInfo
} from './fontManager'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.font-studio')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('window-minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.handle('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.handle('window-close', () => {
    mainWindow?.close()
  })

  ipcMain.handle('window-is-maximized', () => {
    return mainWindow?.isMaximized() || false
  })

  ipcMain.handle('fonts:scan', async () => {
    return await scanUserFonts()
  })

  ipcMain.handle('fonts:install', async (_event, filePath: string) => {
    return await installFont(filePath)
  })

  ipcMain.handle('fonts:uninstall', async (_event, font: FontInfo) => {
    return await uninstallFont(font)
  })

  ipcMain.handle('fonts:uninstall-family', async (_event, familyName: string) => {
    return await uninstallFontFamily(familyName)
  })

  ipcMain.handle('fonts:get-details', async (_event, filePath: string) => {
    return await getFontDetails(filePath)
  })

  ipcMain.handle('fonts:open-file-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      title: '选择字体文件',
      filters: [
        { name: '字体文件', extensions: ['ttf', 'otf', 'woff', 'woff2', 'ttc'] },
        { name: '所有文件', extensions: ['*'] }
      ],
      properties: ['openFile', 'multiSelections']
    })

    if (result.canceled) {
      return { canceled: true, files: [] }
    }

    return { canceled: false, files: result.filePaths }
  })

  ipcMain.handle('fonts:open-folder-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      title: '选择包含字体的文件夹',
      properties: ['openDirectory']
    })

    if (result.canceled) {
      return { canceled: true, folder: '' }
    }

    return { canceled: false, folder: result.filePaths[0] }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
