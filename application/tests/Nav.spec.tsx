import { render, screen } from '@testing-library/react'
import { Nav } from '../src/pages/Index/Nav'
import { MemoryRouter } from 'react-router'

test('Renders the Nav component', () => {
  // 由于 Nav 组件中使用了 RouterLink, RouterLink有使用了useLocation(), 所以必须在路由上下文中
  render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>
  )
  expect(screen.getByText('Index')).toBeInTheDocument()
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Performance')).toBeInTheDocument()
  expect(screen.getByText('About')).toBeInTheDocument()
})
