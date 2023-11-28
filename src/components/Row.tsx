import { useContext } from 'react'
import { useStore } from '../store'
import { Box } from '@mui/joy'
import { Cell } from './Cell'
import { EngineContext } from '../Engine'
import { Midi, Chord } from 'tonal'

const getNameFromMidiNotes = (notes: number[]) => {
  if (notes.length === 1) {
    return Midi.midiToNoteName(notes[0])
  }
  const chordsDetected = Chord.detect(notes.map((n) => Midi.midiToNoteName(n)))
  return chordsDetected[0]
}

export const Row = ({ row }: { row: number }) => {
  const { activeKeys, getNotesByKey } = useContext(EngineContext)
  const { keyGrid } = useStore((state) => state.keyboardConfig)

  return (
    <Box>
      <Box display="flex" my="0.25rem" ml={`${row}rem`}>
        {keyGrid[row].map((key, i) => (
          <Cell
            key={`cell:${row}:${i}`}
            cell={key}
            title={getNameFromMidiNotes(getNotesByKey(key))}
            isActive={activeKeys.includes(key)}
          />
        ))}
      </Box>
    </Box>
  )
}
