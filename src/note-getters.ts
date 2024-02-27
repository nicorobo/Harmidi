import { Midi } from 'tonal'
import { notEmpty } from './util'
import { NoteZone } from './zone-settings'

export type NoteInfo = { rootNote: number; midiNotes: number[] }
export const getNotes = ({
  voices: intervals,
  // TODO Use root
  // @ts-ignore
  root,
  scale,
  octave,
  translate,
}: NoteZone) => {
  const scaleChroma = scale.join('')
  const pcset = Midi.pcset(scaleChroma)
  const toScale = Midi.pcsetNearest(scaleChroma)

  // 1. Find the root (take scale quantization into account)
  // 2. Map voices to notes
  // 3. Quantize individual voices if needed
  return (i: number): NoteInfo => {
    const translatedIndex = i + translate
    const collapsedIndex = translatedIndex % pcset.length
    const wrappedIndex =
      collapsedIndex < 0 ? pcset.length + collapsedIndex : collapsedIndex
    const midiVal = pcset[wrappedIndex]
    const naturalOctave = Math.floor(translatedIndex / pcset.length)
    const octaveOffset = naturalOctave + octave
    const noteOffset = octaveOffset * 12
    const centerNote = midiVal + noteOffset

    // Currently not using velocity
    const voices = intervals.map(({ offset }) => centerNote + offset)
    // TODO Here we'll quantize them again
    const midiNotes = voices
      .map((note) => {
        const midiNote = Midi.toMidi(note)
        if (midiNote !== null) {
          return toScale(midiNote)
        }
      })
      .filter(notEmpty)
    return { rootNote: centerNote, midiNotes }
  }
}
