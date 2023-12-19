import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { NoteZoneGridInput } from './NoteZoneGridInput'

type Props = {
  muteZones: string[]
  onChange: (muteZones: string[]) => void
}

export const MuteZoneInput: React.FC<Props> = ({ muteZones, onChange }) => {
  return (
    <Stack>
      <InputLabel title="Mute Zones" />
      <NoteZoneGridInput zoneIds={muteZones} onChange={onChange} />
    </Stack>
  )
}
