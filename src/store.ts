import { create } from 'zustand'
import { keyboardConfigs, KeyboardConfig } from './keyboard-config'

type CommonRowSettings = {
  channel: number
  octave: number // Maybe should be transpose?
  velocity: number
}

type ScaleSettings = { root: string; type: string }

type NoteRowSettings = CommonRowSettings & {
  type: 'scale-note'
  scale?: ScaleSettings
}

type CommonChordRowSettings = CommonRowSettings & {
  voicing?: string
}

type ScaleChordRowSettings = CommonChordRowSettings & {
  type: 'scale-chord'
  scale?: ScaleSettings
}

type FamilyChordRowSettings = CommonChordRowSettings & {
  type: 'family-chord'
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
  globalScale: ScaleSettings
}

const useStore = create<State>()((set) => ({
  active: [],
  keyboardConfig: keyboardConfigs.USEnglish,
  globalScale: { root: 'C', type: 'major' },
  rowSettings: [
    { type: 'scale-chord', channel: 1, octave: 3, velocity: 100 },
    {
      type: 'family-chord',
      channel: 1,
      octave: 3,
      velocity: 100,
      family: 'maj7',
    },
    { type: 'scale-note', channel: 1, octave: 3, velocity: 100 },
    { type: 'scale-note', channel: 1, octave: 3, velocity: 100 },
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
