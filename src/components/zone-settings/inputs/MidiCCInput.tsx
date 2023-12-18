import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { NumberSelectInput } from './NumberSelectInput'

const midiCCs = new Array(80).fill(0).map((_, i) => i)
export const MidiCCInput = ({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Midi CC" />
      <NumberSelectInput value={value} options={midiCCs} onChange={onChange} />
    </Stack>
  )
}
