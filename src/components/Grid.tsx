import { useStore } from '../store'
import { Box } from '@mui/material'
import { Row } from './Row'

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
