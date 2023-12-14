import { Box, Sheet } from '@mui/joy'
import { Zone, isNoteZone, isControlZone } from '../../zone-settings'
import { ZoneSettingsHeader } from './ZoneSettingsHeader'
import { NoteSettings } from './NoteSettings'
import { ControlSettings } from './ControlSettings'
import { MiniMapGrid } from '../MiniMapGrid'

export const ZoneSettingsPanel = ({ zone }: { zone: Zone }) => {
  return (
    <Sheet sx={{ width: '350px', overflowY: 'auto' }}>
      <ZoneSettingsHeader zone={zone} />
      <MiniMapGrid zoneIds={[zone.id]} />
      <Box sx={{ p: '1rem' }}>
        {isNoteZone(zone) && <NoteSettings zone={zone} />}
        {isControlZone(zone) && <ControlSettings zone={zone} />}
      </Box>
    </Sheet>
  )
}
