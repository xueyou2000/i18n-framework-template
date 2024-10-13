import { PropsWithChildren, StrictMode } from 'react'
import { HelmetProvider, Helmet, HelmetServerState } from 'react-helmet-async'

import { isDevMode } from '@/constants/env'

import '@/assets/styles/themes/index.scss'

interface RootProps {
  lang: string
  /** seo meta等信息 */
  helmetContext?: { helmet?: HelmetServerState }
}

if (!isDevMode) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
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
  const { lang, children, helmetContext } = props
  // TODO: 注入一些context全局上下文

  return (
    <HelmetProvider context={helmetContext}>
      <Helmet prioritizeSeoTags htmlAttributes={{ lang, 'data-lang': lang }}>
        <title>ssr</title>
        <meta name="description" content="A simple React app with server-side rendering" />
      </Helmet>
      <StrictMode>{children}</StrictMode>
    </HelmetProvider>
  )
}
