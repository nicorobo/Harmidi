import { useEffect } from 'react'
import { useStore } from './store'

const useKeyboardListener = () => {
  const { zoneByKey } = useStore((state) => state.keyboardConfig)
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)

  const onKeyDown = ({ key, repeat }: KeyboardEvent) => {
    !repeat && zoneByKey.hasOwnProperty(key) && keydown(key)
  }

  const onKeyUp = ({ key }: KeyboardEvent) => {
    zoneByKey.hasOwnProperty(key) && keyup(key)
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
