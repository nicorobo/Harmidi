import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { NoteZoneGridInput } from './NoteZoneGridInput'

export const MuteZoneInput = ({
  muteZones,
  onChange,
}: {
  muteZones: string[]
  onChange: (muteZones: string[]) => void
}) => {
  return (
    <Stack>
      <InputLabel title="Mute Zones" />
      <NoteZoneGridInput value={muteZones} onChange={onChange} />
    </Stack>
  )
}
