/// <reference types="../global" />

import { consola } from 'consola'
import type { Request as ExpressRequest, NextFunction, Response } from 'express'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { HelmetData, HelmetServerState } from 'react-helmet-async'

import { BUILD_MANIFEST_NAME, CLIENT_ASSET_PREFIX } from '../constants'
import { ManifestJson, SSRRenderModuleType, SSRRenderOptions } from './types'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// cjs的require, EsModule只支持import.meta, 不支持require
export const require = createRequire(import.meta.url)

/**
 * 服务端渲染
 * @param request 请求
 * @param SSRRenderModule 服务端渲染模块
 * @param  getHtmlTemplate 获取html模板内容和(只有匹配路由成功才会调用，避免处理了其他静态资源而导致报错)
 * @returns 服务端渲染内容
 */
export async function serverRender(fetchRequest: Request, SSRRenderModule: SSRRenderModuleType, options: SSRRenderOptions) {
  const helmetContext: HelmetData['context'] = { helmet: {} as HelmetServerState }
  const { pathname } = new URL(fetchRequest.url)
  const locale = options.locale
  const props = { url: pathname, helmetContext, locale }

  const isMatch = await SSRRenderModule.isMatchRoute(props, CLIENT_ASSET_PREFIX)

  if (isMatch) {
    // const manifest = await options.getManifestJson(fetchRequest)
    const preCssUrl = options.manifest ? await SSRRenderModule.matchPreCssUrl(pathname, options.manifest, locale) : ''
    const htmlContent = await SSRRenderModule.renderHTMLByRequest({ ...props, fetchRequest })
    const helmet = helmetContext.helmet
    const htmlTemplate = await options.getHtmlTemplate()

    const link = preCssUrl ? `<link href="${preCssUrl}" rel="stylesheet" />` : ''

    const html = htmlTemplate
      .replace('<!--app-content-->', htmlContent)
      .replace('<!--helmet.title-->', helmet?.title?.toString() || '')
      .replace('<!--helmet.priority-->', helmet?.priority?.toString() || '')
      .replace('<!--helmet.meta-->', helmet?.meta?.toString() || '')
      .replace('<!--helmet.link-->', `${helmet?.link?.toString()}${link}` || link)
      .replace('<!--helmet.script-->', helmet?.script?.toString() || '')
      .replace('data-helmet-html-attributes', helmet?.htmlAttributes?.toString() || '')
    return html
  } else {
    return ''
  }
}

/**
 * 服务端渲染
 * @param request 请求
 * @param response 响应
 * @param next 中间件下一步
 * @param SSRRenderModule 服务端渲染模块
 * @param getHtmlTemplate 获取html模板内容和(只有匹配路由成功才会调用，避免处理了其他静态资源而导致报错)
 */
export async function serverRenderExpress(
  request: ExpressRequest,
  response: Response,
  next: NextFunction,
  SSRRenderModule: SSRRenderModuleType,
  options: SSRRenderOptions
) {
  const fetchRequest = createFetchRequest(request)

  // SSRRenderModule, htmlTemplate
  // const manifest = await getManifestJsonByRequest(request)
  const html = await serverRender(fetchRequest, SSRRenderModule, options)
  if (html) {
    const pathname = request.url
    consola.success(`服务端渲染成功: locale=${options.locale} pathname=${pathname}`)
    response.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } else {
    next()
  }
}

/**
 * 创建fetchRequest, react-router-dom/server中需要
 * @returns fetchRequest
 */
export function createFetchRequest(req: ExpressRequest) {
  const origin = `${req.protocol}://${req.get('host')}`
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(req.originalUrl || req.url, origin)

  const controller = new AbortController()
  req.on('close', () => controller.abort())

  const headers = new Headers()

  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body
  }

  return new Request(url.href, init)
}

export async function getDevManifestJson(port: number): Promise<ManifestJson> {
  // 获取 manifestJson
  const manifest = await fetch(`http://localhost:${port}${CLIENT_ASSET_PREFIX}${BUILD_MANIFEST_NAME}`)
  try {
    const manifestJson = await manifest.json()
    return manifestJson || {}
  } catch {
    return { allFiles: [] }
  }
}

export async function getProdManifestJson(distDir: string): Promise<ManifestJson> {
  try {
    const manifestContent = await readFile(join(distDir, BUILD_MANIFEST_NAME), 'utf-8')
    return JSON.parse(manifestContent)
  } catch {
    console.error('Failed to read manifest.json')
    return { allFiles: [] }
  }
}

/**
 * 根据url获取请求国家语言
 * @returns 语言
 */
export function getCurrentLanguage(pathname: string) {
  const language = pathname.split('/')[1]
  return language
}
