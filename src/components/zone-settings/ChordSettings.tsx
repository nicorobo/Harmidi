import { Stack } from '@mui/joy'
import { useStore } from '../../store'
import { ChordZoneSettings, ZoneSettings } from '../../zone-settings'
import { SharedSettings } from './SharedSettings'

export const ChordSettings = ({
  settings,
  zoneIndex,
}: {
  settings: ChordZoneSettings
  zoneIndex: number
}) => {
  const updateZoneSettings = useStore((state) => state.updateZoneSettings)
  // const updateRowType = useStore((state) => state.updateZoneType)
  const onUpdate = (update: Partial<ChordZoneSettings>) => {
    updateZoneSettings(zoneIndex, { ...settings, ...update })
  }
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      {/* <Stack direction="row" spacing={2}>
        <Box>
          <Typography sx={labelStyle}>Chord Type</Typography> */}
      {/* <Select
              size="small"
              value={settings.family}
              onChange={(e) => onUpdate({ ...settings, family: e.target.value })}
            >
              {chordTypes.map(({ name, value }) => (
                <MenuItem key={value} value={value}>
                  {value} {name && `(${name})`}
                </MenuItem>
              ))}
            </Select> */}
      {/* </Box>
        <Box>
          <Typography sx={labelStyle}>Translate</Typography>
          <ButtonGroup>
            <IconButton
              onClick={() =>
                onUpdate({ ...settings, translate: settings.translate - 1 })
              }
            >
              <ChevronLeft />
            </IconButton>
            <Button onClick={() => onUpdate({ ...settings, translate: 0 })}>
              {settings.translate}
            </Button>
            <IconButton
              onClick={() =>
                onUpdate({ ...settings, translate: settings.translate + 1 })
              }
            >
              <ChevronRight />
            </IconButton>
          </ButtonGroup>
        </Box>
      </Stack> */}
    </Stack>
  )
}
