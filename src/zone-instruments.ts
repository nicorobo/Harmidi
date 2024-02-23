import * as Tone from 'tone'
// Factories for creating a new instruments
const limiter = new Tone.Limiter(-10).chain(Tone.Destination)

const sineFactory = () =>
  new Tone.PolySynth(Tone.Synth, {
    volume: -10,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.5,
      release: 1.2,
    },
  }).connect(limiter)

const sawFactory = () =>
  new Tone.PolySynth(Tone.Synth, {
    volume: -10,
    oscillator: {
      type: 'fatsawtooth',
      count: 3,
      spread: 30,
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4,
      attackCurve: 'exponential',
    },
  }).connect(limiter)

const kalimbaFactory = () =>
  new Tone.PolySynth(Tone.FMSynth, {
    volume: -10,
    harmonicity: 8,
    modulationIndex: 2,
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.001,
      decay: 2,
      sustain: 0.1,
      release: 2,
    },
    modulation: {
      type: 'square',
    },
    modulationEnvelope: {
      attack: 0.002,
      decay: 0.2,
      sustain: 0,
      release: 0.2,
    },
  }).connect(limiter)

const windFactory = () =>
  new Tone.PolySynth(Tone.Synth, {
    volume: -15,
    portamento: 0.0,
    oscillator: {
      type: 'square4',
    },
    envelope: {
      attack: 2,
      decay: 1,
      sustain: 0.2,
      release: 2,
    },
  }).connect(limiter)

export const availableInstruments = [
  { id: 'sine', name: 'Sine', factory: sineFactory },
  { id: 'saw', name: 'Saw', factory: sawFactory },
  { id: 'kalimba', name: 'Kalimba', factory: kalimbaFactory },
  { id: 'wind', name: 'Wind', factory: windFactory },
]

export type ZoneInstrument = {
  id: string
  instrument: Tone.PolySynth
}
