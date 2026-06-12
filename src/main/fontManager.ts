import { join } from 'path'
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  unlinkSync,
  readdirSync,
  statSync,
  readFileSync
} from 'fs'
import { promisify } from 'util'
import { exec } from 'child_process'
import opentype from 'opentype.js'

const execAsync = promisify(exec)

export interface FontInfo {
  name: string
  family: string
  filePath: string
  format: string
  size: number
  installed: boolean
  installedDate?: Date
}

const FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2', '.ttc']

function getUserFontsPath(): string {
  const appData = process.env.APPDATA || join(process.env.USERPROFILE || '', 'AppData', 'Roaming')
  return join(appData, 'Microsoft', 'Windows', 'Fonts')
}

function getLocalFontsPath(): string {
  const localAppData =
    process.env.LOCALAPPDATA || join(process.env.USERPROFILE || '', 'AppData', 'Local')
  return join(localAppData, 'Microsoft', 'Windows', 'Fonts')
}

function isSystemFont(filePath: string): boolean {
  const systemPaths = ['C:\\Windows\\Fonts', 'C:\\Windows\\System32\\Fonts']
  return systemPaths.some((sysPath) => filePath.startsWith(sysPath))
}

function getFontFormat(filePath: string): string {
  const ext = filePath.toLowerCase().split('.').pop() || ''
  const formatMap: Record<string, string> = {
    ttf: 'TrueType',
    otf: 'OpenType',
    woff: 'WOFF',
    woff2: 'WOFF2',
    ttc: 'TrueType Collection'
  }
  return formatMap[ext] || 'Unknown'
}

function extractFontName(filePath: string): string {
  const fileName = filePath.split('\\').pop() || filePath.split('/').pop() || ''
  return fileName.replace(/\.[^/.]+$/, '')
}

function parseFontMetadata(filePath: string): { name: string; family: string } {
  const fallbackName = extractFontName(filePath)
  try {
    const buffer = readFileSync(filePath)
    const font = opentype.parse(buffer.buffer)
    const names = font.names
    const platformNames = names.windows || names.macintosh || {}
    const name = platformNames.fontFamily?.en || platformNames.fontFamily?.zh || fallbackName
    const family = platformNames.preferredFamily?.en || platformNames.preferredFamily?.zh || name
    return { name, family }
  } catch {
    return { name: fallbackName, family: fallbackName }
  }
}

export async function scanUserFonts(): Promise<FontInfo[]> {
  const fonts: FontInfo[] = []
  const userFontsPath = getUserFontsPath()
  const localFontsPath = getLocalFontsPath()

  const scanDirectory = (dirPath: string) => {
    if (!existsSync(dirPath)) return

    try {
      const files = readdirSync(dirPath)
      for (const file of files) {
        const filePath = join(dirPath, file)
        try {
          const stat = statSync(filePath)
          if (stat.isFile()) {
            const ext = '.' + file.split('.').pop()?.toLowerCase()
            if (FONT_EXTENSIONS.includes(ext) && !isSystemFont(filePath)) {
              const metadata = parseFontMetadata(filePath)
              fonts.push({
                name: metadata.name,
                family: metadata.family,
                filePath,
                format: getFontFormat(filePath),
                size: stat.size,
                installed: true,
                installedDate: stat.mtime
              })
            }
          }
        } catch (err) {
          console.error(`Error reading file ${filePath}:`, err)
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${dirPath}:`, err)
    }
  }

  scanDirectory(userFontsPath)
  scanDirectory(localFontsPath)

  return fonts
}

export async function installFont(
  sourcePath: string
): Promise<{ success: boolean; message: string; font?: FontInfo }> {
  try {
    if (!existsSync(sourcePath)) {
      return { success: false, message: '源字体文件不存在' }
    }

    const ext = '.' + sourcePath.split('.').pop()?.toLowerCase()
    if (!FONT_EXTENSIONS.includes(ext)) {
      return { success: false, message: '不支持的字体格式' }
    }

    const userFontsPath = getUserFontsPath()
    if (!existsSync(userFontsPath)) {
      mkdirSync(userFontsPath, { recursive: true })
    }

    const fileName = sourcePath.split('\\').pop() || sourcePath.split('/').pop() || ''
    const destPath = join(userFontsPath, fileName)

    copyFileSync(sourcePath, destPath)

    const metadata = parseFontMetadata(sourcePath)
    const regCommand = `reg add "HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Fonts" /v "${metadata.name} (TrueType)" /t REG_SZ /d "${destPath}" /f`
    await execAsync(regCommand)

    const stat = statSync(destPath)
    const fontInfo: FontInfo = {
      name: metadata.name,
      family: metadata.family,
      filePath: destPath,
      format: getFontFormat(sourcePath),
      size: stat.size,
      installed: true,
      installedDate: new Date()
    }

    return { success: true, message: '字体安装成功', font: fontInfo }
  } catch (error) {
    return { success: false, message: `安装失败: ${error}` }
  }
}

export async function uninstallFont(
  font: FontInfo
): Promise<{ success: boolean; message: string }> {
  try {
    if (!existsSync(font.filePath)) {
      return { success: false, message: '字体文件不存在' }
    }

    if (isSystemFont(font.filePath)) {
      return { success: false, message: '不能卸载系统字体' }
    }

    unlinkSync(font.filePath)

    const regCommand = `reg delete "HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\Fonts" /v "${font.name} (TrueType)" /f`
    await execAsync(regCommand)

    return { success: true, message: '字体卸载成功' }
  } catch (error) {
    return { success: false, message: `卸载失败: ${error}` }
  }
}

export async function getFontDetails(filePath: string): Promise<FontInfo | null> {
  try {
    if (!existsSync(filePath)) return null

    const stat = statSync(filePath)
    const metadata = parseFontMetadata(filePath)

    return {
      name: metadata.name,
      family: metadata.family,
      filePath,
      format: getFontFormat(filePath),
      size: stat.size,
      installed: true
    }
  } catch (error) {
    console.error('Error getting font details:', error)
    return null
  }
}
