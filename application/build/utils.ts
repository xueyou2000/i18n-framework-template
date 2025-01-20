import { getArgv } from '@framework/build'
import { consola } from 'consola'
import fastGlob from 'fast-glob'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, normalize } from 'node:path'
import xxhash, { XXHashAPI } from 'xxhash-wasm'

import { RsbuildEntryDescription } from '@rsbuild/core'
import { DEFAULT_HTML, DEFAULT_MANIFEST, ENTRIES_FILE_NAME, LOCAL_DIR, TRANS_FILE_REG, TRANS_KEY_REG } from './constants'

export interface LocalInfo {
  /** local */
  local: string
  /** local入口 */
  entries: string
  /** local html模板 */
  htmlTemplate: string
  /** local manifest */
  manifest: string
}

let hasher: XXHashAPI
export async function initHash() {
  if (hasher) {
    return hasher
  } else {
    return await xxhash()
  }
}

/**
 * 读取json内容
 */
export async function readFileJson<T extends object>(filePath: string): Promise<T> {
  try {
    const manifestContent = await readFile(normalize(filePath), 'utf-8')
    return JSON.parse(manifestContent)
  } catch {
    console.error('Failed to read json file')
    return {} as T
  }
}

/**
 * 解析locals数组
 * @param localStr 本地配置字符串,  例如: "in,jp,kh,kh-en"
 */
export function parseLocals(localStr?: string) {
  if (!localStr) return []
  return localStr.split(',').map((item) => item.trim())
}

/**
 * 获取项目所有locals数组
 * @description 根据locals目录, 获取 ['in', 'zh-cn'] 的locals数组
 */
export function getAllLocals(): string[] {
  const pattern = join(LOCAL_DIR, '**', `${ENTRIES_FILE_NAME}`).replace(/\\/g, '/')
  const excludePattern = `!${join(LOCAL_DIR, `${ENTRIES_FILE_NAME}`)}`.replace(/\\/g, '/')

  return fastGlob.sync([pattern, excludePattern]).map((path) => {
    return basename(dirname(path))
  })
}

/**
 * 判断local入口文件是否存在
 */
export function hasLocal(local: string) {
  const path = join(LOCAL_DIR, `/${local}/${ENTRIES_FILE_NAME}`)
  return existsSync(path)
}

/**
 * 获取启动locals信息
 */
export function getLocalsInfoMap() {
  const result = new Map<string, LocalInfo>()
  let locals = parseLocals(getArgv('--locals'))

  if (locals.length) {
    // 检查对应local入口文件是否存在
    locals = locals.filter((local) => {
      const checkFile = hasLocal(local)
      if (!checkFile) {
        consola.error(new Error(`local入口文件不存在: ${local}`))
      }
      return checkFile
    })
  } else {
    // 未指定，默认启动所有local
    locals = getAllLocals()
  }

  consola.info(`获取入口文件local: ${locals.join(', ')}`)

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
 * 获取 local 入口
 */
export function getEntries(localInfoMap: Map<string, LocalInfo>) {
  const result: Record<string, RsbuildEntryDescription> = {}
  for (const [local, info] of localInfoMap.entries()) {
    result[local] = {
      import: info.entries
    }
  }
  return result
}

/**
 * 创建基础翻译文件
 */
export async function genTransJson() {
  const files = fastGlob.sync(TRANS_FILE_REG)
  const trans: Record<string, string> = {}

  const { h32ToString } = await initHash()

  for (let i = 0; i < files.length; i++) {
    const content = await readFile(files[i], 'utf-8')
    const matchList = content.matchAll(TRANS_KEY_REG)
    for (const match of matchList) {
      const [key] = match
      trans[h32ToString(key)] = key
    }
  }

  await writeFile(join(LOCAL_DIR, 'trans.json'), JSON.stringify(trans, null, 2))
  return trans
}

/**
 * 主动获取, 用于不同环境的配置复用
 */
export const localInfoMap = getLocalsInfoMap()
export const localInfoArray = Array.from(localInfoMap.values())
