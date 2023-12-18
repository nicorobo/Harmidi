import { Stack, Switch } from '@mui/joy'
import { InputLabel } from './InputLabel'

export const HoldToggleInput = ({
  value,
  onChange,
}: {
  value: boolean
  onChange: (hold: boolean) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Hold" />
      <Switch
        checked={value}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
    </Stack>
  )
}
