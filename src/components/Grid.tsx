import { useState } from 'react'
import { useStore } from '../store'
import { Box, IconButton } from '@mui/material'
import { Settings } from '@mui/icons-material'

const Cell = ({ isActive }: { isActive: boolean }) => {
  return (
    <Box
      height={'3rem'}
      width={'3rem'}
      mx={'0.25rem'}
      borderRadius={'15%'}
      border={'1px solid #ddd'}
      boxSizing={'border-box'}
      bgcolor={isActive ? '#ddd' : 'none'}
    />
  )
}

const Row = ({ row }: { row: number }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { keyGrid } = useStore((state) => state.keyboardConfig)
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
          <Cell isActive={activeKeys.includes(i)} />
        ))}
      </Box>
      <Box
        maxHeight={menuOpen ? '30rem' : 0}
        display={menuOpen ? 'flex' : 'none'}
        border={'1px solid #ddd'}
        p={'1rem'}
        m={'0.35rem'}
      >
        hey
      </Box>
    </Box>
  )
}

export const Grid = () => {
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  return (
    <Box>
      {keyGrid.map((_, i) => (
        <Row key={i} row={i} />
      ))}
    </Box>
  )
}
