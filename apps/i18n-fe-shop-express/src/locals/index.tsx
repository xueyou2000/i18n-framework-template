import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { getCurrentLanguage } from '@packages/utils'

import { routes } from '@/routes'

export function setupApp() {
  const container = document.getElementById('root')
  const lang = getCurrentLanguage()
  if (container) {
    // TODO: ssr时用hydrateRoot, 非ssr用createRoot
    const root = createRoot(container)
    const router = createBrowserRouter(routes, { basename: `/${lang}` })
    root.render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    )
  }
}
