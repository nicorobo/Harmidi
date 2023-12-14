import { useContext, useEffect } from 'react'
import { useStore, ZoneIdByKey, Zones } from './store'
import { EngineContext } from './Engine'
import { isDeadZone } from './zone-settings'

type GetActiveKeysArgs = {
  key: string
  activeKeys: string[]
  zones: Zones
  zoneIdByKey: ZoneIdByKey
}

// I don't think we need the whole state but who knows.
const addKey = ({ key, activeKeys, zones, zoneIdByKey }: GetActiveKeysArgs) => {
  const zoneId = zoneIdByKey[key]
  const zone = zones[zoneId]
  if (isDeadZone(zone)) return activeKeys
  const { hold, muteZones } = { muteZones: [] as string[], ...zone } // A quick fix for handling all zones
  const selfMuting = muteZones.includes(zoneId)
  const isActive = activeKeys.includes(key)
  if (hold && isActive) {
    // Turn key off
    return activeKeys.filter((k) => k !== key)
  }
  if (hold && selfMuting) {
    // Clear keys in same zone and add key
    return activeKeys.filter((k) => zoneIdByKey[k] !== zoneId).concat(key)
  }
  return activeKeys.concat(key)
}

// I don't think we need the whole state but who knows.
const removeKey = ({
  key,
  activeKeys,
  zones,
  zoneIdByKey,
}: GetActiveKeysArgs) => {
  const zone = zones[zoneIdByKey[key]]
  if (isDeadZone(zone)) return activeKeys
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
  const zones = useStore.use.zones()
  const keydown = useStore.use.keydown()
  const keyup = useStore.use.keyup()
  const isKeyMapping = useStore.use.isKeyMapping()
  const selectedZone = useStore.use.selectedZone()
  const updateKeyZone = useStore.use.updateKeyZone()
  const upKeyPressed = useStore.use.upKeyPressed()
  const downKeyPressed = useStore.use.downKeyPressed()
  const keyMapMode = isKeyMapping && selectedZone !== null

  const onKeyDown = (e: KeyboardEvent) => {
    // performance.mark('keydown')
    const { key, repeat } = e
    console.log(e)
    if (!repeat && zoneIdByKey.hasOwnProperty(key)) {
      if (keyMapMode) {
        updateKeyZone(key, selectedZone)
      } else {
        setActiveKeys(addKey({ key, activeKeys, zones, zoneIdByKey }))
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
    // performance.mark('keyup')
    if (zoneIdByKey.hasOwnProperty(key)) {
      if (!keyMapMode) {
        setActiveKeys(removeKey({ key, activeKeys, zones, zoneIdByKey }))
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
