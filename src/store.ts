import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import {
  DEAD_ZONE_ID,
  Zone,
  getDefaultControlZone,
  getDefaultDeadZone,
  getDefaultNoteZone,
  isControlZone,
  isMutateZone,
  isNoteZone,
} from './zone-settings'
import { createSelectors } from './create-selectors'
import { invertBy, keyBy } from 'lodash'

export type Zones = { [id: string]: Zone }
export type ZoneIdByKey = { [key: string]: string }

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
  upKeyPressed: () => void
  downKeyPressed: () => void
  // fillKeyZone: (id: string) => void
}

const initialZones = [
  getDefaultNoteZone(),
  getDefaultNoteZone(),
  getDefaultNoteZone(),
  getDefaultNoteZone(),
  getDefaultControlZone(),
  // getDefaultMutateZone(),
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
      pressedKeys: [] as string[],
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
      upKeyPressed: () =>
        set(({ zones, selectedZone }) => {
          if (selectedZone === null) return {}
          const zoneArr = Object.values(zones)
          const orderedIds = [
            ...zoneArr.filter(isNoteZone),
            ...zoneArr.filter(isControlZone),
            ...zoneArr.filter(isMutateZone),
          ].map(({ id }) => id)
          const selectedIndex = orderedIds.indexOf(selectedZone)
          return { selectedZone: orderedIds[Math.max(selectedIndex - 1, 0)] }
        }),
      downKeyPressed: () =>
        set(({ zones, selectedZone }) => {
          if (selectedZone === null) return {}
          const zoneArr = Object.values(zones)
          const orderedIds = [
            ...zoneArr.filter(isNoteZone),
            ...zoneArr.filter(isControlZone),
            ...zoneArr.filter(isMutateZone),
          ].map(({ id }) => id)
          const selectedIndex = orderedIds.indexOf(selectedZone)
          return {
            selectedZone:
              orderedIds[Math.min(selectedIndex + 1, orderedIds.length - 1)],
          }
        }),
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
      partialize: (state) => ({
        zones: state.zones,
        zoneIdByKey: state.zoneIdByKey,
        selectedZone: state.selectedZone,
      }),
    }
  )
)

const useStore = createSelectors(useStoreBase)
export { useStore }
