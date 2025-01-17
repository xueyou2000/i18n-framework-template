import { routes } from '@/routes'
import { NationConfig } from '@/types'
import { RouteObject } from 'react-router'

export const nationConfig: NationConfig = {
  locale: 'zh-cn',
  lang: 'zh-CN',
  countryName: 'China',
  countryTwoLetterCode: 'ch',
  capital: 'New Beijing',
  currencySymbol: '¥',
  internationalCode: '+86'
}

export const nationRoutes: RouteObject[] = routes
