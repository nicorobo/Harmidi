import {
  Box,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Option,
  Select,
  Sheet,
  Stack,
  Switch,
} from '@mui/joy'
import { useMIDIOutputs } from '@react-midi/hooks'
import { useStore } from '../store'

export const AppSettingsPanel = () => {
  const isUsingMidi = useStore.use.isUsingMidi()
  const setUseMidi = useStore.use.setUseMidi()
  const { outputs, selectedOutputId, selectOutput } = useMIDIOutputs()
  return (
    <Sheet sx={{ width: '350px', overflowY: 'auto' }}>
      <Box
        sx={{
          p: '0.5rem 1rem',
          background: '#eee',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ fontWeight: 'bold' }}>Settings</Box>
      </Box>
      <Stack sx={{ p: '1rem' }} gap={'1rem'}>
        <FormControl
          orientation="horizontal"
          sx={{ justifyContent: 'space-between' }}
        >
          <Box sx={{ mr: 1 }}>
            <FormLabel id="midi-enabled-label" htmlFor="midi-enabled">
              Enable MIDI
            </FormLabel>
            <FormHelperText>
              When MIDI is enabled, notes are sent to selected MIDI device
              instead of internal instruments.
            </FormHelperText>
          </Box>
          <Switch
            id="midi-enabled"
            checked={isUsingMidi}
            onChange={(e) => setUseMidi(e.target.checked)}
          />
        </FormControl>
        <FormControl
          disabled={!isUsingMidi}
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
      </Stack>
    </Sheet>
  )
}
// export const AppSettingsPanel = () => {
//     const appSettingsIsOpen = useStore.use.appSettingsIsOpen()
//     const setAppSettingsIsOpen = useStore.use.setAppSettingsIsOpen()
//     const isKeyMapping = useStore.use.isKeyMapping()
//     const setIsKeyMapping = useStore.use.setIsKeyMapping()
//     const midi = useMIDI()
//     const midiOutputs = midi.outputs
//     const selectedMidiOutput = midi.selectedOutput
//     const setSelectedMidiOutput = midi.setSelectedOutput
//     const midiEnabled = midi.enabled
//     const setMidiEnabled = midi.setEnabled
//     const close = () => {
//         setAppSettingsIsOpen(false)
//     }
//     const toggleMidi = () => {
//         setMidiEnabled(!midiEnabled)
//     }
//     const toggleKeyMapping = () => {
//         setIsKeyMapping(!isKeyMapping)
//     }
//     return (
//         <Dialog
//         open={appSettingsIsOpen}
//         onClose={close}
//         aria-labelledby="app-settings-dialog"
//         >
//         <DialogTitle id="app-settings-dialog">Settings</DialogTitle>
//         <DialogContent>
//             <FormControl>
//             <FormControlLabel
//             control={
//                 <Switch
//                 checked={midiEnabled}
//                 onChange={toggleMidi}
//                 name="midi-enabled"
//                 />
//             }
//             label="MIDI"
//             />
//             <FormControl>
//             <InputLabel id="midi-output-label">MIDI Output</InputLabel>
//             <Select
//                 labelId="midi-output-label"
//                 id="midi-output"
//                 value={selectedMidiOutput}
//                 onChange={(e) => setSelectedMidiOutput(e.target.value as string)}
//             >
//                 {midiOutputs.map((output) => (
//                 <MenuItem key={output.id} value={output.id}>
//                     {output.name}
//                 </MenuItem>
//                 ))}
//             </Select>
//             </FormControl>
//             <FormControlLabel
//             control={
//                 <Switch
//                 checked={isKeyMapping}
//                 onChange={toggleKeyMapping}
//                 name="key-mapping"
//                 />
//             }
//             label="Key Mapping"
//             />
//         </DialogContent>
//         <DialogActions>
//             <Button onClick={close}>Close</Button>
//         </DialogActions>
//         </Dialog>
//     )
// }
