import { RouteObject } from 'react-router-dom'

import { ErrorBoundary } from '@/components'

export const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    lazy: () => import(/* webpackChunkName: "indexpage" */ '../pages/Index')
  },
  {
    path: '/home',
    errorElement: <ErrorBoundary />,
    lazy: () => import(/* webpackChunkName: "home" */ '../pages/Home')
  },
  {
    path: '/about',
    errorElement: <ErrorBoundary />,
    lazy: () => import(/* webpackChunkName: "about" */ '../pages/About')
  },
  {
    path: '*',
    errorElement: <ErrorBoundary />
  }
]
