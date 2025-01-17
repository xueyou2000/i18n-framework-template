import { LoaderFunctionArgs, useLoaderData } from 'react-router'

import { Nav } from '../Index/Nav'

import './index.scss'

interface LoaderData {
  date: string
  url: string
}

/**
 * 路由预加载数据
 */
export const loader = async (args: LoaderFunctionArgs): Promise<LoaderData> => {
  return {
    date: new Date().toLocaleString(),
    url: args.request?.url
  }
}

export default function Home() {
  const data = useLoaderData() as LoaderData

  return (
    <div className='home-page page-layout'>
      <Nav />

      <h1>Home</h1>
      <p>获取loader数据: {JSON.stringify(data || {})}</p>
    </div>
  )
}

export const element = <Home />
