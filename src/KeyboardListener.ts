import { useContext, useEffect } from 'react'
import { useStore, ZoneIdByKey } from './store'
import { EngineContext } from './Engine'
import { Zone } from './zone-settings'

type GetActiveKeysArgs = {
  key: string
  activeKeys: string[]
  zone: Zone
  zoneIdByKey: ZoneIdByKey
}

const addKey = ({ key, activeKeys, zone, zoneIdByKey }: GetActiveKeysArgs) => {
  const { hold, muteZones } = { muteZones: [] as string[], ...zone } // A quick fix for handling all zones
  const selfMuting = muteZones.includes(zone.id)
  const isActive = activeKeys.includes(key)
  if (hold && isActive) {
    // Turn key off
    return activeKeys.filter((k) => k !== key)
  }
  if (hold && selfMuting) {
    // Clear keys in same zone and add key
    return activeKeys.filter((k) => zoneIdByKey[k] !== zone.id).concat(key)
  }
  return activeKeys.concat(key)
}

const removeKey = ({ key, activeKeys, zone }: GetActiveKeysArgs) => {
  const { hold } = zone
  if (hold) {
    // We only handle hold zones during keydown
    return activeKeys
  }
  return activeKeys.filter((k) => k !== key)
}

const useKeyboardListener = () => {
  const { activeKeys, setActiveKeys } = useContext(EngineContext)
  const zoneIdByKey = useStore.use.zoneIdByKey()
  const zones = useStore.use.zoneById()
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
    if (!repeat && zoneIdByKey.hasOwnProperty(key)) {
      if (keyMapMode) {
        updateKeyZone(key, selectedZone)
      } else {
        const zoneId = zoneIdByKey[key]
        if (zoneId) {
          setActiveKeys(
            addKey({ key, activeKeys, zone: zones[zoneId], zoneIdByKey })
          )
        }
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
        const zoneId = zoneIdByKey[key]
        if (zoneId) {
          setActiveKeys(
            removeKey({ key, activeKeys, zone: zones[zoneId], zoneIdByKey })
          )
        }
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
