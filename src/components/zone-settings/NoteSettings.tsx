import { Stack } from '@mui/joy'
import { NoteZoneSettings } from '../../zone-settings'
import {
  RootNoteInput,
  ScaleInput,
  SharedSettings,
  TranslateInput,
} from './SharedSettings'
import { useStore } from '../../store'

export const NoteSettings = ({
  settings,
  zoneIndex,
}: {
  settings: NoteZoneSettings
  zoneIndex: number
}) => {
  const updateZoneSettings = useStore((state) => state.updateZoneSettings)
  const onUpdate = (update: Partial<NoteZoneSettings>) => {
    updateZoneSettings(zoneIndex, { ...settings, ...update })
  }
  return (
    <Stack spacing={2}>
      <SharedSettings settings={settings} onUpdate={onUpdate} />
      <RootNoteInput
        value={settings.root}
        onChange={(root) => onUpdate({ root })}
      />
      <ScaleInput
        value={settings.scaleType}
        onChange={(scaleType) => onUpdate({ scaleType })}
      />
      <TranslateInput
        value={settings.translate}
        onChange={(translate) => onUpdate({ translate })}
      />
    </Stack>
  )
}
