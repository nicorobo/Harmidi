import { useStore } from './store'
import { useNoteActions } from './use-note-actions'

export type KeyActions = { [key: string]: { on: () => void; off: () => void } }
export const useActionsByKey = (): KeyActions => {
  const rowSettings = useStore((state) => state.rowSettings)
  const keyboardConfig = useStore((state) => state.keyboardConfig)
  const getActionsByRow = useNoteActions()

  const actions: KeyActions = {}
  for (let i = 0; i < keyboardConfig.keys.length; i++) {
    Object.assign(
      actions,
      getActionsByRow(keyboardConfig.keys[i], rowSettings[i])
    )
  }
  return actions
}
