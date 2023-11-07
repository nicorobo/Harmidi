import { useStore } from './store'
import { useNoteActions } from './use-note-actions'

export type KeyActions = { [key: string]: { on: () => void; off: () => void } }
export const useActionsByKey = (): KeyActions => {
  const settings = useStore((state) => state.settings)
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  const getActionsByRow = useNoteActions()

  const actions: KeyActions = {}
  for (let i = 0; i < keyGrid.length; i++) {
    Object.assign(actions, getActionsByRow(keyGrid[i], settings[i]))
  }
  return actions
}
