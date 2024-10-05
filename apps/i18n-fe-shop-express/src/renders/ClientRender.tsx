import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { getCurrentLanguage } from '@packages/utils'

import { Root } from './Root'
import { NationConfig } from '@/types'

import { fixLazyRoutes } from './utils'

export async function setupClientApp(nationConfig: NationConfig) {
  const container = document.getElementById('root')
  const lang = getCurrentLanguage()
  if (container) {
    // 或如root根节点内容
    const childNodes = container?.childNodes || []
    // 忽略ssr占位符注释, 判断是否有ssr预渲染内容，有则进行水合
    const isClientRender = childNodes?.length === 1 && childNodes[0]?.nodeType === 8
    let routes = nationConfig.routes

    if (!isClientRender) {
      // 服务端水合渲染需处理lazy路由, 注意此处是异步的，必须要加载完成
      routes = await fixLazyRoutes(routes, lang)
    }
    const router = createBrowserRouter(routes, { basename: `/${lang}` })
    const rootElement = (
      <Root lang={lang}>
        <RouterProvider router={router} />
      </Root>
    )

    if (isClientRender) {
      // 纯客户端渲染
      const root = createRoot(container)
      root.render(rootElement)
    } else {
      hydrateRoot(container, rootElement, {
        onRecoverableError(error) {
          console.log('>>> hydrate 水合失败', error)
        }
      })
    }
  }
}
