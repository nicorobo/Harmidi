import { nanoid } from 'nanoid'
import { ScaleRoot, ScaleType } from './types/scale'

type QuantizeSettings = { root: boolean; voices: boolean }
export type ZoneOrderSettings = {
  leftToRight: boolean
  topToBottom: boolean
  reverse: boolean
}

/* 

  Note Zone Settings

*/

export type NoteZone = {
  id: string
  zoneType: 'note'
  channel: number
  octave: number
  velocity: number
  hold: boolean
  translate: number
  muteZones: string[]
  voices: { offset: number; velocity: number; on: boolean }[]
  root: ScaleRoot
  scaleType: ScaleType
  customScale: number[]
  quantize: QuantizeSettings
  order: ZoneOrderSettings
}

const defaultNoteZone: Omit<NoteZone, 'id'> = {
  zoneType: 'note',
  channel: 1,
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
  order: { leftToRight: true, topToBottom: true, reverse: false },
}

export const getDefaultNoteZone = (
  overrides?: Partial<NoteZone>
): NoteZone => ({
  id: nanoid(),
  ...defaultNoteZone,
  ...overrides,
})

/* 

  Operator Zone Settings

*/

export type ControlZone = {
  id: string
  zoneType: 'control'
  channel: number
  hold: boolean
  noteZones: number[]
  order: ZoneOrderSettings
  upTime: number
  downTime: number
  startValue: number
  endValue: number
  midiCC: number
}

const defaultControlZone: Omit<ControlZone, 'id'> = {
  zoneType: 'control',
  channel: 1,
  hold: false,
  noteZones: [],
  upTime: 500,
  downTime: 500,
  startValue: 0,
  endValue: 3,
  midiCC: 0,
  order: { leftToRight: true, topToBottom: true, reverse: false },
}

export const getDefaultControlZone = (
  overrides?: Partial<ControlZone>
): ControlZone => ({
  id: nanoid(),
  ...defaultControlZone,
  ...overrides,
})

export type MutateZone = {
  id: string
  zoneType: 'mutate'
  hold: boolean
  noteZones: number[]
  order: ZoneOrderSettings
  voices: { offset: number; velocity: number; on: boolean }[]
  beforeQuantization: boolean
}

const defaultMutateZone: Omit<MutateZone, 'id'> = {
  zoneType: 'mutate',
  hold: false,
  noteZones: [],
  voices: [{ offset: 0, velocity: 100, on: true }],
  order: { leftToRight: true, topToBottom: true, reverse: false },
  beforeQuantization: false,
}

export const getDefaultMutateZone = (
  overrides?: Partial<MutateZone>
): MutateZone => ({
  id: nanoid(),
  ...defaultMutateZone,
  ...overrides,
})

export type Zone = NoteZone | ControlZone | MutateZone

export const isControlZone = (zone: Zone): zone is ControlZone =>
  zone.zoneType === 'control'
export const isMutateZone = (zone: Zone): zone is MutateZone =>
  zone.zoneType === 'mutate'
export const isNoteZone = (zone: Zone): zone is NoteZone =>
  zone.zoneType === 'note'
