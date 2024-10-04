import { Link } from 'react-router-dom'

import './index.scss'

export function Home() {
  return (
    <div className="home-page">
      <h1>Home</h1>
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

export const Component = Home

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loader({ request }: any) {
  console.log('>>> home loader', request)
  return { name: 'test home' }
}
