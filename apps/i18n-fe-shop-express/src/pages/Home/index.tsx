import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

export default function Home() {
  const data = useLoaderData() as LoaderData
  const { t } = useTranslation()

  return (
    <div className="home-page">
      <h1>Home {data?.date}</h1>
      <p>预加载数据 {data?.url}</p>
      <p>国际化: {t('hello')}</p>
      <p>Home page</p>
      <p>Home page</p>
      <p>Home page</p>
      <p>Home page</p>
      <p>Home page</p>
      <p>Home page</p>

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

export const element = <Home />
