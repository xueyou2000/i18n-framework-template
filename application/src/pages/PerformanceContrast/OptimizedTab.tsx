// 经过优化的Tab组件
import classNames from 'classnames'
import { memo, useTransition, useMemo } from 'react'

import { TabItemProps, TabProps } from './types'
import { useControllerState } from '@packages/utils'

// 由于 onClick 函数永远传递新的， 所以这里使用memo优化无意义
function TabItemInner(props: TabItemProps) {
  const { tabKey, title, isActive, onClick } = props
  // 将切换tab操作包裹在startTransition中， 以实现非阻塞的切换
  const [isPending, startTransition] = useTransition()

  console.log(`title=[${title}] isActive=[${isActive}]`)

  if (isActive) {
    return <b className='tab-item active'>{title}</b>
  }
  return (
    <button
      type='button'
      className={classNames('tab-item', { active: isActive, pending: isPending })}
      onClick={() => startTransition(() => onClick?.(tabKey))}
    >
      {title}
    </button>
  )
}

const TabItem = memo(TabItemInner)
function OptimizedTabInner(props: TabProps) {
  const { defaultValue, tabs } = props
  // TODO: 这里不能是受控组件，否则会触发不必要的重新渲染
  const [value, setValue] = useControllerState(defaultValue, props)

  const currentTab = useMemo(() => tabs.find((tab) => tab.key === value), [value, tabs])

  console.log(`OptimizedTabInner currentTab=[${currentTab?.key}]`)

  return (
    <div className='optimized-tab common-tab-style'>
      <div className='tab-list'>
        {tabs.map((tab) => (
          <TabItem key={tab.key} tabKey={tab.key} title={tab.title} isActive={tab.key === value} onClick={setValue} />
        ))}
      </div>
      <div className='tab-content'>{currentTab?.content || null}</div>
    </div>
  )
}

export const OptimizedTab = memo(OptimizedTabInner)
