import { routes } from '@/routes'
import { NationConfig } from '@/types'
import { RouteObject } from 'react-router'

export const nationConfig: NationConfig = {
  locale: 'in',
  lang: 'en-IN',
  countryName: 'India',
  countryTwoLetterCode: 'in',
  capital: 'New Delhi',
  currencySymbol: '₹',
  internationalCode: '+91'
}

export const nationRoutes: RouteObject[] = routes
