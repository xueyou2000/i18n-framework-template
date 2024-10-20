import { PropsWithChildren, StrictMode } from 'react'
import { HelmetProvider, Helmet, HelmetServerState } from 'react-helmet-async'

import { GlobalContext } from '@/context'
import { isDevMode } from '@/constants/env'
import { NationConfig } from '@/types'

import '@/assets/styles/themes/index.scss'

interface RootProps {
  /** 国家配置 */
  nationConfig: NationConfig
  /** seo meta等信息 */
  helmetContext?: { helmet?: HelmetServerState }
}

if (!isDevMode) {
  if (global.navigator && 'serviceWorker' in global.navigator) {
    global.navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed: ', err)
      })
  }
}

export function Root(props: PropsWithChildren<RootProps>) {
  const { nationConfig, children, helmetContext } = props

  return (
    <HelmetProvider context={helmetContext}>
      <Helmet prioritizeSeoTags htmlAttributes={{ 'data-locale': nationConfig.locale }}>
        <title>ssr</title>
        <meta name="description" content="A simple React app with server-side rendering" />
      </Helmet>
      <StrictMode>
        <GlobalContext.Provider value={{ nationConfig }}>{children}</GlobalContext.Provider>
      </StrictMode>
    </HelmetProvider>
  )
}
