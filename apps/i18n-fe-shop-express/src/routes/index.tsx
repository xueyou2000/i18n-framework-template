import { RouteObject } from 'react-router-dom'

import { ErrorBoundary } from '@/components'

export const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        lazy: () => import(/* webpackChunkName: "indexpage" */ '../pages/Index')
      },
      {
        path: 'home',
        lazy: () => import(/* webpackChunkName: "home" */ '../pages/Home')
      },
      {
        path: 'about',
        children: [
          {
            index: true,
            lazy: () => import(/* webpackChunkName: "about" */ '../pages/About')
          },
          {
            path: ':id',
            lazy: () => import(/* webpackChunkName: "about" */ '../pages/About')
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <ErrorBoundary />
  }
]
