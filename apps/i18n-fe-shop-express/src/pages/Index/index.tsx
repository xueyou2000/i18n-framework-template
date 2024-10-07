import { memo, PropsWithChildren, useMemo } from 'react'
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { logger } from '@packages/utils'

import { useStoreDemo } from '@/stores'

import './index.scss'

interface LoaderData {
  date: string
  url: string
}

/**
 * 路由预加载数据
 */
export const loader = async (args: LoaderFunctionArgs): Promise<LoaderData> => {
  await new Promise((r) => setTimeout(r, 500))
  return {
    date: new Date().toISOString(),
    url: args.request?.url
  }
}

const Box = memo(({ children }: PropsWithChildren) => {
  logger.info('Box渲染')
  return <div>{children}</div>
})
Box.displayName = 'Box'

// const CounterShow = memo(() => {
//   const { count } = useStoreDemo()
//   return <div>{count}</div>
// })
// CounterShow.displayName = 'CounterShow'

/**
 * 由于CounterShow在使用时被useMemo了，所以这里省略了memo化
 */
function CounterShow() {
  const { count } = useStoreDemo()
  return <div>{count}</div>
}

export default function Index() {
  const data = useLoaderData() as LoaderData
  const { count, inc } = useStoreDemo()

  /** CounterShow内部的状态是订阅模式，并不依赖context等state */
  const counter = useMemo(() => <CounterShow />, [])

  logger.info('Index渲染', `count=${count}`, '6666')

  return (
    <div className="index-page">
      <h1>Index {data?.date}</h1>
      <p>预加载数据 {data?.url}</p>
      <Box>{counter}</Box>
      <p>用useMemo包裹, 因为children会每次都是新的</p>
      <button onClick={inc}>inc</button>
      <p>Index page</p>
      <p>Index page</p>
      <p>Index page</p>
      <p>Index page</p>
      <p>Index page</p>
      <p>Index page</p>

      <menu>
        <ul>
          <li>
            <Link to="/">Index</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </menu>
    </div>
  )
}

export const element = <Index />
