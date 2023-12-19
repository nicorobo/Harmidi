import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { NumberSelectInput } from './NumberSelectInput'

const channels = new Array(16).fill(0).map((_, i) => i + 1)

type Props = {
  channel: number
  onChange: (channel: number) => void
}

export const MidiChannelInput: React.FC<Props> = ({ channel, onChange }) => {
  return (
    <Stack>
      <InputLabel title="Channel" />
      <NumberSelectInput
        value={channel}
        options={channels}
        onChange={onChange}
      />
    </Stack>
  )
}
