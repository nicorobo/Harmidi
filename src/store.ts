import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import {
  DEAD_ZONE_ID,
  Zone,
  getDefaultControlZone,
  getDefaultDeadZone,
  getDefaultMutateZone,
  getDefaultNoteZone,
} from './zone-settings'
import { createSelectors } from './create-selectors'
import { invertBy, keyBy } from 'lodash'

export type Zones = { [id: string]: Zone }
export type ZoneIdByKey = { [key: string]: string }

// Zones are not associated to rows, but by default the zones are rows.
// We can also pass in a zone, which will "fill" the grid.
// const getRowByKey = (keyGrid: string[][], zoneId: string): ZoneByKey => {
//   const dict: ZoneByKey = {}
//   for (let i = 0; i < keyGrid.length; i++) {
//     for (let j = 0; j < keyGrid[i].length; j++) {
//       dict[keyGrid[i][j]] = zone
//     }
//   }
//   return dict
// }

interface State {
  pressedKeys: string[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  zones: Zones
  updateZone: (id: string, zone: Zone) => void
  createZone: (zone: Zone) => void
  deleteZone: (id: string) => void
  zoneIdByKey: ZoneIdByKey
  updateKeyZone: (key: string, zoneId: string) => void
  selectedZone: string | null
  setSelectedZone: (zone: string | null) => void
  isKeyMapping: boolean
  setIsKeyMapping: (isKeyMapping: boolean) => void
  // fillKeyZone: (id: string) => void
}

const initialZones = [
  getDefaultNoteZone(),
  getDefaultNoteZone(),
  getDefaultNoteZone(),
  getDefaultNoteZone(),
  getDefaultControlZone(),
  getDefaultMutateZone(),
  getDefaultDeadZone(),
]

// Initially, each row is its own zone
const initialZoneIdByKey = keyboardConfigs.USEnglish.keyGrid.reduce(
  (map, row, i) => {
    for (const key of row) {
      map[key] = initialZones[i].id
    }
    return map
  },
  {} as ZoneIdByKey
)

const useStoreBase = create<State>()(
  persist(
    (set) => ({
      pressedKeys: [],
      zones: keyBy(initialZones, ({ id }) => id),
      selectedZone: initialZones[0].id,
      zoneIdByKey: initialZoneIdByKey,
      keyboardConfig: keyboardConfigs.USEnglish,
      isKeyMapping: false,
      updateKeyZone: (key, zoneId) =>
        set((state) => ({
          zoneIdByKey: { ...state.zoneIdByKey, [key]: zoneId },
        })),
      // fillKeyZone: (zone) =>
      //   set({
      //     zoneByKey: getRowByKey(keyboardConfigs.USEnglish.keyGrid, zone),
      //   }),
      setSelectedZone: (selectedZone) => set({ selectedZone }),
      keydown: (key) =>
        set((state) => ({ pressedKeys: [...state.pressedKeys, key] })),

      keyup: (key) =>
        set((state) => ({
          pressedKeys: state.pressedKeys.filter((k) => k !== key),
        })),
      // Consider allowing partial updates here.
      updateZone: (id, zone) => {
        set(({ zones }) => ({
          zones: { ...zones, [id]: zone },
        }))
      },
      createZone: (zone) => {
        set(({ zones }) => ({
          selectedZone: zone.id,
          zones: { ...zones, [zone.id]: zone },
        }))
      },
      deleteZone: (id) => {
        set(({ zones, zoneIdByKey }) => {
          const newZones = { ...zones }
          delete newZones[id]

          const keysByZoneId = invertBy(zoneIdByKey)
          const newKeyZones = (keysByZoneId[id] ?? []).reduce((map, key) => {
            map[key] = DEAD_ZONE_ID
            return map
          }, {} as ZoneIdByKey)

          return {
            selectedZone: null,
            zones: newZones,
            zoneIdByKey: { ...zoneIdByKey, ...newKeyZones },
          }
        })
      },
      setIsKeyMapping: (isKeyMapping) => set({ isKeyMapping }),
    }),
    {
      name: 'food-storage', // name of the item in the storage (must be unique) // TODO give name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

const useStore = createSelectors(useStoreBase)
export { useStore }
