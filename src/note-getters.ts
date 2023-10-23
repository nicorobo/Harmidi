import { Chord, Key, Midi, Scale } from 'tonal'
import {
  FamilyChordRowSettings,
  NoteRowSettings,
  ScaleChordRowSettings,
} from './store'
import { notEmpty } from './util'

const c3chromatic = Scale.degrees('C4 chromatic')

// TODO We can also return the actual chord/note objects to power our UI
export const getFamilyChords = (rowSettings: FamilyChordRowSettings) => {
  return (i: number) => {
    const chord = Chord.getChord(rowSettings.family, c3chromatic(i + 1))
    const midiNotes = chord.notes
      .map((note) => Midi.toMidi(note))
      .filter(notEmpty)
    return midiNotes
  }
}

// TODO We can also return the actual chord/note objects to power our UI
export const getScaleChords = (rowSettings: ScaleChordRowSettings) => {
  const key =
    rowSettings.key.type === 'major'
      ? Key.majorKey(rowSettings.key.root)
      : Key.minorKey(rowSettings.key.root).natural
  return (i: number) => {
    const baseChord = Chord.get(key.chords[i])
    const chord = Chord.getChord(
      baseChord.type,
      (baseChord.tonic || 'C') + rowSettings.octave
    )
    const midiNotes = chord.notes
      .map((note) => Midi.toMidi(note))
      .filter(notEmpty)
    return midiNotes
  }
}

// TODO We can also return the actual chord/note objects to power our UI
export const getScaleNotes = (rowSettings: NoteRowSettings) => {
  return (i: number) => {
    return [60]
  }
}
