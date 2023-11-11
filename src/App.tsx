import { MIDIProvider } from '@react-midi/hooks'
import { KeyboardListener } from './KeyboardListener'
import { Grid } from './components/Grid'
import { Box } from '@mui/material'
import { EngineProvider } from './Engine'

function App() {
  return (
    <MIDIProvider>
      <EngineProvider>
        <KeyboardListener />
        <Box display="flex" justifyContent={'center'} alignItems={'center'}>
          <Grid />
        </Box>
      </EngineProvider>
    </MIDIProvider>
  )
}

export default App
