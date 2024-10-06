import { memo } from 'react'
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'

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

const Box = memo(() => {
  console.log('Box render')
  return (
    <div>
      <CounterShow />
    </div>
  )
})
Box.displayName = 'Box'

const CounterShow = memo(() => {
  const { count } = useStoreDemo()
  return <div>{count}</div>
})
CounterShow.displayName = 'CounterShow'

export default function Index() {
  const data = useLoaderData() as LoaderData
  const { inc } = useStoreDemo()

  return (
    <div className="index-page">
      <h1>Index {data?.date}</h1>
      <p>预加载数据 {data?.url}</p>
      <Box />
      <p>
        由于是订阅模式, 不是context,
        所以Box内部的CounterShow会更新,但是Box并不会重新选热,连render函数都不会再次运行
      </p>
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
