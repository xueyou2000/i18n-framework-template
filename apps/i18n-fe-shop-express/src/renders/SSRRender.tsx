import { Writable } from 'node:stream'
import { renderToPipeableStream, renderToString } from 'react-dom/server'
import { HelmetServerState } from 'react-helmet-async'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider
} from 'react-router-dom/server'

import { NationConfig, RouteCommonProps } from '@/types'
import { isMatchRoute } from '@/utils'

import { Root } from './Root'

export interface SSRRenderProps extends RouteCommonProps {
  /** seo context, 用于后续替换seo占位符输出最终html内容 */
  helmetContext?: { helmet?: HelmetServerState }
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

/**
 * 流式渲染内容, 传统的renderToString方法不能正常处理Suspense, lazy组件
 */
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

export { isMatchRoute }
