import { MusicalKey, MusicalScale } from './types/scale'

export type ZoneType = 'note' | 'chord' | 'chord-family'
// | 'operator' | 'sequencer'

// TODO: when we're ready for key overrides
// type KeySettings = string

type CommonSettings = {
  type: ZoneType
  // keyOverrides: { [key: string]: KeySettings }
}

type CommonOutputSettings = { channel: number }

type CommonLivePlaySettings = CommonSettings &
  CommonOutputSettings & {
    octave: number
    velocity: number
    hold: boolean
    muteZones: number[]
  }

export type NoteZoneSettings = CommonLivePlaySettings & {
  type: 'note'
  scale: MusicalScale
  translate: number
}

type CommonChordZoneSettings = CommonLivePlaySettings & {
  voicing?: string
}

export type ChordZoneSettings = CommonChordZoneSettings & {
  type: 'chord'
  family: string
  translate: number
}

export type ChordFamilyZoneSettings = CommonChordZoneSettings & {
  type: 'chord-family'
  key: MusicalKey
}

export type ZoneSettings =
  | NoteZoneSettings
  | ChordZoneSettings
  | ChordFamilyZoneSettings

const defaultSettings = {
  channel: 1,
  octave: 0,
  velocity: 100,
  hold: false,
  muteZones: [],
}

export const getDefaultChordFamilySettings = (
  overrides?: Partial<ChordFamilyZoneSettings>
): ChordFamilyZoneSettings => ({
  type: 'chord-family',
  key: { root: 'C', type: 'minor' },
  ...defaultSettings,
  ...overrides,
})

export const getDefaultChordSettings = (
  overrides?: Partial<ChordZoneSettings>
): ChordZoneSettings => ({
  type: 'chord',
  family: 'm7',
  translate: 0,
  ...defaultSettings,
  ...overrides,
})

export const getDefaultNoteSettings = (
  overrides?: Partial<NoteZoneSettings>
): NoteZoneSettings => ({
  type: 'note',
  translate: 0,
  scale: { root: 'C', type: 'minor pentatonic' },
  ...defaultSettings,
  ...overrides,
})

export const switchZoneType = (type: ZoneType, settings: ZoneSettings) => {
  const { channel, velocity, octave, muteZones } = settings
  const override = {
    channel,
    velocity,
    octave,
    muteZones,
  }
  switch (type) {
    case 'note':
      return getDefaultNoteSettings(override)
    case 'chord':
      return getDefaultChordSettings(override)
    case 'chord-family':
      return getDefaultChordFamilySettings(override)
  }
}
