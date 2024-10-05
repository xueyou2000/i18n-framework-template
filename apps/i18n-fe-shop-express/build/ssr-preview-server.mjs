import { createRsbuild, loadConfig } from '@rsbuild/core'
import express from 'express'
import { join } from 'node:path'
import { __dirname, serverRenderExpress, getCurrentLanguage } from './ssr-base.mjs'

const serverRender = (serverAPI) => async (req, res, next) => {
  const lang = getCurrentLanguage(req.url)
  const SSRRenderModule = await serverAPI.environments.ssr.loadBundle('index')

  serverRenderExpress(req, res, next, SSRRenderModule, async () => {
    const template = await serverAPI.environments.web.getTransformedHtml(lang)
    return template
  })
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
