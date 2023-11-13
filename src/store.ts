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

interface State {
  pressedKeys: string[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  settings: Settings
  updateZoneType: (zone: number, type: ZoneType) => void
  updateZoneSettings: (zone: number, settings: ZoneSettings) => void
}

const useStore = create<State>()((set) => ({
  pressedKeys: [],
  keyboardConfig: keyboardConfigs.USEnglish,
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
