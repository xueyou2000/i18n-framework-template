import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router'

import { assetPrefix, isDevMode } from '@/constants/env'
import { useAppContext } from '@/context/AppContext'
import { NationConfig } from '@/types'
import { fixLazyRoutes, getCurrentLanguage } from '@/utils'

import { Root, initServiceWorker } from './Root'

export async function setupClientApp(nationConfig: NationConfig, routes: RouteObject[]) {
  const container = document.getElementById('root')
  const locale = getCurrentLanguage(window.location.pathname, assetPrefix)

  if (container) {
    // 获取root根节点内容
    const childNodes = container?.childNodes || []
    // 忽略ssr占位符注释, 判断是否有ssr预渲染内容，有则进行水合
    const isClientRender = childNodes?.length === 1 && childNodes[0]?.nodeType === 8

    if (!isClientRender) {
      // 服务端水合渲染需处理lazy路由, 注意此处是异步的，必须要加载完成。否则水合时会有2份一样的dom
      routes = await fixLazyRoutes(routes, assetPrefix, locale)
    }

    useAppContext.setState({ isHydrated: !isClientRender, nationConfig })
    initServiceWorker(locale)

    const router = createBrowserRouter(routes, { basename: `${assetPrefix}${locale}` })
    const rootElement = (
      <Root nationConfig={nationConfig}>
        <RouterProvider router={router} />
      </Root>
    )

    if (isClientRender) {
      // 纯客户端渲染
      const root = createRoot(container)
      root.render(rootElement)
    } else {
      // 水合渲染
      hydrateRoot(container, rootElement, {
        onRecoverableError(error, errorInfo) {
          if (isDevMode) {
            console.log('hydrate failed', errorInfo)
            console.error(error)
          }
        }
      })
    }
  }
}
