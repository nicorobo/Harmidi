import { useStore } from '../store'
import { Box } from '@mui/material'
import { Row } from './Row'
import { useEngine } from '../useEngine'

export const Grid = () => {
  useEngine()
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  return (
    <Box>
      {keyGrid.map((_, i) => (
        <Row key={i} row={i} />
      ))}
    </Box>
  )
}
