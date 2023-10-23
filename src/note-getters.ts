import { Chord, Key, Midi, Scale, ScaleType } from 'tonal'
import {
  FamilyChordRowSettings,
  NoteRowSettings,
  ScaleChordRowSettings,
} from './store'
import { notEmpty } from './util'

// TODO We can also return the actual chord/note objects to power our UI
export const getFamilyChords = ({ family, octave }: FamilyChordRowSettings) => {
  console.log(ScaleType.all().map(({ name }) => name))
  const scaleDegrees = Scale.degrees(`C${octave} chromatic`)
  return (i: number) => {
    const chord = Chord.getChord(family, scaleDegrees(i + 1))
    const midiNotes = chord.notes
      .map((note) => Midi.toMidi(note))
      .filter(notEmpty)
    return midiNotes
  }
}

// TODO We can also return the actual chord/note objects to power our UI
export const getScaleChords = ({ key, octave }: ScaleChordRowSettings) => {
  const keyObj =
    key.type === 'major'
      ? Key.majorKey(key.root)
      : Key.minorKey(key.root).natural
  return (i: number) => {
    const baseChord = Chord.get(keyObj.chords[i])
    const chord = Chord.getChord(
      baseChord.type,
      (baseChord.tonic || 'C') + octave
    )
    const midiNotes = chord.notes
      .map((note) => Midi.toMidi(note))
      .filter(notEmpty)
    return midiNotes
  }
}

// TODO We can also return the actual chord/note objects to power our UI
export const getScaleNotes = ({ scale, octave }: NoteRowSettings) => {
  const scaleName = `${scale.root}${octave} ${scale.type}`
  const scaleDegrees = Scale.degrees(scaleName)
  return (i: number) => {
    const note = Midi.toMidi(scaleDegrees(i + 1))
    if (!note) {
      throw new Error('Null MIDI note coming from getScaleNotes()')
    }
    return note
  }
}
