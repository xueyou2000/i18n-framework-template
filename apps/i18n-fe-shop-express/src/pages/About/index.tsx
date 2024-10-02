import { Link } from 'react-router-dom'

import './index.scss'

export default function About() {
  return (
    <div className="about-page">
      <h1>About</h1>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>
      <p>about page</p>

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
