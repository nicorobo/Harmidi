import { useStore } from './store'
import { useActions } from './use-note-actions'
import invertBy from 'lodash/invertBy'
import sortBy from 'lodash/sortBy'
import { Zone } from './zone-settings'
import { KeyCoordinates } from './keyboard-config'
import { NoteInfo } from './note-getters'

// TODO reconsider this; we don't have to have this have the idea of keys built in, it could just be numbers and then the consumer handles the key part.
export type KeyActions = {
  [key: string]: {
    on: () => void
    off: () => void
    noteInfo: NoteInfo
  } // Would I maybe be able to store some animation stuff here?
}

export const useActionsByKey = (): KeyActions => {
  const zones = useStore.use.zoneById()
  const zoneIdByKey = useStore.use.zoneIdByKey()
  const { keyCoordinates } = useStore.use.keyboardConfig()
  const keysByZoneId = invertBy(zoneIdByKey)
  const getActionsByZone = useActions()
  const actions: KeyActions = {}

  for (const zoneId in keysByZoneId) {
    const zone = zones[zoneId]
    if (!zone) continue
    // This is necessary in case the keyboard config is updated.
    const availableKeys = keysByZoneId[zoneId].filter(
      (key) => key in keyCoordinates
    )
    const keys = sortZoneKeys(zone, availableKeys, keyCoordinates)
    Object.assign(actions, getActionsByZone(keys, zone))
  }
  return actions
}

const sortZoneKeys = (zone: Zone, keys: string[], coords: KeyCoordinates) => {
  const { leftToRight, topToBottom, reverse } = zone.order
  const sortVertical = (key: string) =>
    topToBottom ? coords[key].y : -coords[key].y
  const sortHorizontal = (key: string) =>
    leftToRight ? coords[key].x : -coords[key].x
  return sortBy(
    keys,
    (key) => (reverse ? sortHorizontal(key) : sortVertical(key)),
    (key) => (reverse ? sortVertical(key) : sortHorizontal(key))
  )
}
