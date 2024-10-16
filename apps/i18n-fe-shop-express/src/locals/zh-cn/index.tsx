import { setupClientApp } from '@/renders/ClientRender'

import { nationConfig } from './nation.config'

import 'dayjs/locale/zh-cn'

// const currentLocale = 'zh-cn'
// const bundledResources = {
//   [currentLocale]: {
//     translation: require('@/src/translation/zh-cn.json')
//   }
// }

setupClientApp(nationConfig)
