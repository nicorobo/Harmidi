// A React component MiniMapGrid that shows a miniature representation of the main keyboard grid.
// Accepts props `zoneId: string[]` and highlights the selected zones
// Consider allowing a selction of zones too, treating this component as a zoneId input.

import { Box, Stack } from '@mui/joy'
import { useStore } from '../store'

interface Props {
  zoneIds: string[]
}

export const MiniMapGrid: React.FC<Props> = ({ zoneIds }) => {
  const { keyGrid } = useStore.use.keyboardConfig()
  const zoneByKey = useStore.use.zoneIdByKey()
  return (
    <Box display="flex" justifyContent="center">
      <Stack>
        {keyGrid.map((row, i) => (
          <Stack direction="row" ml={`${0.3 * i}rem`} my={0.1}>
            {row.map((key) => (
              <Box
                height={'1rem'}
                width={'1rem'}
                mx={0.1}
                borderRadius={'15%'}
                border={`1px solid ${
                  zoneIds.includes(zoneByKey[key]) ? '#d9d8ff' : '#ddd'
                }`}
                boxSizing={'border-box'}
                //   sx={{ opacity: zoneIds.includes(zoneByKey[key]) ? 1 : 0.2 }}
                bgcolor={zoneIds.includes(zoneByKey[key]) ? '#d9d8ff' : 'none'}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
