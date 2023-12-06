import { Midi, Scale, Note, Interval } from 'tonal'
import { notEmpty } from './util'
import { NoteZone } from './zone-settings'

// TODO We can also return the actual chord/note objects to power our UI
// export const getChords = ({ family, octave, translate }: ChordZoneSettings) => {
//   const scaleDegrees = Scale.steps(`C${octave + 3} chromatic`)
//   return (i: number) => {
//     const chord = Chord.getChord(family, scaleDegrees(i + translate))
//     const midiNotes = chord.notes
//       .map((note) => Midi.toMidi(note))
//       .filter(notEmpty)
//     return midiNotes
//   }
// }

// TODO We can also return the actual chord/note objects to power our UI
// export const getFamilyChords = ({ key, octave }: ChordFamilyZoneSettings) => {
//   const keyObj =
//     key.type === 'major'
//       ? Key.majorKey(key.root)
//       : Key.minorKey(key.root).natural
//   return (i: number) => {
//     const baseChord = Chord.get(keyObj.chords[i])
//     const chord = Chord.getChord(
//       baseChord.type,
//       (baseChord.tonic || 'C') + (octave + 3)
//     )
//     const midiNotes = chord.notes
//       .map((note) => Midi.toMidi(note))
//       .filter(notEmpty)
//     return midiNotes
//   }
// }

// TODO We can also return the actual chord/note objects to power our UI
// export const getNotesOld = ({
//   root,
//   scaleType,
//   octave,
//   translate,
// }: NoteZoneSettings) => {
//   const scaleName = `${root}${octave + 3} ${scaleType}`
//   const scaleDegrees = Scale.steps(scaleName)
//   return (i: number) => {
//     const note = Midi.toMidi(scaleDegrees(i + translate))
//     if (!note) {
//       throw new Error('Null MIDI note coming from getNotes()')
//     }
//     return note
//   }
// }
export const getNotes = ({
  voices: intervals,
  root,
  scaleType,
  quantize,
  octave,
  translate,
}: NoteZone) => {
  const scaleName = `${root}${octave + 3} ${
    quantize.root ? scaleType : 'chromatic'
  }`
  const scaleDegrees = Scale.steps(scaleName)
  const toScale = Midi.pcsetNearest(Scale.get(`${root} ${scaleType}`).chroma)

  // 1. Find the root (take scale quantization into account)
  // 2. Map voices to notes
  // 3. Quantize individual voices if needed
  return (i: number) => {
    const centerNote = scaleDegrees(i + translate)
    // Currently not using velocity
    const voices = intervals
      .filter(({ on }) => on)
      .map(({ offset }) =>
        Note.transpose(centerNote, Interval.fromSemitones(offset))
      )
    // TODO Here we'll quantize them again
    const midiNotes = voices
      .map((note) => {
        const midiNote = Midi.toMidi(note)
        return quantize.voices && midiNote !== null
          ? toScale(midiNote)
          : midiNote
      })
      .filter(notEmpty)
    return midiNotes
  }
}
