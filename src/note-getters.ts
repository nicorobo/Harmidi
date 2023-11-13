import { Chord, Key, Midi, Scale } from 'tonal'
import { notEmpty } from './util'
import {
  NoteZoneSettings,
  ChordFamilyZoneSettings,
  ChordZoneSettings,
} from './zone-settings'

// TODO We can also return the actual chord/note objects to power our UI
export const getChords = ({ family, octave, translate }: ChordZoneSettings) => {
  const scaleDegrees = Scale.steps(`C${octave + 3} chromatic`)
  return (i: number) => {
    const chord = Chord.getChord(family, scaleDegrees(i + translate))
    const midiNotes = chord.notes
      .map((note) => Midi.toMidi(note))
      .filter(notEmpty)
    return midiNotes
  }
}

// TODO We can also return the actual chord/note objects to power our UI
export const getFamilyChords = ({ key, octave }: ChordFamilyZoneSettings) => {
  const keyObj =
    key.type === 'major'
      ? Key.majorKey(key.root)
      : Key.minorKey(key.root).natural
  return (i: number) => {
    const baseChord = Chord.get(keyObj.chords[i])
    const chord = Chord.getChord(
      baseChord.type,
      (baseChord.tonic || 'C') + (octave + 3)
    )
    const midiNotes = chord.notes
      .map((note) => Midi.toMidi(note))
      .filter(notEmpty)
    return midiNotes
  }
}

// TODO We can also return the actual chord/note objects to power our UI
export const getNotes = ({ scale, octave, translate }: NoteZoneSettings) => {
  const scaleName = `${scale.root}${octave + 3} ${scale.type}`
  const scaleDegrees = Scale.steps(scaleName)
  return (i: number) => {
    const note = Midi.toMidi(scaleDegrees(i + translate))
    if (!note) {
      throw new Error('Null MIDI note coming from getNotes()')
    }
    return note
  }
}
