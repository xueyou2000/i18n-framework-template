import type { RouteObject } from 'react-router-dom'

/**
 * 国家配置
 */
export interface NationConfig {
  /** 路由配置 */
  routes: RouteObject[]
  /** 货币符号 */
  currencySymbol: string
}

/**
 * 路由通用配置
 */
export interface RouteCommonProps {
  /** 渲染路径，匹配路由，比如 /home */
  url: string
  /** 渲染国家-语言 */
  lang: string
}
