import { matchRoutes, RouteObject } from 'react-router-dom'

/**
 * 预加载lazy路由
 * @description 此步骤非常重要, 不过没有此步骤，那么会保留服务端渲染的内容，客户端会又渲染一份dom!!!
 */
export async function fixLazyRoutes(routes: RouteObject[], lang: string) {
  // 确定是否有任何初始路由是惰性的
  const lazyMatches = matchRoutes(routes, window.location.pathname, `/${lang}`)?.filter(
    (m) => m.route.lazy
  )

  // 在创建路由器之前加载惰性匹配并更新路由
  // 这样我们就可以同步合成ssr渲染的内容
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy!()
        Object.assign(m.route, { ...routeModule, lazy: undefined })
      })
    )
  }

  return routes
}
