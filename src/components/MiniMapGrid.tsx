// A React component MiniMapGrid that shows a miniature representation of the main keyboard grid.
// Accepts props `zoneId: string[]` and highlights the selected zones
// Consider allowing a selction of zones too, treating this component as a zoneId input.

import { Box, Stack } from '@mui/joy'
import { useStore } from '../store'

interface Props {
  zoneIds: string[]
  specialZoneId?: string
  onChange?: (zoneIds: string[]) => void
  onZoneMouseEnter?: (zoneId: string) => void
  onZoneMouseLeave?: (zoneId: string) => void
  hoverZoneId?: string | null
  size?: number // size of each grid square
}

export const MiniMapGrid: React.FC<Props> = ({
  zoneIds,
  specialZoneId,
  onChange,
  onZoneMouseEnter,
  onZoneMouseLeave,
  hoverZoneId,
  size = 10,
}) => {
  const { keyGrid } = useStore.use.keyboardConfig()
  const zones = useStore.use.zoneById()
  const zoneByKey = useStore.use.zoneIdByKey()
  const onClick = (zoneId: string) => {
    if (!onChange) return
    const index = zoneIds.indexOf(zoneId)
    if (index > -1)
      onChange([...zoneIds.slice(0, index), ...zoneIds.slice(index + 1)])
    else onChange([...zoneIds, zoneId])
  }
  const getCellColor = (zoneId: string | null) => {
    if (!zoneId) return null
    if (zoneIds.includes(zoneId)) return zones[zoneId].color
    if (hoverZoneId === zoneId) return zones[zoneId].color + '80'
    console.log(specialZoneId, zoneId)
    if (specialZoneId === zoneId) return '#ddd'
    return null
  }
  return (
    <Box display={'flex'}>
      <Stack>
        {keyGrid.map((row, i) => (
          <Stack key={i} direction="row" ml={`${0.3 * i}rem`}>
            {/* outer box is to allow for continuous mouseover events */}
            {row.map((key) => (
              <Box
                key={key}
                sx={{ cursor: onChange ? 'pointer' : 'default' }}
                onClick={() => {
                  const zoneId = zoneByKey[key]
                  zoneId && onClick(zoneId)
                }}
                onPointerEnter={() => {
                  const zoneId = zoneByKey[key]
                  zoneId && onZoneMouseEnter && onZoneMouseEnter(zoneId)
                }}
                onPointerLeave={() => {
                  const zoneId = zoneByKey[key]
                  zoneId && onZoneMouseLeave && onZoneMouseLeave(zoneId)
                }}
              >
                <Box
                  height={`${size}px`}
                  width={`${size}px`}
                  margin={`${size * 0.1}px`}
                  borderRadius={'15%'}
                  border={`1px solid ${getCellColor(zoneByKey[key]) ?? '#ddd'}`}
                  boxSizing={'border-box'}
                  bgcolor={getCellColor(zoneByKey[key]) ?? 'none'}
                />
              </Box>
            ))}
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
