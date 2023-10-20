import { useEffect } from 'react'
import { useStore } from './store'
import { Scale, Chord, Midi, Key } from 'tonal'
import './App.css'
import { MIDIProvider, useMIDIOutput } from '@react-midi/hooks'
import { notEmpty } from './util'

const Cell = ({ id }: { id: number }) => {
  return <div className="cell">{id}</div>
}

const Row = ({ row }: { row: number }) => {
  const { ids } = useStore((state) => state.keyboardConfig)

  return (
    <div className="row">
      {ids[row].map((i) => (
        <Cell key={i} id={i} />
      ))}
    </div>
  )
}

const Grid = () => {
  const { ids } = useStore((state) => state.keyboardConfig)
  return (
    <div className="grid">
      {ids.map((_, i) => (
        <Row key={i} row={i} />
      ))}
    </div>
  )
}

// const FamilyChordRoots = Scale
type KeyActions = { [key: string]: { on: () => void; off: () => void } }
const useActionsByKey = (): KeyActions => {
  const { noteOn, noteOff } = useMIDIOutput()
  const rowSettings = useStore((state) => state.rowSettings)
  const globalScale = useStore((state) => state.globalScale)
  const keyboardConfig = useStore((state) => state.keyboardConfig)
  const actions: KeyActions = {}
  if (!noteOn || !noteOff) {
    return actions
  }
  for (let i = 0; i < keyboardConfig.keys.length; i++) {
    const settings = rowSettings[i]
    const noteSettings = {
      velocity: rowSettings[i].velocity,
      channel: rowSettings[i].channel,
    }
    for (let j = 0; j < keyboardConfig.keys[i].length; j++) {
      if (settings.type === 'family-chord') {
        const c3chromatic = Scale.degrees('C4 chromatic')
        const chord = Chord.getChord(settings.family, c3chromatic(j + 1))
        const midiNotes = chord.notes
          .map((note) => Midi.toMidi(note))
          .filter(notEmpty)
        actions[keyboardConfig.keys[i][j]] = {
          on: () => {
            console.log('playing notes: ', midiNotes)
            noteOn(midiNotes, noteSettings)
          },
          off: () => {
            console.log('stopping notes: ', midiNotes)
            noteOff(midiNotes, noteSettings)
          },
        }
      } else if (settings.type === 'scale-chord') {
        const key =
          globalScale.type === 'major'
            ? Key.majorKey(globalScale.root)
            : Key.minorKey(globalScale.root).natural
        const baseChord = Chord.get(key.chords[j])
        const chord = Chord.getChord(
          baseChord.type,
          (baseChord.tonic || 'C') + 4
        )
        console.log(chord)
        const midiNotes = chord.notes
          .map((note) => Midi.toMidi(note))
          .filter(notEmpty)
        console.log(midiNotes)
        actions[keyboardConfig.keys[i][j]] = {
          on: () => {
            console.log('playing notes: ', midiNotes)
            noteOn(midiNotes, noteSettings)
          },
          off: () => {
            console.log('stopping notes: ', midiNotes)
            noteOff(midiNotes, noteSettings)
          },
        }
      }
    }
  }
  return actions
}

const useKeyboardListener = () => {
  const keydown = useStore((state) => state.keydown)
  const keyup = useStore((state) => state.keyup)
  const actionsByKey = useActionsByKey()
  // console.log(actionsByKey)

  // useEffect(() => {
  //   const wo = (e: KeyboardEvent) => {
  //     console.log(e.key)
  //   }
  //   window.addEventListener('keydown', wo)
  //   return () => {
  //     window.removeEventListener('keydown', wo)
  //   }
  // }, [])
  const onKeyDown = (e: KeyboardEvent) => {
    if (!e.repeat) {
      console.log(e.key)
      // keydown(e.key)
      // console.log(actionsByKey[e.key])
      actionsByKey[e.key]?.on()
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    // keyup(e.key)
    actionsByKey[e.key]?.off()
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])
}

const KeyboardListener = () => {
  useKeyboardListener()
  return null
}

function App() {
  return (
    <MIDIProvider>
      <KeyboardListener />
      <Grid />
    </MIDIProvider>
  )
}

export default App
