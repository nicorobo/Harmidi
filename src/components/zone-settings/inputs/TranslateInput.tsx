import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { StepperInput } from './StepperInput'

export const TranslateInput = ({
  value,
  onChange,
}: {
  value: number
  onChange: (offset: number) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Translate" />
      <StepperInput
        value={value}
        onChange={onChange}
        resetValue={0}
        min={-11}
        max={11}
      />
    </Stack>
  )
}
