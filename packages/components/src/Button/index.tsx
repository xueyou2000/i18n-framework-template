import { memo } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

import { Spinner } from '../Spinner'

import './index.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  prefixCls?: string
  className?: string
  loading?: boolean
  backgroundColor?: string
}

export const Button = memo(function Button(props: ButtonProps) {
  const { prefixCls = 'button', className, loading, children, backgroundColor, ...reset } = props
  return (
    <button
      type='button'
      className={classNames(prefixCls, className, { [`${prefixCls}-pending`]: loading })}
      style={{ backgroundColor }}
      {...reset}
    >
      {children} {loading && <Spinner />}
    </button>
  )
})
