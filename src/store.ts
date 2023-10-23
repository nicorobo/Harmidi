import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'

type CommonRowSettings = {
  channel: number
  octave: number // Maybe should be transpose?
  velocity: number
}

type ScaleSettings = { root: string; type: string }
type KeySettings = { root: string; type: 'major' | 'minor' }

export type NoteRowSettings = CommonRowSettings & {
  type: 'scale-note'
  scale: ScaleSettings
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
}

type ChordRowSettings = ScaleChordRowSettings | FamilyChordRowSettings

export type RowSettings = NoteRowSettings | ChordRowSettings
type RowSettingsByIndex = RowSettings[]

interface State {
  active: number[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  rowSettings: RowSettingsByIndex
}

const useStore = create<State>()((set) => ({
  active: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  rowSettings: [
    {
      type: 'scale-chord',
      channel: 1,
      octave: 3,
      velocity: 100,
      key: { root: 'C', type: 'minor' },
    },
    {
      type: 'family-chord',
      channel: 1,
      octave: 3,
      velocity: 100,
      family: 'maj7',
    },
    {
      type: 'scale-note',
      channel: 1,
      octave: 3,
      velocity: 100,
      scale: { root: 'A', type: 'minor' },
    },
    {
      type: 'scale-note',
      channel: 1,
      octave: 3,
      velocity: 100,
      scale: { root: 'B', type: 'minor' },
    },
  ],
  keydown: (key) =>
    set((state) => ({
      active: [...state.active, state.keyboardConfig.keyToId[key]],
    })),
  keyup: (key) =>
    set((state) => {
      const id = state.keyboardConfig.keyToId[key]
      const active = state.active.filter((i) => i !== id)
      return { active }
    }),
}))

export { useStore }
