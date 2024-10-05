import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createRsbuild, loadConfig } from '@rsbuild/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function createFetchRequest(req) {
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

export const getCurrentLanguage = (pathname) => {
  const language = pathname.split('/')[1]
  return language
}

const serverRender = (serverAPI) => async (_req, res, next) => {
  const indexModule = await serverAPI.environments.ssr.loadBundle('index')

  const fetchRequest = createFetchRequest(_req)

  const lang = getCurrentLanguage(_req.url)
  const props = { url: _req.url, lang }
  const isMatch = await indexModule.isMatchRoute(props)
  if (isMatch) {
    // const markup = await indexModule.renderHTMLByMemoryRouter(props)
    const markup = await indexModule.renderHTMLByRequest({ ...props, fetchRequest })
    const template = await serverAPI.environments.web.getTransformedHtml(lang)
    const html = template.replace('<!--app-content-->', markup)
    res.writeHead(200, {
      'Content-Type': 'text/html'
    })
    res.end(html)
  } else {
    next()
  }
}

export async function startDevServer() {
  const { content } = await loadConfig({ path: join(__dirname, './rsbuild.base.config.ts') })

  // Init Rsbuild
  const rsbuild = await createRsbuild({
    rsbuildConfig: content
  })
  const app = express()

  // Create Rsbuild DevServer instance
  const rsbuildServer = await rsbuild.createDevServer()

  const serverRenderMiddleware = serverRender(rsbuildServer)

  app.get('*', async (req, res, next) => {
    try {
      await serverRenderMiddleware(req, res, next)
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      next()
    }
  })

  // Apply Rsbuild’s built-in middlewares
  app.use(rsbuildServer.middlewares)

  const httpServer = app.listen(rsbuildServer.port, () => {
    // Notify Rsbuild that the custom server has started
    rsbuildServer.afterListen()
  })

  rsbuildServer.connectWebSocket({ server: httpServer })

  return {
    close: async () => {
      await rsbuildServer.close()
      httpServer.close()
    }
  }
}

startDevServer()
