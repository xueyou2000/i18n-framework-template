import { RouteCommonProps } from '@/types'
import { matchRoutes, RouteObject, RouteMatch } from 'react-router'

/**
 * 路由是否匹配
 * @description 用于本地服务器根据路径判断是否服务端渲染，或者仅仅返回静态文件
 */
export async function isMatchRoute(props: RouteCommonProps, assetPrefix: string) {
  const { url, locale } = props
  try {
    if (url === `/${locale}/manifest.json`) {
      return false
    }

    const moduleConfig = await import(`../../locals/${locale}/nation.config`)
    const nationRoutes = moduleConfig.nationRoutes as RouteObject[]
    const matchRouteList = matchRoutes(nationRoutes, url, `${assetPrefix}${locale}`)?.filter((m) => m.route.path !== '*')

    return !!matchRouteList?.length
  } catch {
    return false
  }
}

/**
 * 预加载lazy路由
 * @description 此步骤非常重要, 不过没有此步骤，那么会保留服务端渲染的内容，客户端会又渲染一份dom!!!
 */
export async function fixLazyRoutes(routes: RouteObject[], assetPrefix: string, locale: string) {
  // 确定是否有任何初始路由是惰性的
  const lazyMatches = matchRoutes(routes, window.location.pathname, `${assetPrefix}${locale}`)

  // 递归加载惰性路由
  const preloadLazyRoutes = async (route: RouteObject) => {
    if (route.lazy) {
      const routeModule = await route.lazy!()
      Object.assign(route, { ...routeModule, lazy: undefined })
    }
    // if (route.children) {
    //   await Promise.all(route.children.map(preloadLazyRoutes))
    // }
  }

  // 在创建路由器之前加载惰性匹配并更新路由
  if (lazyMatches && lazyMatches.length > 0) {
    await Promise.all(lazyMatches.map((m) => preloadLazyRoutes(m.route)))
  }

  return routes
}

/**
 * 匹配最终路由
 * 原始matchRoutes方法会返回多个，包含父路由
 */
export function matchBestRoute(
  routes: RouteObject[],
  url: string,
  assetPrefix: string,
  locale: string
): RouteMatch<string, RouteObject> | null {
  const matchRouteList = matchRoutes(routes, url, `${assetPrefix}${locale}`)
  return matchRouteList?.length ? matchRouteList[matchRouteList.length - 1] : null
}

/**
 * 扁平提取路由paths
 */
export const flattenRoutes = (routes: Array<RouteObject>, parentPath: string = ''): string[] => {
  let flatPaths: string[] = []

  routes.forEach((route) => {
    if (route.path === '*' || !route.path || route.path.includes(':')) {
      return
    }
    const currentPath = `${parentPath}${route.path}`
    flatPaths.push(currentPath)

    if (route.children) {
      flatPaths = flatPaths.concat(flattenRoutes(route.children, currentPath))
    }
  })

  return flatPaths
}
