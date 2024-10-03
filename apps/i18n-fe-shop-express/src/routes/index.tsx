import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'

import { ErrorBoundary } from '@/components'

function loadable(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Component />
    </Suspense>
  )
}
const matchRoutePaths = JSON.parse(process.env.CLIENT_ARR || '') || []
export const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    element: loadable(lazy(() => import(/* webpackChunkName: "index" */ '../pages/Index')))
  },
  {
    path: '/home',
    errorElement: <ErrorBoundary />,
    element: loadable(lazy(() => import(/* webpackChunkName: "home" */ '../pages/Home')))
  },
  {
    path: '/about',
    errorElement: <ErrorBoundary />,
    element: loadable(lazy(() => import(/* webpackChunkName: "about" */ '../pages/About')))
  }
]

export const optimizeRoutes: RouteObject[] = matchRoutePaths.length
  ? routes.filter((route) => matchRoutePaths.includes(route.path))
  : routes
