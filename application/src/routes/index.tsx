import { LoadingFallback, ErrorBoundary } from '@/components'
import type { RouteObject } from 'react-router'

export const routes: Array<RouteObject> = [
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    HydrateFallback: LoadingFallback,
    children: [
      {
        index: true,
        lazy: () => import(/* webpackChunkName: "indexpage" */ '../pages/Index'),
        chunkName: 'indexpage'
      },
      {
        path: 'home',
        lazy: () => import(/* webpackChunkName: "home" */ '../pages/Home'),
        chunkName: 'home'
      },
      {
        path: 'performance',
        lazy: () => import(/* webpackChunkName: "performance" */ '../pages/PerformanceContrast'),
        chunkName: 'performance'
      },
      {
        path: 'about',
        children: [
          {
            index: true,
            lazy: () => import(/* webpackChunkName: "about" */ '../pages/About'),
            chunkName: 'about'
          },
          {
            path: ':id',
            lazy: () => import(/* webpackChunkName: "about" */ '../pages/About'),
            chunkName: 'about'
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <ErrorBoundary pageNotFound />,
    HydrateFallback: LoadingFallback
  }
]
