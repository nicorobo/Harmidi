import { useStore } from './store'
import { useNoteActions } from './use-note-actions'
import invertBy from 'lodash/invertBy'
import sortBy from 'lodash/sortBy'

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
export type KeyActions = { [key: string]: { on: () => void; off: () => void } }
export const useActionsByKey = (): KeyActions => {
  const settings = useStore((state) => state.settings)
  const zoneByKey = useStore((state) => state.zoneByKey)
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  const keyCoordinates = getKeyCoordinates(keyGrid)
  const keysByZone = invertBy(zoneByKey)
  console.log(keysByZone)
  const getActionsByZone = useNoteActions()

  const actions: KeyActions = {}
  for (const zone in keysByZone) {
    // TODO depending on whether a zone is ordered from top/bottom, left/right, right/left or bottom/top, we can change this sort function.
    const keys = sortBy(
      keysByZone[Number(zone)],
      (key) => keyCoordinates[key].y
    )
    Object.assign(actions, getActionsByZone(keys, settings[Number(zone)]))
  }
  return actions
}
