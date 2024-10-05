import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'

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

export default function Index() {
  const data = useLoaderData() as LoaderData

  return (
    <div className="index-page">
      <h1>Index {data?.date}</h1>
      <p>预加载数据 {data?.url}</p>
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
