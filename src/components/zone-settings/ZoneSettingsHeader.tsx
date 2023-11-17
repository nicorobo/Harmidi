import { Box } from '@mui/joy'

export const ZoneSettingsHeader = ({ zoneIndex }: { zoneIndex: number }) => {
  return (
    <Box sx={{ p: '0.5rem 1rem', background: '#eee' }}>
      Zone {'ABCDEFGH'[zoneIndex]}
    </Box>
  )
}
