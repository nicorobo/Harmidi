import { Box } from '@mui/joy'
import { Zone } from '../../zone-settings'

export const ZoneSettingsHeader = ({ zone }: { zone: Zone }) => {
  return (
    <Box sx={{ p: '0.5rem 1rem', background: '#d9d8ff' }}>
      Zone {zone.id.substring(0, 5)}
    </Box>
  )
}
