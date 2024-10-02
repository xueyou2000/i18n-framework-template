import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Writable } from 'node:stream'

import { routes } from '@/routes'

export interface SSRRenderProps {
  /** 渲染路径，匹配路由，比如 /home */
  url: string
  /** 渲染国家-语言 */
  lang: string
}

export function renderHTML(props: SSRRenderProps) {
  const { url, lang } = props
  console.log('>>> lang', lang)
  // TODO: ssr时用hydrateRoot, 非ssr用createRoot
  const router = createMemoryRouter(routes, {
    basename: `/${lang}`,
    initialEntries: ['/', url],
    initialIndex: 1
  })

  let collectedData = ''
  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      collectedData += chunk.toString()
      callback()
    }
  })

  return new Promise<string>((resolve, reject) => {
    // const html = ''
    const stream = renderToPipeableStream(
      <StrictMode>
        <RouterProvider router={router}></RouterProvider>
      </StrictMode>,
      {
        onAllReady() {
          // 在这里开始收集数据
          stream.pipe(writableStream)
        },
        // onShellReady() {
        //   // 使用 pipeline 将 PipeableStream 转换为字符串
        //   const pipelinePromise = promisify(pipeline)

        //   pipelinePromise(stream as any, (chunk) => {
        //     html += chunk.toString()
        //   })
        //     .then(() => {
        //       resolve(html)
        //     })
        //     .catch((err) => {
        //       reject(err)
        //     })
        // },
        onShellError(err) {
          reject(err)
        }
      }
    )

    writableStream.on('finish', () => {
      resolve(collectedData)
    })
    writableStream.on('error', reject)
  })
}
