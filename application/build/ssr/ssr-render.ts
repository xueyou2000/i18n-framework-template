import { consola } from 'consola'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { __dirname, getProdManifestJson, require, serverRender } from './ssr-base'

import { CLIENT_ASSET_PREFIX } from '../constants'
import { ManifestJson, SSRRenderModuleType, SSRRenderOptions } from './types'
import { localInfoArray } from '../utils'

const distDir = join(__dirname, '../../dist')

export async function ssrRender() {
  const moduleUrl = join(distDir, 'server/index.js')
  const manifest = await getProdManifestJson(distDir)
  const SSRRenderModule: SSRRenderModuleType = require(moduleUrl)

  // const paths = await SSRRenderModule.getRoutePaths()

  const tasks = localInfoArray.map((localInfo) => buildByLocale(localInfo.local, manifest, SSRRenderModule))
  await Promise.all(tasks)
  consola.success('批量构建完成')
}

async function buildByLocale(locale: string, manifest: ManifestJson, SSRRenderModule: SSRRenderModuleType) {
  const htmlTemplate = await readFile(join(distDir, locale, 'index.html'), 'utf-8')
  const paths = await SSRRenderModule.getRoutePaths(locale)

  consola.info(`开始批量构建: locale=${locale}`, paths)

  await Promise.all(
    paths.map(async (pathname) => {
      const html = await build(pathname, SSRRenderModule, {
        getHtmlTemplate: async () => htmlTemplate,
        manifest,
        locale
      })
      if (!html) {
        consola.error(`服务端渲染失败: locale=${locale} pathname=${pathname}`)
        return
      }
      consola.success(`写入构建HTML: locale=${locale} ${pathname}`)
      const filename = pathname === '/' ? 'index' : pathname
      await writeFile(join(distDir, locale, `${filename}.html`), html)
    })
  )

  consola.info(`批量构建完成: locale=${locale}`)
}

async function build(pathname: string, SSRRenderModule: SSRRenderModuleType, options: SSRRenderOptions) {
  const { locale } = options
  consola.info(`开始构建: locale=${locale} pathname=${pathname}`)

  const origin = `http://localhost:3000${CLIENT_ASSET_PREFIX.replace(/\/$/, '')}`
  const fetchRequest = new Request(`${origin}/${locale}/${pathname.replace(/^\//, '')}`, {
    method: 'GET'
  })
  try {
    const html = await serverRender(fetchRequest, SSRRenderModule, options)
    return html
  } catch (error) {
    consola.error(`服务端渲染失败: locale=${locale} pathname=${pathname}`, error)
    return ''
  }
}

ssrRender()
