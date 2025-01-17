import { join } from 'node:path'

// 包信息
const { npm_package_version } = process.env
export const VERSION = `${npm_package_version}`
export const VERSION_TIME = `${npm_package_version}@${Date.now()}`

// 构建配置
export const MANIFEST_NAME = 'manifest.json'
export const BUILD_MANIFEST_NAME = 'rsbuild-manifest.json'
export const SSR_RENDER_FILE = join(__dirname, '../src/renders/SSRRender.tsx')
export const CLIENT_ASSET_PREFIX = process.env.CLIENT_ASSET_PREFIX || '/'

// local配置
export const LOCAL_DIR = join(__dirname, '../src/locals')
export const ENTRIES_FILE_NAME = 'index.tsx'
export const DEFAULT_HTML = join(__dirname, '../src/locals/index.html')
export const DEFAULT_MANIFEST = join(__dirname, `../src/locals/${MANIFEST_NAME}`)
