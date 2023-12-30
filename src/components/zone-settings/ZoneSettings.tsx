import { Box, Sheet } from '@mui/joy'
import { Zone } from '../../zone-settings'
import { ZoneSettingsHeader } from './ZoneSettingsHeader'
import { NoteSettings } from './NoteSettings'

type Props = { zone: Zone }

export const ZoneSettingsPanel: React.FC<Props> = ({ zone }) => {
  return (
    <Sheet sx={{ width: '350px', overflowY: 'auto' }}>
      <ZoneSettingsHeader zone={zone} />

      <Box sx={{ p: '1rem' }}>
        <NoteSettings zone={zone} />
      </Box>
    </Sheet>
  )
}
