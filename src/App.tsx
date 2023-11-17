import { MIDIProvider } from '@react-midi/hooks'
import { KeyboardListener } from './KeyboardListener'
import { Grid } from './components/Grid'
import { Box, Stack, CssBaseline } from '@mui/joy'
import { EngineProvider } from './Engine'
import { SideNav } from './components/SideNav'

function App() {
  return (
    <MIDIProvider>
      <EngineProvider>
        <KeyboardListener />
        <CssBaseline />
        <Stack direction={'row'}>
          <SideNav />
          <Box display="flex" justifyContent={'center'} alignItems={'center'}>
            <Grid />
          </Box>
        </Stack>
        {/* <SettingsBar /> */}
      </EngineProvider>
    </MIDIProvider>
  )
}

export default App
