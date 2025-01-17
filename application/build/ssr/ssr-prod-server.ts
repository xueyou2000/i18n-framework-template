/*eslint-env node*/
/*global process:false*/
import compression from 'compression'
import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { __dirname, getCurrentLanguage, getProdManifestJson, require, serverRenderExpress } from './ssr-base'
import { ManifestJson, SSRRenderModuleType } from './types'

const distDir = join(__dirname, '../../dist')

let manifest: ManifestJson

const serverRender = async (req: Request, res: Response, next: NextFunction) => {
  const locale = getCurrentLanguage(req.url)
  const moduleUrl = join(distDir, 'server/index.js')
  const SSRRenderModule = require(moduleUrl)

  serverRenderExpress(req, res, next, SSRRenderModule as SSRRenderModuleType, {
    async getHtmlTemplate() {
      const template = await readFile(join(distDir, locale, 'index.html'), 'utf-8')
      return template
    },
    manifest,
    locale
  })
}

const port = process.env.PORT || 3000

export async function preview() {
  const app = express()

  manifest = await getProdManifestJson(distDir)

  app.get('*', (req, res, next) => {
    try {
      serverRender(req, res, next)
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      next()
    }
  })

  // 使用compression中间件
  app.use(
    compression({
      level: 6, // 压缩级别，范围是1-9，9为最高压缩率
      threshold: '1kb', // 只有当响应体大于指定阈值时才进行压缩
      filter: (req, res) => {
        // 自定义过滤逻辑
        if (req.headers['x-no-compression']) {
          return false // 如果请求头包含'x-no-compression'，则不进行压缩
        }
        return compression.filter(req, res) // 使用默认的过滤逻辑
      }
    })
  )

  app.use(express.static('dist'))

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
}

preview()
