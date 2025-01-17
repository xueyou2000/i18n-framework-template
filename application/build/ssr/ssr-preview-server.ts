import { createRsbuild, loadConfig } from '@rsbuild/core'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import { join } from 'node:path'

import { __dirname, getDevManifestJson, serverRenderExpress, getCurrentLanguage } from './ssr-base'
import { ManifestJson, RsbuildDevServer, SSRRenderModuleType } from './types'

let manifest: ManifestJson

const serverRender = (serverAPI: RsbuildDevServer) => async (req: Request, res: Response, next: NextFunction) => {
  const locale = getCurrentLanguage(req.url)
  const SSRRenderModule = await serverAPI.environments.ssr.loadBundle('index')

  serverRenderExpress(req, res, next, SSRRenderModule as SSRRenderModuleType, {
    async getHtmlTemplate() {
      const template = await serverAPI.environments.web.getTransformedHtml(locale)
      return template
    },
    manifest,
    locale
  })
}

export async function startDevServer() {
  const { content } = await loadConfig({ path: join(__dirname, '../rsbuild.base.config.ts') })

  // Init Rsbuild
  const rsbuild = await createRsbuild({
    rsbuildConfig: content
  })

  // 开发模式,每次构建后重新使用最新的 manifest
  rsbuild.onDevCompileDone(async ({ isFirstCompile }) => {
    // 排除初次构建,此时开发服务器还未成功启动,无法访问
    if (!isFirstCompile) {
      manifest = await getDevManifestJson(rsbuildServer.port)
    }
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

  manifest = await getDevManifestJson(rsbuildServer.port)

  return {
    close: async () => {
      await rsbuildServer.close()
      httpServer.close()
    }
  }
}

startDevServer()
