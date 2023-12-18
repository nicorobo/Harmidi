import { Checkbox, Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'

type QuantizeSettings = { root: boolean; voices: boolean }
export const QuantizeInput = ({
  quantize,
  onChange,
}: {
  quantize: QuantizeSettings
  onChange: (value: QuantizeSettings) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Quantize" />
      <Stack direction={'row'} spacing={2}>
        <Checkbox
          label="Root"
          checked={quantize.root}
          onChange={(e) => onChange({ ...quantize, root: e.target.checked })}
        />
        <Checkbox
          label="Voices"
          checked={quantize.voices}
          onChange={(e) => onChange({ ...quantize, voices: e.target.checked })}
        />
      </Stack>
    </Stack>
  )
}
