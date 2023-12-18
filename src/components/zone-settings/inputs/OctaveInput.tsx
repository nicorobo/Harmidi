import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { StepperInput } from './StepperInput'

export const OctaveInput = ({
  octaveOffset,
  onChange,
}: {
  octaveOffset: number
  onChange: (octaveOffset: number) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Octave" />
      <StepperInput
        value={octaveOffset - 4}
        onChange={(val) => onChange(val + 4)}
        resetValue={0}
        min={-3}
        max={3}
      />
    </Stack>
  )
}
