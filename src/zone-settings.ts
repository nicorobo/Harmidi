import { nanoid } from 'nanoid'
import { ZoneInstrument, availableInstruments } from './zone-instruments'
import { randomColor } from './colors'

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

type Common = {
  id: string
  color: string
  name: string
}

/* 

  Note Zone Settings

*/
export type Voice = { offset: number; velocity: number }
export type NoteZone = Common & {
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
  instrument: ZoneInstrument
}

export const getInstrumentById = (id: string): ZoneInstrument => {
  const instrument = availableInstruments.find((i) => i.id === id)
  if (!instrument) {
    throw new Error(`No instrument found with id ${id}`)
  }
  return {
    id: instrument.id,
    instrument: instrument.factory(),
  }
}

const defaultNoteZone: Omit<NoteZone, 'id'> = {
  name: 'Note Zone',
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
  instrument: getInstrumentById('sine'),
  order: defaultOrderSettings,
}
export const getDefaultNoteZone = (
  overrides?: Partial<NoteZone>
): NoteZone => ({
  id: nanoid(),
  ...defaultNoteZone,
  color: randomColor(),
  ...overrides,
})

export type Zone = NoteZone

export const isNoteZone = (zone: Zone): zone is NoteZone =>
  zone.zoneType === 'note'
