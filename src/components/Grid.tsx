import { useStore } from '../store'
import { Box } from '@mui/joy'
import { Row } from './Row'
import { KeyMapInfo } from './KeyMapInfo'

export const Grid = () => {
  const { keyGrid } = useStore((state) => state.keyboardConfig)
  return (
    <Box position={'relative'}>
      <KeyMapInfo />
      {keyGrid.map((_, i) => (
        <Row key={i} row={i} />
      ))}
    </Box>
  )
}
