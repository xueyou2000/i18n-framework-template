import { Link } from 'react-router-dom'

import './index.scss'

export function About() {
  function handleClick() {
    console.log('>>> click')
  }

  return (
    <div className="about-page">
      <h1>About</h1>
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

export const Component = About

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loader({ request }: any) {
  console.log('>>> About loader', request)
  return { name: 'About test' }
}
