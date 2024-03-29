import { create } from 'zustand'
import { StorageValue, persist } from 'zustand/middleware'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import { Zone, getDefaultNoteZone, getInstrumentById } from './zone-settings'
import { createSelectors } from './create-selectors'
import { invertBy, keyBy, mapValues } from 'lodash'
import { availableInstruments } from './zone-instruments'

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
  appSettingsIsOpen: boolean
  setAppSettingsIsOpen: (appSettingsIsOpen: boolean) => void
  appDocsIsOpen: boolean
  setAppDocsIsOpen: (appDocsIsOpen: boolean) => void
  isUsingMidi: boolean // change to midiEnabled
  setUseMidi: (isUsingMidi: boolean) => void
  resetSettings: () => void
}

type Defaults = Pick<
  State,
  | 'pressedKeys'
  | 'appSettingsIsOpen'
  | 'appDocsIsOpen'
  | 'zoneIds'
  | 'zoneById'
  | 'selectedZone'
  | 'zoneIdByKey'
  | 'keyboardConfig'
  | 'isKeyMapping'
  | 'isUsingMidi'
>

const getInitialZones = () => {
  const zone1Id = 'zone-1'
  const zone2Id = 'zone-2'
  const minorScale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
  return [
    getDefaultNoteZone({
      id: zone1Id,
      color: '#AEA1FF',
      name: 'Zone 1',
      instrument: getInstrumentById('sine'),
      octave: 5,
      muteZones: [zone1Id],
      velocity: 75,
      scale: minorScale,
      voices: [
        {
          offset: 0,
          velocity: 100,
        },
        {
          offset: 3,
          velocity: 100,
        },
        {
          offset: 7,
          velocity: 100,
        },
        {
          offset: 12,
          velocity: 100,
        },
      ],
    }),
    getDefaultNoteZone({
      id: zone2Id,
      color: '#009CE0',
      name: 'Zone 2',
      instrument: getInstrumentById('saw'),
      octave: 3,
      muteZones: [zone2Id],
      scale: minorScale,
    }),
    getDefaultNoteZone({
      color: '#0C797D',
      name: 'Zone 3',
      instrument: getInstrumentById('kalimba'),
      octave: 6,
      scale: minorScale,
    }),
    getDefaultNoteZone({
      color: '#AB149E',
      name: 'Zone 4',
      instrument: getInstrumentById('wind'),
      scale: minorScale,
    }),
  ]
}

const getDefaultSettings = ({
  keyboardConfig,
  overrides = {},
}: {
  keyboardConfig: KeyboardConfig
  overrides?: Partial<Defaults>
}): Defaults => {
  const initialZones = getInitialZones()
  // Initially, each row is its own zone
  const initialZoneIdByKey = keyboardConfig.keyGrid.reduce((map, row, i) => {
    for (const key of row) {
      map[key] = initialZones[i].id
    }
    return map
  }, {} as ZoneIdByKey)

  return {
    pressedKeys: [] as string[],
    appSettingsIsOpen: false,
    appDocsIsOpen: true,
    zoneIds: initialZones.map(({ id }) => id),
    zoneById: keyBy(initialZones, ({ id }) => id),
    selectedZone: null,
    zoneIdByKey: initialZoneIdByKey,
    keyboardConfig,
    isKeyMapping: false,
    isUsingMidi: false,
    ...overrides,
  }
}

const useStoreBase = create<State>()(
  persist(
    (set) => ({
      ...getDefaultSettings({ keyboardConfig: keyboardConfigs.USEnglish }),
      updateKeyZone: (key, zoneId) =>
        set((state) => ({
          zoneIdByKey: { ...state.zoneIdByKey, [key]: zoneId },
        })),
      setSelectedZone: (selectedZone) =>
        set({ selectedZone, appSettingsIsOpen: false, appDocsIsOpen: false }),
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
          appSettingsIsOpen: false,
          appDocsIsOpen: false,
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
      setAppSettingsIsOpen: (appSettingsIsOpen) =>
        set({ appSettingsIsOpen, selectedZone: null, appDocsIsOpen: false }),
      setAppDocsIsOpen: (appDocsIsOpen) =>
        set({ appDocsIsOpen, selectedZone: null, appSettingsIsOpen: false }),
      setUseMidi: (isUsingMidi) => set({ isUsingMidi }),
      resetSettings: () =>
        set(
          getDefaultSettings({
            keyboardConfig: keyboardConfigs.USEnglish,
            overrides: {
              appSettingsIsOpen: true,
              appDocsIsOpen: false,
            },
          })
        ),
    }),
    {
      name: 'harmidi-001',
      // TODO Figure out how to type this
      // @ts-ignore
      partialize: (state: State): Partial<State> => ({
        zoneIds: state.zoneIds,
        zoneById: state.zoneById,
        zoneIdByKey: state.zoneIdByKey,
        selectedZone: state.selectedZone,
        isUsingMidi: state.isUsingMidi,
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          return {
            state: {
              ...state,
              zoneById: mapValues(state.zoneById, (zone) => {
                const instrument = availableInstruments.find(
                  (inst) => inst.id === zone.instrument.id
                )
                if (!instrument) return zone
                return {
                  ...zone,
                  instrument: {
                    id: instrument.id,
                    instrument: instrument.factory(),
                  },
                }
              }),
            },
          }
        },
        setItem: (name, newValue: StorageValue<State>) => {
          // functions cannot be JSON encoded
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              zoneById: mapValues(newValue.state.zoneById, (zone) => ({
                ...zone,
                instrument: { id: zone.instrument.id },
              })),
            },
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)

const useStore = createSelectors(useStoreBase)
export { useStore }
