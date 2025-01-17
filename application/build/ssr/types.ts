import { RsbuildInstance } from '@rsbuild/core'
import type { SSRRenderProps } from '../../src/renders/SSRRender'
import type { RouteCommonProps } from '../../src/types'

export type GetHtmlTemplate = () => Promise<string>

export type RsbuildDevServer = Awaited<ReturnType<RsbuildInstance['createDevServer']>>

export interface SSRRenderModuleType {
  renderHTMLByRequest: (props: SSRRenderProps & { fetchRequest: Request }) => Promise<string>
  isMatchRoute: (props: RouteCommonProps, assetPrefix: string) => Promise<boolean>
  matchPreCssUrl: (pathname: string, manifestJson: ManifestJson, locale: string) => Promise<string | undefined>
  getPreCssUrl: (allFiles: string[], chunkName: string) => string | undefined
  getRoutePaths: (locale: string) => Promise<string[]>
}

export interface ManifestJson {
  [chunkName: string]: string[]
  allFiles: string[]
}

export interface SSRRenderOptions {
  getHtmlTemplate: GetHtmlTemplate
  manifest?: ManifestJson
  locale: string
}
