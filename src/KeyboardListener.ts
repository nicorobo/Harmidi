import { useEffect } from 'react'
import { useStore } from './store'
import { useActionsByKey } from './use-actions-by-key'

const useKeyboardListener = () => {
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)
  const actionsByKey = useActionsByKey()

  const onKeyDown = (e: KeyboardEvent) => {
    if (!e.repeat) {
      keydown(e.key)
      actionsByKey[e.key]?.on()
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    keyup(e.key)
    actionsByKey[e.key]?.off()
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])
}

export const KeyboardListener = () => {
  useKeyboardListener()
  return null
}
