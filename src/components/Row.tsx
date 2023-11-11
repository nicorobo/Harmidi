import { useContext, useState } from 'react'
import { useStore } from '../store'
import { Box, IconButton } from '@mui/material'
import { Settings } from '@mui/icons-material'
import { RowSettings } from './RowSettings'
import { Cell } from './Cell'
import { getNoteFactory } from '../use-note-actions'
import { Midi, Chord } from 'tonal'
import { EngineContext } from '../Engine'

const getNameFromMidiNotes = (notes: number | number[]) => {
  if (typeof notes === 'number') {
    return Midi.midiToNoteName(notes)
  }
  const chordsDetected = Chord.detect(notes.map((n) => Midi.midiToNoteName(n)))
  return chordsDetected[0]
}
export const Row = ({ row }: { row: number }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { activeKeys } = useContext(EngineContext)
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  const settings = useStore((state) => state.settings[row])
  const noteFactory = getNoteFactory(settings)

  return (
    <Box>
      <Box display="flex" my="0.25rem" ml={`${row}rem`}>
        <IconButton
          sx={{ borderRadius: 0 }}
          size="small"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Settings sx={{ fontSize: '1.3rem', color: '#999' }} />
        </IconButton>
        {keyGrid[row].map((key, i) => {
          const notes = noteFactory(i)
          const name = getNameFromMidiNotes(notes)
          return (
            <Cell
              key={`cell:${row}:${i}`}
              isActive={activeKeys.includes(key)}
              name={name}
            />
          )
        })}
      </Box>
      {menuOpen && <RowSettings row={row} settings={settings} />}
    </Box>
  )
}
