import { Midi } from 'tonal'
import { notEmpty } from './util'
import { NoteZone } from './zone-settings'

const chromaticChroma = '11111111111'
export const getNotes = ({
  voices: intervals,
  root,
  scale,
  quantize,
  octave,
  translate,
}: NoteZone) => {
  const scaleChroma = scale.join('')
  const pcset = Midi.pcset(quantize.root ? scaleChroma : chromaticChroma)
  const toScale = Midi.pcsetNearest(scaleChroma)

  // 1. Find the root (take scale quantization into account)
  // 2. Map voices to notes
  // 3. Quantize individual voices if needed
  return (i: number) => {
    const centerNote =
      pcset[i % pcset.length] +
      ((Math.floor(i / pcset.length) + octave) * 12 + translate)
    // Currently not using velocity
    const voices = intervals
      .filter(({ on }) => on)
      .map(({ offset }) => centerNote + offset)
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
