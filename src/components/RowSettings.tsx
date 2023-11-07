import {
  FamilyChordRowSettings,
  NoteRowSettings,
  RowSettings as RowSettingsType,
  ScaleChordRowSettings,
  useStore,
} from '../store'
import {
  Slider,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Typography,
  Box,
  IconButton,
  ButtonGroup,
  Button,
} from '@mui/material'
import { useRef } from 'react'

import { ChordType } from 'tonal'
import { availableScales } from '../constants'
import { ScaleType } from '../types/scale'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

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
  settings: RowSettingsType
  onUpdate: (settings: RowSettingsType) => void
}) => {
  const defaultVelocity = useRef(settings.velocity)
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={4}>
        <Stack>
          <Typography sx={labelStyle}>Channel</Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={settings.channel}
            onChange={(_, channel) => onUpdate({ ...settings, channel })}
          >
            {channels.map((channel) => (
              <ToggleButton key={channel} value={channel + 1}>
                {channel + 1}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <Stack>
          <Typography sx={labelStyle}>Octave</Typography>
          <ToggleButtonGroup
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
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <Box>
        <Typography sx={labelStyle}>Velocity</Typography>
        <Slider
          size="small"
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
    </Stack>
  )
}
const chordTypes = ChordType.all().map(({ name, aliases }) => ({
  name,
  value: aliases[0],
}))

const FamilyChordRowSettings = ({
  settings,
  onUpdate,
}: {
  settings: FamilyChordRowSettings
  onUpdate: (settings: RowSettingsType) => void
}) => {
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Stack direction="row" spacing={2}>
        <Box>
          <Typography sx={labelStyle}>Chord Type</Typography>
          <Select
            size="small"
            value={settings.family}
            onChange={(e) => onUpdate({ ...settings, family: e.target.value })}
          >
            {chordTypes.map(({ name, value }) => (
              <MenuItem key={value} value={value}>
                {value} {name && `(${name})`}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Typography sx={labelStyle}>Translate</Typography>
          <ButtonGroup variant="contained">
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

const ScaleChordRowSettings = ({
  settings,
  onUpdate,
}: {
  settings: ScaleChordRowSettings
  onUpdate: (settings: RowSettingsType) => void
}) => {
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Box>
        <Typography sx={labelStyle}>Key</Typography>
        <Stack direction={'row'} spacing={2}>
          <ToggleButtonGroup
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
          </ToggleButtonGroup>
          <ToggleButtonGroup
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
          </ToggleButtonGroup>
        </Stack>
      </Box>
    </Stack>
  )
}

const NoteRowSettings = ({
  settings,
  onUpdate,
}: {
  settings: NoteRowSettings
  onUpdate: (settings: RowSettingsType) => void
}) => {
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Box>
        <Typography sx={labelStyle}>Scale</Typography>
        <Stack direction={'row'} spacing={2}>
          <ToggleButtonGroup
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
          </ToggleButtonGroup>
          <Select
            size="small"
            value={settings.scale.type}
            onChange={(e) =>
              onUpdate({
                ...settings,
                scale: { ...settings.scale, type: e.target.value as ScaleType },
              })
            }
          >
            {availableScales.map((scale) => (
              <MenuItem key={scale} value={scale}>
                {scale}
              </MenuItem>
            ))}
          </Select>
          <Box>
            <Typography sx={labelStyle}>Translate</Typography>
            <ButtonGroup variant="contained">
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
export const RowSettings = ({
  row,
  settings,
}: {
  row: number
  settings: RowSettingsType
}) => {
  const updateRowSettings = useStore((state) => state.updateRowSettings)
  const updateRowType = useStore((state) => state.updateRowType)
  const onUpdate = (settings: RowSettingsType) => {
    updateRowSettings(row, settings)
  }
  return (
    <Stack
      spacing={2}
      sx={{ border: '1px solid #ddd', p: '1rem', m: '0.35rem' }}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={settings.type}
        sx={{ textTransform: 'capitalize' }}
        onChange={(_, value) => updateRowType(row, value)}
      >
        <ToggleButton
          size="small"
          value="scale-note"
          sx={{ textTransform: 'capitalize' }}
        >
          Notes
        </ToggleButton>
        <ToggleButton
          size="small"
          value="scale-chord"
          sx={{ textTransform: 'capitalize' }}
        >
          Scale chords
        </ToggleButton>
        <ToggleButton
          size="small"
          value="family-chord"
          sx={{ textTransform: 'capitalize' }}
        >
          Family chords
        </ToggleButton>
      </ToggleButtonGroup>
      {settings.type === 'family-chord' && (
        <FamilyChordRowSettings settings={settings} onUpdate={onUpdate} />
      )}
      {settings.type === 'scale-chord' && (
        <ScaleChordRowSettings settings={settings} onUpdate={onUpdate} />
      )}
      {settings.type === 'scale-note' && (
        <NoteRowSettings settings={settings} onUpdate={onUpdate} />
      )}
    </Stack>
  )
}
