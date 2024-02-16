import * as Tone from 'tone'
// Factories for creating a new instruments
const pianoFactory = () =>
  new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 10,
    },
  }).toDestination()

export const availableInstruments = [
  { id: 'piano', name: 'Piano', factory: pianoFactory },
  { id: 'piano2', name: 'Piano2', factory: pianoFactory },
]

export type ZoneInstrument = {
  id: string
  instrument: Tone.PolySynth
}
