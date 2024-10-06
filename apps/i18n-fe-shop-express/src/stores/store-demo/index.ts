import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StoreDemo {
  count: number
  inc: () => void
}

const persistStore = persist<StoreDemo>(
  (set) => ({
    count: 1,
    inc: () => set((state) => ({ count: state.count + 1 }))
  }),
  {
    name: 'store-key'
  }
)

export const useStoreDemo = create(persistStore)
