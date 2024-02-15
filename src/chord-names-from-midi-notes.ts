import { Chord, Midi } from 'tonal'

const chordTypeToName: { [type: string]: string } = {
  major: 'M',
  minor: 'm',
  'major seventh': 'M7',
  'minor seventh': 'm7',
  'dominant seventh': '7',
  'major sixth': 'M6',
  'minor sixth': 'm6',
  'dominant ninth': '9',
  'major ninth': 'M9',
  'minor ninth': 'm9',
  'dominant eleventh': '11',
  'major eleventh': 'M11',
  'minor eleventh': 'm11',
  augmented: '+',
  'minor augmented': 'm#5',
  'augmented seventh': '+7',
  diminished: 'o',
  'suspended second': 'sus2',
  'suspended fourth': 'sus4',
}

export const getChordNameFromMidiNotes = (notes: number[]) => {
  const flattenedNotes = notes.map((note) => note % 12)
  if (flattenedNotes.length === 1) return null
  const noteNames = flattenedNotes.map((note) => Midi.midiToNoteName(note))
  const chord = Chord.detect(noteNames)[0]
  if (!chord) return 'unknown'
  const chordType = Chord.get(chord).type
  //   console.log(chord, Chord.get(chord), chordTypeToName[chordType] ?? chordType)
  return chordTypeToName[chordType] ?? 'unknown'
}
