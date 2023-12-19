import { Stack, Switch } from '@mui/joy'
import { InputLabel } from './InputLabel'

type Props = {
  hold: boolean
  onChange: (hold: boolean) => void
}

export const HoldToggleInput: React.FC<Props> = ({ hold, onChange }) => {
  return (
    <Stack>
      <InputLabel title="Hold" />
      <Switch
        checked={hold}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
    </Stack>
  )
}
