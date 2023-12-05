import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import { ZoneSettings, getDefaultNoteSettings } from './zone-settings'
import { createSelectors } from './create-selectors'

export type Settings = ZoneSettings[]
export type ZoneByKey = { [key: string]: number }

// Zones are not associated to rows, but by default the zones are rows.
// We can also pass in a zone, which will "fill" the grid.
const getRowByKey = (keyGrid: string[][], zone?: number): ZoneByKey => {
  const dict: ZoneByKey = {}
  for (let i = 0; i < keyGrid.length; i++) {
    for (let j = 0; j < keyGrid[i].length; j++) {
      dict[keyGrid[i][j]] = zone ?? i
    }
  }
  return dict
}

interface State {
  pressedKeys: string[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  settings: Settings
  // updateZoneType: (zone: number, type: ZoneType) => void
  updateZoneSettings: (zone: number, settings: ZoneSettings) => void
  zoneByKey: ZoneByKey
  updateKeyZone: (key: string, zone: number) => void
  selectedZone: number | null
  setSelectedZone: (zone: number | null) => void
  isKeyMapping: boolean
  setIsKeyMapping: (isKeyMapping: boolean) => void
  fillKeyZone: (zone: number) => void
}

const useStoreBase = create<State>()((set) => ({
  pressedKeys: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  isKeyMapping: false,
  zoneByKey: getRowByKey(keyboardConfigs.USEnglish.keyGrid), // Initially, each row is its own zone
  updateKeyZone: (key, zone) =>
    set((state) => ({
      zoneByKey: { ...state.zoneByKey, [key]: zone },
    })),
  fillKeyZone: (zone) =>
    set({
      zoneByKey: getRowByKey(keyboardConfigs.USEnglish.keyGrid, zone),
    }),
  selectedZone: 0,
  setSelectedZone: (selectedZone) =>
    set({
      selectedZone,
    }),
  settings: [
    getDefaultNoteSettings(),
    getDefaultNoteSettings(),
    getDefaultNoteSettings(),
    getDefaultNoteSettings(),
  ],
  keydown: (key) =>
    set((state) => {
      return {
        pressedKeys: [...state.pressedKeys, key],
      }
    }),

  keyup: (key) =>
    set((state) => {
      return {
        pressedKeys: state.pressedKeys.filter((k) => k !== key),
      }
    }),
  // updateZoneType: (zone, type) =>
  //   set((state) => ({
  //     ...state,
  //     settings: state.settings.with(
  //       zone,
  //       switchZoneType(type, state.settings[zone])
  //     ),
  //   })),
  // Consider allowing partial updates here.
  updateZoneSettings: (zone, settings) => {
    set((state) => ({
      settings: state.settings.with(zone, settings),
    }))
  },
  setIsKeyMapping: (isKeyMapping) => set({ isKeyMapping }),
}))

const useStore = createSelectors(useStoreBase)
export { useStore }
