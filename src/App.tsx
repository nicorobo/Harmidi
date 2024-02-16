import { MIDIProvider } from '@react-midi/hooks'
import { KeyboardListener } from './KeyboardListener'
import { Grid } from './components/Grid'
import { Box, Stack, CssBaseline } from '@mui/joy'
import { EngineProvider } from './use-engine'
import { SideNav } from './components/SideNav'

function App() {
  return (
    <MIDIProvider>
      <EngineProvider>
        <KeyboardListener />
        <CssBaseline />
        <Stack>
          <Stack direction={'row'}>
            <SideNav />
            <Box
              display="flex"
              justifyContent={'center'}
              alignItems={'center'}
              width={'100%'}
            >
              <Grid />
            </Box>
          </Stack>
        </Stack>
      </EngineProvider>
    </MIDIProvider>
  )
}

// AppSettings is a button that opens up a settings popup menu, used in the top right of the app
// The menu contains a switch for turning midi on and off, as well as a dropdown for selecting the midi output device

export default App
