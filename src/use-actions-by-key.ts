import { Zones, useStore } from './store'
import { useActions } from './use-note-actions'
import invertBy from 'lodash/invertBy'
import sortBy from 'lodash/sortBy'
import {
  ControlZone,
  MutateZone,
  Zone,
  isControlZone,
  isDeadZone,
  isMutateZone,
} from './zone-settings'
import { mapValues } from 'lodash'

type KeyCoordinates = { [key: string]: { x: number; y: number } }
const getKeyCoordinates = (grid: string[][]) => {
  const coordinates: KeyCoordinates = {}
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      coordinates[grid[i][j]] = { x: j, y: i }
    }
  }
  return coordinates
}

// TODO reconsider this; we don't have to have this have the idea of keys built in, it could just be numbers and then the consumer handles the key part.
export type KeyActions = {
  [key: string]: {
    on: (triggerOperators?: boolean) => void
    off: (triggerOperators?: boolean) => void
    notes: number[]
  } // Would I maybe be able to shove some animation stuff here?
}

export type ZoneOperators = {
  controlZones: ControlZone[]
  mutateZones: MutateZone[]
}
export type OperatorsByZone = {
  [id: string]: ZoneOperators
}
const getZoneOperators = (
  zones: Zones,
  activeZonesIds: string[]
): OperatorsByZone => {
  const zoneOperators: OperatorsByZone = mapValues(zones, () => ({
    controlZones: [],
    mutateZones: [],
  }))
  for (const zoneId in zones) {
    const zone = zones[zoneId]
    if (
      isControlZone(zone) &&
      activeZonesIds.includes(zoneId) &&
      zone.triggerOnNote
    ) {
      zone.noteZones.forEach((noteZoneId) => {
        zoneOperators[noteZoneId].controlZones.push(zone)
      })
    } else if (isMutateZone(zone) && activeZonesIds.includes(zoneId)) {
      zone.noteZones.forEach((noteZoneId) => {
        zoneOperators[noteZoneId].mutateZones.push(zone)
      })
    }
  }
  return zoneOperators
}

export const useActionsByKey = (activeZonesIds: string[]): KeyActions => {
  const zones = useStore.use.zones()
  const zoneIdByKey = useStore.use.zoneIdByKey()
  const { keyGrid } = useStore.use.keyboardConfig()
  const keyCoordinates = getKeyCoordinates(keyGrid) // TODO memoize this
  const keysByZoneId = invertBy(zoneIdByKey)
  const getActionsByZone = useActions()
  const zoneOperators = getZoneOperators(zones, activeZonesIds)

  const actions: KeyActions = {}

  for (const zoneId in keysByZoneId) {
    const zone = zones[zoneId]
    if (isDeadZone(zone)) continue
    const keys = sortZoneKeys(zone, keysByZoneId[zoneId], keyCoordinates)
    Object.assign(actions, getActionsByZone(keys, zone, zoneOperators[zoneId]))
  }
  return actions
}

const sortZoneKeys = (zone: Zone, keys: string[], coords: KeyCoordinates) => {
  if (isDeadZone(zone)) return keys
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
