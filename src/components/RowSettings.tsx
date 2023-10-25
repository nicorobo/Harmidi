import {
  FamilyChordRowSettings,
  NoteRowSettings,
  RowSettings as RowSettingsType,
  ScaleChordRowSettings,
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

import { ChordType } from 'tonal'

const channels = new Array(16).fill(0).map((_, i) => i)
const chordTypes = ChordType.all().map(({ name, aliases }) => ({
  name,
  value: aliases[0],
}))
const FamilyChordRowSettings = ({
  settings,
}: {
  settings: FamilyChordRowSettings
}) => {
  console.log(settings)
  return (
    <Stack gap={'1rem'}>
      <InputLabel id="midi-channel-label">Velocity</InputLabel>
      <Slider
        size="small"
        min={0}
        max={127}
        step={1}
        value={settings.velocity}
      />
      <ToggleButtonGroup value={settings.channel}>
        {channels.map((channel) => (
          <ToggleButton key={channel} value={channel + 1}>
            {channel + 1}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup value={settings.octave - 3} exclusive>
        <ToggleButton value={-3}>{-3}</ToggleButton>
        <ToggleButton value={-2}>{-2}</ToggleButton>
        <ToggleButton value={-1}>{-1}</ToggleButton>
        <ToggleButton value={0}>{0}</ToggleButton>
        <ToggleButton value={1}>{1}</ToggleButton>
        <ToggleButton value={2}>{2}</ToggleButton>
        <ToggleButton value={3}>{3}</ToggleButton>
      </ToggleButtonGroup>
      <FormControl>
        <InputLabel id="chord-type-label">Chord Type</InputLabel>
        <Select
          label={'Chord Type'}
          labelId="chord-type-label"
          value={settings.family}
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
}: {
  settings: ScaleChordRowSettings
}) => {
  return <>Scale Chord Settings</>
}
const NoteRowSettings = ({ settings }: { settings: NoteRowSettings }) => {
  return <>Note Settings</>
}
export const RowSettings = ({ settings }: { settings: RowSettingsType }) => {
  return (
    <Box border={'1px solid #ddd'} p={'1rem'} m={'0.35rem'}>
      {settings.type === 'family-chord' && (
        <FamilyChordRowSettings settings={settings} />
      )}
      {settings.type === 'scale-chord' && (
        <ScaleChordRowSettings settings={settings} />
      )}
      {settings.type === 'scale-note' && (
        <NoteRowSettings settings={settings} />
      )}
    </Box>
  )
}
