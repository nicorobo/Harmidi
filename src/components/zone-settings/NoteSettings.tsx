import { Stack } from '@mui/joy'
import { NoteZoneSettings } from '../../zone-settings'
import { SharedSettings } from './SharedSettings'
import { useStore } from '../../store'

export const NoteSettings = ({
  settings,
  zoneIndex,
}: {
  settings: NoteZoneSettings
  zoneIndex: number
}) => {
  const updateZoneSettings = useStore((state) => state.updateZoneSettings)
  // const updateRowType = useStore((state) => state.updateZoneType)
  const onUpdate = (update: Partial<NoteZoneSettings>) => {
    updateZoneSettings(zoneIndex, { ...settings, ...update })
  }
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      {/* <Box> */}
      {/* <Typography sx={labelStyle}>Scale</Typography>
          <Stack direction={'row'} spacing={2}> */}
      {/* <ToggleButtonGroup
              exclusive
              size="small"
              value={settings.scale.root}
              onChange={(_, root) =>
                onUpdate({ ...settings, scale: { ...settings.scale, root } })
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
      {/* <Select
              size="sm"
              value={settings.scale.type}
              onChange={(e) =>
                onUpdate({
                  ...settings,
                  scale: { ...settings.scale, type: e.target.value as ScaleType },
                })
              }
            ></Select> */}
      {/* <Box>
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
            </Box> */}
      {/* </Stack>
        </Box> */}
    </Stack>
  )
}
