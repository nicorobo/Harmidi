import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { StepperInput } from './StepperInput'

const DEFAULT_OCTAVE = 4

type Props = {
  octave: number
  onChange: (octaveOffset: number) => void
}

// OctaveInput treats an octave of 4 as the default, and allows an adjustment by plus/minus 3.
export const OctaveInput: React.FC<Props> = ({ octave, onChange }) => {
  return (
    <Stack>
      <InputLabel title="Octave" />
      <StepperInput
        value={octave - DEFAULT_OCTAVE}
        onChange={(val) => onChange(val + DEFAULT_OCTAVE)}
        resetValue={0}
        min={-3}
        max={3}
      />
    </Stack>
  )
}
