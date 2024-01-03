import { useState } from 'react'
import { useStore, ZoneIdByKey } from './store'
import { Zone } from './zone-settings'

export const useActiveKeys = () => {
  const zones = useStore.use.zoneById()
  const zoneIdByKey = useStore.use.zoneIdByKey()

  const [activeKeys, setActiveKeys] = useState<string[]>([])

  const updateActiveKeys = (key: string, down: boolean) => {
    const zoneId = zoneIdByKey[key]
    if (!zoneId) return
    const zone = zones[zoneId]
    const args = { key, activeKeys, zone, zoneIdByKey }
    const newActiveKeys = down ? addKey(args) : removeKey(args)
    setActiveKeys(newActiveKeys)
  }

  const keyDown = (key: string) => {
    updateActiveKeys(key, true)
  }
  const keyUp = (key: string) => {
    updateActiveKeys(key, false)
  }
  return { activeKeys, setActiveKeys, keyDown, keyUp }
}

type GetActiveKeysArgs = {
  key: string
  activeKeys: string[]
  zone: Zone
  zoneIdByKey: ZoneIdByKey
}

const addKey = ({ key, activeKeys, zone, zoneIdByKey }: GetActiveKeysArgs) => {
  const { hold, muteZones } = zone
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
