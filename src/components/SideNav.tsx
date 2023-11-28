import { useStore } from '../store'
import { Box, Stack } from '@mui/joy'
import { ZoneSettingsPanel } from './zone-settings/ZoneSettings'
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const SideNav = () => {
  const selectedZone = useStore((state) => state.selectedZone)
  const setSelectedZone = useStore((state) => state.setSelectedZone)
  const zones = useStore((state) => state.settings)
  return (
    <Box display="flex">
      <Stack>
        {zones.map((_, i) => (
          <Box
            display="flex"
            justifyContent={'center'}
            alignItems={'center'}
            height="2.5rem"
            width="2.5rem"
            onClick={() => setSelectedZone(selectedZone === i ? null : i)}
            sx={{
              cursor: 'pointer',
              ':hover': {
                background: selectedZone === i ? '#ccc' : '#eee',
              },
              background: selectedZone === i ? '#d9d8ff' : 'white',
            }}
          >
            {alphabet[i]}
          </Box>
        ))}
      </Stack>
      {selectedZone !== null && (
        <ZoneSettingsPanel
          zoneIndex={selectedZone}
          settings={zones[selectedZone]}
        />
      )}
    </Box>
  )
}
