// 未经过优化的tab组件
import classNames from 'classnames'

import { useControllerState } from '@packages/utils'
import { TabProps } from './types'

export function NormalTab(props: TabProps) {
  const { defaultValue, tabs } = props
  const [value, setValue] = useControllerState(defaultValue, props)

  const currentTab = tabs.find((tab) => tab.key === value)

  return (
    <div className='normal-tab common-tab-style'>
      <div className='tab-list'>
        {tabs.map((tab) => (
          <div key={tab.key} className={classNames('tab-item', { active: tab.key === value })} onClick={() => setValue(tab.key)}>
            {tab.title}
          </div>
        ))}
      </div>
      <div className='tab-content'>{currentTab?.content || null}</div>
    </div>
  )
}
