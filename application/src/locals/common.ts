import { hasWindowMode, isDevMode } from '@/constants/env'
import { setupClientApp } from '@/renders/ClientRender'
import { NationConfig } from '@/types'
import { initI18nClient } from '@/utils'
import { RouteObject } from 'react-router'
import { scan } from 'react-scan'

if (isDevMode) {
  if (hasWindowMode) {
    scan({
      enabled: true,
      log: false // logs render info to console (default: false)
    })
  }
}

/**
 * 客户端渲染通用入口
 */
export function init(nationConfig: NationConfig, nationRoutes: RouteObject[], translation: object) {
  const lang = nationConfig.lang
  const bundledResources = {
    [lang]: {
      translation
    }
  }
  initI18nClient(nationConfig.locale, lang, bundledResources, () => {
    setupClientApp(nationConfig, nationRoutes)
  })
}
