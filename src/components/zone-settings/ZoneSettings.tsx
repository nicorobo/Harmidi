import { Box, Sheet } from '@mui/joy'
import { ZoneSettings as ZoneSettingsType } from '../../zone-settings'
import { ZoneSettingsHeader } from './ZoneSettingsHeader'
import { ChordSettings } from './ChordSettings'
import { ChordFamilySettings } from './ChordFamilySettings'
import { NoteSettings } from './NoteSettings'

const ZoneSettings = ({
  zoneIndex,
  settings,
}: {
  zoneIndex: number
  settings: ZoneSettingsType
}) => {
  const zoneType = settings.type
  if (zoneType === 'chord') {
    return <ChordSettings zoneIndex={zoneIndex} settings={settings} />
  } else if (zoneType === 'chord-family') {
    return <ChordFamilySettings zoneIndex={zoneIndex} settings={settings} />
  } else {
    return <NoteSettings zoneIndex={zoneIndex} settings={settings} />
  }
}

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
        <ZoneSettings zoneIndex={zoneIndex} settings={settings} />
      </Box>
    </Sheet>
  )
}
