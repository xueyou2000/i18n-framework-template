import { memo } from 'react'

export const SlowList = memo(function SlowList({ text }: { text: string }) {
  // 仅打印一次。实际的减速是在 SlowItem 组件内部。
  // console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />')

  const items = []
  for (let i = 0; i < 10; i++) {
    items.push(<SlowItem key={i} text={text} />)
  }
  return <ul className='items'>{items}</ul>
})

export function SlowItem({ text }: { text: string }) {
  const startTime = performance.now()
  while (performance.now() - startTime < 100) {
    // 每个 item 暂停 100ms，模拟极其缓慢的代码
  }

  return <li className='item'>Text: {text}</li>
}
