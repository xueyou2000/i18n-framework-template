import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import signale from 'signale'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
/** cjs的require, EsModule只支持import.meta, 不支持require */
export const require = createRequire(import.meta.url)

/**
 * 服务端渲染
 * @param {Request} request 请求
 * @param SSRRenderModule 服务端渲染模块
 * @param {function(): Promise<string>} getHtmlTemplate 获取html模板内容和(只有匹配路由成功才会调用，避免处理了其他静态资源而导致报错)
 * @returns {string} 服务端渲染内容
 */
export async function serverRender(fetchRequest, SSRRenderModule, getHtmlTemplate) {
  const helmetContext = {}
  const { pathname } = new URL(fetchRequest.url)
  const lang = getCurrentLanguage(pathname)
  const props = { url: pathname, lang, helmetContext }
  const isMatch = await SSRRenderModule.isMatchRoute(props)

  if (isMatch) {
    // const htmlContent = await SSRRenderModule.renderHTMLByMemoryRouter(props)
    const htmlContent = await SSRRenderModule.renderHTMLByRequest({ ...props, fetchRequest })
    // const template = await readFile(join(__dirname, `../dist/${lang}/index.html`), 'utf-8')
    const helmet = helmetContext.helmet
    const htmlTemplate = await getHtmlTemplate()
    const html = htmlTemplate
      .replace('<!--app-content-->', htmlContent)
      .replace('<!--helmet.title-->', helmet?.title?.toString() || '')
      .replace('<!--helmet.priority-->', helmet?.priority?.toString() || '')
      .replace('<!--helmet.meta-->', helmet?.meta?.toString() || '')
      .replace('<!--helmet.link-->', helmet?.link?.toString() || '')
      .replace('<!--helmet.script-->', helmet?.script?.toString() || '')
      .replace('data-helmet-html-attributes', helmet?.htmlAttributes?.toString() || '')

    return html
  } else {
    return ''
  }
}

/**
 * 服务端渲染
 * @param {import('express').Request} request 请求
 * @param {import('express').Response} response 响应
 * @param {import('express').NextFunction} next 中间件下一步
 * @param SSRRenderModule 服务端渲染模块
 * @param {function(): Promise<string>} getHtmlTemplate 获取html模板内容和(只有匹配路由成功才会调用，避免处理了其他静态资源而导致报错)
 */
export async function serverRenderExpress(
  request,
  response,
  next,
  SSRRenderModule,
  getHtmlTemplate
) {
  const fetchRequest = createFetchRequest(request)

  // SSRRenderModule, htmlTemplate
  const html = await serverRender(fetchRequest, SSRRenderModule, getHtmlTemplate)
  if (html) {
    const pathname = request.url
    const lang = getCurrentLanguage(pathname)
    signale.success(`服务端渲染成功: lang=${lang} pathname=${pathname}`)
    response.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } else {
    next()
  }
}

/**
 * 根据url获取请求国家语言
 * @returns {string} 语言
 */
export function getCurrentLanguage(pathname) {
  const language = pathname.split('/')[1]
  return language
}

/**
 * 创建fetchRequest, react-router-dom/server中需要
 * @returns {Request} fetchRequest
 */
export function createFetchRequest(req) {
  let origin = `${req.protocol}://${req.get('host')}`
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL(req.originalUrl || req.url, origin)

  let controller = new AbortController()
  req.on('close', () => controller.abort())

  let headers = new Headers()

  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }

  let init = {
    method: req.method,
    headers,
    signal: controller.signal
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body
  }

  return new Request(url.href, init)
}
