import { useState } from 'react'
import { Stack } from '@mui/joy'
import { useStore } from '../../../store'
import { MiniMapGrid } from '../../MiniMapGrid'

type Props = {
  zoneIds: string[]
  specialZoneId?: string
  onChange: (zones: string[]) => void
}

// TODO only allow selection of note zones
export const NoteZoneGridInput: React.FC<Props> = ({
  zoneIds,
  specialZoneId,
  onChange,
}) => {
  // const zones = useStore.use.zoneById()
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
        zoneIds={zoneIds}
        specialZoneId={specialZoneId}
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
