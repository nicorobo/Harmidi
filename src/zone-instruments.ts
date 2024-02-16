import * as Tone from 'tone'
// Factories for creating a new instruments
const pianoFactory = () =>
  new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
  }).toDestination()
const steelpanFactory = () =>
  new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: 'fatcustom',
      partials: [0.2, 1, 0, 0.5, 0.1],
      spread: 40,
      count: 3,
    },
    envelope: {
      attack: 0.001,
      decay: 1.6,
      sustain: 0,
      release: 1.6,
    },
  }).toDestination()

export const availableInstruments = [
  { id: 'piano', name: 'Piano', factory: pianoFactory },
  { id: 'steelpan', name: 'Steel Pan', factory: steelpanFactory },
]

export type ZoneInstrument = {
  id: string
  instrument: Tone.PolySynth
}
