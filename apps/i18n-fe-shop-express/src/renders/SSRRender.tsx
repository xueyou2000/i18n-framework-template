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
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'

import { RouteCommonProps } from '@/types'
import { initI18nSSR, isMatchRoute } from '@/utils'

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
  const { locale, fetchRequest, helmetContext } = props

  try {
    const moduleConfig = await import(`../locals/${locale}/nation.config`)
    const { nationConfig, nationRoutes } = moduleConfig

    const handler = createStaticHandler(nationRoutes, { basename: `/${locale}` })
    const context = (await handler.query(fetchRequest)) as StaticHandlerContext
    const router = createStaticRouter(handler.dataRoutes, context)

    const lang = nationConfig.lang
    const bundledResources = {
      [lang]: {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        translation: require(`../locals/${locale}/translation.json`)
      }
    }
    await initI18nSSR(lang, bundledResources)
    // const { t: get } = useTranslation()

    // require(`dayjs/locale/${nationRoutesConfig.dayjsLocal}`)
    // dayjs.locale(nationRoutesConfig.dayjsLocal)

    return renderToString(
      <I18nextProvider i18n={i18next}>
        <Root nationConfig={nationConfig} helmetContext={helmetContext}>
          <StaticRouterProvider router={router} context={context}></StaticRouterProvider>
        </Root>
      </I18nextProvider>
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
  const { url, locale, helmetContext } = props

  try {
    const moduleConfig = await import(`../locals/${locale}/nation.config`)
    const { nationConfig, nationRoutes } = moduleConfig

    const router = createMemoryRouter(nationRoutes, {
      basename: `/${locale}`,
      initialEntries: ['/', url],
      initialIndex: 1
    })

    return await renderHtmlPromise(
      <Root nationConfig={nationConfig} helmetContext={helmetContext}>
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
