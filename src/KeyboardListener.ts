import { useEffect, useState } from 'react'
import { useStore } from './store'
import { useActionsByKey } from './use-actions-by-key'

const useKeyboardListener = () => {
  const [offActionsByKey, setOffActionsByKey] = useState<{
    [key: string]: () => void
  }>({})
  const { keyList } = useStore((state) => state.keyboardConfig)
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)
  const actionsByKey = useActionsByKey()

  const onKeyDown = (e: KeyboardEvent) => {
    if (!e.repeat && keyList.includes(e.key)) {
      keydown(e.key)
      actionsByKey[e.key]?.on()
      setOffActionsByKey((a) => ({ ...a, [e.key]: actionsByKey[e.key]?.off }))
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (keyList.includes(e.key)) {
      keyup(e.key)
      if (offActionsByKey.hasOwnProperty(e.key)) {
        offActionsByKey[e.key]()
      }
    }
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
