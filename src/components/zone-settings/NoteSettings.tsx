import { Stack } from '@mui/joy'
import { NoteZoneSettings } from '../../zone-settings'
import {
  RootNoteInput,
  ScaleInput,
  SharedSettings,
  TranslateInput,
} from './SharedSettings'
import { useStore } from '../../store'
import { VoicesInput } from './VoicesInput'
import '../VoicesStyle.css'

const labels = [
  { value: -24, label: '-24st' },
  { value: -12, label: '-12st' },
  { value: 0, label: '0st' },
  { value: 12, label: '12st' },
  { value: 24, label: '24st' },
]

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
      <VoicesInput
        voices={settings.voices}
        min={-24}
        max={24}
        step={1}
        maxVoices={6}
        labels={labels}
        onChange={(voices) => onUpdate({ voices })}
      />
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
