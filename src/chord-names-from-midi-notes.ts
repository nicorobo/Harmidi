import { uniq } from 'lodash'
import { Chord, Midi } from 'tonal'

const chordTypeToName: { [type: string]: string } = {
  major: 'M',
  minor: 'm',
  fifth: '5',
  'major seventh': 'M7',
  'minor seventh': 'm7',
  'dominant seventh': '7',
  'major sixth': 'M6',
  'minor sixth': 'm6',
  'dominant ninth': '9',
  'major ninth': 'M9',
  'minor ninth': 'm9',
  'dominant eleventh': '11',
  eleventh: '11',
  'minor eleventh': 'm11',
  thirteenth: '13',
  'major thirteenth': 'M13',
  'minor thirteenth': 'm13',
  augmented: '+',
  'minor augmented': 'm#5',
  'augmented seventh': '+7',
  diminished: 'o',
  'suspended second': 'sus2',
  'suspended fourth': 'sus4',
  'suspended fourth seventh': '7sus4',
}

export const getChordNameFromMidiNotes = (notes: number[]) => {
  const flattenedNotes = uniq(notes.map((note) => note % 12))
  if (flattenedNotes.length === 1) return null
  const noteNames = flattenedNotes.map((note) => Midi.midiToNoteName(note))
  const chord = Chord.detect(noteNames)[0]
  if (!chord) return '?'
  const chordType = Chord.get(chord).type
  return chordTypeToName[chordType] ?? '?'
}
