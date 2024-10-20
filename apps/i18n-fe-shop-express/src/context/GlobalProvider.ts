import { createContext, useContext } from 'react'

import { NationConfig } from '@/types'

export interface GlobalContextState {
  /** 国家配置 */
  nationConfig: NationConfig | null
}

export const GlobalContext = createContext<GlobalContextState>({
  nationConfig: null
})

export function useGlobalContext() {
  return useContext(GlobalContext)
}
