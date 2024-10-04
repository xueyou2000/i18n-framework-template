/* eslint-disable no-undef */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import express from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const require = createRequire(import.meta.url)

const getCurrentLanguage = (pathname) => {
  const language = pathname.split('/')[1]
  return language
}

const serverRender = async (_req, res, next) => {
  const remotesPath = join(__dirname, '../dist/server/index.js')

  const lang = getCurrentLanguage(_req.url)
  const props = { url: _req.url, lang }

  const importedApp = require(remotesPath)

  const isMatch = await importedApp.isMatchRoute(props)

  if (isMatch) {
    const markup = await importedApp.renderHTML(props)
    const template = await readFile(join(__dirname, `../dist/${lang}/index.html`), 'utf-8')
    const html = template.replace('<!--app-content-->', markup)

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } else {
    next()
  }
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
