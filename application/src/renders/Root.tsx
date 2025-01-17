import { PropsWithChildren, StrictMode } from 'react'
import { HelmetProvider, Helmet, HelmetServerState } from 'react-helmet-async'

import { NationConfig } from '@/types'
import { useAppContext } from '@/context/AppContext'
import { assetPrefix, isDevMode } from '@/constants/env'

import '@/assets/styles/reset.scss'
import '@/assets/styles/themes/index.scss'

export interface RootProps {
  /** 国家配置 */
  nationConfig: NationConfig
  /** seo meta等信息 */
  helmetContext?: { helmet?: HelmetServerState }
  /** 是否是服务端渲染 */
  isSSR?: boolean
}

export function initServiceWorker(locale: string) {
  if (!isDevMode) {
    if (global.navigator && 'serviceWorker' in global.navigator) {
      global.navigator.serviceWorker
        .register(`${assetPrefix}${locale}/service-worker.js`)
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope)
        })
        .catch((err) => {
          console.log('ServiceWorker registration failed: ', err)
        })
    }
  }
}

export function Root(props: PropsWithChildren<RootProps>) {
  const { helmetContext, children, nationConfig } = props
  const theme = useAppContext((state) => state.theme)

  return (
    <HelmetProvider context={helmetContext}>
      <Helmet prioritizeSeoTags htmlAttributes={{ 'data-theme': theme, 'data-locale': nationConfig.locale }}>
        <meta name='description' content='A simple React app with server-side rendering' />
      </Helmet>
      <StrictMode>
        {/* 不能使用 Suspense 包裹，因为ssr时路由会预加载，导致水合错误 */}
        {children}
      </StrictMode>
    </HelmetProvider>
  )
}
