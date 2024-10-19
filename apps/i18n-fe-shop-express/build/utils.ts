import { getArgv, parseLocals } from '@framework/build'
import { RsbuildEntryDescription } from '@rsbuild/core'
import fastGlob from 'fast-glob'
import { existsSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { consola } from 'consola'
import { InjectManifest } from '@aaroon/workbox-rspack-plugin'

const { npm_package_version } = process.env

export const MANIFEST_NAME = 'manifest.json'
const LOCAL_DIR = join(__dirname, '../src/locals')
const ENTRIES_FILE_NAME = 'index.tsx'
const DEFAULT_HTML = join(__dirname, '../src/locals/index.html')
const DEFAULT_MANIFEST = join(__dirname, `../src/locals/${MANIFEST_NAME}`)
export const SSR_RENDER_FILE = join(__dirname, '../src/renders/SSRRender.tsx')

export const VERSION = `${npm_package_version}`
export const VERSION_TIME = `${npm_package_version}@${Date.now()}`

export interface LocalInfo {
  local: string
  entries: string
  htmlTemplate: string
  manifest: string
}

/**
 * 获取项目所有国家
 */
export function getAllLocals() {
  // 如果国家可以省略，那么这里就不知道有哪些国家了！
  const pattern = join(LOCAL_DIR, `/*/${ENTRIES_FILE_NAME}`)
  const excludePattern = '!' + join(LOCAL_DIR, `/${ENTRIES_FILE_NAME}`)
  return fastGlob.sync([pattern, excludePattern]).map((path) => basename(dirname(path)))
}

/**
 * 判断国家入口文件是否存在
 */
export function hasLocal(local: string) {
  const path = join(LOCAL_DIR, `/${local}/${ENTRIES_FILE_NAME}`)
  return existsSync(path)
}

/**
 * 获取启动国家信息
 */
export function getLocalsInfo() {
  const result = new Map<string, LocalInfo>()
  let locals = parseLocals(getArgv('locals'))

  if (locals.length) {
    // 检查对应国家入口文件是否存在
    locals = locals.filter((local) => {
      const checkFile = hasLocal(local)
      if (!checkFile) {
        consola.error(new Error(`local入口文件不存在: ${local}`))
      }
      return checkFile
    })
  } else {
    // 未指定，默认启动所有国家
    locals = getAllLocals()
  }

  consola.info(`编译国家: ${locals.join(', ')}`)

  locals.forEach((local) => {
    local = local.toLowerCase()
    const localHtml = join(LOCAL_DIR, `/${local}/index.html`)
    const localManifest = join(LOCAL_DIR, `/${local}/manifest.json`)
    const info: LocalInfo = {
      local,
      entries: join(LOCAL_DIR, `/${local}/${ENTRIES_FILE_NAME}`),
      htmlTemplate: existsSync(localHtml) ? localHtml : DEFAULT_HTML,
      manifest: existsSync(localManifest) ? localManifest : DEFAULT_MANIFEST
    }
    result.set(local, info)
  })

  return result
}

/**
 * 获取多语言入口
 */
export function getEntries(localInfo: Map<string, LocalInfo>) {
  const result: Record<string, RsbuildEntryDescription> = {}
  for (const [local, info] of localInfo.entries()) {
    result[local] = {
      import: info.entries
      // filename: `${local}/[name].[contenthash:8].js`
    }
  }
  return result
}

/**
 * 获取多语言数组
 */
export function getLocals(localInfo: Map<string, LocalInfo>) {
  const result: string[] = []
  for (const local of localInfo.keys()) {
    result.push(local)
  }
  return result
}

/**
 * 获取多语言配置
 */
export function getMultiConfig(localInfo: Map<string, LocalInfo>, configKey: keyof LocalInfo) {
  const result: string[] = []
  for (const info of localInfo.values()) {
    result.push(info[configKey])
  }
  return result
}

/**
 * 创建多入口SW插件
 */
export function createSWPlugins(localInfo: Map<string, LocalInfo>) {
  return getLocals(localInfo).map(
    (local) =>
      new InjectManifest({
        // mode: 'production',
        // chunks: [local],
        // injectionPoint: 'self.__WB_MANIFEST',
        swSrc: join(__dirname, `../src/locals/${local}/sw.ts`),
        swDest: `${local}/${local}-sw.js`
        // include: [/\.html$/, /\.js$/, /\.css$/, /\.woff2$/, /\.jpg$/, /\.png$/]
      })
  )
}
