import { Writable } from 'node:stream'
// import { renderToString } from 'react-dom/server'
import { createMemoryRouter, matchRoutes, RouterProvider } from 'react-router-dom'

import { NationConfig } from '@/types'
import { renderToPipeableStream } from 'react-dom/server'
import { Root } from './Root'

export interface SSRRenderProps {
  /** 渲染路径，匹配路由，比如 /home */
  url: string
  /** 渲染国家-语言 */
  lang: string
}

export async function isMatchRoute(props: SSRRenderProps) {
  const { url, lang } = props
  try {
    const moduleConfig = await import(`../locals/${lang}/nation.config`)
    const nationConfig = moduleConfig.nationConfig as NationConfig
    const matchRouteList = matchRoutes(nationConfig.routes, url, `/${lang}`)

    return !!matchRouteList?.length
  } catch {
    return false
  }
}

export async function renderHTML(props: SSRRenderProps) {
  const { url, lang } = props

  try {
    const moduleConfig = await import(`../locals/${lang}/nation.config`)
    const nationConfig = moduleConfig.nationConfig as NationConfig

    const router = createMemoryRouter(nationConfig.routes, {
      basename: `/${lang}`,
      initialEntries: ['/', url],
      initialIndex: 1
    })

    // 使用renderToPipeableStream渲染，配合数据路由会有 Warning: useLayoutEffect does nothing on the server 警告，暂时不清楚如何解决
    // 使用 RouterProvider, Link 组件都会有这种警告
    return await renderHtmlPromise(
      <Root lang={lang}>
        <RouterProvider router={router}></RouterProvider>
      </Root>
    )

    // tips: 由于使用了react-router-dom 的数据路由配置，使用了loader, lazy等特性，所以不能用普通的renderToString
    // return renderToString(
    //   <Root lang={lang}>
    //     <StaticRouter location={url} basename={`/${lang}`}>
    //       {renderMatches(matchRouteList)}
    //     </StaticRouter>
    //   </Root>
    // )
  } catch (error) {
    console.error('服务端渲染失败', error)
    return ''
  }
}

export function renderHtmlPromise(children: React.ReactNode) {
  return new Promise<string>((resolve, reject) => {
    let htmlChunkData = ''
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        htmlChunkData += chunk.toString()
        callback()
      }
    })
    const stream = renderToPipeableStream(children, {
      onAllReady() {
        stream.pipe(writableStream)
      },
      onShellError(err) {
        reject(err)
      }
    })
    writableStream.on('finish', () => {
      resolve(htmlChunkData)
    })
    writableStream.on('error', reject)
  })
}
