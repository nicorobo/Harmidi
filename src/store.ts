import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'

type RowType = 'chord' | 'note' | 'operator'
type CommonRowSettings = {
  type: RowType
  channel: number
  octave: number // Maybe should be transpose?
  velocity: number
}

type NoteRowSettings = CommonRowSettings & {
  scale?: string
}

type CommonChordRowSettings = CommonRowSettings & {
  voicing?: string
}

type ScaleChordRowSettings = CommonChordRowSettings & {
  scale?: string
}

type FamilyChordRowSettings = CommonChordRowSettings & {
  family: string
}

type ChordRowSettings = ScaleChordRowSettings | FamilyChordRowSettings

type RowSettings = (NoteRowSettings | ChordRowSettings)[]

interface State {
  active: number[]
  keyboardConfig: KeyboardConfig
  keydown: (key: string) => void
  keyup: (key: string) => void
  rowSettings: RowSettings
}

const useStore = create<State>()((set) => ({
  active: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  scale: { root: 'C', type: 'major' },
  rowSettings: [
    { type: 'chord', channel: 1, octave: 3, velocity: 100 },
    { type: 'chord', channel: 1, octave: 3, velocity: 100, family: 'maj7' },
    { type: 'note', channel: 1, octave: 3, velocity: 100 },
    { type: 'note', channel: 1, octave: 3, velocity: 100 },
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
