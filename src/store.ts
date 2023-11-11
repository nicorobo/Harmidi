import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import { KeySettings, ScaleSettings } from './types/scale'

type CommonZoneSettings = {
  channel: number
  octave: number
  velocity: number
  hold: boolean
  muteZones: number[] // As this affects the behavior of other zones, perhaps
}

export type NoteZoneSettings = CommonZoneSettings & {
  type: 'scale-note'
  scale: ScaleSettings
  translate: number
}

type CommonChordZoneSettings = CommonZoneSettings & {
  voicing?: string
}

export type ScaleChordZoneSettings = CommonChordZoneSettings & {
  type: 'scale-chord'
  key: KeySettings
}

export type FamilyChordZoneSettings = CommonChordZoneSettings & {
  type: 'family-chord'
  family: string
  translate: number
}

type ChordZoneSettings = ScaleChordZoneSettings | FamilyChordZoneSettings

type ZoneType = 'scale-note' | 'scale-chord' | 'family-chord'
export type ZoneSettings = NoteZoneSettings | ChordZoneSettings
export type Settings = ZoneSettings[]

interface State {
  activeKeys: string[]
  pressedKeys: string[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  settings: Settings
  updateZoneType: (zone: number, type: ZoneType) => void
  updateZoneSettings: (zone: number, settings: ZoneSettings) => void
}

const defaultSettings = {
  channel: 1,
  octave: 0,
  velocity: 100,
  hold: false,
  muteZones: [],
}

const getDefaultScaleChordSettings = (
  overrides?: Partial<ScaleChordZoneSettings>
): ScaleChordZoneSettings => ({
  type: 'scale-chord',
  key: { root: 'C', type: 'minor' },
  ...defaultSettings,
  ...overrides,
})

const getDefaultFamilyChordSettings = (
  overrides?: Partial<FamilyChordZoneSettings>
): FamilyChordZoneSettings => ({
  type: 'family-chord',
  family: 'm7',
  translate: 0,
  ...defaultSettings,
  ...overrides,
})

const getDefaultNoteSettings = (
  overrides?: Partial<NoteZoneSettings>
): NoteZoneSettings => ({
  type: 'scale-note',
  translate: 0,
  scale: { root: 'C', type: 'minor pentatonic' },
  ...defaultSettings,
  ...overrides,
})

const switchZoneType = (type: ZoneType, settings: ZoneSettings) => {
  const { channel, velocity, octave, muteZones } = settings
  const override = {
    channel,
    velocity,
    octave,
    muteZones,
  }
  switch (type) {
    case 'family-chord':
      return getDefaultFamilyChordSettings(override)
    case 'scale-chord':
      return getDefaultScaleChordSettings(override)
    case 'scale-note':
      return getDefaultNoteSettings(override)
  }
}

// I don't think we need the whole state but who knows.
const addKey = (
  key: string,
  { activeKeys, settings, keyboardConfig: { zoneByKey } }: State
) => {
  const zone = zoneByKey[key]
  const { hold, muteZones } = settings[zone]
  const selfMuting = muteZones.includes(zone)
  const isActive = activeKeys.includes(key)
  if (hold && isActive) {
    // Turn key off
    return activeKeys.filter((k) => k !== key)
  }
  if (hold && selfMuting) {
    // Clear keys in same zone and add key
    return activeKeys.filter((k) => zoneByKey[k] !== zone).concat(key)
  }
  return activeKeys.concat(key)
}

// I don't think we need the whole state but who knows.
const removeKey = (
  key: string,
  { activeKeys, settings, keyboardConfig: { zoneByKey } }: State
) => {
  const zone = zoneByKey[key]
  const { hold } = settings[zone]
  if (hold) {
    // We only handle hold zones during keydown
    return activeKeys
  }
  return activeKeys.filter((k) => k !== key)
}

const useStore = create<State>()((set) => ({
  activeKeys: [],
  pressedKeys: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  settings: [
    getDefaultScaleChordSettings({ muteZones: [0], hold: true }),
    getDefaultFamilyChordSettings({ muteZones: [1] }),
    getDefaultNoteSettings(),
    getDefaultNoteSettings(),
  ],
  keydown: (key) =>
    set((state) => {
      return {
        ...state,
        pressedKeys: [...state.pressedKeys, key],
        activeKeys: addKey(key, state),
      }
    }),

  keyup: (key) =>
    set((state) => {
      return {
        ...state,
        pressedKeys: state.pressedKeys.filter((k) => k !== key),
        activeKeys: removeKey(key, state),
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
