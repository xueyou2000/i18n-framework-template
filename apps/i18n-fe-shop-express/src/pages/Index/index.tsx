import { Link } from 'react-router-dom'

import './index.scss'

export default function Index() {
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
