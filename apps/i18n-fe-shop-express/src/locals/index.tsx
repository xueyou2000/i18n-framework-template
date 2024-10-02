import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { getCurrentLanguage } from '@packages/utils'

import { getRoutes } from '@/routes'

export function setupApp() {
  const container = document.getElementById('root')
  const lang = getCurrentLanguage()
  if (container) {
    console.log('>>> lang', lang)
    // TODO: ssr时用hydrateRoot, 非ssr用createRoot
    const root = createRoot(container)
    root.render(
      <StrictMode>
        <RouterProvider router={getRoutes(`/${lang}`)} />
      </StrictMode>
    )
  }
}
