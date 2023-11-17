import { useStore } from '../store'
import {
  Slider,
  Select,
  MenuItem,
  ToggleButtonGroup,
  Stack,
  Typography,
  Box,
  IconButton,
  ButtonGroup,
  Button,
  Switch,
  Sheet,
} from '@mui/joy'
import { useRef } from 'react'

import { ChordType } from 'tonal'
import { availableScales } from '../constants'
import { ScaleType } from '../types/scale'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  ChordFamilyZoneSettings,
  ChordZoneSettings,
  NoteZoneSettings,
  ZoneSettings as ZoneSettingsType,
} from '../zone-settings'

const channels = new Array(16).fill(0).map((_, i) => i)
const rootNotes = [
  'Ab',
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
]

const labelStyle = {
  textTransform: 'uppercase',
  color: '#ae67ff',
  fontWeight: 600,
  fontSize: '0.75rem',
}

const SharedSettings = ({
  settings,
  onUpdate,
}: {
  settings: ZoneSettingsType
  onUpdate: (settings: ZoneSettingsType) => void
}) => {
  const defaultVelocity = useRef(settings.velocity)
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={4}>
        <Stack>
          <Typography sx={labelStyle}>Channel</Typography>
          {/* <ToggleButtonGroup
            exclusive
            size="sm"
            value={settings.channel}
            onChange={(_, channel) => onUpdate({ ...settings, channel })}
          >
            {channels.map((channel) => (
              <Button key={channel} value={channel + 1}>
                {channel + 1}
              </Button>
            ))}
          </ToggleButtonGroup> */}
        </Stack>
        <Stack>
          <Typography sx={labelStyle}>Octave</Typography>
          {/* <ToggleButtonGroup
            exclusive
            size="small"
            value={settings.octave}
            onChange={(_, octave) => onUpdate({ ...settings, octave })}
          >
            <ToggleButton value={-3}>{-3}</ToggleButton>
            <ToggleButton value={-2}>{-2}</ToggleButton>
            <ToggleButton value={-1}>{-1}</ToggleButton>
            <ToggleButton value={0}>{0}</ToggleButton>
            <ToggleButton value={1}>{1}</ToggleButton>
            <ToggleButton value={2}>{2}</ToggleButton>
            <ToggleButton value={3}>{3}</ToggleButton>
          </ToggleButtonGroup> */}
        </Stack>
      </Stack>
      <Stack direction="row" spacing={4}>
        <Box flexGrow={1}>
          <Typography sx={labelStyle}>Velocity</Typography>
          <Slider
            size="sm"
            min={0}
            max={127}
            step={1}
            valueLabelDisplay="auto"
            defaultValue={defaultVelocity.current}
            onChangeCommitted={(_, value) =>
              onUpdate({ ...settings, velocity: value as number })
            }
          />
        </Box>
        <Box>
          <Typography sx={labelStyle}>Mute</Typography>
          {/* <ToggleButtonGroup
            size="sm"
            value={settings.muteZones}
            onChange={(_, muteGroups) =>
              onUpdate({ ...settings, muteZones: muteGroups })
            }
          >
            <ToggleButton value={0}>A</ToggleButton>
            <ToggleButton value={1}>B</ToggleButton>
            <ToggleButton value={2}>C</ToggleButton>
            <ToggleButton value={3}>D</ToggleButton>
          </ToggleButtonGroup> */}
        </Box>
        <Box>
          <Typography sx={labelStyle}>Hold</Typography>
          <Switch
            checked={settings.hold}
            onChange={(e) => {
              onUpdate({ ...settings, hold: e.target.checked })
            }}
          />
        </Box>
      </Stack>
    </Stack>
  )
}
const chordTypes = ChordType.all().map(({ name, aliases }) => ({
  name,
  value: aliases[0],
}))

const FamilyChordZoneSettings = ({
  settings,
  onUpdate,
}: {
  settings: ChordZoneSettings
  onUpdate: (settings: ZoneSettingsType) => void
}) => {
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Stack direction="row" spacing={2}>
        <Box>
          <Typography sx={labelStyle}>Chord Type</Typography>
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
        </Box>
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
      </Stack>
    </Stack>
  )
}

const ScaleChordZoneSettings = ({
  settings,
  onUpdate,
}: {
  settings: ChordFamilyZoneSettings
  onUpdate: (settings: ZoneSettingsType) => void
}) => {
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Box>
        <Typography sx={labelStyle}>Key</Typography>
        <Stack direction={'row'} spacing={2}>
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
        </Stack>
      </Box>
    </Stack>
  )
}

const NoteZoneSettings = ({
  settings,
  onUpdate,
}: {
  settings: NoteZoneSettings
  onUpdate: (settings: ZoneSettingsType) => void
}) => {
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Box>
        <Typography sx={labelStyle}>Scale</Typography>
        <Stack direction={'row'} spacing={2}>
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
        </Stack>
      </Box>
    </Stack>
  )
}

export const ZoneSettings = ({
  zoneIndex,
  settings,
}: {
  zoneIndex: number
  settings: ZoneSettingsType
}) => {
  const updateZoneSettings = useStore((state) => state.updateZoneSettings)
  // const updateRowType = useStore((state) => state.updateZoneType)
  const onUpdate = (settings: ZoneSettingsType) => {
    updateZoneSettings(zoneIndex, settings)
  }
  const zoneType = settings.type
  if (zoneType === 'chord') {
    return <FamilyChordZoneSettings settings={settings} onUpdate={onUpdate} />
  } else if (zoneType === 'chord-family') {
    return <ScaleChordZoneSettings settings={settings} onUpdate={onUpdate} />
  } else {
    return <NoteZoneSettings settings={settings} onUpdate={onUpdate} />
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
    <Sheet sx={{ p: '1rem' }}>
      <ZoneSettings zoneIndex={zoneIndex} settings={settings} />
    </Sheet>
  )
}
