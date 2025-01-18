/**
 * 国家配置
 */
export interface NationConfig {
  /** 站点名称 */
  locale: string
  /** 国家-语言代码 遵循 IETF BCP 47 标准 */
  lang: string
  /** 国家名称 */
  countryName: string
  /** 2位国家代码 */
  countryTwoLetterCode: string
  /** 首都 */
  capital: string
  /** 货币符号 */
  currencySymbol: string
  /** 国际区号, 如: +86 */
  internationalCode: string
}

/**
 * 路由通用配置
 */
export interface RouteCommonProps {
  /** 渲染路径，匹配路由，比如 /home */
  url: string
  /** 渲染市场 */
  locale: string
}
