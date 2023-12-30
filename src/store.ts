import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import { Zone, getDefaultNoteZone } from './zone-settings'
import { createSelectors } from './create-selectors'
import { invertBy, keyBy } from 'lodash'

export type ZoneIds = string[]
export type ZoneById = { [id: string]: Zone }
export type ZoneIdByKey = { [key: string]: string | null }

interface State {
  pressedKeys: string[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  zoneIds: ZoneIds
  zoneById: ZoneById
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
  getDefaultNoteZone({ color: '#AEA1FF', name: 'Zone 1' }),
  getDefaultNoteZone({ color: '#009CE0', name: 'Zone 2' }),
  getDefaultNoteZone({ color: '#0C797D', name: 'Zone 3' }),
  getDefaultNoteZone({ color: '#AB149E', name: 'Zone 4' }),
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
      zoneIds: initialZones.map(({ id }) => id),
      zoneById: keyBy(initialZones, ({ id }) => id),
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
        set(({ zoneIds, selectedZone }) => {
          if (selectedZone === null) return {}
          const selectedIndex = zoneIds.indexOf(selectedZone)
          return { selectedZone: zoneIds[Math.max(selectedIndex - 1, 0)] }
        }),
      downKeyPressed: () =>
        set(({ zoneIds, selectedZone }) => {
          if (selectedZone === null) return {}
          const selectedIndex = zoneIds.indexOf(selectedZone)
          return {
            selectedZone:
              zoneIds[Math.min(selectedIndex + 1, zoneIds.length - 1)],
          }
        }),
      // Consider allowing partial updates here.
      updateZone: (id, zone) => {
        set(({ zoneById }) => ({
          zoneById: { ...zoneById, [id]: zone },
        }))
      },
      createZone: (zone) => {
        set(({ zoneIds, zoneById }) => ({
          selectedZone: zone.id,
          zoneIds: [...zoneIds, zone.id],
          zoneById: { ...zoneById, [zone.id]: zone },
        }))
      },
      deleteZone: (id) => {
        set(({ zoneById, zoneIds, zoneIdByKey }) => {
          const newZones = { ...zoneById }
          delete newZones[id]

          const keysByZoneId = invertBy(zoneIdByKey)
          const newKeyZones = (keysByZoneId[id] ?? []).reduce((map, key) => {
            map[key] = null
            return map
          }, {} as ZoneIdByKey)
          const deletedIndex = zoneIds.indexOf(id)
          const newSelectedZone =
            deletedIndex === zoneIds.length - 1
              ? zoneIds[deletedIndex - 1]
              : zoneIds[deletedIndex + 1]
          return {
            selectedZone: newSelectedZone ?? null,
            zones: newZones,
            zoneIds: zoneIds.filter((zoneId) => zoneId !== id),
            zoneIdByKey: { ...zoneIdByKey, ...newKeyZones },
          }
        })
      },
      setIsKeyMapping: (isKeyMapping) => set({ isKeyMapping }),
    }),
    {
      name: 'food-storage', // name of the item in the storage (must be unique) // TODO give name
      partialize: (state) => ({
        zoneIds: state.zoneIds,
        zoneById: state.zoneById,
        zoneIdByKey: state.zoneIdByKey,
        selectedZone: state.selectedZone,
      }),
    }
  )
)

const useStore = createSelectors(useStoreBase)
export { useStore }
