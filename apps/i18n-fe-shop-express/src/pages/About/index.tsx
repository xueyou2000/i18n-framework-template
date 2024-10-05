import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { log } from '@packages/utils'

import './index.scss'

interface LoaderData {
  date: string
  url: string
  aboutId?: string
}

interface AboutRouteParams {
  id: string
}

/**
 * 路由预加载数据
 */
export const loader = async (args: LoaderFunctionArgs<AboutRouteParams>): Promise<LoaderData> => {
  await new Promise((r) => setTimeout(r, 500))
  return {
    date: new Date().toISOString(),
    url: args.request?.url,
    aboutId: args.params?.id
  }
}

export default function About() {
  const data = useLoaderData() as LoaderData

  function handleClick() {
    log.info('>>> click')
  }

  return (
    <div className="about-page">
      <h1>About {data?.date}</h1>
      <p>{data?.aboutId}</p>
      <p>预加载数据 {data?.url}</p>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>

      <button onClick={handleClick}>Click Me</button>

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

export const element = <About />
