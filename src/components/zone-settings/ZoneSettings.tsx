import { Box, Sheet } from '@mui/joy'
import { ZoneSettings as ZoneSettingsType } from '../../zone-settings'
import { ZoneSettingsHeader } from './ZoneSettingsHeader'
import { NoteSettings } from './NoteSettings'

export const ZoneSettingsPanel = ({
  zoneIndex,
  settings,
}: {
  zoneIndex: number
  settings: ZoneSettingsType
}) => {
  return (
    <Sheet>
      <ZoneSettingsHeader zoneIndex={zoneIndex} />
      <Box sx={{ p: '1rem' }}>
        <NoteSettings zoneIndex={zoneIndex} settings={settings} />
      </Box>
    </Sheet>
  )
}
