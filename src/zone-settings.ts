import { ScaleRoot, ScaleType } from './types/scale'

export type ZoneType = 'note' | 'chord' | 'chord-family'
// | 'operator' | 'sequencer'

// TODO: when we're ready for key overrides
// type KeySettings = string

type CommonSettings = {
  color: string
  // order: GridOrder
  // keyOverrides: { [key: string]: KeySettings }
}

type QuantizeSettings = { root: boolean; voices: boolean }

export type NoteZoneSettings = CommonSettings & {
  channel: number
  octave: number
  velocity: number
  hold: boolean
  translate: number
  muteZones: number[]
  voices: { offset: number; velocity: number; on: boolean }[]
  root: ScaleRoot
  scaleType: ScaleType
  customScale: number[]
  quantize: QuantizeSettings
}

export type ZoneSettings = NoteZoneSettings

const defaultSettings = {
  channel: 1,
  color: '#818FB4',
  octave: 0,
  velocity: 100,
  hold: false,
  translate: 0,
  muteZones: [],
  voices: [{ offset: 0, velocity: 100, on: true }],
  root: 'C' as ScaleRoot,
  quantize: { root: false, voices: false },
  scaleType: 'minor' as ScaleType,
  customScale: [],
}

export const getDefaultNoteSettings = (
  overrides?: Partial<NoteZoneSettings>
): NoteZoneSettings => ({
  ...defaultSettings,
  ...overrides,
})
