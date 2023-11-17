import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import {
  ZoneSettings,
  ZoneType,
  getDefaultChordFamilySettings,
  getDefaultChordSettings,
  getDefaultNoteSettings,
  switchZoneType,
} from './zone-settings'

export type Settings = ZoneSettings[]
export type ZoneByKey = { [key: string]: number }

// Zones are not associated to rows, but by default the zones are rows.
const getRowByKey = (keyGrid: string[][]): ZoneByKey => {
  const dict: ZoneByKey = {}
  for (let i = 0; i < keyGrid.length; i++) {
    for (let j = 0; j < keyGrid[i].length; j++) {
      dict[keyGrid[i][j]] = i
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
  updateZoneType: (zone: number, type: ZoneType) => void
  updateZoneSettings: (zone: number, settings: ZoneSettings) => void
  zoneByKey: ZoneByKey
  updateKeyZone: (key: string, zone: number) => void
  selectedZone: number | null
  setSelectedZone: (zone: number | null) => void
}

const useStore = create<State>()((set) => ({
  pressedKeys: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  zoneByKey: getRowByKey(keyboardConfigs.USEnglish.keyGrid), // Initially, each row is its own zone
  updateKeyZone: (key, zone) =>
    set((state) => ({
      ...state,
      zoneByKey: { ...state.zoneByKey, [key]: zone },
    })),
  selectedZone: 0,
  setSelectedZone: (zone) =>
    set((state) => ({
      ...state,
      selectedZone: zone,
    })),
  settings: [
    getDefaultChordFamilySettings({ muteZones: [0], hold: true }),
    getDefaultChordSettings({ muteZones: [1] }),
    getDefaultNoteSettings(),
    getDefaultNoteSettings(),
  ],
  keydown: (key) =>
    set((state) => {
      return {
        ...state,
        pressedKeys: [...state.pressedKeys, key],
      }
    }),

  keyup: (key) =>
    set((state) => {
      return {
        ...state,
        pressedKeys: state.pressedKeys.filter((k) => k !== key),
      }
    }),
  updateZoneType: (zone, type) =>
    set((state) => ({
      ...state,
      settings: state.settings.with(
        zone,
        switchZoneType(type, state.settings[zone])
      ),
    })),
  // Consider allowing partial updates here.
  updateZoneSettings: (zone, settings) => {
    set((state) => ({
      ...state,
      settings: state.settings.with(zone, settings),
    }))
  },
}))

export { useStore }
