import { Link, useLoaderData } from 'react-router-dom'

import './index.scss'

export default function Index() {
  const data = useLoaderData()
  console.log('>>> Index useLoaderData', data)
  return (
    <div className="index-page">
      <h1>Index</h1>
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

export const Component = Index

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loader({ request }: any) {
  console.log('>>> Index loader', request)
  return { name: 'test Index' }
}
