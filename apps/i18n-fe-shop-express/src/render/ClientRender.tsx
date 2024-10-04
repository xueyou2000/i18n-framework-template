import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { getCurrentLanguage } from '@packages/utils'

import { Root } from './Root'
import { NationConfig } from '@/types'

export function setupClientApp(nationConfig: NationConfig) {
  const container = document.getElementById('root')
  const lang = getCurrentLanguage()
  if (container) {
    const router = createBrowserRouter(nationConfig.routes, { basename: `/${lang}` })
    // TODO: 不知道为什么, hydrateRoot会渲染2份，而不是将原有的服务端渲染内容进行水合
    const forceClientRender = true
    if (!forceClientRender && container.hasChildNodes()) {
      console.log(container.innerHTML)
      hydrateRoot(
        container,
        <Root lang={lang}>
          <RouterProvider router={router} />
        </Root>,
        {
          onRecoverableError(error) {
            console.log('>>> 失败', error)
          }
        }
      )
    } else {
      const root = createRoot(container)
      root.render(
        <Root lang={lang}>
          <RouterProvider router={router} />
        </Root>
      )
    }
  }
}
