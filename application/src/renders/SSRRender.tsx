import i18next from 'i18next'
import { Writable } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { createStaticHandler, createStaticRouter, StaticHandlerContext, StaticRouterProvider } from 'react-router'

import { assetPrefix } from '@/constants/env'
import { RouteCommonProps } from '@/types'
import { flattenRoutes, initI18nSSR, isMatchRoute, matchBestRoute } from '@/utils'

import { Root, RootProps, initServiceWorker } from './Root'
import { useAppContext } from '@/context/AppContext'

export interface SSRRenderProps extends RouteCommonProps, Pick<RootProps, 'helmetContext'> {}

/**
 * 官方推荐的ssr渲染方式
 */

export async function renderHTMLByRequest(props: SSRRenderProps & { fetchRequest: Request }): Promise<string> {
  const { fetchRequest, helmetContext, locale } = props

  try {
    const moduleConfig = await import(`../locals/${locale}/nation.config`)
    const { nationConfig, nationRoutes } = moduleConfig

    const handler = createStaticHandler(nationRoutes, { basename: `${assetPrefix}${locale}` })
    const context = (await handler.query(fetchRequest)) as StaticHandlerContext
    const router = createStaticRouter(handler.dataRoutes, context)

    // i18n
    const lang = nationConfig.lang
    const bundledResources = {
      [lang]: {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        translation: require(`../locals/${locale}/translation.json`)
      }
    }
    await initI18nSSR(lang, bundledResources)

    useAppContext.setState({ nationConfig })
    initServiceWorker(locale)

    const html = await renderHtmlPromise(
      <I18nextProvider i18n={i18next}>
        <Root helmetContext={helmetContext} isSSR nationConfig={nationConfig}>
          <StaticRouterProvider router={router} context={context}></StaticRouterProvider>
        </Root>
      </I18nextProvider>
    )

    return html
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function matchPreCssUrl(pathname: string, manifestJson: any, locale: string) {
  const moduleConfig = await import(`../locals/${locale}/nation.config`)
  const { nationRoutes } = moduleConfig

  const matchRoute = matchBestRoute(nationRoutes, pathname, assetPrefix, locale)
  if (!matchRoute || !matchRoute.route?.chunkName) {
    return ''
  }
  return getPreCssUrl(manifestJson?.allFiles || [], matchRoute.route?.chunkName)
}

/**
 * 提取需要预加载的页面样式
 */
export function getPreCssUrl(allFiles: string[], chunkName: string) {
  if (!chunkName) {
    return ''
  }

  // 从manifestJson中匹配出对应的 matchRoute?.route?.chunkName.css文件
  // eslint-disable-next-line no-useless-escape
  const regex = new RegExp(`\/${chunkName}(?:\\.[a-zA-Z0-9]+)?\\.css$`)
  return allFiles.find((file: string) => regex.test(file))
}

export async function getRoutePaths(locale: string) {
  const moduleConfig = await import(`../locals/${locale}/nation.config`)
  const { nationRoutes } = moduleConfig
  return flattenRoutes(nationRoutes)
}

export { isMatchRoute }
