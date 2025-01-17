import 'react-router'

declare module 'react-router' {
  interface IndexRouteObject {
    /** 需要与webpackChunkName一致, 用于服务端渲染提前加载对应路由的样式问题 */
    chunkName?: string
  }

  interface NonIndexRouteObject {
    /** 需要与webpackChunkName一致, 用于服务端渲染提前加载对应路由的样式问题 */
    chunkName?: string
  }
}
