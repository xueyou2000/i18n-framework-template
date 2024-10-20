import { setupClientApp } from '@/renders/ClientRender'
import { initI18nClient } from '@/utils'

import { nationConfig, nationRoutes } from './nation.config'

// import 'dayjs/locale/zh-cn'

const lang = nationConfig.lang
const bundledResources = {
  [lang]: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    translation: require('./translation.json')
  }
}

initI18nClient(nationConfig.locale, lang, bundledResources, () => {
  setupClientApp(nationConfig, nationRoutes)
})
