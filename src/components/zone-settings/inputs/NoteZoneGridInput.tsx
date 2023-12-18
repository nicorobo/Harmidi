import { useState } from 'react'
import { useStore } from '../../../store'
import { Stack } from '@mui/joy'
import { MiniMapGrid } from '../../MiniMapGrid'

export const NoteZoneGridInput = ({
  value,
  onChange,
}: {
  value: string[]
  onChange: (zones: string[]) => void
}) => {
  const zones = useStore.use.zones()
  // const noteZones = Object.values(zones).filter(isNoteZone)

  const [hoverZoneId, setHoverZoneId] = useState<string | null>(null)

  const onPointerEnter = (zoneId: string) => {
    setHoverZoneId(zoneId)
  }
  const onPointerLeave = () => {
    setHoverZoneId(null)
  }

  return (
    <Stack display={'flex'} alignItems={'center'}>
      <MiniMapGrid
        zoneIds={value}
        onChange={onChange}
        onZoneMouseEnter={onPointerEnter}
        onZoneMouseLeave={onPointerLeave}
        hoverZoneId={hoverZoneId}
        size={10}
      />
      {/* <Box display={'flex'}>
          <Typography fontSize={'0.7rem'}>
            <Typography fontWeight={'bold'}>Zone: </Typography>
            {hoverZoneId ? zones[hoverZoneId].id : ''}
          </Typography>
        </Box> */}
    </Stack>
  )
}
