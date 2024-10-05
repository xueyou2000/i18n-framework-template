import { RouteObject } from 'react-router-dom'

import { ErrorBoundary } from '@/components'

export const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import(/* webpackChunkName: "indexpage" */ '../pages/Index')
  },
  {
    path: '/home',
    lazy: () => import(/* webpackChunkName: "home" */ '../pages/Home')
  },
  {
    path: '/about',
    lazy: () => import(/* webpackChunkName: "about" */ '../pages/About')
  },
  {
    path: '/about/:id',
    lazy: () => import(/* webpackChunkName: "about" */ '../pages/About')
  },
  {
    path: '*',
    errorElement: <ErrorBoundary />
  }
]
