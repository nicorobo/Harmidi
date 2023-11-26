import { MusicalKey, MusicalScale, ScaleRoot, ScaleType } from './types/scale'

export type ZoneType = 'note' | 'chord' | 'chord-family'
// | 'operator' | 'sequencer'

// TODO: when we're ready for key overrides
// type KeySettings = string

type CommonSettings = {
  color: string
  // order: GridOrder
  // keyOverrides: { [key: string]: KeySettings }
}

// type CommonOutputSettings = { channel: number }

// export type CommonLivePlaySettings = CommonSettings &
//   CommonOutputSettings & {
//     octave: number
//     velocity: number
//     hold: boolean
//     muteZones: number[]
//   }

// export type NoteZoneSettings = CommonLivePlaySettings & {
//   type: 'note'
//   scale: MusicalScale
//   translate: number
// }

// type CommonChordZoneSettings = CommonLivePlaySettings & {
//   voicing?: string
// }

// export type ChordZoneSettings = CommonChordZoneSettings & {
//   type: 'chord'
//   family: string
//   translate: number
// }

// export type ChordFamilyZoneSettings = CommonChordZoneSettings & {
//   type: 'chord-family'
//   key: MusicalKey
// }
export type NoteZoneSettings = CommonSettings & {
  channel: number
  octave: number
  velocity: number
  hold: boolean
  translate: number
  muteZones: number[]
  voices: { semitones: number; velocity: number; on: boolean }[]
  root: ScaleRoot
  quantize: boolean
  scaleType: ScaleType
  customScale: number[]
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
  voices: [],
  root: 'C' as ScaleRoot,
  quantize: false,
  scaleType: 'minor' as ScaleType,
  customScale: [],
}

// export const getDefaultChordFamilySettings = (
//   overrides?: Partial<NoteZoneSettings>
// ): NoteZoneSettings => ({
//   ...defaultSettings,
//   ...overrides,
// })

// export const getDefaultChordSettings = (
//   overrides?: Partial<ChordZoneSettings>
// ): ChordZoneSettings => ({
//   type: 'chord',
//   family: 'm7',
//   translate: 0,
//   color: '#363062',
//   ...defaultSettings,
//   ...overrides,
// })

export const getDefaultNoteSettings = (
  overrides?: Partial<NoteZoneSettings>
): NoteZoneSettings => ({
  ...defaultSettings,
  ...overrides,
})

// export const switchZoneType = (type: ZoneType, settings: ZoneSettings) => {
//   const { channel, velocity, octave, muteZones } = settings
//   const override = {
//     channel,
//     velocity,
//     octave,
//     muteZones,
//   }
//   switch (type) {
//     case 'note':
//       return getDefaultNoteSettings(override)
//     case 'chord':
//       return getDefaultChordSettings(override)
//     case 'chord-family':
//       return getDefaultChordFamilySettings(override)
//   }
// }
