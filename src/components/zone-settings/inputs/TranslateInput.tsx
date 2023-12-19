import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { StepperInput } from './StepperInput'

type Props = {
  translate: number
  onChange: (offset: number) => void
}
export const TranslateInput: React.FC<Props> = ({ translate, onChange }) => {
  return (
    <Stack>
      <InputLabel title="Translate" />
      <StepperInput
        value={translate}
        onChange={onChange}
        resetValue={0}
        min={-11}
        max={11}
      />
    </Stack>
  )
}
