import { Stack } from '@mui/joy'
import { useStore } from '../../store'
import { ChordFamilyZoneSettings } from '../../zone-settings'
import { SharedSettings } from './SharedSettings'

export const ChordFamilySettings = ({
  settings,
  zoneIndex,
}: {
  settings: ChordFamilyZoneSettings
  zoneIndex: number
}) => {
  const updateZoneSettings = useStore((state) => state.updateZoneSettings)
  // const updateRowType = useStore((state) => state.updateZoneType)
  const onUpdate = (update: Partial<ChordFamilyZoneSettings>) => {
    updateZoneSettings(zoneIndex, { ...settings, ...update })
  }
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      {/* <Box>
        <Typography sx={labelStyle}>Key</Typography>
        <Stack direction={'row'} spacing={2}> */}
      {/* <ToggleButtonGroup
              exclusive
              size="small"
              value={settings.key.root}
              onChange={(_, root) =>
                onUpdate({ ...settings, key: { ...settings.key, root } })
              }
            >
              {rootNotes.map((note) => (
                <ToggleButton
                  key={note}
                  value={note}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {note}
                </ToggleButton>
              ))}
            </ToggleButtonGroup> */}
      {/* <ToggleButtonGroup
              exclusive
              size="small"
              value={settings.key.type}
              onChange={(_, type) =>
                onUpdate({ ...settings, key: { ...settings.key, type } })
              }
            >
              <ToggleButton value={'minor'} sx={{ textTransform: 'capitalize' }}>
                Minor
              </ToggleButton>
              <ToggleButton value={'major'} sx={{ textTransform: 'capitalize' }}>
                Major
              </ToggleButton>
            </ToggleButtonGroup> */}
      {/* </Stack>
      </Box> */}
    </Stack>
  )
}
