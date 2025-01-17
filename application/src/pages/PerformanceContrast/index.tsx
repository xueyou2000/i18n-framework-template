import { Suspense, useMemo, useState, startTransition, useCallback } from 'react'

import { TabKey } from './types'
import { SlowList } from './SlowList'
import { OptimizedTab } from './OptimizedTab'
import { NormalTab } from './NormalTab'
import { Nav } from '../Index/Nav'

import './index.scss'

export default function PerformanceContrast() {
  const [value, setValue] = useState<TabKey>('start')
  const [count, setCount] = useState(0)

  const handleClick = useCallback((key: TabKey) => {
    startTransition(() => setValue(key))
  }, [])

  const tabs = [
    {
      key: 'start',
      title: 'tabA',
      content: <p>切换tab查看控制台打印</p>
    },
    {
      key: 'normal',
      title: '未优化',
      content: <SlowList text='未优化组件, 会在tab改变时, 造成不必要的重新渲染' />
    },
    {
      key: 'optimized',
      title: '已优化',
      content: <p>切换tab查看控制台打印</p>
    }
  ]

  const tabs2 = useMemo(
    () => [
      {
        key: 'start',
        title: 'tabA',
        content: <p>切换tab查看控制台打印</p>
      },
      {
        key: 'normal',
        title: '未优化',
        content: <SlowList text='未优化组件, 会在tab改变时, 造成不必要的重新渲染' />
      },
      {
        key: 'optimized',
        title: '已优化',
        content: <p>切换tab查看控制台打印</p>
      }
    ],
    []
  )

  return (
    <div className='performance-contrast-page page-layout'>
      <Nav />

      <h1>性能对比</h1>
      <button className='btn' type='button' onClick={() => setCount(count + 1)}>
        count: {count}
      </button>
      <ul className='list'>
        <li>计数器所在组件count变化导致重新渲染时, 会触发NormalTab的重新渲染, 而不会触发OptimizedTab的重新渲染</li>
        <li>使用startTransition实现非阻塞的切换</li>
        <li>使用memo, useMemo, useCallback 避免props更新造成不必要的渲染</li>
      </ul>

      <div className='flex-row'>
        <div className='flex-1'>
          <Suspense fallback={<div>Loading...</div>}>
            <NormalTab value={value} onChange={handleClick} tabs={tabs} />
          </Suspense>
        </div>
        <div className='flex-1'>
          <Suspense fallback={<div>Loading...</div>}>
            <OptimizedTab value={value} onChange={handleClick} tabs={tabs2} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export const element = <PerformanceContrast />
