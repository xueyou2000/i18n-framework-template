import { NationConfig } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeColor = 'light' | 'dark' | 'auto'

export interface AppContextState {
  /** 主题色 */
  theme: ThemeColor
  /** 设置主题 */
  setTheme: (theme: ThemeColor) => void
  /** 是否已水合 */
  isHydrated: boolean
  /** 国家配置 */
  nationConfig: NationConfig | null
}

const appContextStore = create<AppContextState>()(
  persist(
    (set) => ({
      theme: 'auto',
      isHydrated: false,
      nationConfig: null,
      setTheme: (theme: ThemeColor) => {
        set({ theme })
      }
    }),
    {
      name: 'app-context'
    }
  )
)

export const useAppContext = appContextStore
