import { useContext } from 'react'
import { useStore } from '../store'
import { Box } from '@mui/joy'
import { Cell } from './Cell'
// import { getNoteFactory } from '../use-note-actions'
// import { Midi, Chord } from 'tonal'
import { EngineContext } from '../Engine'

// const getNameFromMidiNotes = (notes: number | number[]) => {
//   if (typeof notes === 'number') {
//     return Midi.midiToNoteName(notes)
//   }
//   const chordsDetected = Chord.detect(notes.map((n) => Midi.midiToNoteName(n)))
//   return chordsDetected[0]
// }

export const Row = ({ row }: { row: number }) => {
  const { activeKeys } = useContext(EngineContext)
  const { keyGrid } = useStore((state) => state.keyboardConfig)

  return (
    <Box>
      <Box display="flex" my="0.25rem" ml={`${row}rem`}>
        {keyGrid[row].map((key, i) => (
          <Cell
            key={`cell:${row}:${i}`}
            cell={key}
            isActive={activeKeys.includes(key)}
          />
        ))}
      </Box>
    </Box>
  )
}
