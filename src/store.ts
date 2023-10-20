import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'

interface State {
  active: number[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
}

const useStore = create<State>()((set) => ({
  active: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  keydown: (key) =>
    set((state) => ({
      active: [...state.active, state.keyboardConfig.keyToId[key]],
    })),
  keyup: (key) =>
    set((state) => {
      const id = state.keyboardConfig.keyToId[key]
      const active = state.active.filter((i) => i !== id)
      return { active }
    }),
}))

export { useStore }
