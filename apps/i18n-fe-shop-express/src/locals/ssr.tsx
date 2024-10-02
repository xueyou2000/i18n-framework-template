import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { routes } from '@/routes'

export interface SSRRenderProps {
  /** 渲染路径，匹配路由，比如 /home */
  url: string
  /** 渲染国家-语言 */
  lang: string
}

export function renderHTML(props: SSRRenderProps) {
  const { url, lang } = props
  console.log('>>> lang', lang)
  // TODO: ssr时用hydrateRoot, 非ssr用createRoot
  const router = createMemoryRouter(routes, {
    basename: `/${lang}`,
    initialEntries: ['/', url],
    initialIndex: 1
  })
  return renderToString(
    <StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </StrictMode>
  )
}
