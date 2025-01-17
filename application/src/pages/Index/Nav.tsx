import { Spinner } from '@/components'
import type { ReactNode } from 'react'
import { memo } from 'react'
import { NavLinkRenderProps, NavLink as RouterLink } from 'react-router'

import './common.scss'

// 定义 CustomLink 的 props 类型
interface CustomLinkProps {
  to: string
  label: string
  children?: React.ReactNode | ((props: NavLinkRenderProps) => ReactNode)
}

// 使用 memo 包裹 CustomLink 组件并添加 displayName
const CustomLink = memo(function CustomLink({ to, label, children }: CustomLinkProps) {
  return (
    <RouterLink to={to} viewTransition aria-label={label} role='link'>
      {children || label}
    </RouterLink>
  )
})

export const Nav = memo(function Nav() {
  return (
    <nav className='nav'>
      <ul>
        <li>
          <CustomLink to='/' label='Index' />
        </li>
        <li>
          <CustomLink to='/home' label='Home' />
        </li>
        <li>
          <CustomLink to='/performance' label='Performance' />
        </li>
        <li>
          <CustomLink to='/about' label='About'>
            {({ isPending }) => <span>About {isPending && <Spinner />}</span>}
          </CustomLink>
        </li>
      </ul>
    </nav>
  )
})
