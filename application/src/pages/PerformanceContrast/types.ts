import type { ReactNode } from 'react'

export type TabKey = string | number | undefined

export type TabProps = {
  value: TabKey
  defaultValue?: TabKey
  onChange?: (value: TabKey) => void
  tabs: TabItem[]
}

export type TabItem = {
  key: TabKey
  title: ReactNode
  content: ReactNode
}

export type TabItemProps = {
  tabKey: TabKey
  title: ReactNode
  isActive: boolean
  onClick?: (key: TabKey) => void
}
