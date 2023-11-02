import {
  FamilyChordRowSettings,
  NoteRowSettings,
  AllRowSettings,
  ScaleChordRowSettings,
  useStore,
} from '../store'
import {
  Box,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material'
import { useRef } from 'react'

import { ChordType } from 'tonal'
import { availableScales } from '../constants'
import { ScaleType } from '../types/scale'

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

const SharedSettings = ({
  settings,
  onUpdate,
}: {
  settings: AllRowSettings
  onUpdate: (settings: AllRowSettings) => void
}) => {
  const defaultVelocity = useRef(settings.velocity)
  return (
    <Stack>
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
      <Slider
        size="small"
        min={0}
        max={127}
        step={1}
        defaultValue={defaultVelocity.current}
        sx={{ mx: '1rem' }}
        onChangeCommitted={(_, value) =>
          onUpdate({ ...settings, velocity: value as number })
        }
      />
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
  onUpdate: (settings: AllRowSettings) => void
}) => {
  return (
    <Stack gap={'1rem'}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <FormControl>
        <InputLabel id="chord-type-label">Chord Type</InputLabel>
        <Select
          label={'Chord Type'}
          labelId="chord-type-label"
          value={settings.family}
          onChange={(e) => onUpdate({ ...settings, family: e.target.value })}
        >
          {chordTypes.map(({ name, value }) => (
            <MenuItem key={value} value={value}>
              {value} {name && `(${name})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
const ScaleChordRowSettings = ({
  settings,
  onUpdate,
}: {
  settings: ScaleChordRowSettings
  onUpdate: (settings: AllRowSettings) => void
}) => {
  return (
    <Stack gap={'1rem'}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Stack direction={'row'}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={settings.key.root}
          onChange={(_, root) =>
            onUpdate({ ...settings, key: { ...settings.key, root } })
          }
        >
          {rootNotes.map((note) => (
            <ToggleButton key={note} value={note}>
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
          <ToggleButton value={'minor'}>Minor</ToggleButton>
          <ToggleButton value={'major'}>Major</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  )
}
const NoteRowSettings = ({
  settings,
  onUpdate,
}: {
  settings: NoteRowSettings
  onUpdate: (settings: AllRowSettings) => void
}) => {
  return (
    <Stack gap={'1rem'}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <Stack direction={'row'}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={settings.scale.root}
          onChange={(_, root) =>
            onUpdate({ ...settings, scale: { ...settings.scale, root } })
          }
        >
          {rootNotes.map((note) => (
            <ToggleButton key={note} value={note}>
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
      </Stack>
    </Stack>
  )
}
export const RowSettings = ({
  row,
  settings,
}: {
  row: number
  settings: AllRowSettings
}) => {
  const updateRowSettings = useStore((state) => state.updateRowSettings)
  const updateRowType = useStore((state) => state.updateRowType)
  const onUpdate = (settings: AllRowSettings) => {
    console.log('woop')
    updateRowSettings(row, settings)
  }
  return (
    <Box border={'1px solid #ddd'} p={'1rem'} m={'0.35rem'}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={settings.type}
        onChange={(_, value) => updateRowType(row, value)}
      >
        <ToggleButton size="small" value="scale-note">
          Notes
        </ToggleButton>
        <ToggleButton size="small" value="scale-chord">
          Scale chords
        </ToggleButton>
        <ToggleButton size="small" value="family-chord">
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
    </Box>
  )
}
