import { useState } from 'react'
import { useStore } from '../store'
import { Box, IconButton } from '@mui/material'
import { Settings } from '@mui/icons-material'
import { RowSettings } from './RowSettings'
import { Cell } from './Cell'

export const Row = ({ row }: { row: number }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  const { type, settings } = useStore((state) => state.settings[row])
  const activeKeys = useStore((state) => state.activeKeys)
  return (
    <Box>
      <Box display="flex" my="0.25rem" ml={`${row}rem`}>
        <IconButton
          sx={{ borderRadius: 0 }}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Settings />
        </IconButton>
        {keyGrid[row].map((i) => (
          <Cell key={`cell:${row}:${i}`} isActive={activeKeys.includes(i)} />
        ))}
      </Box>
      {menuOpen && <RowSettings row={row} settings={settings[type]} />}
    </Box>
  )
}
