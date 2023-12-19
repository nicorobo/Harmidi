import { Checkbox, Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { QuantizeSettings } from '../../../zone-settings'

type Props = {
  quantize: QuantizeSettings
  onChange: (value: QuantizeSettings) => void
}

export const QuantizeInput: React.FC<Props> = ({ quantize, onChange }) => {
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
