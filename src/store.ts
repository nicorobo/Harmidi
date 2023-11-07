import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'
import { KeySettings, ScaleSettings } from './types/scale'

type CommonRowSettings = {
  channel: number
  octave: number
  velocity: number
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
export type AllRowSettings = NoteRowSettings | ChordRowSettings

export type RowSettings = {
  type: RowType
  settings: {
    'scale-note': NoteRowSettings
    'scale-chord': ScaleChordRowSettings
    'family-chord': FamilyChordRowSettings
  }
}

type Settings = RowSettings[]

interface State {
  activeKeys: string[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  settings: Settings
  updateRowType: (row: number, type: RowType) => void
  updateRowSettings: (row: number, settings: AllRowSettings) => void
}

const getDefaultScaleChordSettings = (
  overrides?: Partial<ScaleChordRowSettings>
): ScaleChordRowSettings => ({
  type: 'scale-chord',
  channel: 1,
  octave: 0,
  velocity: 100,
  key: { root: 'C', type: 'minor' },
  ...overrides,
})

const getDefaultFamilyChordSettings = (
  overrides?: Partial<FamilyChordRowSettings>
): FamilyChordRowSettings => ({
  type: 'family-chord',
  channel: 1,
  octave: 0,
  velocity: 100,
  family: 'm7',
  translate: 0,
  ...overrides,
})

const getDefaultNoteSettings = (
  overrides?: Partial<NoteRowSettings>
): NoteRowSettings => ({
  type: 'scale-note',
  channel: 2,
  octave: 0,
  velocity: 100,
  translate: 0,
  scale: { root: 'C', type: 'minor pentatonic' },
  ...overrides,
})

const getDefaultRowSettings = (type: RowType) => ({
  type,
  settings: {
    'scale-chord': getDefaultScaleChordSettings(),
    'family-chord': getDefaultFamilyChordSettings(),
    'scale-note': getDefaultNoteSettings(),
  },
})

const useStore = create<State>()((set, get) => ({
  activeKeys: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  settings: [
    getDefaultRowSettings('scale-chord'),
    getDefaultRowSettings('family-chord'),
    getDefaultRowSettings('scale-note'),
    getDefaultRowSettings('scale-note'),
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
      settings: state.settings.map((existingSettings, i) =>
        i === row ? { ...existingSettings, type } : existingSettings
      ),
    }))
  },
  updateRowSettings: (row, settings) => {
    set((state) => ({
      ...state,
      settings: state.settings.map((existingSettings, i) => {
        if (i !== row) {
          return existingSettings
        }
        return {
          ...existingSettings,
          settings: {
            ...existingSettings.settings,
            [existingSettings.type]: settings,
          },
        }
      }),
    }))
  },
}))

export { useStore }
