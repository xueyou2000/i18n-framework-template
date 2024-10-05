/*eslint-env node*/
/*global process:false*/
import express from 'express'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { __dirname, require, serverRenderExpress, getCurrentLanguage } from './ssr-base.mjs'

const serverRender = async (req, res, next) => {
  const lang = getCurrentLanguage(req.url)
  const moduleUrl = join(__dirname, '../dist/server/index.js')
  const SSRRenderModule = require(moduleUrl)

  serverRenderExpress(req, res, next, SSRRenderModule, async () => {
    const template = await readFile(join(__dirname, `../dist/${lang}/index.html`), 'utf-8')
    return template
  })
}

const port = process.env.PORT || 3000

export async function preview() {
  const app = express()

  app.get('*', (req, res, next) => {
    try {
      serverRender(req, res, next)
    } catch (err) {
      console.error('SSR render error, downgrade to CSR...\n', err)
      next()
    }
  })

  app.use(express.static('dist'))

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
}

preview()
