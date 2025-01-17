import classNames from 'classnames'
import { memo } from 'react'
import type { PropsWithChildren, CSSProperties } from 'react'

export interface FlexProps {
  prefixCls?: string
  className?: string
  justifyContent?: CSSProperties['justifyContent']
  alignItems?: CSSProperties['alignItems']
  direction?: CSSProperties['flexDirection']
}

/**
 * 不推荐使用组件的方式, 虽然复用性和可维护性提升了,但是会编译成更多的js文件.
 * 推荐将常用的css抽离公共css, 然后在页面中直接使用css类名
 */
export const Flex = memo(function Flex(props: PropsWithChildren<FlexProps>) {
  const { prefixCls = 'flex', className, children, justifyContent, alignItems, direction } = props

  return (
    <div
      className={classNames(prefixCls, className, {
        [`${prefixCls}-justify-${justifyContent}`]: justifyContent,
        [`${prefixCls}-align-${alignItems}`]: alignItems,
        [`${prefixCls}-direction-${direction}`]: direction
      })}
    >
      {children}
    </div>
  )
})
