import { nanoid } from 'nanoid'

export const DEFAULT_VELOCITY = 100

export type QuantizeSettings = { root: boolean; voices: boolean }
export type ZoneOrderSettings = {
  leftToRight: boolean
  topToBottom: boolean
  reverse: boolean
}

const defaultOrderSettings: ZoneOrderSettings = {
  leftToRight: true,
  topToBottom: true,
  reverse: false,
}

/* 

  Note Zone Settings

*/
export type Voice = { offset: number; velocity: number }
export type NoteZone = {
  id: string
  color: string
  zoneType: 'note'
  channel: number
  octave: number
  velocity: number
  hold: boolean
  translate: number
  muteZones: string[]
  voices: Voice[]
  root: number
  scale: number[]
  order: ZoneOrderSettings
}

const defaultNoteZone: Omit<NoteZone, 'id'> = {
  color: '#333',
  zoneType: 'note',
  channel: 1,
  octave: 4,
  velocity: DEFAULT_VELOCITY,
  hold: false,
  translate: 0,
  muteZones: [],
  voices: [{ offset: 0, velocity: DEFAULT_VELOCITY }],
  root: 0,
  scale: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // chromatic
  order: defaultOrderSettings,
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
  color: string
  zoneType: 'control'
  channel: number
  // useNoteChannel: boolean
  hold: boolean
  noteZones: string[]
  order: ZoneOrderSettings
  attack: number
  release: number
  initialValue: number
  targetValue: number
  midiCC: number
  triggerOnNote: boolean
  legato: boolean
}

const defaultControlZone: Omit<ControlZone, 'id'> = {
  color: '#333',
  zoneType: 'control',
  channel: 1,
  hold: false,
  noteZones: [],
  attack: 500,
  release: 500,
  initialValue: 0,
  targetValue: 127,
  midiCC: 0,
  order: defaultOrderSettings,
  triggerOnNote: false,
  legato: false,
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
  color: string
  zoneType: 'mutate'
  hold: boolean
  noteZones: string[]
  order: ZoneOrderSettings
  voices: { offset: number; velocity: number; on: boolean }[]
  beforeQuantization: boolean
}

const defaultMutateZone: Omit<MutateZone, 'id'> = {
  color: '#333',
  zoneType: 'mutate',
  hold: false,
  noteZones: [],
  voices: [{ offset: 0, velocity: DEFAULT_VELOCITY, on: true }],
  order: defaultOrderSettings,
  beforeQuantization: false,
}

export const getDefaultMutateZone = (
  overrides?: Partial<MutateZone>
): MutateZone => ({
  id: nanoid(),
  ...defaultMutateZone,
  ...overrides,
})

export type DeadZone = {
  id: string
  zoneType: 'dead'
  color: string
}

export const DEAD_ZONE_ID = 'dead-zone' // TODO replace dead zones with nothingness, it's too ridiculous

export const getDefaultDeadZone = (
  overrides?: Partial<DeadZone>
): DeadZone => ({
  id: DEAD_ZONE_ID,
  zoneType: 'dead',
  color: '#fff',
  ...overrides,
})

export type Zone = NoteZone | ControlZone | MutateZone | DeadZone

export const isControlZone = (zone: Zone): zone is ControlZone =>
  zone.zoneType === 'control'
export const isMutateZone = (zone: Zone): zone is MutateZone =>
  zone.zoneType === 'mutate'
export const isNoteZone = (zone: Zone): zone is NoteZone =>
  zone.zoneType === 'note'
export const isDeadZone = (zone: Zone): zone is DeadZone =>
  zone.zoneType === 'dead'
