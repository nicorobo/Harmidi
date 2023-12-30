import { Box, Sheet } from '@mui/joy'
import { Zone, isNoteZone, isControlZone } from '../../zone-settings'
import { ZoneSettingsHeader } from './ZoneSettingsHeader'
import { NoteSettings } from './NoteSettings'
import { ControlSettings } from './ControlSettings'
import { MiniMapGrid } from '../MiniMapGrid'

type Props = { zone: Zone }

export const ZoneSettingsPanel: React.FC<Props> = ({ zone }) => {
  return (
    <Sheet sx={{ width: '350px', overflowY: 'auto' }}>
      <ZoneSettingsHeader zone={zone} />
      {/* <Box my={2} display={'flex'} justifyContent={'center'}>
        <MiniMapGrid size={7} zoneIds={[zone.id]} />
      </Box> */}

      <Box sx={{ p: '1rem' }}>
        {isNoteZone(zone) && <NoteSettings zone={zone} />}
        {isControlZone(zone) && <ControlSettings zone={zone} />}
      </Box>
    </Sheet>
  )
}
