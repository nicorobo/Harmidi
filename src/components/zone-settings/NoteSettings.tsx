import { Stack } from '@mui/joy'
import { NoteZone } from '../../zone-settings'
import {
  ChannelInput,
  ChordInput,
  HoldToggleInput,
  MuteZoneInput,
  OcatveInput,
  OrientationInput,
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

export const NoteSettings = ({ zone }: { zone: NoteZone }) => {
  const updateZoneSettings = useStore((state) => state.updateZone)
  const onUpdate = (update: Partial<NoteZone>) => {
    updateZoneSettings(zone.id, { ...zone, ...update })
  }
  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={4}>
          <OrientationInput
            value={zone.order}
            onChange={(orientation) => onUpdate({ order: orientation })}
          />
          <ChannelInput
            channel={zone.channel}
            onChange={(channel) => onUpdate({ channel })}
          />
          <HoldToggleInput
            value={zone.hold}
            onChange={(hold) => onUpdate({ hold })}
          />
        </Stack>
        <Stack direction="row" spacing={4}>
          <VelocityInput
            value={zone.velocity}
            onChange={(velocity) => onUpdate({ velocity })}
          />
          <OcatveInput
            octaveOffset={zone.octave}
            onChange={(octave) => onUpdate({ octave })}
          />
          <TranslateInput
            value={zone.translate}
            onChange={(translate) => onUpdate({ translate })}
          />
        </Stack>
        <Stack direction="row">
          <MuteZoneInput
            muteZones={zone.muteZones}
            onChange={(muteZones) => onUpdate({ muteZones })}
          />
        </Stack>
      </Stack>
      <ChordInput onChange={(voices) => onUpdate({ voices })} />
      <VoicesInput
        voices={zone.voices}
        min={-24}
        max={24}
        maxVoices={6}
        labels={labels}
        onChange={(voices) => onUpdate({ voices })}
      />
      <QuantizeInput
        quantize={zone.quantize}
        onChange={(quantize) => onUpdate({ quantize })}
      />
      <Stack direction="row" spacing={2} justifyContent={'space-between'}>
        <RootNoteInput
          value={zone.root}
          onChange={(root) => onUpdate({ root })}
        />
        <ScaleInput
          value={zone.scaleType}
          onChange={(scaleType) => onUpdate({ scaleType })}
        />
      </Stack>
    </Stack>
  )
}
