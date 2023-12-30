import { Stack } from '@mui/joy'
import { InputLabel } from './InputLabel'
import { NoteZoneGridInput } from './NoteZoneGridInput'

type Props = {
  muteZones: string[]
  selfId: string
  onChange: (muteZones: string[]) => void
}

export const MuteZoneInput: React.FC<Props> = ({
  muteZones,
  selfId,
  onChange,
}) => {
  return (
    <Stack>
      <InputLabel title="Mute Zones" />
      <NoteZoneGridInput
        specialZoneId={selfId}
        zoneIds={muteZones}
        onChange={onChange}
      />
    </Stack>
  )
}
