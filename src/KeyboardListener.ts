import { useEffect } from 'react'
import { useStore } from './store'
import { useEngine } from './use-engine'

const targetIsTextInput = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement
  return (
    target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text'
  )
}

const useKeyboardListener = () => {
  const { keyDown, keyUp } = useEngine()
  const zoneIdByKey = useStore.use.zoneIdByKey()
  const keydown = useStore.use.keydown()
  const keyup = useStore.use.keyup()
  const isKeyMapping = useStore.use.isKeyMapping()
  const selectedZone = useStore.use.selectedZone()
  const updateKeyZone = useStore.use.updateKeyZone()
  const upKeyPressed = useStore.use.upKeyPressed()
  const downKeyPressed = useStore.use.downKeyPressed()
  const keyMapMode = isKeyMapping && selectedZone !== null
  const onKeyDown = (e: KeyboardEvent) => {
    const { key, repeat } = e
    if (targetIsTextInput(e) || repeat) return

    if (zoneIdByKey.hasOwnProperty(key)) {
      if (keyMapMode) {
        updateKeyZone(key, selectedZone)
      } else {
        keyDown(key)
      }
      keydown(key)
    } else {
      switch (key) {
        case 'ArrowUp':
          upKeyPressed()
          break
        case 'ArrowDown':
          downKeyPressed()
          break
      }
    }
  }

  const onKeyUp = ({ key }: KeyboardEvent) => {
    if (zoneIdByKey.hasOwnProperty(key)) {
      if (!keyMapMode) {
        keyUp(key)
      }
      keyup(key)
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
