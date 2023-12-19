import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { NumberSelectInput } from './NumberSelectInput'

const midiCCs = new Array(80).fill(0).map((_, i) => i)

type Props = {
  midiCC: number
  onChange: (value: number) => void
}

export const MidiCCInput: React.FC<Props> = ({ midiCC, onChange }) => {
  return (
    <Stack>
      <InputLabel title="Midi CC" />
      <NumberSelectInput value={midiCC} options={midiCCs} onChange={onChange} />
    </Stack>
  )
}
