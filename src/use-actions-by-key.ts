import { useStore } from './store'
import { useNoteActions } from './use-note-actions'
import invertBy from 'lodash/invertBy'
import sortBy from 'lodash/sortBy'
import { isNoteZone } from './zone-settings'

const getKeyCoordinates = (grid: string[][]) => {
  const coordinates: { [key: string]: { x: number; y: number } } = {}
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      coordinates[grid[i][j]] = { x: j, y: i }
    }
  }
  return coordinates
}

// TODO reconsider this; we don't have to have this have the idea of keys built in, it could just be numbers and then the consumer handles the key part.
export type KeyActions = {
  [key: string]: { on: () => void; off: () => void; notes: number[] }
}
export const useActionsByKey = (): KeyActions => {
  const zones = useStore.use.zones()
  const zoneIdByKey = useStore.use.zoneIdByKey()
  const { keyGrid } = useStore.use.keyboardConfig()
  const keyCoordinates = getKeyCoordinates(keyGrid)
  const keysByZoneId = invertBy(zoneIdByKey)
  const getActionsByZone = useNoteActions()
  // TODO get this to work with non note zones
  const actions: KeyActions = {}
  for (const zoneId in keysByZoneId) {
    const zone = zones[zoneId]
    if (!isNoteZone(zone)) {
      continue
    }
    const { leftToRight, topToBottom, reverse } = zone.orientation
    const sortVertical = (key: string) =>
      topToBottom ? keyCoordinates[key].y : -keyCoordinates[key].y
    const sortHorizontal = (key: string) =>
      leftToRight ? keyCoordinates[key].x : -keyCoordinates[key].x
    const keys = sortBy(
      keysByZoneId[zoneId],
      (key) => (reverse ? sortHorizontal(key) : sortVertical(key)),
      (key) => (reverse ? sortVertical(key) : sortHorizontal(key))
    )
    Object.assign(actions, getActionsByZone(keys, zone))
  }
  return actions
}
