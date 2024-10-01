import { getArgv, parseLocals } from '@framework/build'
import fastGlob from 'fast-glob'
import { existsSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import signale from 'signale'

const LOCAL_DIR = join(__dirname, '../src/locals')
const ENTRIES_FILE_NAME = 'index.ts'
const DEFAULT_HTML = join(__dirname, '../src/locals/index.html')

export interface LocalInfo {
  local: string
  entries: string
  htmlTemplate: string
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
        signale.error(`local入口文件不存在: ${local}`)
      }
      return checkFile
    })
  } else {
    // 未指定，默认启动所有国家
    locals = getAllLocals()
  }

  locals.forEach((local) => {
    local = local.toLowerCase()
    const localHtml = join(LOCAL_DIR, `/${local}/index.html`)
    const info: LocalInfo = {
      local,
      entries: join(LOCAL_DIR, `/${local}/${ENTRIES_FILE_NAME}`),
      htmlTemplate: existsSync(localHtml) ? localHtml : DEFAULT_HTML
    }
    result.set(local, info)
  })

  return result
}

/**
 * 获取多语言入口
 */
export function getEntries(localInfo: Map<string, LocalInfo>) {
  const result: Record<string, string> = {}
  for (const [local, info] of localInfo.entries()) {
    result[local] = info.entries
  }
  return result
}
