import { MIDIProvider } from '@react-midi/hooks'
import { KeyboardListener } from './KeyboardListener'
import { Grid } from './components/Grid'
import './App.css'

function App() {
  return (
    <MIDIProvider>
      <KeyboardListener />
      <Grid />
    </MIDIProvider>
  )
}

export default App
