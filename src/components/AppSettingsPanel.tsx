import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Option,
  Select,
  Sheet,
  Stack,
  Switch,
} from '@mui/joy'
import { useMIDIOutputs } from '@react-midi/hooks'
import { useStore } from '../store'
import { SidePanelHeader } from './SidePanel'

export const AppSettingsPanel = () => {
  const setUseMidi = useStore.use.setUseMidi()
  const isUsingMidi = useStore.use.isUsingMidi()
  return (
    <Sheet sx={{ width: '350px', overflowY: 'auto' }}>
      <SidePanelHeader title="Settings" />
      <Stack sx={{ p: '1rem' }} gap={'1rem'}>
        <EnableMIDIInput
          midiEnabled={isUsingMidi}
          setMidiEnabled={setUseMidi}
        />
        <MidiOutputSelector disabled={!isUsingMidi} />
        <ResetButton />
      </Stack>
    </Sheet>
  )
}

const EnableMIDIInput = ({
  midiEnabled,
  setMidiEnabled,
}: {
  midiEnabled: boolean
  setMidiEnabled: (x: boolean) => void
}) => {
  return (
    <FormControl
      orientation="horizontal"
      sx={{ justifyContent: 'space-between' }}
    >
      <Box sx={{ mr: 1 }}>
        <FormLabel id="midi-enabled-label" htmlFor="midi-enabled">
          Enable MIDI
        </FormLabel>
        <FormHelperText>
          When enabled, notes are sent to selected MIDI device instead of
          internal instruments.
        </FormHelperText>
      </Box>
      <Switch
        id="midi-enabled"
        checked={midiEnabled}
        onChange={(e) => setMidiEnabled(e.target.checked)}
      />
    </FormControl>
  )
}
const MidiOutputSelector = ({ disabled }: { disabled: boolean }) => {
  const { outputs, selectedOutputId, selectOutput } = useMIDIOutputs()
  return (
    <FormControl
      disabled={disabled}
      orientation="horizontal"
      sx={{ justifyContent: 'space-between' }}
    >
      <FormLabel id="midi-output-label" htmlFor="midi-output">
        MIDI Output
      </FormLabel>
      <Select
        id="midi-output"
        value={selectedOutputId}
        slotProps={{
          button: {
            id: 'midi-output',
            'aria-labelledby': 'midi-output-label midi-output',
          },
        }}
        onChange={(_, value) => selectOutput(value as string)}
      >
        {outputs.map((output) => (
          <Option key={output.id} value={output.id}>
            {output.name}
          </Option>
        ))}
      </Select>
    </FormControl>
  )
}

const ResetButton = () => {
  const resetSettings = useStore.use.resetSettings()
  return <Button onClick={resetSettings}>Reset</Button>
}
