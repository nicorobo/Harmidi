import { Box } from '@mui/joy'
import { useStore } from '../store'
import { Cell } from './Cell'

export const Row = ({ row }: { row: number }) => {
  const { keyGrid } = useStore((state) => state.keyboardConfig)

  return (
    <Box>
      <Box display="flex" my="0.25rem" ml={`${row}rem`}>
        {keyGrid[row].map((key, i) => (
          <Cell key={`cell:${row}:${i}`} cell={key} />
        ))}
      </Box>
    </Box>
  )
}
