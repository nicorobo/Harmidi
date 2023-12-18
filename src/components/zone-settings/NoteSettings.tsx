import { Stack } from '@mui/joy'
import { NoteZone } from '../../zone-settings'
import { useStore } from '../../store'
import {
  HoldToggleInput,
  MidiChannelInput,
  MuteZoneInput,
  OctaveInput,
  OrderInput,
  QuantizeInput,
  ScaleInput,
  TranslateInput,
  VelocityInput,
  VoicesInput,
} from './inputs'

export const NoteSettings = ({ zone }: { zone: NoteZone }) => {
  const updateZoneSettings = useStore((state) => state.updateZone)
  const onUpdate = (update: Partial<NoteZone>) => {
    updateZoneSettings(zone.id, { ...zone, ...update })
  }
  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={4}>
          <MidiChannelInput
            channel={zone.channel}
            onChange={(channel) => onUpdate({ channel })}
          />
          <OrderInput
            value={zone.order}
            onChange={(orientation) => onUpdate({ order: orientation })}
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
          <OctaveInput
            octaveOffset={zone.octave}
            onChange={(octave) => onUpdate({ octave })}
          />
          <TranslateInput
            value={zone.translate}
            onChange={(translate) => onUpdate({ translate })}
          />
        </Stack>
        <MuteZoneInput
          muteZones={zone.muteZones}
          onChange={(muteZones) => onUpdate({ muteZones })}
        />
      </Stack>
      <VoicesInput
        voices={zone.voices}
        onChange={(voices) => onUpdate({ voices })}
      />
      <QuantizeInput
        quantize={zone.quantize}
        onChange={(quantize) => onUpdate({ quantize })}
      />
      <Stack direction="row" spacing={2} justifyContent={'space-between'}>
        <ScaleInput
          root={zone.root}
          scale={zone.scale}
          onChange={(root, scale) => onUpdate({ root, scale })}
        />
      </Stack>
    </Stack>
  )
}
