import { Writable } from 'node:stream'
import { renderToString, renderToPipeableStream } from 'react-dom/server'
import { createMemoryRouter, matchRoutes, RouterProvider } from 'react-router-dom'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  StaticHandlerContext
} from 'react-router-dom/server'

import { NationConfig } from '@/types'
import { Root } from './Root'
import { HelmetServerState } from 'react-helmet-async'

export interface SSRRenderProps {
  /** 渲染路径，匹配路由，比如 /home */
  url: string
  /** 渲染国家-语言 */
  lang: string
  /** seo meta等信息 */
  helmetContext?: { helmet?: HelmetServerState }
}

export async function isMatchRoute(props: SSRRenderProps) {
  const { url, lang } = props
  try {
    const moduleConfig = await import(`../locals/${lang}/nation.config`)
    const nationConfig = moduleConfig.nationConfig as NationConfig
    const matchRouteList = matchRoutes(nationConfig.routes, url, `/${lang}`)

    return !!matchRouteList?.length
  } catch {
    return false
  }
}

/**
 * 官方推荐的ssr渲染方式
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function renderHTMLByRequest(props: SSRRenderProps & { fetchRequest: any }) {
  const { lang, fetchRequest, helmetContext } = props

  try {
    const moduleConfig = await import(`../locals/${lang}/nation.config`)
    const nationConfig = moduleConfig.nationConfig as NationConfig

    const handler = createStaticHandler(nationConfig.routes, { basename: `/${lang}` })
    const context = (await handler.query(fetchRequest)) as StaticHandlerContext
    const router = createStaticRouter(handler.dataRoutes, context)

    return renderToString(
      <Root lang={lang} helmetContext={helmetContext}>
        <StaticRouterProvider router={router} context={context}></StaticRouterProvider>
      </Root>
    )
  } catch (error) {
    console.error('服务端渲染失败', error)
    return ''
  }
}

/**
 * MemoryRouter方式ssr渲染
 */
export async function renderHTMLByMemoryRouter(props: SSRRenderProps) {
  const { url, lang, helmetContext } = props

  try {
    const moduleConfig = await import(`../locals/${lang}/nation.config`)
    const nationConfig = moduleConfig.nationConfig as NationConfig

    const router = createMemoryRouter(nationConfig.routes, {
      basename: `/${lang}`,
      initialEntries: ['/', url],
      initialIndex: 1
    })

    return await renderHtmlPromise(
      <Root lang={lang} helmetContext={helmetContext}>
        <RouterProvider router={router}></RouterProvider>
      </Root>
    )
  } catch (error) {
    console.error('服务端渲染失败', error)
    return ''
  }
}

export function renderHtmlPromise(children: React.ReactNode) {
  return new Promise<string>((resolve, reject) => {
    let htmlChunkData = ''
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        htmlChunkData += chunk.toString()
        callback()
      }
    })
    const stream = renderToPipeableStream(children, {
      onAllReady() {
        stream.pipe(writableStream)
      },
      onShellError(err) {
        reject(err)
      }
    })
    writableStream.on('finish', () => {
      resolve(htmlChunkData)
    })
    writableStream.on('error', reject)
  })
}
