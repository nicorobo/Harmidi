import { useEffect } from 'react'
import { useStore } from './store'

const useKeyboardListener = () => {
  const { zoneByKey } = useStore((state) => state.keyboardConfig)
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)

  const onKeyDown = ({ key, repeat }: KeyboardEvent) => {
    // performance.mark('keydown')
    !repeat && zoneByKey.hasOwnProperty(key) && keydown(key)
  }

  const onKeyUp = ({ key }: KeyboardEvent) => {
    // performance.mark('keyup')
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
