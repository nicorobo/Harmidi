import { MIDIProvider } from '@react-midi/hooks'
import { KeyboardListener } from './KeyboardListenerAlt'
import { Grid } from './components/Grid'
import { Box } from '@mui/material'

function App() {
  return (
    <MIDIProvider>
      <KeyboardListener />
      <Box display="flex" justifyContent={'center'} alignItems={'center'}>
        <Grid />
      </Box>
    </MIDIProvider>
  )
}

export default App
