import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import { KeySettings, ScaleSettings } from './types/scale'

type CommonRowSettings = {
  channel: number
  octave: number
  velocity: number
  hold: boolean
  muteOnPlayRows: number[] // As this affects the behavior of other zones, perhaps
}

export type NoteRowSettings = CommonRowSettings & {
  type: 'scale-note'
  scale: ScaleSettings
  translate: number
}

type CommonChordRowSettings = CommonRowSettings & {
  voicing?: string
}

export type ScaleChordRowSettings = CommonChordRowSettings & {
  type: 'scale-chord'
  key: KeySettings
}

export type FamilyChordRowSettings = CommonChordRowSettings & {
  type: 'family-chord'
  family: string
  translate: number
}

type ChordRowSettings = ScaleChordRowSettings | FamilyChordRowSettings

type RowType = 'scale-note' | 'scale-chord' | 'family-chord'
export type RowSettings = NoteRowSettings | ChordRowSettings
export type Settings = RowSettings[]

interface State {
  activeKeys: string[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  settings: Settings
  updateRowType: (row: number, type: RowType) => void
  updateRowSettings: (row: number, settings: RowSettings) => void
}

const defaultSettings = {
  channel: 1,
  octave: 0,
  velocity: 100,
  hold: false,
  muteOnPlayRows: [],
}

const getDefaultScaleChordSettings = (
  overrides?: Partial<ScaleChordRowSettings>
): ScaleChordRowSettings => ({
  type: 'scale-chord',
  key: { root: 'C', type: 'minor' },
  ...defaultSettings,
  ...overrides,
})

const getDefaultFamilyChordSettings = (
  overrides?: Partial<FamilyChordRowSettings>
): FamilyChordRowSettings => ({
  type: 'family-chord',
  family: 'm7',
  translate: 0,
  ...defaultSettings,
  ...overrides,
})

const getDefaultNoteSettings = (
  overrides?: Partial<NoteRowSettings>
): NoteRowSettings => ({
  type: 'scale-note',
  translate: 0,
  scale: { root: 'C', type: 'minor pentatonic' },
  ...defaultSettings,
  ...overrides,
})

const useStore = create<State>()((set, get) => ({
  activeKeys: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  settings: [
    getDefaultScaleChordSettings({ muteOnPlayRows: [0], hold: true }),
    getDefaultFamilyChordSettings({ muteOnPlayRows: [1] }),
    getDefaultNoteSettings(),
    getDefaultNoteSettings(),
  ],
  keydown: (key) => {
    if (get().keyboardConfig.keyList.includes(key)) {
      set((state) => ({
        activeKeys: [...state.activeKeys, key],
      }))
    }
  },

  keyup: (key) => {
    if (get().keyboardConfig.keyList.includes(key)) {
      set((state) => {
        const active = state.activeKeys.filter((i) => i !== key)
        return { activeKeys: active }
      })
    }
  },
  updateRowType: (row, type) => {
    set((state) => ({
      ...state,
      settings: state.settings.map((existingSettings, i) => {
        if (i !== row) {
          return existingSettings
        }
        const { channel, velocity, octave, muteOnPlayRows } = existingSettings
        const override = {
          channel,
          velocity,
          octave,
          muteOnPlayRows,
        }
        if (type === 'family-chord') {
          return getDefaultFamilyChordSettings(override)
        } else if (type === 'scale-chord') {
          return getDefaultScaleChordSettings(override)
        } else if (type === 'scale-note') {
          return getDefaultNoteSettings(override)
        } else {
          throw new Error(`Cannot update row ${row} to type ${type}`)
        }
      }),
    }))
  },
  // Consider allowing partial updates here.
  updateRowSettings: (row, settings) => {
    set((state) => ({
      ...state,
      settings: state.settings.map((existingSettings, i) => {
        if (i !== row) {
          return existingSettings
        }
        return settings
      }),
    }))
  },
}))

export { useStore }
