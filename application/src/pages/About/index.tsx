import { use, Usable } from 'react'
import { LoaderFunctionArgs, useLoaderData } from 'react-router'

import { Nav } from '../Index/Nav'

import './index.scss'

interface LoaderData {
  date: string
  url: string
  aboutId?: string
  reviews: number
}

interface AboutRouteParams {
  id: string
}

function sleep(ms: number) {
  return new Promise<number>((r) => setTimeout(() => r(10), ms))
}

/**
 * 路由预加载数据
 */
export async function loader(args: LoaderFunctionArgs<AboutRouteParams>): Promise<LoaderData> {
  // 注意这里直接返回promise, 在About组件中使用Await组件来获取数据
  const reviews = await sleep(1000)

  return {
    date: new Date().toLocaleString(),
    url: args.request?.url,
    aboutId: args.params?.id,
    reviews
  }
}

interface AwaitProps<Resolve> {
  children: (data: Resolve) => React.ReactNode
  resolve: Usable<Resolve>
}

export function Await2<Resolve>({ children, resolve }: AwaitProps<Resolve>) {
  const resolvedReviews = use(resolve)
  return children(resolvedReviews)
}

export default function About() {
  const { date, url, aboutId, reviews } = useLoaderData() as LoaderData
  // const resolvedReviews = use(reviews)

  // Await组件不支持react19, react19请直接使用 use(reviews) 获取数组. see https://reactrouter.com/how-to/suspense#1-return-a-promise-from-loader

  return (
    <div className='about-page page-layout'>
      <Nav />

      <h1>关于</h1>

      <p>date: {date}</p>
      <p>url: {url}</p>
      <p>reviews: {reviews}</p>
      <p>aboutId: {aboutId ?? '通过访问/about/123 路由查看'}</p>
      {/* <Suspense fallback={<div>数据加载...</div>}>
        <Await resolve={reviews} errorElement={<div>Could not load reviews 😬</div>}>
          {(resolvedReviews) => <div>{JSON.stringify(resolvedReviews)}</div>}
        </Await>
        <Await2 resolve={reviews}>{(resolvedReviews) => <p>reviews: {resolvedReviews}</p>}</Await2>
      </Suspense> */}
    </div>
  )
}

export const element = <About />
