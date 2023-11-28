import { Stack } from '@mui/joy'
import { NoteZoneSettings } from '../../zone-settings'
import {
  ChannelInput,
  ChordInput,
  HoldToggleInput,
  MuteZoneInput,
  OcatveInput,
  QuantizeInput,
  RootNoteInput,
  ScaleInput,
  TranslateInput,
  VelocityInput,
} from './SharedSettings'
import { useStore } from '../../store'
import { VoicesInput } from './VoicesInput'

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
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent={'space-between'}>
          <ChannelInput
            channel={settings.channel}
            onChange={(channel) => onUpdate({ channel })}
          />
          <OcatveInput
            octaveOffset={settings.octave}
            onChange={(octave) => onUpdate({ octave })}
          />
          <TranslateInput
            value={settings.translate}
            onChange={(translate) => onUpdate({ translate })}
          />
        </Stack>
        <Stack direction="row" spacing={4}>
          <VelocityInput
            velocity={settings.velocity}
            onChange={(velocity) => onUpdate({ velocity })}
          />
          <MuteZoneInput
            muteZones={settings.muteZones}
            onChange={(muteZones) => onUpdate({ muteZones })}
          />
          <HoldToggleInput
            value={settings.hold}
            onChange={(hold) => onUpdate({ hold })}
          />
        </Stack>
      </Stack>
      <ChordInput onChange={(voices) => onUpdate({ voices })} />
      <VoicesInput
        voices={settings.voices}
        min={-24}
        max={24}
        maxVoices={6}
        labels={labels}
        onChange={(voices) => onUpdate({ voices })}
      />
      <QuantizeInput
        quantize={settings.quantize}
        onChange={(quantize) => onUpdate({ quantize })}
      />
      <Stack direction="row" spacing={2} justifyContent={'space-between'}>
        <RootNoteInput
          value={settings.root}
          onChange={(root) => onUpdate({ root })}
        />
        <ScaleInput
          value={settings.scaleType}
          onChange={(scaleType) => onUpdate({ scaleType })}
        />
      </Stack>
    </Stack>
  )
}
