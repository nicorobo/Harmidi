import { useContext, useEffect } from 'react'
import { Settings, useStore } from './store'
import { EngineContext } from './Engine'
import { ZoneByKey } from './keyboard-config'

type GetActiveKeysArgs = {
  key: string
  activeKeys: string[]
  settings: Settings
  zoneByKey: ZoneByKey
}

// I don't think we need the whole state but who knows.
const addKey = ({
  key,
  activeKeys,
  settings,
  zoneByKey,
}: GetActiveKeysArgs) => {
  const zone = zoneByKey[key]
  const { hold, muteZones } = settings[zone]
  const selfMuting = muteZones.includes(zone)
  const isActive = activeKeys.includes(key)
  if (hold && isActive) {
    // Turn key off
    return activeKeys.filter((k) => k !== key)
  }
  if (hold && selfMuting) {
    // Clear keys in same zone and add key
    return activeKeys.filter((k) => zoneByKey[k] !== zone).concat(key)
  }
  return activeKeys.concat(key)
}

// I don't think we need the whole state but who knows.
const removeKey = ({
  key,
  activeKeys,
  settings,
  zoneByKey,
}: GetActiveKeysArgs) => {
  const zone = zoneByKey[key]
  const { hold } = settings[zone]
  if (hold) {
    // We only handle hold zones during keydown
    return activeKeys
  }
  return activeKeys.filter((k) => k !== key)
}

const useKeyboardListener = () => {
  const { activeKeys, setActiveKeys } = useContext(EngineContext)
  const { zoneByKey } = useStore((state) => state.keyboardConfig)
  const settings = useStore((state) => state.settings)
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)

  const onKeyDown = ({ key, repeat }: KeyboardEvent) => {
    performance.mark('keydown')
    if (!repeat && zoneByKey.hasOwnProperty(key)) {
      setActiveKeys(addKey({ key, activeKeys, settings, zoneByKey }))
      keydown(key)
    }
  }

  const onKeyUp = ({ key }: KeyboardEvent) => {
    performance.mark('keyup')
    if (zoneByKey.hasOwnProperty(key)) {
      setActiveKeys(removeKey({ key, activeKeys, settings, zoneByKey }))
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