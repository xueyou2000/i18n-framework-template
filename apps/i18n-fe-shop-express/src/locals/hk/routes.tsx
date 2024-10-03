import { RouteObject } from 'react-router-dom'

// const Index = () => import(/* webpackChunkName: "index" */ '../../pages/Index')
// const Home = () => import(/* webpackChunkName: "home" */ '../../pages/Home')
// const About = () => import(/* webpackChunkName: "about" */ '../../pages/About')

/**
 * 想要在构建时优化掉未使用的路由，则必须写一个rspack插件，让其动态生成路由.js文件，否则做不到
 * 只有字符串的if判断可以被树摇优化   process.env.CLIENT_PATH === '/home'  只有死代码可以被优化，.include() 这种要js运行的不可以
 */

const matchRoutePaths = JSON.parse(process.env.CLIENT_ARR || '') || []
const routes: RouteObject[] = [
  {
    path: '/'
  },
  {
    path: '/home'
  },
  {
    path: '/about'
  }
]

export const optimizeRoutes: RouteObject[] = routes.filter((route) =>
  matchRoutePaths.includes(route.path)
)
